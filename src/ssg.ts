import * as z from 'zod';

const SSG_KEYS = [
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
] as const;

export const SsgKeySchema = z.enum(SSG_KEYS);

export type SsgKey = (typeof SSG_KEYS)[number];
