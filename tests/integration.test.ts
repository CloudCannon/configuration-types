import assert from 'node:assert';
import { test } from 'node:test';
import { HugoConfigurationSchema, JekyllConfigurationSchema } from '../src/build-coupled.ts';
import { type Configuration, ConfigurationSchema } from '../src/configuration.ts';

test('should validate a typical Jekyll blog configuration', () => {
	const config = {
		version: 'legacy-jekyll',
		source: '.',
		collections_config: {
			posts: {
				path: '_posts',
				name: 'Blog Posts',
				description: 'Articles and tutorials',
				icon: 'article',
				sort_options: [
					{
						key: 'date',
						order: 'descending',
						label: 'Latest First',
					},
					{
						key: 'title',
						order: 'ascending',
						label: 'Title A-Z',
					},
				],
				add_options: [
					{
						name: 'Blog Post',
						icon: 'article',
						schema: 'post',
					},
				],
				schemas: {
					post: {
						path: 'schemas/post.md',
						name: 'Blog Post',
						icon: 'article',
						create: {
							path: '_posts/[date|year]-[date|month]-[date|day]-[slug].md',
						},
						_inputs: {
							title: {
								type: 'text',
								comment: 'The title of your post',
							},
							date: {
								type: 'datetime',
								comment: 'Publication date',
								options: {
									timezone: 'America/New_York',
								},
							},
							tags: {
								type: 'multiselect',
								comment: 'Select relevant tags',
								options: {
									values: '_select_data.tags',
								},
							},
						},
					},
				},
			},
			pages: {
				path: '',
				name: 'Pages',
				icon: 'description',
				filter: {
					base: 'strict',
					include: ['*.md', '*.html'],
					exclude: ['README.md', '_*/**'],
				},
			},
		},
		_select_data: {
			tags: {
				values: ['tutorial', 'guide', 'news', 'announcement', 'technical'],
			},
		},
		markdown: {
			engine: 'kramdown',
			options: {
				input: 'GFM',
				hard_wrap: false,
				auto_ids: true,
				footnote_nr: 1,
				entity_output: 'as_char',
				toc_levels: [1, 2, 3, 4, 5, 6],
				smart_quotes: ['lsquo', 'rsquo', 'ldquo', 'rdquo'],
				syntax_highlighter: 'rouge',
			},
		},
	};

	const result = JekyllConfigurationSchema.safeParse(config);
	assert(result.success);
});

test('should validate a Hugo documentation site configuration', () => {
	const config = {
		version: 'legacy-hugo',
		source: 'content',
		paths: {
			uploads: 'static/uploads',
			dam: 'assets/images',
		},
		collections_config: {
			docs: {
				path: 'docs',
				name: 'Documentation',
				description: 'Product documentation pages',
				icon: 'menu_book',
				parse_branch_index: true,
				sort_options: [
					{
						key: 'weight',
						order: 'ascending',
					},
				],
				_inputs: {
					weight: {
						type: 'number',
						comment: 'Order in navigation (lower numbers first)',
						options: {
							min: 1,
							step: 1,
						},
					},
					draft: {
						type: 'switch',
						comment: 'Hide from published site',
					},
				},
			},
			blog: {
				path: 'blog',
				name: 'Blog',
				icon: 'article',
				_inputs: {
					author: {
						type: 'select',
						comment: 'Post author',
						options: {
							values: '_select_data.authors',
						},
					},
					featured_image: {
						type: 'image',
						comment: 'Hero image for the post',
						options: {
							width: 1200,
							height: 630,
							resize_style: 'cover',
						},
					},
				},
			},
		},
		_select_data: {
			authors: {
				values: [
					{ label: 'John Doe', value: 'john' },
					{ label: 'Jane Smith', value: 'jane' },
				],
			},
		},
		_structures: {
			content_blocks: {
				values: [
					{
						label: 'Text Block',
						icon: 'format_align_left',
						value: {
							_type: 'text',
							content: '',
						},
					},
					{
						label: 'Image Block',
						icon: 'image',
						value: {
							_type: 'image',
							src: '',
							alt: '',
							caption: '',
						},
					},
					{
						label: 'Code Block',
						icon: 'code',
						value: {
							_type: 'code',
							language: 'javascript',
							code: '',
						},
					},
				],
			},
		},
	};

	const result = HugoConfigurationSchema.safeParse(config);
	assert(result.success);
});

test('should validate a complex latest version configuration', () => {
	const config = {
		version: 'latest',
		source: 'src',
		base_url: '/docs',
		timezone: 'America/Los_Angeles',
		collections_config: {
			posts: {
				path: 'content/posts',
				name: 'Blog Posts',
				description: 'Company blog and announcements',
				icon: 'article',
				documentation: {
					url: 'https://docs.company.com/content-guide',
					text: 'Content Writing Guide',
				},
				sort_options: [
					{
						key: 'date',
						order: 'descending',
					},
				],
				add_options: [
					{
						name: 'Standard Post',
						icon: 'article',
						editor: 'content',
						schema: 'default',
					},
					{
						name: 'Press Release',
						icon: 'campaign',
						schema: 'press_release',
					},
				],
				schemas: {
					default: {
						path: 'schemas/post.md',
						name: 'Blog Post',
						icon: 'article',
						create: {
							path: '[date|year]/[date|month]/[slug]/index.md',
							extra_data: {
								author_name: '{{author.name}}',
								author_email: '{{author.email}}',
							},
						},
						_inputs: {
							title: {
								type: 'text',
								comment: 'Post title (appears in browser tab and social shares)',
							},
							excerpt: {
								type: 'textarea',
								comment: 'Brief summary for listings and social media',
								options: {
									max_length: 160,
								},
							},
							content_blocks: {
								type: 'array',
								comment: 'Post content built from blocks',
								options: {
									structures: '_structures.content_blocks',
								},
							},
						},
					},
					press_release: {
						path: 'schemas/press-release.md',
						name: 'Press Release',
						icon: 'campaign',
						create: {
							path: 'press/[date|year]/[slug]/index.md',
						},
					},
				},
			},
		},
		collection_groups: [
			{
				heading: 'Content',
				collections: ['posts', 'pages'],
			},
			{
				heading: 'Data',
				collections: ['authors', 'settings'],
			},
		],
		data_config: {
			authors: {
				path: 'data/authors.yml',
			},
			navigation: {
				path: 'data/navigation.json',
			},
		},
		editor: {
			default_path: '/home',
		},
		commit_templates: [
			{
				label: 'Default',
				template_string: 'Updated "{{title}}" in {{collection}}',
			},
			{
				label: 'Detailed',
				template_string: '{{action}}: {{title}}\n\n{{custom_message}}',
				_inputs: {
					action: {
						type: 'select',
						comment: 'What type of change?',
						options: {
							values: ['Added', 'Updated', 'Removed', 'Fixed'],
						},
					},
					custom_message: {
						type: 'textarea',
						comment: 'Additional details (optional)',
						options: {
							rows: 3,
						},
					},
				},
			},
		],
		_snippets: {
			youtube: {
				snippet:
					'<div class="video-embed"><iframe src="https://youtube.com/embed/{{[[id]]}}" frameborder="0"></iframe></div>',
				params: {
					id: {
						parser: 'content',
						options: {
							editor_key: 'id',
						},
					},
				},
				_inputs: {
					id: {
						type: 'text',
						comment: 'YouTube video ID or URL',
					},
				},
			},
		},
	};

	const result = ConfigurationSchema.safeParse(config);
	assert(result.success);
});

test('should reject configuration with missing required fields', () => {
	const config = {
		version: 'latest',
		collections_config: {
			posts: {
				// Missing required 'path' field
				name: 'Posts',
			},
		},
	};

	const result = ConfigurationSchema.safeParse(config);
	assert(!result.success);
});

test('should reject configuration with invalid nested values', () => {
	const config = {
		version: 'latest',
		collections_config: {
			posts: {
				path: '_posts',
				sort_options: [
					{
						key: 'date',
						order: 'invalid-order', // Invalid sort order
					},
				],
			},
		},
	};

	const result = ConfigurationSchema.safeParse(config);
	assert(!result.success);
});

test('should handle empty configuration', () => {
	const config = {};

	const result = ConfigurationSchema.safeParse(config);
	assert(result.success);
});

test('should handle configuration with only version', () => {
	const config = {
		version: 'latest',
	};

	const result = ConfigurationSchema.safeParse(config);
	assert(result.success);
});

test('should validate complex nested structures', () => {
	const config: Configuration = {
		collections_config: {
			pages: {
				path: 'pages',
				_structures: {
					page_sections: {
						style: 'modal',
						values: [
							{
								label: 'Hero Section',
								value: {
									_type: 'hero',
									title: '',
									subtitle: '',
									background: {
										type: 'image',
										src: '',
										overlay_opacity: 0.5,
									},
									cta: {
										text: 'Get Started',
										url: '/signup',
										style: 'primary',
									},
								},
								_inputs: {
									'background.overlay_opacity': {
										type: 'range',
										options: {
											min: 0,
											max: 1,
											step: 0.1,
										},
									},
								},
							},
						],
					},
				},
			},
		},
	};

	const result = ConfigurationSchema.safeParse(config);
	assert(result.success);
});
