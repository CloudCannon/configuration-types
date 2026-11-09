import * as z from 'zod';
import { DocumentationSchema } from './documentation.js';
import { BlockEditableSchema } from './editables.js';
import { ImageOptionsSchema } from './image-options.js';
import {
	BaseInputSchema,
	BooleanInputSchema,
	DisabledInputSchema,
	EmptyTypeTextSchema,
	FileInputOptionsSchema,
	RequiredValidationSchema,
	SelectInputSchema,
	SharedSelectInputOptionsSchema,
	TextInputSchema,
	TextValidationSchema,
	typeMeta,
	UrlInputSchema,
} from './input-base.js';
import type { MimeTypeSchema } from './mimetype.js';
import { PreviewSchema } from './preview.js';
import { SourceEditorSchema } from './source-editor.js';
import { StructureReferenceSchema, StructureSchema } from './structures.js';
import { SyntaxSchema } from './syntax.js';
import { TimezoneSchema } from './timezone.js';

const INPUT_TYPES = [
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
] as const;
export const InputTypeSchema = z.enum(INPUT_TYPES).meta({
	title: 'Input Type',
	description: 'The available input types.',
});

const ArrayValidationSchema = z.object({
	max_items: z.number().nullable().optional().meta({
		id: 'type._inputs.*.options.max_items',
		description:
			'This key defines the maximum number of items CloudCannon will allow in an Input. When configured, CloudCannon will prevent you from adding more items to this Input. If the Input already contains more items, CloudCannon will require you to remove items until the Input contains a valid number to save your changes, or discard your unsaved changes.',
	}),
	max_items_message: z.string().nullable().optional().meta({
		id: 'type._inputs.*.options.max_items_message',
		description:
			'This key defines the message that explains why an Input needs to have a maximum number of items. This key requires you to define `options.max_items`.',
	}),
	min_items: z.number().nullable().optional().meta({
		id: 'type._inputs.*.options.min_items',
		description:
			'This key defines the minimum number of items CloudCannon will allow in an Input. When configured, CloudCannon will prevent you from removing items from this Input below this value. If the Input already contains fewer items, CloudCannon will require you to add items until the Input contains a valid number to save your changes, or discard your unsaved changes.',
	}),
	min_items_message: z.string().nullable().optional().meta({
		id: 'type._inputs.*.options.min_items_message',
		description:
			'This key defines the message that explains why an Input needs to have a minimum number of items. This key requires you to define `options.min_items`.',
	}),
	unique_on: z.string().nullable().optional().meta({
		id: 'type._inputs.*.options.unique_on',
		description:
			'This key defines the JSON Path selector that CloudCannon should use to determine if the value of an Input is unique. When configured, CloudCannon will require the value of the Input to be unique compared to the value defined on the JSON Path. If the Input already contains a non-unique value, CloudCannon will require you to change it to a valid value to save your changes, or discard your unsaved changes.',
	}),
	unique_on_message: z.string().nullable().optional().meta({
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

const _TextareaInputOptionsSchema = z
	.object({
		...TextValidationSchema.shape,
		...RequiredValidationSchema.shape,
		empty_type: EmptyTypeTextSchema.nullable().optional(),
		placeholder: z.string().nullable().optional().meta({
			description: 'Text shown when this input has no value.',
		}),
		show_count: z.boolean().default(false).optional().meta({
			description: 'Shows a character counter below the input if enabled.',
		}),
	})
	.meta({
		description: 'Options that are specific to Textarea Inputs.',
	});
export interface TextareaInputOptions extends z.infer<typeof _TextareaInputOptionsSchema> {}
export const TextareaInputOptionsSchema: z.ZodType<TextareaInputOptions> =
	_TextareaInputOptionsSchema;

const _TextareaInputSchema = z
	.object({
		...BaseInputSchema.shape,
		type: z.literal('textarea').meta(typeMeta),
		options: TextareaInputOptionsSchema.nullable().optional(),
	})
	.meta({
		id: 'TextareaInput',
		title: 'Textarea Input',
		description: 'Provides an editing interface for plain text.',
	});
export interface TextareaInput extends z.infer<typeof _TextareaInputSchema> {}
export const TextareaInputSchema: z.ZodType<TextareaInput> = _TextareaInputSchema;

const _CodeInputOptionsSchema = z
	.object({
		...SourceEditorSchema.shape,
		...TextValidationSchema.shape,
		...RequiredValidationSchema.shape,
		empty_type: EmptyTypeTextSchema.nullable().optional(),
		max_visible_lines: z.number().nullable().optional().meta({
			description:
				'Sets the maximum number of visible lines for this input, effectively controlling maximum height. When the containing text exceeds this number, the input becomes a scroll area.',
		}),
		min_visible_lines: z.number().nullable().optional().meta({
			description:
				'Sets the minimum number of visible lines for this input, effectively controlling initial height. When the containing text exceeds this number, the input grows line by line to the lines defined by `max_visible_lines`.',
		}),
		syntax: SyntaxSchema.nullable().optional().meta({
			description:
				'Changes how the editor parses your content for syntax highlighting. Should be set to the language of the code going into the input.',
		}),
	})
	.meta({
		description: 'Options that are specific to Code Inputs.',
	});
export interface CodeInputOptions extends z.infer<typeof _CodeInputOptionsSchema> {}
export const CodeInputOptionsSchema: z.ZodType<CodeInputOptions> = _CodeInputOptionsSchema;

const _CodeInputSchema = z
	.object({
		...BaseInputSchema.shape,
		type: z.literal('code').meta(typeMeta),
		options: CodeInputOptionsSchema.nullable().optional(),
	})
	.meta({
		id: 'CodeInput',
		title: 'Code Input',
		description: 'Provides an editing interface for code or mono-spaced plain text content.',
	});
export interface CodeInput extends z.infer<typeof _CodeInputSchema> {}
export const CodeInputSchema: z.ZodType<CodeInput> = _CodeInputSchema;

const _ColorInputOptionsSchema = z
	.object({
		...TextValidationSchema.shape,
		...RequiredValidationSchema.shape,
		empty_type: EmptyTypeTextSchema.nullable().optional(),
		format: z.enum(['rgb', 'hex', 'hsl', 'hsv']).nullable().optional().meta({
			description:
				'Sets what format the color value is saved as. Defaults to the naming convention, or HEX if that is unset.',
		}),
		alpha: z.boolean().nullable().optional().meta({
			description:
				'Toggles showing a control for adjusting the transparency of the selected color. Defaults to using the naming convention, enabled if the input key ends with "a".',
		}),
		palette: z.array(z.string()).nullable().optional(),
		hide_picker: z.boolean().default(false).optional(),
	})
	.meta({
		description: 'Options that are specific to Color Inputs.',
	});
export interface ColorInputOptions extends z.infer<typeof _ColorInputOptionsSchema> {}
export const ColorInputOptionsSchema: z.ZodType<ColorInputOptions> = _ColorInputOptionsSchema;

const _ColorInputSchema = z
	.object({
		...BaseInputSchema.shape,
		type: z.literal('color').meta(typeMeta),
		options: ColorInputOptionsSchema.nullable().optional(),
	})
	.meta({
		id: 'ColorInput',
		title: 'Color Input',
		description: 'Provides an editing interface for color values.',
	});
export interface ColorInput extends z.infer<typeof _ColorInputSchema> {}
export const ColorInputSchema: z.ZodType<ColorInput> = _ColorInputSchema;

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

const _NumberInputOptionsSchema = z
	.object({
		...RequiredValidationSchema.shape,
		empty_type: EmptyTypeNumberSchema.nullable().optional(),
		min: MinSchema.nullable().optional(),
		max: MaxSchema.nullable().optional(),
		step: z.number().nullable().optional().meta({
			id: 'type._inputs.*.options.step',
			description:
				'A number that specifies the granularity that the value must adhere to, or the special value any, which allows any decimal value between `max` and `min`.',
		}),
		min_message: z.string().nullable().optional().meta({
			id: 'type._inputs.*.options.min_message',
			description:
				'This key defines the message that explains why an Input needs to have a minimum numerical value. This key requires you to define `options.min`.',
		}),
		max_message: z.string().nullable().optional().meta({
			id: 'type._inputs.*.options.max_message',
			description:
				'This key defines the message that explains why an Input needs to have a maximum numerical value. This key requires you to define `options.max`.',
		}),
	})
	.meta({
		description: 'Options that are specific to Number Inputs.',
	});
export interface NumberInputOptions extends z.infer<typeof _NumberInputOptionsSchema> {}
export const NumberInputOptionsSchema: z.ZodType<NumberInputOptions> = _NumberInputOptionsSchema;

const _NumberInputSchema = z
	.object({
		...BaseInputSchema.shape,
		type: z.literal('number').meta(typeMeta),
		options: NumberInputOptionsSchema.nullable().optional(),
	})
	.meta({
		id: 'NumberInput',
		title: 'Number Input',
		description: 'Provides an editing interface for numeric values.',
	});
export interface NumberInput extends z.infer<typeof _NumberInputSchema> {}
export const NumberInputSchema: z.ZodType<NumberInput> = _NumberInputSchema;

const _RangeInputOptionsSchema = z
	.object({
		..._NumberInputOptionsSchema.shape,
		min: MinSchema,
		max: MaxSchema,
	})
	.meta({
		description: 'Options that are specific to Range Inputs.',
	});
export interface RangeInputOptions extends z.infer<typeof _RangeInputOptionsSchema> {}
export const RangeInputOptionsSchema: z.ZodType<RangeInputOptions> = _RangeInputOptionsSchema;

const _RangeInputSchema = z
	.object({
		...BaseInputSchema.shape,
		type: z.literal('range').meta(typeMeta),
		options: RangeInputOptionsSchema.nullable().optional(),
	})
	.meta({
		id: 'RangeInput',
		title: 'Range Input',
		description: 'Provides a slider interface for selecting a numeric value.',
	});
export interface RangeInput extends z.infer<typeof _RangeInputSchema> {}
export const RangeInputSchema: z.ZodType<RangeInput> = _RangeInputSchema;

const _RichTextInputOptionsSchema = z
	.object({
		...ImageOptionsSchema.shape,
		...BlockEditableSchema.shape,
		...TextValidationSchema.shape,
		...RequiredValidationSchema.shape,
		empty_type: EmptyTypeTextSchema.nullable().optional(),
		allow_resize: z.boolean().nullable().optional().meta({ deprecated: true }),
		prevent_resize: z.boolean().default(false).optional().meta({
			description: 'Hides the resize handler to vertically resize the input.',
		}),
		initial_height: z.number().nullable().optional().meta({
			description: 'Defines the initial height of this input in pixels (px).',
		}),
	})
	.meta({
		description: 'Options that are specific to Rich Text Inputs.',
	});
export interface RichTextInputOptions extends z.infer<typeof _RichTextInputOptionsSchema> {}
export const RichTextInputOptionsSchema: z.ZodType<RichTextInputOptions> =
	_RichTextInputOptionsSchema;

const _RichTextInputSchema = z
	.object({
		...BaseInputSchema.shape,
		type: z.enum(['html', 'markdown']).meta(typeMeta),
		options: RichTextInputOptionsSchema.nullable().optional(),
	})
	.meta({
		id: 'RichTextInput',
		title: 'Rich Text Input',
		description: 'Provides an editing interface for HTML markup content.',
	});
export interface RichTextInput extends z.infer<typeof _RichTextInputSchema> {}
export const RichTextInputSchema: z.ZodType<RichTextInput> = _RichTextInputSchema;

const _DateInputOptionsSchema = z
	.object({
		...RequiredValidationSchema.shape,
		empty_type: EmptyTypeTextSchema.nullable().optional(),
		timezone: TimezoneSchema.nullable().optional().meta({
			description:
				'Specifies the time zone that dates are displayed and edited in. Also changes the suffix the date is persisted to the file with. Defaults to the global `timezone`.',
		}),
		start_from: z
			.union([
				z.iso.datetime({ offset: true, local: true }).meta({ title: 'ISO8601 String' }),
				z.coerce.string().meta({ isJsonSchemaAny: true, documentationType: 'date', title: 'Date' }),
			])
			.nullable()
			.optional()
			.meta({
				description:
					'This key defines the earliest date and time, inclusive, that CloudCannon will allow in an Input. When configured, CloudCannon will prevent you from selecting an earlier date and time. If the Input already contains an earlier date and time, CloudCannon will require you to change it to a valid value to save your changes, or discard your unsaved changes. Value must be in ISO8601 format. If `options.end_before` is also configured, this key cannot be a later date and time.',
			}),
		start_from_message: z.string().nullable().optional().meta({
			description:
				'This key defines the message that explains why an Input needs to have a start date. This key requires you to define `options.start_from`.',
		}),
		end_before: z
			.union([
				z.iso.datetime({ offset: true, local: true }).meta({ title: 'ISO8601 String' }),
				z.coerce.string().meta({ isJsonSchemaAny: true, documentationType: 'date', title: 'Date' }),
			])
			.nullable()
			.optional()
			.meta({
				description:
					'This key defines the date and time, exclusive, that CloudCannon will allow in an Input. When configured, CloudCannon will prevent you from selecting a later date and time. If the Input already contains a later date and time, CloudCannon will require you to change it to a valid value to save your changes, or discard your unsaved changes. Value must be in ISO8601 format. If options.start_from is also configured, this key cannot be an earlier date and time. This key has no default.',
			}),
		end_before_message: z.string().nullable().optional().meta({
			description:
				'This key defines the message that explains why an Input needs to have an end date. This key requires you to define `options.end_before`. This key has no default.',
		}),
	})
	.meta({
		description: 'Options that are specific to Date Inputs.',
	});
export interface DateInputOptions extends z.infer<typeof _DateInputOptionsSchema> {}
export const DateInputOptionsSchema: z.ZodType<DateInputOptions> = _DateInputOptionsSchema;

const _DateInputSchema = z
	.object({
		...BaseInputSchema.shape,
		type: z.enum(['date', 'datetime']).meta(typeMeta),
		options: DateInputOptionsSchema.nullable().optional(),
	})
	.meta({
		id: 'DateInput',
		title: 'Date Input',
		description: 'Provides an editing interface for date and/or time values.',
	});
export interface DateInput extends z.infer<typeof _DateInputSchema> {}
export const DateInputSchema: z.ZodType<DateInput> = _DateInputSchema;

const _TimeInputOptionsSchema = z
	.object({
		...RequiredValidationSchema.shape,
		empty_type: EmptyTypeTextSchema.nullable().optional(),
	})
	.meta({
		description: 'Options that are specific to Time Inputs.',
	});
export const TimeInputOptionsSchema: z.ZodType<z.infer<typeof _TimeInputOptionsSchema>> =
	_TimeInputOptionsSchema;

const _TimeInputSchema = z
	.object({
		...BaseInputSchema.shape,
		type: z.literal('time').meta(typeMeta),
		options: TimeInputOptionsSchema.nullable().optional(),
	})
	.meta({
		id: 'TimeInput',
		title: 'Time Input',
		description: 'Provides an editing interface for time values only.',
	});
export interface TimeInput extends z.infer<typeof _TimeInputSchema> {}
export const TimeInputSchema: z.ZodType<TimeInput> = _TimeInputSchema;

const _FileInputSchema = z
	.object({
		...BaseInputSchema.shape,
		type: z.enum(['file', 'document', 'image']).meta(typeMeta),
		options: FileInputOptionsSchema.nullable().optional(),
	})
	.meta({
		id: 'FileInput',
		title: 'File Input',
		description:
			'Provides an editing interface for uploading files to your repository or DAM and browsing existing assets.',
	});
export interface FileInput extends z.infer<typeof _FileInputSchema> {}
export const FileInputSchema: z.ZodType<FileInput> = _FileInputSchema;

const _MultiselectInputOptionsSchema = z
	.object({
		...SharedSelectInputOptionsSchema.shape,
		...ArrayValidationSchema.shape,
		empty_type: EmptyTypeArraySchema.nullable().optional(),
	})
	.meta({
		description: 'Options that are specific to Multiselect Inputs.',
	});
export interface MultiselectInputOptions extends z.infer<typeof _MultiselectInputOptionsSchema> {}
export const MultiselectInputOptionsSchema: z.ZodType<MultiselectInputOptions> =
	_MultiselectInputOptionsSchema;

const _MultiselectInputSchema = z
	.object({
		...BaseInputSchema.shape,
		type: z.literal('multiselect').meta(typeMeta),
		options: MultiselectInputOptionsSchema.nullable().optional(),
	})
	.meta({
		id: 'MultiselectInput',
		title: 'Multiselect Input',
		description:
			'Provides an editing interface for data with multiple predefined options. Multiselect inputs allow several values.',
	});
export interface MultiselectInput extends z.infer<typeof _MultiselectInputSchema> {}
export const MultiselectInputSchema: z.ZodType<MultiselectInput> = _MultiselectInputSchema;

const _SharedChoiceInputOptionsSchema = SharedSelectInputOptionsSchema.omit({
	allow_create: true,
});
export interface SharedChoiceInputOptions extends z.infer<typeof _SharedChoiceInputOptionsSchema> {}
export const SharedChoiceInputOptionsSchema: z.ZodType<SharedChoiceInputOptions> =
	_SharedChoiceInputOptionsSchema;

const _ChoiceInputOptionsSchema = z
	.object({
		..._SharedChoiceInputOptionsSchema.shape,
		...TextValidationSchema.shape,
		empty_type: EmptyTypeTextSchema.nullable().optional(),
	})
	.meta({
		description: 'Options that are specific to Choice Inputs.',
	});
export interface ChoiceInputOptions extends z.infer<typeof _ChoiceInputOptionsSchema> {}
export const ChoiceInputOptionsSchema: z.ZodType<ChoiceInputOptions> = _ChoiceInputOptionsSchema;

const _ChoiceInputSchema = z
	.object({
		...BaseInputSchema.shape,
		type: z.literal('choice').meta(typeMeta),
		options: ChoiceInputOptionsSchema.nullable().optional(),
	})
	.meta({
		id: 'ChoiceInput',
		title: 'Choice Input',
		description:
			'Provides an editing interface for data with multiple predefined options. Choice inputs only allow one value.',
	});
export interface ChoiceInput extends z.infer<typeof _ChoiceInputSchema> {}
export const ChoiceInputSchema: z.ZodType<ChoiceInput> = _ChoiceInputSchema;

const _MultichoiceInputOptionsSchema = z
	.object({
		..._SharedChoiceInputOptionsSchema.shape,
		...ArrayValidationSchema.shape,
		empty_type: EmptyTypeArraySchema.nullable().optional(),
	})
	.meta({
		description: 'Options that are specific to Multichoice Inputs.',
	});
export interface MultichoiceInputOptions extends z.infer<typeof _MultichoiceInputOptionsSchema> {}
export const MultichoiceInputOptionsSchema: z.ZodType<MultichoiceInputOptions> =
	_MultichoiceInputOptionsSchema;

const _MultichoiceInputSchema = z
	.object({
		...BaseInputSchema.shape,
		type: z.literal('multichoice').meta(typeMeta),
		options: MultichoiceInputOptionsSchema.nullable().optional(),
	})
	.meta({
		id: 'MultichoiceInput',
		title: 'Multichoice Input',
		description:
			'Provides an editing interface for data with multiple predefined options. Multichoice inputs allow several values.',
	});
export interface MultichoiceInput extends z.infer<typeof _MultichoiceInputSchema> {}
export const MultichoiceInputSchema: z.ZodType<MultichoiceInput> = _MultichoiceInputSchema;

const _ObjectInputGroupSchema = z.object({
	heading: z.string().nullable().optional().meta({
		description: 'The main text for the group shown when collapsed or expanded.',
	}),
	comment: z.string().nullable().optional().meta({
		description:
			'Changes the subtext below the `heading`. Has no default. Supports a limited set of Markdown: links, bold, italic, subscript, superscript, and inline code elements are allowed.',
	}),
	collapsed: z.boolean().default(false).optional().meta({
		description: 'Controls if this group is collapsed or expanded when first viewed.',
	}),
	inputs: z.array(z.string()).nullable().optional().meta({
		description: 'The keys of each input in this group.',
	}),
	documentation: DocumentationSchema.nullable().optional().meta({
		description:
			'Provides a custom link for documentation for editors shown above the collection file list.',
	}),
});
export interface ObjectInputGroup extends z.infer<typeof _ObjectInputGroupSchema> {}
export const ObjectInputGroupSchema: z.ZodType<ObjectInputGroup> = _ObjectInputGroupSchema;

const _ObjectInputOptionsSchema = z
	.object({
		...RequiredValidationSchema.shape,
		empty_type: EmptyTypeObjectSchema.nullable().optional(),
		preview: PreviewSchema.nullable().optional(),
		subtype: z.enum(['object', 'mutable', 'tabbed']).nullable().default('object').optional().meta({
			description: 'Changes the appearance and behavior of the input.',
		}),
		entries: z
			.object({
				allowed_keys: z.array(z.string()).nullable().optional().meta({
					description:
						'Defines a limited set of keys that can exist on the data within an object input. This set is used when entries are added and renamed with `allow_create` enabled. Has no effect if `allow_create` is not enabled.',
				}),
				assigned_structures: z.record(z.string(), z.array(z.string())).nullable().optional().meta({
					description:
						'Provides data formats when adding entries to the data within this object input. When adding an entry, team members are prompted to choose from a number of values you have defined. Has no effect if `allow_create` is false. `entries.structures` applies to the entries within the object.',
				}),
				get structures() {
					return z.union([StructureReferenceSchema, StructureSchema]).nullable().optional().meta({
						description:
							'Provides data formats for value of this object. When choosing an item, team members are prompted to choose from a number of values you have defined. `structures` applies to the object itself.',
					});
				},
				comment: z.string().nullable().optional().meta({
					id: 'entries_comment',
					description:
						'Used to supply help text above the key input when adding/renaming within a mutable object input. Has no default. Supports a limited set of Markdown: links, bold, italic, subscript, superscript and inline code elements are allowed.',
				}),
				documentation: DocumentationSchema.nullable().optional().meta({
					description:
						'Provides a custom link for documentation for editors shown above the key input when adding/renaming within a mutable object input.',
				}),
			})
			.nullable()
			.optional()
			.meta({
				description: 'Contains options for the "mutable" subtype.',
			}),
		get structures() {
			return z.union([StructureReferenceSchema, StructureSchema]).nullable().optional().meta({
				description:
					'Provides data formats for value of this object. When choosing an item, team members are prompted to choose from a number of values you have defined. `structures` applies to the object itself.',
			});
		},
		groups: z.array(ObjectInputGroupSchema).nullable().optional().meta({
			description:
				'Allows you to group the inputs inside this object together without changing the data structure.',
		}),
		place_groups_below: z.boolean().default(false).optional().meta({
			description: 'Controls which order input groups and ungrouped inputs appear in.',
		}),
		allow_label_formatting: z.boolean().default(false).optional().meta({
			description: 'Controls whether or not labels on mutable object entries are formatted.',
		}),
		view: z.enum(['card', 'gallery', 'gallery-left']).nullable().optional().meta({
			description: 'Controls how object previews are rendered.',
		}),
	})
	.meta({
		description: 'Options that are specific to Object Inputs.',
	});
export interface ObjectInputOptions extends z.infer<typeof _ObjectInputOptionsSchema> {}
export const ObjectInputOptionsSchema: z.ZodType<ObjectInputOptions> = _ObjectInputOptionsSchema;

const _ObjectInputSchema = z
	.object({
		...BaseInputSchema.shape,
		type: z.literal('object').meta(typeMeta),
		options: ObjectInputOptionsSchema.nullable().optional(),
	})
	.meta({
		id: 'ObjectInput',
		title: 'Object Input',
		description: 'Provides a user interface for a group of inputs.',
	});
export interface ObjectInput extends z.infer<typeof _ObjectInputSchema> {}
export const ObjectInputSchema: z.ZodType<ObjectInput> = _ObjectInputSchema;

const _ArrayInputOptionsSchema = z
	.object({
		...RequiredValidationSchema.shape,
		...ArrayValidationSchema.shape,
		...ArrayControlOptionsSchema.shape,
		empty_type: EmptyTypeArraySchema.nullable().optional(),
		get structures() {
			return z.union([StructureReferenceSchema, StructureSchema]).nullable().optional().meta({
				description:
					'Provides data formats for value of this object. When choosing an item, team members are prompted to choose from a number of values you have defined.',
			});
		},
	})
	.meta({
		description: 'Options that are specific to Array Inputs.',
	});
export interface ArrayInputOptions extends z.infer<typeof _ArrayInputOptionsSchema> {}
export const ArrayInputOptionsSchema: z.ZodType<ArrayInputOptions> = _ArrayInputOptionsSchema;

const _ArrayInputSchema = z
	.object({
		...BaseInputSchema.shape,
		type: z.literal('array').meta(typeMeta),
		options: ArrayInputOptionsSchema.nullable().optional(),
	})
	.meta({
		id: 'ArrayInput',
		title: 'Array Input',
		description: 'Provides a user interface for lists of inputs or input groups.',
	});
export interface ArrayInput extends z.infer<typeof _ArrayInputSchema> {}
export const ArrayInputSchema: z.ZodType<ArrayInput> = _ArrayInputSchema;

const _AutoInputSchema = z
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
export interface AutoInput extends z.infer<typeof _AutoInputSchema> {}
export const AutoInputSchema: z.ZodType<AutoInput> = _AutoInputSchema;

const _UnknownInputSchema = z
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
export interface UnknownInput extends z.infer<typeof _UnknownInputSchema> {}
export const UnknownInputSchema: z.ZodType<UnknownInput> = _UnknownInputSchema;

const _KnownInputSchema = z
	.union([
		TextInputSchema,
		DisabledInputSchema,
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
export type KnownInput = z.infer<typeof _KnownInputSchema>;
export const KnownInputSchema: z.ZodType<KnownInput> = _KnownInputSchema;

const _InputSchema = z.union([KnownInputSchema, UnknownInputSchema]).meta({
	id: 'Input',
	title: 'Input',
});
export type Input = z.infer<typeof _InputSchema>;
export const InputSchema: z.ZodType<Input> = _InputSchema;

const _InputsSchema = z.record(z.string(), InputSchema).meta({
	id: 'type._inputs',
	title: 'Inputs',
	description:
		'Controls the behavior and appearance of your inputs in all data editing interfaces.',
});
export interface Inputs extends z.infer<typeof _InputsSchema> {}
export const InputsSchema: z.ZodType<Inputs> = _InputsSchema;

const _InputsFromGlobSchema = z.array(z.string()).meta({
	id: 'type._inputs_from_glob',
});
export const InputsFromGlobSchema: z.ZodType<z.infer<typeof _InputsFromGlobSchema>> =
	_InputsFromGlobSchema;

export type Syntax = z.infer<typeof SyntaxSchema>;
export type MimeType = z.infer<typeof MimeTypeSchema>;
export type SharedSelectInputOptions = z.infer<typeof SharedSelectInputOptionsSchema>;
export type InputType = (typeof INPUT_TYPES)[number];
export {
	type BaseInput,
	BaseInputSchema,
	type BooleanInput,
	BooleanInputSchema,
	type Context,
	ContextSchema,
	type DisabledInput,
	DisabledInputSchema,
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
} from './input-base.js';
