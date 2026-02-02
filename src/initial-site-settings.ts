import * as z from 'zod';

// Define SSG keys locally to avoid circular dependency with index.ts
const SsgKeySchema = z.enum([
	'hugo',
	'jekyll',
	'eleventy',
	'astro',
	'lume',
	'mkdocs',
	'nextjs',
	'sveltekit',
	'bridgetown',
	'docusaurus',
	'gatsby',
	'hexo',
	'nuxtjs',
	'sphinx',
	'static',
	'legacy',
	'other',
]);

export const EnvironmentVariableSchema = z
	.object({
		key: z.string().meta({
			id: 'iss.build.environment_variables.[*].key',
			description: 'The name of the environment variable.',
		}),
		value: z.string().meta({
			id: 'iss.build.environment_variables.[*].value',
			description: 'The value of the environment variable.',
		}),
	})
	.meta({
		id: 'iss.build.environment_variables.[*]',
		description: 'A single environment variable as a key-value pair.',
	});

export const BuildConfigSchema = z
	.object({
		install_command: z.string().optional().meta({
			id: 'iss.build.install_command',
			description: 'Command to install dependencies before building.',
		}),
		build_command: z.string().optional().meta({
			id: 'iss.build.build_command',
			description: 'Command to build the site.',
		}),
		output_path: z.string().optional().meta({
			id: 'iss.build.output_path',
			description: 'Path to the built site output directory.',
		}),
		environment_variables: z.array(EnvironmentVariableSchema).optional().meta({
			id: 'iss.build.environment_variables',
			description: 'Environment variables to set during the build process.',
		}),
		preserve_output: z.boolean().optional().meta({
			id: 'iss.build.preserve_output',
			description: 'Keep the output directory between builds instead of clearing it.',
		}),
		include_git: z.boolean().optional().meta({
			id: 'iss.build.include_git',
			description: 'Include the .git folder in the build environment.',
		}),
		manually_configure_urls: z.boolean().optional().meta({
			id: 'iss.build.manually_configure_urls',
			description: 'Disable automatic URL configuration for the SSG.',
		}),
		preserved_paths: z.string().optional().meta({
			id: 'iss.build.preserved_paths',
			description: 'Newline-separated list of paths to preserve between builds.',
		}),
		node_version: z.string().optional().meta({
			id: 'iss.build.node_version',
			description: 'Node.js version to use for the build.',
		}),
		ruby_version: z.string().optional().meta({
			id: 'iss.build.ruby_version',
			description: 'Ruby version to use for the build.',
		}),
		hugo_version: z.string().optional().meta({
			id: 'iss.build.hugo_version',
			description: 'Hugo version to use for the build.',
		}),
		deno_version: z.string().optional().meta({
			id: 'iss.build.deno_version',
			description: 'Deno version to use for the build.',
		}),
	})
	.meta({
		id: 'iss.build',
		title: 'Build',
		description: 'Build configuration. Ignored when `mode` is `headless`.',
	});

export const SiteModeSchema = z.enum(['hosted', 'headless']).meta({
	id: 'iss.mode',
	description:
		'The mode for this site. `hosted` sites are built and hosted by CloudCannon. `headless` sites are not built or hosted.',
});

export const InitialSiteSettingsSchema = z
	.object({
		mode: SiteModeSchema.optional(),
		ssg: SsgKeySchema.optional().meta({
			id: 'iss.ssg',
			description: 'The Static Site Generator used by this site.',
		}),
		build: BuildConfigSchema.optional(),
	})
	.meta({
		id: 'type.InitialSiteSettings',
		title: 'Initial Site Settings',
		description:
			'Configuration for the `.cloudcannon/initial-site-settings.json` file. Defines build settings and site mode for new sites.',
	});

export type InitialSiteSettings = z.infer<typeof InitialSiteSettingsSchema>;
export type BuildConfig = z.infer<typeof BuildConfigSchema>;
export type SiteMode = z.infer<typeof SiteModeSchema>;
