import * as z from 'zod';

const ATTRIBUTE_LIST_POSITIONS = [
	'none',
	'right',
	'space right',
	'below',
	'newline below',
	'right-of-prefix',
] as const;
const _AttributeListPositionSchema = z.enum(ATTRIBUTE_LIST_POSITIONS).nullable().optional().meta({
	id: 'AttributeListPosition',
	title: 'Attribute List Position',
	description: 'Positioning options for Markdown attribute elements.',
});
export type AttributeListPosition = (typeof ATTRIBUTE_LIST_POSITIONS)[number] | null | undefined;
export const AttributeListPositionSchema: z.ZodType<AttributeListPosition> =
	_AttributeListPositionSchema;

const _MarkdownAttributeElementOptionsSchema = z
	.object({
		inline: AttributeListPositionSchema.nullable().optional(),
		block: AttributeListPositionSchema.nullable().optional(),
	})
	.catchall(AttributeListPositionSchema)
	.meta({
		title: 'Markdown Attribute Element Options',
		description: 'Configuration for positioning Markdown attributes on different element types.',
	});
export interface MarkdownAttributeElementOptions
	extends z.infer<typeof _MarkdownAttributeElementOptionsSchema> {}
export const MarkdownAttributeElementOptionsSchema: z.ZodType<MarkdownAttributeElementOptions> =
	_MarkdownAttributeElementOptionsSchema;

const _MarkdownSettingsSchema = z
	.object({
		engine: z.enum(['commonmark', 'kramdown']).nullable().default('commonmark').optional().meta({
			description: 'The flavor of Markdown to use to convert between HTML and Markdown.',
		}),
		options: z
			.object({
				html: z.boolean().default(false).optional().meta({
					description: 'Output HTML tags from source.',
				}),
				xhtml: z.boolean().default(false).optional().meta({
					description: 'Use `/` to close single tags (e.g. `<br />`).',
				}),
				breaks: z.boolean().default(false).optional().meta({
					description: 'Convert `\\n` in paragraphs into `<br>`.',
				}),
				linkify: z.boolean().default(false).optional().meta({
					description: 'Autoconvert URL-like text to links.',
				}),
				typographer: z.boolean().default(false).optional().meta({
					description:
						'Enable some language-neutral replacement, as well as quotes beautification.',
				}),
				quotes: z.string().nullable().optional().meta({
					description:
						'Double + single quotes replacement pairs, when typographer enabled and smartquotes on. For example, you can use "«»„"" for Russian, ""„"‚"" for German, and ["«\\xA0", "\\xA0»", "‹\\xA0", "\\xA0›"] for French (including `nbsp`).',
				}),
				spaced_lists: z.boolean().default(false).optional().meta({
					description: 'Output lists with an extra space in Markdown.',
				}),
				sentence_per_line: z.boolean().default(false).optional().meta({
					description: 'Add linebreaks between sentences in Markdown.',
				}),
				gfm: z.boolean().nullable().optional().meta({
					description: 'Enable GFM mode.',
				}),
				code_block_fences: z.enum(['```', '~~~']).nullable().optional().meta({
					description: 'Determines which style of code block fences to use.',
				}),
				treat_indentation_as_code: z.boolean().default(false).optional().meta({
					description: 'Determines whether 4 spaces on indentation should be read as a code block.',
				}),
				escape_snippets_in_code_blocks: z.boolean().default(false).optional().meta({
					description: 'Render snippets as plain text within code blocks.',
				}),
				table: z.boolean().default(false).optional().meta({
					description: 'Output tables in Markdown format.',
				}),
				strikethrough: z.boolean().default(false).optional().meta({
					description: 'Output strikes in wrapped in double tildes (e.g. `~~strike~~`).',
				}),
				subscript: z.boolean().default(false).optional().meta({
					description: 'Output subscript in wrapped in tildes (e.g. `~sub~`).',
				}),
				superscript: z.boolean().default(false).optional().meta({
					description: 'Output superscript in wrapped in carets (e.g. `^super^`).',
				}),
				heading_ids: z.boolean().default(false).optional().meta({
					description: 'Generate IDs for headings.',
				}),
				attributes: z.boolean().default(false).optional().meta({
					description: 'Save element attributes in Markdown format instead of converting to HTML.',
				}),
				attribute_elements: MarkdownAttributeElementOptionsSchema.nullable().optional().meta({
					description: 'Define positioning behavior of Markdown attributes for different elements.',
				}),
			})
			.nullable()
			.optional(),
	})
	.meta({
		title: 'Markdown Settings',
		description: 'Configuration for Markdown processing engines and formatting options.',
	});
export interface MarkdownSettings extends z.infer<typeof _MarkdownSettingsSchema> {}
export const MarkdownSettingsSchema: z.ZodType<MarkdownSettings> = _MarkdownSettingsSchema;
