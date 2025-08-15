import * as z from 'zod';
import { ImageOptionsSchema } from './image-options';
import { PathsSchema } from './paths';

export const TextEditableSchema = z.object({
	paths: PathsSchema.optional(),

	bold: z.boolean().default(true).optional().meta({
		id: 'bold',
		description: 'Enables a control to set selected text to bold.',
	}),

	copyformatting: z.boolean().default(false).optional().meta({
		id: 'copyformatting',
		description:
			'Enables a control to copy formatting from text to other text. Only applies to formatting from `bold`, `italic`, `underline`, `strike`, `subscript`, and `superscript`. Does not copy other styles or formatting.',
	}),

	italic: z.boolean().default(true).optional().meta({
		id: 'italic',
		description: 'Enables a control to italicize selected text.',
	}),

	link: z.boolean().default(true).optional().meta({
		id: 'link',
		description: 'Enables a control to create hyperlinks around selected text.',
	}),

	redo: z.boolean().default(false).optional().meta({
		id: 'redo',
		description:
			'Enables a control to redo recent edits undone with undo. Redo is always enabled through standard OS-specific keyboard shortcuts.',
	}),

	removeformat: z.boolean().default(true).optional().meta({
		id: 'removeformat',
		description:
			'Enables the control to remove formatting from text. Applies to formatting from `bold`, `italic`, `underline`, `strike`, `subscript`, and `superscript`. Does not remove other styles or formatting.',
	}),

	strike: z.boolean().default(false).optional().meta({
		id: 'strike',
		description: 'Enables a control to strike selected text.',
	}),

	subscript: z.boolean().default(false).optional().meta({
		id: 'subscript',
		description: 'Enables a control to set selected text to subscript.',
	}),

	superscript: z.boolean().default(false).optional().meta({
		id: 'superscript',
		description: 'Enables a control to set selected text to superscript.',
	}),

	underline: z.boolean().default(false).optional().meta({
		id: 'underline',
		description: 'Enables a control to underline selected text.',
	}),

	undo: z.boolean().default(false).optional().meta({
		id: 'undo',
		description:
			'Enables a control to undo recent edits. Undo is always enabled through standard OS-specific keyboard shortcuts.',
	}),

	remove_custom_markup: z.boolean().optional().meta({
		id: 'remove_custom_markup',
		description:
			'Defines if the content should be stripped of "custom markup". It is recommended to have this option turned on once you have all of your rich text options configured. Having `allow_custom_markup` turned on disables this option. Defaults to false.',
	}),

	allow_custom_markup: z.boolean().optional().meta({
		id: 'allow_custom_markup',
		description:
			'Defines if the content can contain "custom markup". It is not recommended to have this option turned on. Defaults to true for non-content editable regions, false otherwise.',
	}),
});

export const ToolbarOptionsSchema = z.object({
	...TextEditableSchema.shape,

	blockquote: z.boolean().default(true).optional().meta({
		id: 'blockquote',
		description: 'Enables a control to wrap blocks of text in block quotes.',
	}),

	bulletedlist: z.boolean().default(true).optional().meta({
		id: 'bulletedlist',
		description:
			'Enables a control to insert an unordered list, or to convert selected blocks of text into a unordered list.',
	}),

	center: z.string().optional().meta({
		id: 'center',
		description:
			'Enables a control to center align text by toggling a class name for a block of text. The value is the class name the editor should add to align the text. The styles for this class need to be listed in the `styles` file to take effect outside of the input.',
	}),

	code_inline: z.boolean().default(false).optional().meta({
		id: 'code_inline',
		description:
			'Enables a control to create an inline code element, containing any selected text.',
	}),

	code_block: z.boolean().default(false).optional().meta({
		id: 'code_block',
		description: 'Enables a control to insert a code block.',
	}),

	code: z.boolean().default(false).optional().meta({
		id: 'code',
		description: 'Enables both block and inline code controls: `code_block` and `code_inline`.',
	}),

	embed: z.boolean().default(false).optional().meta({
		id: 'embed',
		description:
			'Enables a control to insert a region of raw HTML, including YouTube, Vimeo, Tweets, and other media. Embedded content is sanitized to mitigate XSS risks, which includes removing style tags. Embeds containing script tags are not loaded in the editor.',
	}),

	format: z.string().default('p h1 h2 h3 h4 h5 h6').optional().meta({
		id: 'format',
		description:
			'Enables a drop down menu for structured text. Has options for "p", "h1", "h2", "h3", "h4", "h5", "h6". Set as space separated options (e.g. "p h1 h2").',
	}),

	horizontalrule: z.boolean().default(false).optional().meta({
		id: 'horizontalrule',
		description: 'Enables a control to insert a horizontal rule.',
	}),

	image: z.boolean().default(true).optional().meta({
		id: 'image',
		description:
			'Enables a control to insert an image. The image can be uploaded, existing or an external link.',
	}),

	indent: z.boolean().default(false).optional().meta({
		id: 'indent',
		description: 'Enables a control to increase indentation for numbered and unordered lists.',
	}),

	justify: z.string().optional().meta({
		id: 'justify',
		description:
			'Enables a control to justify text by toggling a class name for a block of text. The value is the class name the editor should add to justify the text. The styles for this class need to be listed in the `styles` file to take effect outside of the input.',
	}),

	left: z.string().optional().meta({
		id: 'left',
		description:
			'Enables a control to left align text by toggling a class name for a block of text. The value is the class name the editor should add to align the text. The styles for this class need to be listed in the `styles` file to take effect outside of the input.',
	}),

	numberedlist: z.boolean().default(true).optional().meta({
		id: 'numberedlist',
		description:
			'Enables a control to insert a numbered list, or to convert selected blocks of text into a numbered list.',
	}),

	outdent: z.boolean().default(false).optional().meta({
		id: 'outdent',
		description: 'Enables a control to reduce indentation for numbered and unordered lists.',
	}),

	right: z.string().optional().meta({
		id: 'right',
		description:
			'Enables a control to right align text by toggling a class name for a block of text. The value is the class name the editor should add to align the text. The styles for this class need to be listed in the `styles` file to take effect outside of the input.',
	}),

	snippet: z.boolean().default(true).optional().meta({
		id: 'snippet',
		description: 'Enables a control to insert snippets, if any are available.',
	}),

	styles: z.string().optional().meta({
		id: 'styles',
		description:
			'Enables a drop down menu for editors to style selected text or blocks or text. Styles are the combination of an element and class name. The value for this option is the path (either source or build output) to the CSS file containing the styles.',
	}),

	table: z.boolean().default(false).optional().meta({
		id: 'table',
		description:
			'Enables a control to insert a table. Further options for table cells are available in the context menu for cells within the editor.',
	}),

	join_above: z.boolean().default(false).optional().meta({
		id: 'join_above',
		description: 'Enables a control to join the selected block with the block above it.',
	}),

	join_below: z.boolean().default(false).optional().meta({
		id: 'join_below',
		description: 'Enables a control to join the selected block with the block below it.',
	}),
});

export const BlockEditableSchema = z.object({
	...ImageOptionsSchema.shape,
	...TextEditableSchema.shape,
	...ToolbarOptionsSchema.shape,
});

export const ImageEditableSchema = z.object({
	...ImageOptionsSchema.shape,
	paths: PathsSchema.optional(),
});

export const LinkEditableSchema = z.object({
	paths: PathsSchema.optional(),
});

export const EditablesSchema = z.object({
	content: BlockEditableSchema.optional().meta({
		description: 'Contains input options for the Content Editor.',
	}),

	block: BlockEditableSchema.optional().meta({
		description: 'Contains input options for block Editable Regions.',
	}),

	link: LinkEditableSchema.optional().meta({
		description: 'Contains input options for link Editable Regions.',
	}),

	image: ImageEditableSchema.optional().meta({
		description: 'Contains input options for image Editable Regions.',
	}),

	text: TextEditableSchema.optional().meta({
		description: 'Contains input options for text Editable Regions.',
	}),
});

export type ToolbarOptions = z.infer<typeof ToolbarOptionsSchema>;
export type TextEditable = z.infer<typeof TextEditableSchema>;
export type BlockEditable = z.infer<typeof BlockEditableSchema>;
export type ImageEditable = z.infer<typeof ImageEditableSchema>;
export type LinkEditable = z.infer<typeof LinkEditableSchema>;
export type Editables = z.infer<typeof EditablesSchema>;
