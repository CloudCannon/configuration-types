import * as z from 'zod';

const _SelectDataValuesSchema = z
	.union([
		z.array(z.string()).meta({ title: 'Text Array' }),
		z.record(z.string(), z.string()).meta({ title: 'Text Object' }),
		z.array(z.record(z.string(), z.unknown())).meta({ title: 'Object Array' }),
		z.record(z.string(), z.unknown()).meta({ title: 'Object' }),
	])
	.meta({
		description:
			'Data formats for populating select and multiselect input options, supporting arrays and objects.',
	});
export type SelectDataValues = z.infer<typeof _SelectDataValuesSchema>;
export const SelectDataValuesSchema: z.ZodType<SelectDataValues> = _SelectDataValuesSchema;

const _SelectDataSchema = z.record(z.string(), SelectDataValuesSchema).meta({
	id: 'type._select_data',
	title: 'Select Data',
	description:
		'Fixed datasets that can be referenced by the _Values_ configuration for _Select_ and _Multiselect_ inputs.',
});
export interface SelectData extends z.infer<typeof _SelectDataSchema> {}
export const SelectDataSchema: z.ZodType<SelectData> = _SelectDataSchema;
