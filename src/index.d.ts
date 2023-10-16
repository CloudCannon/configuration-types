import type { Icon } from './icon';
import type { Timezone } from './timezone';
import type { MimeType } from './mime-type';
import type { Theme } from './theme';
import type { Syntax } from './syntax';

export type { Icon, Timezone, MimeType, Theme, Syntax };

export type InstanceValue = 'UUID' | 'NOW';

export type EditorKey = 'visual' | 'content' | 'data';

export type SortOrder = 'ascending' | 'descending' | 'asc' | 'desc';

interface ImageResizeable {
	/**
	 * Sets the format images are converted to prior to upload. The extension of the file is updated to match. Defaults to keeping the mime type of the uploaded file.
	 */
	mime_type?: 'image/jpeg' | 'image/png';
	/**
	 * Controls whether or not the JPEG headers defining how an image should be rotated before being displayed is baked into images prior to upload.
	 * @default true
	 */
	correct_orientation?: boolean;
	/**
	 * Sets how uploaded image files are resized with a bounding box defined by width and height prior to upload. Has no effect when selecting existing images, or if width and height are unset.
	 * @default 'contain'
	 */
	resize_style?: 'cover' | 'contain' | 'stretch';
	/**
	 * Defines the width of the bounding box used in the image resizing process defined with resize_style.
	 */
	width?: number;
	/**
	 * Defines the height of the bounding box used in the image resizing process defined with resize_style.
	 */
	height?: number;
	/**
	 * Controls whether or not images can be upscaled to fit the bounding box during resize prior to upload. Has no effect if files are not resized.
	 * @default false
	 */
	expandable?: boolean;
	/**
	 * Instructs the editor to save `width` and `height` attributes on the image elements. This can prevent pop-in as a page loads.
	 * @default true
	 */
	image_size_attributes?: boolean;
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
	 * Enables a control to insert an unordered list, or to convert selected blocks of text into a unordered list.
	 */
	bulletedlist?: boolean;
	/**
	 * Enables a control to center align text by toggling a class name for a block of text. The value is the class name the editor should add to align the text. The styles for this class need to be listed in the `styles` file to take effect outside of the input.
	 */
	center?: string;
	/**
	 * Enables a control to set selected text to inline code, and unselected blocks of text to code blocks.
	 */
	code?: boolean;
	/**
	 * Enables a control to insert a region of raw HTML, including YouTube, Vimeo, Tweets, and other media. Embedded content is sanitized to mitigate XSS risks, which includes removing style tags. Embeds containing script tags are not loaded in the editor.
	 */
	embed?: boolean;
	/**
	 * Enables a drop down menu for structured text. Has options for "p", "h1", "h2", "h3", "h4", "h5", "h6", "pre", "address", and "div". Set as space separated options (e.g. "p h1 h2").
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
	 * Enables a control to justify text by toggling a class name for a block of text. The value is the class name the editor should add to justify the text. The styles for this class need to be listed in the `styles` file to take effect outside of the input.
	 */
	justify?: string;
	/**
	 * Enables a control to left align text by toggling a class name for a block of text. The value is the class name the editor should add to align the text. The styles for this class need to be listed in the `styles` file to take effect outside of the input.
	 */
	left?: string;
	/**
	 * Enables a control to insert a numbered list, or to convert selected blocks of text into a numbered list.
	 */
	numberedlist?: boolean;
	/**
	 * Enables a control to reduce indentation for numbered and unordered lists.
	 */
	outdent?: boolean;
	/**
	 * Enables a control to right align text by toggling a class name for a block of text. The value is the class name the editor should add to align the text. The styles for this class need to be listed in the `styles` file to take effect outside of the input.
	 */
	right?: string;
	/**
	 * Enables a control to insert snippets, if any are available.
	 */
	snippet?: boolean;
	/**
	 * Enables a drop down menu for editors to style selected text or blocks or text. Styles are the combination of an element and class name. The value for this option is the path (either source or build output) to the CSS file containing the styles.
	 */
	styles?: string;
	/**
	 * Enables a control to insert a table. Further options for table cells are available in the context menu for cells within the editor.
	 */
	table?: boolean;
}

interface WithReducedPaths {
	/**
	 * Paths to where new asset files are uploaded to. They also set the default path when choosing existing images, and linking to existing files. Each path is relative to global `source`. Defaults to the global `paths`.
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
	 * Enables a control to copy formatting from text to other text. Only applies to formatting from `bold`, `italic`, `underline`, `strike`, `subscript`, and `superscript`. Does not copy other styles or formatting.
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
	 * Enables a control to redo recent edits undone with undo. Redo is always enabled through standard OS-specific keyboard shortcuts.
	 */
	redo?: boolean;
	/**
	 * Enables the control to remove formatting from text. Applies to formatting from `bold`, `italic`, `underline`, `strike`, `subscript`, and `superscript`. Does not remove other styles or formatting.
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
	 * Enables a control to undo recent edits. Undo is always enabled through standard OS-specific keyboard shortcuts.
	 */
	undo?: boolean;
}

export interface ReducedCascade {
	/**
	 * Controls the behavior and appearance of your inputs in all data editing interfaces.
	 */
	_inputs?: Record<string, Input>;
	/**
	 * Fixed datasets that can be referenced by the *Values* configuration for *Select* and *Multiselect* inputs.
	 */
	_select_data?: Record<string, SelectValues>;
	/**
	 * Structured values for editors adding new items to arrays and objects. Entries here can be referenced in the configuration for `array` or `object` inputs.
	 */
	_structures?: Record<string, Structure>;
}

export interface Cascade extends ReducedCascade {
	/**
	 * Set a preferred editor and/or disable the others. The first value sets which editor opens by default, and the following values specify which editors are accessible.
	 */
	_enabled_editors?: Array<EditorKey>;
	/**
	 * Contains input options for Editable Regions and the Content Editor.
	 */
	_editables?: Editables;

	_array_structures?: Record<string, unknown>; // Legacy
	_comments?: Record<string, string>; // Legacy
	_options?: Record<string, Record<string, unknown>>; // Legacy
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
	/**
	 * Controls the type of input, changing how it is displayed and interacted with.
	 */
	type?: InputType;
	/**
	 * Changes the subtext below the *Label*. Has no default. Supports a limited set of Markdown: links, bold, italic, subscript, superscript, and inline code elements are allowed.
	 */
	comment?: string;
	/**
	 * Optionally changes the text above this input.
	 */
	label?: string;
	/**
	 * Toggles the visibility of this input.
	 * @default false
	 */
	hidden?: boolean | string;
	/**
	 * Controls if and how the value of this input is instantiated when created. This occurs when creating files, or adding array items containing the configured input.
	 */
	instance_value?: InstanceValue;
	/**
	 * Specifies whether or not this input configuration should be merged with any matching, less specific configuration.
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
		| 'textarea'
		| 'email'
		| 'disabled'
		| 'pinterest'
		| 'facebook'
		| 'twitter'
		| 'github'
		| 'instagram';
}

export interface CodeInputOptions extends BaseInputOptions, SourceEditor {
	/**
	 * Sets the maximum number of visible lines for this input, effectively controlling maximum height. When the containing text exceeds this number, the input becomes a scroll area.
	 * @default 30
	 */
	max_visible_lines?: number;
	/**
	 * Sets the minimum number of visible lines for this input, effectively controlling initial height. When the containing text exceeds this number, the input grows line by line to the lines defined by `max_visible_lines`.
	 * @default 10
	 */
	min_visible_lines?: number;
	/**
	 * Changes how the editor parses your content for syntax highlighting. Should be set to the language of the code going into the input.
	 */
	syntax?: Syntax;
}

export interface CodeInput extends BaseInput<CodeInputOptions> {
	type: 'code';
}

export interface ColorInputOptions extends BaseInputOptions {
	/**
	 * Sets what format the color value is saved as. Defaults to the naming convention, or HEX if that is unset.
	 */
	format?: 'rgb' | 'hex' | 'hsl' | 'hsv';
	/**
	 * Toggles showing a control for adjusting the transparency of the selected color. Defaults to using the naming convention, enabled if the input key ends with "a".
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
	 * A number that specifies the granularity that the value must adhere to, or the special value any, which allows any decimal value between `max` and `min`.
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
	 * If you have one or more DAMs connected to your site, you can use this key to list which asset sources can be uploaded to and selected from.
	 */
	allowed_sources?: string[];
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
	 * Specifies the time zone that dates are displayed and edited in. Also changes the suffix the date is persisted to the file with. Defaults to the global `timezone`.
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
	 * @default false
	 */
	allow_create?: boolean;
	/**
	 * Provides an empty option alongside the options provided by values.
	 * @default true
	 */
	allow_empty?: boolean;
	/**
	 * Defines the values available to choose from. Optional, defaults to fetching values from the naming convention (e.g. colors or my_colors for data set colors).
	 */
	values: SelectValues;
	/**
	 * Defines the key used for mapping between saved values and objects in values. This changes how the input saves selected values to match. Defaults to checking for "id", "uuid", "path", "title", then "name". Has no effect unless values is an array of objects, the key is used instead for objects, and the value itself is used for primitive types.
	 */
	value_key: string;
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
	preview: SelectPreview;
}

export interface ChoiceInput extends BaseInput<ChoiceInputOptions> {
	type: 'choice';
}

export interface MultichoiceInputOptions extends ChoiceInputOptions<EmptyTypeArray> {}

export interface MultichoiceInput extends BaseInput<MultichoiceInputOptions> {
	type: 'multichoice';
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
		 * Defines a limited set of keys that can exist on the data within an object input. This set is used when entries are added and renamed with `allow_create` enabled. Has no effect if `allow_create` is not enabled.
		 */
		allowed_keys?: string[];
		/**
		 * Limits available structures to specified keys.
		 */
		assigned_structures?: Record<string, string[]>;
		/**
		 * Provides data formats when adding entries to the data within this object input. When adding an entry, team members are prompted to choose from a number of values you have defined. Has no effect if `allow_create` is false. `entries.structures` applies to the entries within the object.
		 */
		structures?: string | Structure;
	};
	/**
	 * The preview definition for changing the way data within an object input is previewed before being expanded. If the input has `structures`, the preview from the structure value is used instead.
	 */
	preview?: ObjectPreview;
	/**
	 * Provides data formats for value of this object. When choosing an item, team members are prompted to choose from a number of values you have defined. `structures` applies to the object itself.
	 */
	structures?: string | Structure;
}

export interface ObjectInput extends BaseInput<ObjectInputOptions> {
	type: 'object';
}

export interface ArrayInputOptions extends BaseInputOptions<EmptyTypeArray> {
	/**
	 * The preview definition for changing the way data within an array input's items are previewed before being expanded. If the input has structures, the preview from the structure value is used instead.
	 */
	preview?: ObjectPreview;
	/**
	 * Provides data formats for value of this object. When choosing an item, team members are prompted to choose from a number of values you have defined.
	 */
	structures?: string | Structure;
}

export interface ArrayInput extends BaseInput<ArrayInputOptions> {
	type: 'array';
}

export type Input =
	| BaseInput
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
	 * Default location of newly uploaded site files.
	 * @default 'uploads'
	 */
	uploads?: string;
	/**
	 * Filename template for newly uploaded site files.
	 */
	uploads_filename?: string;
	/**
	 * Default location of newly uploaded DAM files.
	 * @default ''
	 */
	dam_uploads?: string;
	/**
	 * Filename template for newly uploaded DAM files.
	 */
	dam_uploads_filename?: string;
	/**
	 * Location of statically copied assets for DAM files. This prefix will be removed from the *DAM Uploads* path when CloudCannon outputs the URL of an asset.
	 * @default ''
	 */
	dam_static?: string;
}

export interface Paths extends ReducedPaths {
	/**
	 * Location of assets that are statically copied to the output site. This prefix will be removed from the *Uploads* path when CloudCannon outputs the URL of an asset.
	 */
	static?: string;
	/**
	 * Parent folder of all collections.
	 * @default ''
	 */
	collections?: string;
	/**
	 * Parent folder of all site data files.
	 */
	data?: string;
	/**
	 * Parent folder of all site layout files. *Only applies to Jekyll, Hugo, and Eleventy sites*.
	 */
	layouts?: string;
	/**
	 * Parent folder of all includes, partials, or shortcode files. *Only applies to Jekyll, Hugo, and Eleventy sites*.
	 */
	includes?: string;
}

export type FilterBase = 'none' | 'all' | 'strict';

export interface Filter {
	/**
	 * Defines the initial set of visible files in the collection file list. Defaults to "all", or "strict" for the auto-discovered `pages` collection in Jekyll, Hugo, and Eleventy.
	 */
	base?: FilterBase;
	/**
	 * Add to the visible files set with `base`. Paths must be relative to the containing collection `path`.
	 */
	include?: string[];
	/**
	 * Remove from the visible files set with `base`. Paths must be relative to the containing collection `path`.
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
	 * The icon next to the text in the menu item. Defaults to using icon from the matching schema if set, then falls back to add.
	 */
	icon?: Icon;
	/**
	 * The editor to open the new file in. Defaults to an appropriate editor for new file's type if possible. If no default editor can be calculated, or the editor does not support the new file type, a warning is shown in place of the editor.
	 */
	editor?: EditorKey;
	/**
	 * Enforces a path for new files to be created in, regardless of path the user is currently navigated to within the collection file list. Relative to the path of the collection defined in collection. Defaults to the path within the collection the user is currently navigated to.
	 */
	base_path?: string;
	/**
	 * Sets which collection this action is creating a file in. This is used when matching the value for schema. Defaults to the containing collection these `add_options` are configured in.
	 */
	collection?: string;
	/**
	 * The schema that new files are created from with this action. This schema is not restricted to the containing collection, and is instead relative to the collection specified with collection. Defaults to default if schemas are configured for the collection.
	 */
	schema?: string;
	/**
	 * The path to a file used to populate the initial contents of a new file if no schemas are configured. We recommend using schemas, and this is ignored if a schema is available.
	 */
	default_content_file?: string;
}

interface Previewable {
	/**
	 * Changes the way items are previewed in the CMS.
	 */
	preview?: Preview;
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
	 * Displayed in the add menu when creating new files; also used as the icon for collection files if no other preview is found.
	 * @default "notes"
	 */
	icon?: Icon;
	/**
	 * Controls where new files are saved.
	 */
	create?: Create;
	/**
	 * Preview your unbuilt pages (e.g. drafts) to another page's output URL. The Visual Editor will load that URL, where Data Bindings and Previews are available to render your new page without saving.
	 */
	new_preview_url?: string;
}

export interface Sort {
	key: string;
	order?: SortOrder;
}

export interface SortOption extends Sort {
	label?: string;
}

export interface Create extends ReducedCascade {
	path: string;
	extra_data?: Record<string, string>;
	publish_to?: string;
}

export interface CollectionConfig extends Cascade, Previewable {
	path?: string;
	output?: boolean;
	url?: string;
	filter?: Filter | FilterBase;
	name?: string;
	description?: string;
	icon?: Icon;
	documentation?: Documentation;
	sort?: Sort;
	sort_options?: SortOption[];
	singular_name?: string;
	singular_key?: string;
	/**
	 * Changes the options presented in the add menu in the collection file list. Defaults to an automatically generated list from *Schemas*, or uses the first file in the collection if no schemas are configured.
	 */
	add_options?: AddOption[];
	create?: Create;
	disable_add?: boolean;
	disable_add_folder?: boolean;
	disable_file_actions?: boolean;
	new_preview_url?: string;
	schemas?: Record<string, Schema>;
	schema_key?: string;
}

export interface CollectionGroup {
	heading: string;
	collections: string[];
}

interface Schemalike {
	/**
	 * If true, inputs are sorted to match when editing. Extra inputs are ordered after expected inputs, unless `remove_extra_inputs` is true.
	 * @default true
	 */
	reorder_inputs?: boolean;
	/**
	 * Hides unexpected inputs when editing. Has no effect if `remove_extra_inputs` is true.
	 * @default false
	 */
	hide_extra_inputs?: boolean;
	/**
	 * If checked, empty inputs are removed from the source file on save. Removed inputs will be available for editing again, provided they are in the matching schema/structure.
	 * @default false
	 */
	remove_empty_inputs?: boolean;
	/**
	 * If checked, extra inputs are removed when editing.
	 * @default true
	 */
	remove_extra_inputs?: boolean;
}

export interface Structure extends Schemalike {
	values: Array<StructureValue>;
	id_key?: string;
	style?: 'select' | 'modal';
}

export interface StructureValue extends Previewable, Schemalike {
	id?: string;
	default?: boolean;
	description?: string;
	icon?: Icon;
	image?: string;
	label?: string;
	picker_preview?: Preview;
	tags?: string[];
	value: any;
}

export type SelectValues =
	| Array<string>
	| Record<string, string>
	| Record<string, Record<string, any>>;

export interface DataConfigEntry {
	path: string;
	parser?: 'csv' | 'front-matter' | 'json' | 'properties' | 'toml' | 'yaml';
}

export interface Editor {
	default_path: string;
}

export interface SourceEditor {
	/**
	 * Defines how many spaces lines are auto indented by, and/or how many spaces tabs are shown as.
	 * @default 2
	 */
	tab_size?: number;
	/**
	 * Changes the color scheme for syntax highlighting in the editor.
	 * @default monokai
	 */
	theme?: string;
	/**
	 * Toggles displaying line numbers and code folding controls in the editor.
	 * @default true
	 */
	show_gutter?: boolean;
}

export interface DefaultConfiguration extends Cascade {
	source?: string;
	output?: string;
	paths?: Paths;
	collections_config?: Record<string, CollectionConfig>;
	collection_groups?: Array<CollectionGroup>;
	base_url?: string;
	data_config?: Record<string, DataConfigEntry>;
	editor?: Editor;
	source_editor?: SourceEditor;
	/**
	 * @default Etc/UTC
	 */
	timezone?: Timezone;
}

export interface HugoCollectionConfig extends CollectionConfig {
	parse_branch_index?: boolean;
}

export interface HugoConfiguration extends Omit<DefaultConfiguration, 'output' | 'data_config'> {
	collections_config_override?: boolean;
	collections_config?: Record<string, HugoCollectionConfig>;
	data_config?: Record<string, boolean>;
}

export interface JekyllConfiguration extends Omit<DefaultConfiguration, 'output' | 'data_config'> {
	collections_config_override?: boolean;
	data_config?: Record<string, boolean>;
}

export interface EleventyConfiguration
	extends Omit<DefaultConfiguration, 'output' | 'data_config'> {
	collections_config_override?: boolean;
	data_config?: Record<string, boolean>;
}

export type Configuration =
	| DefaultConfiguration
	| HugoConfiguration
	| JekyllConfiguration
	| EleventyConfiguration;
