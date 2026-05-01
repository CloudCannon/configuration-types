import * as z from 'zod';
import { DocumentationSchema } from './documentation.ts';
import { IconSchema } from './icon.ts';

export const typeMeta = {
	title: 'Type',
	description: 'Sets an input type, which controls how this input appears and behaves.',
};

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
