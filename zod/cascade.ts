import * as z from 'zod/v4';

import { EditablesSchema } from './editables.ts';
import { InputSchema } from './inputs.ts';
import { SelectValuesSchema } from './select-values.ts';
import { StructureSchema } from './structures.ts';

export const EditorKeySchema = z.enum(['visual', 'content', 'data']).meta({
	name: 'EditorKey',
	description: 'The available editors in CloudCannon: visual, content, and data editors.',
});

export const ReducedCascadeSchema = z.object({
	_inputs: z
		.record(z.string(), InputSchema)
		.optional()
		.describe(
			'Controls the behavior and appearance of your inputs in all data editing interfaces.'
		),

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
}).meta({
	name: 'ReducedCascade',
	description: 'Core cascade properties for inputs, select data, and structures that can be inherited by nested configurations.',
});

export const CascadeSchema = z.object({
	...ReducedCascadeSchema.shape,

	_enabled_editors: z
		.array(EditorKeySchema)
		.optional()
		.describe(
			'Set a preferred editor and/or disable the others. The first value sets which editor opens by default, and the following values specify which editors are accessible.'
		),

	_editables: EditablesSchema.optional().describe(
		'Contains input options for Editable Regions and the Content Editor.'
	),
}).meta({
	name: 'Cascade',
	description: 'Configuration options that cascade down to nested items, including editor settings and editable regions.',
});

export type EditorKey = z.infer<typeof EditorKeySchema>;
export type ReducedCascade = z.infer<typeof ReducedCascadeSchema>;
export type Cascade = z.infer<typeof CascadeSchema>;
