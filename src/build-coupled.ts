import * as z from 'zod';
import { CollectionConfigSchema } from './collections';
import { ConfigurationSchema, DataConfigEntrySchema } from './configuration';
import { PathsSchema } from './paths';

export const BuildCoupledPathsSchema = z
	.object({
		...PathsSchema.shape,
		collections: z.string().optional().meta({
			description: 'Parent folder of all collections.',
		}),
		data: z.string().optional().meta({
			description: 'Parent folder of all site data files.',
		}),
		layouts: z.string().optional().meta({
			description:
				'Parent folder of all site layout files. Only applies to Jekyll, Hugo, and Eleventy sites.',
		}),
		includes: z.string().optional().meta({
			description:
				'Parent folder of all includes, partials, or shortcode files. Only applies to Jekyll, Hugo, and Eleventy sites.',
		}),
	})
	.meta({
		id: 'paths:BuildCoupled',
		description:
			'Paths to where new asset files are uploaded to. They also set the default path when choosing existing images, and linking to existing files. Each path is relative to global `source`.',
	});

export const FilterBaseSchema = z.enum(['none', 'all', 'strict']);

export const FilterValueSchema = z.object({
	base: FilterBaseSchema.optional().meta({
		description:
			'Defines the initial set of visible files in the collection file list. Defaults to "all", or "strict" for the auto-discovered `pages` collection in Jekyll, Hugo, and Eleventy.',
	}),
	include: z.array(z.string()).optional().meta({
		description:
			'Add to the visible files set with `base`. Paths must be relative to the containing collection `path`.',
	}),
	exclude: z.array(z.string()).optional().meta({
		description:
			'Remove from the visible files set with `base`. Paths must be relative to the containing collection `path`.',
	}),
});

export const FilterSchema = z.union([FilterValueSchema, FilterBaseSchema]).meta({
	id: 'filter',
	description:
		'Controls which files are displayed in the collection list. Does not change which files are assigned to this collection.',
});

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

export const BuildCoupledCollectionConfigSchema = z.object({
	...CollectionConfigSchema.omit({ url: true, disable_url: true }).shape,
	path: CollectionConfigSchema.shape.path.optional(),
	filter: FilterSchema.optional(),
	singular_key: SingularKeySchema.optional(),
	output: OutputSchema.optional(),
});

export const ReaderCollectionConfigSchema = z.object({
	...CollectionConfigSchema.shape,
	parser: ParserSchema.optional(),
	filter: FilterSchema.optional(),
	singular_key: SingularKeySchema.optional(),
	output: OutputSchema.optional(),
});

export const HugoCollectionConfigSchema = z.object({
	...BuildCoupledCollectionConfigSchema.shape,
	parse_branch_index: z.boolean().optional().meta({
		description:
			'Controls whether branch index files (e.g. `_index.md`) are assigned to this collection or not. The "pages" collection defaults this to true, and false otherwise.',
	}),
});

export const BuildCoupledConfigurationSchema = z.object({
	...ConfigurationSchema.omit({ version: true }).shape,
	collections_config_override: z.boolean().optional().meta({
		id: 'collections_config_override',
		description:
			'Prevents CloudCannon from automatically discovering collections for supported SSGs if true. Defaults to false.',
	}),
	version: z
		.enum(['legacy-hugo', 'legacy-jekyll', 'legacy-eleventy', 'legacy-reader'])
		.optional()
		.meta(versionMeta),
	paths: BuildCoupledPathsSchema.optional(),
	collections_config: z
		.record(z.string(), BuildCoupledCollectionConfigSchema)
		.optional()
		.meta({
			...collectionsConfigMeta,
			id: 'collections_config:BuildCoupled',
		}),
	data_config: z.record(z.string(), z.boolean()).optional().meta({
		description: 'Controls what data sets are available to populate select and multiselect inputs.',
	}),
});

export const ReaderConfigurationSchema = z.object({
	...BuildCoupledConfigurationSchema.omit({ collections_config_override: true }).shape,
	version: z.literal('legacy-reader').meta(versionMeta),
	data_config: z
		.record(
			z.string(),
			z.object({ ...DataConfigEntrySchema.shape, parser: ParserSchema.optional() })
		)
		.optional()
		.meta({
			description:
				'Controls what data sets are available to populate select and multiselect inputs.',
		}),
	collections_config: z
		.record(z.string(), ReaderCollectionConfigSchema)
		.optional()
		.meta(collectionsConfigMeta),
	output: z.string().optional().meta({
		description:
			'Generates the integration file in another folder. Not applicable to Jekyll, Hugo, and Eleventy. Defaults to the root folder.',
	}),
});

export const HugoConfigurationSchema = z.object({
	...BuildCoupledConfigurationSchema.shape,
	version: z.literal('legacy-hugo').meta(versionMeta),
	collections_config: z
		.record(z.string(), HugoCollectionConfigSchema)
		.optional()
		.meta(collectionsConfigMeta),
});

export const JekyllConfigurationSchema = z.object({
	...BuildCoupledConfigurationSchema.shape,
	version: z.literal('legacy-jekyll').meta(versionMeta),
});

export const EleventyConfigurationSchema = z.object({
	...BuildCoupledConfigurationSchema.shape,
	version: z.literal('legacy-eleventy').meta(versionMeta),
});

export const AnyLegacyConfigurationSchema = z.union([
	HugoConfigurationSchema,
	JekyllConfigurationSchema,
	EleventyConfigurationSchema,
	ReaderConfigurationSchema,
]);

export const AnyConfigurationSchema = z.union([ConfigurationSchema, AnyLegacyConfigurationSchema]);

export const ParsedDatasetSchema = z.union([
	z.array(z.string()),
	z.record(z.string(), z.string()),
	z.record(z.string(), z.record(z.string(), z.unknown())),
	z.array(z.record(z.string(), z.unknown())),
]);

export const ParsedCollectionItemSchema = z.record(z.string(), z.unknown()).and(
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

export const IntegrationOutputSchema = z.object({
	...ConfigurationSchema.shape,
	...WithIntegrationOutputSchema.shape,
});

export const ReaderIntegrationOutputSchema = z.object({
	...ReaderConfigurationSchema.shape,
	...WithIntegrationOutputSchema.shape,
});

export const HugoIntegrationOutputSchema = z.object({
	...HugoConfigurationSchema.shape,
	...WithIntegrationOutputSchema.shape,
});

export const JekyllIntegrationOutputSchema = z.object({
	...JekyllConfigurationSchema.shape,
	...WithIntegrationOutputSchema.shape,
	defaults: z.unknown(),
});

export const EleventyIntegrationOutputSchema = z.object({
	...EleventyConfigurationSchema.shape,
	...WithIntegrationOutputSchema.shape,
});

export type BuildCoupledPaths = z.infer<typeof BuildCoupledPathsSchema>;
export type FilterBase = z.infer<typeof FilterBaseSchema>;
export type FilterValue = z.infer<typeof FilterValueSchema>;
export type Filter = z.infer<typeof FilterSchema>;
export type BuildCoupledCollectionConfig = z.infer<typeof BuildCoupledCollectionConfigSchema>;
export type ReaderCollectionConfig = z.infer<typeof ReaderCollectionConfigSchema>;
export type HugoCollectionConfig = z.infer<typeof HugoCollectionConfigSchema>;
export type BuildCoupledConfiguration = z.infer<typeof BuildCoupledConfigurationSchema>;
export type ReaderConfiguration = z.infer<typeof ReaderConfigurationSchema>;
export type HugoConfiguration = z.infer<typeof HugoConfigurationSchema>;
export type JekyllConfiguration = z.infer<typeof JekyllConfigurationSchema>;
export type EleventyConfiguration = z.infer<typeof EleventyConfigurationSchema>;
export type AnyLegacyConfiguration = z.infer<typeof AnyLegacyConfigurationSchema>;
export type AnyConfiguration = z.infer<typeof AnyConfigurationSchema>;
export type ParsedDataset = z.infer<typeof ParsedDatasetSchema>;
export type ParsedCollectionItem = z.infer<typeof ParsedCollectionItemSchema>;
export type IntegrationOutput = z.infer<typeof IntegrationOutputSchema>;
export type ReaderIntegrationOutput = z.infer<typeof ReaderIntegrationOutputSchema>;
export type HugoIntegrationOutput = z.infer<typeof HugoIntegrationOutputSchema>;
export type JekyllIntegrationOutput = z.infer<typeof JekyllIntegrationOutputSchema>;
export type EleventyIntegrationOutput = z.infer<typeof EleventyIntegrationOutputSchema>;
