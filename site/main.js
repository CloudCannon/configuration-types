// AJV
import { betterAjvErrors } from 'https://cdn.jsdelivr.net/npm/@apideck/better-ajv-errors@0.3.6/+esm';
import Ajv from 'https://cdn.jsdelivr.net/npm/ajv@8.17.1/+esm';

// json-schema-library
import { Draft07 } from 'https://cdn.jsdelivr.net/npm/json-schema-library@10.0.0-rc6/+esm';

// Shared
import jsYaml from 'https://cdn.jsdelivr.net/npm/js-yaml@4.1.0/+esm';
import { JSONPath } from 'https://cdn.jsdelivr.net/npm/jsonpath-plus@10.2.0/+esm';

class Schema {
	constructor(url) {
		this.url = url;
	}

	async content() {
		this.fetch ||= fetch(this.url, {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' }
		}).then((response) => response.json());

		return this.fetch;
	}
}

const $input = document.getElementById('input');
const $output = document.getElementById('output');
const $validator = document.getElementById('validator');
const $schema = document.getElementById('schema');

const schemas = {
	latest: new Schema('/cloudcannon-config.latest.schema.json'),
	'legacy-eleventy': new Schema('/cloudcannon-config.legacy-eleventy.schema.json'),
	'legacy-hugo': new Schema('/cloudcannon-config.legacy-hugo.schema.json'),
	'legacy-jekyll': new Schema('/cloudcannon-config.legacy-jekyll.schema.json'),
	'legacy-reader': new Schema('/cloudcannon-config.legacy-reader.schema.json')
}

let activeSchema = schemas.latest;
const ajv = new Ajv({ strict: 'log', allErrors: true, verbose: true });
const editor = ace.edit($input, { mode: "ace/mode/yaml", selectionStyle: "text" });
let useAjv = false;

$validator.addEventListener('change', () => {
	useAjv = $validator.checked;
	runValidate();
})

$schema.addEventListener('change', () => {
	activeSchema = schemas[$schema.value];
	runValidate();
})

function renderAllowedValues(entry) {
	if (!entry.context?.allowedValues) {
		return '';
	}

	return `
		<details>
			<summary>Allowed values</summary>
			${entry.context?.allowedValues?.map?.((value) => `<code>${encodeHtml(value)}</code>`).join(' ') || ''}
		</details>
	`;
}

function codeify(value) {
	return value
		?.replace(/'([^']+)'/g, (match, contents) => `<code>${encodeHtml(contents)}</code>`);
}

function emify(value) {
	return value
		?.replace(/'([^']+)'/g, (match, contents) => `<em>${encodeHtml(contents)}</em>`);
}

function encodeHtml(html) {
	if (typeof html === 'string' || typeof html === 'number' || typeof html === 'boolean') {
		return html
			?.toString()
			?.replace(/\&/g, '&amp;')
			?.replace(/\</g, '&lt;')
			?.replace(/\>/g, '&gt;')
			?.replace(/\"/g, '&quot;')
			?.replace(/\'/g, '&#x27;')
			?.replace(/\//g, '&#x2F;');
	}

	return '';
}

function renderErrorJsonSchemaLibrary(error) {
	const path = encodeHtml(
		error.data.pointer.replace(/^#\//, '$.').replace(/^#$/, '$').replace(/\//g, '.')
	);
	switch (error.code) {
		case 'type-error':
			return `
				<p>
					Unexpected type <em>${encodeHtml(error.data.received)}</em> instead of <em>${encodeHtml(error.data.expected)}</em> for <code>${path}</code>.
				</p>
			`;
		case 'enum-error':
			return `
				<p>
					Unexpected value${error.data.value ? ` <em>${encodeHtml(error.data.value)}</em>` : ''} for <code>${path}</code>.
				</p>
				<details>
					<summary>Allowed values</summary>
					${error.data?.values?.map?.((value) => `<code>${encodeHtml(value)}</code>`).join(' ') || ''}
				</details>
			`;
		case 'required-property-error':
			return `
				<p>
					Missing required property <code>${encodeHtml(error.data.key)}</code> for <code>${path}</code>.
				</p>
			`;
		case 'any-of-error':
			return `
				<p>
					Value did not match any expected schema for <code>${path}</code>.
				</p>
			`;
		case 'no-additional-properties-error':
			return `
				<p>
					Unused additional property <code>${encodeHtml(error.data.property)}</code> in <code>${path}</code>.
				</p>
			`;
		case 'const-error':
			return `
				<p>
					Value ${error.data.value ? ` <em>${encodeHtml(error.data.value)}</em>` : ''} for <code>${path}</code> should be <em>${encodeHtml(error.data.expected)}</em>.
				</p>
			`;
	}

	return `
		<p>
			${encodeHtml(error.message)}
		</p>
	`;
}

async function runValidateJsonSchemaLibrary() {
	try {
		const schema = await activeSchema.content();
		console.log("schema", schema)
		const data = jsYaml.load(editor.getValue());
		const jsonSchema = new Draft07(schema);
		const errors = jsonSchema.validate(data);

		if (errors.length) {
			console.debug('json-schema-library', errors)

			$output.innerHTML = `
				<h2><strong>Invalid</strong> (${errors.length} issues)</h2>
				<ol>${errors.map((error) => `<li>${renderErrorJsonSchemaLibrary(error)}</li>`).join('')}</ol>
			`;
		} else {
			$output.innerHTML = '<h2><strong>Valid</strong></h2><p>No issues found 🎉</p>';
		}
	} catch (e) {
		console.error(e);

		$output.innerHTML = `
			<h2><strong>Error</strong></h2>
			<pre>${encodeHtml(e?.name) || 'Unknown'}: ${encodeHtml(e?.message) || 'No details'}</pre>
		`;
	}
}

function renderTextAjv(entry, data) {
	switch (entry.context.errorType) {
		case 'type': {
			const [, expectedType] = entry.message.split(' property type must be ');
			return `
				<p>
					<code>${encodeHtml(entry.path)}</code> should be of type ${encodeHtml(expectedType)}.
					${encodeHtml(entry.suggestion) || ''}
				</p>
			`;
		}

		case 'enum': {
			const [currentValue] = JSONPath({ path: entry.path, json: data });
			return `
				<p>
					<code>${encodeHtml(entry.path)}</code> has unexpected value${currentValue ? `: <em>${encodeHtml(currentValue)}</em>` : ''}.
					${emify(entry.suggestion) || ''}
				</p>`;
		}

		case 'required': {
			const [path, property] = entry.message.split(' must have required property ');
			return `
				<p>
					Missing required property ${codeify(property)} in <code>${encodeHtml(path)}</code>.
					${codeify(entry.suggestion) || ''}
				</p>
			`;
		}

		case 'anyOf': {
			return `
				<p>
					<code>${encodeHtml(entry.path)}</code> does not match any expected format.
					${codeify(entry.suggestion) || ''}
				</p>
			`;
		}

		case 'additionalProperties': {
			const [property] = entry.message.split(' property is not expected to be here');
			return `
				<p>
					Unexpected property ${codeify(property)} in <code>${encodeHtml(entry.path)}</code>.
					${codeify(entry.suggestion) || ''}
				</p>
			`;
		}
	}

	return `
		<p>
			${encodeHtml(entry.message)} at <code>${encodeHtml(encodeHtml(entry.path))}</code>.
			${encodeHtml(entry.suggestion) || ''}
		</p>
	`;
}

async function runValidateAjv() {
	try {
		const schema = await activeSchema.content();
		const ajvValidate = ajv.compile(schema);
		const data = jsYaml.load(editor.getValue());
		const valid = ajvValidate(data);

		if (valid) {
			$output.innerHTML = '<h2><strong>Valid</strong></h2><p>No issues found 🎉</p>';
		} else {
			const output = betterAjvErrors({
				schema,
				data,
				errors: ajvValidate.errors,
				basePath: '$'
			});

			console.debug('ajv', ajvValidate.errors)
			console.debug('apideck', output);

			$output.innerHTML = `
				<h2><strong>Invalid</strong> (${output.length} issues)</h2>
				<ol>${output.map((entry) => `<li>${renderTextAjv(entry, data)}${renderAllowedValues(entry)}</li>`).join('')}</ol>
			`;
		}
	} catch (e) {
		console.error(e)

		$output.innerHTML = `
			<h2><strong>Error</strong></h2>
			<pre>${encodeHtml(e?.name) || 'Unknown'}: ${encodeHtml(e?.message) || 'No details'}</pre>
		`;
	}
}

function runValidate() {
	if (useAjv) {
		runValidateAjv();
	} else {
		runValidateJsonSchemaLibrary()
	}
}

editor.session.on('change', runValidate);
runValidate();
