import * as z from 'zod';
import { ReducedCascadeSchema } from './cascade.ts';
import { PickerPreviewSchema, PreviewSchema } from './preview.ts';

export const ParserModelSchema = z
	.object({
		source_key: z.string().optional(),
		editor_key: z.string().optional(),
		remove_empty: z.boolean(),
		optional: z.boolean(),
		type: z.enum(['array', 'object', 'string', 'boolean', 'number']).optional(),
		allowed_values: z.array(z.any()).optional(),
		implied_boolean: z.boolean(),
		default: z.any().optional(),
	})
	.meta({
		id: 'type.snippet-model',
		title: 'Snippet Model',
	});

export const PairedTokenSchema = z.object({
	start: z.string(),
	end: z.string(),
});

export const SnippetStyleSchema = z
	.object({
		output: z.enum(['legacy', 'inline', 'block']),
		inline: z
			.object({
				leading: z.string().optional(),
				trailing: z.string().optional(),
			})

			.optional(),
		block: z
			.object({
				leading: z.string().optional(),
				trailing: z.string().optional(),
				indent: z.string().optional(),
			})

			.optional(),
	})
	.meta({
		id: 'type.snippet-style',
		title: 'Snippet Style',
	});

export const ParserFormatSchema = z
	.object({
		root_boundary: PairedTokenSchema,
		root_value_boundary: PairedTokenSchema,
		root_value_boundary_optional: z.record(z.string(), z.boolean()),
		root_value_delimiter: z.string().optional(),
		root_pair_delimiter: z.array(z.string()),
		remove_empty_root_boundary: z.boolean(),
		object_boundary: PairedTokenSchema,
		object_value_delimiter: z.string(),
		object_pair_delimiter: z.string(),
		array_boundary: PairedTokenSchema,
		array_delimiter: z.string(),
		string_boundary: z.array(z.string()),
		string_escape_character: z.string(),
		allow_booleans: z.boolean(),
		allow_numbers: z.boolean(),
		allow_implied_values: z.boolean(),
		allow_null: z.boolean(),
		forbidden_tokens: z.array(z.string()),
		allowed_string_cases: z.object({
			any: z.boolean().optional(),
			leading_upper: z.boolean().optional(),
			leading_lower: z.boolean().optional(),
			lower: z.boolean().optional(),
			upper: z.boolean().optional(),
		}),
	})
	.meta({
		id: 'type.snippet-format',
		title: 'Snippet Format',
	});

export const ArgumentListParserConfigSchema = z.object({
	parser: z.literal('argument_list'),
	options: z.object({
		models: z.array(ParserModelSchema),
		format: ParserFormatSchema,
	}),
});

export const ArgumentParserConfigSchema = z.object({
	parser: z.literal('argument'),
	options: z.object({
		model: ParserModelSchema,
		format: ParserFormatSchema,
	}),
});

export const ContentParserConfigSchema = z.object({
	parser: z.literal('content'),
	options: z.object({
		editor_key: z.string().optional(),
		indented_by: z.string().optional(),
		default: z.string().optional(),
		trim_text: z.boolean().optional(),
		allow_nested: z.boolean().optional(),
		raw: z.boolean().optional(),
		forbidden_tokens: z.array(z.string()).optional(),
		optional: z.boolean().optional(),
		allow_leading: z.boolean().optional(),
		escape_indented_blocks: z.boolean().default(false).optional(),
		parse_newline_character: z.boolean().default(false).optional(),
		ignore_unpaired_backticks: z.boolean().default(true).optional(),
		escape_fenced_blocks: z.boolean().default(false).optional(),
		style: SnippetStyleSchema.optional(),
	}),
});

export const KeyValueListParserConfigSchema = z.object({
	parser: z.literal('key_values'),
	options: z.object({
		models: z.array(ParserModelSchema),
		format: ParserFormatSchema,
		style: SnippetStyleSchema,
	}),
});

export const LiteralParserConfigSchema = z.object({
	parser: z.literal('literal'),
	options: z.object({
		literal: z.string(),
		format: z.object({ string_boundary: z.array(z.string()).optional() }).optional(),
	}),
});

export const OptionalParserConfigSchema = z.object({
	parser: z.literal('optional'),
	options: z.object({
		snippet: z.string(),
		remove_empty: z.boolean().optional(),
	}),
});

export const RepeatingLiteralParserConfigSchema = z.object({
	parser: z.literal('repeating_literal'),
	options: z.object({
		literal: z.string(),
		default: z.number(),
		minimum: z.number(),
		editor_key: z.string().optional(),
	}),
});

export const RepeatingParserConfigSchema = z.object({
	parser: z.literal('repeating'),
	options: z.object({
		snippet: z.string(),
		editor_key: z.string().optional(),
		output_delimiter: z.string().optional(),
		default_length: z.number().optional(),
		style: SnippetStyleSchema.optional(),
		optional: z.boolean().optional(),
	}),
});

export const WrapperParserConfigSchema = z.object({
	parser: z.literal('wrapper'),
	options: z.object({
		snippet: z.string(),
		remove_empty: z.boolean().optional(),
		style: SnippetStyleSchema.optional(),
	}),
});

export const ParserConfigSchema = z.union([
	ArgumentListParserConfigSchema.meta({ title: 'Argument List Parser Config' }),
	ArgumentParserConfigSchema.meta({ title: 'Argument Parser Config' }),
	ContentParserConfigSchema.meta({ title: 'Content Parser Config' }),
	KeyValueListParserConfigSchema.meta({ title: 'Key Value List Parser Config' }),
	LiteralParserConfigSchema.meta({ title: 'Literal Parser Config' }),
	OptionalParserConfigSchema.meta({ title: 'Optional Parser Config' }),
	RepeatingLiteralParserConfigSchema.meta({ title: 'Repeating Literal Parser Config' }),
	RepeatingParserConfigSchema.meta({ title: 'Repeating Parser Config' }),
	WrapperParserConfigSchema.meta({ title: 'Wrapper Parser Config' }),
]);

export const SnippetConfigSchema = z
	.object({
		...ReducedCascadeSchema.shape,
		preview: PreviewSchema.optional(),
		picker_preview: PickerPreviewSchema.optional(),
	})
	.extend({
		snippet: z.string().optional().meta({
			description:
				'The snippet string contains the text to match for your snippet, with any dynamic sections represented using a placeholder in double square brackets.',
		}),
		template: z.string().optional().meta({
			description:
				'The template that this snippet should inherit, out of the available Snippet Templates.',
		}),
		inline: z.boolean().default(false).optional().meta({
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
				id: 'SnippetAlternateFormats',
				description: 'Alternate configurations for this snippet.',
			});
		},
		params: z.record(z.string(), ParserConfigSchema).optional().meta({
			title: 'Parser Config',
			description: 'The parameters of this snippet.',
		}),
	})
	.meta({
		id: 'type.snippet',
		title: 'Snippet',
		description: 'A snippet configuration.',
	});

const SnippetImportSchema = z
	.union([
		z.boolean().meta({ id: 'type._snippets_imports.*.(full-import)', title: 'Full Import' }),
		z
			.object({
				exclude: z.array(z.string()).meta({
					id: 'SnippetImportExclude',
					description:
						'The list of excluded snippets. If unset, all snippets are excluded unless defined in `include`.',
				}),
			})
			.meta({ title: 'Exclude List' }),
		z
			.object({
				include: z.array(z.string()).meta({
					id: 'SnippetImportInclude',
					description:
						'The list of included snippets. If unset, all snippets are included unless defined in `exclude`.',
				}),
			})
			.meta({ title: 'Include List' }),
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
	.meta({ id: 'type._snippets_imports', title: 'Snippets Imports' });

export type SnippetConfig = z.infer<typeof SnippetConfigSchema>;
export type SnippetsImports = z.infer<typeof SnippetsImportsSchema>;
