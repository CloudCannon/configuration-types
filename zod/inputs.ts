import * as z from 'zod/v4';
import { DocumentationSchema } from './documentation.ts';
import { BlockEditableSchema } from './editables.ts';
import { IconSchema } from './icon.ts';
import { ImageResizeableSchema } from './image-resizeable.ts';
import { MimeTypeSchema } from './mimetype.ts';
import { WithPathsSchema } from './paths.ts';
import { WithPickerPreviewSchema, WithPreviewSchema } from './preview.ts';
import { SelectValuesSchema } from './select-values.ts';
import { SourceEditorSchema } from './source-editor.ts';
import { StructureSchema } from './structures.ts';
import { SyntaxSchema } from './syntax.ts';
import { TimezoneSchema } from './timezone.ts';

export const InstanceValueSchema = z.enum(['UUID', 'NOW']);

export const InputTypeSchema = z.enum([
	'text',
	'textarea',
	'email',
	'disabled',
	'pinterest',
	'facebook',
	'twitter',
	'github',
	'instagram',
	'code',
	'checkbox',
	'switch',
	'color',
	'number',
	'range',
	'url',
	'html',
	'markdown',
	'date',
	'datetime',
	'time',
	'file',
	'image',
	'document',
	'select',
	'multiselect',
	'choice',
	'multichoice',
	'object',
	'array',
	'auto',
]);

export const inputTypeMessage =
	'Sets an input type, which controls how this input appears and behaves.';

export const TimezoneInputTypeSchema = z.enum([
	'text',
	'textarea',
	'email',
	'disabled',
	'pinterest',
	'facebook',
	'twitter',
	'github',
	'instagram',
	'text',
	'textarea',
	'email',
	'disabled',
	'pinterest',
	'facebook',
	'twitter',
	'github',
	'instagram',
	'code',
	'checkbox',
	'switch',
	'color',
	'number',
	'range',
	'url',
	'html',
	'markdown',
	'date',
	'datetime',
	'time',
	'file',
	'image',
	'document',
	'select',
	'multiselect',
	'choice',
	'multichoice',
	'object',
	'array',
	'auto',
]);

export const WithRequiredValidationSchema = z.object({
	required: z
		.boolean()
		.default(false)
		.optional()
		.describe(
			'This key toggles whether CloudCannon requires this Input to have a value. If set to true, CloudCannon will require you to enter a value to save your changes, or discard your unsaved changes.'
		),
	required_message: z
		.string()
		.optional()
		.describe(
			'This key defines the message that explains why an Input is required. This key requires you to define `options.required`.'
		),
});

export const WithTextValidationSchema = z.object({
	max_length: z
		.number()
		.optional()
		.describe(
			'This key defines the maximum string length, in characters, that CloudCannon will allow in an Input. When configured, CloudCannon will warn you when an Input value is too long. If the Input already contains a longer value, CloudCannon will require you to remove characters until the Input contains a valid string to save your changes, or discard your unsaved changes.'
		),
	max_length_message: z
		.string()
		.optional()
		.describe(
			'This key defines the message that explains which maximum string length an Input will accept. This key requires you to define `options.max_length`.'
		),
	min_length: z
		.number()
		.optional()
		.describe(
			'This key defines the minimum string length, in characters, that CloudCannon will allow in an Input. When configured, CloudCannon will warn you when an Input value is too short. If the Input already contains a shorter value, CloudCannon will require you to add characters until the Input contains a valid string to save your changes, or discard your unsaved changes.'
		),
	min_length_message: z
		.string()
		.optional()
		.describe(
			'This key defines the message that explains which minimum string length an Input will accept. This key requires you to define `options.min_length`.'
		),
	pattern: z
		.string()
		.optional()
		.describe(
			'This key defines a regular expression that the Input value must match. When configured, CloudCannon will require you to enter a value that matches the REGEX pattern. If the Input already contains an invalid value, CloudCannon will require you to enter a valid string to save your changes, or discard your unsaved changes.'
		),
	pattern_message: z
		.string()
		.optional()
		.describe(
			'This key defines the message that explains which regular expression an Input will accept. This key requires you to define `options.pattern`.'
		),
	pattern_flags: z
		.object({
			global: z.boolean().optional().describe('`g` - Search globally.'),
			ignore_case: z.boolean().optional().describe('`i` - Case-insensitive.'),
			multiline: z
				.boolean()
				.optional()
				.describe(
					'`m` - `^` and `$` match the start and end of each line rather than the entire string.'
				),
			dot_all: z.boolean().optional().describe('`s` - `.` matches newline characters.'),
			unicode: z
				.boolean()
				.optional()
				.describe('`u` - Pattern is treated as a sequence of Unicode code points.'),
			unicode_sets: z.boolean().optional().describe('`v` - Extended `unicode` mode.'),
		})
		.optional()
		.describe(
			'This key defines the flags (e.g. case-insensitive searching) for the regular expression set in `options.pattern`.'
		),
});

export const WithArrayValidationSchema = z.object({
	max_items: z
		.number()
		.optional()
		.describe(
			'This key defines the maximum number of items CloudCannon will allow in an Input. When configured, CloudCannon will prevent you from adding more items to this Input. If the Input already contains more items, CloudCannon will require you to remove items until the Input contains a valid number to save your changes, or discard your unsaved changes.'
		),
	max_items_message: z
		.string()
		.optional()
		.describe(
			'This key defines the message that explains why an Input needs to have a maximum number of items. This key requires you to define `options.max_items`.'
		),
	min_items: z
		.number()
		.optional()
		.describe(
			'This key defines the minimum number of items CloudCannon will allow in an Input. When configured, CloudCannon will prevent you from removing items from this Input below this value. If the Input already contains fewer items, CloudCannon will require you to add items until the Input contains a valid number to save your changes, or discard your unsaved changes.'
		),
	min_items_message: z
		.string()
		.optional()
		.describe(
			'This key defines the message that explains why an Input needs to have a minimum number of items. This key requires you to define `options.min_items`.'
		),
	unique_on: z
		.string()
		.optional()
		.describe(
			'This key defines the JSON Path selector that CloudCannon should use to determine if the value of an Input is unique. When configured, CloudCannon will require the value of the Input to be unique compared to the value defined on the JSON Path. If the Input already contains a non-unique value, CloudCannon will require you to change it to a valid value to save your changes, or discard your unsaved changes.'
		),
	unique_on_message: z
		.string()
		.optional()
		.describe(
			'This key defines the message that explains why an Input needs to be unique. This key requires you to define `options.unique_on`.'
		),
});

export const WithArrayControlOptionsSchema = z.object({
	disable_add: z
		.boolean()
		.default(false)
		.describe(
			'Hides the add button, and context menu actions on each item for adding new items to this Input.'
		),
	disable_remove: z
		.boolean()
		.default(false)
		.describe('Hides the context menu actions on each item for removing them.'),
	disable_reorder: z
		.boolean()
		.default(false)
		.describe('Hides the controls on each item for moving them.'),
});

export const WithEmptyTypeTextSchema = z.object({
	empty_type: z
		.enum(['null', 'string'])
		.default('null')
		.optional()
		.describe('Set how an ‘empty’ value will be saved. Does not apply to existing empty values.'),
});

export const WithEmptyTypeNumberSchema = z.object({
	empty_type: z
		.enum(['null', 'number'])
		.default('null')
		.optional()
		.describe('Set how an ‘empty’ value will be saved. Does not apply to existing empty values.'),
});

export const WithEmptyTypeObjectSchema = z.object({
	empty_type: z
		.enum(['null', 'object'])
		.default('null')
		.optional()
		.describe('Set how an ‘empty’ value will be saved. Does not apply to existing empty values.'),
});

export const WithEmptyTypeArraySchema = z.object({
	empty_type: z
		.enum(['null', 'array'])
		.default('null')
		.optional()
		.describe('Set how an ‘empty’ value will be saved. Does not apply to existing empty values.'),
});

export const ContextSchema = z.object({
	content: z
		.string()
		.optional()
		.describe('The rich text content shown when opened. Supports a limited set of Markdown.'),
	open: z.boolean().default(false).optional().describe('Makes the content visible initially.'),
	title: z
		.string()
		.optional()
		.describe('The text shown when not open. Defaults to "Context" if unset.'),
	icon: IconSchema.optional().describe(
		'The icon shown when not open. Defaults to "auto_stories" if unset.'
	),
});

export const BaseInputSchema = z.object({
	comment: z
		.string()
		.optional()
		.describe(
			'Changes the subtext below the _Label_. Has no default. Supports a limited set of Markdown: links, bold, italic, subscript, superscript, and inline code elements are allowed.'
		),
	context: ContextSchema.optional().describe(
		'Adds an expandable section of rich text below the input.'
	),
	documentation: DocumentationSchema.optional().describe(
		'Provides a custom link for documentation for editors shown above input.'
	),
	label: z.string().optional().describe('Optionally changes the text above this input.'),
	hidden: z.boolean().default(false).optional().describe('Toggles the visibility of this input.'),
	disabled: z.boolean().default(false).optional().describe('Toggles if this input can be edited.'),
	instance_value: InstanceValueSchema.optional().describe(
		'Controls if and how the value of this input is instantiated when created. This occurs when creating files, or adding array items containing the configured input.'
	),
	disable_instance_value_rehydration: z
		.boolean()
		.default(false)
		.optional()
		.describe(
			'Prevents the default where inputs configured with an `instance_value` are rehydrated with a new value when duplicated in the CMS.'
		),
	cascade: z
		.boolean()
		.default(false)
		.optional()
		.describe(
			'Specifies whether or not this input configuration should be merged with any matching, less specific configuration.'
		),
});

export const TextInputOptionsSchema = WithEmptyTypeTextSchema.extend(WithTextValidationSchema.shape)
	.extend(WithRequiredValidationSchema.shape)
	.extend({
		placeholder: z.string().optional().describe('Text shown when this input has no value.'),
		icon: IconSchema.optional().describe('Icon shown beside the input.'),
	});

export const TextInputSchema = BaseInputSchema.extend({
	type: z
		.literal([
			'text',
			'email',
			'disabled',
			'pinterest',
			'facebook',
			'twitter',
			'github',
			'instagram',
		])
		.describe(inputTypeMessage),
	options: TextInputOptionsSchema.describe('Options that are specific to Text Inputs.'),
});

export const TextareaInputOptionsSchema = TextInputOptionsSchema.extend({
	show_count: z
		.boolean()
		.default(false)
		.optional()
		.describe('Shows a character counter below the input if enabled.'),
});

export const TextareaInputSchema = BaseInputSchema.extend({
	type: z.literal('textarea').describe(inputTypeMessage),
	options: TextareaInputOptionsSchema.describe('Options that are specific to Textarea Inputs.'),
});

export const CodeInputOptionsSchema = WithEmptyTypeTextSchema.extend(SourceEditorSchema.shape)
	.extend(WithTextValidationSchema.shape)
	.extend(WithRequiredValidationSchema.shape)
	.extend({
		max_visible_lines: z
			.number()
			.optional()
			.describe(
				'Sets the maximum number of visible lines for this input, effectively controlling maximum height. When the containing text exceeds this number, the input becomes a scroll area.'
			),
		min_visible_lines: z
			.number()
			.optional()
			.describe(
				'Sets the minimum number of visible lines for this input, effectively controlling initial height. When the containing text exceeds this number, the input grows line by line to the lines defined by `max_visible_lines`.'
			),
		syntax: SyntaxSchema.optional().describe(
			'Changes how the editor parses your content for syntax highlighting. Should be set to the language of the code going into the input.'
		),
	});

export const CodeInputSchema = BaseInputSchema.extend({
	type: z.literal('code').describe(inputTypeMessage),
	options: CodeInputOptionsSchema.describe('Options that are specific to Code Inputs.'),
});

export const ColorInputOptionsSchema = WithEmptyTypeTextSchema.extend(
	WithTextValidationSchema.shape
)
	.extend(WithRequiredValidationSchema.shape)
	.extend({
		format: z
			.enum(['rgb', 'hex', 'hsl', 'hsv'])
			.optional()
			.describe(
				'Sets what format the color value is saved as. Defaults to the naming convention, or HEX if that is unset.'
			),
		alpha: z
			.boolean()
			.optional()
			.describe(
				'Toggles showing a control for adjusting the transparency of the selected color. Defaults to using the naming convention, enabled if the input key ends with "a".'
			),
	});

export const ColorInputSchema = BaseInputSchema.extend({
	type: z.literal('color').describe(inputTypeMessage),
	options: ColorInputOptionsSchema.describe('Options that are specific to Color Inputs.'),
});

export const BooleanInputSchema = BaseInputSchema.extend({
	type: z.literal('checkbox').describe(inputTypeMessage),
});

export const minDescription =
	'This key defines the minimum numerical value CloudCannon will allow in an Input. When configured, CloudCannon will prevent you from entering a lesser numerical value. If the Input already contains a lesser numerical value, CloudCannon will require you to enter a valid value to save your changes, or discard your unsaved changes.';
export const maxDescription =
	'This key defines the maximum numerical value CloudCannon will allow in an Input. When configured, CloudCannon will prevent you from entering a greater numerical value. If the Input already contains a greater numerical value, CloudCannon will require you to enter a valid value to save your changes, or discard your unsaved changes.';
export const stepDescription =
	'A number that specifies the granularity that the value must adhere to, or the special value any, which allows any decimal value between `max` and `min`.';

export const NumberInputOptionsSchema = WithEmptyTypeNumberSchema.extend(
	WithRequiredValidationSchema.shape
).extend({
	min: z.number().optional().describe(minDescription),
	max: z.number().optional().describe(maxDescription),
	step: z.number().optional().describe(stepDescription),
	min_message: z
		.string()
		.optional()
		.describe(
			'This key defines the message that explains why an Input needs to have a minimum numerical value. This key requires you to define `options.min`.'
		),
	max_message: z
		.string()
		.optional()
		.describe(
			'This key defines the message that explains why an Input needs to have a maximum numerical value. This key requires you to define `options.max`.'
		),
});

export const NumberInputSchema = BaseInputSchema.extend({
	type: z.literal('number').describe(inputTypeMessage),
	options: NumberInputOptionsSchema.describe('Options that are specific to Number Inputs.'),
});

// Max and min are required, step is optional
export const RangeInputOptionsSchema = WithEmptyTypeNumberSchema.extend(
	WithRequiredValidationSchema.shape
).extend({
	min: z.number().describe(minDescription),
	max: z.number().describe(maxDescription),
	step: z.number().optional().describe(stepDescription),
	min_message: z
		.string()
		.optional()
		.describe(
			'This key defines the message that explains why an Input needs to have a minimum numerical value. This key requires you to define `options.min`.'
		),
	max_message: z
		.string()
		.optional()
		.describe(
			'This key defines the message that explains why an Input needs to have a maximum numerical value. This key requires you to define `options.max`.'
		),
});

export const RangeInputSchema = BaseInputSchema.extend({
	type: z.literal('range').describe(inputTypeMessage),
	options: RangeInputOptionsSchema.describe('Options that are specific to Range Inputs.'),
});

export const RichTextInputOptionsSchema = WithEmptyTypeTextSchema.extend(
	ImageResizeableSchema.shape
)
	.extend(BlockEditableSchema.shape)
	.extend(WithTextValidationSchema.shape)
	.extend(WithRequiredValidationSchema.shape)
	.extend({
		allow_resize: z
			.boolean()
			.default(false)
			.optional()
			.describe('Shows or hides the resize handler to vertically resize the input.'),
		initial_height: z
			.number()
			.optional()
			.describe('Defines the initial height of this input in pixels (px).'),
	});

export const RichTextInputSchema = BaseInputSchema.extend({
	type: z.literal(['html', 'markdown']).describe(inputTypeMessage),
	options: RichTextInputOptionsSchema.describe('Options that are specific to Rich Text Inputs.'),
});

export const DateInputOptionsSchema = WithEmptyTypeTextSchema.extend(
	WithRequiredValidationSchema.shape
).extend({
	timezone: TimezoneSchema.optional()
		.default('Etc/UTC')
		.describe(
			'Specifies the time zone that dates are displayed and edited in. Also changes the suffix the date is persisted to the file with. Defaults to the global `timezone`.'
		),
	// TODO turn make this a date, currently breaks the schema
	start_from: z
		.string()
		.optional()
		.describe(
			'This key defines the earliest date and time, inclusive, that CloudCannon will allow in an Input. When configured, CloudCannon will prevent you from selecting an earlier date and time. If the Input already contains an earlier date and time, CloudCannon will require you to change it to a valid value to save your changes, or discard your unsaved changes. Value must be in ISO8601 format. If `options.end_before` is also configured, this key cannot be a later date and time.'
		),
	start_from_message: z
		.string()
		.optional()
		.describe(
			'This key defines the message that explains why an Input needs to have a start date. This key requires you to define `options.start_from`.'
		),
	// TODO turn make this a date, currently breaks the schema
	end_before: z
		.string()
		.optional()
		.describe(
			'This key defines the date and time, exclusive, that CloudCannon will allow in an Input. When configured, CloudCannon will prevent you from selecting a later date and time. If the Input already contains a later date and time, CloudCannon will require you to change it to a valid value to save your changes, or discard your unsaved changes. Value must be in ISO8601 format. If options.start_from is also configured, this key cannot be an earlier date and time. This key has no default.'
		),
	end_before_message: z
		.string()
		.optional()
		.describe(
			'This key defines the message that explains why an Input needs to have an end date. This key requires you to define `options.end_before`. This key has no default.'
		),
});

export const DateInputSchema = BaseInputSchema.extend({
	type: z.literal(['date', 'datetime']).describe(inputTypeMessage),
	options: DateInputOptionsSchema.describe('Options that are specific to Date Inputs.'),
});

export const TimeInputOptionsSchema = WithEmptyTypeTextSchema.extend(
	WithRequiredValidationSchema.shape
);

export const TimeInputSchema = BaseInputSchema.extend({
	type: z.literal('time').describe(inputTypeMessage),
	options: TimeInputOptionsSchema.describe('Options that are specific to Time Inputs.'),
});

export const FileInputOptionsSchema = WithEmptyTypeTextSchema.extend(WithPathsSchema.shape)
	.extend(ImageResizeableSchema.shape)
	.extend(WithTextValidationSchema.shape)
	.extend(WithRequiredValidationSchema.shape)
	.extend({
		accepts_mime_types: MimeTypeSchema.optional().describe(
			'Restricts which file types are available to select or upload to this input. Accepted format is an array or comma-separated string of MIME types. The special value "*" means any type is accepted.'
		),
		max_file_size: z
			.number()
			.optional()
			.describe(
				'This key defines the maximum file size, in kilobytes, that CloudCannon will allow in an Input. When configured, CloudCannon will prevent you from uploading a file larger than the specified size. If the Input already contains a file larger than the specified size, CloudCannon will require you to change it to a valid value to save your changes, or discard your unsaved changes. Value can be any positive integer.'
			),
		max_file_size_message: z
			.string()
			.optional()
			.describe(
				'This key defines the message that explains why an Input needs to have a maximum file size. This key requires you to define `options.max_file_size`. This key has no default.'
			),
		allowed_sources: z
			.array(z.string())
			.optional()
			.describe(
				'If you have one or more DAMs connected to your site, you can use this key to list which asset sources can be uploaded to and selected from.'
			),
		disable_upload_file: z
			.boolean()
			.default(false)
			.optional()
			.describe('Disables the context menu option and the drop area for uploading files.'),
		disable_direct_input: z
			.boolean()
			.default(false)
			.optional()
			.describe(
				'Prevents typing into the text input, while still allowing context menu options to change the value.'
			),
		disable_upload_file_in_file_browser: z
			.boolean()
			.default(false)
			.optional()
			.describe(
				'Prevents file uploads inside the "Select existing file/image" file browser modal window.'
			),
	});

export const FileInputSchema = BaseInputSchema.extend({
	type: z.literal(['file', 'document', 'image']).describe(inputTypeMessage),
	options: FileInputOptionsSchema.describe('Options that are specific to File Inputs.'),
});

export const UrlInputOptionsSchema = FileInputOptionsSchema.extend({
	hide_link_to_file: z
		.boolean()
		.default(false)
		.optional()
		.describe(
			'Hides the options to link to an existing file, and upload a new file. This does not prevent typing a file path in the input.'
		),
	hide_link_to_page: z
		.boolean()
		.default(false)
		.optional()
		.describe(
			"Hides the option to link to a page. This does not prevent typing a file's output URL in the input."
		),
	hide_link_to_email_address: z
		.boolean()
		.default(false)
		.optional()
		.describe(
			'Hides the option to link to an email address. This does not prevent typing a `mailto:` link in the input.'
		),
});

export const UrlInputSchema = BaseInputSchema.extend({
	type: z.literal('url').describe(inputTypeMessage),
	options: UrlInputOptionsSchema.describe('Options that are specific to URL Inputs.'),
});

export const SharedSelectInputOptionsSchema = WithPreviewSchema.extend(
	WithPickerPreviewSchema.shape
)
	.extend(WithRequiredValidationSchema.shape)
	.extend({
		allow_create: z
			.boolean()
			.default(false)
			.optional()
			.describe('Allows new text values to be created at edit time.'),
		allow_empty: z
			.boolean()
			.default(true)
			.optional()
			.describe('Provides an empty option alongside the options provided by values.'),

		values: z
			.union([z.string(), SelectValuesSchema])
			.optional()
			.describe(
				'Defines the values available to choose from. Optional, defaults to fetching values from the naming convention (e.g. colors or my_colors for data set colors).'
			),
		value_key: z
			.string()
			.optional()
			.describe(
				'Defines the key used for mapping between saved values and objects in values. This changes how the input saves selected values to match. Defaults to checking for "id", "uuid", "path", "title", then "name". Has no effect unless values is an array of objects, the key is used instead for objects, and the value itself is used for primitive types.'
			),
		view: z
			.enum(['card', 'text', 'gallery', 'gallery-left'])
			.optional()
			.describe('Controls how selected items are rendered.'),
		picker_view: z
			.enum(['card', 'text', 'gallery', 'gallery-left'])
			.optional()
			.describe('Controls how selectable options are rendered.'),
	});

export const SelectInputOptionsSchema = SharedSelectInputOptionsSchema.extend(
	WithEmptyTypeTextSchema.shape
).extend(WithTextValidationSchema.shape);

export const SelectInputSchema = BaseInputSchema.extend({
	type: z.literal('select').describe(inputTypeMessage),
	options: SelectInputOptionsSchema.describe('Options that are specific to Select Inputs.'),
});

export const MultiselectInputOptionsSchema = SharedSelectInputOptionsSchema.extend(
	WithEmptyTypeArraySchema.shape
).extend(WithArrayValidationSchema.shape);

export const MultiselectInputSchema = BaseInputSchema.extend({
	type: z.literal('multiselect').describe(inputTypeMessage),
	options: MultiselectInputOptionsSchema.describe(
		'Options that are specific to Multiselect Inputs.'
	),
});

export const SharedChoiceInputOptionsSchema = SharedSelectInputOptionsSchema.omit({
	allow_create: true,
});
export const ChoiceInputOptionsSchema = SharedChoiceInputOptionsSchema.extend(
	WithEmptyTypeTextSchema.shape
).extend(WithTextValidationSchema.shape);
export const ChoiceInputSchema = BaseInputSchema.extend({
	type: z.literal('choice').describe(inputTypeMessage),
	options: ChoiceInputOptionsSchema.describe('Options that are specific to Choice Inputs.'),
});

export const MultichoiceInputOptionsSchema = SharedChoiceInputOptionsSchema.extend(
	WithEmptyTypeArraySchema.shape
).extend(WithArrayValidationSchema.shape);

export const MultichoiceInputSchema = BaseInputSchema.extend({
	type: z.literal('multichoice').describe(inputTypeMessage),
	options: MultichoiceInputOptionsSchema.describe(
		'Options that are specific to Multichoice Inputs.'
	),
});

export const ObjectInputGroupSchema = z.object({
	heading: z
		.string()
		.optional()
		.describe('The main text for the group shown when collapsed or expanded.'),
	comment: z
		.string()
		.optional()
		.describe(
			'Changes the subtext below the `heading`. Has no default. Supports a limited set of Markdown: links, bold, italic, subscript, superscript, and inline code elements are allowed.'
		),
	collapsed: z
		.boolean()
		.default(false)
		.optional()
		.describe('Controls if this group is collapsed or expanded when first viewed.'),
	inputs: z.array(z.string()).optional().describe('The keys of each input in this group.'),
	documentation: DocumentationSchema.optional().describe(
		'Provides a custom link for documentation for editors shown above the collection file list.'
	),
});

export const ObjectInputOptionsSchema = WithEmptyTypeObjectSchema.extend(WithPreviewSchema.shape)
	.extend(WithRequiredValidationSchema.shape)
	.extend({
		subtype: z
			.enum(['object', 'mutable', 'tabbed'])
			.optional()
			.describe('Changes the appearance and behavior of the input.'),
		entries: z
			.object({
				allowed_keys: z
					.array(z.string())
					.optional()
					.describe(
						'Defines a limited set of keys that can exist on the data within an object input. This set is used when entries are added and renamed with `allow_create` enabled. Has no effect if `allow_create` is not enabled.'
					),
				assigned_structures: z
					.record(z.string(), z.array(z.string()))
					.optional()
					.describe(
						'Provides data formats when adding entries to the data within this object input. When adding an entry, team members are prompted to choose from a number of values you have defined. Has no effect if `allow_create` is false. `entries.structures` applies to the entries within the object.'
					),
				get structures() {
					return z
						.union([z.string(), StructureSchema])
						.optional()
						.describe(
							'Provides data formats for value of this object. When choosing an item, team members are prompted to choose from a number of values you have defined. `structures` applies to the object itself.'
						);
				},
			})
			.optional()
			.describe('Contains options for the "mutable" subtype.'),

		get structures() {
			return z
				.union([z.string(), StructureSchema])
				.optional()
				.describe(
					'Provides data formats for value of this object. When choosing an item, team members are prompted to choose from a number of values you have defined. `structures` applies to the object itself.'
				);
		},
		get groups() {
			return z
				.array(ObjectInputGroupSchema)
				.optional()
				.describe(
					'Allows you to group the inputs inside this object together without changing the data structure.'
				);
		},
		place_groups_below: z
			.boolean()
			.default(false)
			.optional()
			.describe('Controls which order input groups and ungrouped inputs appear in.'),
		allow_label_formatting: z
			.boolean()
			.default(false)
			.optional()
			.describe('Controls whether or not labels on mutable object entries are formatted.'),
		view: z
			.enum(['card', 'gallery', 'gallery-left'])
			.optional()
			.describe('Controls how object previews are rendered.'),
	});

export const ObjectInputSchema = BaseInputSchema.extend({
	type: z.literal('object').describe(inputTypeMessage),
	options: ObjectInputOptionsSchema.describe('Options that are specific to Object Inputs.'),
});

export const ArrayInputOptionsSchema = WithEmptyTypeArraySchema.extend(
	WithRequiredValidationSchema.shape
)
	.extend(WithArrayValidationSchema.shape)
	.extend(WithArrayControlOptionsSchema.shape);

export const ArrayInputSchema = BaseInputSchema.extend({
	type: z.literal('array').describe(inputTypeMessage),
	options: ArrayInputOptionsSchema.describe('Options that are specific to Array Inputs.'),
});

export const AutoInputSchema = BaseInputSchema.extend({
	type: z.literal('auto').describe(inputTypeMessage),
	options: z.unknown().describe('Options that are specific to this `type` of input.'),
});

export const UnknownInputSchema = BaseInputSchema.extend({
	options: z.unknown().describe('Options that are specific to this `type` of input.'),
});

// Known Input Union
export const KnownInputSchema = z.discriminatedUnion('type', [
	TextInputSchema,
	TextareaInputSchema,
	CodeInputSchema,
	ColorInputSchema,
	BooleanInputSchema,
	NumberInputSchema,
	RangeInputSchema,
	RichTextInputSchema,
	DateInputSchema,
	TimeInputSchema,
	FileInputSchema,
	UrlInputSchema,
	SelectInputSchema,
	MultiselectInputSchema,
	ChoiceInputSchema,
	MultichoiceInputSchema,
	ObjectInputSchema,
	ArrayInputSchema,
	AutoInputSchema,
]);

// Input Union (includes unknown)
export const InputSchema = z.union([KnownInputSchema, UnknownInputSchema]);

// Type exports
export type WithRequiredValidation = z.infer<typeof WithRequiredValidationSchema>;
export type WithTextValidation = z.infer<typeof WithTextValidationSchema>;
export type WithArrayValidation = z.infer<typeof WithArrayValidationSchema>;
export type WithArrayControlOptions = z.infer<typeof WithArrayControlOptionsSchema>;
export type WithEmptyTypeText = z.infer<typeof WithEmptyTypeTextSchema>;
export type WithEmptyTypeNumber = z.infer<typeof WithEmptyTypeNumberSchema>;
export type WithEmptyTypeObject = z.infer<typeof WithEmptyTypeObjectSchema>;
export type WithEmptyTypeArray = z.infer<typeof WithEmptyTypeArraySchema>;
export type Context = z.infer<typeof ContextSchema>;
export type BaseInput = z.infer<typeof BaseInputSchema>;
export type TextInputOptions = z.infer<typeof TextInputOptionsSchema>;
export type TextInput = z.infer<typeof TextInputSchema>;
export type TextareaInputOptions = z.infer<typeof TextareaInputOptionsSchema>;
export type TextareaInput = z.infer<typeof TextareaInputSchema>;
export type Syntax = z.infer<typeof SyntaxSchema>;
export type CodeInputOptions = z.infer<typeof CodeInputOptionsSchema>;
export type CodeInput = z.infer<typeof CodeInputSchema>;
export type ColorInputOptions = z.infer<typeof ColorInputOptionsSchema>;
export type ColorInput = z.infer<typeof ColorInputSchema>;
export type BooleanInput = z.infer<typeof BooleanInputSchema>;
export type NumberInputOptions = z.infer<typeof NumberInputOptionsSchema>;
export type NumberInput = z.infer<typeof NumberInputSchema>;
export type RangeInputOptions = z.infer<typeof RangeInputOptionsSchema>;
export type RangeInput = z.infer<typeof RangeInputSchema>;
export type RichTextInputOptions = z.infer<typeof RichTextInputOptionsSchema>;
export type RichTextInput = z.infer<typeof RichTextInputSchema>;
export type DateInputOptions = z.infer<typeof DateInputOptionsSchema>;
export type DateInput = z.infer<typeof DateInputSchema>;
export type TimeInput = z.infer<typeof TimeInputSchema>;
export type MimeType = z.infer<typeof MimeTypeSchema>;
export type FileInputOptions = z.infer<typeof FileInputOptionsSchema>;
export type FileInput = z.infer<typeof FileInputSchema>;
export type UrlInputOptions = z.infer<typeof UrlInputOptionsSchema>;
export type UrlInput = z.infer<typeof UrlInputSchema>;
export type SharedSelectInputOptions = z.infer<typeof SharedSelectInputOptionsSchema>;
export type SelectInputOptions = z.infer<typeof SelectInputOptionsSchema>;
export type SelectInput = z.infer<typeof SelectInputSchema>;
export type MultiselectInputOptions = z.infer<typeof MultiselectInputOptionsSchema>;
export type MultiselectInput = z.infer<typeof MultiselectInputSchema>;
export type SharedChoiceInputOptions = z.infer<typeof SharedChoiceInputOptionsSchema>;
export type ChoiceInputOptions = z.infer<typeof ChoiceInputOptionsSchema>;
export type ChoiceInput = z.infer<typeof ChoiceInputSchema>;
export type MultichoiceInputOptions = z.infer<typeof MultichoiceInputOptionsSchema>;
export type MultichoiceInput = z.infer<typeof MultichoiceInputSchema>;
export type ObjectInputGroup = z.infer<typeof ObjectInputGroupSchema>;
export type ObjectInputOptions = z.infer<typeof ObjectInputOptionsSchema>;
export type ObjectInput = z.infer<typeof ObjectInputSchema>;
export type ArrayInputOptions = z.infer<typeof ArrayInputOptionsSchema>;
export type ArrayInput = z.infer<typeof ArrayInputSchema>;
export type AutoInput = z.infer<typeof AutoInputSchema>;
export type UnknownInput = z.infer<typeof UnknownInputSchema>;
export type KnownInput = z.infer<typeof KnownInputSchema>;
export type Input = z.infer<typeof InputSchema>;
export type InstanceValue = z.infer<typeof InstanceValueSchema>;
export type InputType = z.infer<typeof InputTypeSchema>;
