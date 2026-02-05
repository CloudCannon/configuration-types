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

const PreviewTextSchema = PreviewEntriesSchema.optional().meta({ id: 'type.preview.text' });
const PreviewSubtextSchema = PreviewEntriesSchema.optional().meta({
	id: 'type.preview.subtext',
});
const PreviewImageSchema = PreviewEntriesSchema.optional().meta({
	id: 'type.preview.image',
});
const PreviewIconSchema = PreviewEntriesSchema.optional().meta({ id: 'type.preview.icon' });
const PreviewIconColorSchema = PreviewEntriesSchema.optional().meta({
	id: 'type.preview.icon_color',
});
const PreviewIconBackgroundColorSchema = PreviewEntriesSchema.optional().meta({
	id: 'type.preview.icon_background_color',
});
const TagsPreviewEntriesSchema = z.array(z.string()).optional().meta({ id: 'type.preview.tags' });

export const PreviewGallerySchema = z
	.object({
		text: PreviewTextSchema,
		image: PreviewImageSchema,
		icon: PreviewIconSchema,
		icon_color: PreviewIconColorSchema,
		icon_background_color: PreviewIconBackgroundColorSchema,
		fit: z
			.enum(['padded', 'cover', 'contain', 'cover-top'])
			.default('padded')
			.optional()
			.meta({ id: 'preview.gallery.fit' }),
		background_color: PreviewEntriesSchema.optional().meta({
			id: 'type.preview.gallery.background_color',
		}),
	})
	.optional()
	.meta({ id: 'type.preview.gallery' });

const MetadataPreviewEntrySchema = z
	.object({
		text: PreviewTextSchema,
		image: PreviewImageSchema,
		icon: PreviewIconSchema,
		icon_color: PreviewIconColorSchema,
		icon_background_color: PreviewIconBackgroundColorSchema,
	})
	.meta({ id: 'PreviewMetadataEntry' });

const PreviewMetadataSchema = z
	.array(MetadataPreviewEntrySchema)
	.optional()
	.meta({ id: 'type.preview.metadata' });

export const PreviewSchema = z
	.object({
		text: PreviewTextSchema,
		subtext: PreviewSubtextSchema,
		image: PreviewImageSchema,
		icon: PreviewIconSchema,
		icon_color: PreviewIconColorSchema,
		icon_background_color: PreviewIconBackgroundColorSchema,
		tags: TagsPreviewEntriesSchema,
		metadata: PreviewMetadataSchema,
		gallery: PreviewGallerySchema,
	})
	.meta({ id: 'type.preview', title: 'Preview' });

export const PickerPreviewSchema = PreviewSchema.meta({
	id: 'type.picker_preview',
	title: 'Picker Preview',
});

export type PreviewEntry = z.infer<typeof PreviewEntrySchema>;
export type PreviewEntries = z.infer<typeof PreviewEntriesSchema>;
export type PreviewGallery = NonNullable<z.infer<typeof PreviewGallerySchema>>;
export type Preview = z.infer<typeof PreviewSchema>;
