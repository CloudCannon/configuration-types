import * as z from 'zod';
import { CascadeSchema } from './cascade';
import { CollectionConfigSchema, CollectionGroupSchema } from './collections';
import { InputsSchema } from './inputs';
import { MarkdownSettingsSchema } from './markdown';
import { PathsSchema } from './paths';
import { SnippetConfigSchema } from './snippets';
import { SnippetsImportsSchema } from './snippets';
import { SourceEditorSchema } from './source-editor';
import { TimezoneSchema } from './timezone';

export const DataConfigEntrySchema = z.object({ path: z.string() }).meta({ id: 'DataConfigEntry' });

export const FileConfigEntrySchema = z
	.object({
		glob: z
			.union([
				z.array(z.string()).meta({ title: 'Glob Array' }),
				z.string().meta({ title: 'Glob' }),
			])
			.meta({
				description: 'The glob pattern(s) targeting a path to one or more files.',
			}),
		...CascadeSchema.shape,
	})
	.meta({ id: 'FileConfigEntry' });

export const EditorSchema = z.object({
	default_path: z.string().default('/').meta({ id: 'editor.default_path' }),
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
		_inputs: InputsSchema.optional(),
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
	template_path: z.string().optional().meta({
		description:
			'Used to specify a file on the Site whose contents will be used as the default value for the pull request body. This has no effect if `body` is defined.',
	}),
	_inputs: InputsSchema.optional(),
});

export const ConfigurationSchema = z
	.object({
		paths: PathsSchema.optional(),
		version: z.literal('latest').optional().meta({ id: 'version', excludeFromDocumentation: true }),
		source: z.string().optional().meta({ id: 'source' }),
		collections_config: z
			.record(z.string(), CollectionConfigSchema)
			.optional()
			.meta({ id: 'collections_config' }),
		collection_groups: z
			.array(CollectionGroupSchema)
			.optional()
			.meta({ id: 'collection_groups', title: 'Collection Groups' }),
		base_url: z.string().optional().meta({ id: 'base_url' }),
		data_config: z.record(z.string(), DataConfigEntrySchema).optional().meta({ id: 'data_config' }),
		file_config: z.array(FileConfigEntrySchema).optional().meta({ id: 'file_config' }),
		editor: EditorSchema.optional().meta({ id: 'editor' }),
		source_editor: SourceEditorSchema.optional().meta({ id: 'source_editor' }),
		pull_request_templates: z.array(PullRequestTemplateSchema).optional().meta({
			description: 'Templates for pull requests.',
		}),
		commit_templates: z.array(CommitTemplateSchema).optional().meta({ id: 'commit_templates' }),
		upstream_commit_template: z.string().optional().meta({ id: 'upstream_commit_template' }),
		markdown: MarkdownSettingsSchema.optional().meta({ id: 'markdown' }),
		timezone: TimezoneSchema.default('Etc/UTC').optional(),
		...CascadeSchema.shape,
		_snippets: z.record(z.string(), SnippetConfigSchema).optional().meta({
			id: 'type._snippets',
			title: 'Snippets',
			description: 'Configuration for custom snippets.',
		}),
		_snippets_imports: SnippetsImportsSchema.optional(),
		_snippets_templates: z.record(z.string(), SnippetConfigSchema).optional().meta({
			id: 'type._snippets_templates',
			title: 'Snippets Templates',
			description: 'Extended option used when creating more complex custom snippets.',
		}),
		_snippets_definitions: z.record(z.string(), z.unknown()).optional().meta({
			id: 'type._snippets_definitions',
			title: 'Snippets Definitions',
			description: 'Extended option used when creating more complex custom snippets.',
		}),
	})
	.meta({
		title: 'Configuration',
		description: 'The main CloudCannon configuration.',
	});

export type DataConfigEntry = z.infer<typeof DataConfigEntrySchema>;
export type FileConfigEntry = z.infer<typeof FileConfigEntrySchema>;
export type Editor = z.infer<typeof EditorSchema>;
export type CommitTemplate = z.infer<typeof CommitTemplateSchema>;
export type Configuration = z.infer<typeof ConfigurationSchema>;
