import * as z from 'zod/v4';
import { CascadeSchema, EditorKeySchema, ReducedCascadeSchema } from './cascade.ts';
import { DocumentationSchema } from './documentation.ts';
import { IconSchema } from './icon.ts';
import { InputSchema } from './inputs.ts';
import { MarkdownSettingsSchema } from './markdown.ts';
import { WithPathsSchema } from './paths.ts';
import { WithPreviewSchema } from './preview.ts';
import { SnippetConfigSchema } from './snippets.ts';
import { SnippetsImportsSchema } from './snippets.ts';
import { SourceEditorSchema } from './source-editor.ts';
import { TimezoneSchema } from './timezone.ts';

export const HrefAddOptionSchema = z.object({
	name: z.string().optional().describe('The text displayed for the menu item.'),

	icon: IconSchema.default('add')
		.optional()
		.describe('The icon next to the text in the menu item.'),

	href: z
		.string()
		.describe(
			'The link that opens when the option is clicked. Can either be an external or internal link. If internal, the link is relative to the current site.'
		),
});

export const AddOptionSchema = z.object({
	name: z
		.string()
		.optional()
		.describe(
			'The text displayed for the menu item. Defaults to using name from the matching schema if set.'
		),

	icon: IconSchema.optional().describe(
		'The icon next to the text in the menu item. Defaults to using icon from the matching schema if set, then falls back to add.'
	),

	editor: EditorKeySchema.optional().describe(
		"The editor to open the new file in. Defaults to an appropriate editor for new file's type if possible. If no default editor can be calculated, or the editor does not support the new file type, a warning is shown in place of the editor."
	),

	base_path: z
		.string()
		.optional()
		.describe(
			'Enforces a path for new files to be created in, regardless of path the user is currently navigated to within the collection file list. Relative to the path of the collection defined in collection. Defaults to the path within the collection the user is currently navigated to.'
		),

	collection: z
		.string()
		.optional()
		.describe(
			'Sets which collection this action is creating a file in. This is used when matching the value for schema. Defaults to the containing collection these `add_options` are configured in.'
		),

	schema: z
		.string()
		.optional()
		.describe(
			'The schema that new files are created from with this action. This schema is not restricted to the containing collection, and is instead relative to the collection specified with collection. Defaults to default if schemas are configured for the collection.'
		),

	default_content_file: z
		.string()
		.optional()
		.describe(
			'The path to a file used to populate the initial contents of a new file if no schemas are configured. We recommend using schemas, and this is ignored if a schema is available.'
		),
});

export const SortOrderSchema = z.enum(['ascending', 'descending', 'asc', 'desc']);

export const SortSchema = z.object({
	key: z
		.string()
		.describe(
			"Defines what field contains the value to sort on inside each collection item's data."
		),

	order: SortOrderSchema.default('ascending')
		.optional()
		.describe('Controls which sort values come first.'),
});

export const SortOptionSchema = SortSchema.extend({
	label: z
		.string()
		.optional()
		.describe(
			'The text to display in the sort option list. Defaults to a generated label from key and order.'
		),
});

export const CreateSchema = z.object({
	...ReducedCascadeSchema.shape,
	path: z
		.string()
		.optional()
		.describe(
			"The raw template to be processed when creating files. Relative to the containing collection's path."
		),

	extra_data: z
		.record(z.string(), z.string())
		.optional()
		.describe(
			'Adds to the available data placeholders coming from the file. Entry values follow the same format as path, and are processed sequentially before path. These values are not saved back to your file.'
		),

	publish_to: z
		.string()
		.optional()
		.describe(
			"Defines a target collection when publishing. When a file is published, the target collection's create definition is used instead."
		),
});

export const SchemaSchema = z.object({
	...CascadeSchema.shape,
	...WithPreviewSchema.shape,
	path: z
		.string()
		.describe('The path to the schema file. Relative to the root folder of the site.'),

	name: z
		.string()
		.optional()
		.describe(
			'Displayed in the add menu when creating new files. Defaults to a formatted version of the key.'
		),

	icon: IconSchema.default('notes')
		.optional()
		.describe(
			'Displayed in the add menu when creating new files; also used as the icon for collection files if no other preview is found. Defaults to notes.'
		),

	create: CreateSchema.optional().describe('Controls where new files are saved.'),

	new_preview_url: z
		.string()
		.optional()
		.describe(
			"Preview your unbuilt pages (e.g. drafts) to another page's output URL. The Visual Editor will load that URL, where Data Bindings and Previews are available to render your new page without saving."
		),
});

export const CollectionConfigSchema = z.object({
	...CascadeSchema.shape,
	...WithPreviewSchema.shape,

	path: z
		.string()
		.describe(
			'This key defines the folder path for the collection key in which it is nested. The value for this key is relative to your Site `source`. Each Collection must have a unique path.'
		),

	glob: z
		.union([z.array(z.string()), z.string()])
		.optional()
		.describe(
			'This key defines globs which filter the files visible in the _Collection browser_ for a given Collection. Values in this array are relative to the Collection `path`.'
		),

	url: z
		.string()
		.optional()
		.describe(
			'This key defines the output URL for files in a given Collection. CloudCannon uses the output URL in the Visual Editor, and when linking to your Testing Domain and Custom Domain.'
		),

	disable_url: z
		.boolean()
		.optional()
		.describe(
			'This key toggles whether CloudCannon will generate an output URL for a given Collection.'
		),

	include_developer_files: z
		.boolean()
		.default(false)
		.optional()
		.describe(
			'This key toggles whether CloudCannon removes developer files from your _Collection browser_.'
		),

	name: z
		.string()
		.optional()
		.describe(
			'This key defines the display name for a Collection. The name appears in the _Site Navigation_ and at the top of the _Collection browser_.'
		),

	description: z
		.string()
		.optional()
		.describe(
			'This key defines the description text that appears on the _Collection browser_ page. Collection descriptions are useful for adding extra context for your team members.'
		),

	icon: IconSchema.default('notes')
		.optional()
		.describe(
			'This key defines the icon for a Collection. Collection icons appear in the _Site Navigation_ and are the default icon for Collection file Cards if you have not defined `preview.icon`.'
		),

	documentation: DocumentationSchema.optional().describe(
		'This key defines the documentation link at the top of a _Collection browser_. Collection documentation is useful for assisting your team members.'
	),

	sort: SortSchema.optional().describe(
		'This key defines how CloudCannon sorts your Collection files when you first open your _Collection browser_.'
	),

	sort_options: z
		.array(SortOptionSchema)
		.optional()
		.describe('This key defines the options for the Sort dropdown in a _Collection browser_.'),

	singular_name: z
		.string()
		.optional()
		.describe(
			'This key defines the singular noun for your Collection name. CloudCannon uses the singular noun in the _+ Add_ button in the top right of the _Collection browser_.'
		),

	add_options: z
		.array(z.union([AddOptionSchema, HrefAddOptionSchema]))
		.optional()
		.describe(
			'This key defines the options available in the _+ Add_ button dropdown at the top right of your _Collection browser_.'
		),

	create: CreateSchema.optional().describe(
		'This key defines the path to which CloudCannon will save new files in a Collection.'
	),

	disable_add: z
		.boolean()
		.optional()
		.describe(
			'This key toggles whether team members can use the _+ Add_ button in the top right of the _Collection browser_ to add files to a Collection.'
		),

	disable_add_folder: z
		.boolean()
		.optional()
		.describe(
			'This key toggles whether team members can use the _+ Add_ button in the top right of the _Collection browser_ to add subfolders to a Collection.'
		),

	disable_file_actions: z
		.boolean()
		.optional()
		.describe(
			'This key toggles whether team members can use the _+ Add_ button in the top right of the _Collection browser_ to add files to a Collection.'
		),

	new_preview_url: z
		.string()
		.optional()
		.describe('This key defines a new URL for previewing your unbuilt pages in the Visual Editor.'),

	schemas: z
		.record(z.string(), SchemaSchema)
		.optional()
		.describe('This key defines which Schemas are available to populate files in this Collection.'),

	schema_key: z
		.string()
		.optional()
		.describe(
			'This key defines the name for the structured data key that references the Schema a file uses.'
		),
});

export const CollectionGroupSchema = z.object({
	heading: z.string().describe('Short, descriptive label for this group of collections.'),

	collections: z
		.array(z.string())
		.describe(
			'The collections shown in the sidebar for this group. Collections here are referenced by their key within `collections_config`.'
		),
});

export const DataConfigEntrySchema = z.object({
	path: z.string().describe('The path to a file or folder of files containing data.'),
});

export const FileConfigEntrySchema = z.object({
	...CascadeSchema.shape,
	glob: z
		.union([z.array(z.string()), z.string()])
		.describe('The glob pattern(s) targeting a path to one or more files.'),
});

export const EditorSchema = z.object({
	default_path: z
		.string()
		.default('/')
		.describe(
			'The URL used for the dashboard screenshot, and where the editor opens to when clicking the dashboard "Edit Home" button.'
		),
});

export const CommitTemplateSchema = z.object({
	label: z
		.string()
		.optional()
		.describe('Used to identify a commit template when multiple commit templates are available.'),

	template_string: z
		.string()
		.optional()
		.describe(
			'Set the string for the commit template. This will only be used if `template_path` is not set.'
		),

	template_path: z
		.string()
		.optional()
		.describe(
			'Sets the path for a file containing your commit template. The file path should be relative to the root directory.'
		),

	_inputs: z
		.record(z.string(), InputSchema)
		.optional()
		.describe('Define inputs used to populate data placeholders in the commit template.'),

	extra_data: z
		.record(z.string(), z.string())
		.optional()
		.describe('Define additional template strings, for building nested templates.'),

	wrap_width: z.number().optional().describe('Sets the width of the text wrap in the editor.'),
});

export const ConfigurationSchema = z.object({
	...CascadeSchema.shape,
	...WithPathsSchema.shape,

	version: z
		.literal('latest')
		.optional()
		.describe(
			'Controls which schema this file is validated against. Defaults to the latest schema.'
		),

	source: z
		.string()
		.optional()
		.describe(
			'This key defines the base path for your source files, relative to the root folder of your repository.'
		),

	collections_config: z
		.record(z.string(), CollectionConfigSchema)
		.optional()
		.describe(
			'Definitions for your collections, which are the sets of content files for your site grouped by folder.'
		),

	collection_groups: z
		.array(CollectionGroupSchema)
		.optional()
		.describe(
			'Defines which collections are shown in the site navigation and how those collections are grouped.'
		),

	base_url: z.string().optional().describe('The subpath where your output files are hosted.'),

	data_config: z
		.record(z.string(), DataConfigEntrySchema)
		.optional()
		.describe('Controls what data sets are available to populate select and multiselect inputs.'),

	file_config: z
		.array(FileConfigEntrySchema)
		.optional()
		.describe(
			'Provides scope to configure at a file level, without adding configuration to files.'
		),

	editor: EditorSchema.optional().describe(
		'Contains settings for the default editor actions on your site.'
	),

	source_editor: SourceEditorSchema.optional().describe(
		'This key defines the appearance and behavior of the Source Editor.'
	),

	commit_templates: z
		.array(CommitTemplateSchema)
		.optional()
		.describe('Templates for commit messages when saving changes.'),

	upstream_commit_template: z
		.string()
		.optional()
		.describe('The commit template to use when pulling changes from the upstream repository.'),

	markdown: MarkdownSettingsSchema.optional().describe(
		'Contains settings for various Markdown engines.'
	),

	timezone: TimezoneSchema.default('Etc/UTC')
		.optional()
		.describe('Specifies the time zone that dates are displayed and edited in.'),

	_snippets: z
		.record(z.string(), SnippetConfigSchema)
		.optional()
		.describe('Configuration for custom snippets.'),

	_snippets_imports: SnippetsImportsSchema.optional().describe(
		'Provides control over which snippets are available to use and/or extend within `_snippets`.'
	),

	_snippets_templates: z
		.record(z.string(), SnippetConfigSchema)
		.optional()
		.describe('Extended option used when creating more complex custom snippets.'),

	_snippets_definitions: z
		.record(z.string(), SnippetConfigSchema)
		.optional()
		.describe('Extended option used when creating more complex custom snippets.'),
});

export type HrefAddOption = z.infer<typeof HrefAddOptionSchema>;
export type AddOption = z.infer<typeof AddOptionSchema>;
export type SortOrder = z.infer<typeof SortOrderSchema>;
export type Sort = z.infer<typeof SortSchema>;
export type SortOption = z.infer<typeof SortOptionSchema>;
export type Create = z.infer<typeof CreateSchema>;
export type Schema = z.infer<typeof SchemaSchema>;
export type CollectionConfig = z.infer<typeof CollectionConfigSchema>;
export type CollectionGroup = z.infer<typeof CollectionGroupSchema>;
export type DataConfigEntry = z.infer<typeof DataConfigEntrySchema>;
export type FileConfigEntry = z.infer<typeof FileConfigEntrySchema>;
export type Editor = z.infer<typeof EditorSchema>;
export type CommitTemplate = z.infer<typeof CommitTemplateSchema>;
export type Configuration = z.infer<typeof ConfigurationSchema>;
