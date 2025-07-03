import * as z from 'zod/v4';
import { ReducedCascadeSchema } from './cascade.ts';
import { WithPickerPreviewSchema, WithPreviewSchema } from './preview.ts';

export const SnippetConfigSchema = ReducedCascadeSchema.extend(WithPreviewSchema.shape)
	.extend(WithPickerPreviewSchema.shape)
	.extend({
		snippet: z.string().optional().describe('Name of the snippet.'),

		template: z
			.string()
			.optional()
			.describe(
				'The template that this snippet should inherit, out of the available Shortcode Templates.'
			),

		inline: z
			.boolean()
			.optional()
			.describe(
				'Whether this snippet can appear inline (within a sentence). Defaults to false, which will treat this snippet as a block-level element in the content editor.'
			),

		view: z
			.enum(['card', 'inline', 'gallery'])
			.optional()
			.describe(
				"Controls how selected items are rendered. Defaults to 'card', or 'inline' if `inline` is true."
			),

		strict_whitespace: z
			.boolean()
			.optional()
			.describe('Whether this snippet treats whitespace as-is or not.'),

		definitions: z
			.record(z.string(), z.unknown())
			.optional()
			.describe('The variables required for the selected template.'),

		get alternate_formats() {
			return z
				.array(SnippetConfigSchema)
				.optional()
				.describe('Alternate configurations for this snippet.');
		},

		params: z
			.record(z.string(), z.unknown())
			.optional()
			.describe('The parameters of this snippet.'),
	}).meta({
		name: 'SnippetConfig',
		description: 'A snippet configuration.',
	});

// Helper schemas for snippet import configurations
const SnippetImportConfigSchema = z.union([
	z.boolean(),
	z.object({
		exclude: z
			.array(z.string())
			.describe(
				'The list of excluded snippets. If unset, all snippets are excluded unless defined in `include`.'
			),
	}),
	z.object({
		include: z
			.array(z.string())
			.describe(
				'The list of included snippets. If unset, all snippets are included unless defined in `exclude`.'
			),
	}),
]).meta({
	name: 'SnippetImportConfig',
	description: 'Controls what snippets are available to import.',
});

export const SnippetsImportsSchema = z.object({
	hugo: SnippetImportConfigSchema.optional().describe('Default snippets for Hugo SSG.'),

	jekyll: SnippetImportConfigSchema.optional().describe('Default snippets for Jekyll SSG.'),

	mdx: SnippetImportConfigSchema.optional().describe('Default snippets for MDX-based content.'),

	eleventy_liquid: SnippetImportConfigSchema.optional().describe(
		'Default snippets for Eleventy SSG Liquid files.'
	),

	eleventy_nunjucks: SnippetImportConfigSchema.optional().describe(
		'Default snippets for Eleventy SSG Nunjucks files.'
	),

	markdoc: SnippetImportConfigSchema.optional().describe(
		'Default snippets for Markdoc-based content.'
	),

	python_markdown_extensions: SnippetImportConfigSchema.optional().describe(
		'Default snippets for content using Python markdown extensions.'
	),

	docusaurus_mdx: SnippetImportConfigSchema.optional().describe(
		'Default snippets for Docusaurus SSG.'
	),
}).meta({
	name: 'SnippetsImports',
	description: 'Controls what snippets are available to import.',
});

export type SnippetConfig = z.infer<typeof SnippetConfigSchema>;
export type SnippetsImports = z.infer<typeof SnippetsImportsSchema>;
