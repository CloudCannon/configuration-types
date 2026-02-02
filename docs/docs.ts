import fs from 'node:fs/promises';
import path from 'node:path';
import { dump, load } from 'js-yaml';
import { type DocumentationEntry, type Page, verbose } from './util';

export async function readDocs(folder: string): Promise<Record<string, DocumentationEntry>> {
	const docs: Record<string, DocumentationEntry> = {};
	const folderPath = path.join(process.cwd(), folder);

	// Check if folder exists, return empty if not
	try {
		await fs.access(folderPath);
	} catch {
		console.log(`📄 Read from ${folder}/*.yml (0 - folder does not exist)`);
		return docs;
	}

	const files = await fs.readdir(folderPath);

	console.log(`📄 Read from ${folder}/*.yml (${files.length})`);

	for (let i = 0; i < files.length; i++) {
		if (files[i].endsWith('.yml')) {
			if (verbose) {
				console.log(`     ${files[i]}`);
			}

			const content = await fs.readFile(path.join(folderPath, files[i]), {
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

export async function moveOldDocs(folder: string, gidsInUse: Set<string>): Promise<void> {
	const folderPath = path.join(process.cwd(), folder);
	const unusedFolder = `${folder}-unused`;
	const unusedPath = path.join(process.cwd(), unusedFolder);

	// Check if folder exists
	try {
		await fs.access(folderPath);
	} catch {
		return; // Nothing to move
	}

	const allFiles = await fs.readdir(folderPath);
	const files = allFiles.filter(
		(file) => file.endsWith('.yml') && !gidsInUse.has(file.replace(/\.yml$/, ''))
	);

	if (files.length === 0) {
		return;
	}

	await fs.mkdir(unusedPath, { recursive: true });

	console.log(`🚚 Move to ${unusedFolder}/*.yml (${files.length})`);

	for (let i = 0; i < files.length; i++) {
		if (verbose) {
			console.log(`     ${files[i]}`);
		}

		await fs.rename(path.join(folderPath, files[i]), path.join(unusedPath, files[i]));
	}
}

export async function writeNewDocs(
	folder: string,
	gids: Set<string>,
	pages: Record<string, Page>
): Promise<void> {
	const folderPath = path.join(process.cwd(), folder);
	const pageFiles: any[] = [];

	// Ensure folder exists
	await fs.mkdir(folderPath, { recursive: true });

	let existingGids: Record<string, boolean> = {};
	try {
		const files = await fs.readdir(folderPath);
		existingGids = files.reduce((memo: Record<string, boolean>, file) => {
			memo[file.replace(/\.yml$/, '')] = true;
			return memo;
		}, {});
	} catch {
		// Folder doesn't exist yet, no existing files
	}

	let newCount = 0;

	console.log(`📝 Write to ${folder}/*.yml (${gids.size})`);

	gids.forEach((gid) => {
		if (!existingGids[gid]) {
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

	for (let i = 0; i < pageFiles.length; i++) {
		const pageFile = pageFiles[i];
		const filename = `${pageFile.gid}.yml`;

		if (verbose) {
			console.log(`     ${filename}`);
		}

		await fs.writeFile(path.join(folderPath, filename), dump(pageFile, { noRefs: true }));
	}

	console.log(`     🆕 New (${newCount})`);
}
