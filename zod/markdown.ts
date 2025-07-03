import * as z from 'zod/v4';

export const AttributeListPositionSchema = z.enum([
	'none',
	'right',
	'space right',
	'below',
	'newline below',
	'right-of-prefix',
]).meta({
	name: 'AttributeListPosition',
	description: 'Positioning options for Markdown attribute elements.',
});

export const MarkdownAttributeElementOptionsSchema = z.union([
	z.object({
		inline: AttributeListPositionSchema.optional(),
		block: AttributeListPositionSchema.optional(),
	}),
	z.record(z.string(), AttributeListPositionSchema),
]).meta({
	name: 'MarkdownAttributeElementOptions',
	description: 'Configuration for positioning Markdown attributes on different element types.',
});

export const MarkdownSettingsSchema = z.object({
	engine: z
		.enum(['commonmark', 'kramdown'])
		.default('commonmark')
		.describe('The flavor of Markdown to use to convert between HTML and Markdown.'),

	options: z.object({
		html: z.boolean().optional().describe('Output HTML tags from source.'),

		xhtml: z.boolean().optional().describe('Use `/` to close single tags (e.g. `<br />`).'),

		breaks: z.boolean().optional().describe('Convert `\\n` in paragraphs into `<br>`.'),

		linkify: z.boolean().optional().describe('Autoconvert URL-like text to links.'),

		typographer: z
			.boolean()
			.optional()
			.describe('Enable some language-neutral replacement, as well as quotes beautification.'),

		quotes: z
			.string()
			.optional()
			.describe(
				'Double + single quotes replacement pairs, when typographer enabled and smartquotes on. For example, you can use "«»„"" for Russian, ""„"‚"" for German, and ["«\\xA0", "\\xA0»", "‹\\xA0", "\\xA0›"] for French (including `nbsp`).'
			),

		spaced_lists: z.boolean().optional().describe('Output lists with an extra space in Markdown.'),

		sentence_per_line: z
			.boolean()
			.optional()
			.describe('Add linebreaks between sentences in Markdown.'),

		gfm: z.boolean().optional().describe('Enable GFM mode.'),

		code_block_fences: z
			.enum(['```', '~~~'])
			.optional()
			.describe('Determines which style of code block fences to use.'),

		treat_indentation_as_code: z
			.boolean()
			.optional()
			.describe('Determines whether 4 spaces on indentation should be read as a code block.'),

		escape_snippets_in_code_blocks: z
			.boolean()
			.optional()
			.describe('Render snippets as plain text within code blocks.'),

		table: z.boolean().optional().describe('Output tables in Markdown format.'),

		strikethrough: z
			.boolean()
			.optional()
			.describe('Output strikes in wrapped in double tildes (e.g. `~~strike~~`).'),

		subscript: z
			.boolean()
			.optional()
			.describe('Output subscript in wrapped in tildes (e.g. `~sub~`).'),

		superscript: z
			.boolean()
			.optional()
			.describe('Output superscript in wrapped in carets (e.g. `^super^`).'),

		heading_ids: z.boolean().optional().describe('Generate IDs for headings.'),

		attributes: z
			.boolean()
			.optional()
			.describe('Save element attributes in Markdown format instead of converting to HTML.'),

		attribute_elements: MarkdownAttributeElementOptionsSchema.optional().describe(
			'Define positioning behavior of Markdown attributes for different elements.'
		),
	}),
}).meta({
	name: 'MarkdownSettings',
	description: 'Configuration for Markdown processing engines and formatting options.',
});

export type AttributeListPosition = z.infer<typeof AttributeListPositionSchema>;
export type MarkdownAttributeElementOptions = z.infer<typeof MarkdownAttributeElementOptionsSchema>;
export type MarkdownSettings = z.infer<typeof MarkdownSettingsSchema>;
