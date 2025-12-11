import * as z from 'zod';

const PreviewKeyEntrySchema = z.object({ key: z.string().meta({ title: 'Key Value' }) }).meta({
	id: 'type.preview-entry.(key)',
	title: 'Key',
});

const PreviewTemplateEntrySchema = z
	.object({ template: z.string().meta({ title: 'Template Value' }) })
	.meta({
		id: 'type.preview-entry.(template)',
		title: 'Template',
	});

const PreviewTextEntrySchema = z.object({ text: z.string().meta({ title: 'Text Value' }) }).meta({
	id: 'type.preview-entry.(text)',
	title: 'Text',
});

const PreviewRawTextEntrySchema = z.string().meta({
	id: 'type.preview-entry.(raw-text)',
	title: 'Raw Text',
});

const PreviewFalseEntrySchema = z.literal(false).meta({
	id: 'type.preview-entry.(false)',
	title: 'False',
});

const PreviewEntrySchema = z
	.union([
		PreviewKeyEntrySchema,
		PreviewTemplateEntrySchema,
		PreviewTextEntrySchema,
		PreviewRawTextEntrySchema,
		PreviewFalseEntrySchema,
	])
	.meta({
		id: 'type.preview-entry',
		title: 'Preview Entry',
	});

export const PreviewEntriesSchema = z
	.union([
		z.array(PreviewEntrySchema).meta({
			id: 'type.preview-entry.(array)',
			title: 'Array',
		}),
		PreviewRawTextEntrySchema,
		PreviewFalseEntrySchema,
	])
	.meta({ id: 'PreviewEntries' });

const TextPreviewEntriesSchema = PreviewEntriesSchema.optional().meta({ id: 'type.preview.text' });
const SubtextPreviewEntriesSchema = PreviewEntriesSchema.optional().meta({
	id: 'type.preview.subtext',
});
const ImagePreviewEntriesSchema = PreviewEntriesSchema.optional().meta({
	id: 'type.preview.image',
});
const IconPreviewEntriesSchema = PreviewEntriesSchema.optional().meta({ id: 'type.preview.icon' });
const IconColorPreviewEntriesSchema = PreviewEntriesSchema.optional().meta({
	id: 'type.preview.icon_color',
});
const IconBackgroundColorPreviewEntriesSchema = PreviewEntriesSchema.optional().meta({
	id: 'type.preview.icon_background_color',
});

export const PreviewGallerySchema = z
	.object({
		text: TextPreviewEntriesSchema,
		image: ImagePreviewEntriesSchema,
		icon: IconPreviewEntriesSchema,
		icon_color: IconColorPreviewEntriesSchema,
		icon_background_color: IconBackgroundColorPreviewEntriesSchema,
		fit: z
			.enum(['padded', 'cover', 'contain', 'cover-top'])
			.default('padded')
			.optional()
			.meta({ id: 'preview.gallery.fit' }),
		background_color: PreviewEntriesSchema.optional().meta({
			id: 'type.preview.gallery.background_color',
		}),
	})
	.meta({ id: 'preview.gallery' });

const PreviewMetadataEntrySchema = z
	.object({
		text: TextPreviewEntriesSchema,
		image: ImagePreviewEntriesSchema,
		icon: IconPreviewEntriesSchema,
		icon_color: IconColorPreviewEntriesSchema,
		icon_background_color: IconBackgroundColorPreviewEntriesSchema,
	})
	.meta({ id: 'PreviewMetadataEntry' });

export const PreviewSchema = z
	.object({
		text: TextPreviewEntriesSchema,
		subtext: SubtextPreviewEntriesSchema,
		image: ImagePreviewEntriesSchema,
		icon: IconPreviewEntriesSchema,
		icon_color: IconColorPreviewEntriesSchema,
		icon_background_color: IconBackgroundColorPreviewEntriesSchema,
		tags: z.array(z.string()).optional().meta({ id: 'preview.tags' }),
		metadata: z.array(PreviewMetadataEntrySchema).optional().meta({ id: 'preview.metadata' }),
		gallery: PreviewGallerySchema.optional(),
	})
	.meta({ id: 'type.preview', title: 'Preview' });

export type PreviewEntry = z.infer<typeof PreviewEntrySchema>;
export type PreviewEntries = z.infer<typeof PreviewEntriesSchema>;
export type PreviewGallery = z.infer<typeof PreviewGallerySchema>;
export type Preview = z.infer<typeof PreviewSchema>;
