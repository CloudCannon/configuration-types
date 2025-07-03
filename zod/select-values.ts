import * as z from 'zod/v4';

export const SelectValuesSchema = z.union([
	z.array(z.string()),
	z.array(z.record(z.string(), z.string())),
	z.record(z.string(), z.string()),
	z.array(z.record(z.string(), z.unknown())),
	z.record(z.string(), z.unknown()),
]).meta({
	name: 'SelectValues',
	description: 'Data formats for populating select and multiselect input options, supporting arrays and objects.',
});

export type SelectValues = z.infer<typeof SelectValuesSchema>;
