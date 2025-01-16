import type Scrapbooker from '@cloudcannon/snippet-types';
import type { ReducedCascade } from './cascade';
import type { WithPickerPreview, WithPreview } from './preview';

// TODO: use SnippetConfig from @cloudcannon/scrap-booker when ParserConfig issue resolved.
export interface SnippetConfig extends ReducedCascade, WithPreview, WithPickerPreview {
	/**
	 * Name of the snippet.
	 */
	snippet?: string;
	/**
	 * The template that this snippet should inherit, out of the available Shortcode Templates.
	 */
	template?: string;
	/**
	 * Whether this snippet can appear inline (within a sentence). Defaults to false, which will treat
	 * this snippet as a block-level element in the content editor.
	 */
	inline?: boolean;
	/**
	 * Controls how selected items are rendered. Defaults to 'card', or 'inline' if `inline` is true.
	 */
	view?: 'card' | 'inline' | 'gallery';
	/**
	 * Whether this snippet treats whitespace as-is or not.
	 */
	strict_whitespace?: boolean;
	/**
	 * The variables required for the selected template.
	 */
	definitions?: Record<string, unknown>;
	/**
	 * Alternate configurations for this snippet.
	 */
	alternate_formats?: SnippetConfig[];
	/**
	 * The parameters of this snippet.
	 */
	params?: Record<string, unknown>; // TODO: use ParserConfig from @cloudcannon/scrap-booker.
}

export interface SnippetsImports {
	/**
	 * Default snippets for Hugo SSG.
	 */
	hugo?:
		| boolean
		| {
				/**
				 * The list of excluded snippets. If unset, all snippets are excluded unless defined in
				 * `include`.
				 *
				 * @uniqueItems
				 */
				exclude: Array<keyof typeof Scrapbooker.defaults.hugo.snippets>;
		  }
		| {
				/**
				 * The list of included snippets. If unset, all snippets are included unless defined in
				 * `exclude`.
				 *
				 * @uniqueItems
				 */
				include: Array<keyof typeof Scrapbooker.defaults.hugo.snippets>;
		  };
	/**
	 * Default snippets for Jekyll SSG.
	 */
	jekyll?:
		| boolean
		| {
				/**
				 * The list of excluded snippets. If unset, all snippets are excluded unless defined in
				 * `include`.
				 *
				 * @uniqueItems
				 */
				exclude: Array<keyof typeof Scrapbooker.defaults.jekyll.snippets>;
		  }
		| {
				/**
				 * The list of included snippets. If unset, all snippets are included unless defined in
				 * `exclude`.
				 *
				 * @uniqueItems
				 */
				include: Array<keyof typeof Scrapbooker.defaults.jekyll.snippets>;
		  };
	/**
	 * Default snippets for MDX-based content.
	 */
	mdx?:
		| boolean
		| {
				/**
				 * The list of excluded snippets. If unset, all snippets are excluded unless defined in
				 * `include`.
				 *
				 * @uniqueItems
				 */
				exclude: Array<keyof typeof Scrapbooker.defaults.mdx.snippets>;
		  }
		| {
				/**
				 * The list of included snippets. If unset, all snippets are included unless defined in
				 * `exclude`.
				 *
				 * @uniqueItems
				 */
				include: Array<keyof typeof Scrapbooker.defaults.mdx.snippets>;
		  };
	/**
	 * Default snippets for Eleventy SSG Liquid files.
	 */
	eleventy_liquid?:
		| boolean
		| {
				/**
				 * The list of excluded snippets. If unset, all snippets are excluded unless defined in
				 * `include`.
				 *
				 * @uniqueItems
				 */
				exclude: Array<keyof typeof Scrapbooker.defaults.eleventy_liquid.snippets>;
		  }
		| {
				/**
				 * The list of included snippets. If unset, all snippets are included unless defined in
				 * `exclude`.
				 *
				 * @uniqueItems
				 */
				include: Array<keyof typeof Scrapbooker.defaults.eleventy_liquid.snippets>;
		  };
	/**
	 * Default snippets for Eleventy SSG Nunjucks files.
	 */
	eleventy_nunjucks?:
		| boolean
		| {
				/**
				 * The list of excluded snippets. If unset, all snippets are excluded unless defined in
				 * `include`.
				 *
				 * @uniqueItems
				 */
				exclude: Array<keyof typeof Scrapbooker.defaults.eleventy_nunjucks.snippets>;
		  }
		| {
				/**
				 * The list of included snippets. If unset, all snippets are included unless defined in
				 * `exclude`.
				 *
				 * @uniqueItems
				 */
				include: Array<keyof typeof Scrapbooker.defaults.eleventy_nunjucks.snippets>;
		  };
	/**
	 * Default snippets for Markdoc-based content.
	 */
	markdoc?:
		| boolean
		| {
				/**
				 * The list of excluded snippets. If unset, all snippets are excluded unless defined in
				 * `include`.
				 *
				 * @uniqueItems
				 */
				exclude: Array<keyof typeof Scrapbooker.defaults.markdoc.snippets>;
		  }
		| {
				/**
				 * The list of included snippets. If unset, all snippets are included unless defined in
				 * `exclude`.
				 *
				 * @uniqueItems
				 */
				include: Array<keyof typeof Scrapbooker.defaults.markdoc.snippets>;
		  };
	/**
	 * Default snippets for content using Python markdown extensions.
	 */
	python_markdown_extensions?:
		| boolean
		| {
				/**
				 * The list of excluded snippets. If unset, all snippets are excluded unless defined in
				 * `include`.
				 *
				 * @uniqueItems
				 */
				exclude: Array<keyof typeof Scrapbooker.defaults.python_markdown_extensions.snippets>;
		  }
		| {
				/**
				 * The list of included snippets. If unset, all snippets are included unless defined in
				 * `exclude`.
				 *
				 * @uniqueItems
				 */
				include: Array<keyof typeof Scrapbooker.defaults.python_markdown_extensions.snippets>;
		  };
	/**
	 * Default snippets for Docusaurus SSG.
	 */
	docusaurus_mdx?:
		| boolean
		| {
				/**
				 * The list of excluded snippets. If unset, all snippets are excluded unless defined in
				 * `include`.
				 *
				 * @uniqueItems
				 */
				exclude: Array<keyof typeof Scrapbooker.defaults.docusaurus_mdx.snippets>;
		  }
		| {
				/**
				 * The list of included snippets. If unset, all snippets are included unless defined in
				 * `exclude`.
				 *
				 * @uniqueItems
				 */
				include: Array<keyof typeof Scrapbooker.defaults.docusaurus_mdx.snippets>;
		  };
}
