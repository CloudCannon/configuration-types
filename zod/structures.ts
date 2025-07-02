import * as z from 'zod/v4';
import { DocumentationSchema } from './documentation.ts';
import { IconSchema } from './icon.ts';
import { BaseInputSchema, InputSchema, ObjectInputGroupSchema } from './inputs.ts';
import { WithPickerPreviewSchema, WithPreviewSchema } from './preview.ts';
import { SelectValuesSchema } from './select-values.ts';

const StructureBaseSchema = z.object({
	reorder_inputs: z
		.boolean()
		.default(true)
		.optional()
		.describe(
			'If true, inputs are sorted to match when editing. Extra inputs are ordered after expected inputs, unless `remove_extra_inputs` is true. Defaults to true.'
		),

	hide_extra_inputs: z
		.boolean()
		.default(false)
		.optional()
		.describe(
			'Hides unexpected inputs when editing. Has no effect if `remove_extra_inputs` is true. Defaults to false.'
		),

	remove_empty_inputs: z
		.boolean()
		.default(false)
		.optional()
		.describe(
			'If checked, empty inputs are removed from the source file on save. Removed inputs will be available for editing again, provided they are in the matching schema/structure. Defaults to false.'
		),

	remove_extra_inputs: z
		.boolean()
		.default(true)
		.optional()
		.describe('If checked, extra inputs are removed when editing. Defaults to true.'),
});

export const StructureValueSchema = StructureBaseSchema.extend(WithPreviewSchema.shape)
	.extend(WithPickerPreviewSchema.shape)
	.extend({
		get _inputs() {
			return z
				.record(z.string(), InputSchema)
				.optional()
				.describe(
					'Controls the behavior and appearance of your inputs in all data editing interfaces.'
				);
		},

		_select_data: z
			.record(z.string(), SelectValuesSchema)
			.optional()
			.describe(
				'Fixed datasets that can be referenced by the _Values_ configuration for _Select_ and _Multiselect_ inputs.'
			),

		get _structures() {
			return z
				.record(z.string(), StructureSchema)
				.optional()
				.describe(
					'Structured values for editors adding new items to arrays and objects. Entries here can be referenced in the configuration for `array` or `object` inputs.'
				);
		},

		id: z
			.string()
			.optional()
			.describe(
				"A unique reference value used when referring to this structure value from the Object input's assigned_structures option."
			),

		default: z
			.boolean()
			.default(false)
			.optional()
			.describe(
				'If set to true, this item will be considered the default type for this structure. If the type of a value within a structure cannot be inferred based on its id_key or matching fields, then it will fall back to this item. If multiple items have default set to true, only the first item will be used.'
			),

		icon: IconSchema.optional().describe(
			'An icon used when displaying the structure (defaults to either format_list_bulleted for items in arrays, or notes otherwise).'
		),

		image: z
			.string()
			.optional()
			.describe(
				'Path to an image in your source files used when displaying the structure. Can be either a source (has priority) or output path.'
			),

		label: z.string().optional().describe('Used as the main text in the interface for this value.'),

		tags: z
			.array(z.string())
			.optional()
			.describe('Used to group and filter items when selecting from a modal.'),

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

		tabbed: z
			.boolean()
			.default(false)
			.optional()
			.describe('Show nested objects as tabs. Requires all top-level keys to be objects.'),

		value: z.unknown().describe('The actual value used when items are added after selection.'),

		comment: z
			.string()
			.optional()
			.describe(
				'Provides short descriptive text for editors shown in the Data Editor for expanded values matching this Structure value. Has no default. Supports a limited set of Markdown: links, bold, italic, subscript, superscript, and inline code elements are allowed.'
			),

		documentation: DocumentationSchema.optional().describe(
			'Provides a custom link for documentation for editors shown in the Data Editor for expanded values matching this Structure value. Has no default.'
		),
	});

export const StructureSchema = z.object({
	...StructureBaseSchema.shape,
	values: z
		.array(StructureValueSchema)
		.describe('Defines what values are available to add when using this structure.'),

	id_key: z
		.string()
		.default('_type')
		.optional()
		.describe(
			'Defines what key should be used to detect which structure an item is. If this key is not found in the existing structure, a comparison of key names is used. Defaults to "_type".'
		),

	style: z
		.enum(['select', 'modal'])
		.default('select')
		.optional()
		.describe(
			'Defines whether options are shown to your editors in a select menu (select, default) or a modal pop up window (modal) when adding a new item.'
		),
});

export type StructureValue = z.infer<typeof StructureValueSchema>;
export type Structure = z.infer<typeof StructureSchema>;
