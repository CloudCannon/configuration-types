import fs from 'node:fs/promises';
import path from 'node:path';
import { load } from 'js-yaml';

export interface DocumentationEntry {
	title?: string;
	description?: string;
	examples?: string[];
}

export async function readDocs(): Promise<Record<string, DocumentationEntry>> {
	const docs: Record<string, DocumentationEntry> = {};
	const files = await fs.readdir(path.join(process.cwd(), 'docs/documentation'));

	for (let i = 0; i < files.length; i++) {
		if (files[i].endsWith('.yml')) {
			console.log('📄 Reading', files[i]);

			const content = await fs.readFile(path.join(process.cwd(), 'docs/documentation', files[i]), {
				encoding: 'utf8',
			});

			const parsed = load(content) as object;

			const keys = Object.keys(parsed);
			for (let j = 0; j < keys.length; j++) {
				if (keys[j] in docs) {
					throw new Error(`Duplicate doc ID: ${keys[j]}`);
				}

				docs[keys[j]] = parsed[keys[j]];
			}
		} else {
			console.log('Ignoring', files[i]);
		}
	}

	return docs;
}
