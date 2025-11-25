import fs from 'node:fs/promises';
import path from 'node:path';
import { readDocs, writeDocs } from './docs.js';
import { type JsonSchema, type Page, type PageRef, slugify, verbose } from './util.js';

const schemaRaw = await fs.readFile(
	path.join(process.cwd(), 'dist/cloudcannon-config.documentation.schema.json'),
	{ encoding: 'utf8' }
);
const schema = JSON.parse(schemaRaw);
const documentationEntries = await readDocs();
const existingDocumentationKeys = new Set(Object.keys(documentationEntries));
const attemptedDocumentationKeys: Set<string> = new Set();
const untitledGids: Set<string> = new Set();
const pages: Record<string, Page> = {};

function deref(doc: JsonSchema): JsonSchema {
	if (typeof doc !== 'object') {
		return doc;
	}

	if (doc?.$ref) {
		const refDoc = deref(schema.$defs[doc.$ref.replace('#/$defs/', '')]);

		Object.keys(refDoc).forEach((key) => {
			if (doc[key] === undefined) {
				doc[key] = refDoc[key];
			}
		});
	}

	flattenNestedAnyOf(doc);
	return doc;
}

function flattenNestedAnyOf(doc: JsonSchema) {
	if (doc?.anyOf) {
		const anyOf: JsonSchema[] = [];

		for (let i = 0; i < doc.anyOf.length; i++) {
			flattenNestedAnyOf(doc.anyOf[i]);

			const docAnyOf = doc.anyOf[i]?.anyOf;
			if (Array.isArray(docAnyOf)) {
				anyOf.push(...docAnyOf);
			} else {
				anyOf.push(doc.anyOf[i]);
			}
		}

		doc.anyOf = anyOf;
	}
}

function getDocumentationEntry(gid: string) {
	attemptedDocumentationKeys.add(gid);
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
	let gid = thisPath.join('.');

	if (doc.id === 'type.Configuration') {
		thisPath = [];
		gid = 'type.Configuration';
	}

	const seenPage = pages[gid];

	if (seenPage) {
		if (parent && !seenPage.appears_in.includes(parent)) {
			seenPage.appears_in.push(parent);
		}

		return seenPage;
	}

	const full_key = thisPath.join('.').replaceAll('.[', '[').replaceAll('.(', '(');
	const displayKey = getDisplayKey(full_key);
	const url = !thisPath.length ? '/' : `/${thisPath.join('/')}/`;
	const documentation = getDocumentationEntry(gid);
	const developer_documentation = {
		title: doc.title,
		description: doc.description,
		examples: doc.examples?.filter((example) => typeof example === 'string'),
	};

	const page: Page = {
		gid,
		title: documentation?.title || doc.title,
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
		url,
		required: !!required,
		key: displayKey || full_key,
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

			const propPage = docToPage(property, {
				parent: gid,
				path: thisPath,
				key: propKey,
				required: !!doc.required?.includes(propKey),
			});

			const pageRef: PageRef = propPage?.gid
				? { gid: propPage.gid }
				: { type: property.type || 'unknown' };

			if (property.id?.startsWith('type.')) {
				const propGid = thisPath.concat([propKey]).join('.');
				pageRef.documentation = getDocumentationEntry(propGid);
			}

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

docToPage(schema, { path: [] });

await fs.writeFile(
	path.join(process.cwd(), 'dist/documentation.json'),
	JSON.stringify(pages, null, '  ')
);
console.log('✅ dist/documentation.json');

// @ts-ignore
const documented = existingDocumentationKeys.intersection(attemptedDocumentationKeys);
// @ts-ignore
const undocumented = attemptedDocumentationKeys.difference(existingDocumentationKeys);
// @ts-ignore
const unused = existingDocumentationKeys.difference(attemptedDocumentationKeys);

const separator = '\n     ';

console.log(
	[`✅ Documented (${documented.size})`, ...(verbose ? documented.values() : [])].join(separator)
);

console.log(
	[`✏️ New (${undocumented.size})`, ...(verbose ? undocumented.values() : [])].join(separator)
);

console.log(
	[`💣 Stale/unused (${unused.size})`, ...(verbose ? unused.values() : [])].join(separator)
);

console.log(
	[`🔠 Untitled (${untitledGids.size})`, ...(verbose ? untitledGids.values() : [])].join(separator)
);

await writeDocs(attemptedDocumentationKeys, pages);
console.log('✅ docs/documentation/*.yml');
