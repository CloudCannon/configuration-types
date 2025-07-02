import * as z from "zod/v4";

const PreviewKeyEntrySchema = z.object({
	key: z.string()
		.describe("The key used to access the value used for the preview."),
});

const PreviewTemplateEntrySchema = z.object({
	template: z.string()
		.describe(
			"A template string containing various placeholders for the value used in the preview.",
		),
});

const PreviewEntrySchema = z.union([
	z.array(z.union([
		PreviewKeyEntrySchema,
		PreviewTemplateEntrySchema,
		z.string(),
		z.boolean(),
	])),
	z.string(),
	z.boolean(),
]);

export const WithTextPreviewSchema = z.object({
	text: PreviewEntrySchema
		.optional()
		.describe("Controls the main text shown per item."),
});

export const WithImagePreviewSchema = z.object({
	image: PreviewEntrySchema
		.optional()
		.describe("Controls the image shown per item."),
});

export const WithSubtextPreviewSchema = z.object({
	subtext: PreviewEntrySchema
		.optional()
		.describe("Controls the supporting text shown per item."),
});

export const WithIconPreviewSchema = z.object({
	icon: PreviewEntrySchema
		.optional()
		.describe(
			"Controls the icon shown per item. Must result in a Material Icon name.",
		),
});

export const WithIconColorPreviewSchema = z.object({
	icon_color: PreviewEntrySchema
		.optional()
		.describe("Controls the color of the icon."),

	icon_background_color: PreviewEntrySchema
		.optional()
		.describe("Controls the background color of the icon."),
});

export const PreviewGallerySchema = z.object({
	...WithTextPreviewSchema.shape,
	...WithImagePreviewSchema.shape,
	...WithIconPreviewSchema.shape,
	...WithIconColorPreviewSchema.shape,
	fit: z.enum(["padded", "cover", "contain", "cover-top"])
		.default("padded")
		.optional()
		.describe(
			"Controls how the gallery image is positioned within the gallery.",
		),

	background_color: PreviewEntrySchema
		.optional()
		.describe("Controls the background color gallery area."),
});

export const PreviewMetadataSchema = z.object({
	...WithTextPreviewSchema.shape,
	...WithImagePreviewSchema.shape,
	...WithIconPreviewSchema.shape,
	...WithIconColorPreviewSchema.shape,
});

export const PreviewSchema = z.object({
	...WithTextPreviewSchema.shape,
	...WithImagePreviewSchema.shape,
	...WithIconPreviewSchema.shape,
	...WithIconColorPreviewSchema.shape,
	...WithSubtextPreviewSchema.shape,
	metadata: z.array(PreviewMetadataSchema)
		.optional()
		.describe(
			"Defines a list of items that can contain an image, icon, and text.",
		),

	gallery: PreviewGallerySchema
		.optional()
		.describe("Details for large image/icon preview per item."),
});

export const WithPreviewSchema = z.object({
	preview: PreviewSchema
		.optional()
		.describe("Changes the way items are previewed in the CMS."),
});

export const WithPickerPreviewSchema = z.object({
	picker_preview: PreviewSchema
		.optional()
		.describe(
			"Changes the way items are previewed in the CMS while being chosen.",
		),
});

export type WithTextPreview = z.infer<typeof WithTextPreviewSchema>;
export type WithImagePreview = z.infer<typeof WithImagePreviewSchema>;
export type WithSubtextPreview = z.infer<typeof WithSubtextPreviewSchema>;
export type WithIconPreview = z.infer<typeof WithIconPreviewSchema>;
export type WithIconColorPreview = z.infer<typeof WithIconColorPreviewSchema>;
export type WithPreview = z.infer<typeof WithPreviewSchema>;
export type WithPickerPreview = z.infer<typeof WithPickerPreviewSchema>;
export type PreviewGallery = z.infer<typeof PreviewGallerySchema>;
export type PreviewMetadata = z.infer<typeof PreviewMetadataSchema>;
export type Preview = z.infer<typeof PreviewSchema>;
