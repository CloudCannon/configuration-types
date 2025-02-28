export interface ImageResizeable {
	/**
	 * Sets the format images are converted to prior to upload. The extension of the file is updated
	 * to match. Defaults to keeping the mime type of the uploaded file.
	 */
	mime_type?: 'image/jpeg' | 'image/png' | 'image/webp';
	/**
	 * Sets how uploaded image files are resized with a bounding box defined by width and height prior
	 * to upload. Has no effect when selecting existing images, or if width and height are unset.
	 *
	 * @default contain
	 */
	resize_style?: 'cover' | 'contain' | 'stretch' | 'crop';
	/**
	 * Defines the width of the bounding box used in the image resizing process defined with
	 * resize_style.
	 */
	width?: number;
	/**
	 * Defines the height of the bounding box used in the image resizing process defined with
	 * resize_style.
	 */
	height?: number;
	/**
	 * Controls whether or not images can be upscaled to fit the bounding box during resize prior to
	 * upload. Has no effect if files are not resized.
	 *
	 * @default false
	 */
	expandable?: boolean;
	/**
	 * Instructs the editor to save `width` and `height` attributes on the image elements. This can
	 * prevent pop-in as a page loads.
	 *
	 * @default true
	 */
	image_size_attributes?: boolean;
	/**
	 * If you have one or more DAMs connected to your site, you can use this key to list which asset
	 * sources can be uploaded to and selected from.
	 */
	allowed_sources?: string[];
	/**
	 * Enable to skip the image resizing process configured for this input when selecting existing
	 * images.
	 *
	 * @default false
	 */
	prevent_resize_existing_files?: boolean;
	/**
	 * Definitions for creating additional images of different sizes when uploading or selecting
	 * existing files.
	 */
	sizes?: {
		/**
		 * A number suffixed with "x" (relative size) or "w" (fixed width) for setting the dimensions of
		 * the image (e.g. 2x, 3x, 100w, 360w).
		 */
		size: string;
		/**
		 * A reference to another input that is given the path to this additional image file.
		 */
		target?: string;
	}[];
}
