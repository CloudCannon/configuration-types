import * as z from 'zod';

export const PathsSchema = z
	.object({
		static: z.string().optional().meta({
			id: 'Paths.static',
			description:
				'Location of assets that are statically copied to the output site. This prefix will be removed from the _Uploads_ path when CloudCannon outputs the URL of an asset.',
		}),
		uploads: z.string().default('uploads').optional().meta({
			id: 'Paths.uploads',
			description: 'Default location of newly uploaded site files.',
		}),
		uploads_filename: z.string().optional().meta({
			id: 'Paths.uploads_filename',
			description: 'Filename template for newly uploaded site files.',
		}),
		dam_uploads: z.string().optional().meta({
			id: 'Paths.dam_uploads',
			description: 'Default location of newly uploaded DAM files.',
		}),
		dam_uploads_filename: z.string().optional().meta({
			id: 'Paths.dam_uploads_filename',
			description: 'Filename template for newly uploaded DAM files.',
		}),
		dam_static: z.string().optional().meta({
			id: 'Paths.dam_static',
			description:
				'Location of statically copied assets for DAM files. This prefix will be removed from the _DAM Uploads_ path when CloudCannon outputs the URL of an asset.',
		}),
		uploads_use_relative_path: z.boolean().optional().meta({
			id: 'Paths.uploads_use_relative_path',
			description:
				'When set to true, CloudCannon will reference files relative to the path of the file they were uploaded to.',
		}),
	})
	.meta({
		id: 'paths',
		description:
			'Paths to where new asset files are uploaded to. They also set the default path when choosing existing images, and linking to existing files. Each path is relative to global `source`. Defaults to the global `paths`.',
	});

export type Paths = z.infer<typeof PathsSchema>;
