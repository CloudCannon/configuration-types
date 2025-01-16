/**
 * This key defines the appearance and behavior of the Source Editor. The following nested keys are
 * available:
 *
 * - `tab_size`
 * - `show_gutter`
 * - `theme`
 *
 * This key has no default.
 *
 * https://cloudcannon.com/documentation/articles/the-source-editor/#source_editor
 */
export interface SourceEditor {
	/**
	 * This key defines the auto-indentation of each line and how many spaces a tab indentation counts
	 * as.
	 *
	 * By default, this key is `2`.
	 *
	 * https://cloudcannon.com/documentation/articles/the-source-editor/#source_editor.tab_size
	 *
	 * @default 2
	 */
	tab_size?: number;
	/**
	 * This key defines the color theme for syntax highlighting in the Source Editor.
	 *
	 * By default, this key is `monokai`.
	 *
	 * https://cloudcannon.com/documentation/articles/the-source-editor/#source_editor.theme
	 *
	 * @default monokai
	 */
	theme?: Theme;
	/**
	 * This key toggles the gutter on the left of the editing interface, displaying line numbers and
	 * code folding controls.
	 *
	 * By default, this key is `true`.
	 *
	 * https://cloudcannon.com/documentation/articles/the-source-editor/#source_editor.show_gutter
	 *
	 * @default true
	 */
	show_gutter?: boolean;
}

export type Theme =
	| 'ambiance'
	| 'chaos'
	| 'chrome'
	| 'clouds'
	| 'clouds_midnight'
	| 'cobalt'
	| 'crimson_editor'
	| 'dawn'
	| 'dracula'
	| 'dreamweaver'
	| 'eclipse'
	| 'github'
	| 'gob'
	| 'gruvbox'
	| 'idle_fingers'
	| 'iplastic'
	| 'katzenmilch'
	| 'kr_theme'
	| 'kuroir'
	| 'merbivore'
	| 'merbivore_soft'
	| 'mono_industrial'
	| 'monokai'
	| 'nord_dark'
	| 'pastel_on_dark'
	| 'solarized_dark'
	| 'solarized_light'
	| 'sqlserver'
	| 'terminal'
	| 'textmate'
	| 'tomorrow'
	| 'tomorrow_night'
	| 'tomorrow_night_blue'
	| 'tomorrow_night_bright'
	| 'tomorrow_night_eighties'
	| 'twilight'
	| 'vibrant_ink'
	| 'xcode';
