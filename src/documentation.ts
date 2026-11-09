import * as z from 'zod';
import { IconSchema } from './icon.js';

const _DocumentationSchema = z
	.object({
		url: z.string().min(1).meta({
			description: 'The "href" value of the link.',
		}),
		text: z.string().nullable().optional().meta({
			description: 'The visible text used in the link.',
		}),
		icon: IconSchema.nullable().default('auto_stories').optional().meta({
			description: 'The icon displayed next to the link.',
		}),
	})
	.meta({
		id: 'type.documentation',
		title: 'Documentation',
		description: 'Configuration for documentation links displayed in the CloudCannon interface.',
	});

export interface Documentation extends z.infer<typeof _DocumentationSchema> {}
export const DocumentationSchema: z.ZodType<Documentation> = _DocumentationSchema;
