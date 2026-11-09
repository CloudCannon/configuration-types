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

const _PreviewEntriesSchema = z
	.union([
		z.array(PreviewEntrySchema).meta({
			id: 'type.preview-entry.(array)',
			title: 'Array',
		}),
		PreviewEntrySchema,
	])
	.meta({ id: 'PreviewEntries' });
export type PreviewEntries = z.infer<typeof _PreviewEntriesSchema>;
export const PreviewEntriesSchema: z.ZodType<PreviewEntries> = _PreviewEntriesSchema;

const PreviewTextSchema = PreviewEntriesSchema.nullable()
	.optional()
	.meta({ id: 'type.preview.text' });
const PreviewSubtextSchema = PreviewEntriesSchema.nullable().optional().meta({
	id: 'type.preview.subtext',
});
const PreviewImageSchema = PreviewEntriesSchema.nullable().optional().meta({
	id: 'type.preview.image',
});
const PreviewIconSchema = PreviewEntriesSchema.nullable()
	.optional()
	.meta({ id: 'type.preview.icon' });
const PreviewIconColorSchema = PreviewEntriesSchema.nullable().optional().meta({
	id: 'type.preview.icon_color',
});
const PreviewIconBackgroundColorSchema = PreviewEntriesSchema.nullable().optional().meta({
	id: 'type.preview.icon_background_color',
});
const TagsPreviewEntriesSchema = z
	.array(z.string())
	.nullable()
	.optional()
	.meta({ id: 'type.preview.tags' });

const _PreviewGallerySchema = z
	.object({
		text: PreviewTextSchema,
		image: PreviewImageSchema,
		icon: PreviewIconSchema,
		icon_color: PreviewIconColorSchema,
		icon_background_color: PreviewIconBackgroundColorSchema,
		fit: z
			.enum(['padded', 'cover', 'contain', 'cover-top'])
			.nullable()
			.default('padded')
			.optional()
			.meta({ id: 'preview.gallery.fit' }),
		background_color: PreviewEntriesSchema.nullable().optional().meta({
			id: 'type.preview.gallery.background_color',
		}),
	})
	.nullable()
	.optional()
	.meta({ id: 'type.preview.gallery' });
export interface PreviewGallery extends NonNullable<z.infer<typeof _PreviewGallerySchema>> {}
export const PreviewGallerySchema: z.ZodType<PreviewGallery | null | undefined> =
	_PreviewGallerySchema;

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
	.nullable()
	.optional()
	.meta({ id: 'type.preview.metadata' });

export const _PreviewSchema = z
	.object({
		text: PreviewTextSchema,
		subtext: PreviewSubtextSchema,
		image: PreviewImageSchema,
		icon: PreviewIconSchema,
		icon_color: PreviewIconColorSchema,
		icon_background_color: PreviewIconBackgroundColorSchema,
		tags: TagsPreviewEntriesSchema,
		metadata: PreviewMetadataSchema,
		gallery: PreviewGallerySchema.optional(),
	})
	.meta({ id: 'type.preview', title: 'Preview' });
export interface Preview extends z.infer<typeof _PreviewSchema> {}
export const PreviewSchema: z.ZodType<Preview> = _PreviewSchema;

const _PickerPreviewSchema = _PreviewSchema.meta({
	id: 'type.picker_preview',
	title: 'Picker Preview',
});
export const PickerPreviewSchema: z.ZodType<z.infer<typeof _PickerPreviewSchema>> =
	_PickerPreviewSchema;

export type PreviewEntry = z.infer<typeof PreviewEntrySchema>;
