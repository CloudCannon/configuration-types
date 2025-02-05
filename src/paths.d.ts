export interface Paths {
	/**
	 * Location of assets that are statically copied to the output site. This prefix will be removed
	 * from the _Uploads_ path when CloudCannon outputs the URL of an asset.
	 */
	static?: string;
	/**
	 * Default location of newly uploaded site files.
	 *
	 * @default uploads
	 */
	uploads?: string;
	/**
	 * Filename template for newly uploaded site files.
	 */
	uploads_filename?: string;
	/**
	 * Default location of newly uploaded DAM files.
	 */
	dam_uploads?: string;
	/**
	 * Filename template for newly uploaded DAM files.
	 */
	dam_uploads_filename?: string;
	/**
	 * Location of statically copied assets for DAM files. This prefix will be removed from the _DAM
	 * Uploads_ path when CloudCannon outputs the URL of an asset.
	 */
	dam_static?: string;
	/**
	 * When set to true, CloudCannon will reference files relative to the path of the file they were
	 * uploaded to.
	 */
	uploads_use_relative_path?: boolean;
}

export interface WithPaths {
	/**
	 * Paths to where new asset files are uploaded to. They also set the default path when choosing
	 * existing images, and linking to existing files. Each path is relative to global `source`.
	 * Defaults to the global `paths`.
	 */
	paths?: Paths;
}
