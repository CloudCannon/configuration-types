import * as z from 'zod';

export const ThemeSchema = z
	.enum([
		'atomone',
		'basic_light',
		'basic_dark',
		'darcula',
		'dracula',
		'duotone_light',
		'duotone_dark',
		'eclipse',
		'github_dark',
		'github_light',
		'gruvbox_dark',
		'gruvbox_light',
		'material_dark',
		'material_light',
		'solarized_dark',
		'solarized_light',
		'sublime',
		'tokyo_night',
		'tokyo_night_day',
		'tokyo_night_storm',
		'tomorrow_night_blue',
		'vscode_dark',
		'vscode_light',
		'xcode_dark',
		'xcode_light',
	])
	.meta({
		id: 'Theme',
	});

export const SourceEditorSchema = z.object({
	tab_size: z.number().default(2).optional().meta({
		description:
			'This key defines the auto-indentation of each line and how many spaces a tab indentation counts as.\n\nBy default, this key is `2`.\n\nhttps://cloudcannon.com/documentation/articles/the-source-editor/#source_editor.tab_size',
	}),
	theme: ThemeSchema.default('basic_dark').optional().meta({
		title: 'Theme',
		description:
			'This key defines the color theme for syntax highlighting.\n\nBy default, this key is `monokai`.\n\nhttps://cloudcannon.com/documentation/articles/the-source-editor/#source_editor.theme',
	}),
	show_gutter: z.boolean().default(true).optional().meta({
		description:
			'This key toggles the gutter on the left of the editing interface, displaying line numbers and code folding controls.\n\nBy default, this key is `true`.\n\nhttps://cloudcannon.com/documentation/articles/the-source-editor/#source_editor.show_gutter',
	}),
	soft_wrap: z.boolean().default(false).optional().meta({
		description: 'Enables soft wrapping of the code.',
	}),
});

export type Theme = z.infer<typeof ThemeSchema>;
export type SourceEditor = z.infer<typeof SourceEditorSchema>;
