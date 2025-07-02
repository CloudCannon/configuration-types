import * as z from 'zod/v4';

// Note: Icon will be imported from ./icon when that file is created
// For now using string, will be replaced during generation
const IconSchema = z.string();

export const DocumentationSchema = z.object({
	url: z.string().describe('The "href" value of the link.'),

	text: z.string().optional().describe('The visible text used in the link.'),

	icon: IconSchema.default('auto_stories')
		.optional()
		.describe('The icon displayed next to the link.'),
});

export type Documentation = z.infer<typeof DocumentationSchema>;
