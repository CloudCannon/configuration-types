import fs from 'node:fs/promises';
import path from 'node:path';
import { moveOldDocs, readDocs, writeNewDocs } from './docs.js';
import { type DocSchemaConfig, docSchemas } from './schema-registry.js';
import {
	type DocumentationEntry,
	type JsonSchema,
	type Page,
	type PageRef,
	slugify,
} from './util.js';

interface ProcessContext {
	schema: JsonSchema;
	config: DocSchemaConfig;
	documentationEntries: Record<string, DocumentationEntry>;
	attemptedGids: Set<string>;
	untitledGids: Set<string>;
	pages: Record<string, Page>;
}

function deref(doc: JsonSchema, schema: JsonSchema): JsonSchema {
	if (typeof doc !== 'object') {
		return doc;
	}

	if (doc?.$ref && schema.$defs) {
		const refDoc = deref(schema.$defs[doc.$ref.replace('#/$defs/', '')], schema);

		Object.keys(refDoc).forEach((key) => {
			if (doc[key] === undefined) {
				doc[key] = refDoc[key];
			}
		});
	}

	// A workaround, but these are essentially the same for the docs.
	if (doc.oneOf && !doc.anyOf) {
		doc.anyOf = doc.oneOf;
		delete doc.oneOf;
	}

	flattenNestedAnyOf(doc, schema);
	return doc;
}

function flattenNestedAnyOf(doc: JsonSchema, schema: JsonSchema): void {
	if (doc?.anyOf) {
		const anyOf: JsonSchema[] = [];

		const add = (item: JsonSchema): void => {
			if (!item.excludeFromDocumentation) {
				anyOf.push(item);
			}
		};

		for (let i = 0; i < doc.anyOf.length; i++) {
			deref(doc.anyOf[i], schema);

			const docAnyOf = doc.anyOf[i]?.anyOf;
			if (Array.isArray(docAnyOf)) {
				for (let j = 0; j < docAnyOf.length; j++) {
					deref(docAnyOf[j], schema);
					add(docAnyOf[j]);
				}
			} else {
				add(doc.anyOf[i]);
			}
		}

		if (anyOf.length === 0) {
			delete doc.anyOf;
		} else if (anyOf.length === 1) {
			Object.assign(doc, anyOf[0]);
		} else {
			doc.anyOf = anyOf;
		}
	}
}

function getDocumentationEntry(gid: string, ctx: ProcessContext): DocumentationEntry | undefined {
	ctx.attemptedGids.add(gid);
	return ctx.documentationEntries[gid];
}

function buildPageRef(
	resolvedPage: Page | undefined,
	fallbackType: string,
	contextualGid: string,
	ctx: ProcessContext
): PageRef {
	const pageRef: PageRef = resolvedPage?.gid
		? { gid: resolvedPage.gid }
		: { type: fallbackType };

	// When a reference resolves (dedupes) to a shared type page — e.g.
	// `is_target_blank` resolving to `type._inputs.*.(boolean-input)` — it
	// inherits that type's documentation, including its examples. Authoring a
	// YAML file at the contextual path gid (e.g.
	// `type._editables.*.link_options.is_target_blank`) lets us override the
	// examples/title/description for just this reference, without removing or
	// duplicating the shared type.
	if ('gid' in pageRef && pageRef.gid !== contextualGid) {
		const override = ctx.documentationEntries[contextualGid];
		if (override) {
			ctx.attemptedGids.add(contextualGid);
			pageRef.documentation = override;
		}
	}

	return pageRef;
}

function getDisplayKey(fullKey: string): string | undefined {
	const parts = fullKey.split('.');
	const key = parts.pop();
	return key === '*' ? `${parts.pop()}.*` : key;
}

function docToPage(
	doc: JsonSchema,
	{
		path: docPath,
		key,
		parent,
		required,
	}: { path: string[]; key?: string; parent?: string; required?: boolean },
	ctx: ProcessContext
): Page | undefined {
	if (!Object.keys(doc).length) {
		return;
	}

	const { config, pages } = ctx;

	const id = doc.id ?? doc.$ref?.replace('#/$defs/', '');
	const isRootType = id === config.rootTypeId;
	const isTypeRef = id?.startsWith('type.') && !isRootType;

	let thisPath: string[];
	let gid: string;

	if (isRootType) {
		thisPath = [];
		gid = config.rootTypeId;
	} else if (isTypeRef && id) {
		thisPath = [id];
		gid = id;
	} else if (key) {
		thisPath = [...docPath, key];
		gid = thisPath.join('.');
	} else {
		thisPath = [...docPath];
		gid = thisPath.join('.');
	}

	const seenPage = pages[gid];

	if (seenPage) {
		if (parent && !seenPage.appears_in.includes(parent)) {
			seenPage.appears_in.push(parent);
		}

		return seenPage;
	}

	const full_key = thisPath
		.join('.')
		.replace(/^type\./, '')
		.replaceAll('.[', '[')
		.replaceAll('.(', '(');

	const documentation = getDocumentationEntry(gid, ctx);
	const developer_documentation = {
		title: doc.title,
		description: doc.description,
		examples: doc.examples
			?.filter((example) => typeof example === 'string')
			.map((code) => ({ code })),
	};

	let url: string;
	if (!thisPath.length) {
		url = config.urlPrefix;
	} else {
		url = `${config.urlPrefix}${thisPath
			.join('/')
			.replace(/^type\./, 'types/')
			.replaceAll('.', '/')}/`.replace(/\/+/g, '/');
	}

	const page: Page = {
		gid,
		title: documentation?.title,
		description: documentation?.description || doc.description,
		deprecated: !!doc.deprecated,
		deprecated_description: documentation?.deprecated_description,
		examples: documentation?.examples?.length
			? documentation.examples
			: developer_documentation?.examples,
		type: doc.documentationType || doc.type,
		default: doc.default,
		enum: doc.enum,
		const: doc.const,
		uniqueItems: doc.uniqueItems,
		documentation,
		developer_documentation,
		url,
		required: !!required,
		key: getDisplayKey(full_key) || full_key,
		full_key,
		parent: isRootType || isTypeRef ? undefined : parent,
		appears_in: (isRootType || isTypeRef) && parent ? [parent] : [],
	};

	pages[gid] = page;

	if (doc.items) {
		page.items = [];
		const items = Array.isArray(doc.items) ? doc.items : [doc.items];

		for (let i = 0; i < items.length; i++) {
			const item = items[i];
			if (typeof item !== 'object') {
				continue;
			}

			deref(item, ctx.schema);

			if (item.excludeFromDocumentation) {
				continue;
			}

			const itemKey =
				items.length === 1 ? '[*]' : `(${slugify(item.title || item.id || `item-${i}`)})`;

			if (itemKey.startsWith('(item-')) {
				ctx.untitledGids.add(`${gid}.${itemKey}`);
			}

			const itemPage = docToPage(
				item,
				{
					parent: gid,
					path: thisPath,
					key: itemKey,
				},
				ctx
			);

			page.items.push(
				buildPageRef(itemPage, item.type || 'unknown', [...thisPath, itemKey].join('.'), ctx)
			);
		}
	}

	if (doc.properties) {
		page.properties = {};

		const keys = Object.keys(doc.properties);
		for (let i = 0; i < keys.length; i++) {
			const propKey = keys[i];
			const property = doc.properties[propKey];
			if (typeof property !== 'object') {
				continue;
			}

			deref(property, ctx.schema);

			if (property.excludeFromDocumentation) {
				continue;
			}

			const propPage = docToPage(
				property,
				{
					parent: gid,
					path: thisPath,
					key: propKey,
					required: !!doc.required?.includes(propKey),
				},
				ctx
			);

			page.properties[propKey] = buildPageRef(
				propPage,
				property.type || 'unknown',
				[...thisPath, propKey].join('.'),
				ctx
			);
		}
	}

	if (doc.additionalProperties) {
		page.additionalProperties = [];

		const additionalProperties = Array.isArray(doc.additionalProperties)
			? doc.additionalProperties
			: [doc.additionalProperties];

		for (let i = 0; i < additionalProperties.length; i++) {
			deref(additionalProperties[i], ctx.schema);

			if (additionalProperties[i].excludeFromDocumentation) {
				continue;
			}

			const additionalPropertyKey =
				additionalProperties.length === 1
					? '*'
					: `(${slugify(additionalProperties[i].title || additionalProperties[i].id || `additional-property-${i}`)})`;

			if (additionalPropertyKey.startsWith('(additional-property-')) {
				ctx.untitledGids.add(`${gid}.${additionalPropertyKey}`);
			}

			const additionalPropertyPage = docToPage(
				additionalProperties[i],
				{
					parent: gid,
					path: thisPath,
					key: additionalPropertyKey,
				},
				ctx
			);

			page.additionalProperties.push(
				buildPageRef(
					additionalPropertyPage,
					additionalProperties[i].type || 'unknown',
					[...thisPath, additionalPropertyKey].join('.'),
					ctx
				)
			);
		}
	}

	if (doc.anyOf) {
		page.anyOf = [];

		for (let i = 0; i < doc.anyOf.length; i++) {
			deref(doc.anyOf[i], ctx.schema);

			const anyOfKey = `(${slugify(doc.anyOf[i].title || doc.anyOf[i].id || `any-of-${i}`)})`;

			if (anyOfKey.startsWith('(any-of-')) {
				ctx.untitledGids.add(`${gid}.${anyOfKey}`);
			}

			const anyOfPage = docToPage(
				doc.anyOf[i],
				{
					parent: gid,
					path: thisPath,
					key: anyOfKey,
				},
				ctx
			);

			page.anyOf.push(
				buildPageRef(
					anyOfPage,
					doc.anyOf[i].type || 'unknown',
					[...thisPath, anyOfKey].join('.'),
					ctx
				)
			);
		}
	}

	// TODO: handle doc.allOf, although there are not currently any instances of this in the schema.

	return page;
}

async function processSchema(config: DocSchemaConfig): Promise<{
	pages: Record<string, Page>;
	attemptedGids: Set<string>;
	untitledGids: Set<string>;
}> {
	console.log(`\n📖 Processing ${config.name}`);

	const schemaPath = path.join(process.cwd(), 'dist', config.schemaFile);
	const schemaRaw = await fs.readFile(schemaPath, { encoding: 'utf8' });
	const schema: JsonSchema = JSON.parse(schemaRaw);

	const documentationEntries = await readDocs(config.docsFolder);

	const ctx: ProcessContext = {
		schema,
		config,
		documentationEntries,
		attemptedGids: new Set(),
		untitledGids: new Set(),
		pages: {},
	};

	schema.id ??= config.rootTypeId;
	docToPage(schema, { path: [] }, ctx);

	if (ctx.untitledGids.size) {
		console.error(
			[
				`🔠 \x1b[31mNeeds developer title (${ctx.untitledGids.size})\x1b[0m`,
				...ctx.untitledGids.values(),
			].join('\n     ')
		);
	}

	await moveOldDocs(config.docsFolder, ctx.attemptedGids);
	await writeNewDocs(config.docsFolder, ctx.attemptedGids, ctx.pages, ctx.documentationEntries);

	return {
		pages: ctx.pages,
		attemptedGids: ctx.attemptedGids,
		untitledGids: ctx.untitledGids,
	};
}

const allPages: Record<string, Record<string, Page>> = {};

for (const config of docSchemas) {
	const result = await processSchema(config);
	allPages[config.rootTypeId] = result.pages;
}

console.log('\n📝 Write to dist/documentation.json');
await fs.writeFile(
	path.join(process.cwd(), 'dist/documentation.json'),
	JSON.stringify(allPages, null, '  ')
);
