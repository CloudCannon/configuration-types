import type { ReducedCascade } from './cascade';
import type { Documentation } from './documentation';
import type { Icon } from './icon';
import type { ObjectInputGroup } from './inputs';
import type { WithPickerPreview, WithPreview } from './preview';

interface StructureBase {
	/**
	 * If true, inputs are sorted to match when editing. Extra inputs are ordered after expected
	 * inputs, unless `remove_extra_inputs` is true. Defaults to true.
	 */
	reorder_inputs?: boolean;
	/**
	 * Hides unexpected inputs when editing. Has no effect if `remove_extra_inputs` is true. Defaults
	 * to false.
	 */
	hide_extra_inputs?: boolean;
	/**
	 * If checked, empty inputs are removed from the source file on save. Removed inputs will be
	 * available for editing again, provided they are in the matching schema/structure. Defaults to
	 * false.
	 */
	remove_empty_inputs?: boolean;
	/**
	 * If checked, extra inputs are removed when editing. Defaults to true.
	 */
	remove_extra_inputs?: boolean;
}

export interface Structure extends StructureBase {
	/**
	 * Defines what values are available to add when using this structure.
	 */
	values: StructureValue[];
	/**
	 * Defines what key should be used to detect which structure an item is. If this key is not found
	 * in the existing structure, a comparison of key names is used. Defaults to "_type".
	 */
	id_key?: string;
	/**
	 * Defines whether options are shown to your editors in a select menu (select, default) or a modal
	 * pop up window (modal) when adding a new item.
	 *
	 * @default select
	 */
	style?: 'select' | 'modal';
}

export interface StructureValue extends WithPreview, WithPickerPreview, StructureBase, ReducedCascade {
	/**
	 * A unique reference value used when referring to this structure value from the Object input's
	 * assigned_structures option.
	 */
	id?: string;
	/**
	 * If set to true, this item will be considered the default type for this structure. If the type
	 * of a value within a structure cannot be inferred based on its id_key or matching fields, then
	 * it will fall back to this item. If multiple items have default set to true, only the first item
	 * will be used.
	 *
	 * @default false
	 */
	default?: boolean;
	/**
	 * An icon used when displaying the structure (defaults to either format_list_bulleted for items
	 * in arrays, or notes otherwise).
	 */
	icon?: Icon;
	/**
	 * Path to an image in your source files used when displaying the structure. Can be either a
	 * source (has priority) or output path.
	 */
	image?: string;
	/**
	 * Used as the main text in the interface for this value.
	 */
	label?: string;
	/**
	 * Used to group and filter items when selecting from a modal.
	 */
	tags?: string[];
	/**
	 * Allows you to group the inputs inside this object together without changing the data structure.
	 */
	groups?: ObjectInputGroup[];
	/**
	 * Controls which order input groups and ungrouped inputs appear in.
	 *
	 * @default false
	 */
	place_groups_below?: boolean;
	/**
	 * Show nested objects as tabs. Requires all top-level keys to be objects.
	 *
	 * @default false
	 */
	tabbed?: boolean;
	/**
	 * The actual value used when items are added after selection.
	 */
	value: unknown;
	/**
	 * Provides short descriptive text for editors shown in the Data Editor for expanded values
	 * matching this Structure value. Has no default. Supports a limited set of Markdown: links, bold,
	 * italic, subscript, superscript, and inline code elements are allowed.
	 */
	comment?: string;
	/**
	 * Provides a custom link for documentation for editors shown in the Data Editor for expanded
	 * values matching this Structure value. Has no default.
	 */
	documentation?: Documentation;
}
