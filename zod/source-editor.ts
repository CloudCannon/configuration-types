import * as z from 'zod/v4';

export const ThemeSchema = z.enum([
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
]);

export const SourceEditorSchema = z
	.object({
		tab_size: z
			.number()
			.default(2)
			.optional()
			.describe(
				'This key defines the auto-indentation of each line and how many spaces a tab indentation counts as.\n\nBy default, this key is `2`.\n\nhttps://cloudcannon.com/documentation/articles/the-source-editor/#source_editor.tab_size'
			),

		theme: ThemeSchema.default('monokai')
			.optional()
			.describe(
				'This key defines the color theme for syntax highlighting in the Source Editor.\n\nBy default, this key is `monokai`.\n\nhttps://cloudcannon.com/documentation/articles/the-source-editor/#source_editor.theme'
			),

		show_gutter: z
			.boolean()
			.default(true)
			.optional()
			.describe(
				'This key toggles the gutter on the left of the editing interface, displaying line numbers and code folding controls.\n\nBy default, this key is `true`.\n\nhttps://cloudcannon.com/documentation/articles/the-source-editor/#source_editor.show_gutter'
			),

		soft_wrap: z.boolean().default(false).optional().describe('Enables soft wrapping of the code.'),
	})
	.describe(
		'This key defines the appearance and behavior of the Source Editor. The following nested keys are available:\n\n- `tab_size`\n- `show_gutter`\n- `theme`\n\nThis key has no default.\n\nhttps://cloudcannon.com/documentation/articles/the-source-editor/#source_editor'
	);

export type Theme = z.infer<typeof ThemeSchema>;
export type SourceEditor = z.infer<typeof SourceEditorSchema>;
