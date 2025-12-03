import * as z from 'zod';
import { DocumentationSchema } from './documentation.ts';
import { IconSchema } from './icon.ts';
import { InputsSchema, ObjectInputGroupSchema } from './inputs.ts';
import { PreviewSchema } from './preview.ts';
import { SelectDataSchema } from './select-values.ts';

export const StructureReferenceSchema = z.string().meta({
	id: 'type.structure-reference',
	title: 'Structure Reference',
	description: 'A reference to an existing structure.',
});

const StructureBaseSchema = z.object({
	reorder_inputs: z.boolean().default(true).optional().meta({
		description:
			'If true, inputs are sorted to match when editing. Extra inputs are ordered after expected inputs, unless `remove_extra_inputs` is true. Defaults to true.',
	}),
	hide_extra_inputs: z.boolean().default(false).optional().meta({
		description:
			'Hides unexpected inputs when editing. Has no effect if `remove_extra_inputs` is true. Defaults to false.',
	}),
	remove_empty_inputs: z.boolean().default(false).optional().meta({
		description:
			'If checked, empty inputs are removed from the source file on save. Removed inputs will be available for editing again, provided they are in the matching schema/structure. Defaults to false.',
	}),
	remove_extra_inputs: z.boolean().default(true).optional().meta({
		description: 'If checked, extra inputs are removed when editing. Defaults to true.',
	}),
});

export const StructureValueSchema = StructureBaseSchema.extend({
	preview: PreviewSchema.optional(),
	picker_preview: PreviewSchema.optional(),

	// This is the ReducedCascadeSchema - can't seem to reuse it due to Zod's limitations.
	get _inputs() {
		return InputsSchema.optional();
	},
	_inputs_from_glob: z.array(z.string()).optional(),
	_select_data: SelectDataSchema.optional(),
	get _structures() {
		return StructuresSchema.optional();
	},
	_structures_from_glob: z.array(z.string()).optional(),

	id: z.string().optional().meta({
		description:
			"A unique reference value used when referring to this structure value from the Object input's assigned_structures option.",
	}),
	default: z.boolean().default(false).optional().meta({
		description:
			'If set to true, this item will be considered the default type for this structure. If the type of a value within a structure cannot be inferred based on its id_key or matching fields, then it will fall back to this item. If multiple items have default set to true, only the first item will be used.',
	}),
	icon: IconSchema.optional().meta({
		description:
			'An icon used when displaying the structure (defaults to either format_list_bulleted for items in arrays, or notes otherwise).',
	}),
	image: z.string().optional().meta({
		description:
			'Path to an image in your source files used when displaying the structure. Can be either a source (has priority) or output path.',
	}),
	label: z.string().optional().meta({
		description: 'Used as the main text in the interface for this value.',
	}),
	tags: z.array(z.string()).optional().meta({
		description: 'Used to group and filter items when selecting from a modal.',
	}),
	get groups() {
		return z.array(ObjectInputGroupSchema).optional().meta({
			description:
				'Allows you to group the inputs inside this object together without changing the data structure.',
		});
	},
	place_groups_below: z.boolean().default(false).optional().meta({
		description: 'Controls which order input groups and ungrouped inputs appear in.',
	}),
	tabbed: z.boolean().default(false).optional().meta({
		description: 'Show nested objects as tabs. Requires all top-level keys to be objects.',
	}),
	value: z.unknown().meta({
		description: 'The actual value used when items are added after selection.',
	}),
	comment: z.string().optional().meta({
		description:
			'Provides short descriptive text for editors shown in the Data Editor for expanded values matching this Structure value. Has no default. Supports a limited set of Markdown: links, bold, italic, subscript, superscript, and inline code elements are allowed.',
	}),
	documentation: DocumentationSchema.optional().meta({
		description:
			'Provides a custom link for documentation for editors shown in the Data Editor for expanded values matching this Structure value. Has no default.',
	}),
}).meta({
	title: 'Structure Value',
	description:
		'A single value option within a structure, defining the data format and appearance for content editors.',
});

export const StructureSchema = z
	.object({
		...StructureBaseSchema.shape,
		values: z.array(StructureValueSchema).meta({
			description: 'Defines what values are available to add when using this structure.',
		}),
		values_from_glob: z.array(z.string()).optional(),
		id_key: z.string().default('_type').optional().meta({
			description:
				'Defines what key should be used to detect which structure an item is. If this key is not found in the existing structure, a comparison of key names is used. Defaults to "_type".',
		}),
		style: z.enum(['select', 'modal']).default('select').optional().meta({
			description:
				'Defines whether options are shown to your editors in a select menu (select, default) or a modal pop up window (modal) when adding a new item.',
		}),
	})
	.meta({
		id: 'type.structure',
		title: 'Structure',
		description:
			'Provides data formats when adding new items to arrays and objects, with options for how editors choose from available values.',
	});

export const StructuresSchema = z.record(z.string(), StructureSchema).meta({
	id: 'type._structures',
	title: 'Structures',
	description:
		'Structured values for editors adding new items to arrays and objects. Entries here can be referenced in the configuration for `array` or `object` inputs.',
});

export type StructureValue = z.infer<typeof StructureValueSchema>;
export type Structure = z.infer<typeof StructureSchema>;
