import { describe, expect, it } from 'vitest';
import { SsgKeySchema } from '../src/index.ts';

describe('Index exports', () => {
	describe('SsgKeySchema', () => {
		it('should accept valid SSG keys', () => {
			const validKeys = [
				'hugo',
				'jekyll',
				'eleventy',
				'astro',
				'lume',
				'mkdocs',
				'nextjs',
				'sveltekit',
				'bridgetown',
				'docusaurus',
				'gatsby',
				'hexo',
				'nuxtjs',
				'sphinx',
				'static',
				'legacy',
				'other',
			];

			validKeys.forEach((key) => {
				const result = SsgKeySchema.safeParse(key);
				expect(result.success).toBe(true);
			});
		});

		it('should reject invalid SSG keys', () => {
			const invalidKeys = ['invalid-ssg', 'wordpress', 'drupal', '', 123, null, undefined];

			invalidKeys.forEach((key) => {
				const result = SsgKeySchema.safeParse(key);
				expect(result.success).toBe(false);
			});
		});

		it('should be case sensitive', () => {
			const result1 = SsgKeySchema.safeParse('HUGO');
			const result2 = SsgKeySchema.safeParse('Jekyll');
			const result3 = SsgKeySchema.safeParse('hugo');

			expect(result1.success).toBe(false);
			expect(result2.success).toBe(false);
			expect(result3.success).toBe(true);
		});
	});
});
