import * as z from 'zod';
import { SsgKeySchema } from './ssg.ts';

export const EnvironmentVariableSchema = z
	.object({
		key: z.string().meta({
			description: 'The name of the environment variable.',
		}),
		value: z.string().meta({
			description: 'The value of the environment variable.',
		}),
	})
	.meta({
		description: 'A single environment variable as a key-value pair.',
	});

export const BuildConfigSchema = z
	.object({
		install_command: z.string().optional().meta({
			description: 'Command to install dependencies before building.',
		}),
		build_command: z.string().optional().meta({
			description: 'Command to build the site.',
		}),
		output_path: z.string().optional().meta({
			description: 'Path to the built site output directory.',
		}),
		environment_variables: z.array(EnvironmentVariableSchema).optional().meta({
			description: 'Environment variables to set during the build process.',
		}),
		preserve_output: z.boolean().optional().meta({
			description: 'Keep the output directory between builds instead of clearing it.',
		}),
		include_git: z.boolean().optional().meta({
			description: 'Include the .git folder in the build environment.',
		}),
		manually_configure_urls: z.boolean().optional().meta({
			description: 'Disable automatic URL configuration for the SSG.',
		}),
		preserved_paths: z.string().optional().meta({
			description: 'Newline-separated list of paths to preserve between builds.',
		}),
		node_version: z.string().optional().meta({
			description: 'Node.js version to use for the build.',
		}),
		ruby_version: z.string().optional().meta({
			description: 'Ruby version to use for the build.',
		}),
		hugo_version: z.string().optional().meta({
			description: 'Hugo version to use for the build.',
		}),
		deno_version: z.string().optional().meta({
			description: 'Deno version to use for the build.',
		}),
	})
	.meta({
		title: 'Build',
		description: 'Build configuration. Ignored when `mode` is `headless`.',
	});

export const SiteModeSchema = z.enum(['hosted', 'headless']).meta({
	description:
		'The mode for this site. `hosted` sites are built and hosted by CloudCannon. `headless` sites are not built or hosted.',
});

export const InitialSiteSettingsSchema = z
	.object({
		mode: SiteModeSchema.optional(),
		ssg: SsgKeySchema.optional().meta({
			description: 'The Static Site Generator used by this site.',
		}),
		build: BuildConfigSchema.optional(),
	})
	.meta({
		title: 'Initial Site Settings',
		description:
			'Configuration for the `.cloudcannon/initial-site-settings.json` file. Defines build settings and site mode for new sites.',
	});

export type InitialSiteSettings = z.infer<typeof InitialSiteSettingsSchema>;
export type BuildConfig = z.infer<typeof BuildConfigSchema>;
export type SiteMode = z.infer<typeof SiteModeSchema>;
