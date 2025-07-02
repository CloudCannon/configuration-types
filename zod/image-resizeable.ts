import * as z from "zod/v4";

export const ImageResizeableSchema = z.object({
	mime_type: z.enum(['image/jpeg', 'image/png', 'image/webp'])
		.optional()
		.describe('Sets the format images are converted to prior to upload. The extension of the file is updated to match. Defaults to keeping the mime type of the uploaded file.'),
	
	resize_style: z.enum(['cover', 'contain', 'stretch', 'crop'])
		.default('contain')
		.optional()
		.describe('Sets how uploaded image files are resized with a bounding box defined by width and height prior to upload. Has no effect when selecting existing images, or if width and height are unset.'),
	
	width: z.number()
		.optional()
		.describe('Defines the width of the bounding box used in the image resizing process defined with resize_style.'),
	
	height: z.number()
		.optional()
		.describe('Defines the height of the bounding box used in the image resizing process defined with resize_style.'),
	
	expandable: z.boolean()
		.default(false)
		.optional()
		.describe('Controls whether or not images can be upscaled to fit the bounding box during resize prior to upload. Has no effect if files are not resized.'),
	
	image_size_attributes: z.boolean()
		.default(true)
		.optional()
		.describe('Instructs the editor to save `width` and `height` attributes on the image elements. This can prevent pop-in as a page loads.'),
	
	allowed_sources: z.array(z.string())
		.optional()
		.describe('If you have one or more DAMs connected to your site, you can use this key to list which asset sources can be uploaded to and selected from.'),
	
	prevent_resize_existing_files: z.boolean()
		.default(false)
		.optional()
		.describe('Enable to skip the image resizing process configured for this input when selecting existing images.'),
	
	sizes: z.array(z.object({
		size: z.string()
			.describe('A number suffixed with "x" (relative size) or "w" (fixed width) for setting the dimensions of the image (e.g. 2x, 3x, 100w, 360w).'),
		
		target: z.string()
			.optional()
			.describe('A reference to another input that is given the path to this additional image file.')
	}))
		.optional()
		.describe('Definitions for creating additional images of different sizes when uploading or selecting existing files.')
});

export type ImageResizeable = z.infer<typeof ImageResizeableSchema>; 