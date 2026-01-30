import fs from 'node:fs/promises';
import { readDocs } from './docs/docs.js';
import { type DocumentationEntry, type JsonSchema, slugify } from './docs/util.js';

const documentationEntries: Record<string, DocumentationEntry> = await readDocs();

export async function redocumentSchema(
	fullSchemaPath: string,
	options?: { stripId?: boolean; addMarkdownDescription?: boolean }
): Promise<void> {
	const schemaRaw: string = await fs.readFile(fullSchemaPath, { encoding: 'utf8' });
	const schema: JsonSchema = JSON.parse(schemaRaw);

	function getDisplayKey(fullKey: string): string | undefined {
		const parts = fullKey.split('.');
		const key = parts.pop();
		return key === '*' ? `${parts.pop()}.*` : key;
	}

	function deref(doc: JsonSchema, ignoreCircular: boolean = false): JsonSchema | undefined {
		// JSON Schema versions after draft 7
		while (doc?.$ref && schema.$defs) {
			const ref = doc.$ref.replace('#/$defs/', '');
			doc = schema.$defs[ref];
		}

		// JSON Schema draft 7
		while (doc?.$ref && schema.definitions) {
			const ref = doc.$ref.replace('#/definitions/', '');
			doc = (schema as any).definitions[ref];
		}

		// Prevents some circular references
		if (!ignoreCircular && Object.hasOwn(doc, 'documented')) {
			return;
		}

		return doc;
	}

	function walk(doc: JsonSchema | undefined, parent: { path: string[]; key?: string }): void {
		if (!doc || !Object.keys(doc).length || doc.documented) {
			return;
		}

		let path = doc.id?.startsWith('type.')
			? [doc.id || '']
			: parent.key
				? [...parent.path, parent.key]
				: [...parent.path];
		let gid = path.join('.').replace('.(known-input)', '');

		if (doc.id === 'type.Configuration') {
			path = [];
			gid = 'type.Configuration';
		}

		if (options?.stripId && doc.id) {
			// AJV (Node JSONSchema library) errors when 'id' is present in non draft-04 schemas.
			delete doc.id;
		}

		const documentation = documentationEntries[gid];
		doc.documented = !!documentation;

		if (documentation?.title) {
			doc.title = documentation.title;
		} else if (!doc.title) {
			const fullKey = path
				.join('.')
				.replace(/^type\./, '')
				.replaceAll('.[', '[')
				.replaceAll('.(', '(');

			doc.title = getDisplayKey(fullKey);
		}

		if (documentation?.description) {
			doc.description = documentation.description;
		}

		if (documentation?.examples?.length) {
			// This adds examples to the description rather than the examples field, since that can't handle
			// descriptions or language, and stringifies YAML formatting into the visible text.
			doc.description ||= '';

			if (doc.description) {
				doc.description += '\n\n';
			}

			doc.description += '## Examples';

			for (let i = 0; i < documentation.examples.length; i++) {
				const example = documentation.examples[i];

				if (example.description) {
					doc.description += '\n\n';
					doc.description += example.description?.trim();
				}

				if (example.code) {
					doc.description += '\n\n';
					doc.description += `\`\`\`${example.language?.trim() || ''}\n${example.code?.trim()}\n\`\`\``;
				}
			}
		}

		if (doc.description) {
			// Fix internal links
			doc.description = doc.description.replaceAll(
				'](/documentation/',
				'](https://cloudcannon.com/documentation/'
			);
		}

		if (options?.addMarkdownDescription && doc.description) {
			doc.markdownDescription = doc.description;
		}

		if (doc.items) {
			const items = Array.isArray(doc.items) ? doc.items : [doc.items];

			for (let i = 0; i < items.length; i++) {
				const item = items[i];
				if (typeof item !== 'object') {
					continue;
				}

				const derefDoc = deref(item);
				const itemKey =
					items.length === 1
						? '[*]'
						: `(${slugify(derefDoc?.title || derefDoc?.id || `item-${i}`)})`;
				walk(derefDoc, { path, key: itemKey });
			}
		}

		if (doc.properties) {
			const keys = Object.keys(doc.properties);
			for (let i = 0; i < keys.length; i++) {
				const key = keys[i];
				const property = doc.properties[key];
				if (typeof property !== 'object') {
					continue;
				}

				walk(deref(property), { path, key });
			}
		}

		if (doc.additionalProperties) {
			const additionalProperties = Array.isArray(doc.additionalProperties)
				? doc.additionalProperties
				: [doc.additionalProperties];

			for (let i = 0; i < additionalProperties.length; i++) {
				const derefDoc = deref(additionalProperties[i]);
				const key =
					additionalProperties.length === 1
						? '*'
						: `(${slugify(derefDoc?.title || derefDoc?.id || `additional-property-${i}`)})`;
				walk(derefDoc, { path, key });
			}
		}

		if (doc.anyOf) {
			for (let i = 0; i < doc.anyOf.length; i++) {
				const derefDoc = deref(doc.anyOf[i]);
				const key =
					!path.length && derefDoc?.id
						? derefDoc.id
						: `(${slugify(derefDoc?.title || derefDoc?.id || `any-of-${i}`)})`;
				walk(derefDoc, { path, key });
			}
		}

		if (doc.allOf) {
			for (let i = 0; i < doc.allOf.length; i++) {
				const derefDoc = deref(doc.allOf[i]);
				const key =
					!path.length && derefDoc?.id
						? derefDoc.id
						: `(${slugify(derefDoc?.title || derefDoc?.id || `all-of-${i}`)})`;
				walk(derefDoc, { path, key });
			}
		}

		if (doc.oneOf) {
			for (let i = 0; i < doc.oneOf.length; i++) {
				const derefDoc = deref(doc.oneOf[i]);
				const key =
					!path.length && derefDoc?.id
						? derefDoc.id
						: `(${slugify(derefDoc?.title || derefDoc?.id || `one-of-${i}`)})`;
				walk(derefDoc, { path, key });
			}
		}
	}

	walk(schema, { path: [], key: schema.id });

	await fs.writeFile(fullSchemaPath, JSON.stringify(schema, null, '  '));
}
