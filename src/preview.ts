import * as z from 'zod';

const PreviewKeyEntrySchema = z
	.object({ key: z.string().meta({ id: 'type.PreviewEntryKeyValue' }) })
	.meta({ id: 'type.PreviewEntryKey' });

const PreviewTemplateEntrySchema = z
	.object({ template: z.string().meta({ id: 'type.PreviewEntryTemplateValue' }) })
	.meta({ id: 'type.PreviewEntryTemplate' });

const PreviewTextEntrySchema = z
	.object({ text: z.string().meta({ id: 'type.PreviewEntryTextValue' }) })
	.meta({ id: 'type.PreviewEntryText' });

const PreviewEntrySchema = z
	.union([
		PreviewKeyEntrySchema,
		PreviewTemplateEntrySchema,
		PreviewTextEntrySchema,
		z.string(),
		z.literal(false),
	])
	.meta({ id: 'type.PreviewEntry' });

const PreviewEntriesSchema = z
	.union([z.array(PreviewEntrySchema), z.string(), z.literal(false)])
	.meta({ id: 'type.PreviewEntries' });

const TextPreviewSchema = PreviewEntriesSchema.optional().meta({ id: 'preview.text' });
const ImagePreviewSchema = PreviewEntriesSchema.optional().meta({ id: 'preview.image' });
const IconPreviewSchema = PreviewEntriesSchema.optional().meta({ id: 'preview.icon' });
export const IconColorSchema = PreviewEntriesSchema.optional().meta({ id: 'preview.icon_color' });
export const IconBackgroundColorSchema = PreviewEntriesSchema.optional().meta({
	id: 'preview.icon_background_color',
});

export const PreviewGallerySchema = z
	.object({
		text: TextPreviewSchema,
		image: ImagePreviewSchema,
		icon: IconPreviewSchema,
		icon_color: IconColorSchema,
		icon_background_color: IconBackgroundColorSchema,
		fit: z
			.enum(['padded', 'cover', 'contain', 'cover-top'])
			.default('padded')
			.optional()
			.meta({ id: 'preview.gallery.fit' }),
		background_color: PreviewEntriesSchema.optional().meta({
			id: 'preview.gallery.background_color',
		}),
	})
	.optional()
	.meta({ id: 'preview.gallery' });

const PreviewMetadataEntrySchema = z
	.object({
		text: TextPreviewSchema,
		image: ImagePreviewSchema,
		icon: IconPreviewSchema,
		icon_color: IconColorSchema,
		icon_background_color: IconBackgroundColorSchema,
	})
	.meta({ id: 'type.PreviewMetadataEntry' });

export const PreviewSchema = z
	.object({
		text: TextPreviewSchema,
		subtext: PreviewEntriesSchema.optional().meta({ id: 'preview.subtext' }),
		image: ImagePreviewSchema,
		icon: IconPreviewSchema,
		icon_color: IconColorSchema,
		icon_background_color: IconBackgroundColorSchema,
		tags: z.array(z.string()).optional().meta({ id: 'preview.tags' }),
		metadata: z.array(PreviewMetadataEntrySchema).optional().meta({ id: 'preview.metadata' }),
		gallery: PreviewGallerySchema,
	})
	.optional()
	// .meta({ id: 'preview' });
	.meta({ id: 'type.Preview', title: 'Preview' });

export const PickerPreviewSchema = z
	// This needs to extend it this way, rather than calling PreviewSchema.meta(...).
	// Otherwise, it seems to override in a way that does not allow us to remove `"id": "preview"`
	// during JSONSchema generate.
	.object({ ...PreviewSchema.unwrap().shape })
	.optional()
	// .meta({ id: 'picker_preview' });
	.meta({ id: 'type.PickerPreview', title: 'Picker Preview' });

export type PreviewEntry = z.infer<typeof PreviewEntrySchema>;
export type PreviewEntries = z.infer<typeof PreviewEntriesSchema>;
export type PreviewGallery = z.infer<typeof PreviewGallerySchema>;
export type Preview = z.infer<typeof PreviewSchema>;
