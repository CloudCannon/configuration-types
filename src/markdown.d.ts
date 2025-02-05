export type AttributeListPosition =
	| 'none'
	| 'right'
	| 'space right'
	| 'below'
	| 'newline below'
	| 'right-of-prefix';

export type MarkdownAttributeElementOptions = {
	inline?: AttributeListPosition;
	block?: AttributeListPosition;
} & {
	[index: string]: AttributeListPosition;
};

export interface MarkdownSettings {
	/**
	 * The flavor of Markdown to use to convert between HTML and Markdown.
	 *
	 * @default commonmark
	 */
	engine: 'commonmark' | 'kramdown';
	options: {
		/**
		 * Output HTML tags from source.
		 */
		html?: boolean;
		/**
		 * Use `/` to close single tags (e.g. `<br />`).
		 */
		xhtml?: boolean;
		/**
		 * Convert `\n` in paragraphs into `<br>`.
		 */
		breaks?: boolean;
		/**
		 * Autoconvert URL-like text to links.
		 */
		linkify?: boolean;
		/**
		 * Enable some language-neutral replacement, as well as quotes beautification.
		 */
		typographer?: boolean;
		/**
		 * Double + single quotes replacement pairs, when typographer enabled and smartquotes on. For
		 * example, you can use `'«»„“'` for Russian, `'„“‚‘'` for German, and `['«\xA0', '\xA0»',
		 * '‹\xA0', '\xA0›']` for French (including `nbsp`).
		 */
		quotes?: string;
		/**
		 * Output lists with an extra space in Markdown.
		 */
		spaced_lists?: boolean;
		/**
		 * Add linebreaks between sentences in Markdown.
		 */
		sentence_per_line?: boolean;
		/**
		 * Enable GFM mode.
		 */
		gfm?: boolean;
		/**
		 * Determines which style of code block fences to use.
		 */
		code_block_fences?: '```' | '~~~';
		/**
		 * Determines whether 4 spaces on indentation should be read as a code block.
		 */
		treat_indentation_as_code?: boolean;
		/**
		 * Render snippets as plain text within code blocks.
		 */
		escape_snippets_in_code_blocks?: boolean;
		/**
		 * Output tables in Markdown format.
		 */
		table?: boolean;
		/**
		 * Output strikes in wrapped in double tildes (e.g. `~~strike~~`).
		 */
		strikethrough?: boolean;
		/**
		 * Output subscript in wrapped in tildes (e.g. `~sub~`).
		 */
		subscript?: boolean;
		/**
		 * Output superscript in wrapped in carets (e.g. `^super^`).
		 */
		superscript?: boolean;
		/**
		 * Generate IDs for headings.
		 */
		heading_ids?: boolean;
		/**
		 * Save element attributes in Markdown format instead of converting to HTML.
		 */
		attributes?: boolean;
		/**
		 * Define positioning behavior of Markdown attributes for different elements.
		 */
		attribute_elements?: MarkdownAttributeElementOptions;
	};
}
