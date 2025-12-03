import assert from 'node:assert';
import { test } from 'node:test';
import { ConfigurationSchema } from '../src/configuration.ts';

test('should accept a minimal valid configuration', () => {
	const config = {
		version: 'latest',
	};

	const result = ConfigurationSchema.safeParse(config);
	assert(result.success);
});

test('should accept a complete configuration', () => {
	const config = {
		version: 'latest',
		source: 'src',
		base_url: '/docs',
		timezone: 'America/New_York',
		collections_config: {
			posts: {
				path: '_posts',
				name: 'Blog Posts',
				description: 'Articles and blog posts',
				icon: 'article',
				sort_options: [
					{
						key: 'date',
						order: 'descending',
					},
				],
			},
		},
		data_config: {
			authors: {
				path: '_data/authors.yml',
			},
		},
		editor: {
			default_path: '/home',
		},
	};

	const result = ConfigurationSchema.safeParse(config);
	assert(result.success);
});

test('should reject invalid version', () => {
	const config = {
		version: 'invalid-version',
	};

	const result = ConfigurationSchema.safeParse(config);
	assert(!result.success);
});

test('should accept collections with add_options', () => {
	const config = {
		collections_config: {
			posts: {
				path: '_posts',
				add_options: [
					{
						name: 'New Post',
						icon: 'add',
						schema: 'post',
					},
					{
						name: 'External Link',
						href: 'https://example.com',
					},
				],
			},
		},
	};

	const result = ConfigurationSchema.safeParse(config);
	assert(result.success);
});

test('should accept collection with schemas', () => {
	const config = {
		collections_config: {
			posts: {
				path: '_posts',
				schemas: {
					default: {
						path: 'schemas/post.md',
						name: 'Blog Post',
						icon: 'article',
						create: {
							path: '[slug].md',
						},
					},
				},
			},
		},
	};

	const result = ConfigurationSchema.safeParse(config);
	assert(result.success);
});

test('should accept markdown configuration', () => {
	const config = {
		markdown: {
			engine: 'commonmark',
			options: {
				html: true,
				breaks: false,
			},
		},
	};

	const result = ConfigurationSchema.safeParse(config);
	assert(result.success);
});

test('should accept commit templates', () => {
	const config = {
		commit_templates: [
			{
				label: 'Default Commit',
				template_string: 'Updated {{filename}}',
				_inputs: {
					message: {
						type: 'text',
						comment: 'Additional commit message',
					},
				},
			},
		],
	};

	const result = ConfigurationSchema.safeParse(config);
	assert(result.success);
});

test('should accept collection groups', () => {
	const config = {
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
	};

	const result = ConfigurationSchema.safeParse(config);
	assert(result.success);
});

test('should accept file_config array', () => {
	const config = {
		file_config: [
			{
				glob: '*.md',
				_enabled_editors: ['content', 'visual'],
				_inputs: {
					title: {
						type: 'text',
						comment: 'Page title',
					},
				},
			},
		],
	};

	const result = ConfigurationSchema.safeParse(config);
	assert(result.success);
});
