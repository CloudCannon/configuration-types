import * as z from 'zod';
import { EditablesFromGlobSchema, EditablesSchema } from './editables.ts';
import { InputsFromGlobSchema, InputsSchema } from './inputs.ts';
import { SelectDataSchema } from './select-values.ts';
import { StructuresFromGlobSchema, StructuresSchema } from './structures.ts';

export const EditorKeySchema = z.enum(['visual', 'content', 'data']).meta({
	id: 'EditorKey',
	title: 'Editor Key',
	description: 'The available editors in CloudCannon: visual, content, and data editors.',
});

export const ReducedCascadeSchema = z.object({
	_inputs: InputsSchema.optional(),
	_inputs_from_glob: InputsFromGlobSchema.optional(),
	_select_data: SelectDataSchema.optional(),
	_structures: StructuresSchema.optional(),
	_structures_from_glob: StructuresFromGlobSchema.optional(),
});

export const CascadeSchema = z.object({
	...ReducedCascadeSchema.shape,
	_enabled_editors: z.array(EditorKeySchema).optional().meta({
		id: 'type._enabled_editors',
		title: 'Enabled Editors',
		description:
			'Set a preferred editor and/or disable the others. The first value sets which editor opens by default, and the following values specify which editors are accessible.',
		uniqueItems: true,
	}),
	_editables: EditablesSchema,
	_editables_from_glob: EditablesFromGlobSchema.optional(),
});

export type EditorKey = z.infer<typeof EditorKeySchema>;
export type ReducedCascade = z.infer<typeof ReducedCascadeSchema>;
export type Cascade = z.infer<typeof CascadeSchema>;
