import type { CollectionConfig, Configuration, DataConfigEntry } from './configuration';
import type { Paths } from './paths';

export interface BuildCoupledPaths extends Paths {
	/**
	 * Parent folder of all collections.
	 */
	collections?: string;
	/**
	 * Parent folder of all site data files.
	 */
	data?: string;
	/**
	 * Parent folder of all site layout files. _Only applies to Jekyll, Hugo, and Eleventy sites_.
	 */
	layouts?: string;
	/**
	 * Parent folder of all includes, partials, or shortcode files. _Only applies to Jekyll, Hugo, and
	 * Eleventy sites_.
	 */
	includes?: string;
}

export type FilterBase = 'none' | 'all' | 'strict';

export interface Filter {
	/**
	 * Defines the initial set of visible files in the collection file list. Defaults to "all", or
	 * "strict" for the auto-discovered `pages` collection in Jekyll, Hugo, and Eleventy.
	 */
	base?: FilterBase;
	/**
	 * Add to the visible files set with `base`. Paths must be relative to the containing collection
	 * `path`.
	 */
	include?: string[];
	/**
	 * Remove from the visible files set with `base`. Paths must be relative to the containing
	 * collection `path`.
	 */
	exclude?: string[];
}

interface Parseable {
	/**
	 * Overrides the format files are read. Detected automatically from file extension if unset.
	 */
	parser?: 'csv' | 'front-matter' | 'json' | 'properties' | 'toml' | 'yaml';
}

interface Filterable {
	/**
	 * Controls which files are displayed in the collection list. Does not change which files are
	 * assigned to this collection.
	 */
	filter?: Filter | FilterBase;
}

interface WithCollectionsConfigOverride {
	/**
	 * Prevents CloudCannon from automatically discovering collections for supported SSGs if true.
	 * Defaults to false.
	 */
	collections_config_override?: boolean;
}

/**
 * The `collections_config` entry format for build-coupled non-Jekyll/Hugo/Eleventy sites.
 */
export interface ReaderCollectionConfig extends CollectionConfig, Parseable, Filterable {
	/**
	 * Overrides the default singular input key of the collection. This is used for naming conventions
	 * for select and multiselect inputs.
	 */
	singular_key?: string;
	/**
	 * Specifies whether this collection's source files build to output files. Defaults to false.
	 */
	output?: boolean;
}

/**
 * The configuration format for build-coupled non-Jekyll/Hugo/Eleventy sites.
 */
export interface ReaderConfiguration extends Omit<Configuration, 'version'> {
	/**
	 * Controls which schema this file is validated against. Defaults to the latest schema.
	 */
	version: 'legacy-reader';
	/**
	 * Paths to where new asset files are uploaded to. They also set the default path when choosing
	 * existing images, and linking to existing files. Each path is relative to global `source`.
	 */
	paths?: BuildCoupledPaths;
	/**
	 * Controls what data sets are available to populate select and multiselect inputs.
	 *
	 * https://cloudcannon.com/documentation/articles/configuration-file-reference/#data_config
	 */
	data_config?: Record<string, DataConfigEntry & Parseable>;
	/**
	 * Definitions for your collections, which are the sets of content files for your site grouped by
	 * folder. Entries are keyed by a chosen collection key, and contain configuration specific to
	 * that collection.
	 *
	 * https://cloudcannon.com/documentation/articles/configuration-file-reference/#collections_config
	 */
	collections_config?: Record<string, ReaderCollectionConfig>;
	/**
	 * Generates the integration file in another folder. Not applicable to Jekyll, Hugo, and Eleventy.
	 * Defaults to the root folder.
	 */
	output?: string;
}

export interface BuildCoupledCollectionConfig
	extends Omit<CollectionConfig, 'url' | 'path' | 'disable_url'>,
		Filterable {
	/**
	 * Overrides the default singular input key of the collection. This is used for naming conventions
	 * for select and multiselect inputs.
	 */
	singular_key?: string;
	/**
	 * The top-most folder where the files in this collection are stored. It is relative to `source`.
	 */
	path?: string;
	/**
	 * Specifies whether this collection's source files build to output files. Defaults to false.
	 */
	output?: boolean;
}

interface BuildCoupledConfiguration
	extends Omit<Configuration, 'data_config' | 'collections_config' | 'version'>,
		WithCollectionsConfigOverride {
	/**
	 * Paths to where new asset files are uploaded to. They also set the default path when choosing
	 * existing images, and linking to existing files. Each path is relative to global `source`.
	 */
	paths?: BuildCoupledPaths;
	/**
	 * Definitions for your collections, which are the sets of content files for your site grouped by
	 * folder. Entries are keyed by a chosen collection key, and contain configuration specific to
	 * that collection.
	 *
	 * https://cloudcannon.com/documentation/articles/configuration-file-reference/#collections_config
	 */
	collections_config?: BuildCoupledCollectionConfig;
	/**
	 * Controls what data sets are available to populate select and multiselect inputs.
	 *
	 * https://cloudcannon.com/documentation/articles/configuration-file-reference/#data_config
	 */
	data_config?: Record<string, boolean>;
}

/**
 * The `collections_config` entry format for build-coupled Hugo sites.
 */
export interface HugoCollectionConfig extends BuildCoupledCollectionConfig {
	/**
	 * Controls whether branch index files (e.g. `_index.md`) are assigned to this collection or not.
	 * The "pages" collection defaults this to true, and false otherwise.
	 */
	parse_branch_index?: boolean;
}

/**
 * The configuration format for build-coupled Hugo sites.
 */
export interface HugoConfiguration extends BuildCoupledConfiguration {
	/**
	 * Controls which schema this file is validated against. Defaults to the latest schema.
	 */
	version: 'legacy-hugo';
	/**
	 * Definitions for your collections, which are the sets of content files for your site grouped by
	 * folder. Entries are keyed by a chosen collection key, and contain configuration specific to
	 * that collection.
	 *
	 * https://cloudcannon.com/documentation/articles/configuration-file-reference/#collections_config
	 */
	collections_config?: Record<string, HugoCollectionConfig>;
}

/**
 * The configuration format for build-coupled Jekyll sites.
 */
export interface JekyllConfiguration extends BuildCoupledConfiguration {
	/**
	 * Controls which schema this file is validated against. Defaults to the latest schema.
	 */
	version: 'legacy-jekyll';
	/**
	 * Definitions for your collections, which are the sets of content files for your site grouped by
	 * folder. Entries are keyed by a chosen collection key, and contain configuration specific to
	 * that collection.
	 *
	 * https://cloudcannon.com/documentation/articles/configuration-file-reference/#collections_config
	 */
	collections_config?: Record<string, BuildCoupledCollectionConfig>;
}

/**
 * The configuration format for build-coupled Eleventy sites.
 */
export interface EleventyConfiguration extends BuildCoupledConfiguration {
	/**
	 * Controls which schema this file is validated against. Defaults to the latest schema.
	 */
	version: 'legacy-eleventy';
	/**
	 * Definitions for your collections, which are the sets of content files for your site grouped by
	 * folder. Entries are keyed by a chosen collection key, and contain configuration specific to
	 * that collection.
	 *
	 * https://cloudcannon.com/documentation/articles/configuration-file-reference/#collections_config
	 */
	collections_config?: Record<string, BuildCoupledCollectionConfig>;
}

/**
 * @discriminator version
 */
export type AnyLegacyConfiguration =
	| HugoConfiguration
	| JekyllConfiguration
	| EleventyConfiguration
	| ReaderConfiguration;

export type AnyConfiguration = Configuration | AnyLegacyConfiguration;

export type ParsedDataset =
	| string[]
	| Record<string, string>
	| Record<string, Record<string, unknown>>
	| Record<string, unknown>[];

interface ParsedCollectionItem {
	[index: string]: unknown;
	/**
	 * The path to the file this was parsed from.
	 */
	path: string;
	/**
	 * The collection key this is assigned to. Matches keys in `collections_config`.
	 */
	collection?: string;
	/**
	 * The URL this file is served at once built.
	 */
	url?: string;
}

interface WithIntegrationOutput {
	/**
	 * The error code encountered when attempting to create the integration output file.
	 */
	error?: 'NO_CONTENT' | string;
	/**
	 * The time this file was generated.
	 */
	time?: string;
	/**
	 * Details about the integration tool used to generate the integration output file.
	 */
	cloudcannon?: {
		/**
		 * Name of the integration tool used to generate the integration output file.
		 */
		name: string;
		/**
		 * Version of the integration tool used to generate the integration output file.
		 */
		version: string;
	};
	/**
	 * Map of data keys to parsed datasets. Keys match keys in `data_config`.
	 */
	data?: Record<string, ParsedDataset>;
	/**
	 * Map of collection keys to parsed collection files. Keys match keys in `collections_config`.
	 */
	collections?: Record<string, ParsedCollectionItem[]>;
	/**
	 * Map of build file paths to MD5s.
	 */
	files?: Record<string, string>;
}

/**
 * The output from build-coupled non-Jekyll/Hugo/Eleventy sites.
 */
export type IntegrationOutput = Configuration & WithIntegrationOutput;

/**
 * The output from build-coupled Hugo sites.
 */
export type HugoIntegrationOutput = HugoConfiguration & WithIntegrationOutput;

/**
 * The output from build-coupled Jekyll sites.
 */
export interface JekyllIntegrationOutput extends JekyllConfiguration, WithIntegrationOutput {
	/**
	 * @deprecated Do not use.
	 */
	defaults: unknown;
}

/**
 * The output from build-coupled Eleventy sites.
 */
export type EleventyIntegrationOutput = EleventyConfiguration & WithIntegrationOutput;
