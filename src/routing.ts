import * as z from 'zod';

export const RouteStatusSchema = z
	.union([
		z.literal(200),
		z.literal(301),
		z.literal(302),
		z.literal(303),
		z.literal(307),
		z.literal(308),
		z.literal(404),
		z.literal(410),
	])
	.meta({
		id: 'routing.routes.[*].status',
		description:
			'The HTTP status code for this redirect rule. When using 200, 404, and 410 status codes, `to` must refer to a path on the same Site.',
	});

export const RouteSchema = z
	.object({
		from: z.string().meta({
			id: 'routing.routes.[*].from',
			description:
				'The URL pattern to match incoming requests against. CloudCannon routing supports glob-style patterns.',
		}),
		to: z.string().meta({
			id: 'routing.routes.[*].to',
			description:
				'The destination path or URL for this route. Can be a relative path on the same site or an absolute URL for external redirects.',
		}),
		status: RouteStatusSchema.optional(),
		forced: z.boolean().optional().meta({
			id: 'routing.routes.[*].forced',
			description:
				'When true, the redirect will be applied even if a file exists at the `from` path. Default is false.',
		}),
		substitutions: z.boolean().optional().meta({
			id: 'routing.routes.[*].substitutions',
			description:
				'When true, captured segments from glob patterns in `from` will be substituted into the `to` path. Default is true.',
		}),
	})
	.meta({
		id: 'routing.routes.[*]',
		description: 'A single route rule for redirects or rewrites.',
	});

export const HeaderEntrySchema = z
	.object({
		name: z.string().meta({
			id: 'routing.headers.[*].headers.[*].name',
			description: 'The name of the HTTP header to set.',
		}),
		value: z.string().meta({
			id: 'routing.headers.[*].headers.[*].value',
			description: 'The value of the HTTP header.',
		}),
	})
	.meta({
		id: 'routing.headers.[*].headers.[*]',
		description: 'A single HTTP header name-value pair.',
	});

export const HeaderRuleSchema = z
	.object({
		match: z.string().meta({
			id: 'routing.headers.[*].match',
			description:
				'A glob pattern to match request paths against. Headers will be applied to responses for matching paths.',
		}),
		headers: z.array(HeaderEntrySchema).meta({
			id: 'routing.headers.[*].headers',
			description: 'The list of HTTP headers to set for matching requests.',
		}),
	})
	.meta({
		id: 'routing.headers.[*]',
		description: 'A rule for applying custom HTTP headers to matching requests.',
	});

export const RoutingSchema = z
	.object({
		routes: z.array(RouteSchema).optional().meta({
			id: 'routing.routes',
			description:
				'An array of route rules for redirects and rewrites. Rules are processed in order; the first matching rule is applied.',
		}),
		headers: z.array(HeaderRuleSchema).optional().meta({
			id: 'routing.headers',
			description: 'An array of header rules to apply custom HTTP headers to responses.',
		}),
	})
	.meta({
		id: 'type.Routing',
		title: 'Routing',
		description:
			'Configuration for the `.cloudcannon/routing.json` file. Defines redirects, rewrites, and custom HTTP headers for your site.',
	});

export type Routing = z.infer<typeof RoutingSchema>;
export type Route = z.infer<typeof RouteSchema>;
export type HeaderRule = z.infer<typeof HeaderRuleSchema>;
