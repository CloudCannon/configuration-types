import * as z from 'zod';
import { CascadeSchema, EditorKeySchema, ReducedCascadeSchema } from './cascade';
import { DocumentationSchema } from './documentation';
import { IconSchema } from './icon';
import { InputSchema } from './inputs';
import { MarkdownSettingsSchema } from './markdown';
import { PathsSchema } from './paths';
import { PreviewSchema } from './preview';
import { SnippetConfigSchema } from './snippets';
import { SnippetsImportsSchema } from './snippets';
import { SourceEditorSchema } from './source-editor';
import { TimezoneSchema } from './timezone';

export const HrefAddOptionSchema = z
	.object({
		name: z.string().optional().meta({
			description: 'The text displayed for the menu item.',
		}),
		icon: IconSchema.default('add').optional().meta({
			description: 'The icon next to the text in the menu item.',
		}),
		href: z.string().meta({
			description:
				'The link that opens when the option is clicked. Can either be an external or internal link. If internal, the link is relative to the current site.',
		}),
	})
	.meta({
		title: 'HREF Add Option',
		description: 'An option for the add menu that opens a link.',
	});

export const AddOptionSchema = z
	.object({
		name: z.string().optional().meta({
			description:
				'The text displayed for the menu item. Defaults to using name from the matching schema if set.',
		}),
		icon: IconSchema.optional().meta({
			description:
				'The icon next to the text in the menu item. Defaults to using icon from the matching schema if set, then falls back to add.',
		}),
		editor: EditorKeySchema.optional().meta({
			description:
				"The editor to open the new file in. Defaults to an appropriate editor for new file's type if possible. If no default editor can be calculated, or the editor does not support the new file type, a warning is shown in place of the editor.",
		}),
		base_path: z.string().optional().meta({
			description:
				'Enforces a path for new files to be created in, regardless of path the user is currently navigated to within the collection file list. Relative to the path of the collection defined in collection. Defaults to the path within the collection the user is currently navigated to.',
		}),
		collection: z.string().optional().meta({
			description:
				'Sets which collection this action is creating a file in. This is used when matching the value for schema. Defaults to the containing collection these `add_options` are configured in.',
		}),
		schema: z.string().optional().meta({
			description:
				'The schema that new files are created from with this action. This schema is not restricted to the containing collection, and is instead relative to the collection specified with collection. Defaults to default if schemas are configured for the collection.',
		}),
		default_content_file: z.string().optional().meta({
			description:
				'The path to a file used to populate the initial contents of a new file if no schemas are configured. We recommend using schemas, and this is ignored if a schema is available.',
		}),
	})
	.meta({
		title: 'Add Option',
		description: 'An option for the add menu.',
	});

export const SortSchema = z
	.object({
		key: z.string().meta({
			description:
				"Defines what field contains the value to sort on inside each collection item's data.",
		}),
		order: z.enum(['ascending', 'descending', 'asc', 'desc']).default('ascending').optional().meta({
			description: 'Controls which sort values come first.',
		}),
	})
	.meta({
		title: 'Sort',
		description: 'A sort for a Collection.',
	});

export const SortOptionSchema = z
	.object({
		...SortSchema.shape,
		label: z.string().optional().meta({
			description:
				'The text to display in the sort option list. Defaults to a generated label from key and order.',
		}),
	})
	.meta({
		title: 'SortOption',
		description: 'A sort option for a Collection.',
	});

export const CreateSchema = z
	.object({
		...ReducedCascadeSchema.shape,
		path: z.string().optional().meta({
			description:
				"The raw template to be processed when creating files. Relative to the containing collection's path.",
		}),
		extra_data: z.record(z.string(), z.string()).optional().meta({
			description:
				'Adds to the available data placeholders coming from the file. Entry values follow the same format as path, and are processed sequentially before path. These values are not saved back to your file.',
		}),
		publish_to: z.string().optional().meta({
			description:
				"Defines a target collection when publishing. When a file is published, the target collection's create definition is used instead.",
		}),
	})
	.meta({
		id: 'create',
		title: 'Create',
		description: 'Controls where new files are saved.',
	});

export const SchemaSchema = z
	.object({
		...CascadeSchema.shape,
		preview: PreviewSchema.optional(),
		path: z.string().meta({
			description: 'The path to the schema file. Relative to the root folder of the site.',
		}),
		name: z.string().optional().meta({
			description:
				'Displayed in the add menu when creating new files. Defaults to a formatted version of the key.',
		}),
		icon: IconSchema.default('notes').optional().meta({
			description:
				'Displayed in the add menu when creating new files; also used as the icon for collection files if no other preview is found. Defaults to notes.',
		}),
		create: CreateSchema.optional(),
		new_preview_url: z.string().optional().meta({
			description:
				"Preview your unbuilt pages (e.g. drafts) to another page's output URL. The Visual Editor will load that URL, where Data Bindings and Previews are available to render your new page without saving.",
		}),
		reorder_inputs: z.boolean().default(true).optional().meta({
			description:
				'If true, inputs are sorted to match when editing. Extra inputs are ordered after expected inputs, unless `remove_extra_inputs` is true. Defaults to true.',
		}),
		hide_extra_inputs: z.boolean().default(false).optional().meta({
			description:
				'Hides unexpected inputs when editing. Has no effect if `remove_extra_inputs` is true. Defaults to false.',
		}),
		remove_empty_inputs: z.boolean().default(false).optional().meta({
			description:
				'If checked, empty inputs are removed from the source file on save. Removed inputs will be available for editing again, provided they are in the matching schema/structure. Defaults to false.',
		}),
		remove_extra_inputs: z.boolean().default(true).optional().meta({
			description: 'If checked, extra inputs are removed when editing. Defaults to true.',
		}),
	})
	.meta({
		title: 'Schema',
		description:
			'Definitions for your schemas, which are the structured data formats for your content files.',
	});

export const CollectionConfigSchema = z
	.object({
		...CascadeSchema.shape,
		preview: PreviewSchema.optional(),
		path: z.string().meta({
			id: 'path',
			description:
				'This key defines the folder path for the collection key in which it is nested. The value for this key is relative to your Site `source`. Each Collection must have a unique path.',
		}),
		glob: z
			.union([z.array(z.string()), z.string()])
			.optional()
			.meta({
				id: 'glob',
				description:
					'This key defines globs which filter the files visible in the _Collection browser_ for a given Collection. Values in this array are relative to the Collection `path`.',
			}),
		url: z.string().optional().meta({
			description:
				'This key defines the output URL for files in a given Collection. CloudCannon uses the output URL in the Visual Editor, and when linking to your Testing Domain and Custom Domain.',
		}),
		disable_url: z.boolean().default(false).optional().meta({
			description:
				'This key toggles whether CloudCannon will generate an output URL for a given Collection.',
		}),
		include_developer_files: z.boolean().default(false).optional().meta({
			description:
				'This key toggles whether CloudCannon removes developer files from your _Collection browser_.',
		}),
		name: z.string().optional().meta({
			description:
				'This key defines the display name for a Collection. The name appears in the _Site Navigation_ and at the top of the _Collection browser_.',
		}),
		description: z.string().optional().meta({
			description:
				'This key defines the description text that appears on the _Collection browser_ page. Collection descriptions are useful for adding extra context for your team members.',
		}),
		icon: IconSchema.default('notes').optional().meta({
			description:
				'This key defines the icon for a Collection. Collection icons appear in the _Site Navigation_ and are the default icon for Collection file Cards if you have not defined `preview.icon`.',
		}),
		documentation: DocumentationSchema.optional().meta({
			description:
				'This key defines the documentation link at the top of a _Collection browser_. Collection documentation is useful for assisting your team members.',
		}),
		sort_options: z.array(SortOptionSchema).optional().meta({
			description:
				'This key defines the options for the Sort dropdown in a _Collection browser_. The first option listed is used as the default sort.',
		}),
		view_options: z
			.array(z.enum(['card', 'list', 'gallery']))
			.optional()
			.meta({
				uniqueItems: true,
				description:
					'This key defines the options for the View dropdown in a _Collection browser_. The first option listed is used as the default view.',
			}),
		singular_name: z.string().optional().meta({
			description:
				'This key defines the singular noun for your Collection name. CloudCannon uses the singular noun in the _+ Add_ button in the top right of the _Collection browser_.',
		}),
		add_options: z
			.array(z.union([AddOptionSchema, HrefAddOptionSchema]))
			.optional()
			.meta({
				description:
					'This key defines the options available in the _+ Add_ button dropdown at the top right of your _Collection browser_.',
			}),
		create: CreateSchema.optional(),
		disable_add: z.boolean().optional().meta({
			description:
				'This key toggles whether team members can use the _+ Add_ button in the top right of the _Collection browser_ to add files to a Collection.',
		}),
		disable_add_folder: z.boolean().optional().meta({
			description:
				'This key toggles whether team members can use the _+ Add_ button in the top right of the _Collection browser_ to add subfolders to a Collection.',
		}),
		disable_file_actions: z.boolean().optional().meta({
			description:
				'This key toggles whether team members can use the _+ Add_ button in the top right of the _Collection browser_ to add files to a Collection.',
		}),
		new_preview_url: z.string().optional().meta({
			description:
				'This key defines a new URL for previewing your unbuilt pages in the Visual Editor.',
		}),
		schemas: z.record(z.string(), SchemaSchema).optional().meta({
			description:
				'This key defines which Schemas are available to populate files in this Collection.',
		}),
		schema_key: z.string().optional().meta({
			description:
				'This key defines the name for the structured data key that references the Schema a file uses.',
		}),
	})
	.meta({
		title: 'CollectionConfig',
		description:
			'Definitions for your Collections, which are the sets of content files for your site grouped by folder.',
	});

export const CollectionGroupSchema = z
	.object({
		heading: z.string().meta({
			description: 'Short, descriptive label for this group of Collections.',
		}),
		collections: z.array(z.string()).meta({
			description:
				'The collections shown in the sidebar for this group. Collections here are referenced by their key within `collections_config`.',
		}),
	})
	.meta({
		title: 'Collection Group',
		description:
			'Defines which Collections are shown in the Site Navigation and how those Collections are grouped.',
	});

export const DataConfigEntrySchema = z
	.object({
		path: z.string().meta({
			id: 'DataConfigEntry.path',
			description: 'The path to a file or folder of files containing data.',
		}),
	})
	.meta({
		id: 'DataConfigEntry',
		title: 'Data Config Entry',
		description: 'Controls what data sets are available to populate select and multiselect inputs.',
	});

export const FileConfigEntrySchema = z
	.object({
		...CascadeSchema.shape,
		glob: z.union([z.array(z.string()), z.string()]).meta({
			description: 'The glob pattern(s) targeting a path to one or more files.',
		}),
	})
	.meta({
		title: 'FileConfigEntry',
		description:
			'Provides scope to configure at a file level, without adding configuration to files.',
	});

export const EditorSchema = z.object({
	default_path: z.string().default('/').meta({
		description:
			'The URL used for the dashboard screenshot, and where the editor opens to when clicking the dashboard "Edit Home" button.',
	}),
});

export const CommitTemplateSchema = z
	.object({
		label: z.string().optional().meta({
			description:
				'Used to identify a commit template when multiple commit templates are available.',
		}),
		template_string: z.string().optional().meta({
			description:
				'Set the string for the commit template. This will only be used if `template_path` is not set.',
		}),
		template_path: z.string().optional().meta({
			description:
				'Sets the path for a file containing your commit template. The file path should be relative to the root directory.',
		}),
		_inputs: z.record(z.string(), InputSchema).optional().meta({
			title: 'Inputs',
			description: 'Define inputs used to populate data placeholders in the commit template.',
		}),
		extra_data: z.record(z.string(), z.string()).optional().meta({
			description: 'Define additional template strings, for building nested templates.',
		}),
		wrap_width: z.number().optional().meta({
			description: 'Sets the width of the text wrap in the editor.',
		}),
	})
	.meta({
		title: 'Commit Template',
		description: 'A template for commit messages when saving changes.',
	});

export const PullRequestTemplateSchema = z.object({
	label: z.string().optional().meta({
		description:
			'Used to identify a pull request template when multiple pull request templates are available.',
	}),
	title: z.string().optional().meta({
		description: 'The default value for the pull request title.',
	}),
	body: z.string().optional().meta({
		description: 'The default value for the pull request body.',
	}),
	_inputs: z.record(z.string(), InputSchema).optional().meta({
		title: 'Inputs',
		description: 'Define inputs used for the title and body fields of the pull request.',
	}),
});

export const ConfigurationSchema = z
	.object({
		...CascadeSchema.shape,
		paths: PathsSchema.optional(),
		version: z.literal('latest').optional().meta({
			description:
				'Controls which schema this file is validated against. Defaults to the latest schema.',
		}),
		source: z
			.string()
			.optional()
			.meta({
				description: `This key defines the base path for your source files, relative to the root folder of your
repository. Unless you use a nested folder as the source for your Site you can leave this key
empty or set it to \`/\`.

By default, this key is empty.

https://cloudcannon.com/documentation/articles/configuration-file-reference/#source',`,
			}),
		collections_config: z.record(z.string(), CollectionConfigSchema).optional().meta({
			description:
				'Definitions for your collections, which are the sets of content files for your site grouped by folder.',
		}),
		collection_groups: z.array(CollectionGroupSchema).optional().meta({
			description:
				'Defines which collections are shown in the site navigation and how those collections are grouped.',
		}),
		base_url: z.string().optional().meta({
			description: 'The subpath where your output files are hosted.',
		}),
		data_config: z.record(z.string(), DataConfigEntrySchema).optional().meta({
			description:
				'Controls what data sets are available to populate select and multiselect inputs.',
		}),
		file_config: z.array(FileConfigEntrySchema).optional().meta({
			description:
				'Provides scope to configure at a file level, without adding configuration to files.',
		}),
		editor: EditorSchema.optional().meta({
			description: 'Contains settings for the default editor actions on your site.',
		}),
		source_editor: SourceEditorSchema.optional().meta({
			title: 'Source Editor',
			description:
				'This key defines the appearance and behavior of the Source Editor. The following nested keys are available:\n\n- `tab_size`\n- `show_gutter`\n- `theme`\n\nThis key has no default.\n\nhttps://cloudcannon.com/documentation/articles/the-source-editor/#source_editor',
		}),
		pull_request_templates: z.array(PullRequestTemplateSchema).optional().meta({
			description: 'Templates for pull requests.',
		}),
		commit_templates: z.array(CommitTemplateSchema).optional().meta({
			description: 'Templates for commit messages when saving changes.',
		}),
		upstream_commit_template: z.string().optional().meta({
			description: 'The commit template to use when pulling changes from the upstream repository.',
		}),
		markdown: MarkdownSettingsSchema.optional().meta({
			description: 'Contains settings for various Markdown engines.',
		}),
		timezone: TimezoneSchema.default('Etc/UTC').optional().meta({
			description: 'Specifies the time zone that dates are displayed and edited in.',
		}),
		_snippets: z.record(z.string(), SnippetConfigSchema).optional().meta({
			description: 'Configuration for custom snippets.',
		}),
		_snippets_imports: SnippetsImportsSchema.optional(),
		_snippets_templates: z.record(z.string(), SnippetConfigSchema).optional().meta({
			description: 'Extended option used when creating more complex custom snippets.',
		}),
		_snippets_definitions: z.record(z.string(), SnippetConfigSchema).optional().meta({
			description: 'Extended option used when creating more complex custom snippets.',
		}),
	})
	.meta({
		title: 'Configuration',
		description: 'The main CloudCannon configuration schema.',
	});

export type HrefAddOption = z.infer<typeof HrefAddOptionSchema>;
export type AddOption = z.infer<typeof AddOptionSchema>;
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
