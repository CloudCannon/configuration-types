import type { Editables } from './editables';
import type { Input } from './inputs';
import type { SelectValues } from './select-values';
import type { Structure } from './structures';

export type EditorKey = 'visual' | 'content' | 'data';

export interface ReducedCascade {
	/**
	 * Controls the behavior and appearance of your inputs in all data editing interfaces.
	 */
	_inputs?: Record<string, Input>;
	/**
	 * Fixed datasets that can be referenced by the _Values_ configuration for _Select_ and
	 * _Multiselect_ inputs.
	 */
	_select_data?: Record<string, SelectValues>;
	/**
	 * Structured values for editors adding new items to arrays and objects. Entries here can be
	 * referenced in the configuration for `array` or `object` inputs.
	 */
	_structures?: Record<string, Structure>;
}

export interface Cascade extends ReducedCascade {
	/**
	 * Set a preferred editor and/or disable the others. The first value sets which editor opens by
	 * default, and the following values specify which editors are accessible.
	 *
	 * @uniqueItems
	 */
	_enabled_editors?: EditorKey[];
	/**
	 * Contains input options for Editable Regions and the Content Editor.
	 */
	_editables?: Editables;
}
