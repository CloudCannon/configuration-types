import * as z from 'zod/v4';
import { ImageResizeableSchema } from './image-resizeable.ts';
import { WithPathsSchema } from './paths.ts';

export const ToolbarOptionsSchema = z.object({
	blockquote: z
		.boolean()
		.default(true)
		.optional()
		.describe('Enables a control to wrap blocks of text in block quotes.'),

	bulletedlist: z
		.boolean()
		.default(true)
		.optional()
		.describe(
			'Enables a control to insert an unordered list, or to convert selected blocks of text into a unordered list.'
		),

	center: z
		.string()
		.optional()
		.describe(
			'Enables a control to center align text by toggling a class name for a block of text. The value is the class name the editor should add to align the text. The styles for this class need to be listed in the `styles` file to take effect outside of the input.'
		),

	code_inline: z
		.boolean()
		.default(false)
		.optional()
		.describe('Enables a control to create an inline code element, containing any selected text.'),

	code_block: z
		.boolean()
		.default(false)
		.optional()
		.describe('Enables a control to insert a code block.'),

	code: z
		.boolean()
		.default(false)
		.optional()
		.describe('Enables both block and inline code controls: `code_block` and `code_inline`.'),

	embed: z
		.boolean()
		.default(false)
		.optional()
		.describe(
			'Enables a control to insert a region of raw HTML, including YouTube, Vimeo, Tweets, and other media. Embedded content is sanitized to mitigate XSS risks, which includes removing style tags. Embeds containing script tags are not loaded in the editor.'
		),

	format: z
		.string()
		.default('p h1 h2 h3 h4 h5 h6')
		.optional()
		.describe(
			'Enables a drop down menu for structured text. Has options for "p", "h1", "h2", "h3", "h4", "h5", "h6". Set as space separated options (e.g. "p h1 h2").'
		),

	horizontalrule: z
		.boolean()
		.default(false)
		.optional()
		.describe('Enables a control to insert a horizontal rule.'),

	image: z
		.boolean()
		.default(true)
		.optional()
		.describe(
			'Enables a control to insert an image. The image can be uploaded, existing or an external link.'
		),

	indent: z
		.boolean()
		.default(false)
		.optional()
		.describe('Enables a control to increase indentation for numbered and unordered lists.'),

	justify: z
		.string()
		.optional()
		.describe(
			'Enables a control to justify text by toggling a class name for a block of text. The value is the class name the editor should add to justify the text. The styles for this class need to be listed in the `styles` file to take effect outside of the input.'
		),

	left: z
		.string()
		.optional()
		.describe(
			'Enables a control to left align text by toggling a class name for a block of text. The value is the class name the editor should add to align the text. The styles for this class need to be listed in the `styles` file to take effect outside of the input.'
		),

	numberedlist: z
		.boolean()
		.default(true)
		.optional()
		.describe(
			'Enables a control to insert a numbered list, or to convert selected blocks of text into a numbered list.'
		),

	outdent: z
		.boolean()
		.default(false)
		.optional()
		.describe('Enables a control to reduce indentation for numbered and unordered lists.'),

	right: z
		.string()
		.optional()
		.describe(
			'Enables a control to right align text by toggling a class name for a block of text. The value is the class name the editor should add to align the text. The styles for this class need to be listed in the `styles` file to take effect outside of the input.'
		),

	snippet: z
		.boolean()
		.default(true)
		.optional()
		.describe('Enables a control to insert snippets, if any are available.'),

	styles: z
		.string()
		.optional()
		.describe(
			'Enables a drop down menu for editors to style selected text or blocks or text. Styles are the combination of an element and class name. The value for this option is the path (either source or build output) to the CSS file containing the styles.'
		),

	table: z
		.boolean()
		.default(false)
		.optional()
		.describe(
			'Enables a control to insert a table. Further options for table cells are available in the context menu for cells within the editor.'
		),

	join_above: z
		.boolean()
		.default(false)
		.optional()
		.describe('Enables a control to join the selected block with the block above it.'),

	join_below: z
		.boolean()
		.default(false)
		.optional()
		.describe('Enables a control to join the selected block with the block below it.'),
});

export const TextEditableSchema = WithPathsSchema.extend({
	bold: z
		.boolean()
		.default(true)
		.optional()
		.describe('Enables a control to set selected text to bold.'),

	copyformatting: z
		.boolean()
		.default(false)
		.optional()
		.describe(
			'Enables a control to copy formatting from text to other text. Only applies to formatting from `bold`, `italic`, `underline`, `strike`, `subscript`, and `superscript`. Does not copy other styles or formatting.'
		),

	italic: z
		.boolean()
		.default(true)
		.optional()
		.describe('Enables a control to italicize selected text.'),

	link: z
		.boolean()
		.default(true)
		.optional()
		.describe('Enables a control to create hyperlinks around selected text.'),

	redo: z
		.boolean()
		.default(false)
		.optional()
		.describe(
			'Enables a control to redo recent edits undone with undo. Redo is always enabled through standard OS-specific keyboard shortcuts.'
		),

	removeformat: z
		.boolean()
		.default(true)
		.optional()
		.describe(
			'Enables the control to remove formatting from text. Applies to formatting from `bold`, `italic`, `underline`, `strike`, `subscript`, and `superscript`. Does not remove other styles or formatting.'
		),

	strike: z
		.boolean()
		.default(false)
		.optional()
		.describe('Enables a control to strike selected text.'),

	subscript: z
		.boolean()
		.default(false)
		.optional()
		.describe('Enables a control to set selected text to subscript.'),

	superscript: z
		.boolean()
		.default(false)
		.optional()
		.describe('Enables a control to set selected text to superscript.'),

	underline: z
		.boolean()
		.default(false)
		.optional()
		.describe('Enables a control to underline selected text.'),

	undo: z
		.boolean()
		.default(false)
		.optional()
		.describe(
			'Enables a control to undo recent edits. Undo is always enabled through standard OS-specific keyboard shortcuts.'
		),

	remove_custom_markup: z
		.boolean()
		.optional()
		.describe(
			'Defines if the content should be stripped of "custom markup". It is recommended to have this option turned on once you have all of your rich text options configured. Having `allow_custom_markup` turned on disables this option. Defaults to false.'
		),

	allow_custom_markup: z
		.boolean()
		.optional()
		.describe(
			'Defines if the content can contain "custom markup". It is not recommended to have this option turned on. Defaults to true for non-content editable regions, false otherwise.'
		),
});

// Type compositions using intersection
export const BlockEditableSchema = z.object({
	...ImageResizeableSchema.shape,
	...TextEditableSchema.shape,
	...ToolbarOptionsSchema.shape,
});

export const ImageEditableSchema = z.object({
	...ImageResizeableSchema.shape,
	...WithPathsSchema.shape,
});

export const LinkEditableSchema = WithPathsSchema;

export const EditablesSchema = z.object({
	content: BlockEditableSchema.optional().describe(
		'Contains input options for the Content Editor.'
	),

	block: BlockEditableSchema.optional().describe(
		'Contains input options for block Editable Regions.'
	),

	link: LinkEditableSchema.optional().describe('Contains input options for link Editable Regions.'),

	image: ImageEditableSchema.optional().describe(
		'Contains input options for image Editable Regions.'
	),

	text: TextEditableSchema.optional().describe('Contains input options for text Editable Regions.'),
}).meta({
	name: 'Editables',
	description: 'Configuration for editable regions in the Visual Editor, including content, block, link, image, and text editing options.',
});

export type ToolbarOptions = z.infer<typeof ToolbarOptionsSchema>;
export type TextEditable = z.infer<typeof TextEditableSchema>;
export type BlockEditable = z.infer<typeof BlockEditableSchema>;
export type ImageEditable = z.infer<typeof ImageEditableSchema>;
export type LinkEditable = z.infer<typeof LinkEditableSchema>;
export type Editables = z.infer<typeof EditablesSchema>;
