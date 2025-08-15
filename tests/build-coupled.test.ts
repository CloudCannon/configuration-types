import { describe, expect, it } from 'vitest';
import {
	EleventyConfigurationSchema,
	HugoConfigurationSchema,
	JekyllConfigurationSchema,
	ReaderConfigurationSchema,
} from '../src/build-coupled.ts';

describe('Build-Coupled Configurations', () => {
	describe('JekyllConfigurationSchema', () => {
		it('should accept a valid Jekyll configuration', () => {
			const config = {
				version: 'legacy-jekyll' as const,
				source: '.',
				paths: {
					uploads: 'assets/uploads',
					dam: 'assets/dam',
				},
				collections_config: {
					posts: {
						path: '_posts',
						output: true,
					},
					drafts: {
						path: '_drafts',
						output: false,
					},
				},
			};

			const result = JekyllConfigurationSchema.safeParse(config);
			expect(result.success).toBe(true);
		});

		it('should reject invalid version for Jekyll', () => {
			const config = {
				version: 'latest',
			};

			const result = JekyllConfigurationSchema.safeParse(config);
			expect(result.success).toBe(false);
		});

		it('should accept collections with filter configuration', () => {
			const config = {
				version: 'legacy-jekyll' as const,
				collections_config: {
					posts: {
						path: '_posts',
						filter: {
							base: 'strict' as const,
							include: ['published/*.md'],
							exclude: ['drafts/*'],
						},
					},
				},
			};

			const result = JekyllConfigurationSchema.safeParse(config);
			expect(result.success).toBe(true);
		});
	});

	describe('HugoConfigurationSchema', () => {
		it('should accept a valid Hugo configuration', () => {
			const config = {
				version: 'legacy-hugo' as const,
				source: 'content',
				paths: {
					uploads: 'static/uploads',
					layouts: 'layouts',
				},
				collections_config: {
					posts: {
						path: 'posts',
						parse_branch_index: false,
					},
					pages: {
						path: '.',
						parse_branch_index: true,
					},
				},
			};

			const result = HugoConfigurationSchema.safeParse(config);
			expect(result.success).toBe(true);
		});

		it('should accept Hugo-specific parse_branch_index option', () => {
			const config = {
				version: 'legacy-hugo' as const,
				collections_config: {
					sections: {
						path: 'content',
						parse_branch_index: true,
					},
				},
			};

			const result = HugoConfigurationSchema.safeParse(config);
			expect(result.success).toBe(true);
		});
	});

	describe('EleventyConfigurationSchema', () => {
		it('should accept a valid Eleventy configuration', () => {
			const config = {
				version: 'legacy-eleventy' as const,
				source: 'src',
				paths: {
					includes: '_includes',
					layouts: '_layouts',
				},
				collections_config: {
					blog: {
						path: 'blog',
						output: true,
						singular_key: 'post',
					},
				},
				collections_config_override: true,
			};

			const result = EleventyConfigurationSchema.safeParse(config);
			expect(result.success).toBe(true);
		});
	});

	describe('ReaderConfigurationSchema', () => {
		it('should accept a valid Reader configuration', () => {
			const config = {
				version: 'legacy-reader' as const,
				source: '.',
				output: 'dist',
				collections_config: {
					posts: {
						path: 'content/posts',
						parser: 'front-matter' as const,
						output: true,
						singular_key: 'post',
					},
					data: {
						path: 'data',
						parser: 'yaml' as const,
						output: false,
					},
				},
				data_config: {
					authors: {
						path: 'data/authors.yml',
						parser: 'yaml' as const,
					},
				},
			};

			const result = ReaderConfigurationSchema.safeParse(config);
			expect(result.success).toBe(true);
		});

		it('should accept various parser types', () => {
			const parsers = ['csv', 'front-matter', 'json', 'properties', 'toml', 'yaml'] as const;

			parsers.forEach((parser) => {
				const config = {
					version: 'legacy-reader' as const,
					collections_config: {
						test: {
							path: 'test',
							parser: parser,
						},
					},
				};

				const result = ReaderConfigurationSchema.safeParse(config);
				expect(result.success).toBe(true);
			});
		});

		it('should reject invalid parser', () => {
			const config = {
				version: 'legacy-reader' as const,
				collections_config: {
					test: {
						path: 'test',
						parser: 'invalid-parser',
					},
				},
			};

			const result = ReaderConfigurationSchema.safeParse(config);
			expect(result.success).toBe(false);
		});
	});

	describe('Filter configurations', () => {
		it('should accept filter as string', () => {
			const config = {
				version: 'legacy-jekyll' as const,
				collections_config: {
					posts: {
						path: '_posts',
						filter: 'strict' as const,
					},
				},
			};

			const result = JekyllConfigurationSchema.safeParse(config);
			expect(result.success).toBe(true);
		});

		it('should accept filter as object', () => {
			const config = {
				version: 'legacy-hugo' as const,
				collections_config: {
					posts: {
						path: 'posts',
						filter: {
							base: 'all' as const,
							include: ['*.md'],
							exclude: ['drafts/*'],
						},
					},
				},
			};

			const result = HugoConfigurationSchema.safeParse(config);
			expect(result.success).toBe(true);
		});

		it('should reject invalid filter base', () => {
			const config = {
				version: 'legacy-reader' as const,
				collections_config: {
					posts: {
						path: 'posts',
						filter: {
							base: 'invalid' as any,
						},
					},
				},
			};

			const result = ReaderConfigurationSchema.safeParse(config);
			expect(result.success).toBe(false);
		});
	});
});
