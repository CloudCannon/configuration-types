import * as z from 'zod/v4';
import { DocumentationSchema } from './documentation.ts';
import { IconSchema } from './icon.ts';

export const ObjectInputGroupSchema = z.object({
	heading: z
		.string()
		.optional()
		.describe('The main text for the group shown when collapsed or expanded.'),

	comment: z
		.string()
		.optional()
		.describe(
			'Changes the subtext below the `heading`. Has no default. Supports a limited set of Markdown: links, bold, italic, subscript, superscript, and inline code elements are allowed.'
		),

	collapsed: z
		.boolean()
		.default(false)
		.optional()
		.describe('Controls if this group is collapsed or expanded when first viewed.'),

	inputs: z.array(z.string()).optional().describe('The keys of each input in this group.'),

	documentation: DocumentationSchema.optional().describe(
		'Provides a custom link for documentation for editors shown above the collection file list.'
	),
});

export const InstanceValueSchema = z.enum(['UUID', 'NOW']);

export const InputTypeSchema = z.enum([
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
]);

export const BaseInputSchema = z.object({
	comment: z
		.string()
		.optional()
		.describe(
			'Changes the subtext below the _Label_. Has no default. Supports a limited set of Markdown: links, bold, italic, subscript, superscript, and inline code elements are allowed.'
		),

	context: z
		.object({
			content: z
				.string()
				.optional()
				.describe('The rich text content shown when opened. Supports a limited set of Markdown.'),

			open: z.boolean().optional().describe('Makes the content visible initially.'),

			title: z
				.string()
				.optional()
				.describe('The text shown when not open. Defaults to "Context" if unset.'),

			icon: IconSchema.optional().describe('The icon shown when not open.'),
		})
		.optional()
		.describe('Adds an expandable section of rich text below the input.'),

	documentation: DocumentationSchema.optional().describe(
		'Provides a custom link for documentation for editors shown above input.'
	),

	label: z.string().optional().describe('Optionally changes the text above this input.'),

	hidden: z
		.union([z.boolean(), z.string()])
		.default(false)
		.optional()
		.describe('Toggles the visibility of this input.'),

	disabled: z
		.union([z.boolean(), z.string()])
		.default(false)
		.optional()
		.describe('Toggles if this input can be edited.'),

	instance_value: InstanceValueSchema.optional().describe(
		'Controls if and how the value of this input is instantiated when created. This occurs when creating files, or adding array items containing the configured input.'
	),

	disable_instance_value_rehydration: z
		.boolean()
		.default(false)
		.optional()
		.describe(
			'Prevents the default where inputs configured with an `instance_value` are rehydrated with a new value when duplicated in the CMS.'
		),

	cascade: z
		.boolean()
		.optional()
		.describe(
			'Specifies whether or not this input configuration should be merged with any matching, less specific configuration.'
		),
});

export type ObjectInputGroup = z.infer<typeof ObjectInputGroupSchema>;
export type InstanceValue = z.infer<typeof InstanceValueSchema>;
export type InputType = z.infer<typeof InputTypeSchema>;
export type BaseInput = z.infer<typeof BaseInputSchema>;
