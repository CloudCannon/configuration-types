import * as z from 'zod';

export const AttributeListPositionSchema = z
	.enum(['none', 'right', 'space right', 'below', 'newline below', 'right-of-prefix'])
	.meta({
		id: 'AttributeListPosition',
		title: 'Attribute List Position',
		description: 'Positioning options for Markdown attribute elements.',
	});

export const MarkdownAttributeElementOptionsSchema = z
	.object({
		inline: AttributeListPositionSchema.optional(),
		block: AttributeListPositionSchema.optional(),
	})
	.catchall(AttributeListPositionSchema)
	.meta({
		title: 'Markdown Attribute Element Options',
		description: 'Configuration for positioning Markdown attributes on different element types.',
	});

export const MarkdownSettingsSchema = z
	.object({
		engine: z.enum(['commonmark', 'kramdown']).default('commonmark').optional().meta({
			description: 'The flavor of Markdown to use to convert between HTML and Markdown.',
		}),
		options: z
			.object({
				html: z.boolean().optional().meta({
					description: 'Output HTML tags from source.',
				}),
				xhtml: z.boolean().optional().meta({
					description: 'Use `/` to close single tags (e.g. `<br />`).',
				}),
				breaks: z.boolean().optional().meta({
					description: 'Convert `\\n` in paragraphs into `<br>`.',
				}),
				linkify: z.boolean().optional().meta({
					description: 'Autoconvert URL-like text to links.',
				}),
				typographer: z.boolean().optional().meta({
					description:
						'Enable some language-neutral replacement, as well as quotes beautification.',
				}),
				quotes: z.string().optional().meta({
					description:
						'Double + single quotes replacement pairs, when typographer enabled and smartquotes on. For example, you can use "«»„"" for Russian, ""„"‚"" for German, and ["«\\xA0", "\\xA0»", "‹\\xA0", "\\xA0›"] for French (including `nbsp`).',
				}),
				spaced_lists: z.boolean().optional().meta({
					description: 'Output lists with an extra space in Markdown.',
				}),
				sentence_per_line: z.boolean().optional().meta({
					description: 'Add linebreaks between sentences in Markdown.',
				}),
				gfm: z.boolean().optional().meta({
					description: 'Enable GFM mode.',
				}),
				code_block_fences: z.enum(['```', '~~~']).optional().meta({
					description: 'Determines which style of code block fences to use.',
				}),
				treat_indentation_as_code: z.boolean().optional().meta({
					description: 'Determines whether 4 spaces on indentation should be read as a code block.',
				}),
				escape_snippets_in_code_blocks: z.boolean().optional().meta({
					description: 'Render snippets as plain text within code blocks.',
				}),
				table: z.boolean().optional().meta({
					description: 'Output tables in Markdown format.',
				}),
				strikethrough: z.boolean().optional().meta({
					description: 'Output strikes in wrapped in double tildes (e.g. `~~strike~~`).',
				}),
				subscript: z.boolean().optional().meta({
					description: 'Output subscript in wrapped in tildes (e.g. `~sub~`).',
				}),
				superscript: z.boolean().optional().meta({
					description: 'Output superscript in wrapped in carets (e.g. `^super^`).',
				}),
				heading_ids: z.boolean().optional().meta({
					description: 'Generate IDs for headings.',
				}),
				attributes: z.boolean().optional().meta({
					description: 'Save element attributes in Markdown format instead of converting to HTML.',
				}),
				attribute_elements: MarkdownAttributeElementOptionsSchema.optional().meta({
					description: 'Define positioning behavior of Markdown attributes for different elements.',
				}),
			})
			.optional(),
	})
	.meta({
		title: 'Markdown Settings',
		description: 'Configuration for Markdown processing engines and formatting options.',
	});

export type AttributeListPosition = z.infer<typeof AttributeListPositionSchema>;
export type MarkdownAttributeElementOptions = z.infer<typeof MarkdownAttributeElementOptionsSchema>;
export type MarkdownSettings = z.infer<typeof MarkdownSettingsSchema>;
