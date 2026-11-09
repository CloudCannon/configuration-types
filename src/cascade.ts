import * as z from 'zod';
import { EditablesFromGlobSchema, EditablesSchema } from './editables.js';
import { InputsFromGlobSchema, InputsSchema } from './inputs.js';
import { SelectDataSchema } from './select-values.js';
import { StructuresFromGlobSchema, StructuresSchema } from './structures.js';

const EDITOR_KEYS = ['visual', 'content', 'data'] as const;
export const EditorKeySchema = z.enum(EDITOR_KEYS).meta({
	id: 'EditorKey',
	title: 'Editor Key',
	description: 'The available editors in CloudCannon: visual, content, and data editors.',
});

export const _ReducedCascadeSchema = z.object({
	_inputs: InputsSchema.nullable().optional(),
	_inputs_from_glob: InputsFromGlobSchema.nullable().optional(),
	_select_data: SelectDataSchema.nullable().optional(),
	_structures: StructuresSchema.nullable().optional(),
	_structures_from_glob: StructuresFromGlobSchema.nullable().optional(),
});
export interface ReducedCascade extends z.infer<typeof _ReducedCascadeSchema> {}
export const ReducedCascadeSchema: z.ZodType<ReducedCascade> = _ReducedCascadeSchema;

export const _CascadeSchema = z.object({
	..._ReducedCascadeSchema.shape,
	_enabled_editors: z.array(EditorKeySchema).nullable().optional().meta({
		id: 'type._enabled_editors',
		title: 'Enabled Editors',
		description:
			'Set a preferred editor and/or disable the others. The first value sets which editor opens by default, and the following values specify which editors are accessible.',
		uniqueItems: true,
	}),
	_editables: EditablesSchema.optional(),
	_editables_from_glob: EditablesFromGlobSchema.nullable().optional(),
});
export interface Cascade extends z.infer<typeof _CascadeSchema> {}
export const CascadeSchema: z.ZodType<Cascade> = _CascadeSchema;

export type EditorKey = (typeof EDITOR_KEYS)[number];
