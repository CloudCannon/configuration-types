import * as z from "zod/v4";
import { CollectionConfigSchema, DataConfigEntrySchema, ConfigurationSchema } from './configuration.ts';
import { PathsSchema } from './paths.ts';

// Build-coupled paths that extend base paths
export const BuildCoupledPathsSchema = PathsSchema.extend({
	collections: z.string()
		.optional()
		.describe('Parent folder of all collections.'),
	
	data: z.string()
		.optional()
		.describe('Parent folder of all site data files.'),
	
	layouts: z.string()
		.optional()
		.describe('Parent folder of all site layout files. Only applies to Jekyll, Hugo, and Eleventy sites.'),
	
	includes: z.string()
		.optional()
		.describe('Parent folder of all includes, partials, or shortcode files. Only applies to Jekyll, Hugo, and Eleventy sites.')
});

// Filter base enum
export const FilterBaseSchema = z.enum(['none', 'all', 'strict']);

// Filter configuration
export const FilterSchema = z.object({
	base: FilterBaseSchema
		.optional()
		.describe('Defines the initial set of visible files in the collection file list. Defaults to "all", or "strict" for the auto-discovered `pages` collection in Jekyll, Hugo, and Eleventy.'),
	
	include: z.array(z.string())
		.optional()
		.describe('Add to the visible files set with `base`. Paths must be relative to the containing collection `path`.'),
	
	exclude: z.array(z.string())
		.optional()
		.describe('Remove from the visible files set with `base`. Paths must be relative to the containing collection `path`.')
});

// Parseable interface
export const ParseableSchema = z.object({
	parser: z.enum(['csv', 'front-matter', 'json', 'properties', 'toml', 'yaml'])
		.optional()
		.describe('Overrides the format files are read. Detected automatically from file extension if unset.')
});

// Filterable interface
export const FilterableSchema = z.object({
	filter: z.union([FilterSchema, FilterBaseSchema])
		.optional()
		.describe('Controls which files are displayed in the collection list. Does not change which files are assigned to this collection.')
});

// WithCollectionsConfigOverride interface
export const WithCollectionsConfigOverrideSchema = z.object({
	collections_config_override: z.boolean()
		.optional()
		.describe('Prevents CloudCannon from automatically discovering collections for supported SSGs if true. Defaults to false.')
});

// Reader collection config for non-Jekyll/Hugo/Eleventy sites
export const ReaderCollectionConfigSchema = z.object({
	...CollectionConfigSchema.shape,
	...ParseableSchema.shape,
	...FilterableSchema.shape,
		singular_key: z.string()
			.optional()
			.describe('Overrides the default singular input key of the collection. This is used for naming conventions for select and multiselect inputs.'),
		
		output: z.boolean()
			.optional()
			.describe('Specifies whether this collection\'s source files build to output files. Defaults to false.')
	});

// Reader configuration for non-Jekyll/Hugo/Eleventy sites
export const ReaderConfigurationSchema = z.object({
	...ConfigurationSchema.omit({ version: true }).shape,

	version: z.literal('legacy-reader')
		.describe('Controls which schema this file is validated against. Defaults to the latest schema.'),
	
	paths: BuildCoupledPathsSchema
		.optional()
		.describe('Paths to where new asset files are uploaded to. They also set the default path when choosing existing images, and linking to existing files. Each path is relative to global `source`.'),
	
	data_config: z.record(z.string(), z.object({
		...DataConfigEntrySchema.shape,
		...ParseableSchema.shape,
	}))
		.optional()
		.describe('Controls what data sets are available to populate select and multiselect inputs.'),
	
	collections_config: z.record(z.string(), ReaderCollectionConfigSchema)
		.optional()
		.describe('Definitions for your collections, which are the sets of content files for your site grouped by folder. Entries are keyed by a chosen collection key, and contain configuration specific to that collection.'),
	
	output: z.string()
		.optional()
		.describe('Generates the integration file in another folder. Not applicable to Jekyll, Hugo, and Eleventy. Defaults to the root folder.')
});

// Build-coupled collection config
export const BuildCoupledCollectionConfigSchema =  z.object({
		...CollectionConfigSchema.omit({ url: true, path: true, disable_url: true }).shape,
		...FilterableSchema.shape,
			singular_key: z.string()
			.optional()
			.describe('Overrides the default singular input key of the collection. This is used for naming conventions for select and multiselect inputs.'),
		
		path: z.string()
			.optional()
			.describe('The top-most folder where the files in this collection are stored. It is relative to `source`.'),
		
		output: z.boolean()
			.optional()
			.describe('Specifies whether this collection\'s source files build to output files. Defaults to false.')
	});

// Base build-coupled configuration
export const BuildCoupledConfigurationSchema = z.object({
		...ConfigurationSchema.omit({ data_config: true, collections_config: true, version: true }).shape,
		...WithCollectionsConfigOverrideSchema.shape,
		paths: BuildCoupledPathsSchema
			.optional()
			.describe('Paths to where new asset files are uploaded to. They also set the default path when choosing existing images, and linking to existing files. Each path is relative to global `source`.'),
		
		collections_config: BuildCoupledCollectionConfigSchema
			.optional()
			.describe('Definitions for your collections, which are the sets of content files for your site grouped by folder. Entries are keyed by a chosen collection key, and contain configuration specific to that collection.'),
		
		data_config: z.record(z.string(), z.boolean())
			.optional()
			.describe('Controls what data sets are available to populate select and multiselect inputs.')
	});

// Hugo-specific collection config
export const HugoCollectionConfigSchema = BuildCoupledCollectionConfigSchema.extend({
	parse_branch_index: z.boolean()
		.optional()
		.describe('Controls whether branch index files (e.g. `_index.md`) are assigned to this collection or not. The "pages" collection defaults this to true, and false otherwise.')
});

// Hugo configuration
export const HugoConfigurationSchema = BuildCoupledConfigurationSchema.extend({
	version: z.literal('legacy-hugo')
		.describe('Controls which schema this file is validated against. Defaults to the latest schema.'),
	
	collections_config: z.record(z.string(), HugoCollectionConfigSchema)
		.optional()
		.describe('Definitions for your collections, which are the sets of content files for your site grouped by folder. Entries are keyed by a chosen collection key, and contain configuration specific to that collection.')
});

// Jekyll configuration
export const JekyllConfigurationSchema = BuildCoupledConfigurationSchema.extend({
	version: z.literal('legacy-jekyll')
		.describe('Controls which schema this file is validated against. Defaults to the latest schema.'),
	
	collections_config: z.record(z.string(), BuildCoupledCollectionConfigSchema)
		.optional()
		.describe('Definitions for your collections, which are the sets of content files for your site grouped by folder. Entries are keyed by a chosen collection key, and contain configuration specific to that collection.')
});

// Eleventy configuration
export const EleventyConfigurationSchema = BuildCoupledConfigurationSchema.extend({
	version: z.literal('legacy-eleventy')
		.describe('Controls which schema this file is validated against. Defaults to the latest schema.'),
	
	collections_config: z.record(z.string(), BuildCoupledCollectionConfigSchema)
		.optional()
		.describe('Definitions for your collections, which are the sets of content files for your site grouped by folder. Entries are keyed by a chosen collection key, and contain configuration specific to that collection.')
});

// Legacy configuration union
export const AnyLegacyConfigurationSchema = z.union([
	HugoConfigurationSchema,
	JekyllConfigurationSchema,
	EleventyConfigurationSchema,
	ReaderConfigurationSchema
]);

// Any configuration union
export const AnyConfigurationSchema = z.union([
	ConfigurationSchema,
	AnyLegacyConfigurationSchema
]);

// Parsed dataset types
export const ParsedDatasetSchema = z.union([
	z.array(z.string()),
	z.record(z.string(), z.string()),
	z.record(z.string(), z.record(z.string(), z.unknown())),
	z.array(z.record(z.string(), z.unknown()))
]);

// Parsed collection item
export const ParsedCollectionItemSchema = z.record(z.string(), z.unknown()).and(z.object({
	path: z.string()
		.describe('The path to the file this was parsed from.'),
	
	collection: z.string()
		.optional()
		.describe('The collection key this is assigned to. Matches keys in `collections_config`.'),
	
	url: z.string()
		.optional()
		.describe('The URL this file is served at once built.')
}));

// Integration output base
export const WithIntegrationOutputSchema = z.object({
	error: z.union([z.literal('NO_CONTENT'), z.string()])
		.optional()
		.describe('The error code encountered when attempting to create the integration output file.'),
	
	time: z.string()
		.optional()
		.describe('The time this file was generated.'),
	
	cloudcannon: z.object({
		name: z.string()
			.describe('Name of the integration tool used to generate the integration output file.'),
		
		version: z.string()
			.describe('Version of the integration tool used to generate the integration output file.')
	}).optional()
		.describe('Details about the integration tool used to generate the integration output file.'),
	
	data: z.record(z.string(), ParsedDatasetSchema)
		.optional()
		.describe('Map of data keys to parsed datasets. Keys match keys in `data_config`.'),
	
	collections: z.record(z.string(), z.array(ParsedCollectionItemSchema))
		.optional()
		.describe('Map of collection keys to parsed collection files. Keys match keys in `collections_config`.'),
	
	files: z.record(z.string(), z.string())
		.optional()
		.describe('Map of build file paths to MD5s.')
});

// Integration output types
export const IntegrationOutputSchema = z.object({
	...ConfigurationSchema.shape,
	...WithIntegrationOutputSchema.shape,
});

export const HugoIntegrationOutputSchema = z.object({
	...HugoConfigurationSchema.shape,
	...WithIntegrationOutputSchema.shape,
});

export const JekyllIntegrationOutputSchema = z.object({
		...JekyllConfigurationSchema.shape,
		...WithIntegrationOutputSchema.shape,
		defaults: z.unknown()
			.describe('@deprecated Do not use.')
	});

export const EleventyIntegrationOutputSchema = z.object({
	...EleventyConfigurationSchema.shape,
	...WithIntegrationOutputSchema.shape,
});

// Main build-coupled schema that combines all the above
export const BuildCoupledSchema = z.union([
	BuildCoupledPathsSchema,
	FilterSchema,
	ReaderCollectionConfigSchema,
	ReaderConfigurationSchema,
	BuildCoupledCollectionConfigSchema,
	HugoCollectionConfigSchema,
	HugoConfigurationSchema,
	JekyllConfigurationSchema,
	EleventyConfigurationSchema,
	AnyLegacyConfigurationSchema,
	AnyConfigurationSchema,
	ParsedCollectionItemSchema,
	IntegrationOutputSchema,
	HugoIntegrationOutputSchema,
	JekyllIntegrationOutputSchema,
	EleventyIntegrationOutputSchema
]).describe('Build-coupled configuration schema');

// Type exports
export type BuildCoupledPaths = z.infer<typeof BuildCoupledPathsSchema>;
export type FilterBase = z.infer<typeof FilterBaseSchema>;
export type Filter = z.infer<typeof FilterSchema>;
export type Parseable = z.infer<typeof ParseableSchema>;
export type Filterable = z.infer<typeof FilterableSchema>;
export type WithCollectionsConfigOverride = z.infer<typeof WithCollectionsConfigOverrideSchema>;
export type ReaderCollectionConfig = z.infer<typeof ReaderCollectionConfigSchema>;
export type ReaderConfiguration = z.infer<typeof ReaderConfigurationSchema>;
export type BuildCoupledCollectionConfig = z.infer<typeof BuildCoupledCollectionConfigSchema>;
export type BuildCoupledConfiguration = z.infer<typeof BuildCoupledConfigurationSchema>;
export type HugoCollectionConfig = z.infer<typeof HugoCollectionConfigSchema>;
export type HugoConfiguration = z.infer<typeof HugoConfigurationSchema>;
export type JekyllConfiguration = z.infer<typeof JekyllConfigurationSchema>;
export type EleventyConfiguration = z.infer<typeof EleventyConfigurationSchema>;
export type AnyLegacyConfiguration = z.infer<typeof AnyLegacyConfigurationSchema>;
export type AnyConfiguration = z.infer<typeof AnyConfigurationSchema>;
export type ParsedDataset = z.infer<typeof ParsedDatasetSchema>;
export type ParsedCollectionItem = z.infer<typeof ParsedCollectionItemSchema>;
export type WithIntegrationOutput = z.infer<typeof WithIntegrationOutputSchema>;
export type IntegrationOutput = z.infer<typeof IntegrationOutputSchema>;
export type HugoIntegrationOutput = z.infer<typeof HugoIntegrationOutputSchema>;
export type JekyllIntegrationOutput = z.infer<typeof JekyllIntegrationOutputSchema>;
export type EleventyIntegrationOutput = z.infer<typeof EleventyIntegrationOutputSchema>;
export type BuildCoupled = z.infer<typeof BuildCoupledSchema>; 