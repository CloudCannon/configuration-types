import { readFile, readdir } from 'node:fs/promises';
import { load } from 'js-yaml';

export interface DocumentationEntry {
	id?: string;
	name?: string;
	comment?: string;
	description?: string;
	examples?: string[];
	documentation_link?: string;
}

export const docs: Record<string, DocumentationEntry> = {};

try {
	const files = await readdir('./docs');
	for (const file of files) {
		if (file.endsWith('.yml')) {
			console.log('Reading', file);
			const content = await readFile(`./docs/${file}`, 'utf8');

			console.log('Parsing', file);
			const parsed = load(content) as object;

			const keys = Object.keys(parsed);
			for (let i = 0; i < keys.length; i++) {
				if (keys[i] in docs) {
					throw new Error(`Duplicate doc ID: ${keys[i]}`);
				}

				docs[keys[i]] = parsed[keys[i]];
				docs[keys[i]].id = keys[i];
			}
		} else {
			console.log('Ignoring', file);
		}
	}
} catch (err) {
	console.error(err);
}
