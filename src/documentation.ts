import * as z from 'zod';
import { IconSchema } from './icon.ts';

export const DocumentationSchema = z
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

export type Documentation = z.infer<typeof DocumentationSchema>;
