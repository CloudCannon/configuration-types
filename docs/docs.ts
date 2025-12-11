import fs from 'node:fs/promises';
import path from 'node:path';
import { dump, load } from 'js-yaml';
import { type DocumentationEntry, type Page, verbose } from './util';

export async function readDocs(): Promise<Record<string, DocumentationEntry>> {
	const docs: Record<string, DocumentationEntry> = {};
	const files = await fs.readdir(path.join(process.cwd(), 'docs/documentation'));

	console.log(`📄 Read from docs/documentation/*.yml (${files.length})`);

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

export async function moveOldDocs(gidsInUse: Set<string>): Promise<void> {
	const allFiles = await fs.readdir(path.join(process.cwd(), 'docs/documentation'));
	const files = allFiles.filter(
		(file) => file.endsWith('.yml') && !gidsInUse.has(file.replace(/\.yml$/, ''))
	);

	await fs.mkdir(path.join(process.cwd(), 'docs/documentation-unused'), { recursive: true });

	console.log(`🚚 Move to docs/documentation-unused/*.yml (${files.length})`);

	for (let i = 0; i < files.length; i++) {
		if (verbose) {
			console.log(`     ${files[i]}`);
		}

		await fs.rename(
			path.join(process.cwd(), 'docs/documentation', files[i]),
			path.join(process.cwd(), 'docs/documentation-unused', files[i])
		);
	}
}

export async function writeNewDocs(gids: Set<string>, pages: Record<string, Page>): Promise<void> {
	const pageFiles: any[] = [];

	const files = await fs.readdir(path.join(process.cwd(), 'docs/documentation'));
	const existingGids = files.reduce((memo: Record<string, boolean>, file) => {
		memo[file.replace(/\.yml$/, '')] = true;
		return memo;
	}, {});

	let newCount = 0;
	let updatedCount = 0;

	console.log(`📝 Write to docs/documentation/*.yml (${gids.size})`);

	gids.forEach((gid) => {
		if (existingGids[gid]) {
			updatedCount++;
		} else {
			newCount++;
		}

		pageFiles.push({
			gid,
			url: pages[gid]?.url,
			title: pages[gid]?.title || '',
			description: pages[gid]?.description || '',
			examples: pages[gid]?.examples || [],
			show_in_navigation:
				pages[gid]?.documentation?.show_in_navigation ??
				(gid.startsWith('type.') && gid.split('.').length === 2),
		});
	});

	await fs.mkdir(path.join(process.cwd(), 'docs/documentation'), { recursive: true });

	for (let i = 0; i < pageFiles.length; i++) {
		const pageFile = pageFiles[i];
		const filename = `${pageFile.gid}.yml`;

		if (verbose) {
			console.log(`     ${filename}`);
		}

		await fs.writeFile(
			path.join(process.cwd(), 'docs/documentation', filename),
			dump(pageFile, { noRefs: true })
		);
	}

	console.log(`     🆕 New (${newCount})`);
	console.log(`     ✍️ Updated (${updatedCount})`);
}
