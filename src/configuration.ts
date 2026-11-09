import * as z from 'zod';
import { _CascadeSchema } from './cascade.js';
import { CollectionGroupSchema, CollectionsConfigSchema } from './collections.js';
import { InputsSchema } from './inputs.js';
import { MarkdownSettingsSchema } from './markdown.js';
import { PathsSchema } from './paths.js';
import {
	SnippetConfigSchema,
	SnippetDefinitionsSchema,
	SnippetsImportsSchema,
} from './snippets.js';
import { SourceEditorSchema } from './source-editor.js';
import { TimezoneSchema } from './timezone.js';

export const _DataConfigEntrySchema = z
	.object({ path: z.string() })
	.meta({ id: 'DataConfigEntry' });
export interface DataConfigEntry extends z.infer<typeof _DataConfigEntrySchema> {}
export const DataConfigEntrySchema: z.ZodType<DataConfigEntry> = _DataConfigEntrySchema;

const _FileConfigEntrySchema = z
	.object({
		glob: z
			.union([
				z.array(z.string()).meta({ title: 'Glob Array' }),
				z.string().meta({ title: 'Glob' }),
			])
			.meta({
				description: 'The glob pattern(s) targeting a path to one or more files.',
			}),
		..._CascadeSchema.shape,
	})
	.meta({ id: 'FileConfigEntry' });
export interface FileConfigEntry extends z.infer<typeof _FileConfigEntrySchema> {}
export const FileConfigEntrySchema: z.ZodType<FileConfigEntry> = _FileConfigEntrySchema;

const _EditorSchema = z.object({
	default_path: z.string().default('/').meta({ id: 'editor.default_path' }),
});
export interface Editor extends z.infer<typeof _EditorSchema> {}
export const EditorSchema: z.ZodType<Editor> = _EditorSchema;

const _CommitTemplateSchema = z
	.object({
		label: z.string().nullable().optional().meta({
			description:
				'Used to identify a commit template when multiple commit templates are available.',
		}),
		template_string: z.string().nullable().optional().meta({
			description:
				'Set the string for the commit template. This will only be used if `template_path` is not set.',
		}),
		template_path: z.string().nullable().optional().meta({
			description:
				'Sets the path for a file containing your commit template. The file path should be relative to the root directory.',
		}),
		_inputs: InputsSchema.nullable().optional(),
		extra_data: z.record(z.string(), z.string()).nullable().optional().meta({
			description: 'Define additional template strings, for building nested templates.',
		}),
		wrap_width: z.number().nullable().optional().meta({
			description: 'Sets the width of the text wrap in the editor.',
		}),
	})
	.meta({
		title: 'Commit Template',
		description: 'A template for commit messages when saving changes.',
	});
export interface CommitTemplate extends z.infer<typeof _CommitTemplateSchema> {}
export const CommitTemplateSchema: z.ZodType<CommitTemplate> = _CommitTemplateSchema;

const _PullRequestTemplateSchema = z.object({
	label: z.string().nullable().optional().meta({
		description:
			'Used to identify a pull request template when multiple pull request templates are available.',
	}),
	title: z.string().nullable().optional().meta({
		description: 'The default value for the pull request title.',
	}),
	body: z.string().nullable().optional().meta({
		description: 'The default value for the pull request body.',
	}),
	template_path: z.string().nullable().optional().meta({
		description:
			'Used to specify a file on the Site whose contents will be used as the default value for the pull request body. This has no effect if `body` is defined.',
	}),
	_inputs: InputsSchema.nullable().optional(),
});
export const PullRequestTemplateSchema: z.ZodType<z.infer<typeof _PullRequestTemplateSchema>> =
	_PullRequestTemplateSchema;

export const _ConfigurationSchema = z
	.object({
		paths: PathsSchema.nullable().optional(),
		version: z.literal('latest').optional().meta({ id: 'version', excludeFromDocumentation: true }),
		source: z.string().nullable().optional().meta({ id: 'source' }),
		collections_config: CollectionsConfigSchema.optional(),
		collections_config_from_glob: z.array(z.string()).nullable().optional(),
		collection_groups: z
			.array(CollectionGroupSchema)
			.nullable()
			.optional()
			.meta({ id: 'collection_groups', title: 'Collection Groups' }),
		base_url: z.string().nullable().optional().meta({ id: 'base_url' }),
		data_config: z
			.record(z.string(), DataConfigEntrySchema)
			.nullable()
			.optional()
			.meta({ id: 'data_config' }),
		file_config: z.array(FileConfigEntrySchema).nullable().optional().meta({ id: 'file_config' }),
		editor: EditorSchema.nullable().optional().meta({ id: 'editor' }),
		source_editor: SourceEditorSchema.nullable().optional().meta({ id: 'source_editor' }),
		pull_request_templates: z.array(PullRequestTemplateSchema).nullable().optional().meta({
			description: 'Templates for pull requests.',
		}),
		commit_templates: z
			.array(CommitTemplateSchema)
			.nullable()
			.optional()
			.meta({ id: 'commit_templates' }),
		upstream_commit_template: z
			.string()
			.nullable()
			.optional()
			.meta({ id: 'upstream_commit_template' }),
		markdown: MarkdownSettingsSchema.nullable().optional().meta({ id: 'markdown' }),
		timezone: TimezoneSchema.nullable().default('Etc/UTC').optional(),
		..._CascadeSchema.shape,
		_snippets: z.record(z.string(), SnippetConfigSchema).nullable().optional().meta({
			id: 'type._snippets',
			title: 'Snippets',
			description: 'Configuration for custom snippets.',
		}),
		_snippets_from_glob: z.array(z.string()).nullable().optional(),
		_snippets_imports: SnippetsImportsSchema.nullable().optional(),
		_snippets_imports_from_glob: z.array(z.string()).nullable().optional(),
		_snippets_templates: z.record(z.string(), SnippetConfigSchema).nullable().optional().meta({
			id: 'type._snippets_templates',
			title: 'Snippets Templates',
			description: 'Extended option used when creating more complex custom snippets.',
		}),
		_snippets_templates_from_glob: z.array(z.string()).nullable().optional(),
		_snippets_definitions: SnippetDefinitionsSchema.optional(),
		_snippets_definitions_from_glob: z.array(z.string()).nullable().optional(),
	})
	.meta({
		title: 'Configuration',
		description: 'The main CloudCannon configuration.',
	});
export interface Configuration extends z.infer<typeof _ConfigurationSchema> {}
export const ConfigurationSchema: z.ZodType<Configuration> = _ConfigurationSchema;
