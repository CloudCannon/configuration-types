import * as z from 'zod';

export const SelectDataValuesSchema = z
	.union([
		z.array(z.string()),
		z.array(z.record(z.string(), z.string())),
		z.record(z.string(), z.string()),
		z.array(z.record(z.string(), z.unknown())),
		z.record(z.string(), z.unknown()),
	])
	.meta({
		id: 'SelectDataValues',
		title: 'Select Data Values',
		description:
			'Data formats for populating select and multiselect input options, supporting arrays and objects.',
	});

export const SelectDataSchema = z.record(z.string(), SelectDataValuesSchema).meta({
	id: '_select_data',
	title: 'Select Data',
	description:
		'Fixed datasets that can be referenced by the _Values_ configuration for _Select_ and _Multiselect_ inputs.',
});

export type SelectDataValues = z.infer<typeof SelectDataValuesSchema>;
export type SelectData = z.infer<typeof SelectDataSchema>;
