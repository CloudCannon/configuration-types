import assert from 'node:assert';
import { test } from 'node:test';
import { SsgKeySchema } from '../src/index.ts';

test('should accept valid SSG keys', () => {
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
		assert(result.success);
	});
});

test('should reject invalid SSG keys', () => {
	const invalidKeys = ['invalid-ssg', 'wordpress', 'drupal', '', 123, null, undefined];

	invalidKeys.forEach((key) => {
		const result = SsgKeySchema.safeParse(key);
		assert(!result.success);
	});
});

test('should be case sensitive', () => {
	const result1 = SsgKeySchema.safeParse('HUGO');
	const result2 = SsgKeySchema.safeParse('Jekyll');
	const result3 = SsgKeySchema.safeParse('hugo');

	assert(!result1.success);
	assert(!result2.success);
	assert(result3.success);
});
