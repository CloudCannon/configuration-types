import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const DIST = 'dist';

const jsonFiles = (await readdir(DIST)).filter((file) => file.endsWith('.schema.json'));

for (const file of jsonFiles) {
	const json = await readFile(join(DIST, file), 'utf8');
	const base = file.replace(/\.json$/, '');
	await writeFile(join(DIST, `${base}.js`), `export default ${json};\n`);
	await writeFile(
		join(DIST, `${base}.d.ts`),
		"import type { AnySchemaObject } from 'ajv';\ndeclare const schema: AnySchemaObject;\nexport default schema;\n"
	);
}

console.log(`Wrote ${jsonFiles.length} schema module(s) to ${DIST}/`);
