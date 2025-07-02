import * as z from "zod/v4";

export const SelectValuesSchema = z.union([
	z.array(z.string()),
	z.array(z.record(z.string(), z.string())),
	z.record(z.string(), z.string()),
	z.array(z.record(z.string(), z.unknown())),
	z.record(z.string(), z.unknown())
]);

export type SelectValues = z.infer<typeof SelectValuesSchema>; 