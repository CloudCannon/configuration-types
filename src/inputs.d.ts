import type { Documentation } from './documentation';
import type { BlockEditable } from './editables';
import type { Icon } from './icon';
import type { ImageResizeable } from './image-resizeable';
import type { WithPaths } from './paths';
import type { WithPickerPreview, WithPreview } from './preview';
import type { SelectValues } from './select-values';
import type { SourceEditor } from './source-editor';
import type { Structure } from './structures';
import type { Timezone } from './timezone';

export type InstanceValue = 'UUID' | 'NOW';

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
	| 'array'
	| 'auto';

interface WithRequiredValidation {
	/**
	 * This key toggles whether CloudCannon requires this Input to have a value. If set to true,
	 * CloudCannon will require you to enter a value to save your changes, or discard your unsaved
	 * changes.
	 *
	 * By default, this key is false (i.e, CloudCannon does not require this Input to have a value).
	 */
	required?: boolean;
}

interface WithTextValidation {
	/**
	 * This key defines the maximum string length, in characters, that CloudCannon will allow in an
	 * Input. When configured, CloudCannon will warn you when an Input value is too long. If the Input
	 * already contains a longer value, CloudCannon will require you to remove characters until the
	 * Input contains a valid string to save your changes, or discard your unsaved changes.
	 *
	 * Value can be any non-negative integer. If this key is set to 0, CloudCannon requires the Input
	 * to be empty. If `options.min_length` is also configured, this key cannot be a smaller number.
	 *
	 * This key has no default.
	 *
	 * To use this key in a Select Input, `options.allow_create` must be set to true.
	 */
	max_length?: number;
	/**
	 * This key defines the minimum string length, in characters, that CloudCannon will allow in an
	 * Input. When configured, CloudCannon will warn you when an Input value is too short. If the
	 * Input already contains a shorter value, CloudCannon will require you to add characters until
	 * the Input contains a valid string to save your changes, or discard your unsaved changes.
	 *
	 * Value can be any positive integer. If `options.max_length` is also configured, this key cannot
	 * be a greater number.
	 *
	 * This key has no default.
	 *
	 * To use this key in a Select Input, `options.allow_create` must be set to true.
	 */
	min_length?: number;
	/**
	 * This key defines a regular expression that the Input value must match. When configured,
	 * CloudCannon will require you to enter a value that matches the REGEX pattern. If the Input
	 * already contains an invalid value, CloudCannon will require you to enter a valid string to save
	 * your changes, or discard your unsaved changes.
	 *
	 * Value must be a valid REGEX string.
	 *
	 * This key has no default.
	 *
	 * To use this key in a Select Input, `options.allow_create` must be set to true.
	 */
	pattern?: string;
	/**
	 * This key defines the message that explains which regular expression an Input will accept. This
	 * key requires you to define `options.pattern`.
	 *
	 * This key has no default.
	 */
	pattern_message?: string;
	/**
	 * This key defines the flags (e.g. case-insensitive searching) for the regular expression set in
	 * `options.pattern`. This key requires you to define `options.pattern`.
	 *
	 * The flags available match those a subset for [JavaScript regular
	 * expressions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions#advanced_searching_with_flags).
	 *
	 * This key has no default.
	 */
	pattern_flags?: {
		/**
		 * `g` - Search globally.
		 *
		 * @default false
		 */
		global?: boolean;
		/**
		 * `i` - Case-insensitive.
		 *
		 * @default false
		 */
		ignore_case?: boolean;
		/**
		 * `m` - `^` and `$` match the start and end of each line rather than the entire string.
		 *
		 * @default false
		 */
		multiline?: boolean;
		/**
		 * `s` - `.` matches newline characters.
		 *
		 * @default false
		 */
		dot_all?: boolean;
		/**
		 * `u` - Pattern is treated as a sequence of Unicode code points.
		 *
		 * @default false
		 */
		unicode?: boolean;
		/**
		 * `v` - Extended `unicode` mode.
		 *
		 * @default false
		 */
		unicode_sets?: boolean;
	};
}

interface WithArrayValidation {
	/**
	 * This key defines the maximum number of items CloudCannon will allow in an Input. When
	 * configured, CloudCannon will prevent you from adding more items to this Input. If the Input
	 * already contains more items, CloudCannon will require you to remove items until the Input
	 * contains a valid number to save your changes, or discard your unsaved changes.
	 *
	 * Value can be any positive integer. If `options.min_items` is also configured, this key cannot
	 * be a lesser number.
	 *
	 * This key has no default.
	 */
	max_items?: number;
	/**
	 * This key defines the minimum number of items CloudCannon will allow in an Input. When
	 * configured, CloudCannon will prevent you from removing items from this Input below this value.
	 * If the Input already contains fewer items, CloudCannon will require you to add items until the
	 * Input contains a valid number to save your changes, or discard your unsaved changes.
	 *
	 * Value can be any positive integer. If `options.min_items` is also configured, this key cannot
	 * be a greater number.
	 *
	 * This key has no default.
	 */
	min_items?: number;
	/**
	 * This key defines the JSON Path selector that CloudCannon should use to determine if the value
	 * of an Input is unique. When configured, CloudCannon will require the value of the Input to be
	 * unique compared to the value defined on the JSON Path. If the Input already contains a
	 * non-unique value, CloudCannon will require you to change it to a valid value to save your
	 * changes, or discard your unsaved changes.
	 *
	 * Value must be a valid JSON Path.
	 *
	 * This key has no default.
	 */
	unique_on?: string;
}

interface WithEmptyTypeText {
	/**
	 * Set how an ‘empty’ value will be saved. Does not apply to existing empty values.
	 */
	empty_type?: 'null' | 'string';
}

interface WithEmptyTypeNumber {
	/**
	 * Set how an ‘empty’ value will be saved. Does not apply to existing empty values.
	 */
	empty_type?: 'null' | 'number';
}

interface WithEmptyTypeObject {
	/**
	 * Set how an ‘empty’ value will be saved. Does not apply to existing empty values.
	 */
	empty_type?: 'null' | 'object';
}

interface WithEmptyTypeArray {
	/**
	 * Set how an ‘empty’ value will be saved. Does not apply to existing empty values.
	 */
	empty_type?: 'null' | 'array';
}

export interface BaseInput {
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
	 * Toggles if this input can be edited.
	 *
	 * @default false
	 */
	disabled?: boolean | string;
	/**
	 * Controls if and how the value of this input is instantiated when created. This occurs when
	 * creating files, or adding array items containing the configured input.
	 */
	instance_value?: InstanceValue;
	/**
	 * Prevents the default where inputs configured with an `instance_value` are rehydrated with a new
	 * value when duplicated in the CMS.
	 *
	 * @default false
	 */
	disable_instance_value_rehydration?: boolean;
	/**
	 * Specifies whether or not this input configuration should be merged with any matching, less
	 * specific configuration.
	 */
	cascade?: boolean;
}

export interface TextInputOptions
	extends WithEmptyTypeText,
		WithTextValidation,
		WithRequiredValidation {
	/**
	 * Text shown when this input has no value.
	 */
	placeholder?: string;
	/**
	 * Icon shown beside the input.
	 */
	icon?: Icon;
}

export interface TextInput extends BaseInput {
	/**
	 * Sets an input type, which controls how this input appears and behaves.
	 */
	type:
		| 'text'
		| 'email'
		| 'disabled'
		| 'pinterest'
		| 'facebook'
		| 'twitter'
		| 'github'
		| 'instagram';

	/**
	 * Options that are specific to Text Inputs.
	 */
	options?: TextInputOptions;
}

export interface TextareaInputOptions extends TextInputOptions {
	/**
	 * Shows a character counter below the input if enabled.
	 *
	 * @default false
	 */
	show_count?: boolean;
}

export interface TextareaInput extends BaseInput {
	/**
	 * Sets an input type, which controls how this input appears and behaves.
	 */
	type: 'textarea';
	/**
	 * Options that are specific to Textarea Inputs.
	 */
	options?: TextareaInputOptions;
}

export interface CodeInputOptions
	extends WithEmptyTypeText,
		SourceEditor,
		WithTextValidation,
		WithRequiredValidation {
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

export interface CodeInput extends BaseInput {
	/**
	 * Sets an input type, which controls how this input appears and behaves.
	 */
	type: 'code';
	/**
	 * Options that are specific to Code Inputs.
	 */
	options?: CodeInputOptions;
}

export interface ColorInputOptions
	extends WithEmptyTypeText,
		WithTextValidation,
		WithRequiredValidation {
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

export interface ColorInput extends BaseInput {
	/**
	 * Sets an input type, which controls how this input appears and behaves.
	 */
	type: 'color';
	/**
	 * Options that are specific to Color Inputs.
	 */
	options?: ColorInputOptions;
}

export interface BooleanInput extends Omit<BaseInput, 'options'> {
	/**
	 * Sets an input type, which controls how this input appears and behaves.
	 */
	type: 'checkbox' | 'switch';
}

export interface NumberInputOptions extends WithEmptyTypeNumber, WithRequiredValidation {
	/**
	 * This key defines the minimum numerical value CloudCannon will allow in an Input. When
	 * configured, CloudCannon will prevent you from entering a lesser numerical value. If the Input
	 * already contains a lesser numerical value, CloudCannon will require you to enter a valid value
	 * to save your changes, or discard your unsaved changes.
	 *
	 * Value can be any integer. If `options.max` is also configured, this key cannot be a greater
	 * number.
	 *
	 * This key has no default.
	 */
	min?: number;
	/**
	 * This key defines the maximum numerical value CloudCannon will allow in an Input. When
	 * configured, CloudCannon will prevent you from entering a greater numerical value. If the Input
	 * already contains a greater numerical value, CloudCannon will require you to enter a valid value
	 * to save your changes, or discard your unsaved changes.
	 *
	 * Value can be any integer. If `options.min` is also configured, this key cannot be a lesser
	 * number.
	 *
	 * This key has no default.
	 */
	max?: number;
	/**
	 * A number that specifies the granularity that the value must adhere to, or the special value
	 * any, which allows any decimal value between `max` and `min`.
	 */
	step?: number;
}

export interface NumberInput extends BaseInput {
	/**
	 * Sets an input type, which controls how this input appears and behaves.
	 */
	type: 'number';
	/**
	 * Options that are specific to this Number Inputs.
	 */
	options?: NumberInputOptions;
}

export interface RangeInputOptions extends NumberInputOptions {
	/**
	 * This key defines the minimum numerical value CloudCannon will allow in an Input. When
	 * configured, CloudCannon will prevent you from entering a lesser numerical value. If the Input
	 * already contains a lesser numerical value, CloudCannon will require you to enter a valid value
	 * to save your changes, or discard your unsaved changes.
	 *
	 * Value can be any integer. If `options.max` is also configured, this key cannot be a greater
	 * number.
	 *
	 * @default 0
	 */
	min?: number;
	/**
	 * This key defines the maximum numerical value CloudCannon will allow in an Input. When
	 * configured, CloudCannon will prevent you from entering a greater numerical value. If the Input
	 * already contains a greater numerical value, CloudCannon will require you to enter a valid value
	 * to save your changes, or discard your unsaved changes.
	 *
	 * Value can be any integer. If `options.min` is also configured, this key cannot be a lesser
	 * number.
	 *
	 * @default 10
	 */
	max?: number;
	/**
	 * A number that specifies the granularity that the value must adhere to, or the special value
	 * any, which allows any decimal value between `max` and `min`.
	 *
	 * @default 1
	 */
	step?: number;
}

export interface RangeInput extends BaseInput {
	/**
	 * Sets an input type, which controls how this input appears and behaves.
	 */
	type: 'range';
	/**
	 * Options that are specific to Range Inputs.
	 */
	options?: RangeInputOptions;
}

export interface RichTextInputOptions
	extends WithEmptyTypeText,
		ImageResizeable,
		BlockEditable,
		WithTextValidation,
		WithRequiredValidation {
	/**
	 * Shows or hides the resize handler to vertically resize the input.
	 *
	 * @default false
	 */
	allow_resize?: boolean;
	/**
	 * Defines the initial height of this input in pixels (px).
	 *
	 * @default 320
	 */
	initial_height?: number;
}

export interface RichTextInput extends BaseInput {
	/**
	 * Sets an input type, which controls how this input appears and behaves.
	 */
	type: 'html' | 'markdown';
	/**
	 * Options that are specific to Rich Text Inputs.
	 */
	options?: RichTextInputOptions;
}

export interface DateInputOptions extends WithEmptyTypeText {
	/**
	 * Specifies the time zone that dates are displayed and edited in. Also changes the suffix the
	 * date is persisted to the file with. Defaults to the global `timezone`.
	 *
	 * @default Etc/UTC
	 */
	timezone?: Timezone;
	/**
	 * This key defines the earliest date and time, inclusive, that CloudCannon will allow in an
	 * Input. When configured, CloudCannon will prevent you from selecting an earlier date and time.
	 * If the Input already contains an earlier date and time, CloudCannon will require you to change
	 * it to a valid value to save your changes, or discard your unsaved changes.
	 *
	 * Value must be in ISO8601 format. If `options.end_before` is also configured, this key cannot be
	 * a later date and time.
	 *
	 * This key has no default.
	 */
	start_from?: Date;
	/**
	 * This key defines the date and time, exclusive, that CloudCannon will allow in an Input. When
	 * configured, CloudCannon will prevent you from selecting a later date and time. If the Input
	 * already contains a later date and time, CloudCannon will require you to change it to a valid
	 * value to save your changes, or discard your unsaved changes.
	 *
	 * Value must be in ISO8601 format. If options.start_from is also configured, this key cannot be
	 * an earlier date and time.
	 *
	 * This key has no default.
	 */
	end_before?: Date;
}

export interface DateInput extends BaseInput {
	/**
	 * Sets an input type, which controls how this input appears and behaves.
	 */
	type: 'date' | 'datetime';
	/**
	 * Options that are specific to Date inputs.
	 */
	options?: DateInputOptions;
}

export interface TimeInput extends BaseInput {
	/**
	 * Sets an input type, which controls how this input appears and behaves.
	 */
	type: 'time';
	/**
	 * Options that are specific to Time inputs.
	 */
	options?: WithEmptyTypeText & WithRequiredValidation;
}

export interface FileInputOptions
	extends WithEmptyTypeText,
		WithPaths,
		ImageResizeable,
		WithTextValidation,
		WithRequiredValidation {
	/**
	 * Restricts which file types are available to select or upload to this input. Accepted format is
	 * an array or comma-separated string of MIME types. The special value '*' means any type is
	 * accepted.
	 */
	accepts_mime_types?: MimeType[] | string;
	/**
	 * If you have one or more DAMs connected to your site, you can use this key to list which asset
	 * sources can be uploaded to and selected from.
	 */
	allowed_sources?: string[];
	/**
	 * Disables the context menu option and the drop area for uploading files.
	 *
	 * @default false
	 */
	disable_upload_file?: boolean;
	/**
	 * Prevents typing into the text input, while still allowing context menu options to change the
	 * value.
	 *
	 * @default false
	 */
	disable_direct_input?: boolean;
	/**
	 * Prevents file uploads inside the "Select existing file/image" file browser modal window.
	 *
	 * @default false
	 */
	disable_upload_file_in_file_browser?: boolean;
}

export interface FileInput extends BaseInput {
	/**
	 * Sets an input type, which controls how this input appears and behaves.
	 */
	type: 'file' | 'document' | 'image';
	/**
	 * Options that are specific to File, Image and Document inputs.
	 */
	options?: FileInputOptions;
}

export interface UrlInputOptions extends FileInputOptions {
	/**
	 * Hides the options to link to an existing file, and upload a new file. This does not prevent
	 * typing a file path in the input.
	 *
	 * @default false
	 */
	hide_link_to_file?: boolean;
	/**
	 * Hides the option to link to a page. This does not prevent typing a file's output URL in the
	 * input.
	 *
	 * @default false
	 */
	hide_link_to_page?: boolean;
	/**
	 * Hides the option to link to an email address. This does not prevent typing a `mailto:` link in
	 * the input.
	 *
	 * @default false
	 */
	hide_link_to_email_address?: boolean;
}

export interface UrlInput extends BaseInput {
	/**
	 * Sets an input type, which controls how this input appears and behaves.
	 */
	type: 'url';
	/**
	 * Options that are specific to URL inputs.
	 */
	options?: UrlInputOptions;
}

export interface SelectInputOptions extends WithPreview, WithPickerPreview {
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
	values?: string | SelectValues;
	/**
	 * Defines the key used for mapping between saved values and objects in values. This changes how
	 * the input saves selected values to match. Defaults to checking for "id", "uuid", "path",
	 * "title", then "name". Has no effect unless values is an array of objects, the key is used
	 * instead for objects, and the value itself is used for primitive types.
	 */
	value_key?: string;
	/**
	 * Controls how selected items are rendered.
	 */
	view?: 'card' | 'text' | 'gallery' | 'gallery-left';
	/**
	 * Controls how selectable options are rendered.
	 */
	picker_view?: 'card' | 'text' | 'gallery' | 'gallery-left';
}

export interface SelectInput extends BaseInput {
	/**
	 * Sets an input type, which controls how this input appears and behaves.
	 */
	type: 'select';
	/**
	 * Options that are specific to Select Inputs.
	 */
	options?: SelectInputOptions & WithEmptyTypeText & WithTextValidation & WithRequiredValidation;
}

export interface MultiselectInputOptions
	extends WithEmptyTypeArray,
		WithArrayValidation,
		WithRequiredValidation {
	/**
	 * Hides the add button, and context menu actions on each array item for adding new items to this
	 * Input.
	 *
	 * @default false
	 */
	disable_add?: boolean;
	/**
	 * Hides the context menu actions on each array item for removing them.
	 *
	 * @default false
	 */
	disable_remove?: boolean;
	/**
	 * Hides the controls on each array item for moving them.
	 *
	 * @default false
	 */
	disable_reorder?: boolean;
}

export interface MultiselectInput extends BaseInput {
	/**
	 * Sets an input type, which controls how this input appears and behaves.
	 */
	type: 'multiselect';
	/**
	 * Options that are specific to Multiselect Inputs.
	 */
	options?: MultiselectInputOptions;
}

export type ChoiceInputOptions = Omit<SelectInputOptions, 'allow_create'>;

export interface ChoiceInput extends BaseInput {
	/**
	 * Sets an input type, which controls how this input appears and behaves.
	 */
	type: 'choice';
	/**
	 * Options that are specific to Choice Inputs.
	 */
	options?: ChoiceInputOptions & WithEmptyTypeText & WithTextValidation & WithRequiredValidation;
}

export interface MultichoiceInput extends BaseInput {
	/**
	 * Sets an input type, which controls how this input appears and behaves.
	 */
	type: 'multichoice';
	/**
	 * Options that are specific to Multichoice Inputs.
	 */
	options?: ChoiceInputOptions & WithEmptyTypeArray & WithArrayValidation & WithRequiredValidation;
}

export interface ObjectInputGroup {
	/**
	 * The main text for the group shown when collapsed or expanded.
	 */
	heading?: string;
	/**
	 * Changes the subtext below the `heading`. Has no default. Supports a limited set of Markdown:
	 * links, bold, italic, subscript, superscript, and inline code elements are allowed.
	 */
	comment?: string;
	/**
	 * Controls if this group is collapsed or expanded when first viewed.
	 *
	 * @default false
	 */
	collapsed?: boolean;
	/**
	 * The keys of each input in this group.
	 */
	inputs?: string[];
	/**
	 * Provides a custom link for documentation for editors shown above the collection file list.
	 */
	documentation?: Documentation;
}

export interface ObjectInputOptions
	extends WithEmptyTypeObject,
		WithPreview,
		WithRequiredValidation {
	/**
	 * Changes the appearance and behavior of the input.
	 *
	 * @default object
	 */
	subtype?: 'object' | 'mutable' | 'tabbed';
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
	 *
	 * @default false
	 */
	place_groups_below?: boolean;
	/**
	 * Controls whether or not labels on mutable object entries are formatted.
	 *
	 * @default false
	 */
	allow_label_formatting?: boolean;
	/**
	 * Controls how object previews are rendered.
	 */
	view?: 'card' | 'gallery' | 'gallery-left';
}

export interface ObjectInput extends BaseInput {
	/**
	 * Sets an input type, which controls how this input appears and behaves.
	 */
	type: 'object';
	/**
	 * Options that are specific to Object Inputs.
	 */
	options?: ObjectInputOptions;
}

export interface ArrayInputOptions
	extends WithEmptyTypeArray,
		WithRequiredValidation,
		WithArrayValidation {
	/**
	 * Provides data formats for value of this object. When choosing an item, team members are
	 * prompted to choose from a number of values you have defined.
	 */
	structures?: string | Structure;
	/**
	 * Hides the add button, and context menu actions on each array item for adding new items to this
	 * Input.
	 *
	 * @default false
	 */
	disable_add?: boolean;
	/**
	 * Hides the context menu actions on each array item for removing them.
	 *
	 * @default false
	 */
	disable_remove?: boolean;
	/**
	 * Hides the controls on each array item for moving them.
	 *
	 * @default false
	 */
	disable_reorder?: boolean;
}

export interface ArrayInput extends BaseInput {
	/**
	 * Sets an input type, which controls how this input appears and behaves.
	 */
	type: 'array';
	/**
	 * Options that are specific to Array Inputs.
	 */
	options?: ArrayInputOptions;
}

export interface AutoInput extends BaseInput {
	/**
	 * Sets an input type, which controls how this input appears and behaves.
	 */
	type: 'auto';
	/**
	 * Options that are specific to this `type` of input.
	 */
	options?: unknown;
}

export interface UnknownInput extends BaseInput {
	/**
	 * Options that are specific to this `type` of input.
	 */
	options?: unknown;
}

/**
 * @discriminator type
 */
export type KnownInput =
	| TextInput
	| TextareaInput
	| CodeInput
	| ColorInput
	| BooleanInput
	| NumberInput
	| RangeInput
	| RichTextInput
	| DateInput
	| TimeInput
	| FileInput
	| UrlInput
	| SelectInput
	| MultiselectInput
	| ChoiceInput
	| MultichoiceInput
	| ObjectInput
	| ArrayInput
	| AutoInput;

export type Input = KnownInput | UnknownInput;

export type Syntax =
	| 'abap'
	| 'abc'
	| 'actionscript'
	| 'ada'
	| 'alda'
	| 'apache_conf'
	| 'apex'
	| 'applescript'
	| 'aql'
	| 'asciidoc'
	| 'asl'
	| 'assembly_x86'
	| 'autohotkey'
	| 'batchfile'
	| 'c9search'
	| 'c_cpp'
	| 'cirru'
	| 'clojure'
	| 'cobol'
	| 'coffee'
	| 'coldfusion'
	| 'crystal'
	| 'csharp'
	| 'csound_document'
	| 'csound_orchestra'
	| 'csound_score'
	| 'csp'
	| 'css'
	| 'curly'
	| 'd'
	| 'dart'
	| 'diff'
	| 'django'
	| 'dockerfile'
	| 'dot'
	| 'drools'
	| 'edifact'
	| 'eiffel'
	| 'ejs'
	| 'elixir'
	| 'elm'
	| 'erlang'
	| 'forth'
	| 'fortran'
	| 'fsharp'
	| 'fsl'
	| 'ftl'
	| 'gcode'
	| 'gherkin'
	| 'gitignore'
	| 'glsl'
	| 'gobstones'
	| 'golang'
	| 'graphqlschema'
	| 'groovy'
	| 'haml'
	| 'handlebars'
	| 'haskell'
	| 'haskell_cabal'
	| 'haxe'
	| 'hjson'
	| 'html'
	| 'html_elixir'
	| 'html_ruby'
	| 'ini'
	| 'io'
	| 'jack'
	| 'jade'
	| 'java'
	| 'javascript'
	| 'json5'
	| 'json'
	| 'jsoniq'
	| 'jsp'
	| 'jssm'
	| 'jsx'
	| 'julia'
	| 'kotlin'
	| 'latex'
	| 'less'
	| 'liquid'
	| 'lisp'
	| 'livescript'
	| 'logiql'
	| 'logtalk'
	| 'lsl'
	| 'lua'
	| 'luapage'
	| 'lucene'
	| 'makefile'
	| 'markdown'
	| 'mask'
	| 'matlab'
	| 'maze'
	| 'mediawiki'
	| 'mel'
	| 'mixal'
	| 'mushcode'
	| 'mysql'
	| 'nginx'
	| 'nim'
	| 'nix'
	| 'nsis'
	| 'nunjucks'
	| 'objectivec'
	| 'ocaml'
	| 'pascal'
	| 'perl6'
	| 'perl'
	| 'pgsql'
	| 'php'
	| 'php_laravel_blade'
	| 'pig'
	| 'plain_text'
	| 'powershell'
	| 'praat'
	| 'prisma'
	| 'prolog'
	| 'properties'
	| 'protobuf'
	| 'puppet'
	| 'python'
	| 'qml'
	| 'r'
	| 'razor'
	| 'rdoc'
	| 'red'
	| 'redshift'
	| 'rhtml'
	| 'rst'
	| 'ruby'
	| 'rust'
	| 'sass'
	| 'scad'
	| 'scala'
	| 'scheme'
	| 'scss'
	| 'sh'
	| 'sjs'
	| 'slim'
	| 'smarty'
	| 'snippets'
	| 'soy_template'
	| 'space'
	| 'sparql'
	| 'sql'
	| 'sqlserver'
	| 'stylus'
	| 'svg'
	| 'swift'
	| 'tcl'
	| 'terraform'
	| 'tex'
	| 'text'
	| 'textile'
	| 'toml'
	| 'tsx'
	| 'turtle'
	| 'twig'
	| 'export typescript'
	| 'vala'
	| 'vbscript'
	| 'velocity'
	| 'verilog'
	| 'vhdl'
	| 'visualforce'
	| 'wollok'
	| 'xml'
	| 'xquery'
	| 'yaml'
	| 'zeek';

export type MimeType =
	| 'x-world/x-3dmf'
	| 'application/x-authorware-bin'
	| 'application/x-authorware-map'
	| 'application/x-authorware-seg'
	| 'text/vnd.abc'
	| 'video/animaflex'
	| 'application/postscript'
	| 'audio/aiff'
	| 'audio/x-aiff'
	| 'application/x-aim'
	| 'text/x-audiosoft-intra'
	| 'application/x-navi-animation'
	| 'application/x-nokia-9000-communicator-add-on-software'
	| 'application/mime'
	| 'application/arj'
	| 'image/x-jg'
	| 'video/x-ms-asf'
	| 'text/x-asm'
	| 'text/asp'
	| 'application/x-mplayer2'
	| 'video/x-ms-asf-plugin'
	| 'audio/basic'
	| 'audio/x-au'
	| 'application/x-troff-msvideo'
	| 'video/avi'
	| 'video/msvideo'
	| 'video/x-msvideo'
	| 'video/avs-video'
	| 'application/x-bcpio'
	| 'application/mac-binary'
	| 'application/macbinary'
	| 'application/x-binary'
	| 'application/x-macbinary'
	| 'image/bmp'
	| 'image/x-windows-bmp'
	| 'application/book'
	| 'application/x-bsh'
	| 'application/x-bzip'
	| 'application/x-bzip2'
	| 'text/plain'
	| 'text/x-c'
	| 'application/vnd.ms-pki.seccat'
	| 'application/clariscad'
	| 'application/x-cocoa'
	| 'application/cdf'
	| 'application/x-cdf'
	| 'application/x-netcdf'
	| 'application/pkix-cert'
	| 'application/x-x509-ca-cert'
	| 'application/x-chat'
	| 'application/java'
	| 'application/java-byte-code'
	| 'application/x-java-class'
	| 'application/x-cpio'
	| 'application/mac-compactpro'
	| 'application/x-compactpro'
	| 'application/x-cpt'
	| 'application/pkcs-crl'
	| 'application/pkix-crl'
	| 'application/x-x509-user-cert'
	| 'application/x-csh'
	| 'text/x-script.csh'
	| 'application/x-pointplus'
	| 'text/css'
	| 'text/csv'
	| 'application/x-director'
	| 'application/x-deepv'
	| 'video/x-dv'
	| 'video/dl'
	| 'video/x-dl'
	| 'application/msword'
	| 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
	| 'application/commonground'
	| 'application/drafting'
	| 'application/x-dvi'
	| 'drawing/x-dwf (old)'
	| 'model/vnd.dwf'
	| 'application/acad'
	| 'image/vnd.dwg'
	| 'image/x-dwg'
	| 'application/dxf'
	| 'text/x-script.elisp'
	| 'application/x-bytecode.elisp (compiled elisp)'
	| 'application/x-elc'
	| 'application/x-envoy'
	| 'application/x-esrehber'
	| 'text/x-setext'
	| 'application/envoy'
	| 'text/x-fortran'
	| 'application/vnd.fdf'
	| 'application/fractals'
	| 'image/fif'
	| 'video/fli'
	| 'video/x-fli'
	| 'image/florian'
	| 'text/vnd.fmi.flexstor'
	| 'video/x-atomic3d-feature'
	| 'image/vnd.fpx'
	| 'image/vnd.net-fpx'
	| 'application/freeloader'
	| 'audio/make'
	| 'image/g3fax'
	| 'image/gif'
	| 'video/gl'
	| 'video/x-gl'
	| 'audio/x-gsm'
	| 'application/x-gsp'
	| 'application/x-gss'
	| 'application/x-gtar'
	| 'application/x-compressed'
	| 'application/x-gzip'
	| 'multipart/x-gzip'
	| 'text/x-h'
	| 'application/x-hdf'
	| 'application/x-helpfile'
	| 'application/vnd.hp-hpgl'
	| 'text/x-script'
	| 'application/hlp'
	| 'application/x-winhelp'
	| 'application/binhex'
	| 'application/binhex4'
	| 'application/mac-binhex'
	| 'application/mac-binhex40'
	| 'application/x-binhex40'
	| 'application/x-mac-binhex40'
	| 'application/hta'
	| 'text/x-component'
	| 'text/html'
	| 'text/webviewhtml'
	| 'x-conference/x-cooltalk'
	| 'image/x-icon'
	| 'image/ief'
	| 'application/iges'
	| 'model/iges'
	| 'application/x-ima'
	| 'application/x-httpd-imap'
	| 'application/inf'
	| 'application/x-internett-signup'
	| 'application/x-ip2'
	| 'video/x-isvideo'
	| 'audio/it'
	| 'application/x-inventor'
	| 'i-world/i-vrml'
	| 'application/x-livescreen'
	| 'audio/x-jam'
	| 'text/x-java-source'
	| 'application/x-java-commerce'
	| 'image/jpeg'
	| 'image/pjpeg'
	| 'image/x-jps'
	| 'application/x-javascript'
	| 'application/javascript'
	| 'application/ecmascript'
	| 'text/javascript'
	| 'text/ecmascript'
	| 'application/json'
	| 'image/jutvision'
	| 'music/x-karaoke'
	| 'application/x-ksh'
	| 'text/x-script.ksh'
	| 'audio/nspaudio'
	| 'audio/x-nspaudio'
	| 'audio/x-liveaudio'
	| 'application/x-latex'
	| 'application/lha'
	| 'application/x-lha'
	| 'application/x-lisp'
	| 'text/x-script.lisp'
	| 'text/x-la-asf'
	| 'application/x-lzh'
	| 'application/lzx'
	| 'application/x-lzx'
	| 'text/x-m'
	| 'audio/mpeg'
	| 'audio/x-mpequrl'
	| 'audio/m4a'
	| 'audio/x-m4a'
	| 'application/x-troff-man'
	| 'application/x-navimap'
	| 'application/mbedlet'
	| 'application/x-magic-cap-package-1.0'
	| 'application/mcad'
	| 'application/x-mathcad'
	| 'image/vasa'
	| 'text/mcf'
	| 'application/netmc'
	| 'text/markdown'
	| 'application/x-troff-me'
	| 'message/rfc822'
	| 'application/x-midi'
	| 'audio/midi'
	| 'audio/x-mid'
	| 'audio/x-midi'
	| 'music/crescendo'
	| 'x-music/x-midi'
	| 'application/x-frame'
	| 'application/x-mif'
	| 'www/mime'
	| 'audio/x-vnd.audioexplosion.mjuicemediafile'
	| 'video/x-motion-jpeg'
	| 'application/base64'
	| 'application/x-meme'
	| 'audio/mod'
	| 'audio/x-mod'
	| 'video/quicktime'
	| 'video/x-sgi-movie'
	| 'audio/x-mpeg'
	| 'video/x-mpeg'
	| 'video/x-mpeq2a'
	| 'audio/mpeg3'
	| 'audio/x-mpeg-3'
	| 'video/mp4'
	| 'application/x-project'
	| 'video/mpeg'
	| 'application/vnd.ms-project'
	| 'application/marc'
	| 'application/x-troff-ms'
	| 'application/x-vnd.audioexplosion.mzz'
	| 'image/naplps'
	| 'application/vnd.nokia.configuration-message'
	| 'image/x-niff'
	| 'application/x-mix-transfer'
	| 'application/x-conference'
	| 'application/x-navidoc'
	| 'application/octet-stream'
	| 'application/oda'
	| 'audio/ogg'
	| 'application/ogg'
	| 'video/ogg'
	| 'application/x-omc'
	| 'application/x-omcdatamaker'
	| 'application/x-omcregerator'
	| 'text/x-pascal'
	| 'application/pkcs10'
	| 'application/x-pkcs10'
	| 'application/pkcs-12'
	| 'application/x-pkcs12'
	| 'application/x-pkcs7-signature'
	| 'application/pkcs7-mime'
	| 'application/x-pkcs7-mime'
	| 'application/x-pkcs7-certreqresp'
	| 'application/pkcs7-signature'
	| 'application/pro_eng'
	| 'text/pascal'
	| 'image/x-portable-bitmap'
	| 'application/vnd.hp-pcl'
	| 'application/x-pcl'
	| 'image/x-pict'
	| 'image/x-pcx'
	| 'chemical/x-pdb'
	| 'application/pdf'
	| 'audio/make.my.funk'
	| 'image/x-portable-graymap'
	| 'image/x-portable-greymap'
	| 'image/pict'
	| 'application/x-newton-compatible-pkg'
	| 'application/vnd.ms-pki.pko'
	| 'text/x-script.perl'
	| 'application/x-pixclscript'
	| 'image/x-xpixmap'
	| 'text/x-script.perl-module'
	| 'application/x-pagemaker'
	| 'image/png'
	| 'application/x-portable-anymap'
	| 'image/x-portable-anymap'
	| 'model/x-pov'
	| 'image/x-portable-pixmap'
	| 'application/mspowerpoint'
	| 'application/powerpoint'
	| 'application/vnd.ms-powerpoint'
	| 'application/x-mspowerpoint'
	| 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
	| 'application/x-freelance'
	| 'paleovu/x-pv'
	| 'text/x-script.phyton'
	| 'application/x-bytecode.python'
	| 'audio/vnd.qcelp'
	| 'image/x-quicktime'
	| 'video/x-qtc'
	| 'audio/x-pn-realaudio'
	| 'audio/x-pn-realaudio-plugin'
	| 'audio/x-realaudio'
	| 'application/x-cmu-raster'
	| 'image/cmu-raster'
	| 'image/x-cmu-raster'
	| 'text/x-script.rexx'
	| 'image/vnd.rn-realflash'
	| 'image/x-rgb'
	| 'application/vnd.rn-realmedia'
	| 'audio/mid'
	| 'application/ringing-tones'
	| 'application/vnd.nokia.ringing-tone'
	| 'application/vnd.rn-realplayer'
	| 'application/x-troff'
	| 'image/vnd.rn-realpix'
	| 'application/x-rtf'
	| 'text/richtext'
	| 'application/rtf'
	| 'video/vnd.rn-realvideo'
	| 'audio/s3m'
	| 'application/x-tbook'
	| 'application/x-lotusscreencam'
	| 'text/x-script.guile'
	| 'text/x-script.scheme'
	| 'video/x-scm'
	| 'application/sdp'
	| 'application/x-sdp'
	| 'application/sounder'
	| 'application/sea'
	| 'application/x-sea'
	| 'application/set'
	| 'text/sgml'
	| 'text/x-sgml'
	| 'application/x-sh'
	| 'application/x-shar'
	| 'text/x-script.sh'
	| 'text/x-server-parsed-html'
	| 'audio/x-psid'
	| 'application/x-sit'
	| 'application/x-stuffit'
	| 'application/x-koan'
	| 'application/x-seelogo'
	| 'application/smil'
	| 'audio/x-adpcm'
	| 'application/solids'
	| 'application/x-pkcs7-certificates'
	| 'text/x-speech'
	| 'application/futuresplash'
	| 'application/x-sprite'
	| 'application/x-wais-source'
	| 'application/streamingmedia'
	| 'application/vnd.ms-pki.certstore'
	| 'application/step'
	| 'application/sla'
	| 'application/vnd.ms-pki.stl'
	| 'application/x-navistyle'
	| 'application/x-sv4cpio'
	| 'application/x-sv4crc'
	| 'image/svg+xml'
	| 'application/x-world'
	| 'x-world/x-svr'
	| 'application/x-shockwave-flash'
	| 'application/x-tar'
	| 'application/toolbook'
	| 'application/x-tcl'
	| 'text/x-script.tcl'
	| 'text/x-script.tcsh'
	| 'application/x-tex'
	| 'application/x-texinfo'
	| 'application/plain'
	| 'application/gnutar'
	| 'image/tiff'
	| 'image/x-tiff'
	| 'application/toml'
	| 'audio/tsp-audio'
	| 'application/dsptype'
	| 'audio/tsplayer'
	| 'text/tab-separated-values'
	| 'application/i-deas'
	| 'text/uri-list'
	| 'application/x-ustar'
	| 'multipart/x-ustar'
	| 'text/x-uuencode'
	| 'application/x-cdlink'
	| 'text/x-vcalendar'
	| 'application/vda'
	| 'video/vdo'
	| 'application/groupwise'
	| 'video/vivo'
	| 'video/vnd.vivo'
	| 'application/vocaltec-media-desc'
	| 'application/vocaltec-media-file'
	| 'audio/voc'
	| 'audio/x-voc'
	| 'video/vosaic'
	| 'audio/voxware'
	| 'audio/x-twinvq-plugin'
	| 'audio/x-twinvq'
	| 'application/x-vrml'
	| 'model/vrml'
	| 'x-world/x-vrml'
	| 'x-world/x-vrt'
	| 'application/x-visio'
	| 'application/wordperfect6.0'
	| 'application/wordperfect6.1'
	| 'audio/wav'
	| 'audio/x-wav'
	| 'application/x-qpro'
	| 'image/vnd.wap.wbmp'
	| 'application/vnd.xara'
	| 'video/webm'
	| 'audio/webm'
	| 'image/webp'
	| 'application/x-123'
	| 'windows/metafile'
	| 'text/vnd.wap.wml'
	| 'application/vnd.wap.wmlc'
	| 'text/vnd.wap.wmlscript'
	| 'application/vnd.wap.wmlscriptc'
	| 'video/x-ms-wmv'
	| 'application/wordperfect'
	| 'application/x-wpwin'
	| 'application/x-lotus'
	| 'application/mswrite'
	| 'application/x-wri'
	| 'text/scriplet'
	| 'application/x-wintalk'
	| 'image/x-xbitmap'
	| 'image/x-xbm'
	| 'image/xbm'
	| 'video/x-amt-demorun'
	| 'xgl/drawing'
	| 'image/vnd.xiff'
	| 'application/excel'
	| 'application/vnd.ms-excel'
	| 'application/x-excel'
	| 'application/x-msexcel'
	| 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
	| 'audio/xm'
	| 'application/xml'
	| 'text/xml'
	| 'xgl/movie'
	| 'application/x-vnd.ls-xpix'
	| 'image/xpm'
	| 'video/x-amt-showrun'
	| 'image/x-xwd'
	| 'image/x-xwindowdump'
	| 'text/vnd.yaml'
	| 'application/x-compress'
	| 'application/x-zip-compressed'
	| 'application/zip'
	| 'multipart/x-zip'
	| 'text/x-script.zsh';
