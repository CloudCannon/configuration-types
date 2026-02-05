export interface DocSchemaConfig {
	/** Human-readable name for logging */
	name: string;
	/** Schema filename in dist/ folder */
	schemaFile: string;
	/** Folder for YAML documentation files */
	docsFolder: string;
	/** Root type identifier (e.g., 'type.Configuration') */
	rootTypeId: string;
	/** URL prefix for this schema's pages (e.g., '/routing-file/') */
	urlPrefix: string;
}

export const docSchemas: DocSchemaConfig[] = [
	{
		name: 'Configuration',
		schemaFile: 'cloudcannon-config.documentation.schema.json',
		docsFolder: 'docs/documentation',
		rootTypeId: 'type.Configuration',
		urlPrefix: '/configuration-file/',
	},
	{
		name: 'Routing',
		schemaFile: 'cloudcannon-routing.documentation.schema.json',
		docsFolder: 'docs/routing',
		rootTypeId: 'type.Routing',
		urlPrefix: '/routing-file/',
	},
	{
		name: 'Initial Site Settings',
		schemaFile: 'cloudcannon-initial-site-settings.documentation.schema.json',
		docsFolder: 'docs/initial-site-settings',
		rootTypeId: 'type.InitialSiteSettings',
		urlPrefix: '/initial-site-settings-file/',
	},
];
