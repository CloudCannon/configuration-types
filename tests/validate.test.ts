import assert from 'node:assert';
import { test } from 'node:test';
import { formatInstancePath, loadValidator, type SchemaName } from '../src/validate.ts';

function messages(
	data: unknown,
	errors: ReturnType<Awaited<ReturnType<typeof loadValidator>>['validate']>
) {
	return errors.map((e) => `${formatInstancePath(e.error.instancePath, data)}: ${e.message}`);
}

test('should accept null for a nullable key', async () => {
	const validator = await loadValidator('global');
	assert.deepEqual(validator.validate({ _inputs: null }), []);
});

test('should report the non-null branch error instead of the nullable fallback', async () => {
	const validator = await loadValidator('global');
	const data = { _inputs: { title: { type: 'text', wat: true } } };
	const rendered = messages(data, validator.validate(data));

	assert.deepEqual(rendered, ['$._inputs.title: unexpected property wat']);
});

test('should not list null as an allowed type for a nullable key given the wrong type', async () => {
	const validator = await loadValidator('global');
	const data = { collection_groups: [{ heading: 5, collections: [] }] };
	const rendered = messages(data, validator.validate(data));

	assert.deepEqual(rendered, [
		'$.collection_groups[0].heading: unexpected type number, allowed types: string',
	]);
});

test('should report errors nested inside a nullable options object', async () => {
	const validator = await loadValidator('global');
	const data = { _inputs: { tags: { type: 'array', options: { disable_add: null } } } };
	const rendered = messages(data, validator.validate(data));

	assert.deepEqual(rendered, [
		'$._inputs.tags.options.disable_add: unexpected type null, allowed types: boolean',
	]);
});

test('should report a missing required property once across union branches', async () => {
	const validator = await loadValidator('global');
	const data = { _inputs: { title: { wat: true } } };
	const rendered = messages(data, validator.validate(data));

	assert.deepEqual(rendered, ['$._inputs.title: must have required property type']);
});

// Every schema name `loadValidator` accepts. Kept in step with `SchemaName` by the type annotation.
const SCHEMA_NAMES: SchemaName[] = [
	'global',
	'legacy-jekyll',
	'legacy-hugo',
	'legacy-eleventy',
	'legacy-reader',
	'settings',
	'routing',
	'collections_config_from_glob',
	'schemas_from_glob',
	'_editables_from_glob',
	'_inputs_from_glob',
	'_snippets_from_glob',
	'_snippets_definitions_from_glob',
	'_snippets_imports_from_glob',
	'_structures_from_glob',
	'values_from_glob',
];

for (const name of SCHEMA_NAMES) {
	test(`should compile and identify the ${name} schema`, async () => {
		const validator = await loadValidator(name);

		assert.doesNotThrow(() => validator.validate({}));
		assert.equal(typeof validator.schema.$id, 'string');
	});
}
