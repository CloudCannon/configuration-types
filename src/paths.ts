import * as z from 'zod';

export const PathsSchema = z
	.object({
		static: z.string().optional().meta({ id: 'paths.static' }),
		uploads: z.string().default('uploads').optional().meta({ id: 'paths.uploads' }),
		uploads_filename: z.string().optional().meta({ id: 'paths.uploads_filename' }),
		dam_uploads: z.string().optional().meta({ id: 'paths.dam_uploads' }),
		dam_uploads_filename: z.string().optional().meta({ id: 'paths.dam_uploads_filename' }),
		dam_static: z.string().optional().meta({ id: 'paths.dam_static' }),
		uploads_use_relative_path: z
			.boolean()
			.optional()
			.meta({ id: 'paths.uploads_use_relative_path' }),
	})
	.optional()
	.meta({ id: 'paths' });

export type Paths = z.infer<typeof PathsSchema>;
