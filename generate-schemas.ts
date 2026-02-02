import fs from 'node:fs/promises';
import path from 'node:path';
import * as z from 'zod';
import { redocumentSchema } from './redocument-schemas';
import {
	EleventyConfigurationSchema,
	HugoConfigurationSchema,
	JekyllConfigurationSchema,
	ReaderConfigurationSchema,
} from './src/build-coupled';
import { CollectionConfigSchema, CollectionsConfigSchema } from './src/collections';
import { ConfigurationSchema } from './src/configuration';
import { EditablesSchema } from './src/editables';
import { InitialSiteSettingsSchema } from './src/initial-site-settings';
import { InputsSchema } from './src/inputs';
import { RoutingSchema } from './src/routing';
import { SnippetsImportsSchema } from './src/snippets';
import { StructuresSchema, StructureValueSchema } from './src/structures';

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
		redocument: true,
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
		redocument: true,
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
		redocument: true,
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
		redocument: true,
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
		redocument: true,
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
		redocument: true,
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
		redocument: true,
	},
	{
		// keys: collections_config_from_glob
		// files: *.cloudcannon.collections.(yml|yaml|json)
		schema: CollectionsConfigSchema.meta({
			$id: 'https://github.com/cloudcannon/configuration-types/releases/latest/download/cloudcannon-collections.schema.json',
		}),
		filename: 'cloudcannon-collections.schema.json',
		convertSchemaAnys: true,
		addMarkdownDescription: true,
		stripId: true,
		redocument: true,
	},
	{
		// keys: schemas_from_glob
		// files: *.cloudcannon.schemas.(yml|yaml|json)
		schema: CollectionConfigSchema.shape.schemas.unwrap().meta({
			id: 'collections_config.*.schemas',
			$id: 'https://github.com/cloudcannon/configuration-types/releases/latest/download/cloudcannon-schemas.schema.json',
		}),
		filename: 'cloudcannon-schemas.schema.json',
		convertSchemaAnys: true,
		addMarkdownDescription: true,
		stripId: true,
		redocument: true,
	},
	// Routing file - .cloudcannon/routing.json
	// Note: RoutingSchema already has id: 'type.Routing' in its definition
	{
		schema: RoutingSchema,
		keepDocumentationType: true,
		target: 'draft-2020-12' as const,
		filename: 'cloudcannon-routing.documentation.schema.json',
	},
	{
		schema: RoutingSchema,
		filename: 'cloudcannon-routing.schema.json',
		$id: 'https://github.com/cloudcannon/configuration-types/releases/latest/download/cloudcannon-routing.schema.json',
		convertSchemaAnys: true,
		addMarkdownDescription: true,
		stripId: true,
	},
	// Initial site settings file - .cloudcannon/initial-site-settings.json
	// Note: InitialSiteSettingsSchema already has id: 'type.InitialSiteSettings' in its definition
	{
		schema: InitialSiteSettingsSchema,
		keepDocumentationType: true,
		target: 'draft-2020-12' as const,
		filename: 'cloudcannon-initial-site-settings.documentation.schema.json',
	},
	{
		schema: InitialSiteSettingsSchema,
		filename: 'cloudcannon-initial-site-settings.schema.json',
		$id: 'https://github.com/cloudcannon/configuration-types/releases/latest/download/cloudcannon-initial-site-settings.schema.json',
		convertSchemaAnys: true,
		addMarkdownDescription: true,
		stripId: true,
	},
];

for (const schemaConfig of schemas) {
	const jsonSchema = z.toJSONSchema(schemaConfig.schema, {
		target: schemaConfig.target || 'draft-7',
		override: (ctx) => {
			if (
				schemaConfig.convertSchemaAnys &&
				ctx.zodSchema instanceof z.ZodString &&
				ctx.zodSchema.meta()?.isJsonSchemaAny
			) {
				// If this flag is set, we change the JSONSchema type to "any", while keeping the Zod type.
				// Useful so far for Date values.
				delete ctx.jsonSchema.type;
			}

			delete ctx.jsonSchema.isJsonSchemaAny;

			if (!schemaConfig.keepDocumentationType) {
				delete ctx.jsonSchema.documentationType;
			}

			if (schemaConfig.stripId && ctx.jsonSchema.id && !schemaConfig.redocument) {
				// AJV (Node JSONSchema library) errors when 'id' is present in non draft-04 schemas.
				// redocumentSchema() needs this id, and strips it after using it.
				delete ctx.jsonSchema.id;
			}

			if (
				schemaConfig.addMarkdownDescription &&
				ctx.jsonSchema.description &&
				!schemaConfig.redocument
			) {
				// YAML/JSON LSP integrations won't format descriptions unless set in markdownDescription.
				// redocumentSchema() adds this as well.
				ctx.jsonSchema.markdownDescription = ctx.jsonSchema.description;
			}
		},
	});

	// Add $id to the root of the JSON schema if specified in config
	if (schemaConfig.$id) {
		(jsonSchema as any).$id = schemaConfig.$id;
	}

	const fullSchemaPath = path.join(process.cwd(), 'dist', schemaConfig.filename);
	await fs.writeFile(fullSchemaPath, JSON.stringify(jsonSchema, null, '  '));

	if (schemaConfig.redocument) {
		await redocumentSchema(fullSchemaPath, {
			stripId: schemaConfig.stripId,
			addMarkdownDescription: schemaConfig.addMarkdownDescription,
		});
	}

	console.log(`✅ ${schemaConfig.filename}`);
}
