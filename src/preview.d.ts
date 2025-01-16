interface PreviewKeyEntry {
	/**
	 * The key used to access the value used for the preview.
	 */
	key: string;
}

type PreviewEntry = Array<PreviewKeyEntry | string | boolean> | string | boolean;

export interface WithTextPreview {
	/**
	 * Controls the main text shown per item.
	 */
	text?: PreviewEntry;
}

export interface WithImagePreview {
	/**
	 * Controls the image shown per item.
	 */
	image?: PreviewEntry;
}

export interface WithSubtextPreview {
	/**
	 * Controls the supporting text shown per item.
	 */
	subtext?: PreviewEntry;
}

export interface WithIconPreview {
	/**
	 * Controls the icon shown per item. Must result in a Material Icon name.
	 */
	icon?: PreviewEntry;
}

export interface WithIconColorPreview {
	/**
	 * Controls the color of the icon.
	 */
	icon_color?: string;
}

export interface WithPreview {
	/**
	 * Changes the way items are previewed in the CMS.
	 */
	preview?: Preview;
}

export interface WithPickerPreview {
	/**
	 * Changes the way items are previewed in the CMS while being chosen.
	 */
	picker_preview?: Preview;
}

export interface PreviewGallery
	extends WithTextPreview,
		WithImagePreview,
		WithIconPreview,
		WithIconColorPreview {
	/**
	 * Controls how the gallery image is positioned within the gallery.
	 *
	 * @default padded
	 */
	fit?: 'padded' | 'cover' | 'contain' | 'cover-top';
}

export interface PreviewMetadata
	extends WithTextPreview,
		WithImagePreview,
		WithIconPreview,
		WithIconColorPreview {}

export interface Preview
	extends WithTextPreview,
		WithImagePreview,
		WithIconPreview,
		WithIconColorPreview,
		WithSubtextPreview {
	/**
	 * Defines a list of items that can contain an image, icon, and text.
	 */
	metadata?: PreviewMetadata[];
	/**
	 * Details for large image/icon preview per item.
	 */
	gallery?: PreviewGallery;
}
