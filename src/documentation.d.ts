import type { Icon } from './icon';

export interface Documentation {
	/**
	 * The "href" value of the link.
	 */
	url: string;
	/**
	 * The visible text used in the link.
	 */
	text?: string;
	/**
	 * The icon displayed next to the link.
	 *
	 * @default auto_stories
	 */
	icon?: Icon;
}
