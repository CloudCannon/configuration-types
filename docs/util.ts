import type { JSONSchema } from 'zod/v4/core';

export interface Example {
	description?: string;
	code: string;
	language?: string;
	source?: string;
	annotations?: string[];
}

export interface DocumentationEntry {
	title?: string;
	description?: string;
	examples?: Example[];
	show_in_navigation?: boolean;
}

export type DocType = JsonSchema['type'] | 'date';

export type JsonSchema = JSONSchema.JSONSchema & {
	documentationType?: DocType;
	excludeFromDocumentation?: boolean;
};

export type PageRef = ({ gid: string } | { type: string }) & {
	documentation?: DocumentationEntry | undefined;
};

export interface Page {
	gid: string;
	title?: DocumentationEntry['title'];
	description?: DocumentationEntry['description'];
	examples?: Example[];
	documentation?: DocumentationEntry;
	developer_documentation?: DocumentationEntry;
	url: string;
	required: boolean;
	key: string;
	full_key: string;
	parent?: string;
	appears_in: string[];
	type: DocType;
	default: JsonSchema['default'];
	enum: JsonSchema['enum'];
	const: JsonSchema['const'];
	uniqueItems: JsonSchema['uniqueItems'];
	items?: PageRef[];
	properties?: Record<string, PageRef>;
	additionalProperties?: PageRef[];
	anyOf?: PageRef[];
}

export function slugify(input: string): string {
	return input
		.toLowerCase()
		.replace(/[^a-z0-9\s-]/g, ' ')
		.trim()
		.replace(/[\s-]+/g, '-');
}

export const verbose: boolean = process.argv.includes('--verbose');
