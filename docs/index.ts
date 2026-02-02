import fs from 'node:fs/promises';
import path from 'node:path';
import { moveOldDocs, readDocs, writeNewDocs } from './docs.js';
import {
	type DocumentationEntry,
	type JsonSchema,
	type Page,
	type PageRef,
	slugify,
} from './util.js';

// Schema configurations to process
const schemaConfigs = [
	{ filename: 'cloudcannon-config.documentation.schema.json' },
	{ filename: 'cloudcannon-routing.documentation.schema.json' },
	{ filename: 'cloudcannon-initial-site-settings.documentation.schema.json' },
];

const documentationEntries: Record<string, DocumentationEntry> = await readDocs();
const attemptedGids: Set<string> = new Set();
const untitledGids: Set<string> = new Set();
const pages: Record<string, Page> = {};

// Current schema being processed (set before processing each schema)
let currentSchema: JsonSchema;

function deref(doc: JsonSchema): JsonSchema {
	if (typeof doc !== 'object') {
		return doc;
	}

	if (doc?.$ref && currentSchema.$defs) {
		const refDoc = deref(currentSchema.$defs[doc.$ref.replace('#/$defs/', '')]);

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

	flattenNestedAnyOf(doc);
	return doc;
}

function flattenNestedAnyOf(doc: JsonSchema): void {
	if (doc?.anyOf) {
		const anyOf: JsonSchema[] = [];

		const add = (item: JsonSchema): void => {
			if (!item.excludeFromDocumentation) {
				anyOf.push(item);
			}
		};

		for (let i = 0; i < doc.anyOf.length; i++) {
			deref(doc.anyOf[i]);

			const docAnyOf = doc.anyOf[i]?.anyOf;
			if (Array.isArray(docAnyOf)) {
				for (let j = 0; j < docAnyOf.length; j++) {
					deref(docAnyOf[j]);
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

function getDocumentationEntry(gid: string): DocumentationEntry {
	attemptedGids.add(gid);
	return documentationEntries[gid];
}

function getDisplayKey(fullKey: string): string | undefined {
	const parts = fullKey.split('.');
	const key = parts.pop();
	return key === '*' ? `${parts.pop()}.*` : key;
}

function docToPage(
	doc: JsonSchema,
	{
		path,
		key,
		parent,
		required,
	}: { path: string[]; key?: string; parent?: string; required?: boolean }
): Page | undefined {
	if (!Object.keys(doc).length) {
		return;
	}

	const isType = doc.id?.startsWith('type.');
	let thisPath = isType ? [doc.id || ''] : key ? [...path, key] : [...path];
	let baseGid = thisPath.join('.');

	// Handle root type entries for each schema type
	if (doc.id === 'type.Configuration') {
		thisPath = [];
		baseGid = 'type.Configuration';
	} else if (doc.id === 'type.Routing') {
		thisPath = [];
		baseGid = 'type.Routing';
	} else if (doc.id === 'type.InitialSiteSettings') {
		thisPath = [];
		baseGid = 'type.InitialSiteSettings';
	}

	const gid = baseGid;

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

	const documentation = getDocumentationEntry(gid);
	const developer_documentation = {
		title: doc.title,
		description: doc.description,
		examples: doc.examples
			?.filter((example) => typeof example === 'string')
			.map((code) => ({ code })),
	};

	const page: Page = {
		gid,
		title: documentation?.title,
		description: documentation?.description || doc.description,
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
		url: !thisPath.length
			? '/'
			: `/${thisPath
					.join('/')
					.replace(/^type\./, 'types/')
					.replaceAll('.', '/')}/`.replace(/\/+/g, '/'),
		required: !!required,
		key: getDisplayKey(full_key) || full_key,
		full_key,
		parent: isType ? undefined : parent,
		appears_in: isType && parent ? [parent] : [],
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

			deref(item);

			if (item.excludeFromDocumentation) {
				continue;
			}

			const itemKey =
				items.length === 1 ? '[*]' : `(${slugify(item.title || item.id || `item-${i}`)})`;

			if (itemKey.startsWith('(item-')) {
				untitledGids.add(`${gid}.${itemKey}`);
			}

			const itemPage = docToPage(item, {
				parent: gid,
				path: thisPath,
				key: itemKey,
			});

			const pageRef: PageRef = itemPage?.gid
				? { gid: itemPage.gid }
				: { type: item.type || 'unknown' };

			page.items.push(pageRef);
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

			deref(property);

			if (property.excludeFromDocumentation) {
				continue;
			}

			const propPage = docToPage(property, {
				parent: gid,
				path: thisPath,
				key: propKey,
				required: !!doc.required?.includes(propKey),
			});

			const pageRef: PageRef = propPage?.gid
				? { gid: propPage.gid }
				: { type: property.type || 'unknown' };

			page.properties[propKey] = pageRef;
		}
	}

	if (doc.additionalProperties) {
		page.additionalProperties = [];

		const additionalProperties = Array.isArray(doc.additionalProperties)
			? doc.additionalProperties
			: [doc.additionalProperties];

		for (let i = 0; i < additionalProperties.length; i++) {
			deref(additionalProperties[i]);

			if (additionalProperties[i].excludeFromDocumentation) {
				continue;
			}

			const additionalPropertyKey =
				additionalProperties.length === 1
					? '*'
					: `(${slugify(additionalProperties[i].title || additionalProperties[i].id || `additional-property-${i}`)})`;

			if (additionalPropertyKey.startsWith('(additional-property-')) {
				untitledGids.add(`${gid}.${additionalPropertyKey}`);
			}

			const additionalPropertyPage = docToPage(additionalProperties[i], {
				parent: gid,
				path: thisPath,
				key: additionalPropertyKey,
			});

			const pageRef: PageRef = additionalPropertyPage?.gid
				? { gid: additionalPropertyPage.gid }
				: { type: additionalProperties[i].type || 'unknown' };

			page.additionalProperties.push(pageRef);
		}
	}

	if (doc.anyOf) {
		page.anyOf = [];

		for (let i = 0; i < doc.anyOf.length; i++) {
			deref(doc.anyOf[i]);

			// Skip unnamed const values (simple enum literals) - they don't need their own pages
			// But keep named const values (with id/title) as they have documentation
			if (doc.anyOf[i].const !== undefined && !doc.anyOf[i].id && !doc.anyOf[i].title) {
				page.anyOf.push({ type: String(doc.anyOf[i].const) });
				continue;
			}

			const anyOfKey = `(${slugify(doc.anyOf[i].title || doc.anyOf[i].id || `any-of-${i}`)})`;

			if (anyOfKey.startsWith('(any-of-')) {
				untitledGids.add(`${gid}.${anyOfKey}`);
			}

			const anyOfPage = docToPage(doc.anyOf[i], {
				parent: gid,
				path: thisPath,
				key: anyOfKey,
			});

			const pageRef: PageRef = anyOfPage?.gid
				? { gid: anyOfPage.gid }
				: { type: doc.anyOf[i].type || 'unknown' };

			page.anyOf.push(pageRef);
		}
	}

	// TODO: handle doc.allOf, although there are not currently any instances of this in the schema.

	return page;
}

// Process each schema configuration
for (const config of schemaConfigs) {
	const schemaPath = path.join(process.cwd(), 'dist', config.filename);
	
	// Check if schema file exists (routing and ISS schemas may not exist yet)
	try {
		await fs.access(schemaPath);
	} catch {
		console.log(`⏭️  Skipping ${config.filename} (not found)`);
		continue;
	}

	const schemaRaw: string = await fs.readFile(schemaPath, { encoding: 'utf8' });
	currentSchema = JSON.parse(schemaRaw);

	console.log(`📖 Processing ${config.filename}`);
	docToPage(currentSchema, { path: [] });
}

console.log('📝 Write to dist/documentation.json');

await fs.writeFile(
	path.join(process.cwd(), 'dist/documentation.json'),
	JSON.stringify(pages, null, '  ')
);

if (untitledGids.size) {
	console.error(
		[
			`🔠 \x1b[31mNeeds developer title (${untitledGids.size})\x1b[0m`, // Red text
			...untitledGids.values(),
		].join('\n     ')
	);
}

await moveOldDocs(attemptedGids);
await writeNewDocs(attemptedGids, pages);
