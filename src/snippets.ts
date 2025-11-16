import * as z from 'zod';
import { ReducedCascadeSchema } from './cascade';
import { PickerPreviewSchema, PreviewSchema } from './preview';

export const SnippetConfigSchema = z
	.object({
		...ReducedCascadeSchema.shape,
		preview: PreviewSchema,
		picker_preview: PickerPreviewSchema,
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
				id: 'type.SnippetAlternateFormats',
				description: 'Alternate configurations for this snippet.',
			});
		},
		params: z.record(z.string(), z.unknown()).optional().meta({
			description: 'The parameters of this snippet.',
		}),
	})
	.meta({
		id: 'type.SnippetConfig',
		title: 'Snippet Configuration',
		description: 'A snippet configuration.',
	});

const SnippetImportSchema = z
	.union([
		z.boolean(),
		z.object({
			exclude: z.array(z.string()).meta({
				id: 'SnippetImportExclude',
				description:
					'The list of excluded snippets. If unset, all snippets are excluded unless defined in `include`.',
			}),
		}),
		z.object({
			include: z.array(z.string()).meta({
				id: 'SnippetImportInclude',
				description:
					'The list of included snippets. If unset, all snippets are included unless defined in `exclude`.',
			}),
		}),
	])
	.optional();

export const SnippetsImportsSchema = z
	.object({
		hugo: SnippetImportSchema.meta({
			id: '_snippets_imports.hugo',
			uniqueItems: true,
		}),
		jekyll: SnippetImportSchema.meta({
			id: '_snippets_imports.jekyll',
			uniqueItems: true,
		}),
		mdx: SnippetImportSchema.meta({
			id: '_snippets_imports.mdx',
			uniqueItems: true,
		}),
		eleventy_liquid: SnippetImportSchema.meta({
			id: '_snippets_imports.eleventy_liquid',
			uniqueItems: true,
		}),
		eleventy_nunjucks: SnippetImportSchema.meta({
			id: '_snippets_imports.eleventy_nunjucks',
			uniqueItems: true,
		}),
		markdoc: SnippetImportSchema.meta({
			id: '_snippets_imports.markdoc',
			uniqueItems: true,
		}),
		python_markdown_extensions: SnippetImportSchema.meta({
			id: '_snippets_imports.python_markdown_extensions',
			uniqueItems: true,
		}),
		docusaurus_mdx: SnippetImportSchema.meta({
			id: '_snippets_imports.docusaurus_mdx',
			uniqueItems: true,
		}),
	})
	.optional()
	.meta({ id: '_snippets_imports' });

export type SnippetConfig = z.infer<typeof SnippetConfigSchema>;
export type SnippetsImports = z.infer<typeof SnippetsImportsSchema>;
