import * as z from 'zod';

import { EditablesSchema } from './editables.ts';
import { InputsSchema } from './inputs.ts';
import { SelectDataSchema } from './select-values.ts';
import { StructuresSchema } from './structures.ts';

export const EditorKeySchema = z.enum(['visual', 'content', 'data']).meta({
	id: 'EditorKey',
	title: 'Editor Key',
	description: 'The available editors in CloudCannon: visual, content, and data editors.',
});

export const ReducedCascadeSchema = z.object({
	_inputs: InputsSchema.optional(),
	_select_data: SelectDataSchema.optional(),
	_structures: StructuresSchema.optional(),
});

export const CascadeSchema = z.object({
	...ReducedCascadeSchema.shape,
	_enabled_editors: z.array(EditorKeySchema).optional().meta({
		id: '_enabled_editors',
		title: 'Enabled Editors',
		description:
			'Set a preferred editor and/or disable the others. The first value sets which editor opens by default, and the following values specify which editors are accessible.',
		uniqueItems: true,
	}),
	_editables: EditablesSchema.optional().meta({
		id: '_editables',
		title: 'Editables',
		description:
			'Configuration for editable regions in the Visual Editor, including content, block, link, image, and text editing options.',
	}),
});

export type EditorKey = z.infer<typeof EditorKeySchema>;
export type ReducedCascade = z.infer<typeof ReducedCascadeSchema>;
export type Cascade = z.infer<typeof CascadeSchema>;
