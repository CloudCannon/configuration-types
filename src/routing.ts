import * as z from 'zod';

/**
 * HTTP status codes allowed for routing rules.
 * Note: Using union of literals since z.enum() doesn't support numbers.
 */
export const RouteStatusSchema = z
	.union([
		z.literal(200),
		z.literal(301),
		z.literal(302),
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

/**
 * A single redirect rule in the routes array.
 */
export const RouteSchema = z
	.object({
		from: z.string().meta({
			id: 'routing.routes.[*].from',
			description:
				'Defines which URL should trigger this redirect rule. Supports plain text or REGEX (re2 syntax). URLs must start with `/`.',
		}),
		to: z.string().meta({
			id: 'routing.routes.[*].to',
			description:
				'The destination URL for this redirect. Supports REGEX substitutions like `$1` or `$2`.',
		}),
		status: RouteStatusSchema.optional(),
		forced: z.boolean().default(true).optional().meta({
			id: 'routing.routes.[*].forced',
			description:
				'Whether the redirect takes priority even if the web server finds content at the requested URL. Set to `false` to only redirect when no content exists.',
		}),
		substitutions: z.boolean().default(true).optional().meta({
			id: 'routing.routes.[*].substitutions',
			description:
				'Whether to process REGEX substitutions in the `to` value. Set to `false` if your URL contains characters like `$1` that should be literal.',
		}),
	})
	.meta({
		id: 'routing.routes.[*]',
		title: 'Route',
		description: 'A redirect rule for URLs on CloudCannon hosted Sites.',
	});

/**
 * Allowed HTTP header names.
 */
export const HeaderNameSchema = z
	.enum([
		'access-control-allow-headers',
		'access-control-allow-methods',
		'access-control-allow-origin',
		'content-security-policy',
		'content-security-policy-report-only',
		'content-type',
		'expect-ct',
		'large-allocation',
		'permissions-policy',
		'referrer-policy',
		'sourcemap',
		'strict-transport-security',
		'x-content-type-options',
		'x-frame-options',
		'x-robots-tag',
		'x-xss-protection',
	])
	.meta({
		id: 'routing.headers.[*].headers.[*].name',
		description: 'The HTTP header name to provide to the client.',
	});

/**
 * A single header entry within a header rule.
 */
export const HeaderEntrySchema = z
	.object({
		name: HeaderNameSchema,
		value: z.string().meta({
			id: 'routing.headers.[*].headers.[*].value',
			description: 'The header value. Accepted values depend on the header name.',
		}),
	})
	.meta({
		id: 'routing.headers.[*].headers.[*]',
		title: 'Header Entry',
		description: 'An HTTP header name and value pair.',
	});

/**
 * A header rule that applies headers to matching URLs.
 */
export const HeaderRuleSchema = z
	.object({
		match: z.string().meta({
			id: 'routing.headers.[*].match',
			description:
				'URL pattern to match. Supports plain text or REGEX (re2 syntax). Must start with `/`.',
		}),
		headers: z.array(HeaderEntrySchema).optional().meta({
			id: 'routing.headers.[*].headers',
			description: 'Headers to apply to matching URLs.',
		}),
	})
	.meta({
		id: 'routing.headers.[*]',
		title: 'Header Rule',
		description: 'Defines custom headers for matching URLs.',
	});

/**
 * The root routing configuration schema.
 */
export const RoutingSchema = z
	.object({
		routes: z.array(RouteSchema).optional().meta({
			id: 'routing.routes',
			description: 'Custom redirects for URLs on your hosted Site.',
		}),
		headers: z.array(HeaderRuleSchema).optional().meta({
			id: 'routing.headers',
			description: 'Custom headers for URLs on your hosted Site.',
		}),
	})
	.meta({
		id: 'type.Routing',
		title: 'Routing',
		description:
			'Configure custom redirects and headers for your CloudCannon hosted Site.',
	});

export type Route = z.infer<typeof RouteSchema>;
export type HeaderEntry = z.infer<typeof HeaderEntrySchema>;
export type HeaderRule = z.infer<typeof HeaderRuleSchema>;
export type Routing = z.infer<typeof RoutingSchema>;
