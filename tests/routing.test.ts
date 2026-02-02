import assert from 'node:assert';
import { test } from 'node:test';
import { HeaderRuleSchema, RouteSchema, RoutingSchema } from '../src/routing.ts';

test('should accept an empty routing configuration', () => {
	const routing = {};

	const result = RoutingSchema.safeParse(routing);
	assert(result.success);
});

test('should accept a minimal route', () => {
	const routing = {
		routes: [
			{
				from: '/old-page',
				to: '/new-page',
			},
		],
	};

	const result = RoutingSchema.safeParse(routing);
	assert(result.success);
});

test('should accept a route with all options', () => {
	const routing = {
		routes: [
			{
				from: '/old/*',
				to: '/new/$1',
				status: 301,
				forced: true,
				substitutions: true,
			},
		],
	};

	const result = RoutingSchema.safeParse(routing);
	assert(result.success);
});

test('should accept all valid status codes', () => {
	const validStatusCodes = [200, 301, 302, 303, 307, 308, 404, 410];

	for (const status of validStatusCodes) {
		const routing = {
			routes: [
				{
					from: '/test',
					to: '/dest',
					status,
				},
			],
		};

		const result = RoutingSchema.safeParse(routing);
		assert(result.success, `Status code ${status} should be valid`);
	}
});

test('should reject invalid status codes', () => {
	const invalidStatusCodes = [100, 201, 400, 500, 999];

	for (const status of invalidStatusCodes) {
		const routing = {
			routes: [
				{
					from: '/test',
					to: '/dest',
					status,
				},
			],
		};

		const result = RoutingSchema.safeParse(routing);
		assert(!result.success, `Status code ${status} should be invalid`);
	}
});

test('should default forced to false', () => {
	const route = {
		from: '/test',
		to: '/dest',
	};

	const result = RouteSchema.parse(route);
	assert.strictEqual(result.forced, false);
});

test('should default substitutions to true', () => {
	const route = {
		from: '/test',
		to: '/dest',
	};

	const result = RouteSchema.parse(route);
	assert.strictEqual(result.substitutions, true);
});

test('should accept header rules', () => {
	const routing = {
		headers: [
			{
				match: '/*',
				headers: [
					{
						name: 'X-Frame-Options',
						value: 'DENY',
					},
				],
			},
		],
	};

	const result = RoutingSchema.safeParse(routing);
	assert(result.success);
});

test('should accept multiple header entries', () => {
	const routing = {
		headers: [
			{
				match: '/api/*',
				headers: [
					{
						name: 'Access-Control-Allow-Origin',
						value: '*',
					},
					{
						name: 'Access-Control-Allow-Methods',
						value: 'GET, POST, PUT, DELETE',
					},
				],
			},
		],
	};

	const result = RoutingSchema.safeParse(routing);
	assert(result.success);
});

test('should accept combined routes and headers', () => {
	const routing = {
		routes: [
			{
				from: '/old-page',
				to: '/new-page',
				status: 301,
			},
		],
		headers: [
			{
				match: '/*',
				headers: [
					{
						name: 'X-Content-Type-Options',
						value: 'nosniff',
					},
				],
			},
		],
	};

	const result = RoutingSchema.safeParse(routing);
	assert(result.success);
});

test('should reject route without from', () => {
	const routing = {
		routes: [
			{
				to: '/new-page',
			},
		],
	};

	const result = RoutingSchema.safeParse(routing);
	assert(!result.success);
});

test('should reject route without to', () => {
	const routing = {
		routes: [
			{
				from: '/old-page',
			},
		],
	};

	const result = RoutingSchema.safeParse(routing);
	assert(!result.success);
});

test('should reject header rule without match', () => {
	const headerRule = {
		headers: [
			{
				name: 'X-Test',
				value: 'test',
			},
		],
	};

	const result = HeaderRuleSchema.safeParse(headerRule);
	assert(!result.success);
});

test('should reject header entry without name', () => {
	const routing = {
		headers: [
			{
				match: '/*',
				headers: [
					{
						value: 'test',
					},
				],
			},
		],
	};

	const result = RoutingSchema.safeParse(routing);
	assert(!result.success);
});

test('should reject header entry without value', () => {
	const routing = {
		headers: [
			{
				match: '/*',
				headers: [
					{
						name: 'X-Test',
					},
				],
			},
		],
	};

	const result = RoutingSchema.safeParse(routing);
	assert(!result.success);
});
