import * as z from 'zod';

export const ThemeSchema = z
	.enum([
		// TODO: update these to current values
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

		'basic_dark',
	])
	.meta({
		id: 'Theme',
	});

export const SourceEditorSchema = z.object({
	tab_size: z.number().default(2).optional().meta({ id: 'source_editor.tab_size' }),
	theme: ThemeSchema.default('basic_dark').optional().meta({ id: 'source_editor.theme' }),
	show_gutter: z.boolean().default(true).optional().meta({ id: 'source_editor.show_gutter' }),
	soft_wrap: z.boolean().default(false).optional().meta({ id: 'source_editor.soft_wrap' }),
});

export type Theme = z.infer<typeof ThemeSchema>;
export type SourceEditor = z.infer<typeof SourceEditorSchema>;
