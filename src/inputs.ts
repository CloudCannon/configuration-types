import * as z from 'zod';
import { DocumentationSchema } from './documentation.ts';
import { BlockEditableSchema } from './editables.ts';
import { ImageOptionsSchema } from './image-options.ts';
import {
	BaseInputSchema,
	BooleanInputSchema,
	EmptyTypeTextSchema,
	FileInputOptionsSchema,
	RequiredValidationSchema,
	SelectInputSchema,
	SharedSelectInputOptionsSchema,
	TextInputSchema,
	TextValidationSchema,
	typeMeta,
	UrlInputSchema,
} from './input-base.ts';
import type { MimeTypeSchema } from './mimetype.ts';
import { PreviewSchema } from './preview.ts';
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
		allow_resize: z.boolean().optional().meta({ deprecated: true }),
		prevent_resize: z.boolean().default(false).optional().meta({
			description: 'Hides the resize handler to vertically resize the input.',
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
		type: z.enum(['html', 'markdown']).meta(typeMeta),
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
		type: z.enum(['date', 'datetime']).meta(typeMeta),
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

export const FileInputSchema = z
	.object({
		...BaseInputSchema.shape,
		type: z.enum(['file', 'document', 'image']).meta(typeMeta),
		options: FileInputOptionsSchema.optional(),
	})
	.meta({
		id: 'FileInput',
		title: 'File Input',
		description:
			'Provides an editing interface for uploading files to your repository or DAM and browsing existing assets.',
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
		subtype: z.enum(['object', 'mutable', 'tabbed']).default('object').optional().meta({
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
	.union([
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

export type TextareaInputOptions = z.infer<typeof TextareaInputOptionsSchema>;
export type TextareaInput = z.infer<typeof TextareaInputSchema>;
export type Syntax = z.infer<typeof SyntaxSchema>;
export type CodeInputOptions = z.infer<typeof CodeInputOptionsSchema>;
export type CodeInput = z.infer<typeof CodeInputSchema>;
export type ColorInputOptions = z.infer<typeof ColorInputOptionsSchema>;
export type ColorInput = z.infer<typeof ColorInputSchema>;
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
export type FileInput = z.infer<typeof FileInputSchema>;
export type SharedSelectInputOptions = z.infer<typeof SharedSelectInputOptionsSchema>;
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
export {
	type BaseInput,
	BaseInputSchema,
	type BooleanInput,
	BooleanInputSchema,
	type Context,
	ContextSchema,
	type FileInputOptions,
	FileInputOptionsSchema,
	type SelectInput,
	type SelectInputOptions,
	SelectInputOptionsSchema,
	SelectInputSchema,
	SharedSelectInputOptionsSchema,
	type TextInput,
	type TextInputOptions,
	TextInputOptionsSchema,
	TextInputSchema,
	type UrlInput,
	type UrlInputOptions,
	UrlInputOptionsSchema,
	UrlInputSchema,
} from './input-base.ts';
