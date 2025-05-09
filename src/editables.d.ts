import type { ImageResizeable } from './image-resizeable';
import type { WithPaths } from './paths';

export interface Editables {
	/**
	 * Contains input options for the Content Editor.
	 */
	content?: BlockEditable;
	/**
	 * Contains input options for block Editable Regions.
	 */
	block?: BlockEditable;
	/**
	 * Contains input options for link Editable Regions.
	 */
	link?: LinkEditable;
	/**
	 * Contains input options for image Editable Regions.
	 */
	image?: ImageEditable;
	/**
	 * Contains input options for text Editable Regions.
	 */
	text?: TextEditable;
}

export interface ToolbarOptions {
	/**
	 * Enables a control to wrap blocks of text in block quotes.
	 *
	 * @default true
	 */
	blockquote?: boolean;
	/**
	 * Enables a control to insert an unordered list, or to convert selected blocks of text into a
	 * unordered list.
	 *
	 * @default true
	 */
	bulletedlist?: boolean;
	/**
	 * Enables a control to center align text by toggling a class name for a block of text. The value
	 * is the class name the editor should add to align the text. The styles for this class need to be
	 * listed in the `styles` file to take effect outside of the input.
	 */
	center?: string;
	/**
	 * Enables a control to create an inline code element, containing any selected text.
	 *
	 * @default false
	 */
	code_inline?: boolean;
	/**
	 * Enables a control to insert a code block.
	 *
	 * @default false
	 */
	code_block?: boolean;
	/**
	 * Enables both block and inline code controls: `code_block` and `code_inline`.
	 *
	 * @default false
	 */
	code?: boolean;
	/**
	 * Enables a control to insert a region of raw HTML, including YouTube, Vimeo, Tweets, and other
	 * media. Embedded content is sanitized to mitigate XSS risks, which includes removing style tags.
	 * Embeds containing script tags are not loaded in the editor.
	 *
	 * @default false
	 */
	embed?: boolean;
	/**
	 * Enables a drop down menu for structured text. Has options for "p", "h1", "h2", "h3", "h4",
	 * "h5", "h6". Set as space separated options (e.g. "p h1 h2").
	 *
	 * @default p h1 h2 h3 h4 h5 h6
	 */
	format?: string;
	/**
	 * Enables a control to insert a horizontal rule.
	 *
	 * @default false
	 */
	horizontalrule?: boolean;
	/**
	 * Enables a control to insert an image. The image can be uploaded, existing or an external link.
	 *
	 * @default true
	 */
	image?: boolean;
	/**
	 * Enables a control to increase indentation for numbered and unordered lists.
	 *
	 * @default false
	 */
	indent?: boolean;
	/**
	 * Enables a control to justify text by toggling a class name for a block of text. The value is
	 * the class name the editor should add to justify the text. The styles for this class need to be
	 * listed in the `styles` file to take effect outside of the input.
	 */
	justify?: string;
	/**
	 * Enables a control to left align text by toggling a class name for a block of text. The value is
	 * the class name the editor should add to align the text. The styles for this class need to be
	 * listed in the `styles` file to take effect outside of the input.
	 */
	left?: string;
	/**
	 * Enables a control to insert a numbered list, or to convert selected blocks of text into a
	 * numbered list.
	 *
	 * @default true
	 */
	numberedlist?: boolean;
	/**
	 * Enables a control to reduce indentation for numbered and unordered lists.
	 *
	 * @default false
	 */
	outdent?: boolean;
	/**
	 * Enables a control to right align text by toggling a class name for a block of text. The value
	 * is the class name the editor should add to align the text. The styles for this class need to be
	 * listed in the `styles` file to take effect outside of the input.
	 */
	right?: string;
	/**
	 * Enables a control to insert snippets, if any are available.
	 *
	 * @default true
	 */
	snippet?: boolean;
	/**
	 * Enables a drop down menu for editors to style selected text or blocks or text. Styles are the
	 * combination of an element and class name. The value for this option is the path (either source
	 * or build output) to the CSS file containing the styles.
	 */
	styles?: string;
	/**
	 * Enables a control to insert a table. Further options for table cells are available in the
	 * context menu for cells within the editor.
	 *
	 * @default false
	 */
	table?: boolean;
	/**
	 * Enables a control to join the selected block with the block above it.
	 *
	 * @default false
	 */
	join_above?: boolean;
	/**
	 * Enables a control to join the selected block with the block below it.
	 *
	 * @default false
	 */
	join_below?: boolean;
}

export type BlockEditable = ImageResizeable & TextEditable & ToolbarOptions;

export type ImageEditable = ImageResizeable & WithPaths;

export type LinkEditable = WithPaths;

export interface TextEditable extends WithPaths {
	/**
	 * Enables a control to set selected text to bold.
	 *
	 * @default true
	 */
	bold?: boolean;
	/**
	 * Enables a control to copy formatting from text to other text. Only applies to formatting from
	 * `bold`, `italic`, `underline`, `strike`, `subscript`, and `superscript`. Does not copy other
	 * styles or formatting.
	 *
	 * @default false
	 */
	copyformatting?: boolean;
	/**
	 * Enables a control to italicize selected text.
	 *
	 * @default true
	 */
	italic?: boolean;
	/**
	 * Enables a control to create hyperlinks around selected text.
	 *
	 * @default true
	 */
	link?: boolean;
	/**
	 * Enables a control to redo recent edits undone with undo. Redo is always enabled through
	 * standard OS-specific keyboard shortcuts.
	 *
	 * @default false
	 */
	redo?: boolean;
	/**
	 * Enables the control to remove formatting from text. Applies to formatting from `bold`,
	 * `italic`, `underline`, `strike`, `subscript`, and `superscript`. Does not remove other styles
	 * or formatting.
	 *
	 * @default true
	 */
	removeformat?: boolean;
	/**
	 * Enables a control to strike selected text.
	 *
	 * @default false
	 */
	strike?: boolean;
	/**
	 * Enables a control to set selected text to subscript.
	 *
	 * @default false
	 */
	subscript?: boolean;
	/**
	 * Enables a control to set selected text to superscript.
	 *
	 * @default false
	 */
	superscript?: boolean;
	/**
	 * Enables a control to underline selected text.
	 *
	 * @default false
	 */
	underline?: boolean;
	/**
	 * Enables a control to undo recent edits. Undo is always enabled through standard OS-specific
	 * keyboard shortcuts.
	 *
	 * @default false
	 */
	undo?: boolean;
	/**
	 * Defines if the content should be stripped of "custom markup". It is recommended to have this
	 * option turned on once you have all of your rich text options configured. Having
	 * `allow_custom_markup` turned on disables this option. Defaults to false.
	 */
	remove_custom_markup?: boolean;
	/**
	 * Defines if the content can contain "custom markup". It is not recommended to have this option
	 * turned on. Defaults to true for non-content editable regions, false otherwise.
	 */
	allow_custom_markup?: boolean;
}
