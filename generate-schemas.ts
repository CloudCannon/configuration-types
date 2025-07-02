#!/usr/bin/env tsx
import fs from 'fs'
import path from 'path'
import * as z from "zod/v4";
import { ConfigurationSchema } from './zod/configuration.ts';
import { JekyllConfigurationSchema } from './zod/build-coupled.ts'
import { HugoConfigurationSchema } from './zod/build-coupled.ts'
import { EleventyConfigurationSchema } from './zod/build-coupled.ts'
import { ReaderConfigurationSchema } from './zod/build-coupled.ts'

const schemas = [
	{
		schema: ConfigurationSchema,
		filename: 'cloudcannon-config.latest.schema.json',
		id: 'https://github.com/cloudcannon/configuration-types/releases/latest/download/cloudcannon-config.latest.schema.json'
	},
	{
		schema: JekyllConfigurationSchema,
		filename: 'cloudcannon-config.legacy-jekyll.schema.json',
		id: 'https://github.com/cloudcannon/configuration-types/releases/latest/download/cloudcannon-config.legacy-jekyll.schema.json'
	},
	{
		schema: HugoConfigurationSchema,
		filename: 'cloudcannon-config.legacy-hugo.schema.json',
		id: 'https://github.com/cloudcannon/configuration-types/releases/latest/download/cloudcannon-config.legacy-hugo.schema.json'
	},
	{
		schema: EleventyConfigurationSchema,
		filename: 'cloudcannon-config.legacy-eleventy.schema.json',
		id: 'https://github.com/cloudcannon/configuration-types/releases/latest/download/cloudcannon-config.legacy-eleventy.schema.json'
	},
	{
		schema: ReaderConfigurationSchema,
		filename: 'cloudcannon-config.legacy-reader.schema.json',
		id: 'https://github.com/cloudcannon/configuration-types/releases/latest/download/cloudcannon-config.legacy-reader.schema.json'
	},
]

for (const schema of schemas) {
    const jsonSchema = z.toJSONSchema(schema.schema, { reused: "ref" })
    fs.writeFileSync(path.join(process.cwd(), 'dist', schema.filename), JSON.stringify(jsonSchema, null, '  '))
    console.log(`✅ ${schema.filename}`)
}
