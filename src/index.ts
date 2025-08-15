import * as z from 'zod';

export * from './build-coupled';
export * from './cascade';
export * from './configuration';
export * from './documentation';
export * from './editables';
export * from './icon';
export * from './image-options';
export * from './inputs';
export * from './markdown';
export * from './paths';
export * from './preview';
export * from './select-values';
export * from './snippets';
export * from './source-editor';
export * from './structures';
export * from './timezone';

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
