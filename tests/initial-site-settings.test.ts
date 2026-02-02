import assert from 'node:assert';
import { test } from 'node:test';
import {
	InitialSiteSettingsSchema,
	BuildConfigSchema,
	SiteModeSchema,
} from '../src/initial-site-settings.ts';

test('should accept an empty initial site settings configuration', () => {
	const settings = {};

	const result = InitialSiteSettingsSchema.safeParse(settings);
	assert(result.success);
});

test('should accept hosted mode', () => {
	const settings = {
		mode: 'hosted',
	};

	const result = InitialSiteSettingsSchema.safeParse(settings);
	assert(result.success);
});

test('should accept headless mode', () => {
	const settings = {
		mode: 'headless',
	};

	const result = InitialSiteSettingsSchema.safeParse(settings);
	assert(result.success);
});

test('should reject invalid mode', () => {
	const settings = {
		mode: 'invalid',
	};

	const result = InitialSiteSettingsSchema.safeParse(settings);
	assert(!result.success);
});

test('should accept valid ssg values', () => {
	const validSsgs = [
		'astro',
		'bridgetown',
		'docusaurus',
		'eleventy',
		'gatsby',
		'hexo',
		'hugo',
		'jekyll',
		'legacy',
		'lume',
		'mkdocs',
		'nextjs',
		'nuxtjs',
		'sveltekit',
		'sphinx',
		'static',
		'other',
	];

	for (const ssg of validSsgs) {
		const settings = {
			ssg,
		};

		const result = InitialSiteSettingsSchema.safeParse(settings);
		assert(result.success, `SSG '${ssg}' should be valid`);
	}
});

test('should reject invalid ssg values', () => {
	const settings = {
		ssg: 'unknown-ssg',
	};

	const result = InitialSiteSettingsSchema.safeParse(settings);
	assert(!result.success);
});

test('should accept build configuration', () => {
	const settings = {
		build: {
			install_command: 'npm install',
			build_command: 'npm run build',
			output_path: 'dist',
		},
	};

	const result = InitialSiteSettingsSchema.safeParse(settings);
	assert(result.success);
});

test('should accept full build configuration', () => {
	const settings = {
		mode: 'hosted',
		ssg: 'eleventy',
		build: {
			install_command: 'npm ci',
			build_command: 'npm run build',
			output_path: '_site',
			preserve_output: true,
			include_git: true,
			manually_configure_urls: false,
			preserved_paths: 'node_modules\n.cache',
			node_version: '20',
			ruby_version: '3.2',
			hugo_version: '0.120.0',
			deno_version: '1.40',
		},
	};

	const result = InitialSiteSettingsSchema.safeParse(settings);
	assert(result.success);
});

test('should accept environment variables', () => {
	const settings = {
		build: {
			environment_variables: [
				{
					key: 'NODE_ENV',
					value: 'production',
				},
				{
					key: 'API_URL',
					value: 'https://api.example.com',
				},
			],
		},
	};

	const result = InitialSiteSettingsSchema.safeParse(settings);
	assert(result.success);
});

test('should reject environment variable without key', () => {
	const settings = {
		build: {
			environment_variables: [
				{
					value: 'production',
				},
			],
		},
	};

	const result = InitialSiteSettingsSchema.safeParse(settings);
	assert(!result.success);
});

test('should reject environment variable without value', () => {
	const settings = {
		build: {
			environment_variables: [
				{
					key: 'NODE_ENV',
				},
			],
		},
	};

	const result = InitialSiteSettingsSchema.safeParse(settings);
	assert(!result.success);
});

test('should accept mode enum values directly', () => {
	const hostedResult = SiteModeSchema.safeParse('hosted');
	assert(hostedResult.success);

	const headlessResult = SiteModeSchema.safeParse('headless');
	assert(headlessResult.success);
});

test('should accept empty build config', () => {
	const buildConfig = {};

	const result = BuildConfigSchema.safeParse(buildConfig);
	assert(result.success);
});

test('should accept build config with only version fields', () => {
	const buildConfig = {
		node_version: '18',
		ruby_version: '3.1',
	};

	const result = BuildConfigSchema.safeParse(buildConfig);
	assert(result.success);
});
