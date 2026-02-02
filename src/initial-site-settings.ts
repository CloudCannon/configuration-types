import * as z from 'zod';

/**
 * SSG options for initial site settings.
 */
export const InitialSiteSettingsSsgSchema = z
	.enum([
		'astro',
		'bridgetown',
		'docusaurus',
		'eleventy',
		'gatsby',
		'hugo',
		'jekyll',
		'legacy',
		'lume',
		'mkdocs',
		'nextjs',
		'nuxtjs',
		'other',
		'static',
		'sveltekit',
	])
	.meta({
		id: 'iss.ssg',
		description: 'The Static Site Generator for build suggestions. Use `other` for custom SSGs.',
	});

/**
 * Hosting mode for the Site.
 */
export const HostingModeSchema = z
	.enum(['hosted', 'headless'])
	.meta({
		id: 'iss.mode',
		description: '`hosted` enables builds and visual editing; `headless` disables builds for externally-hosted Sites.',
	});

/**
 * An environment variable key-value pair.
 */
export const EnvironmentVariableSchema = z
	.object({
		key: z.string().meta({
			id: 'iss.build.environment_variables.[*].key',
			description: 'Environment variable name.',
		}),
		value: z.string().meta({
			id: 'iss.build.environment_variables.[*].value',
			description: 'Environment variable value.',
		}),
	})
	.meta({
		id: 'iss.build.environment_variables.[*]',
		title: 'Environment Variable',
		description: 'A key-value pair for build environment variables.',
	});

/**
 * Build configuration for the Site.
 */
export const BuildConfigSchema = z
	.object({
		install_command: z.string().optional().meta({
			id: 'iss.build.install_command',
			description: 'Command to install dependencies before building.',
		}),
		build_command: z.string().optional().meta({
			id: 'iss.build.build_command',
			description: 'Command to build your Site.',
		}),
		output_path: z.string().optional().meta({
			id: 'iss.build.output_path',
			description: 'Directory where built files are output.',
		}),
		environment_variables: z.array(EnvironmentVariableSchema).optional().meta({
			id: 'iss.build.environment_variables',
			description: 'Environment variables for the build.',
		}),
		preserved_paths: z.string().optional().meta({
			id: 'iss.build.preserved_paths',
			description: 'Comma-separated path prefixes to cache between builds.',
		}),
		preserve_output: z.boolean().default(false).optional().meta({
			id: 'iss.build.preserve_output',
			description: 'Cache the output directory between builds.',
		}),
		include_git: z.boolean().default(false).optional().meta({
			id: 'iss.build.include_git',
			description: 'Include the `.git` folder in the build.',
		}),
		manually_configure_urls: z.boolean().default(false).optional().meta({
			id: 'iss.build.manually_configure_urls',
			description: 'Skip automatic URL detection; use URLs from your CloudCannon config instead.',
		}),
		hugo_version: z.string().optional().meta({
			id: 'iss.build.hugo_version',
			description: 'Hugo version for the build environment.',
		}),
		ruby_version: z.string().optional().meta({
			id: 'iss.build.ruby_version',
			description: 'Ruby version for the build environment.',
		}),
		node_version: z.string().optional().meta({
			id: 'iss.build.node_version',
			description: 'Node.js version for the build environment.',
		}),
		deno_version: z.string().optional().meta({
			id: 'iss.build.deno_version',
			description: 'Deno version for the build environment.',
		}),
	})
	.meta({
		id: 'iss.build',
		title: 'Build',
		description: 'Build configuration. Ignored when `mode` is `headless`.',
	});

/**
 * The root initial site settings configuration schema.
 */
export const InitialSiteSettingsSchema = z
	.object({
		ssg: InitialSiteSettingsSsgSchema.optional(),
		mode: HostingModeSchema.default('hosted').optional(),
		build: BuildConfigSchema.optional(),
	})
	.meta({
		id: 'type.InitialSiteSettings',
		title: 'Initial Site Settings',
		description: 'Pre-configure SSG, hosting mode, and build settings for new Sites from this repository.',
	});

export type HostingMode = z.infer<typeof HostingModeSchema>;
export type EnvironmentVariable = z.infer<typeof EnvironmentVariableSchema>;
export type BuildConfig = z.infer<typeof BuildConfigSchema>;
export type InitialSiteSettings = z.infer<typeof InitialSiteSettingsSchema>;
