export type * from './icon';
export type * from './timezone';
export type * from './mime-type';
export type * from './theme';
export type * from './syntax';
export type * from './markdown';
export type * from './configuration';
export type * from './build-coupled';

export type SsgKey =
	| 'hugo'
	| 'jekyll'
	| 'eleventy'
	| 'astro'
	| 'lume'
	| 'mkdocs'
	| 'nextjs'
	| 'sveltekit'
	| 'bridgetown'
	| 'docusaurus'
	| 'gatsby'
	| 'hexo'
	| 'nuxtjs'
	| 'sphinx'
	| 'static'
	| 'legacy'
	| 'other';
