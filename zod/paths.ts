import * as z from 'zod/v4';

export const PathsSchema = z.object({
	static: z
		.string()
		.optional()
		.describe(
			'Location of assets that are statically copied to the output site. This prefix will be removed from the _Uploads_ path when CloudCannon outputs the URL of an asset.'
		),

	uploads: z
		.string()
		.default('uploads')
		.optional()
		.describe('Default location of newly uploaded site files.'),

	uploads_filename: z
		.string()
		.optional()
		.describe('Filename template for newly uploaded site files.'),

	dam_uploads: z.string().optional().describe('Default location of newly uploaded DAM files.'),

	dam_uploads_filename: z
		.string()
		.optional()
		.describe('Filename template for newly uploaded DAM files.'),

	dam_static: z
		.string()
		.optional()
		.describe(
			'Location of statically copied assets for DAM files. This prefix will be removed from the _DAM Uploads_ path when CloudCannon outputs the URL of an asset.'
		),

	uploads_use_relative_path: z
		.boolean()
		.optional()
		.describe(
			'When set to true, CloudCannon will reference files relative to the path of the file they were uploaded to.'
		),
}).meta({
	name: 'Paths',
	description: 'Configuration for file upload paths and asset handling in CloudCannon.',
});

export const WithPathsSchema = z.object({
	paths: PathsSchema.optional().describe(
		'Paths to where new asset files are uploaded to. They also set the default path when choosing existing images, and linking to existing files. Each path is relative to global `source`. Defaults to the global `paths`.'
	),
}).meta({
	name: 'WithPaths',
	description: 'Mixin schema that adds path configuration capabilities to other schemas.',
});

export type Paths = z.infer<typeof PathsSchema>;
export type WithPaths = z.infer<typeof WithPathsSchema>;
