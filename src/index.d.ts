import Scrapbooker from '@cloudcannon/snippet-types';

import type { Icon } from './icon';
import type { Timezone } from './timezone';
import type { MimeType } from './mime-type';
import type { Theme } from './theme';
import type { Syntax } from './syntax';

export type { Icon, Timezone, MimeType, Theme, Syntax };
export type InstanceValue = 'UUID' | 'NOW';
export type EditorKey = 'visual' | 'content' | 'data';
export type SortOrder = 'ascending' | 'descending' | 'asc' | 'desc';

// TODO: use SnippetConfig from @cloudcannon/scrap-booker when ParserConfig issue resolved.
export interface SnippetConfig extends ReducedCascade, Previewable, PickerPreviewable {
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
	 * Whether this snippet treats whitespace as-is or not.
	 */
	strict_whitespace?: boolean;
	/**
	 * The variables required for the selected template.
	 */
	definitions?: Record<string, any>;
	/**
	 * Alternate configurations for this snippet.
	 */
	alternate_formats?: SnippetConfig[];
	/**
	 * The parameters of this snippet.
	 */
	params?: Record<string, any>; // TODO: use ParserConfig from @cloudcannon/scrap-booker.
}

type SnippetImportKey = keyof typeof Scrapbooker.defaults;

interface SnippetsImport<T> {
	/**
	 * The list of excluded snippets. If unset, all snippets are excluded unless defined in `include`.
	 */
	exclude?: Array<T>;
	/**
	 * The list of included snippets. If unset, all snippets are included unless defined in `exclude`.
	 */
	include?: Array<T>;
}

export interface SnippetsImports {
	/**
	 * Default snippets for Hugo SSG.
	 */
	hugo?: boolean | SnippetsImport<keyof typeof Scrapbooker.defaults.hugo.snippets>;
	/**
	 * Default snippets for Jekyll SSG.
	 */
	jekyll?: boolean | SnippetsImport<keyof typeof Scrapbooker.defaults.jekyll.snippets>;
	/**
	 * Default snippets for MDX-based content.
	 */
	mdx?: boolean | SnippetsImport<keyof typeof Scrapbooker.defaults.mdx.snippets>;
	/**
	 * Default snippets for Eleventy SSG Liquid files.
	 */
	eleventy_liquid?:
		| boolean
		| SnippetsImport<keyof typeof Scrapbooker.defaults.eleventy_liquid.snippets>;
	/**
	 * Default snippets for Eleventy SSG Nunjucks files.
	 */
	eleventy_nunjucks?:
		| boolean
		| SnippetsImport<keyof typeof Scrapbooker.defaults.eleventy_nunjucks.snippets>;
	/**
	 * Default snippets for Markdoc-based content.
	 */
	markdoc?: boolean | SnippetsImport<keyof typeof Scrapbooker.defaults.markdoc.snippets>;
	/**
	 * Default snippets for content using Python markdown extensions.
	 */
	python_markdown_extensions?:
		| boolean
		| SnippetsImport<keyof typeof Scrapbooker.defaults.python_markdown_extensions.snippets>;
	/**
	 * Default snippets for Docusaurus SSG.
	 */
	docusaurus_mdx?:
		| boolean
		| SnippetsImport<keyof typeof Scrapbooker.defaults.docusaurus_mdx.snippets>;
}

interface WithSnippets {
	/**
	 * Configuration for custom snippets.
	 */
	_snippets?: Record<string, SnippetConfig>;
	/**
	 * Provides control over which snippets are available to use and/or extend within `_snippets`.
	 */
	_snippets_imports?: SnippetsImports;
	/**
	 * Extended option used when creating more complex custom snippets.
	 */
	_snippets_templates?: Record<string, SnippetConfig>;
	/**
	 * Extended option used when creating more complex custom snippets.
	 */
	_snippets_definitions?: Record<string, SnippetConfig>;
}

interface ImageResizeable {
	/**
	 * Sets the format images are converted to prior to upload. The extension of the file is updated
	 * to match. Defaults to keeping the mime type of the uploaded file.
	 */
	mime_type?: 'image/jpeg' | 'image/png';
	/**
	 * Controls whether or not the JPEG headers defining how an image should be rotated before being
	 * displayed is baked into images prior to upload.
	 *
	 * @default true
	 */
	correct_orientation?: boolean;
	/**
	 * Sets how uploaded image files are resized with a bounding box defined by width and height prior
	 * to upload. Has no effect when selecting existing images, or if width and height are unset.
	 *
	 * @default 'contain'
	 */
	resize_style?: 'cover' | 'contain' | 'stretch' | 'crop';
	/**
	 * Defines the width of the bounding box used in the image resizing process defined with
	 * resize_style.
	 */
	width?: number;
	/**
	 * Defines the height of the bounding box used in the image resizing process defined with
	 * resize_style.
	 */
	height?: number;
	/**
	 * Controls whether or not images can be upscaled to fit the bounding box during resize prior to
	 * upload. Has no effect if files are not resized.
	 *
	 * @default false
	 */
	expandable?: boolean;
	/**
	 * Instructs the editor to save `width` and `height` attributes on the image elements. This can
	 * prevent pop-in as a page loads.
	 *
	 * @default true
	 */
	image_size_attributes?: boolean;
	/**
	 * If you have one or more DAMs connected to your site, you can use this key to list which asset
	 * sources can be uploaded to and selected from.
	 */
	allowed_sources?: string[];
	/**
	 * Enable to skip the image resizing process configured for this input when selecting existing
	 * images.
	 *
	 * @default false
	 */
	prevent_resize_existing_files?: boolean;
	/**
	 * Definitions for creating additional images of different sizes when uploading or selecting
	 * existing files.
	 */
	sizes?: {
		/**
		 * A number suffixed with "x" (relative size) or "w" (fixed width) for setting the dimensions of
		 * the image (e.g. 2x, 3x, 100w, 360w).
		 */
		size: string;
		/**
		 * A reference to another input that is given the path to this additional image file.
		 */
		target?: string;
	}[];
}

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

export interface BlockEditable extends ImageResizeable, TextEditable {
	/**
	 * Enables a control to wrap blocks of text in block quotes.
	 */
	blockquote?: boolean;
	/**
	 * Enables a control to insert an unordered list, or to convert selected blocks of text into a
	 * unordered list.
	 */
	bulletedlist?: boolean;
	/**
	 * Enables a control to center align text by toggling a class name for a block of text. The value
	 * is the class name the editor should add to align the text. The styles for this class need to be
	 * listed in the `styles` file to take effect outside of the input.
	 */
	center?: string;
	/**
	 * Enables a control to set selected text to inline code, and unselected blocks of text to code
	 * blocks.
	 */
	code?: boolean;
	/**
	 * Enables a control to insert a region of raw HTML, including YouTube, Vimeo, Tweets, and other
	 * media. Embedded content is sanitized to mitigate XSS risks, which includes removing style tags.
	 * Embeds containing script tags are not loaded in the editor.
	 */
	embed?: boolean;
	/**
	 * Enables a drop down menu for structured text. Has options for "p", "h1", "h2", "h3", "h4",
	 * "h5", "h6". Set as space separated options (e.g. "p h1 h2").
	 */
	format?: string;
	/**
	 * Enables a control to insert a horizontal rule.
	 */
	horizontalrule?: boolean;
	/**
	 * Enables a control to insert an image. The image can be uploaded, existing or an external link.
	 */
	image?: boolean;
	/**
	 * Enables a control to increase indentation for numbered and unordered lists.
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
	 */
	numberedlist?: boolean;
	/**
	 * Enables a control to reduce indentation for numbered and unordered lists.
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
	 */
	table?: boolean;
}

interface WithReducedPaths {
	/**
	 * Paths to where new asset files are uploaded to. They also set the default path when choosing
	 * existing images, and linking to existing files. Each path is relative to global `source`.
	 * Defaults to the global `paths`.
	 */
	paths?: ReducedPaths;
}

export interface ImageEditable extends ImageResizeable, WithReducedPaths {}

export interface LinkEditable extends WithReducedPaths {}

export interface TextEditable extends WithReducedPaths {
	/**
	 * Enables a control to set selected text to bold.
	 */
	bold?: boolean;
	/**
	 * Enables a control to copy formatting from text to other text. Only applies to formatting from
	 * `bold`, `italic`, `underline`, `strike`, `subscript`, and `superscript`. Does not copy other
	 * styles or formatting.
	 */
	copyformatting?: boolean;
	/**
	 * Enables a control to italicize selected text.
	 */
	italic?: boolean;
	/**
	 * Enables a control to create hyperlinks around selected text.
	 */
	link?: boolean;
	/**
	 * Enables a control to redo recent edits undone with undo. Redo is always enabled through
	 * standard OS-specific keyboard shortcuts.
	 */
	redo?: boolean;
	/**
	 * Enables the control to remove formatting from text. Applies to formatting from `bold`,
	 * `italic`, `underline`, `strike`, `subscript`, and `superscript`. Does not remove other styles
	 * or formatting.
	 */
	removeformat?: boolean;
	/**
	 * Enables a control to strike selected text.
	 */
	strike?: boolean;
	/**
	 * Enables a control to set selected text to subscript.
	 */
	subscript?: boolean;
	/**
	 * Enables a control to set selected text to superscript.
	 */
	superscript?: boolean;
	/**
	 * Enables a control to underline selected text.
	 */
	underline?: boolean;
	/**
	 * Enables a control to undo recent edits. Undo is always enabled through standard OS-specific
	 * keyboard shortcuts.
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

export interface ReducedCascade {
	/**
	 * Controls the behavior and appearance of your inputs in all data editing interfaces.
	 */
	_inputs?: Record<string, Input>;
	/**
	 * Fixed datasets that can be referenced by the _Values_ configuration for _Select_ and
	 * _Multiselect_ inputs.
	 */
	_select_data?: Record<string, SelectValues>;
	/**
	 * Structured values for editors adding new items to arrays and objects. Entries here can be
	 * referenced in the configuration for `array` or `object` inputs.
	 */
	_structures?: Record<string, Structure>;
}

export interface Cascade extends ReducedCascade {
	/**
	 * Set a preferred editor and/or disable the others. The first value sets which editor opens by
	 * default, and the following values specify which editors are accessible.
	 */
	_enabled_editors?: Array<EditorKey>;
	/**
	 * Contains input options for Editable Regions and the Content Editor.
	 */
	_editables?: Editables;
	/**
	 * [DEPRECATED] Now known as _structures.
	 */
	_array_structures?: Record<string, unknown>;
	/**
	 * [DEPRECATED] Now part of _inputs.*.comment.
	 */
	_comments?: Record<string, string>;
	/**
	 * [DEPRECATED] Now part of _inputs.*.options.
	 */
	_options?: Record<string, Record<string, unknown>>;
}

export type InputType =
	| 'text'
	| 'textarea'
	| 'email'
	| 'disabled'
	| 'pinterest'
	| 'facebook'
	| 'twitter'
	| 'github'
	| 'instagram'
	| 'code'
	| 'checkbox'
	| 'switch'
	| 'color'
	| 'number'
	| 'range'
	| 'url'
	| 'html'
	| 'markdown'
	| 'date'
	| 'datetime'
	| 'time'
	| 'file'
	| 'image'
	| 'document'
	| 'select'
	| 'multiselect'
	| 'choice'
	| 'multichoice'
	| 'object'
	| 'array';

export type EmptyTypeText = 'null' | 'string';
export type EmptyTypeNumber = 'null' | 'number';
export type EmptyTypeArray = 'null' | 'array';
export type EmptyTypeObject = 'null' | 'object';

export interface BaseInputOptions<EmptyType = EmptyTypeText> {
	/**
	 * Set how an ‘empty’ value will be saved. Does not apply to existing empty values.
	 */
	empty_type?: EmptyType;
}

export interface BaseInput<InputOptions = BaseInputOptions> {
	type?: InputType | undefined | null;
	/**
	 * Changes the subtext below the _Label_. Has no default. Supports a limited set of Markdown:
	 * links, bold, italic, subscript, superscript, and inline code elements are allowed.
	 */
	comment?: string;
	/**
	 * Adds an expandable section of rich text below the input.
	 */
	context?: {
		/**
		 * The rich text content shown when opened. Supports a limited set of Markdown.
		 */
		content?: string;
		/**
		 * Makes the content visible initially.
		 */
		open?: boolean;
		/**
		 * The text shown when not open. Defaults to "Context" if unset.
		 */
		title?: string;
		/**
		 * The icon shown when not open.
		 */
		icon?: Icon;
	};
	/**
	 * Provides a custom link for documentation for editors shown above input.
	 */
	documentation?: Documentation;
	/**
	 * Optionally changes the text above this input.
	 */
	label?: string;
	/**
	 * Toggles the visibility of this input.
	 *
	 * @default false
	 */
	hidden?: boolean | string;
	/**
	 * Controls if and how the value of this input is instantiated when created. This occurs when
	 * creating files, or adding array items containing the configured input.
	 */
	instance_value?: InstanceValue;
	/**
	 * Specifies whether or not this input configuration should be merged with any matching, less
	 * specific configuration.
	 *
	 * @default true
	 */
	cascade?: boolean;
	/**
	 * Options that are specific to this `type` of input.
	 */
	options?: InputOptions;
}

export interface TextInputOptions extends BaseInputOptions {
	/**
	 * Text shown when this input has no value.
	 */
	placeholder?: string;
}

export interface TextInput extends BaseInput<TextInputOptions> {
	type:
		| 'text'
		| 'email'
		| 'disabled'
		| 'pinterest'
		| 'facebook'
		| 'twitter'
		| 'github'
		| 'instagram';
}

export interface TextareaInputOptions extends TextInputOptions {
	/**
	 * Shows a character counter below the input if enabled.
	 */
	show_count?: boolean;
}

export interface TextareaInput extends BaseInput<TextareaInputOptions> {
	type: 'textarea';
}

export interface CodeInputOptions extends BaseInputOptions, SourceEditor {
	/**
	 * Sets the maximum number of visible lines for this input, effectively controlling maximum
	 * height. When the containing text exceeds this number, the input becomes a scroll area.
	 *
	 * @default 30
	 */
	max_visible_lines?: number;
	/**
	 * Sets the minimum number of visible lines for this input, effectively controlling initial
	 * height. When the containing text exceeds this number, the input grows line by line to the lines
	 * defined by `max_visible_lines`.
	 *
	 * @default 10
	 */
	min_visible_lines?: number;
	/**
	 * Changes how the editor parses your content for syntax highlighting. Should be set to the
	 * language of the code going into the input.
	 */
	syntax?: Syntax;
}

export interface CodeInput extends BaseInput<CodeInputOptions> {
	type: 'code';
}

export interface ColorInputOptions extends BaseInputOptions {
	/**
	 * Sets what format the color value is saved as. Defaults to the naming convention, or HEX if that
	 * is unset.
	 */
	format?: 'rgb' | 'hex' | 'hsl' | 'hsv';
	/**
	 * Toggles showing a control for adjusting the transparency of the selected color. Defaults to
	 * using the naming convention, enabled if the input key ends with "a".
	 */
	alpha?: boolean;
}

export interface ColorInput extends BaseInput<ColorInputOptions> {
	type: 'color';
}

export interface NumberInputOptions extends BaseInputOptions<EmptyTypeNumber> {
	/**
	 * The lowest value in the range of permitted values.
	 */
	min?: number;
	/**
	 * The greatest value in the range of permitted values.
	 */
	max?: number;
	/**
	 * A number that specifies the granularity that the value must adhere to, or the special value
	 * any, which allows any decimal value between `max` and `min`.
	 */
	step?: number;
}

export interface NumberInput extends BaseInput<NumberInputOptions> {
	type: 'number';
}

export interface RangeInputOptions extends NumberInputOptions {
	min: number;
	max: number;
	step: number;
}

export interface RangeInput extends BaseInput<RangeInputOptions> {
	type: 'range';
}

export interface UrlInputOptions extends BaseInputOptions, WithReducedPaths {}

export interface UrlInput extends BaseInput<UrlInputOptions> {
	type: 'range';
}

export interface RichTextInputOptions extends BaseInputOptions, ImageResizeable, BlockEditable {
	/**
	 * Shows or hides the resize handler to vertically resize the input.
	 */
	allow_resize?: boolean;
	/**
	 * Defines the initial height of this input in pixels (px).
	 */
	initial_height?: number;
}

export interface RichTextInput extends BaseInput<RichTextInputOptions> {
	type: 'html' | 'markdown';
}

export interface DateInputOptions extends BaseInputOptions {
	/**
	 * Specifies the time zone that dates are displayed and edited in. Also changes the suffix the
	 * date is persisted to the file with. Defaults to the global `timezone`.
	 */
	timezone?: Timezone;
}

export interface DateInput extends BaseInput<DateInputOptions> {
	type: 'date' | 'datetime';
}

export interface FileInputOptions extends BaseInputOptions, WithReducedPaths {
	/**
	 * Restricts which file types are available to select or upload to this input.
	 */
	accepts_mime_types?: MimeType[] | '*';
	/**
	 * If you have one or more DAMs connected to your site, you can use this key to list which asset
	 * sources can be uploaded to and selected from.
	 */
	allowed_sources?: string[];
}

export interface FileInput extends BaseInput<FileInputOptions> {
	type: 'file' | 'document';
}

export interface ImageInputOptions extends FileInputOptions, ImageResizeable {}

export interface ImageInput extends BaseInput<ImageInputOptions> {
	type: 'image';
}

export interface SelectInputOptions<EmptyType = EmptyTypeText> extends BaseInputOptions<EmptyType> {
	/**
	 * Allows new text values to be created at edit time.
	 *
	 * @default false
	 */
	allow_create?: boolean;
	/**
	 * Provides an empty option alongside the options provided by values.
	 *
	 * @default true
	 */
	allow_empty?: boolean;
	/**
	 * Defines the values available to choose from. Optional, defaults to fetching values from the
	 * naming convention (e.g. colors or my_colors for data set colors).
	 */
	values?: SelectValues;
	/**
	 * Defines the key used for mapping between saved values and objects in values. This changes how
	 * the input saves selected values to match. Defaults to checking for "id", "uuid", "path",
	 * "title", then "name". Has no effect unless values is an array of objects, the key is used
	 * instead for objects, and the value itself is used for primitive types.
	 */
	value_key?: string;
}

export interface SelectInput extends BaseInput<SelectInputOptions> {
	type: 'select';
}

export interface MultiselectInputOptions extends SelectInputOptions<EmptyTypeArray> {}

export interface MultiselectInput extends BaseInput<MultiselectInputOptions> {
	type: 'multiselect';
}

export interface ChoiceInputOptions<EmptyType = EmptyTypeText>
	extends Omit<SelectInputOptions<EmptyType>, 'allow_create'> {
	/**
	 * The preview definition for changing the way selected and available options are displayed.
	 */
	preview?: SelectPreview;
}

export interface ChoiceInput extends BaseInput<ChoiceInputOptions> {
	type: 'choice';
}

export interface MultichoiceInputOptions extends ChoiceInputOptions<EmptyTypeArray> {}

export interface MultichoiceInput extends BaseInput<MultichoiceInputOptions> {
	type: 'multichoice';
}

export interface ObjectInputGroup {
	heading?: string;
	comment?: string;
	collapsed?: boolean;
	inputs?: string[];
	documentation?: Documentation;
}

export interface ObjectInputOptions extends BaseInputOptions<EmptyTypeObject> {
	/**
	 * Changes the appearance and behavior of the input.
	 */
	subtype?: 'object' | 'mutable';
	/**
	 * Contains options for the "mutable" subtype.
	 */
	entries?: {
		/**
		 * Defines a limited set of keys that can exist on the data within an object input. This set is
		 * used when entries are added and renamed with `allow_create` enabled. Has no effect if
		 * `allow_create` is not enabled.
		 */
		allowed_keys?: string[];
		/**
		 * Limits available structures to specified keys.
		 */
		assigned_structures?: Record<string, string[]>;
		/**
		 * Provides data formats when adding entries to the data within this object input. When adding
		 * an entry, team members are prompted to choose from a number of values you have defined. Has
		 * no effect if `allow_create` is false. `entries.structures` applies to the entries within the
		 * object.
		 */
		structures?: string | Structure;
	};
	/**
	 * The preview definition for changing the way data within an object input is previewed before
	 * being expanded. If the input has `structures`, the preview from the structure value is used
	 * instead.
	 */
	preview?: ObjectPreview;
	/**
	 * Provides data formats for value of this object. When choosing an item, team members are
	 * prompted to choose from a number of values you have defined. `structures` applies to the object
	 * itself.
	 */
	structures?: string | Structure;

	/**
	 * Allows you to group the inputs inside this object together without changing the data structure.
	 */
	groups?: ObjectInputGroup[];

	/**
	 * Controls which order input groups and ungrouped inputs appear in.
	 */
	place_groups_below?: boolean;

	/**
	 * Controls whether or not labels on mutable object entries are formatted.
	 */
	allow_label_formatting?: boolean;
}

export interface ObjectInput extends BaseInput<ObjectInputOptions> {
	type: 'object';
}

export interface ArrayInputOptions extends BaseInputOptions<EmptyTypeArray> {
	/**
	 * The preview definition for changing the way data within an array input's items are previewed
	 * before being expanded. If the input has structures, the preview from the structure value is
	 * used instead.
	 */
	preview?: ObjectPreview;
	/**
	 * Provides data formats for value of this object. When choosing an item, team members are
	 * prompted to choose from a number of values you have defined.
	 */
	structures?: string | Structure;
}

export interface ArrayInput extends BaseInput<ArrayInputOptions> {
	type: 'array';
}

export interface UnknownInput extends BaseInput<BaseInputOptions> {
	type?: undefined | null;
}

export type Input =
	| BaseInput
	| UnknownInput
	| TextInput
	| CodeInput
	| ColorInput
	| NumberInput
	| RangeInput
	| UrlInput
	| RichTextInput
	| DateInput
	| FileInput
	| ImageInput
	| SelectInput
	| MultiselectInput
	| ChoiceInput
	| MultichoiceInput
	| ObjectInput
	| ArrayInput;

export interface ReducedPaths {
	/**
	 * Location of assets that are statically copied to the output site. This prefix will be removed
	 * from the _Uploads_ path when CloudCannon outputs the URL of an asset.
	 */
	static?: string;
	/**
	 * Default location of newly uploaded site files.
	 *
	 * @default 'uploads'
	 */
	uploads?: string;
	/**
	 * Filename template for newly uploaded site files.
	 */
	uploads_filename?: string;
	/**
	 * Default location of newly uploaded DAM files.
	 *
	 * @default ''
	 */
	dam_uploads?: string;
	/**
	 * Filename template for newly uploaded DAM files.
	 */
	dam_uploads_filename?: string;
	/**
	 * Location of statically copied assets for DAM files. This prefix will be removed from the _DAM
	 * Uploads_ path when CloudCannon outputs the URL of an asset.
	 *
	 * @default ''
	 */
	dam_static?: string;
	/**
	 * When set to true, CloudCannon will reference files relative to the path of the file they were
	 * uploaded to.
	 */
	uploads_use_relative_path?: boolean;
}

export interface Paths extends ReducedPaths {
	/**
	 * Parent folder of all collections.
	 *
	 * @default ''
	 */
	collections?: string;
	/**
	 * Parent folder of all site data files.
	 */
	data?: string;
	/**
	 * Parent folder of all site layout files. _Only applies to Jekyll, Hugo, and Eleventy sites_.
	 */
	layouts?: string;
	/**
	 * Parent folder of all includes, partials, or shortcode files. _Only applies to Jekyll, Hugo, and
	 * Eleventy sites_.
	 */
	includes?: string;
}

export type FilterBase = 'none' | 'all' | 'strict';

export interface Filter {
	/**
	 * Defines the initial set of visible files in the collection file list. Defaults to "all", or
	 * "strict" for the auto-discovered `pages` collection in Jekyll, Hugo, and Eleventy.
	 */
	base?: FilterBase;
	/**
	 * Add to the visible files set with `base`. Paths must be relative to the containing collection
	 * `path`.
	 */
	include?: string[];
	/**
	 * Remove from the visible files set with `base`. Paths must be relative to the containing
	 * collection `path`.
	 */
	exclude?: string[];
}

export interface Documentation {
	/**
	 * The "href" value of the link.
	 */
	url: string;
	/**
	 * The visible text used in the link.
	 */
	text?: string;
	/**
	 * The icon displayed next to the link.
	 */
	icon?: Icon;
}

interface PreviewKeyEntry {
	/**
	 * The key used to access the value used for the preview.
	 */
	key: string;
}

type PreviewEntry = Array<PreviewKeyEntry | string | boolean> | string | boolean;

interface TextPreviewable {
	/**
	 * Controls the main text shown per item.
	 */
	text?: PreviewEntry;
}

interface ImagePreviewable {
	/**
	 * Controls the image shown per item.
	 */
	image?: PreviewEntry;
}

interface SubtextPreviewable {
	/**
	 * Controls the supporting text shown per item.
	 */
	subtext?: PreviewEntry;
}

interface IconPreviewable {
	/**
	 * Controls the icon shown per item. Must result in a Material Icon name.
	 */
	icon?: PreviewEntry;
}

interface IconColorPreviewable {
	/**
	 * Controls the color of the icon.
	 */
	icon_color?: string;
}

export interface PreviewGallery
	extends TextPreviewable,
		ImagePreviewable,
		IconPreviewable,
		IconColorPreviewable {
	/**
	 * Controls how the gallery image is positioned within the gallery.
	 */
	fit?: 'padded' | 'cover' | 'contain' | 'cover-top';
}

export interface PreviewMetadata
	extends TextPreviewable,
		ImagePreviewable,
		IconPreviewable,
		IconColorPreviewable {}

export interface ObjectPreview
	extends TextPreviewable,
		ImagePreviewable,
		IconPreviewable,
		SubtextPreviewable {}

export interface SelectPreview extends TextPreviewable, IconPreviewable {}

export interface Preview
	extends TextPreviewable,
		ImagePreviewable,
		IconPreviewable,
		IconColorPreviewable,
		SubtextPreviewable {
	/**
	 * Defines a list of items that can contain an image, icon, and text.
	 */
	metadata?: PreviewMetadata[];
	/**
	 * Details for large image/icon preview per item.
	 */
	gallery?: PreviewGallery;
}

export interface AddOption {
	/**
	 * The text displayed for the menu item. Defaults to using name from the matching schema if set.
	 */
	name?: string;
	/**
	 * The icon next to the text in the menu item. Defaults to using icon from the matching schema if
	 * set, then falls back to add.
	 */
	icon?: Icon;
	/**
	 * The editor to open the new file in. Defaults to an appropriate editor for new file's type if
	 * possible. If no default editor can be calculated, or the editor does not support the new file
	 * type, a warning is shown in place of the editor.
	 */
	editor?: EditorKey;
	/**
	 * Enforces a path for new files to be created in, regardless of path the user is currently
	 * navigated to within the collection file list. Relative to the path of the collection defined in
	 * collection. Defaults to the path within the collection the user is currently navigated to.
	 */
	base_path?: string;
	/**
	 * Sets which collection this action is creating a file in. This is used when matching the value
	 * for schema. Defaults to the containing collection these `add_options` are configured in.
	 */
	collection?: string;
	/**
	 * The schema that new files are created from with this action. This schema is not restricted to
	 * the containing collection, and is instead relative to the collection specified with collection.
	 * Defaults to default if schemas are configured for the collection.
	 */
	schema?: string;
	/**
	 * The path to a file used to populate the initial contents of a new file if no schemas are
	 * configured. We recommend using schemas, and this is ignored if a schema is available.
	 */
	default_content_file?: string;
	/**
	 * The link that opens when the option is clicked. Can either be an external or internal link. If
	 * internal, the link is relative to the current site.
	 */
	href?: string;
}

interface Previewable {
	/**
	 * Changes the way items are previewed in the CMS.
	 */
	preview?: Preview;
}

interface PickerPreviewable {
	/**
	 * Changes the way items are previewed in the CMS while being chosen.
	 */
	picker_preview?: Preview;
}

export interface Schema extends Cascade, Previewable, Schemalike {
	/**
	 * The path to the schema file. Relative to the root folder of the site.
	 */
	path: string;
	/**
	 * Displayed in the add menu when creating new files. Defaults to a formatted version of the key.
	 */
	name?: string;
	/**
	 * Displayed in the add menu when creating new files; also used as the icon for collection files
	 * if no other preview is found.
	 *
	 * @default 'notes'
	 */
	icon?: Icon;
	/**
	 * Controls where new files are saved.
	 */
	create?: Create;
	/**
	 * Preview your unbuilt pages (e.g. drafts) to another page's output URL. The Visual Editor will
	 * load that URL, where Data Bindings and Previews are available to render your new page without
	 * saving.
	 */
	new_preview_url?: string;
}

export interface Sort {
	/**
	 * Defines what field contains the value to sort on inside each collection item's data.
	 */
	key: string;
	/**
	 * Controls which sort values come first.
	 *
	 * @default ascending
	 */
	order?: SortOrder;
}

export interface SortOption extends Sort {
	/**
	 * The text to display in the sort option list. Defaults to a generated label from key and order.
	 */
	label?: string;
}

export interface Create extends ReducedCascade {
	/**
	 * The raw template to be processed when creating files. Relative to the containing collection's
	 * path.
	 */
	path: string;
	/**
	 * Adds to the available data placeholders coming from the file. Entry values follow the same
	 * format as path, and are processed sequentially before path. These values are not saved back to
	 * your file.
	 */
	extra_data?: Record<string, string>;
	/**
	 * Defines a target collection when publishing. When a file is published (currently only relevant
	 * to Jekyll), the target collection's create definition is used instead.
	 */
	publish_to?: string;
}

export interface CollectionConfig extends Cascade, Previewable {
	/**
	 * The top-most folder where the files in this collection are stored. It is relative to source.
	 * Each collection must have a unique path.
	 */
	path?: string;
	/**
	 * Whether or not files in this collection produce files in the build output.
	 */
	output?: boolean;
	/**
	 * Overrides how each file in the collection is read. Detected automatically from file extension
	 * if unset.
	 */
	parser?: 'csv' | 'front-matter' | 'json' | 'properties' | 'toml' | 'yaml';
	/**
	 * Used to build the url field for items in the collection. Similar to permalink in many SSGs.
	 * Defaults to ''
	 */
	url?: string;
	/**
	 * Controls which files are displayed in the collection list. Does not change which files are
	 * assigned to this collection.
	 */
	filter?: Filter | FilterBase;
	/**
	 * The display name of this collection. Used in headings and in the context menu for items in the
	 * collection. This is optional as CloudCannon auto-generates this from the collection key.
	 */
	name?: string;
	/**
	 * Text or Markdown to show above the collection file list.
	 */
	description?: string;
	/**
	 * Sets an icon to use alongside references to this collection.
	 */
	icon?: Icon;
	/**
	 * Provides a custom link for documentation for editors shown above the collection file list.
	 */
	documentation?: Documentation;
	/**
	 * Sets the default sorting for the collection file list. Defaults to the first option in
	 * sort_options, then falls back descending path. As an exception, defaults to descending date for
	 * blog-like collections.
	 */
	sort?: Sort;
	/**
	 * Controls the available options in the sort menu. Defaults to generating the options from the
	 * first item in the collection, falling back to ascending path and descending path.
	 */
	sort_options?: SortOption[];
	/**
	 * Overrides the default singular display name of the collection. This is displayed in the
	 * collection add menu and file context menu.
	 */
	singular_name?: string;
	/**
	 * Overrides the default singular input key of the collection. This is used for naming conventions
	 * for select and multiselect inputs.
	 */
	singular_key?: string;
	/**
	 * Changes the options presented in the add menu in the collection file list. Defaults to an
	 * automatically generated list from _Schemas_, or uses the first file in the collection if no
	 * schemas are configured.
	 */
	add_options?: AddOption[];
	/**
	 * The create path definition to control where new files are saved to inside this collection.
	 * Defaults to [relative_base_path]/{title|slugify}.md.
	 */
	create?: Create;
	/**
	 * Prevents users from adding new files in the collection file list if true.
	 *
	 * Defaults to true for the Jekyll, Hugo and Eleventy data collection in the base data folder only
	 * (data sub-folders act as non-output collections). Otherwise, defaults to false.
	 */
	disable_add?: boolean;
	/**
	 * Prevents users from adding new folders in the collection file list if true.
	 *
	 * Defaults to true for the Jekyll, Hugo and Eleventy data collection in the base data folder only
	 * (data sub-folders act as non-output collections). Otherwise, defaults to false.
	 */
	disable_add_folder?: boolean;
	/**
	 * Prevents users from renaming, moving and deleting files in the collection file list if true.
	 *
	 * Defaults to true for the Jekyll, Hugo and Eleventy data collection in the base data folder only
	 * (data sub-folders act as non-output collections). Otherwise, defaults to false.
	 */
	disable_file_actions?: boolean;
	/**
	 * Preview your unbuilt pages (e.g. drafts) to another page’s output URL. The Visual Editor will
	 * load that set preview URL and use the Data Bindings and Previews to render your new page
	 * without saving.
	 *
	 * For example new_preview_url: /about/ will load the /about/ URL on new or unbuilt pages in the
	 * Visual Editor.
	 */
	new_preview_url?: string;
	/**
	 * The set of schemas for this collection. Schemas are used when creating and editing files in
	 * this collection. Each entry corresponds to a schema that describes a data structure for this
	 * collection.
	 *
	 * The keys in this object should match the values used for schema_key inside each of this
	 * collection's files. default is a special entry and is used when a file has no schema.
	 */
	schemas?: Record<string, Schema>;
	/**
	 * The key used in each file to identify the schema that file uses. The value this key represents
	 * in each of this collection's files should match the keys in schemas. Defaults to _schema.
	 */
	schema_key?: string;
}

export interface CollectionGroup {
	/**
	 * Short, descriptive label for this group of collections.
	 */
	heading: string;
	/**
	 * The collections shown in the sidebar for this group. Collections here are referenced by their
	 * key within `collections_config`.
	 */
	collections: string[];
}

interface Schemalike {
	/**
	 * If true, inputs are sorted to match when editing. Extra inputs are ordered after expected
	 * inputs, unless `remove_extra_inputs` is true.
	 *
	 * @default true
	 */
	reorder_inputs?: boolean;
	/**
	 * Hides unexpected inputs when editing. Has no effect if `remove_extra_inputs` is true.
	 *
	 * @default false
	 */
	hide_extra_inputs?: boolean;
	/**
	 * If checked, empty inputs are removed from the source file on save. Removed inputs will be
	 * available for editing again, provided they are in the matching schema/structure.
	 *
	 * @default false
	 */
	remove_empty_inputs?: boolean;
	/**
	 * If checked, extra inputs are removed when editing.
	 *
	 * @default true
	 */
	remove_extra_inputs?: boolean;
}

export interface Structure extends Schemalike {
	/**
	 * Defines what values are available to add when using this structure.
	 */
	values: Array<StructureValue>;
	/**
	 * Defines what key should be used to detect which structure an item is. If this key is not found
	 * in the existing structure, a comparison of key names is used. Defaults to "_type".
	 */
	id_key?: string;
	/**
	 * Defines whether options are shown to your editors in a select menu (select, default) or a modal
	 * pop up window (modal) when adding a new item.
	 */
	style?: 'select' | 'modal';
}

export interface StructureValue extends Previewable, PickerPreviewable, Schemalike {
	/**
	 * A unique reference value used when referring to this structure value from the Object input's
	 * assigned_structures option.
	 */
	id?: string;
	/**
	 * If set to true, this item will be considered the default type for this structure. If the type
	 * of a value within a structure cannot be inferred based on its id_key or matching fields, then
	 * it will fall back to this item. If multiple items have default set to true, only the first item
	 * will be used.
	 */
	default?: boolean;
	/**
	 * An icon used when displaying the structure (defaults to either format_list_bulleted for items
	 * in arrays, or notes otherwise).
	 */
	icon?: Icon;
	/**
	 * Path to an image in your source files used when displaying the structure. Can be either a
	 * source (has priority) or output path.
	 */
	image?: string;
	/**
	 * Used as the main text in the interface for this value.
	 */
	label?: string;
	/**
	 * Used to group and filter items when selecting from a modal.
	 */
	tags?: string[];
	/**
	 * The actual value used when items are added after selection.
	 */
	value: any;
}

export type SelectValues =
	| string
	| Array<string>
	| Record<string, string>
	| Record<string, Record<string, any>>;

export interface DataConfigEntry {
	/**
	 * The path to a file or folder of files containing data.
	 */
	path: string;
	/**
	 * Overrides how each file in the dataset is read. Detected automatically from file extension if
	 * unset.
	 */
	parser?: 'csv' | 'front-matter' | 'json' | 'properties' | 'toml' | 'yaml';
}

export interface Editor {
	/**
	 * The URL used for the dashboard screenshot, and where the editor opens to when clicking the
	 * dashboard "Edit Home" button.
	 *
	 * @default /
	 */
	default_path: string;
}

export interface SourceEditor {
	/**
	 * Defines how many spaces lines are auto indented by, and/or how many spaces tabs are shown as.
	 *
	 * @default 2
	 */
	tab_size?: number;
	/**
	 * Changes the color scheme for syntax highlighting in the editor.
	 *
	 * @default monokai
	 */
	theme?: string;
	/**
	 * Toggles displaying line numbers and code folding controls in the editor.
	 *
	 * @default true
	 */
	show_gutter?: boolean;
}

export interface CommitTemplate {
	/**
	 * Used to identify a commit template when multiple commit templates are available.
	 */
	label?: string;
	/**
	 * Set the string for the commit template. This will only be used if template_path is not set.
	 */
	template_string?: string;
	/**
	 * Sets the path for a file containing your commit template. The file path should be relative to
	 * the root directory.
	 */
	template_path?: string;
	/**
	 * Define inputs used to populate data placeholders in the commit template.
	 */
	_inputs?: Record<string, Input>;
	/**
	 * Define additional template strings, for building nested templates.
	 */
	extra_data?: Record<string, string>;
}

export type SsgKey =
	| 'hugo'
	| 'jekyll'
	| 'eleventy'
	| 'astro'
	| 'lume'
	| 'mkdocs'
	| 'nextjs'
	| 'sveltekit'
	| 'bridgetown'
	| 'docusaurus'
	| 'gatsby'
	| 'hexo'
	| 'nuxtjs'
	| 'sphinx'
	| 'static'
	| 'other'
	| 'legacy'
	| 'unknown';

export interface DefaultConfiguration extends Cascade, WithSnippets {
	ssg?: SsgKey;
	/**
	 * Base path to your site source files, relative to the root folder.
	 */
	source?: string;
	/**
	 * Generates the integration file in another folder. Not applicable to Jekyll, Hugo, and Eleventy.
	 * Defaults to the root folder.
	 */
	output?: string;
	/**
	 * Global paths to common folders.
	 */
	paths?: Paths;
	/**
	 * Definitions for your collections, which are the sets of content files for your site grouped by
	 * folder. Entries are keyed by a chosen collection key, and contain configuration specific to
	 * that collection.
	 */
	collections_config?: Record<string, CollectionConfig>;
	/**
	 * Defines which collections are shown in the site navigation and how those collections are
	 * grouped.
	 */
	collection_groups?: Array<CollectionGroup>;
	/**
	 * The subpath where your output files are hosted.
	 */
	base_url?: string;
	/**
	 * Controls what data sets are available to populate select and multiselect inputs.
	 */
	data_config?: Record<string, DataConfigEntry>;
	/**
	 * Contains settings for the default editor actions on your site.
	 */
	editor?: Editor;
	/**
	 * Settings for the behavior and appearance of the Source Editor.
	 */
	source_editor?: SourceEditor;
	commit_templates?: Array<CommitTemplate>;
	/**
	 * Contains settings for various Markdown engines.
	 */
	generator?: {
		/**
		 * Settings for various Markdown engines.
		 */
		metadata?: {
			/**
			 * The Markdown engine used on your site.
			 */
			markdown: 'kramdown' | 'commonmark' | 'commonmarkghpages' | 'goldmark' | 'markdown-it';
			/**
			 * Markdown options specific used when markdown is set to "kramdown".
			 */
			kramdown?: Record<string, any>;
			/**
			 * Markdown options specific used when markdown is set to "commonmark".
			 */
			commonmark?: Record<string, any>;
			/**
			 * Markdown options specific used when markdown is set to "commonmarkghpages".
			 */
			commonmarkghpages?: Record<string, any>;
			/**
			 * Markdown options specific used when markdown is set to "goldmark".
			 */
			goldmark?: Record<string, any>;
			/**
			 * Markdown options specific used when markdown is set to "markdown-it".
			 */
			'markdown-it'?: Record<string, any>;
		};
	};
	/**
	 * Specifies the time zone that dates are displayed and edited in. Also changes the suffix the
	 * date is persisted to the file with.
	 *
	 * @default Etc/UTC
	 */
	timezone?: Timezone;
}

export interface HugoCollectionConfig extends Omit<CollectionConfig, 'url' | 'parser'> {
	/**
	 * Controls whether branch index files (e.g. _index.md) are assigned to this collection or not.
	 * The "pages" collection defaults this to true, and false otherwise.
	 */
	parse_branch_index?: boolean;
}

export interface HugoConfiguration extends Omit<DefaultConfiguration, 'output' | 'data_config'> {
	ssg?: 'hugo';

	collections_config?: Record<string, HugoCollectionConfig>;
	/**
	 * Prevents CloudCannon from automatically discovering collections for supported SSGs if true.
	 * Defaults to false.
	 */
	collections_config_override?: boolean;
	/**
	 * Controls what data sets are available to populate select and multiselect inputs.
	 */
	data_config?: Record<string, boolean>;
}

export interface JekyllConfiguration extends Omit<DefaultConfiguration, 'output' | 'data_config'> {
	ssg?: 'jekyll';

	collections_config?: Record<string, Omit<CollectionConfig, 'url' | 'parser'>>;
	/**
	 * Prevents CloudCannon from automatically discovering collections for supported SSGs if true.
	 * Defaults to false.
	 */
	collections_config_override?: boolean;
	/**
	 * Controls what data sets are available to populate select and multiselect inputs.
	 */
	data_config?: Record<string, boolean>;
}

export interface EleventyConfiguration
	extends Omit<DefaultConfiguration, 'output' | 'data_config'> {
	ssg?: 'eleventy';

	collections_config?: Record<string, Omit<CollectionConfig, 'url' | 'parser'>>;
	/**
	 * Prevents CloudCannon from automatically discovering collections for supported SSGs if true.
	 * Defaults to false.
	 */
	collections_config_override?: boolean;
	/**
	 * Controls what data sets are available to populate select and multiselect inputs.
	 */
	data_config?: Record<string, boolean>;
}

export type Configuration =
	| DefaultConfiguration
	| HugoConfiguration
	| JekyllConfiguration
	| EleventyConfiguration;

export type ParsedDataset =
	| string[]
	| Record<string, string>
	| Record<string, Record<string, any>>
	| Record<string, any>[];

interface ParsedCollectionItem {
	[index: string]: any;
	/**
	 * The path to the file this was parsed from.
	 */
	path: 'string';
	/**
	 * The collection key this is assigned to. Matches keys in `collections_config`.
	 */
	collection: 'string';
	/**
	 * The URL this file is served at once built.
	 */
	url?: 'string';
}

interface WithIntegrationOutput {
	/**
	 * The error code encountered when attempting to create the integration output file.
	 */
	error?: 'NO_CONTENT' | string;
	/**
	 * The time this file was generated.
	 */
	time?: string;
	/**
	 * [DEPRECATED] The schema version of the integration output file.
	 */
	version?: string; // This refers to an old schema, replaced by the IntegrationOutput type.
	/**
	 * Details about the integration tool used to generate the integration output file.
	 */
	cloudcannon?: {
		/**
		 * Name of the integration tool used to generate the integration output file.
		 */
		name: string;
		/**
		 * Version of the integration tool used to generate the integration output file.
		 */
		version: string;
	};
	/**
	 * Map of data keys to parsed datasets. Keys match keys in `data_config`.
	 */
	data?: Record<string, ParsedDataset>;
	/**
	 * Map of collection keys to parsed collection files. Keys match keys in `collections_config`.
	 */
	collections?: Record<string, ParsedCollectionItem>;
	/**
	 * Map of build file paths to MD5s.
	 */
	files?: Record<string, string>;
}

export interface DefaultIntegrationOutput extends DefaultConfiguration, WithIntegrationOutput {}
export interface HugoIntegrationOutput extends HugoConfiguration, WithIntegrationOutput {}
export interface JekyllIntegrationOutput extends JekyllConfiguration, WithIntegrationOutput {}
export interface EleventyIntegrationOutput extends EleventyConfiguration, WithIntegrationOutput {}

export type IntegrationOutput =
	| DefaultIntegrationOutput
	| HugoIntegrationOutput
	| JekyllIntegrationOutput
	| EleventyIntegrationOutput;
