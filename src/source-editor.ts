import * as z from 'zod';

const THEMES = [
	'atomone',
	'basic_dark',
	'basic_light',
	'darcula',
	'dracula',
	'duotone_dark',
	'duotone_light',
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
] as const;

export const ThemeSchema = z.enum(THEMES).meta({ id: 'Theme' });

export const SourceEditorSchema = z.object({
	tab_size: z.number().nullable().default(2).optional(),
	theme: ThemeSchema.nullable().default('basic_dark').optional(),
	show_gutter: z.boolean().default(true).optional(),
	soft_wrap: z.boolean().default(false).optional(),
});

export type Theme = (typeof THEMES)[number];
export interface SourceEditor extends z.infer<typeof SourceEditorSchema> {}
