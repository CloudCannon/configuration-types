import fs from 'node:fs/promises';
import path from 'node:path';
import { dump, load } from 'js-yaml';
import { type DocumentationEntry, type Page, verbose } from './util';

export async function readDocs(): Promise<Record<string, DocumentationEntry>> {
	const docs: Record<string, DocumentationEntry> = {};
	const files = await fs.readdir(path.join(process.cwd(), 'docs/documentation'));

	console.log(`📄 Reading (${files.length})`);

	for (let i = 0; i < files.length; i++) {
		if (files[i].endsWith('.yml')) {
			if (verbose) {
				console.log(`     ${files[i]}`);
			}

			const content = await fs.readFile(path.join(process.cwd(), 'docs/documentation', files[i]), {
				encoding: 'utf8',
			});

			const parsed = load(content) as DocumentationEntry & { gid: string };
			if (parsed.gid in docs) {
				throw new Error(`Duplicate doc GID: ${parsed.gid}`);
			}

			docs[parsed.gid] = parsed;
		} else if (verbose) {
			console.log(`     🚫 ${files[i]}`);
		}
	}

	return docs;
}

export async function writeDocs(gids: Set<string>, pages: Record<string, Page>): Promise<void> {
	const pageFiles: any[] = [];

	gids.forEach((gid) => {
		pageFiles.push({
			gid,
			url: pages[gid]?.url,
			title: pages[gid]?.title || '',
			description: pages[gid]?.description || '',
			examples: pages[gid]?.examples || [],
		});
	});

	await fs.mkdir(path.join(process.cwd(), 'docs/documentation'), { recursive: true });

	for (let i = 0; i < pageFiles.length; i++) {
		const pageFile = pageFiles[i];
		await fs.writeFile(
			path.join(process.cwd(), 'docs/documentation', `${pageFile.gid}.yml`),
			dump(pageFile, { noRefs: true })
		);
	}
}
