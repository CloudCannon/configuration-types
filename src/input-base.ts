import * as z from 'zod';
import { DocumentationSchema } from './documentation.ts';
import { IconSchema } from './icon.ts';
import { ImageOptionsSchema } from './image-options.ts';
import { MimeTypeSchema } from './mimetype.ts';
import { PathsSchema } from './paths.ts';
import { PickerPreviewSchema, PreviewEntriesSchema, PreviewSchema } from './preview.ts';
import { SelectDataValuesSchema } from './select-values.ts';

export const typeMeta = {
	title: 'Type',
	description: 'Sets an input type, which controls how this input appears and behaves.',
};

export const RequiredValidationSchema = z.object({
	required: z.boolean().default(false).optional().meta({
		id: 'type._inputs.*.options.required',
		description:
			'This key toggles whether CloudCannon requires this Input to have a value. If set to true, CloudCannon will require you to enter a value to save your changes, or discard your unsaved changes.',
	}),
	required_message: z.string().nullable().optional().meta({
		id: 'type._inputs.*.options.required_message',
		description:
			'This key defines the message that explains why an Input is required. This key requires you to define `options.required`.',
	}),
});

export const TextValidationSchema = z.object({
	max_length: z.number().nullable().optional().meta({
		id: 'type._inputs.*.options.max_length',
		description:
			'This key defines the maximum string length, in characters, that CloudCannon will allow in an Input. When configured, CloudCannon will warn you when an Input value is too long. If the Input already contains a longer value, CloudCannon will require you to remove characters until the Input contains a valid string to save your changes, or discard your unsaved changes.',
	}),
	max_length_message: z.string().nullable().optional().meta({
		id: 'type._inputs.*.options.max_length_message',
		description:
			'This key defines the message that explains which maximum string length an Input will accept. This key requires you to define `options.max_length`.',
	}),
	min_length: z.number().nullable().optional().meta({
		id: 'type._inputs.*.options.min_length',
		description:
			'This key defines the minimum string length, in characters, that CloudCannon will allow in an Input. When configured, CloudCannon will warn you when an Input value is too short. If the Input already contains a shorter value, CloudCannon will require you to add characters until the Input contains a valid string to save your changes, or discard your unsaved changes.',
	}),
	min_length_message: z.string().nullable().optional().meta({
		id: 'type._inputs.*.options.min_length_message',
		description:
			'This key defines the message that explains which minimum string length an Input will accept. This key requires you to define `options.min_length`.',
	}),
	max_words: z.number().nullable().optional().meta({
		id: 'type._inputs.*.options.max_words',
		description:
			'This key defines the maximum string length, in words, that CloudCannon will allow in an Input. When configured, CloudCannon will warn you when an Input value is too long. If the Input already contains a longer value, CloudCannon will require you to remove characters until the Input contains a valid string to save your changes, or discard your unsaved changes.',
	}),
	max_words_message: z.string().nullable().optional().meta({
		id: 'type._inputs.*.options.max_words_message',
		description:
			'This key defines the message that explains which maximum string length an Input will accept. This key requires you to define `options.max_words.',
	}),
	min_words: z.number().nullable().optional().meta({
		id: 'type._inputs.*.options.min_words',
		description:
			'This key defines the minimum string length, in words, that CloudCannon will allow in an Input. When configured, CloudCannon will warn you when an Input value is too short. If the Input already contains a shorter value, CloudCannon will require you to add characters until the Input contains a valid string to save your changes, or discard your unsaved changes.',
	}),
	min_words_message: z.string().nullable().optional().meta({
		id: 'type._inputs.*.options.min_words_message',
		description:
			'This key defines the message that explains which minimum string length an Input will accept. This key requires you to define `options.min_words`.',
	}),
	max_graphemes: z.number().nullable().optional().meta({
		id: 'type._inputs.*.options.max_graphemes',
		description:
			'This key defines the maximum string length, in graphemes, that CloudCannon will allow in an Input. When configured, CloudCannon will warn you when an Input value is too long. If the Input already contains a longer value, CloudCannon will require you to remove characters until the Input contains a valid string to save your changes, or discard your unsaved changes.',
	}),
	max_graphemes_message: z.string().nullable().optional().meta({
		id: 'type._inputs.*.options.max_graphemes_message',
		description:
			'This key defines the message that explains which maximum string length an Input will accept. This key requires you to define `options.max_graphemes.',
	}),
	min_graphemes: z.number().nullable().optional().meta({
		id: 'type._inputs.*.options.min_graphemes',
		description:
			'This key defines the minimum string length, in graphemes, that CloudCannon will allow in an Input. When configured, CloudCannon will warn you when an Input value is too short. If the Input already contains a shorter value, CloudCannon will require you to add characters until the Input contains a valid string to save your changes, or discard your unsaved changes.',
	}),
	min_graphemes_message: z.string().nullable().optional().meta({
		id: 'type._inputs.*.options.min_graphemes_message',
		description:
			'This key defines the message that explains which minimum string length an Input will accept. This key requires you to define `options.min_graphemes`.',
	}),
	locale: z.string().nullable().optional().meta({
		id: 'type._inputs.*.options.locale',
		description:
			'This key defines the locale that CloudCannon uses to determine the number of words or graphemes in this Input, if you have `max_words`, `min_words`, `max_graphemes`, or `min_graphemes` configured.',
	}),
	pattern: z.string().nullable().optional().meta({
		id: 'type._inputs.*.options.pattern',
		description:
			'This key defines a regular expression that the Input value must match. When configured, CloudCannon will require you to enter a value that matches the REGEX pattern. If the Input already contains an invalid value, CloudCannon will require you to enter a valid string to save your changes, or discard your unsaved changes.',
	}),
	pattern_message: z.string().nullable().optional().meta({
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
		.nullable()
		.optional()
		.meta({
			id: 'type._inputs.*.options.pattern_flags',
			description:
				'This key defines the flags (e.g. case-insensitive searching) for the regular expression set in `options.pattern`.',
		}),
});

export const EmptyTypeTextSchema = z.enum(['null', 'string']).default('null').meta({
	id: 'type._inputs.*.options.empty_type(text)',
	description: "Set how an 'empty' value will be saved. Does not apply to existing empty values.",
});

export const ContextSchema = z
	.object({
		content: z.string().nullable().optional().meta({
			description: 'The rich text content shown when opened. Supports a limited set of Markdown.',
		}),
		open: z.boolean().default(false).optional().meta({
			description: 'Makes the content visible initially.',
		}),
		title: z.string().nullable().optional().meta({
			description: 'The text shown when not open. Defaults to "Context" if unset.',
		}),
		icon: IconSchema.nullable().optional().meta({
			description: 'The icon shown when not open. Defaults to "auto_stories" if unset.',
		}),
	})
	.meta({
		id: 'type._inputs.*.context',
		description: 'Adds an expandable section of rich text below the input.',
	});

export const BaseInputSchema = z.object({
	comment: z.string().nullable().optional().meta({
		id: 'type._inputs.*.comment',
		description:
			'Changes the subtext below the _Label_. Has no default. Supports a limited set of Markdown: links, bold, italic, subscript, superscript, and inline code elements are allowed.',
	}),
	context: ContextSchema.nullable().optional(),
	documentation: DocumentationSchema.nullable().optional().meta({
		description: 'Provides a custom link for documentation for editors shown above input.',
	}),
	label: z.string().nullable().optional().meta({
		id: 'type._inputs.*.label',
		description: 'Optionally changes the text above this input.',
	}),
	hidden: z
		.union([z.boolean().meta({ title: 'Boolean' }), z.string().meta({ title: 'Query String' })])
		.nullable()
		.default(false)
		.optional()
		.meta({
			id: 'type._inputs.*.hidden',
			description: 'Toggles the visibility of this input.',
		}),
	disabled: z
		.union([z.boolean().meta({ title: 'Boolean' }), z.string().meta({ title: 'Query String' })])
		.nullable()
		.default(false)
		.optional()
		.meta({
			id: 'type._inputs.*.disabled',
			description: 'Toggles if this input can be edited.',
		}),
	instance_value: z.enum(['UUID', 'NOW']).nullable().optional().meta({
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

export const BooleanInputSchema = z
	.object({
		...BaseInputSchema.shape,
		type: z.enum(['checkbox', 'switch']).meta(typeMeta),
	})
	.meta({
		id: 'type._inputs.*.(boolean-input)',
		title: 'Boolean Input',
		description: 'Provides an editing interface for true or false values.',
	});

export const TextInputOptionsSchema = z
	.object({
		...TextValidationSchema.shape,
		...RequiredValidationSchema.shape,
		empty_type: EmptyTypeTextSchema.nullable().optional(),
		placeholder: z.string().nullable().optional().meta({
			description: 'Text shown when this input has no value.',
		}),
		icon: IconSchema.nullable().optional().meta({
			description: 'Icon shown beside the input.',
		}),
		icon_color: PreviewEntriesSchema.nullable().optional(),
		icon_background_color: PreviewEntriesSchema.nullable().optional(),
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
		options: TextInputOptionsSchema.nullable().optional(),
	})
	.meta({
		id: 'type._inputs.*.(text-input)',
		title: 'Text Input',
		description: 'Provides a simple editing interface for plain text.',
	});

export const FileInputOptionsSchema = z
	.object({
		...ImageOptionsSchema.shape,
		...TextValidationSchema.shape,
		...RequiredValidationSchema.shape,
		empty_type: EmptyTypeTextSchema.nullable().optional(),
		paths: PathsSchema.nullable().optional(),
		accepts_mime_types: z
			.union([
				z.string().meta({ title: 'Comma Separated' }),
				z.array(MimeTypeSchema).meta({ title: 'Array' }),
			])
			.nullable()
			.optional()
			.meta({
				id: 'type._inputs.*.options.accepts_mime_types',
				description:
					'Restricts which file types are available to select or upload to this input. Accepted format is an array or comma-separated string of MIME types. The special value "*" means any type is accepted.',
			}),
		max_file_size: z.number().nullable().optional().meta({
			id: 'type._inputs.*.options.max_file_size',
			description:
				'This key defines the maximum file size, in kilobytes, that CloudCannon will allow in an Input. When configured, CloudCannon will prevent you from uploading a file larger than the specified size. If the Input already contains a file larger than the specified size, CloudCannon will require you to change it to a valid value to save your changes, or discard your unsaved changes. Value can be any positive integer.',
		}),
		max_file_size_message: z.string().nullable().optional().meta({
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
		encode_url: z.boolean().default(false).optional().meta({
			id: 'type._inputs.*.options.encode_url',
		}),
	})
	.meta({
		description: 'Options that are specific to File Inputs.',
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
		options: UrlInputOptionsSchema.nullable().optional(),
	})
	.meta({
		id: 'type._inputs.*.(url-input)',
		title: 'URL Input',
		description: 'Provides an editing interface for relative, absolute, and fully qualified URLs.',
	});

export const SharedSelectInputOptionsSchema = z.object({
	...RequiredValidationSchema.shape,
	preview: PreviewSchema.nullable().optional(),
	picker_preview: PickerPreviewSchema.nullable().optional(),
	allow_create: z.boolean().default(false).optional().meta({
		id: 'type._inputs.*.options.allow_create',
		description: 'Allows new text values to be created at edit time.',
	}),
	allow_empty: z.boolean().nullable().optional().meta({
		id: 'type._inputs.*.options.allow_empty',
		deprecated: true,
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
	value_key: z.string().nullable().optional().meta({
		id: 'type._inputs.*.options.value_key',
		description:
			'Defines the key used for mapping between saved values and objects in values. This changes how the input saves selected values to match. Defaults to checking for "id", "uuid", "path", "title", then "name". Has no effect unless values is an array of objects, the key is used instead for objects, and the value itself is used for primitive types.',
	}),
	view: z.enum(['card', 'text', 'gallery', 'gallery-left']).nullable().optional().meta({
		id: 'type._inputs.*.options.view',
		description: 'Controls how selected items are rendered.',
	}),
	picker_view: z.enum(['card', 'text', 'gallery', 'gallery-left']).nullable().optional().meta({
		id: 'type._inputs.*.options.picker_view',
		description: 'Controls how selectable options are rendered.',
	}),
});

export const SelectInputOptionsSchema = z
	.object({
		...SharedSelectInputOptionsSchema.shape,
		...TextValidationSchema.shape,
		empty_type: EmptyTypeTextSchema.nullable().optional(),
	})
	.meta({
		description: 'Options that are specific to Select Inputs.',
	});

export const SelectInputSchema = z
	.object({
		...BaseInputSchema.shape,
		type: z.literal('select').meta(typeMeta),
		options: SelectInputOptionsSchema.nullable().optional(),
	})
	.meta({
		id: 'type._inputs.*.(select-input)',
		title: 'Select Input',
		description:
			'Provides an editing interface for data with multiple predefined options. Select inputs only allow one value.',
	});

export type Context = z.infer<typeof ContextSchema>;
export type BaseInput = z.infer<typeof BaseInputSchema>;
export type BooleanInput = z.infer<typeof BooleanInputSchema>;
export type TextInputOptions = z.infer<typeof TextInputOptionsSchema>;
export type TextInput = z.infer<typeof TextInputSchema>;
export type FileInputOptions = z.infer<typeof FileInputOptionsSchema>;
export type UrlInputOptions = z.infer<typeof UrlInputOptionsSchema>;
export type UrlInput = z.infer<typeof UrlInputSchema>;
export type SelectInputOptions = z.infer<typeof SelectInputOptionsSchema>;
export type SelectInput = z.infer<typeof SelectInputSchema>;
