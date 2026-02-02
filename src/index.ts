import * as z from 'zod';

export * from './build-coupled.ts';
export * from './cascade.ts';
export * from './collections.ts';
export * from './configuration.ts';
export * from './documentation.ts';
export * from './editables.ts';
export * from './icon.ts';
export * from './image-options.ts';
export * from './initial-site-settings.ts';
export * from './inputs.ts';
export * from './markdown.ts';
export * from './paths.ts';
export * from './preview.ts';
export * from './routing.ts';
export * from './select-values.ts';
export * from './snippets.ts';
export * from './source-editor.ts';
export * from './structures.ts';
export * from './timezone.ts';

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
