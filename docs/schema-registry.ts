export interface DocSchemaConfig {
	/** Human-readable name for logging */
	name: string;
	/** Schema filename in dist/ folder */
	schemaFile: string;
	/** Folder for YAML documentation files */
	docsFolder: string;
	/** GID prefix for this schema type (empty string for config) */
	gidPrefix: string;
	/** Root type identifier (e.g., 'type.Configuration') */
	rootTypeId: string;
}

export const docSchemas: DocSchemaConfig[] = [
	{
		name: 'Configuration',
		schemaFile: 'cloudcannon-config.documentation.schema.json',
		docsFolder: 'docs/documentation',
		gidPrefix: '',
		rootTypeId: 'type.Configuration',
	},
	{
		name: 'Routing',
		schemaFile: 'cloudcannon-routing.documentation.schema.json',
		docsFolder: 'docs/routing',
		gidPrefix: 'routing',
		rootTypeId: 'type.Routing',
	},
	{
		name: 'Initial Site Settings',
		schemaFile: 'cloudcannon-initial-site-settings.documentation.schema.json',
		docsFolder: 'docs/initial-site-settings',
		gidPrefix: 'iss',
		rootTypeId: 'type.InitialSiteSettings',
	},
];
