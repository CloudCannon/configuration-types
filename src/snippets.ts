import * as z from 'zod';
import { ReducedCascadeSchema } from './cascade';
import { PickerPreviewSchema, PreviewSchema } from './preview';

export const SnippetConfigSchema = z
	.object({
		...ReducedCascadeSchema.shape,
		preview: PreviewSchema.optional(),
		picker_preview: PickerPreviewSchema.optional(),
	})
	.extend({
		snippet: z.string().optional().meta({
			description: 'Name of the snippet.',
		}),
		template: z.string().optional().meta({
			description:
				'The template that this snippet should inherit, out of the available Shortcode Templates.',
		}),
		inline: z.boolean().optional().meta({
			description:
				'Whether this snippet can appear inline (within a sentence). Defaults to false, which will treat this snippet as a block-level element in the content editor.',
		}),
		view: z.enum(['card', 'inline', 'gallery']).optional().meta({
			description:
				"Controls how selected items are rendered. Defaults to 'card', or 'inline' if `inline` is true.",
		}),
		strict_whitespace: z.boolean().optional().meta({
			description: 'Whether this snippet treats whitespace as-is or not.',
		}),
		definitions: z.record(z.string(), z.unknown()).optional().meta({
			description: 'The variables required for the selected template.',
		}),
		get alternate_formats() {
			return z.array(SnippetConfigSchema).optional().meta({
				description: 'Alternate configurations for this snippet.',
			});
		},
		params: z.record(z.string(), z.unknown()).optional().meta({
			description: 'The parameters of this snippet.',
		}),
	})
	.meta({
		id: 'SnippetConfig',
		title: 'Snippet Configuration',
		description: 'A snippet configuration.',
	});

const SnippetImportSchema = z
	.union([
		z.boolean(),
		z.object({
			exclude: z.array(z.string()).meta({
				description:
					'The list of excluded snippets. If unset, all snippets are excluded unless defined in `include`.',
			}),
		}),
		z.object({
			include: z.array(z.string()).meta({
				description:
					'The list of included snippets. If unset, all snippets are included unless defined in `exclude`.',
			}),
		}),
	])
	.meta({
		id: 'SnippetImport',
		title: 'Snippet Import',
		description: 'Controls what snippets are available to import.',
	});

export const SnippetsImportsSchema = z
	.object({
		hugo: SnippetImportSchema.optional().meta({
			description: 'Default snippets for Hugo SSG.',
			uniqueItems: true,
		}),
		jekyll: SnippetImportSchema.optional().meta({
			description: 'Default snippets for Jekyll SSG.',
			uniqueItems: true,
		}),
		mdx: SnippetImportSchema.optional().meta({
			description: 'Default snippets for MDX-based content.',
			uniqueItems: true,
		}),
		eleventy_liquid: SnippetImportSchema.optional().meta({
			description: 'Default snippets for Eleventy SSG Liquid files.',
			uniqueItems: true,
		}),
		eleventy_nunjucks: SnippetImportSchema.optional().meta({
			description: 'Default snippets for Eleventy SSG Nunjucks files.',
			uniqueItems: true,
		}),
		markdoc: SnippetImportSchema.optional().meta({
			description: 'Default snippets for Markdoc-based content.',
			uniqueItems: true,
		}),
		python_markdown_extensions: SnippetImportSchema.optional().meta({
			description: 'Default snippets for content using Python markdown extensions.',
			uniqueItems: true,
		}),
		docusaurus_mdx: SnippetImportSchema.optional().meta({
			description: 'Default snippets for Docusaurus SSG.',
			uniqueItems: true,
		}),
	})
	.meta({
		id: '_snippets_imports',
		title: 'Snippets Imports',
		description:
			'Provides control over which snippets are available to use and/or extend within `_snippets`.',
	});

export type SnippetConfig = z.infer<typeof SnippetConfigSchema>;
export type SnippetsImports = z.infer<typeof SnippetsImportsSchema>;
