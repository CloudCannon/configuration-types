import type { Cascade, EditorKey, ReducedCascade } from './cascade';
import type { Documentation } from './documentation';
import type { Icon } from './icon';
import type { Input } from './inputs';
import type { MarkdownSettings } from './markdown';
import type { WithPaths } from './paths';
import type { WithPreview } from './preview';
import type { SnippetConfig, SnippetsImports } from './snippets';
import type { SourceEditor } from './source-editor';
import type { StructureBase } from './structures';
import type { Timezone } from './timezone';

export type HrefAddOption = {
	/**
	 * The text displayed for the menu item.
	 */
	name?: string;
	/**
	 * The icon next to the text in the menu item.
	 *
	 * @default add
	 */
	icon?: Icon;
	/**
	 * The link that opens when the option is clicked. Can either be an external or internal link. If
	 * internal, the link is relative to the current site.
	 */
	href: string;
};

export type AddOption = {
	/**
	 * The text displayed for the menu item. Defaults to using name from the matching schema if set.
	 */
	name?: string;
	/**
	 * The icon next to the text in the menu item. Defaults to using icon from the matching schema if
	 * set, then falls back to add.
	 */
	icon?: Icon;
	/**
	 * The editor to open the new file in. Defaults to an appropriate editor for new file's type if
	 * possible. If no default editor can be calculated, or the editor does not support the new file
	 * type, a warning is shown in place of the editor.
	 */
	editor?: EditorKey;
	/**
	 * Enforces a path for new files to be created in, regardless of path the user is currently
	 * navigated to within the collection file list. Relative to the path of the collection defined in
	 * collection. Defaults to the path within the collection the user is currently navigated to.
	 */
	base_path?: string;
	/**
	 * Sets which collection this action is creating a file in. This is used when matching the value
	 * for schema. Defaults to the containing collection these `add_options` are configured in.
	 */
	collection?: string;
	/**
	 * The schema that new files are created from with this action. This schema is not restricted to
	 * the containing collection, and is instead relative to the collection specified with collection.
	 * Defaults to default if schemas are configured for the collection.
	 */
	schema?: string;
	/**
	 * The path to a file used to populate the initial contents of a new file if no schemas are
	 * configured. We recommend using schemas, and this is ignored if a schema is available.
	 */
	default_content_file?: string;
};

export interface Schema extends Cascade, WithPreview, StructureBase {
	/**
	 * The path to the schema file. Relative to the root folder of the site.
	 */
	path: string;
	/**
	 * Displayed in the add menu when creating new files. Defaults to a formatted version of the key.
	 */
	name?: string;
	/**
	 * Displayed in the add menu when creating new files; also used as the icon for collection files
	 * if no other preview is found. Defaults to notes.
	 *
	 * @default notes
	 */
	icon?: Icon;
	/**
	 * Controls where new files are saved.
	 */
	create?: Create;
	/**
	 * Preview your unbuilt pages (e.g. drafts) to another page's output URL. The Visual Editor will
	 * load that URL, where Data Bindings and Previews are available to render your new page without
	 * saving.
	 */
	new_preview_url?: string;
}

export type SortOrder = 'ascending' | 'descending' | 'asc' | 'desc';

export interface Sort {
	/**
	 * Defines what field contains the value to sort on inside each collection item's data.
	 */
	key: string;
	/**
	 * Controls which sort values come first.
	 *
	 * @default ascending
	 */
	order?: SortOrder;
}

export interface SortOption extends Sort {
	/**
	 * The text to display in the sort option list. Defaults to a generated label from key and order.
	 */
	label?: string;
}

export interface Create extends ReducedCascade {
	/**
	 * The raw template to be processed when creating files. Relative to the containing collection's
	 * path.
	 */
	path?: string;
	/**
	 * Adds to the available data placeholders coming from the file. Entry values follow the same
	 * format as path, and are processed sequentially before path. These values are not saved back to
	 * your file.
	 */
	extra_data?: Record<string, string>;
	/**
	 * Defines a target collection when publishing. When a file is published, the target collection's
	 * create definition is used instead.
	 */
	publish_to?: string;
}

export interface CollectionConfig extends Cascade, WithPreview {
	/**
	 * This key defines the folder path for the collection key in which it is nested.
	 *
	 * The value for this key is relative to your Site `source`. Each Collection must have a unique
	 * path.
	 *
	 * This key has no default.
	 *
	 * https://cloudcannon.com/documentation/articles/collections-reference/#path
	 */
	path: string;
	/**
	 * This key defines globs which filter the files visible in the _Collection browser_ for a given
	 * Collection. Values in this array are relative to the Collection `path`.
	 *
	 * Globs can be positive (e.g. `*.yml`), or negative (e.g. `!**\/*.json`). Files are included in a
	 * Collection if they match any positive globs and do not match any negative globs. If you do not
	 * define any positive globs, CloudCannon will include all non-developer files in a Collection
	 * unless they match a negative glob.
	 *
	 * For more information about developer files, please read our documentation on the
	 * [`include_developer_files`](https://cloudcannon.com/documentation/articles/collections-reference/#include_developer_files)
	 * key.
	 *
	 * Defining a negative glob for a Collection does not remove a file from the associated Collection
	 * folder in your Git repository. Similarly, defining a positive glob for a file in a folder
	 * outside your Collection path does not move the file.
	 *
	 * This key has no default.
	 *
	 * https://cloudcannon.com/documentation/articles/collections-reference/#glob
	 */
	glob?: string[] | string;
	/**
	 * This key defines the output URL for files in a given Collection. CloudCannon uses the output
	 * URL in the Visual Editor, and when linking to your Testing Domain and Custom Domain.
	 *
	 * Values for this key can be a mix of plain text and template strings, and should begin with the
	 * `/` character. Template strings can contain data placeholders and fixed placeholders, which
	 * CloudCannon will replace with the data it references when generating the output URL.
	 *
	 * For more information about data placeholders and fixed placeholders, please read our
	 * documentation on [configuring your template
	 * strings](https://cloudcannon.com/documentation/articles/configure-your-template-strings/).
	 *
	 * This key has no default.
	 *
	 * https://cloudcannon.com/documentation/articles/collections-reference/#url
	 */
	url?: string;
	/**
	 * This key toggles whether CloudCannon will generate an output URL for a given Collection.
	 *
	 * Setting this key to `true` will prevent CloudCannon from generating an output URL for a
	 * Collection.
	 *
	 * By default, this key is `false` (i.e., generate an output URL for this Collection).
	 *
	 * https://cloudcannon.com/documentation/articles/collections-reference/#disable_url
	 *
	 * @default false
	 */
	disable_url?: boolean;
	/**
	 * This key toggles whether CloudCannon removes developer files from your _Collection browser_.
	 * CloudCannon excludes files that probably shouldn't be edited in a CMS from your _Collection
	 * browser_, for example files like `README.md` or `package.json`. CloudCannon excludes these
	 * files even if you have configured globs to allow them.
	 *
	 * Setting this key to `true` will allow CloudCannon to show developer files, assuming they are
	 * not filtered out by any configured globs.
	 *
	 * By default, this key is `false` (i.e., do not include developer files).
	 *
	 * https://cloudcannon.com/documentation/articles/collections-reference/#include_developer_files
	 *
	 * @default false
	 */
	include_developer_files?: boolean;
	/**
	 * This key defines the display name for a Collection. The name appears in the _Site Navigation_
	 * and at the top of the _Collection browser_. Changing the display name does not affect the
	 * Collection key name.
	 *
	 * By default, CloudCannon uses the Collection key name in title case (i.e., `blog_files` becomes
	 * "Blog Files").
	 *
	 * https://cloudcannon.com/documentation/articles/collections-reference/#name
	 */
	name?: string;
	/**
	 * This key defines the description text that appears on the _Collection browser_ page. Collection
	 * descriptions are useful for adding extra context for your team members.
	 *
	 * CloudCannon supports a limited selection of Markdown formatting for the value of this key:
	 * links, bold, italic, subscript, superscript, and inline code.
	 *
	 * This key has no default.
	 *
	 * https://cloudcannon.com/documentation/articles/collections-reference/#description
	 */
	description?: string;
	/**
	 * This key defines the icon for a Collection. Collection icons appear in the _Site Navigation_
	 * and are the default icon for Collection file Cards if you have not defined `preview.icon`.
	 *
	 * For more information about the preview icon, please read our documentation on the
	 * [`preview`](https://cloudcannon.com/documentation/articles/configure-your-card-previews/) key.
	 *
	 * Values are from [Google's Material
	 * Symbols](https://fonts.google.com/icons?icon.set=Material+Symbols&icon.style=Rounded).
	 *
	 * By default, CloudCannon uses `notes` with some exceptions (e.g., `data_usage` for the `data`
	 * Collection).
	 *
	 * https://cloudcannon.com/documentation/articles/collections-reference/#icon
	 *
	 * @default notes
	 */
	icon?: Icon;
	/**
	 * This key defines the documentation link at the top of a _Collection browser_. Collection
	 * documentation is useful for assisting your team members.
	 *
	 * The following nested keys are available:
	 *
	 * - `url` (required)
	 * - `text`
	 * - `icon`
	 *
	 * This key has no default.
	 *
	 * # Examples
	 *
	 * In this example, the documentation link for the `data` Collection goes to CloudCannon
	 * Documentation.
	 *
	 * ```yaml
	 * collections_config:
	 *   data:
	 *     documentation:
	 *       url: https://cloudcannon.com/documentation/
	 *       text: CloudCannon Documentation
	 *       icon: star
	 * ```
	 *
	 * https://cloudcannon.com/documentation/articles/collections-reference/#documentation
	 */
	documentation?: Documentation;
	/**
	 * This key defines how CloudCannon sorts your Collection files when you first open your
	 * _Collection browser_. Configuring this key allows you to sort your Collection using a
	 * structured data key in your files.
	 *
	 * The following nested keys are available:
	 *
	 * - `key` (required)
	 * - `order`
	 *
	 * By default, CloudCannon sorts your Collection files alphabetically by filename in ascending
	 * order by default. However, if you have configured the
	 * [`sort_options`](https://cloudcannon.com/documentation/articles/collections-reference/#sort_options)
	 * key, CloudCannon will use the first array item in `sort_options`.
	 *
	 * If you use the _Sort_ dropdown in your _Collection browser_ to order your Collection files,
	 * CloudCannon will preferentially use your most recent sorting method over the value configured
	 * in the `sort` key.
	 *
	 * https://cloudcannon.com/documentation/articles/collections-reference/#sort
	 */
	sort?: Sort;
	/**
	 * This key defines the options for the Sort dropdown in a _Collection browser_. Configuring sort
	 * options for a Collection will remove CloudCannon's default sorting options from the _Sort_
	 * dropdown.
	 *
	 * The following nested keys are available for each entry in the `sort_options` array:
	 *
	 * - `key` (required)
	 * - `order`
	 * - `label`
	 *
	 * By default, CloudCannon provides sorting options for path, file size, file creation time, and
	 * last modified, in ascending and descending order. CloudCannon will also read data keys from
	 * your early Collection files and provide options to sort by those key values.
	 *
	 * https://cloudcannon.com/documentation/articles/collections-reference/#sort_options
	 */
	sort_options?: SortOption[];
	/**
	 * This key defines the singular noun for your Collection name. CloudCannon uses the singular noun
	 * in the _+ Add_ button in the top right of the _Collection browser_ when you select the option
	 * to add a new file. This is useful if your Collection name is an irregular plural (e.g.,
	 * "syllabi" or "syllabuses" to "syllabus").
	 *
	 * By default, CloudCannon creates a singular noun from the key, usually by removing the `s`
	 * character (e.g., "posts" to "post").
	 *
	 * This key has no default.
	 *
	 * https://cloudcannon.com/documentation/articles/collections-reference/#singular_name
	 */
	singular_name?: string;
	/**
	 * This key defines the options available in the _+ Add_ button dropdown at the top right of your
	 * _Collection browser_. Configuring add options for a Collection will remove CloudCannon's
	 * default "Add a file" option from the _+ Add_ button dropdown.
	 *
	 * The following nested keys are available for each standard entry in `add_options`:
	 *
	 * - `name`
	 * - `icon`
	 * - `editor`
	 * - `base_path`
	 * - `collection`
	 * - `schema`
	 * - `default_content_file`
	 *
	 * The following nested keys are available for each URL entry in `add_options`:
	 *
	 * - `name`
	 * - `icon`
	 * - `href`
	 *
	 * By default, CloudCannon adds the "Add a file" and "Create new folder" options to the _+ Add_
	 * dropdown. Additionally, any Schemas you have configured for a Collection will also appear in
	 * the _+ Add_ dropdown. For more information on these options, please read our reference
	 * documentation on
	 * [`disable_add`](https://cloudcannon.com/documentation/articles/collections-reference/#disable_add),
	 * [`disable_add_folder`](https://cloudcannon.com/documentation/articles/collections-reference/#disable_add_folder),
	 * and [`schemas`](https://cloudcannon.com/documentation/articles/schemas-reference/#schemas).
	 *
	 * # Examples
	 *
	 * In this example, we want team members in the `_posts` Collection to create new files in the
	 * `blog` subfolder of the `_drafts` Collection. CloudCannon will open these files in the [Content
	 * Editor](https://cloudcannon.com/documentation/articles/the-content-editor/).
	 *
	 * ```yaml
	 * collections_config:
	 *   _posts:
	 *     add_options:
	 *       - name: Add draft blog
	 *         icon: post_add
	 *         editor: content
	 *         base_path: /../_drafts/blog
	 * ```
	 *
	 * In this example, the _+ Add_ button dropdown in the team _Collection browser_ has a link to the
	 * Office Locations page on our live website.
	 *
	 * ```yaml
	 * collections_config:
	 *   team:
	 *     add_options:
	 *       - name: Office Locations
	 *         icon: map
	 *         href: /our-offices
	 * ```
	 *
	 * https://cloudcannon.com/documentation/articles/collections-reference/#add_options
	 */
	add_options?: (AddOption | HrefAddOption)[];
	/**
	 * This key defines the path to which CloudCannon will save new files in a Collection. CloudCannon
	 * generates "Create Paths" when you open the _Review changes_ modal.
	 *
	 * The following nested keys are available:
	 *
	 * - `path` (required)
	 * - `extra_data`
	 * - `publish_to`
	 * - `_inputs`
	 * - `_select_data`
	 * - `_structures`
	 *
	 * This key has no default.
	 *
	 * For more information, please read our documentation on [Create
	 * Paths](https://cloudcannon.com/documentation/articles/set-the-path-for-new-files/).
	 *
	 * # Examples
	 *
	 * In this example, CloudCannon will generate a Create Path for new files in the `blog` Collection
	 * using the `date` and `title` structured data keys. For example, CloudCannon will generate a
	 * create path of `blog/2024-10-31-spooky-getaway.md` for a file with the date 31st October 2024
	 * and the title "Spooky Getaway".
	 *
	 * ```yaml
	 * collections_config:
	 *   blog:
	 *     create:
	 *       extra_data:
	 *         filename: '{date|year}-{date|month}-{date|day}-{title}'
	 *       path: '[relative_base_path]/{filename|slugify}.[ext]'
	 * ```
	 *
	 * https://cloudcannon.com/documentation/articles/collections-reference/#create
	 */
	create?: Create;
	/**
	 * This key toggles whether team members can use the _+ Add_ button in the top right of the
	 * _Collection browser_ to add files to a Collection. This key does not affect your ability to add
	 * files using the _File browser_.
	 *
	 * Setting this key to `true` will prevent team members from adding new files through the
	 * _Collection browser_.
	 *
	 * By default, this key is `false` (i.e., team members can add to the Collection) for most SSGs.
	 * For Eleventy, Hugo, and Jekyll, this key defaults to `true` for the data Collection (all
	 * subfolders in the `data` folder are non-output Collections).
	 *
	 * If both `disable_add` and `disable_add_folder` are set to `true`, and you have not defined any
	 * other `add_options`, then the _+ Add_ button will not appear in the top right of the
	 * _Collection browser_.
	 *
	 * https://cloudcannon.com/documentation/articles/collections-reference/#disable_add
	 */
	disable_add?: boolean;
	/**
	 * This key toggles whether team members can use the _+ Add_ button in the top right of the
	 * _Collection browser_ to add subfolders to a Collection. This key does not affect your ability
	 * to add subfolders using the _File browser_.
	 *
	 * Setting this key to `true` will prevent team members from adding new subfolders through the
	 * _Collection browser_.
	 *
	 * By default, this key is `false` (i.e., team members can add folders to the Collection) for most
	 * SSGs. For Eleventy, Hugo, and Jekyll, this key defaults to `true` for the `data` Collection
	 * (all subfolders in the `data` folder are non-output Collections).
	 *
	 * If both `disable_add` and `disable_add_folder` are set to `true`, and you have not defined any
	 * other `add_options`, then the _+ Add_ button will not appear in the top right of the
	 * _Collection browser_.
	 *
	 * https://cloudcannon.com/documentation/articles/collections-reference/#disable_add_folder
	 */
	disable_add_folder?: boolean;
	/**
	 * This key toggles whether team members can use the _+ Add_ button in the top right of the
	 * _Collection browser_ to add files to a Collection. This key does not affect your ability to add
	 * files using the _File browser_.
	 *
	 * Setting this key to `true` will prevent team members from adding new files through the
	 * _Collection browser_.
	 *
	 * By default, this key is `false` (i.e., team members can add to the Collection) for most SSGs.
	 * For Eleventy, Hugo, and Jekyll, this key defaults to `true` for the `data` Collection (all
	 * subfolders in the `data` folder are non-output Collections).
	 *
	 * If both `disable_add` and `disable_add_folder` are set to `true`, and you have not defined any
	 * other `add_options`, then the _+ Add_ button will not appear in the top right of the
	 * _Collection browser_.
	 *
	 * https://cloudcannon.com/documentation/articles/collections-reference/#disable_file_actions
	 */
	disable_file_actions?: boolean;
	/**
	 * This key defines a new URL for previewing your unbuilt pages in the [Visual
	 * Editor](https://cloudcannon.com/documentation/articles/the-visual-editor/). The Visual Editor
	 * will load the new preview URL and use Data Bindings and Previews to render your page without
	 * saving or building.
	 *
	 * This key does not affect the URL for your [Testing
	 * Domain](https://cloudcannon.com/documentation/articles/testing-domain/) or [Custom
	 * Domain](https://cloudcannon.com/documentation/articles/what-is-a-custom-domain/).
	 *
	 * This key has no default.
	 *
	 * https://cloudcannon.com/documentation/articles/collections-reference/#new_preview_url
	 */
	new_preview_url?: string;
	/**
	 * This key defines which Schemas are available to populate files in this Collection. Defining a
	 * Schema for a collection will add it to the _+ Add_ button dropdown at the top right of the
	 * _Collection browser_.
	 *
	 * The following nested keys are available for each Schema insdie schemas:
	 *
	 * - `path`
	 * - `reorder_input`
	 * - `hide_extra_inputs`
	 * - `remove_empty_inputs`
	 * - `remove_extra_inputs`
	 * - `name`
	 * - `icon`
	 * - `preview`
	 * - `_editables`
	 * - `_enabled_editors`
	 * - `_inputs`
	 * - `_select_data`
	 * - `_structures`
	 * - `create`
	 * - `new_preview_url`
	 *
	 * This key has no default. If undefined, clicking the _+ Add_ button to add a new file to a
	 * Collection will clone the last file in the Collection and clear any markup content and the
	 * values of any structured data keys.
	 *
	 * For more information, please read our documentation on
	 * [Schemas](https://cloudcannon.com/documentation/articles/what-is-a-schema/).
	 *
	 * https://cloudcannon.com/documentation/articles/collections-reference/#schemas
	 */
	schemas?: Record<string, Schema>;
	/**
	 * This key defines the name for the structured data key that references the Schema a file uses.
	 * CloudCannon automatically adds this key to the top of your file when you create it using a
	 * Schema.
	 *
	 * Values which beginning with the `_` character are hidden from the Data Editor and the sidebar
	 * of the Content and Visual Editors.
	 *
	 * By default, this key is `_schema`.
	 *
	 * https://cloudcannon.com/documentation/articles/collections-reference/#schema_key
	 */
	schema_key?: string;
}

export interface CollectionGroup {
	/**
	 * Short, descriptive label for this group of collections.
	 */
	heading: string;
	/**
	 * The collections shown in the sidebar for this group. Collections here are referenced by their
	 * key within `collections_config`.
	 */
	collections: string[];
}

export interface DataConfigEntry {
	/**
	 * The path to a file or folder of files containing data.
	 */
	path: string;
}

export interface FileConfigEntry extends Cascade {
	/**
	 * The glob pattern(s) targeting a path to one or more files.
	 */
	glob: string[] | string;
}

export interface Editor {
	/**
	 * The URL used for the dashboard screenshot, and where the editor opens to when clicking the
	 * dashboard "Edit Home" button.
	 *
	 * @default /
	 */
	default_path: string;
}

export interface CommitTemplate {
	/**
	 * Used to identify a commit template when multiple commit templates are available.
	 */
	label?: string;
	/**
	 * Set the string for the commit template. This will only be used if `template_path` is not set.
	 */
	template_string?: string;
	/**
	 * Sets the path for a file containing your commit template. The file path should be relative to
	 * the root directory.
	 */
	template_path?: string;
	/**
	 * Define inputs used to populate data placeholders in the commit template.
	 */
	_inputs?: Record<string, Input>;
	/**
	 * Define additional template strings, for building nested templates.
	 */
	extra_data?: Record<string, string>;
	/**
	 * Sets the width of the text wrap in the editor.
	 */
	wrap_width?: number;
}

/**
 * The base format for the configuration file.
 */
export interface Configuration extends Cascade, WithPaths {
	/**
	 * Controls which schema this file is validated against. Defaults to the latest schema.
	 */
	version?: 'latest';
	/**
	 * This key defines the base path for your source files, relative to the root folder of your
	 * repository. Unless you use a nested folder as the source for your Site you can leave this key
	 * empty or set it to `/`.
	 *
	 * By default, this key is empty.
	 *
	 * https://cloudcannon.com/documentation/articles/configuration-file-reference/#source
	 */
	source?: string;
	/**
	 * Definitions for your collections, which are the sets of content files for your site grouped by
	 * folder. Entries are keyed by a chosen collection key, and contain configuration specific to
	 * that collection.
	 *
	 * https://cloudcannon.com/documentation/articles/configuration-file-reference/#collections_config
	 */
	collections_config?: Record<string, CollectionConfig>;
	/**
	 * Defines which collections are shown in the site navigation and how those collections are
	 * grouped.
	 *
	 * https://cloudcannon.com/documentation/articles/configuration-file-reference/#collections_groups
	 */
	collection_groups?: CollectionGroup[];
	/**
	 * The subpath where your output files are hosted.
	 *
	 * https://cloudcannon.com/documentation/articles/configuration-file-reference/#base_url
	 */
	base_url?: string;
	/**
	 * Controls what data sets are available to populate select and multiselect inputs.
	 *
	 * https://cloudcannon.com/documentation/articles/configuration-file-reference/#data_config
	 */
	data_config?: Record<string, DataConfigEntry>;
	/**
	 * Provides scope to configure at a file level, without adding configuration to files.
	 *
	 * https://cloudcannon.com/documentation/articles/configuration-file-reference/#file_config
	 */
	file_config?: FileConfigEntry[];
	/**
	 * Contains settings for the default editor actions on your site.
	 *
	 * https://cloudcannon.com/documentation/articles/configuration-file-reference/#editor.default_path
	 */
	editor?: Editor;
	/**
	 * This key defines the appearance and behavior of the Source Editor. The following nested keys
	 * are available:
	 *
	 * - `tab_size`
	 * - `show_gutter`
	 * - `theme`
	 *
	 * This key has no default.
	 *
	 * For more information, please read our documentation on the [Source
	 * Editor](https://cloudcannon.com/documentation/articles/the-source-editor/).
	 *
	 * https://cloudcannon.com/documentation/articles/configuration-file-reference/#source_editor
	 */
	source_editor?: SourceEditor;
	/**
	 * Templates for commit messages when saving changes.
	 *
	 * https://cloudcannon.com/documentation/articles/configuration-file-reference/#commit_templates
	 */
	commit_templates?: CommitTemplate[];

	/**
	 * The commit template to use when pulling changes from the upstream repository.
	 *
	 * https://cloudcannon.com/documentation/articles/configure-an-upstream-commit-message-template/
	 */
	upstream_commit_template?: string;
	/**
	 * Contains settings for various Markdown engines.
	 *
	 * https://cloudcannon.com/documentation/articles/configuration-file-reference/#markdown
	 */
	markdown?: MarkdownSettings;
	/**
	 * Specifies the time zone that dates are displayed and edited in. Also changes the suffix the
	 * date is persisted to the file with.
	 *
	 * https://cloudcannon.com/documentation/articles/configuration-file-reference/#timezone
	 *
	 * @default Etc/UTC
	 */
	timezone?: Timezone;
	/**
	 * Configuration for custom snippets.
	 *
	 * https://cloudcannon.com/documentation/articles/configuration-file-reference/#_snippets
	 */
	_snippets?: Record<string, SnippetConfig>;
	/**
	 * Provides control over which snippets are available to use and/or extend within `_snippets`.
	 *
	 * https://cloudcannon.com/documentation/articles/configuration-file-reference/#_snippets_imports
	 */
	_snippets_imports?: SnippetsImports;
	/**
	 * Extended option used when creating more complex custom snippets.
	 *
	 * https://cloudcannon.com/documentation/articles/configuration-file-reference/#_snippets_templates
	 */
	_snippets_templates?: Record<string, SnippetConfig>;
	/**
	 * Extended option used when creating more complex custom snippets.
	 *
	 * https://cloudcannon.com/documentation/articles/configuration-file-reference/#_snippets_definitions
	 */
	_snippets_definitions?: Record<string, SnippetConfig>;
}
