import fs from 'node:fs';
import path from 'node:path';
import * as z from 'zod';
import { JekyllConfigurationSchema } from './src/build-coupled';
import { HugoConfigurationSchema } from './src/build-coupled';
import { EleventyConfigurationSchema } from './src/build-coupled';
import { ReaderConfigurationSchema } from './src/build-coupled';
import { CollectionConfigSchema } from './src/collections';
import { ConfigurationSchema } from './src/configuration';
import { EditablesSchema } from './src/editables';
import { InputsSchema } from './src/inputs';
import { SnippetsImportsSchema } from './src/snippets';
import { StructureValueSchema, StructuresSchema } from './src/structures';

const schemas = [
	{
		schema: ConfigurationSchema.meta({
			id: 'type.Configuration',
		}),
		keepDocumentationType: true,
		target: 'draft-2020-12' as const,
		filename: 'cloudcannon-config.documentation.schema.json',
	},
	{
		schema: ConfigurationSchema.meta({
			$id: 'https://github.com/cloudcannon/configuration-types/releases/latest/download/cloudcannon-config.latest.schema.json',
		}),
		filename: 'cloudcannon-config.latest.schema.json',
		convertSchemaAnys: true,
		addMarkdownDescription: true,
		stripId: true,
	},
	{
		schema: JekyllConfigurationSchema.meta({
			$id: 'https://github.com/cloudcannon/configuration-types/releases/latest/download/cloudcannon-config.legacy-jekyll.schema.json',
		}),
		filename: 'cloudcannon-config.legacy-jekyll.schema.json',
		convertSchemaAnys: true,
		addMarkdownDescription: true,
		stripId: true,
	},
	{
		schema: HugoConfigurationSchema.meta({
			$id: 'https://github.com/cloudcannon/configuration-types/releases/latest/download/cloudcannon-config.legacy-hugo.schema.json',
		}),
		filename: 'cloudcannon-config.legacy-hugo.schema.json',
		convertSchemaAnys: true,
		addMarkdownDescription: true,
		stripId: true,
	},
	{
		schema: EleventyConfigurationSchema.meta({
			$id: 'https://github.com/cloudcannon/configuration-types/releases/latest/download/cloudcannon-config.legacy-eleventy.schema.json',
		}),
		filename: 'cloudcannon-config.legacy-eleventy.schema.json',
		convertSchemaAnys: true,
		addMarkdownDescription: true,
		stripId: true,
	},
	{
		schema: ReaderConfigurationSchema.meta({
			$id: 'https://github.com/cloudcannon/configuration-types/releases/latest/download/cloudcannon-config.legacy-reader.schema.json',
		}),
		filename: 'cloudcannon-config.legacy-reader.schema.json',
		convertSchemaAnys: true,
		addMarkdownDescription: true,
		stripId: true,
	},
	{
		// keys: _structures_from_glob
		// files: *.cloudcannon.structures.(yml|yaml|json)
		schema: StructuresSchema.meta({
			$id: 'https://github.com/cloudcannon/configuration-types/releases/latest/download/cloudcannon-structures.schema.json',
		}),
		filename: 'cloudcannon-structures.schema.json',
		convertSchemaAnys: true,
		addMarkdownDescription: true,
		stripId: true,
	},
	{
		// keys: _inputs_from_glob
		// files: *.cloudcannon.inputs.(yml|yaml|json)
		schema: InputsSchema.meta({
			$id: 'https://github.com/cloudcannon/configuration-types/releases/latest/download/cloudcannon-inputs.schema.json',
		}),
		filename: 'cloudcannon-inputs.schema.json',
		convertSchemaAnys: true,
		addMarkdownDescription: true,
		stripId: true,
	},
	{
		// keys: values_from_glob
		// files: *.cloudcannon.structure-value.(yml|yaml|json)
		schema: StructureValueSchema.meta({
			$id: 'https://github.com/cloudcannon/configuration-types/releases/latest/download/cloudcannon-structure-value.schema.json',
		}),
		filename: 'cloudcannon-structure-value.schema.json',
		convertSchemaAnys: true,
		addMarkdownDescription: true,
		stripId: true,
	},
	{
		// keys: _snippets_from_glob, _snippets_templates_from_glob
		// files: *.cloudcannon.snippets.(yml|yaml|json)
		schema: ConfigurationSchema.shape._snippets.unwrap().meta({
			$id: 'https://github.com/cloudcannon/configuration-types/releases/latest/download/cloudcannon-snippets.schema.json',
		}),
		filename: 'cloudcannon-snippets.schema.json',
		convertSchemaAnys: true,
		addMarkdownDescription: true,
		stripId: true,
	},
	{
		// keys: _snippets_imports_from_glob
		// files: *.cloudcannon.snippets-imports.(yml|yaml|json)
		schema: SnippetsImportsSchema.meta({
			$id: 'https://github.com/cloudcannon/configuration-types/releases/latest/download/cloudcannon-snippets-imports.schema.json',
		}),
		filename: 'cloudcannon-snippets-imports.schema.json',
		convertSchemaAnys: true,
		addMarkdownDescription: true,
		stripId: true,
	},
	{
		// keys: _snippets_definitions_from_glob
		// files: *.cloudcannon.snippets-definitions.(yml|yaml|json)
		schema: ConfigurationSchema.shape._snippets_definitions.unwrap().meta({
			$id: 'https://github.com/cloudcannon/configuration-types/releases/latest/download/cloudcannon-snippets-definitions.schema.json',
		}),
		filename: 'cloudcannon-snippets-definitions.schema.json',
		convertSchemaAnys: true,
		addMarkdownDescription: true,
		stripId: true,
	},
	{
		// keys: _editables_from_glob
		// files: *.cloudcannon.editables.(yml|yaml|json)
		schema: EditablesSchema.meta({
			$id: 'https://github.com/cloudcannon/configuration-types/releases/latest/download/cloudcannon-editables.schema.json',
		}),
		filename: 'cloudcannon-editables.schema.json',
		convertSchemaAnys: true,
		addMarkdownDescription: true,
		stripId: true,
	},
	{
		// keys: collections_config_from_glob
		// files: *.cloudcannon.collections.(yml|yaml|json)
		schema: ConfigurationSchema.shape.collections_config.unwrap().meta({
			$id: 'https://github.com/cloudcannon/configuration-types/releases/latest/download/cloudcannon-collections.schema.json',
		}),
		filename: 'cloudcannon-collections.schema.json',
		convertSchemaAnys: true,
		addMarkdownDescription: true,
		stripId: true,
	},
	{
		// keys: schemas_from_glob
		// files: *.cloudcannon.schemas.(yml|yaml|json)
		schema: CollectionConfigSchema.shape.schemas.unwrap().meta({
			$id: 'https://github.com/cloudcannon/configuration-types/releases/latest/download/cloudcannon-schemas.schema.json',
		}),
		filename: 'cloudcannon-schemas.schema.json',
		convertSchemaAnys: true,
		addMarkdownDescription: true,
		stripId: true,
	},
];

for (const schema of schemas) {
	const jsonSchema = z.toJSONSchema(schema.schema, {
		target: schema.target || 'draft-7',
		override: (ctx) => {
			if (
				schema.convertSchemaAnys &&
				ctx.zodSchema instanceof z.ZodString &&
				ctx.zodSchema.meta()?.isJsonSchemaAny
			) {
				// If this flag is set, we change the JSONSchema type to "any", while keeping the Zod type.
				// Useful so far for Date values.
				delete ctx.jsonSchema.type;
			}

			delete ctx.jsonSchema.isJsonSchemaAny;

			if (!schema.keepDocumentationType) {
				delete ctx.jsonSchema.documentationType;
			}

			if (schema.stripId && ctx.jsonSchema.id) {
				// AJV (Node JSONSchema library) errors when 'id' is present in non draft-04 schemas.
				delete ctx.jsonSchema.id;
			}

			if (schema.addMarkdownDescription && ctx.jsonSchema.description) {
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
