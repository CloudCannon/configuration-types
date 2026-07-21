import assert from 'node:assert';
import { test } from 'node:test';
import { formatInstancePath, loadValidator } from '../src/validate.ts';

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
