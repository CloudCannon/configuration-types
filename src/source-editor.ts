import * as z from 'zod';

export const ThemeSchema = z
	.enum([
		'ambiance',
		'chaos',
		'chrome',
		'clouds',
		'clouds_midnight',
		'cobalt',
		'crimson_editor',
		'dawn',
		'dracula',
		'dreamweaver',
		'eclipse',
		'github',
		'gob',
		'gruvbox',
		'idle_fingers',
		'iplastic',
		'katzenmilch',
		'kr_theme',
		'kuroir',
		'merbivore',
		'merbivore_soft',
		'mono_industrial',
		'monokai',
		'nord_dark',
		'pastel_on_dark',
		'solarized_dark',
		'solarized_light',
		'sqlserver',
		'terminal',
		'textmate',
		'tomorrow',
		'tomorrow_night',
		'tomorrow_night_blue',
		'tomorrow_night_bright',
		'tomorrow_night_eighties',
		'twilight',
		'vibrant_ink',
		'xcode',
	])
	.meta({
		id: 'Theme',
	});

export const SourceEditorSchema = z.object({
	tab_size: z.number().default(2).optional().meta({
		description:
			'This key defines the auto-indentation of each line and how many spaces a tab indentation counts as.\n\nBy default, this key is `2`.\n\nhttps://cloudcannon.com/documentation/articles/the-source-editor/#source_editor.tab_size',
	}),

	theme: ThemeSchema.default('monokai').optional().meta({
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
