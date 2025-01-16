export type * from './build-coupled';
export type * from './cascade';
export type * from './configuration';
export type * from './documentation';
export type * from './editables';
export type * from './icon';
export type * from './image-resizeable';
export type * from './inputs';
export type * from './markdown';
export type * from './paths';
export type * from './preview';
export type * from './select-values';
export type * from './snippets';
export type * from './source-editor';
export type * from './structures';
export type * from './timezone';

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
