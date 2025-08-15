import * as z from 'zod';

const PreviewKeyEntrySchema = z.object({
	key: z.string().meta({
		description: 'The key used to access the value used for the preview.',
	}),
});

const PreviewTemplateEntrySchema = z.object({
	template: z.string().meta({
		description:
			'A template string containing various placeholders for the value used in the preview.',
	}),
});

const PreviewEntrySchema = z
	.union([
		z.array(z.union([PreviewKeyEntrySchema, PreviewTemplateEntrySchema, z.string(), z.boolean()])),
		z.string(),
		z.boolean(),
	])
	.meta({
		id: 'PreviewEntry',
	});

const TextPreviewSchema = PreviewEntrySchema.meta({
	id: 'preview.text',
	description: 'Controls the main text shown per item.',
});

const ImagePreviewSchema = PreviewEntrySchema.meta({
	id: 'preview.image',
	description: 'Controls the image shown per item.',
});

const IconPreviewSchema = PreviewEntrySchema.meta({
	id: 'preview.icon',
	description: 'Controls the icon shown per item. Must result in a Material Symbol name.',
});

export const IconColorSchema = PreviewEntrySchema.meta({
	id: 'preview.icon_color',
	description: 'Controls the color of the icon.',
});

export const IconBackgroundColorSchema = PreviewEntrySchema.meta({
	id: 'preview.icon_background_color',
	description: 'Controls the background color of the icon.',
});

export const PreviewGallerySchema = z
	.object({
		text: TextPreviewSchema.optional(),
		image: ImagePreviewSchema.optional(),
		icon: IconPreviewSchema.optional(),
		icon_color: IconColorSchema.optional(),
		icon_background_color: IconBackgroundColorSchema.optional(),
		fit: z.enum(['padded', 'cover', 'contain', 'cover-top']).default('padded').optional().meta({
			description: 'Controls how the gallery image is positioned within the gallery.',
		}),
		background_color: PreviewEntrySchema.optional().meta({
			description: 'Controls the background color gallery area.',
		}),
	})
	.meta({
		id: 'preview.gallery',
		title: 'Preview Gallery',
		description: 'Configuration for gallery-style previews.',
	});

export const PreviewMetadataSchema = z
	.object({
		text: TextPreviewSchema.optional(),
		image: ImagePreviewSchema.optional(),
		icon: IconPreviewSchema.optional(),
		icon_color: IconColorSchema.optional(),
		icon_background_color: IconBackgroundColorSchema.optional(),
	})
	.meta({
		id: 'preview.metadata',
		title: 'Preview Metadata',
		description:
			'Metadata configuration for preview items including text, image, and icon options.',
	});

export const PreviewSchema = z
	.object({
		text: TextPreviewSchema.optional(),
		subtext: PreviewEntrySchema.optional().meta({
			description: 'Controls the supporting text shown per item.',
		}),
		image: ImagePreviewSchema.optional(),
		icon: IconPreviewSchema.optional(),
		icon_color: IconColorSchema.optional(),
		icon_background_color: IconBackgroundColorSchema.optional(),
		metadata: z.array(PreviewMetadataSchema).optional().meta({
			description: 'Defines a list of items that can contain an image, icon, and text.',
		}),
		gallery: PreviewGallerySchema.optional().meta({
			description: 'Details for large image/icon preview per item.',
		}),
	})
	.meta({
		id: 'preview',
		title: 'Preview',
		description:
			'Configuration for how content items are visually previewed in the CloudCannon interface.',
	});

export const PickerPreviewSchema = z
	.object({
		// This needs to extend it this way, rather than calling PreviewSchema.meta({}).
		// Otherwise, it seems to override in a way that does not allow us to remove `"id": "preview"`
		// during JSONSchema generate.
		...PreviewSchema.shape,
	})
	.meta({
		id: 'picker_preview',
		title: 'Picker Preview',
		description: 'Changes the way items are previewed in the CMS while being chosen.',
	});

export type PreviewGallery = z.infer<typeof PreviewGallerySchema>;
export type PreviewMetadata = z.infer<typeof PreviewMetadataSchema>;
export type Preview = z.infer<typeof PreviewSchema>;
