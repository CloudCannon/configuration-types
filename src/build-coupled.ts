import * as z from 'zod';
import { _CollectionConfigSchema } from './collections.js';
import {
	_ConfigurationSchema,
	_DataConfigEntrySchema,
	ConfigurationSchema,
} from './configuration.js';
import { _PathsSchema } from './paths.js';

const _BuildCoupledPathsSchema = z
	.object({
		..._PathsSchema.shape,
		collections: z.string().nullable().optional().meta({
			description: 'Parent folder of all collections.',
		}),
		data: z.string().nullable().optional().meta({
			description: 'Parent folder of all site data files.',
		}),
		layouts: z.string().nullable().optional().meta({
			description:
				'Parent folder of all site layout files. Only applies to Jekyll, Hugo, and Eleventy sites.',
		}),
		includes: z.string().nullable().optional().meta({
			description:
				'Parent folder of all includes, partials, or shortcode files. Only applies to Jekyll, Hugo, and Eleventy sites.',
		}),
	})
	.meta({
		id: 'paths:BuildCoupled',
		description:
			'Paths to where new asset files are uploaded to. They also set the default path when choosing existing images, and linking to existing files. Each path is relative to global `source`.',
	});

export interface BuildCoupledPaths extends z.infer<typeof _BuildCoupledPathsSchema> {}
export const BuildCoupledPathsSchema: z.ZodType<BuildCoupledPaths> = _BuildCoupledPathsSchema;

const FILTER_BASES = ['none', 'all', 'strict'] as const;
export const FilterBaseSchema = z.enum(FILTER_BASES);

const _FilterValueSchema = z.object({
	base: FilterBaseSchema.nullable().optional().meta({
		description:
			'Defines the initial set of visible files in the collection file list. Defaults to "all", or "strict" for the auto-discovered `pages` collection in Jekyll, Hugo, and Eleventy.',
	}),
	include: z.array(z.string()).nullable().optional().meta({
		description:
			'Add to the visible files set with `base`. Paths must be relative to the containing collection `path`.',
	}),
	exclude: z.array(z.string()).nullable().optional().meta({
		description:
			'Remove from the visible files set with `base`. Paths must be relative to the containing collection `path`.',
	}),
});
export interface FilterValue extends z.infer<typeof _FilterValueSchema> {}
export const FilterValueSchema: z.ZodType<FilterValue> = _FilterValueSchema;

const _FilterSchema = z.union([FilterValueSchema, FilterBaseSchema]).meta({
	id: 'filter',
	description:
		'Controls which files are displayed in the collection list. Does not change which files are assigned to this collection.',
});
export type Filter = z.infer<typeof _FilterSchema>;
export const FilterSchema: z.ZodType<Filter> = _FilterSchema;

const ParserSchema = z.enum(['csv', 'front-matter', 'json', 'properties', 'toml', 'yaml']).meta({
	id: 'parser',
	description:
		'Overrides the format files are read. Detected automatically from file extension if unset.',
});

const versionMeta = {
	description:
		'Controls which schema this file is validated against. Defaults to the latest schema.',
};

const collectionsConfigMeta = {
	title: 'Collections Configuration',
	description:
		'Definitions for your collections, which are the sets of content files for your site grouped by folder. Entries are keyed by a chosen collection key, and contain configuration specific to that collection.',
};

const SingularKeySchema = z.string().meta({
	id: 'singular_key',
	description:
		'Overrides the default singular input key of the collection. This is used for naming conventions for select and multiselect inputs.',
});

const OutputSchema = z.boolean().meta({
	id: 'output',
	description:
		"Specifies whether this collection's source files build to output files. Defaults to false.",
});

const _BuildCoupledCollectionConfigSchema = z.object({
	..._CollectionConfigSchema.omit({ url: true, disable_url: true }).shape,
	path: _CollectionConfigSchema.shape.path.optional(),
	filter: FilterSchema.nullable().optional(),
	singular_key: SingularKeySchema.nullable().optional(),
	output: OutputSchema.nullable().optional(),
});
export interface BuildCoupledCollectionConfig
	extends z.infer<typeof _BuildCoupledCollectionConfigSchema> {}
export const BuildCoupledCollectionConfigSchema: z.ZodType<BuildCoupledCollectionConfig> =
	_BuildCoupledCollectionConfigSchema;

const _ReaderCollectionConfigSchema = z.object({
	..._CollectionConfigSchema.shape,
	parser: ParserSchema.nullable().optional(),
	filter: FilterSchema.nullable().optional(),
	singular_key: SingularKeySchema.nullable().optional(),
	output: OutputSchema.nullable().optional(),
});
export interface ReaderCollectionConfig extends z.infer<typeof _ReaderCollectionConfigSchema> {}
export const ReaderCollectionConfigSchema: z.ZodType<ReaderCollectionConfig> =
	_ReaderCollectionConfigSchema;

const _HugoCollectionConfigSchema = z.object({
	..._BuildCoupledCollectionConfigSchema.shape,
	parse_branch_index: z.boolean().default(false).optional().meta({
		description:
			'Controls whether branch index files (e.g. `_index.md`) are assigned to this collection or not. The "pages" collection defaults this to true, and false otherwise.',
	}),
});
export interface HugoCollectionConfig extends z.infer<typeof _HugoCollectionConfigSchema> {}
export const HugoCollectionConfigSchema: z.ZodType<HugoCollectionConfig> =
	_HugoCollectionConfigSchema;

const _BuildCoupledConfigurationSchema = z.object({
	..._ConfigurationSchema.omit({ version: true }).shape,
	collections_config_override: z.boolean().default(false).optional().meta({
		id: 'collections_config_override',
		description:
			'Prevents CloudCannon from automatically discovering collections for supported SSGs if true. Defaults to false.',
	}),
	version: z
		.enum(['legacy-hugo', 'legacy-jekyll', 'legacy-eleventy', 'legacy-reader'])
		.nullable()
		.optional()
		.meta(versionMeta),
	paths: BuildCoupledPathsSchema.nullable().optional(),
	collections_config: z
		.record(z.string(), BuildCoupledCollectionConfigSchema)
		.nullable()
		.optional()
		.meta({
			...collectionsConfigMeta,
			id: 'collections_config:BuildCoupled',
		}),
	data_config: z.record(z.string(), z.boolean()).nullable().optional().meta({
		description: 'Controls what data sets are available to populate select and multiselect inputs.',
	}),
});
export interface BuildCoupledConfiguration
	extends z.infer<typeof _BuildCoupledConfigurationSchema> {}
export const BuildCoupledConfigurationSchema: z.ZodType<BuildCoupledConfiguration> =
	_BuildCoupledConfigurationSchema;

const _ReaderConfigurationSchema = z.object({
	..._BuildCoupledConfigurationSchema.omit({ collections_config_override: true }).shape,
	version: z.literal('legacy-reader').meta(versionMeta),
	data_config: z
		.record(
			z.string(),
			z.object({ ..._DataConfigEntrySchema.shape, parser: ParserSchema.nullable().optional() })
		)
		.nullable()
		.optional()
		.meta({
			description:
				'Controls what data sets are available to populate select and multiselect inputs.',
		}),
	collections_config: z
		.record(z.string(), ReaderCollectionConfigSchema)
		.nullable()
		.optional()
		.meta(collectionsConfigMeta),
	output: z.string().nullable().optional().meta({
		description:
			'Generates the integration file in another folder. Not applicable to Jekyll, Hugo, and Eleventy. Defaults to the root folder.',
	}),
});
export interface ReaderConfiguration extends z.infer<typeof _ReaderConfigurationSchema> {}
export const ReaderConfigurationSchema: z.ZodType<ReaderConfiguration> = _ReaderConfigurationSchema;

const _HugoConfigurationSchema = z.object({
	..._BuildCoupledConfigurationSchema.shape,
	version: z.literal('legacy-hugo').meta(versionMeta),
	collections_config: z
		.record(z.string(), HugoCollectionConfigSchema)
		.nullable()
		.optional()
		.meta(collectionsConfigMeta),
});
export interface HugoConfiguration extends z.infer<typeof _HugoConfigurationSchema> {}
export const HugoConfigurationSchema: z.ZodType<HugoConfiguration> = _HugoConfigurationSchema;

const _JekyllConfigurationSchema = z.object({
	..._BuildCoupledConfigurationSchema.shape,
	version: z.literal('legacy-jekyll').meta(versionMeta),
});
export interface JekyllConfiguration extends z.infer<typeof _JekyllConfigurationSchema> {}
export const JekyllConfigurationSchema: z.ZodType<JekyllConfiguration> = _JekyllConfigurationSchema;

const _EleventyConfigurationSchema = z.object({
	..._BuildCoupledConfigurationSchema.shape,
	version: z.literal('legacy-eleventy').meta(versionMeta),
});
export interface EleventyConfiguration extends z.infer<typeof _EleventyConfigurationSchema> {}
export const EleventyConfigurationSchema: z.ZodType<EleventyConfiguration> =
	_EleventyConfigurationSchema;

const _AnyLegacyConfigurationSchema = z.union([
	HugoConfigurationSchema,
	JekyllConfigurationSchema,
	EleventyConfigurationSchema,
	ReaderConfigurationSchema,
]);
export type AnyLegacyConfiguration = z.infer<typeof _AnyLegacyConfigurationSchema>;
export const AnyLegacyConfigurationSchema: z.ZodType<AnyLegacyConfiguration> =
	_AnyLegacyConfigurationSchema;

const _AnyConfigurationSchema = z.union([ConfigurationSchema, AnyLegacyConfigurationSchema]);
export type AnyConfiguration = z.infer<typeof _AnyConfigurationSchema>;
export const AnyConfigurationSchema: z.ZodType<AnyConfiguration> = _AnyConfigurationSchema;

const _ParsedDatasetSchema = z.union([
	z.array(z.string()),
	z.record(z.string(), z.string()),
	z.record(z.string(), z.record(z.string(), z.unknown())),
	z.array(z.record(z.string(), z.unknown())),
]);
export type ParsedDataset = z.infer<typeof _ParsedDatasetSchema>;
export const ParsedDatasetSchema: z.ZodType<ParsedDataset> = _ParsedDatasetSchema;

const _ParsedCollectionItemSchema = z.record(z.string(), z.unknown()).and(
	z.object({
		path: z.string().meta({
			description: 'The path to the file this was parsed from.',
		}),
		collection: z.string().optional().meta({
			description: 'The collection key this is assigned to. Matches keys in `collections_config`.',
		}),
		url: z.string().optional().meta({
			description: 'The URL this file is served at once built.',
		}),
	})
);
export type ParsedCollectionItem = z.infer<typeof _ParsedCollectionItemSchema>;
export const ParsedCollectionItemSchema: z.ZodType<ParsedCollectionItem> =
	_ParsedCollectionItemSchema;

const WithIntegrationOutputSchema = z.object({
	error: z
		.union([z.literal('NO_CONTENT'), z.string()])
		.optional()
		.meta({
			id: 'error',
			description:
				'The error code encountered when attempting to create the integration output file.',
		}),
	time: z.string().optional().meta({
		id: 'time',
		description: 'The time this file was generated.',
	}),
	cloudcannon: z
		.object({
			name: z.string().meta({
				description: 'Name of the integration tool used to generate the integration output file.',
			}),
			version: z.string().meta({
				description:
					'Version of the integration tool used to generate the integration output file.',
			}),
		})
		.optional()
		.meta({
			id: 'cloudcannon',
			description:
				'Details about the integration tool used to generate the integration output file.',
		}),
	data: z.record(z.string(), ParsedDatasetSchema).optional().meta({
		id: 'data',
		description: 'Map of data keys to parsed datasets. Keys match keys in `data_config`.',
	}),
	collections: z.record(z.string(), z.array(ParsedCollectionItemSchema)).optional().meta({
		id: 'collections',
		description:
			'Map of collection keys to parsed collection files. Keys match keys in `collections_config`.',
	}),
	files: z.record(z.string(), z.string()).optional().meta({
		id: 'files',
		description: 'Map of build file paths to MD5s.',
	}),
});

const _IntegrationOutputSchema = z.object({
	..._ConfigurationSchema.shape,
	...WithIntegrationOutputSchema.shape,
});
export interface IntegrationOutput extends z.infer<typeof _IntegrationOutputSchema> {}
export const IntegrationOutputSchema: z.ZodType<IntegrationOutput> = _IntegrationOutputSchema;

const _ReaderIntegrationOutputSchema = z.object({
	..._ReaderConfigurationSchema.shape,
	...WithIntegrationOutputSchema.shape,
});
export interface ReaderIntegrationOutput extends z.infer<typeof _ReaderIntegrationOutputSchema> {}
export const ReaderIntegrationOutputSchema: z.ZodType<ReaderIntegrationOutput> =
	_ReaderIntegrationOutputSchema;

const _HugoIntegrationOutputSchema = z.object({
	..._HugoConfigurationSchema.shape,
	...WithIntegrationOutputSchema.shape,
});
export interface HugoIntegrationOutput extends z.infer<typeof _HugoIntegrationOutputSchema> {}
export const HugoIntegrationOutputSchema: z.ZodType<HugoIntegrationOutput> =
	_HugoIntegrationOutputSchema;

const _JekyllIntegrationOutputSchema = z.object({
	..._JekyllConfigurationSchema.shape,
	...WithIntegrationOutputSchema.shape,
	defaults: z.unknown(),
});
export interface JekyllIntegrationOutput extends z.infer<typeof _JekyllIntegrationOutputSchema> {}
export const JekyllIntegrationOutputSchema: z.ZodType<JekyllIntegrationOutput> =
	_JekyllIntegrationOutputSchema;

const _EleventyIntegrationOutputSchema = z.object({
	..._EleventyConfigurationSchema.shape,
	...WithIntegrationOutputSchema.shape,
});
export interface EleventyIntegrationOutput
	extends z.infer<typeof _EleventyIntegrationOutputSchema> {}
export const EleventyIntegrationOutputSchema: z.ZodType<EleventyIntegrationOutput> =
	_EleventyIntegrationOutputSchema;

export type FilterBase = (typeof FILTER_BASES)[number];
