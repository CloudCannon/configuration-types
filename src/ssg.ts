import * as z from 'zod';

export const SsgKeySchema = z.enum([
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
]);

export type SsgKey = z.infer<typeof SsgKeySchema>;
