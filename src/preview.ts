import * as z from 'zod';

const PreviewKeyEntrySchema = z
	.object({ key: z.string().meta({ title: 'Key Value' }) })
	.meta({ title: 'Key' });

const PreviewTemplateEntrySchema = z
	.object({ template: z.string().meta({ title: 'Template Value' }) })
	.meta({ title: 'Template' });

const PreviewTextEntrySchema = z
	.object({ text: z.string().meta({ title: 'Text Value' }) })
	.meta({ title: 'Text' });

const PreviewRawTextEntrySchema = z.string().meta({ title: 'Raw Text' });
const PreviewFalseEntrySchema = z.literal(false).meta({ title: 'False' });

const PreviewEntrySchema = z
	.union([
		PreviewKeyEntrySchema,
		PreviewTemplateEntrySchema,
		PreviewTextEntrySchema,
		PreviewRawTextEntrySchema,
		PreviewFalseEntrySchema,
	])
	.meta({ id: 'type.PreviewEntry' });

export const PreviewEntriesSchema = z
	.union([
		z.array(PreviewEntrySchema).meta({ title: 'Array' }),
		PreviewRawTextEntrySchema,
		PreviewFalseEntrySchema,
	])
	.meta({ id: 'type.PreviewEntries' });

export const PreviewGallerySchema = z
	.object({
		text: PreviewEntriesSchema.optional(),
		image: PreviewEntriesSchema.optional(),
		icon: PreviewEntriesSchema.optional(),
		icon_color: PreviewEntriesSchema.optional(),
		icon_background_color: PreviewEntriesSchema.optional(),
		fit: z
			.enum(['padded', 'cover', 'contain', 'cover-top'])
			.default('padded')
			.optional()
			.meta({ id: 'preview.gallery.fit' }),
		background_color: PreviewEntriesSchema.optional(),
	})
	.meta({ id: 'preview.gallery' });

const PreviewMetadataEntrySchema = z
	.object({
		text: PreviewEntriesSchema.optional(),
		image: PreviewEntriesSchema.optional(),
		icon: PreviewEntriesSchema.optional(),
		icon_color: PreviewEntriesSchema.optional(),
		icon_background_color: PreviewEntriesSchema.optional(),
	})
	.meta({ id: 'PreviewMetadataEntry' });

export const PreviewSchema = z
	.object({
		text: PreviewEntriesSchema.optional(),
		subtext: PreviewEntriesSchema.optional(),
		image: PreviewEntriesSchema.optional(),
		icon: PreviewEntriesSchema.optional(),
		icon_color: PreviewEntriesSchema.optional(),
		icon_background_color: PreviewEntriesSchema.optional(),
		tags: z.array(z.string()).optional().meta({ id: 'preview.tags' }),
		metadata: z.array(PreviewMetadataEntrySchema).optional().meta({ id: 'preview.metadata' }),
		gallery: PreviewGallerySchema.optional(),
	})
	.meta({ id: 'type.Preview', title: 'Preview' });

export const PickerPreviewSchema = z
	// This needs to extend it this way, rather than calling PreviewSchema.meta(...).
	// Otherwise, it seems to override in a way that does not allow us to remove `"id": "preview"`
	// during JSONSchema generate.
	.object({ ...PreviewSchema.shape })
	.meta({ id: 'type.PickerPreview', title: 'Picker Preview' });

export type PreviewEntry = z.infer<typeof PreviewEntrySchema>;
export type PreviewEntries = z.infer<typeof PreviewEntriesSchema>;
export type PreviewGallery = z.infer<typeof PreviewGallerySchema>;
export type Preview = z.infer<typeof PreviewSchema>;
