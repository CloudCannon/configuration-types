import * as z from 'zod';
import { DocumentationSchema } from './documentation.ts';
import { BlockEditableSchema } from './editables.ts';
import { IconSchema } from './icon.ts';
import { ImageOptionsSchema } from './image-options.ts';
import { MimeTypeSchema } from './mimetype.ts';
import { PathsSchema } from './paths.ts';
import { PickerPreviewSchema, PreviewEntriesSchema, PreviewSchema } from './preview.ts';
import { SelectDataValuesSchema } from './select-values.ts';
import { SourceEditorSchema } from './source-editor.ts';
import { StructureReferenceSchema, StructureSchema } from './structures.ts';
import { SyntaxSchema } from './syntax.ts';
import { TimezoneSchema } from './timezone.ts';

export const InputTypeSchema = z
	.enum([
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
	])
	.meta({
		title: 'Input Type',
		description: 'The available input types.',
	});

const typeMeta = {
	title: 'Type',
	description: 'Sets an input type, which controls how this input appears and behaves.',
};

const RequiredValidationSchema = z.object({
	required: z.boolean().default(false).optional().meta({
		id: 'type._inputs.*.options.required',
		description:
			'This key toggles whether CloudCannon requires this Input to have a value. If set to true, CloudCannon will require you to enter a value to save your changes, or discard your unsaved changes.',
	}),
	required_message: z.string().optional().meta({
		id: 'type._inputs.*.options.required_message',
		description:
			'This key defines the message that explains why an Input is required. This key requires you to define `options.required`.',
	}),
});

const TextValidationSchema = z.object({
	max_length: z.number().optional().meta({
		id: 'type._inputs.*.options.max_length',
		description:
			'This key defines the maximum string length, in characters, that CloudCannon will allow in an Input. When configured, CloudCannon will warn you when an Input value is too long. If the Input already contains a longer value, CloudCannon will require you to remove characters until the Input contains a valid string to save your changes, or discard your unsaved changes.',
	}),
	max_length_message: z.string().optional().meta({
		id: 'type._inputs.*.options.max_length_message',
		description:
			'This key defines the message that explains which maximum string length an Input will accept. This key requires you to define `options.max_length`.',
	}),
	min_length: z.number().optional().meta({
		id: 'type._inputs.*.options.min_length',
		description:
			'This key defines the minimum string length, in characters, that CloudCannon will allow in an Input. When configured, CloudCannon will warn you when an Input value is too short. If the Input already contains a shorter value, CloudCannon will require you to add characters until the Input contains a valid string to save your changes, or discard your unsaved changes.',
	}),
	min_length_message: z.string().optional().meta({
		id: 'type._inputs.*.options.min_length_message',
		description:
			'This key defines the message that explains which minimum string length an Input will accept. This key requires you to define `options.min_length`.',
	}),
	pattern: z.string().optional().meta({
		id: 'type._inputs.*.options.pattern',
		description:
			'This key defines a regular expression that the Input value must match. When configured, CloudCannon will require you to enter a value that matches the REGEX pattern. If the Input already contains an invalid value, CloudCannon will require you to enter a valid string to save your changes, or discard your unsaved changes.',
	}),
	pattern_message: z.string().optional().meta({
		id: 'type._inputs.*.options.pattern_message',
		description:
			'This key defines the message that explains which regular expression an Input will accept. This key requires you to define `options.pattern`.',
	}),
	pattern_flags: z
		.object({
			global: z.boolean().default(false).optional().meta({
				description: '`g` - Search globally.',
			}),
			ignore_case: z.boolean().default(false).optional().meta({
				description: '`i` - Case-insensitive.',
			}),
			multiline: z.boolean().default(false).optional().meta({
				description:
					'`m` - `^` and `$` match the start and end of each line rather than the entire string.',
			}),
			dot_all: z.boolean().default(false).optional().meta({
				description: '`s` - `.` matches newline characters.',
			}),
			unicode: z.boolean().default(false).optional().meta({
				description: '`u` - Pattern is treated as a sequence of Unicode code points.',
			}),
			unicode_sets: z.boolean().default(false).optional().meta({
				description: '`v` - Extended `unicode` mode.',
			}),
		})
		.optional()
		.meta({
			id: 'type._inputs.*.options.pattern_flags',
			description:
				'This key defines the flags (e.g. case-insensitive searching) for the regular expression set in `options.pattern`.',
		}),
});

const ArrayValidationSchema = z.object({
	max_items: z.number().optional().meta({
		id: 'type._inputs.*.options.max_items',
		description:
			'This key defines the maximum number of items CloudCannon will allow in an Input. When configured, CloudCannon will prevent you from adding more items to this Input. If the Input already contains more items, CloudCannon will require you to remove items until the Input contains a valid number to save your changes, or discard your unsaved changes.',
	}),
	max_items_message: z.string().optional().meta({
		id: 'type._inputs.*.options.max_items_message',
		description:
			'This key defines the message that explains why an Input needs to have a maximum number of items. This key requires you to define `options.max_items`.',
	}),
	min_items: z.number().optional().meta({
		id: 'type._inputs.*.options.min_items',
		description:
			'This key defines the minimum number of items CloudCannon will allow in an Input. When configured, CloudCannon will prevent you from removing items from this Input below this value. If the Input already contains fewer items, CloudCannon will require you to add items until the Input contains a valid number to save your changes, or discard your unsaved changes.',
	}),
	min_items_message: z.string().optional().meta({
		id: 'type._inputs.*.options.min_items_message',
		description:
			'This key defines the message that explains why an Input needs to have a minimum number of items. This key requires you to define `options.min_items`.',
	}),
	unique_on: z.string().optional().meta({
		id: 'type._inputs.*.options.unique_on',
		description:
			'This key defines the JSON Path selector that CloudCannon should use to determine if the value of an Input is unique. When configured, CloudCannon will require the value of the Input to be unique compared to the value defined on the JSON Path. If the Input already contains a non-unique value, CloudCannon will require you to change it to a valid value to save your changes, or discard your unsaved changes.',
	}),
	unique_on_message: z.string().optional().meta({
		id: 'type._inputs.*.options.unique_on_message',
		description:
			'This key defines the message that explains why an Input needs to be unique. This key requires you to define `options.unique_on`.',
	}),
});

const ArrayControlOptionsSchema = z.object({
	disable_add: z.boolean().default(false).optional().meta({
		id: 'ArrayInput.disable_add',
		description:
			'Hides the add button, and context menu actions on each item for adding new items to this Input.',
	}),
	disable_remove: z.boolean().default(false).optional().meta({
		id: 'disable_remove',
		description: 'Hides the context menu actions on each item for removing them.',
	}),
	disable_reorder: z.boolean().default(false).optional().meta({
		id: 'disable_reorder',
		description: 'Hides the controls on each item for moving them.',
	}),
});

const EmptyTypeTextSchema = z.enum(['null', 'string']).default('null').meta({
	id: 'type._inputs.*.options.empty_type(text)',
	description: 'Set how an ‘empty’ value will be saved. Does not apply to existing empty values.',
});

const EmptyTypeNumberSchema = z.enum(['null', 'number']).default('null').meta({
	id: 'type._inputs.*.options.empty_type(number)',
	description: 'Set how an ‘empty’ value will be saved. Does not apply to existing empty values.',
});

const EmptyTypeObjectSchema = z.enum(['null', 'object']).default('null').meta({
	id: 'type._inputs.*.options.empty_type(object)',
	description: 'Set how an ‘empty’ value will be saved. Does not apply to existing empty values.',
});

const EmptyTypeArraySchema = z.enum(['null', 'array']).default('null').meta({
	id: 'type._inputs.*.options.empty_type(array)',
	description: 'Set how an ‘empty’ value will be saved. Does not apply to existing empty values.',
});

export const ContextSchema = z
	.object({
		content: z.string().optional().meta({
			description: 'The rich text content shown when opened. Supports a limited set of Markdown.',
		}),
		open: z.boolean().default(false).optional().meta({
			description: 'Makes the content visible initially.',
		}),
		title: z.string().optional().meta({
			description: 'The text shown when not open. Defaults to "Context" if unset.',
		}),
		icon: IconSchema.optional().meta({
			description: 'The icon shown when not open. Defaults to "auto_stories" if unset.',
		}),
	})
	.meta({
		id: 'type._inputs.*.context',
		description: 'Adds an expandable section of rich text below the input.',
	});

export const BaseInputSchema = z.object({
	comment: z.string().optional().meta({
		id: 'type._inputs.*.comment',
		description:
			'Changes the subtext below the _Label_. Has no default. Supports a limited set of Markdown: links, bold, italic, subscript, superscript, and inline code elements are allowed.',
	}),
	context: ContextSchema.optional(),
	documentation: DocumentationSchema.optional().meta({
		description: 'Provides a custom link for documentation for editors shown above input.',
	}),
	label: z.string().optional().meta({
		id: 'type._inputs.*.label',
		description: 'Optionally changes the text above this input.',
	}),
	hidden: z
		.union([z.boolean().meta({ title: 'Boolean' }), z.string().meta({ title: 'Query String' })])
		.default(false)
		.optional()
		.meta({
			id: 'type._inputs.*.hidden',
			description: 'Toggles the visibility of this input.',
		}),
	disabled: z
		.union([z.boolean().meta({ title: 'Boolean' }), z.string().meta({ title: 'Query String' })])
		.default(false)
		.optional()
		.meta({
			id: 'type._inputs.*.disabled',
			description: 'Toggles if this input can be edited.',
		}),
	instance_value: z.enum(['UUID', 'NOW']).optional().meta({
		id: 'type._inputs.*.instance_value',
		title: 'Instance Value',
		description:
			'Controls if and how the value of this input is instantiated when created. This occurs when creating files, or adding array items containing the configured input.',
	}),
	disable_instance_value_rehydration: z.boolean().default(false).optional().meta({
		id: 'type._inputs.*.disable_instance_value_rehydration',
		description:
			'Prevents the default where inputs configured with an `instance_value` are rehydrated with a new value when duplicated in the CMS.',
	}),
	cascade: z.boolean().default(true).optional().meta({
		id: 'type._inputs.*.cascade',
		description:
			'Specifies whether or not this input configuration should be merged with any matching, less specific configuration.',
	}),
});

export const TextInputOptionsSchema = z
	.object({
		...TextValidationSchema.shape,
		...RequiredValidationSchema.shape,
		empty_type: EmptyTypeTextSchema.optional(),
		placeholder: z.string().optional().meta({
			description: 'Text shown when this input has no value.',
		}),
		icon: IconSchema.optional().meta({
			description: 'Icon shown beside the input.',
		}),
		icon_color: PreviewEntriesSchema.optional(),
		icon_background_color: PreviewEntriesSchema.optional(),
	})
	.meta({
		description: 'Options that are specific to Text Inputs.',
	});

export const TextInputSchema = z
	.object({
		...BaseInputSchema.shape,
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
			.meta(typeMeta),
		options: TextInputOptionsSchema.optional(),
	})
	.meta({
		id: 'TextInput',
		title: 'Text Input',
		description: 'Provides a simple editing interface for plain text.',
	});

export const TextareaInputOptionsSchema = z
	.object({
		...TextValidationSchema.shape,
		...RequiredValidationSchema.shape,
		empty_type: EmptyTypeTextSchema.optional(),
		placeholder: z.string().optional().meta({
			description: 'Text shown when this input has no value.',
		}),
		show_count: z.boolean().default(false).optional().meta({
			description: 'Shows a character counter below the input if enabled.',
		}),
	})
	.meta({
		description: 'Options that are specific to Textarea Inputs.',
	});

export const TextareaInputSchema = z
	.object({
		...BaseInputSchema.shape,
		type: z.literal('textarea').meta(typeMeta),
		options: TextareaInputOptionsSchema.optional(),
	})
	.meta({
		id: 'TextareaInput',
		title: 'Textarea Input',
		description: 'Provides an editing interface for plain text.',
	});

export const CodeInputOptionsSchema = z
	.object({
		...SourceEditorSchema.shape,
		...TextValidationSchema.shape,
		...RequiredValidationSchema.shape,
		empty_type: EmptyTypeTextSchema.optional(),
		max_visible_lines: z.number().optional().meta({
			description:
				'Sets the maximum number of visible lines for this input, effectively controlling maximum height. When the containing text exceeds this number, the input becomes a scroll area.',
		}),
		min_visible_lines: z.number().optional().meta({
			description:
				'Sets the minimum number of visible lines for this input, effectively controlling initial height. When the containing text exceeds this number, the input grows line by line to the lines defined by `max_visible_lines`.',
		}),
		syntax: SyntaxSchema.optional().meta({
			description:
				'Changes how the editor parses your content for syntax highlighting. Should be set to the language of the code going into the input.',
		}),
	})
	.meta({
		description: 'Options that are specific to Code Inputs.',
	});

export const CodeInputSchema = z
	.object({
		...BaseInputSchema.shape,
		type: z.literal('code').meta(typeMeta),
		options: CodeInputOptionsSchema.optional(),
	})
	.meta({
		id: 'CodeInput',
		title: 'Code Input',
		description: 'Provides an editing interface for code or mono-spaced plain text content.',
	});

export const ColorInputOptionsSchema = z
	.object({
		...TextValidationSchema.shape,
		...RequiredValidationSchema.shape,
		empty_type: EmptyTypeTextSchema.optional(),
		format: z.enum(['rgb', 'hex', 'hsl', 'hsv']).optional().meta({
			description:
				'Sets what format the color value is saved as. Defaults to the naming convention, or HEX if that is unset.',
		}),
		alpha: z.boolean().optional().meta({
			description:
				'Toggles showing a control for adjusting the transparency of the selected color. Defaults to using the naming convention, enabled if the input key ends with "a".',
		}),
		palette: z.array(z.string()).optional(),
		hide_picker: z.boolean().default(false).optional(),
	})
	.meta({
		description: 'Options that are specific to Color Inputs.',
	});

export const ColorInputSchema = z
	.object({
		...BaseInputSchema.shape,
		type: z.literal('color').meta(typeMeta),
		options: ColorInputOptionsSchema.optional(),
	})
	.meta({
		id: 'ColorInput',
		title: 'Color Input',
		description: 'Provides an editing interface for color values.',
	});

export const BooleanInputSchema = z
	.object({
		...BaseInputSchema.shape,
		type: z.enum(['checkbox', 'switch']).meta(typeMeta),
	})
	.meta({
		id: 'BooleanInput',
		title: 'Boolean Input',
		description: 'Provides an editing interface for true or false values.',
	});

const MinSchema = z.number().meta({
	id: 'type._inputs.*.options.min',
	description:
		'This key defines the minimum numerical value CloudCannon will allow in an Input. When configured, CloudCannon will prevent you from entering a lesser numerical value. If the Input already contains a lesser numerical value, CloudCannon will require you to enter a valid value to save your changes, or discard your unsaved changes.',
});

const MaxSchema = z.number().meta({
	id: 'type._inputs.*.options.max',
	description:
		'This key defines the maximum numerical value CloudCannon will allow in an Input. When configured, CloudCannon will prevent you from entering a greater numerical value. If the Input already contains a greater numerical value, CloudCannon will require you to enter a valid value to save your changes, or discard your unsaved changes.',
});

export const NumberInputOptionsSchema = z
	.object({
		...RequiredValidationSchema.shape,
		empty_type: EmptyTypeNumberSchema.optional(),
		min: MinSchema.optional(),
		max: MaxSchema.optional(),
		step: z.number().optional().meta({
			id: 'type._inputs.*.options.step',
			description:
				'A number that specifies the granularity that the value must adhere to, or the special value any, which allows any decimal value between `max` and `min`.',
		}),
		min_message: z.string().optional().meta({
			id: 'type._inputs.*.options.min_message',
			description:
				'This key defines the message that explains why an Input needs to have a minimum numerical value. This key requires you to define `options.min`.',
		}),
		max_message: z.string().optional().meta({
			id: 'type._inputs.*.options.max_message',
			description:
				'This key defines the message that explains why an Input needs to have a maximum numerical value. This key requires you to define `options.max`.',
		}),
	})
	.meta({
		description: 'Options that are specific to Number Inputs.',
	});

export const NumberInputSchema = z
	.object({
		...BaseInputSchema.shape,
		type: z.literal('number').meta(typeMeta),
		options: NumberInputOptionsSchema.optional(),
	})
	.meta({
		id: 'NumberInput',
		title: 'Number Input',
		description: 'Provides an editing interface for numeric values.',
	});

export const RangeInputOptionsSchema = z
	.object({
		...NumberInputOptionsSchema.shape,
		min: MinSchema,
		max: MaxSchema,
	})
	.meta({
		description: 'Options that are specific to Range Inputs.',
	});

export const RangeInputSchema = z
	.object({
		...BaseInputSchema.shape,
		type: z.literal('range').meta(typeMeta),
		options: RangeInputOptionsSchema.optional(),
	})
	.meta({
		id: 'RangeInput',
		title: 'Range Input',
		description: 'Provides a slider interface for selecting a numeric value.',
	});

export const RichTextInputOptionsSchema = z
	.object({
		...ImageOptionsSchema.shape,
		...BlockEditableSchema.shape,
		...TextValidationSchema.shape,
		...RequiredValidationSchema.shape,
		empty_type: EmptyTypeTextSchema.optional(),
		allow_resize: z.boolean().default(false).optional().meta({
			description: 'Shows or hides the resize handler to vertically resize the input.',
		}),
		initial_height: z.number().optional().meta({
			description: 'Defines the initial height of this input in pixels (px).',
		}),
	})
	.meta({
		description: 'Options that are specific to Rich Text Inputs.',
	});

export const RichTextInputSchema = z
	.object({
		...BaseInputSchema.shape,
		type: z.literal(['html', 'markdown']).meta(typeMeta),
		options: RichTextInputOptionsSchema.optional(),
	})
	.meta({
		id: 'RichTextInput',
		title: 'Rich Text Input',
		description: 'Provides an editing interface for HTML markup content.',
	});

export const DateInputOptionsSchema = z
	.object({
		...RequiredValidationSchema.shape,
		empty_type: EmptyTypeTextSchema.optional(),
		timezone: TimezoneSchema.optional().meta({
			description:
				'Specifies the time zone that dates are displayed and edited in. Also changes the suffix the date is persisted to the file with. Defaults to the global `timezone`.',
		}),
		start_from: z
			.union([
				z.iso.datetime({ offset: true, local: true }).meta({ title: 'ISO8601 String' }),
				z.coerce.string().meta({ isJsonSchemaAny: true, documentationType: 'date', title: 'Date' }),
			])
			.optional()
			.meta({
				description:
					'This key defines the earliest date and time, inclusive, that CloudCannon will allow in an Input. When configured, CloudCannon will prevent you from selecting an earlier date and time. If the Input already contains an earlier date and time, CloudCannon will require you to change it to a valid value to save your changes, or discard your unsaved changes. Value must be in ISO8601 format. If `options.end_before` is also configured, this key cannot be a later date and time.',
			}),
		start_from_message: z.string().optional().meta({
			description:
				'This key defines the message that explains why an Input needs to have a start date. This key requires you to define `options.start_from`.',
		}),
		end_before: z
			.union([
				z.iso.datetime({ offset: true, local: true }).meta({ title: 'ISO8601 String' }),
				z.coerce.string().meta({ isJsonSchemaAny: true, documentationType: 'date', title: 'Date' }),
			])
			.optional()
			.meta({
				description:
					'This key defines the date and time, exclusive, that CloudCannon will allow in an Input. When configured, CloudCannon will prevent you from selecting a later date and time. If the Input already contains a later date and time, CloudCannon will require you to change it to a valid value to save your changes, or discard your unsaved changes. Value must be in ISO8601 format. If options.start_from is also configured, this key cannot be an earlier date and time. This key has no default.',
			}),
		end_before_message: z.string().optional().meta({
			description:
				'This key defines the message that explains why an Input needs to have an end date. This key requires you to define `options.end_before`. This key has no default.',
		}),
	})
	.meta({
		description: 'Options that are specific to Date Inputs.',
	});

export const DateInputSchema = z
	.object({
		...BaseInputSchema.shape,
		type: z.literal(['date', 'datetime']).meta(typeMeta),
		options: DateInputOptionsSchema.optional(),
	})
	.meta({
		id: 'DateInput',
		title: 'Date Input',
		description: 'Provides an editing interface for date and/or time values.',
	});

export const TimeInputOptionsSchema = z
	.object({
		...RequiredValidationSchema.shape,
		empty_type: EmptyTypeTextSchema.optional(),
	})
	.meta({
		description: 'Options that are specific to Time Inputs.',
	});

export const TimeInputSchema = z
	.object({
		...BaseInputSchema.shape,
		type: z.literal('time').meta(typeMeta),
		options: TimeInputOptionsSchema.optional(),
	})
	.meta({
		id: 'TimeInput',
		title: 'Time Input',
		description: 'Provides an editing interface for time values only.',
	});

export const FileInputOptionsSchema = z
	.object({
		...ImageOptionsSchema.shape,
		...TextValidationSchema.shape,
		...RequiredValidationSchema.shape,
		empty_type: EmptyTypeTextSchema.optional(),
		paths: PathsSchema.optional(),
		accepts_mime_types: z
			.union([
				z.string().meta({ title: 'Comma Separated' }),
				z.array(MimeTypeSchema).meta({ title: 'Array' }),
			])
			.optional()
			.meta({
				id: 'type._inputs.*.options.accepts_mime_types',
				description:
					'Restricts which file types are available to select or upload to this input. Accepted format is an array or comma-separated string of MIME types. The special value "*" means any type is accepted.',
			}),
		max_file_size: z.number().optional().meta({
			id: 'type._inputs.*.options.max_file_size',
			description:
				'This key defines the maximum file size, in kilobytes, that CloudCannon will allow in an Input. When configured, CloudCannon will prevent you from uploading a file larger than the specified size. If the Input already contains a file larger than the specified size, CloudCannon will require you to change it to a valid value to save your changes, or discard your unsaved changes. Value can be any positive integer.',
		}),
		max_file_size_message: z.string().optional().meta({
			id: 'type._inputs.*.options.max_file_size_message',
			description:
				'This key defines the message that explains why an Input needs to have a maximum file size. This key requires you to define `options.max_file_size`. This key has no default.',
		}),
		disable_upload_file: z.boolean().default(false).optional().meta({
			id: 'type._inputs.*.options.disable_upload_file',
			description: 'Disables the context menu option and the drop area for uploading files.',
		}),
		disable_direct_input: z.boolean().default(false).optional().meta({
			id: 'type._inputs.*.options.disable_direct_input',
			description:
				'Prevents typing into the text input, while still allowing context menu options to change the value.',
		}),
		disable_upload_file_in_file_browser: z.boolean().default(false).optional().meta({
			id: 'type._inputs.*.options.disable_upload_file_in_file_browser',
			description:
				'Prevents file uploads inside the "Select existing file/image" file browser modal window.',
		}),
	})
	.meta({
		description: 'Options that are specific to File Inputs.',
	});

export const FileInputSchema = z
	.object({
		...BaseInputSchema.shape,
		type: z.literal(['file', 'document', 'image']).meta(typeMeta),
		options: FileInputOptionsSchema.optional(),
	})
	.meta({
		id: 'FileInput',
		title: 'File Input',
		description:
			'Provides an editing interface for uploading files to your repository or DAM and browsing existing assets.',
	});

export const UrlInputOptionsSchema = z
	.object({
		...FileInputOptionsSchema.shape,
		hide_link_to_file: z.boolean().default(false).optional().meta({
			description:
				'Hides the options to link to an existing file, and upload a new file. This does not prevent typing a file path in the input.',
		}),
		hide_link_to_page: z.boolean().default(false).optional().meta({
			description:
				"Hides the option to link to a page. This does not prevent typing a file's output URL in the input.",
		}),
		hide_link_to_email_address: z.boolean().default(false).optional().meta({
			description:
				'Hides the option to link to an email address. This does not prevent typing a `mailto:` link in the input.',
		}),
		hide_link_to_telephone: z.boolean().default(false).optional().meta({
			description:
				'Hides the option to link to a telephone number. This does not prevent typing a `tel:` link in the input.',
		}),
	})
	.meta({
		description: 'Options that are specific to URL Inputs.',
	});

export const UrlInputSchema = z
	.object({
		...BaseInputSchema.shape,
		type: z.literal('url').meta(typeMeta),
		options: UrlInputOptionsSchema.optional(),
	})
	.meta({
		id: 'UrlInput',
		title: 'URL Input',
		description: 'Provides an editing interface for relative, absolute, and fully qualified URLs.',
	});

export const SharedSelectInputOptionsSchema = z.object({
	...RequiredValidationSchema.shape,
	preview: PreviewSchema.optional(),
	picker_preview: PickerPreviewSchema.optional(),
	allow_create: z.boolean().default(false).optional().meta({
		id: 'type._inputs.*.options.allow_create',
		description: 'Allows new text values to be created at edit time.',
	}),
	allow_empty: z.boolean().default(true).optional().meta({
		id: 'type._inputs.*.options.allow_empty',
		description: 'Provides an empty option alongside the options provided by values.',
	}),
	values: z
		.union([
			z.string().meta({ title: 'Dataset Reference', description: 'Reference to a dataset.' }),
			SelectDataValuesSchema,
		])
		.optional()
		.meta({
			id: 'type._inputs.*.options.values',
			description:
				'Defines the values available to choose from. Optional, defaults to fetching values from the naming convention (e.g. colors or my_colors for data set colors).',
		}),
	value_key: z.string().optional().meta({
		id: 'type._inputs.*.options.value_key',
		description:
			'Defines the key used for mapping between saved values and objects in values. This changes how the input saves selected values to match. Defaults to checking for "id", "uuid", "path", "title", then "name". Has no effect unless values is an array of objects, the key is used instead for objects, and the value itself is used for primitive types.',
	}),
	view: z.enum(['card', 'text', 'gallery', 'gallery-left']).optional().meta({
		id: 'type._inputs.*.options.view',
		description: 'Controls how selected items are rendered.',
	}),
	picker_view: z.enum(['card', 'text', 'gallery', 'gallery-left']).optional().meta({
		id: 'type._inputs.*.options.picker_view',
		description: 'Controls how selectable options are rendered.',
	}),
});

export const SelectInputOptionsSchema = z
	.object({
		...SharedSelectInputOptionsSchema.shape,
		...TextValidationSchema.shape,
		empty_type: EmptyTypeTextSchema.optional(),
	})
	.meta({
		description: 'Options that are specific to Select Inputs.',
	});

export const SelectInputSchema = z
	.object({
		...BaseInputSchema.shape,
		type: z.literal('select').meta(typeMeta),
		options: SelectInputOptionsSchema.optional(),
	})
	.meta({
		id: 'SelectInput',
		title: 'Select Input',
		description:
			'Provides an editing interface for data with multiple predefined options. Select inputs only allow one value.',
	});

export const MultiselectInputOptionsSchema = z
	.object({
		...SharedSelectInputOptionsSchema.shape,
		...ArrayValidationSchema.shape,
		empty_type: EmptyTypeArraySchema.optional(),
	})
	.meta({
		description: 'Options that are specific to Multiselect Inputs.',
	});

export const MultiselectInputSchema = z
	.object({
		...BaseInputSchema.shape,
		type: z.literal('multiselect').meta(typeMeta),
		options: MultiselectInputOptionsSchema.optional(),
	})
	.meta({
		id: 'MultiselectInput',
		title: 'Multiselect Input',
		description:
			'Provides an editing interface for data with multiple predefined options. Multiselect inputs allow several values.',
	});

export const SharedChoiceInputOptionsSchema = SharedSelectInputOptionsSchema.omit({
	allow_create: true,
});

export const ChoiceInputOptionsSchema = z
	.object({
		...SharedChoiceInputOptionsSchema.shape,
		...TextValidationSchema.shape,
		empty_type: EmptyTypeTextSchema.optional(),
	})
	.meta({
		description: 'Options that are specific to Choice Inputs.',
	});

export const ChoiceInputSchema = z
	.object({
		...BaseInputSchema.shape,
		type: z.literal('choice').meta(typeMeta),
		options: ChoiceInputOptionsSchema.optional(),
	})
	.meta({
		id: 'ChoiceInput',
		title: 'Choice Input',
		description:
			'Provides an editing interface for data with multiple predefined options. Choice inputs only allow one value.',
	});

export const MultichoiceInputOptionsSchema = z
	.object({
		...SharedChoiceInputOptionsSchema.shape,
		...ArrayValidationSchema.shape,
		empty_type: EmptyTypeArraySchema.optional(),
	})
	.meta({
		description: 'Options that are specific to Multichoice Inputs.',
	});

export const MultichoiceInputSchema = z
	.object({
		...BaseInputSchema.shape,
		type: z.literal('multichoice').meta(typeMeta),
		options: MultichoiceInputOptionsSchema.optional(),
	})
	.meta({
		id: 'MultichoiceInput',
		title: 'Multichoice Input',
		description:
			'Provides an editing interface for data with multiple predefined options. Multichoice inputs allow several values.',
	});

export const ObjectInputGroupSchema = z.object({
	heading: z.string().optional().meta({
		description: 'The main text for the group shown when collapsed or expanded.',
	}),
	comment: z.string().optional().meta({
		description:
			'Changes the subtext below the `heading`. Has no default. Supports a limited set of Markdown: links, bold, italic, subscript, superscript, and inline code elements are allowed.',
	}),
	collapsed: z.boolean().default(false).optional().meta({
		description: 'Controls if this group is collapsed or expanded when first viewed.',
	}),
	inputs: z.array(z.string()).optional().meta({
		description: 'The keys of each input in this group.',
	}),
	documentation: DocumentationSchema.optional().meta({
		description:
			'Provides a custom link for documentation for editors shown above the collection file list.',
	}),
});

export const ObjectInputOptionsSchema = z
	.object({
		...RequiredValidationSchema.shape,
		empty_type: EmptyTypeObjectSchema.optional(),
		preview: PreviewSchema.optional(),
		subtype: z.enum(['object', 'mutable', 'tabbed']).optional().meta({
			description: 'Changes the appearance and behavior of the input.',
		}),
		entries: z
			.object({
				allowed_keys: z.array(z.string()).optional().meta({
					description:
						'Defines a limited set of keys that can exist on the data within an object input. This set is used when entries are added and renamed with `allow_create` enabled. Has no effect if `allow_create` is not enabled.',
				}),
				assigned_structures: z.record(z.string(), z.array(z.string())).optional().meta({
					description:
						'Provides data formats when adding entries to the data within this object input. When adding an entry, team members are prompted to choose from a number of values you have defined. Has no effect if `allow_create` is false. `entries.structures` applies to the entries within the object.',
				}),
				get structures() {
					return z.union([StructureReferenceSchema, StructureSchema]).optional().meta({
						description:
							'Provides data formats for value of this object. When choosing an item, team members are prompted to choose from a number of values you have defined. `structures` applies to the object itself.',
					});
				},
				comment: z.string().optional().meta({
					id: 'entries_comment',
					description:
						'Used to supply help text above the key input when adding/renaming within a mutable object input. Has no default. Supports a limited set of Markdown: links, bold, italic, subscript, superscript and inline code elements are allowed.',
				}),
				documentation: DocumentationSchema.optional().meta({
					description:
						'Provides a custom link for documentation for editors shown above the key input when adding/renaming within a mutable object input.',
				}),
			})
			.optional()
			.meta({
				description: 'Contains options for the "mutable" subtype.',
			}),
		get structures() {
			return z.union([StructureReferenceSchema, StructureSchema]).optional().meta({
				description:
					'Provides data formats for value of this object. When choosing an item, team members are prompted to choose from a number of values you have defined. `structures` applies to the object itself.',
			});
		},
		groups: z.array(ObjectInputGroupSchema).optional().meta({
			description:
				'Allows you to group the inputs inside this object together without changing the data structure.',
		}),
		place_groups_below: z.boolean().default(false).optional().meta({
			description: 'Controls which order input groups and ungrouped inputs appear in.',
		}),
		allow_label_formatting: z.boolean().default(false).optional().meta({
			description: 'Controls whether or not labels on mutable object entries are formatted.',
		}),
		view: z.enum(['card', 'gallery', 'gallery-left']).optional().meta({
			description: 'Controls how object previews are rendered.',
		}),
	})
	.meta({
		description: 'Options that are specific to Object Inputs.',
	});

export const ObjectInputSchema = z
	.object({
		...BaseInputSchema.shape,
		type: z.literal('object').meta(typeMeta),
		options: ObjectInputOptionsSchema.optional(),
	})
	.meta({
		id: 'ObjectInput',
		title: 'Object Input',
		description: 'Provides a user interface for a group of inputs.',
	});

export const ArrayInputOptionsSchema = z
	.object({
		...RequiredValidationSchema.shape,
		...ArrayValidationSchema.shape,
		...ArrayControlOptionsSchema.shape,
		empty_type: EmptyTypeArraySchema.optional(),
		get structures() {
			return z.union([StructureReferenceSchema, StructureSchema]).optional().meta({
				description:
					'Provides data formats for value of this object. When choosing an item, team members are prompted to choose from a number of values you have defined.',
			});
		},
	})
	.meta({
		description: 'Options that are specific to Array Inputs.',
	});

export const ArrayInputSchema = z
	.object({
		...BaseInputSchema.shape,
		type: z.literal('array').meta(typeMeta),
		options: ArrayInputOptionsSchema.optional(),
	})
	.meta({
		id: 'ArrayInput',
		title: 'Array Input',
		description: 'Provides a user interface for lists of inputs or input groups.',
	});

export const AutoInputSchema = z
	.object({
		...BaseInputSchema.shape,
		type: z.literal('auto').meta(typeMeta),
		options: z.unknown().optional().meta({
			description: 'Options that are specific to this `type` of input.',
		}),
	})
	.meta({
		id: 'AutoInput',
		title: 'Automatic Input',
		description: 'Provides a default user interface based on the data contained.',
		excludeFromDocumentation: true,
	});

export const UnknownInputSchema = z
	.object({
		...BaseInputSchema.shape,
		options: z.unknown().optional().meta({
			description: 'Options that are specific to this `type` of input.',
		}),
	})
	.meta({
		id: 'UnknownInput',
		title: 'Unknown Input',
		description: 'Provides a default user interface based on the data contained.',
		excludeFromDocumentation: true,
	});

export const KnownInputSchema = z
	.discriminatedUnion('type', [
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
	])
	.meta({
		title: 'Known Input',
		description:
			'A union of all input types that are known to the CloudCannon configuration schema.',
	});

export const InputSchema = z.union([KnownInputSchema, UnknownInputSchema]).meta({
	id: 'Input',
	title: 'Input',
});

export const InputsSchema = z.record(z.string(), InputSchema).meta({
	id: 'type._inputs',
	title: 'Inputs',
	description:
		'Controls the behavior and appearance of your inputs in all data editing interfaces.',
});

export const InputsFromGlobSchema = z.array(z.string()).meta({
	id: 'type._inputs_from_glob',
});

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
export type Inputs = z.infer<typeof InputsSchema>;
export type InputType = z.infer<typeof InputTypeSchema>;
