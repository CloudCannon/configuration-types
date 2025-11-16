import fs from 'node:fs';
import path from 'node:path';
import * as z from 'zod';
import { docs } from './docs/index';
import { JekyllConfigurationSchema } from './src/build-coupled';
import { HugoConfigurationSchema } from './src/build-coupled';
import { EleventyConfigurationSchema } from './src/build-coupled';
import { ReaderConfigurationSchema } from './src/build-coupled';
import { ConfigurationSchema } from './src/configuration';

const schemas = [
	{
		schema: ConfigurationSchema.meta({
			$id: 'https://github.com/cloudcannon/configuration-types/releases/latest/download/cloudcannon-config.latest.schema.json',
		}),
		target: 'draft-2020-12' as const,
		filename: 'cloudcannon-config.documentation.schema.json',
		docs: true,
	},
	{
		schema: ConfigurationSchema.meta({
			$id: 'https://github.com/cloudcannon/configuration-types/releases/latest/download/cloudcannon-config.latest.schema.json',
		}),
		target: 'draft-7' as const,
		filename: 'cloudcannon-config.latest.schema.json',
	},
	{
		schema: JekyllConfigurationSchema.meta({
			$id: 'https://github.com/cloudcannon/configuration-types/releases/latest/download/cloudcannon-config.legacy-jekyll.schema.json',
		}),
		target: 'draft-7' as const,
		filename: 'cloudcannon-config.legacy-jekyll.schema.json',
	},
	{
		schema: HugoConfigurationSchema.meta({
			$id: 'https://github.com/cloudcannon/configuration-types/releases/latest/download/cloudcannon-config.legacy-hugo.schema.json',
		}),
		target: 'draft-7' as const,
		filename: 'cloudcannon-config.legacy-hugo.schema.json',
	},
	{
		schema: EleventyConfigurationSchema.meta({
			$id: 'https://github.com/cloudcannon/configuration-types/releases/latest/download/cloudcannon-config.legacy-eleventy.schema.json',
		}),
		target: 'draft-7' as const,
		filename: 'cloudcannon-config.legacy-eleventy.schema.json',
	},
	{
		schema: ReaderConfigurationSchema.meta({
			$id: 'https://github.com/cloudcannon/configuration-types/releases/latest/download/cloudcannon-config.legacy-reader.schema.json',
		}),
		target: 'draft-7' as const,
		filename: 'cloudcannon-config.legacy-reader.schema.json',
	},
];

for (const schema of schemas) {
	const jsonSchema = z.toJSONSchema(schema.schema, {
		target: schema.target,
		override: (ctx) => {
			if (ctx.zodSchema instanceof z.ZodString && ctx.zodSchema.meta()?.isJsonSchemaAny) {
				// If this flag is set, we change the JSONSchema type to "any", while keeping the Zod type.
				// Useful so far for Date values.
				delete ctx.jsonSchema.type;
				delete ctx.jsonSchema.isJsonSchemaAny;
			}

			if (ctx.jsonSchema.id) {
				if (schema.docs) {
					const doc = docs[ctx.jsonSchema.id];

					ctx.jsonSchema.documentation = doc;

					// if (doc?.name) {
					// 	ctx.jsonSchema.title = doc.name;
					// }

					// if (doc?.description) {
					// 	ctx.jsonSchema.description = doc.description;
					// }
				} else {
					// AJV (Node JSONSchema library) errors when 'id' is present in non draft-04 schemas.
					delete ctx.jsonSchema.id;
				}
			}

			if (ctx.jsonSchema.description && !schema.docs) {
				// YAML/JSON LSP integrations won't format descriptions unless set in markdownDescription.
				ctx.jsonSchema.markdownDescription = ctx.jsonSchema.description;
			}
		},
	});

	fs.writeFileSync(
		path.join(process.cwd(), 'dist', schema.filename),
		JSON.stringify(jsonSchema, null, '  ')
	);

	console.log(`✅ ${schema.filename}`);
}
