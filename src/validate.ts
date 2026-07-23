import { Ajv, type AnySchemaObject, type ErrorObject, type ValidateFunction } from 'ajv';
import { closest } from 'fastest-levenshtein';

// Shared validation + error-presentation for CloudCannon config schemas. `validate` compiles a schema
// (cached per schema object), runs AJV, and turns its raw `allErrors` output into a concise, de-noised
// set of messages. Consumers own how schemas are loaded (the editor's linter dynamically imports them;
// the CLI imports them statically) and decide how to render the result — only `highlight` (how
// emphasised values are wrapped) is injected. Keep this free of IO and console specifics.

export interface ValidationError {
	/** The surviving AJV error (possibly rebased into a union branch or aggregated). */
	error: ErrorObject;
	/** Rendered message, with emphasised values wrapped via the provided `highlight`. */
	message: string;
}

export interface ValidateOptions {
	/** Wraps emphasised values (offending value, allowed values, …). Defaults to `String`. */
	highlight?: (value: unknown) => string;
}

/** A named config schema this package can validate against. */
export type SchemaName =
	| 'global'
	| 'legacy-jekyll'
	| 'legacy-hugo'
	| 'legacy-eleventy'
	| 'legacy-reader'
	| 'settings'
	| 'routing'
	| 'collections_config_from_glob'
	| 'schemas_from_glob'
	| '_editables_from_glob'
	| '_inputs_from_glob'
	| '_snippets_from_glob'
	| '_snippets_definitions_from_glob'
	| '_snippets_imports_from_glob'
	| '_structures_from_glob'
	| 'values_from_glob';

type SchemaModule = () => Promise<{ default: AnySchemaObject }>;

// The config schemas this package builds, keyed by the names consumers already use: the top-level
// files plus configuration-loader's `*_from_glob` split-file keys (kept in sync by name — this repo
// owns the config schema those keys describe). `build:schema-modules` emits each schema as a JS module
// next to this one in `dist/`; `../dist/...` resolves there from both `src/validate.ts` and the built
// `dist/validate.js`. They're JS (not JSON) modules so they load identically in Node and the browser,
// and each is a dynamic import so bundlers code-split it into its own chunk.
const SCHEMA_FILES: Record<SchemaName, SchemaModule> = {
	global: () => import('../dist/cloudcannon-config.latest.schema.js'),
	'legacy-jekyll': () => import('../dist/cloudcannon-config.legacy-jekyll.schema.js'),
	'legacy-hugo': () => import('../dist/cloudcannon-config.legacy-hugo.schema.js'),
	'legacy-eleventy': () => import('../dist/cloudcannon-config.legacy-eleventy.schema.js'),
	'legacy-reader': () => import('../dist/cloudcannon-config.legacy-reader.schema.js'),
	settings: () => import('../dist/cloudcannon-initial-site-settings.schema.js'),
	routing: () => import('../dist/cloudcannon-routing.schema.js'),
	collections_config_from_glob: () => import('../dist/cloudcannon-collections.schema.js'),
	schemas_from_glob: () => import('../dist/cloudcannon-schemas.schema.js'),
	_editables_from_glob: () => import('../dist/cloudcannon-editables.schema.js'),
	_inputs_from_glob: () => import('../dist/cloudcannon-inputs.schema.js'),
	_snippets_from_glob: () => import('../dist/cloudcannon-snippets.schema.js'),
	_snippets_definitions_from_glob: () =>
		import('../dist/cloudcannon-snippets-definitions.schema.js'),
	_snippets_imports_from_glob: () => import('../dist/cloudcannon-snippets-imports.schema.js'),
	_structures_from_glob: () => import('../dist/cloudcannon-structures.schema.js'),
	values_from_glob: () => import('../dist/cloudcannon-structure-value.schema.js'),
};

/** Whether `value` names a schema this package can validate against (i.e. is a `SchemaName`). */
export function isSchemaName(value: string | undefined): value is SchemaName {
	return !!value && Object.hasOwn(SCHEMA_FILES, value);
}

export interface PreparedValidator {
	/** The loaded root schema (e.g. for resolving the schema at a hovered path). */
	schema: AnySchemaObject;
	/** Validates `data`, returning concise errors — empty when valid. */
	validate(data: unknown): ValidationError[];
}

interface CompiledSchema {
	schema: AnySchemaObject;
	ajvValidate: ValidateFunction;
}

// Loaded + compiled once per name (the import and AJV compile are the expensive parts). Only the
// cheap presentation wrapper is rebuilt per `loadValidator` call, so each consumer's `options` apply.
const compiledByName = new Map<SchemaName, Promise<CompiledSchema>>();

/**
 * Loads (and caches) the schema for `name`, returning a validator bound to it. Async because schemas
 * are lazily imported; the returned `validate` is synchronous, so consumers load once and validate
 * many times. Narrow untyped input with `isSchemaName` first.
 */
export async function loadValidator(
	name: SchemaName,
	options: ValidateOptions = {}
): Promise<PreparedValidator> {
	let compiling = compiledByName.get(name);
	if (!compiling) {
		compiling = SCHEMA_FILES[name]().then((module) => {
			const schema = module.default;
			return { schema, ajvValidate: ajv.compile(schema) };
		});
		compiledByName.set(name, compiling);
	}

	const { schema, ajvValidate } = await compiling;
	return {
		schema,
		validate: (data: unknown) =>
			ajvValidate(data) ? [] : presentErrors(ajvValidate.errors ?? [], schema, options),
	};
}

/**
 * Turns raw AJV `allErrors` output into concise, presentation-ready errors: suppresses non-matching
 * union-branch noise, aggregates branch expectations, trims redundant structural errors, then renders
 * each message.
 */
function presentErrors(
	errors: readonly ErrorObject[],
	rootSchema: AnySchemaObject,
	options: ValidateOptions = {}
): ValidationError[] {
	const highlight = options.highlight ?? ((value: unknown) => String(value));
	const presented = filterStructuralErrors(
		aggregateBranchExpectations(suppressNonMatchingBranchErrors([...errors], rootSchema))
	);
	return presented.map((error) => ({ error, message: formatError(error, highlight) }));
}

/**
 * Renders an AJV instancePath as a JS-style accessor. Walks the parsed data so a numeric segment only
 * becomes a bracketed index when it actually indexes an array — a numeric object key (e.g. {"0": …})
 * stays a dotted key: "/values/1/_inputs" -> "$.values[1]._inputs".
 */
export function formatInstancePath(instancePath: string, data: unknown): string {
	let result = '$';
	let current = data;

	for (const segment of instancePath.split('/').slice(1)) {
		// instancePath is a JSON Pointer: ~1 is an escaped "/" and ~0 an escaped "~" within a key.
		const key = segment.replace(/~1/g, '/').replace(/~0/g, '~');
		result += Array.isArray(current) ? `[${key}]` : `.${key}`;
		current =
			current && typeof current === 'object'
				? (current as Record<string, unknown>)[key]
				: undefined;
	}

	return result;
}

// --- internals -------------------------------------------------------------------------------

const DISCRIMINATOR = 'type';
const MAX_BRANCH_DEPTH = 5;

// `verbose` is required: the pipeline reads `error.data` / `error.parentSchema`, which AJV only
// populates in verbose mode. `allErrors` is required to collect every failure, not just the first.
const ajv = new Ajv({ strict: false, allErrors: true, verbose: true });

const branchAjv = new Ajv({ strict: false, allErrors: true, verbose: true });
const branchValidators = new WeakMap<object, ValidateFunction | null>();

function suppressNonMatchingBranchErrors(
	errors: ErrorObject[],
	rootSchema: AnySchemaObject,
	depth = 0
): ErrorObject[] {
	if (depth > MAX_BRANCH_DEPTH) {
		return errors;
	}

	// Group the union (anyOf/oneOf) errors by the instance location they apply to.
	const unionsByPath = new Map<string, ErrorObject[]>();
	for (const error of errors) {
		if (error.keyword === 'anyOf' || error.keyword === 'oneOf') {
			const existing = unionsByPath.get(error.instancePath);
			if (existing) {
				existing.push(error);
			} else {
				unionsByPath.set(error.instancePath, [error]);
			}
		}
	}

	const replacements: Array<{ path: string; errors: ErrorObject[] }> = [];

	// Process outer unions before nested ones so a replaced subtree's inner unions are handled by the
	// recursion below rather than against the (about to be discarded) original errors.
	const paths = Array.from(unionsByPath.keys()).sort((a, b) => a.length - b.length);
	for (const path of paths) {
		if (replacements.some((r) => r.path !== path && isUnderPath(path, r.path))) {
			continue;
		}

		// Prefer the most specific (deepest) union reported at this location.
		const unions = unionsByPath.get(path) ?? [];
		unions.sort((a, b) => b.schemaPath.length - a.schemaPath.length);

		for (const union of unions) {
			const branchErrors =
				matchedBranchErrors(union, rootSchema) ?? nullableWrapperErrors(union, rootSchema);
			if (!branchErrors) {
				continue;
			}

			const rebased = branchErrors.map((error) => ({
				...error,
				instancePath: path + error.instancePath,
			}));
			replacements.push({
				path,
				errors: suppressNonMatchingBranchErrors(rebased, rootSchema, depth + 1),
			});
			break;
		}
	}

	if (replacements.length === 0) {
		return errors;
	}

	const kept = errors.filter(
		(error) => !replacements.some((r) => isUnderPath(error.instancePath, r.path))
	);
	return [...kept, ...replacements.flatMap((r) => r.errors)];
}

function isUnderPath(path: string, base: string): boolean {
	return path === base || path.startsWith(`${base}/`);
}

// Inputs are the only `type`-discriminated union in CloudCannon's schemas, so the suppression is
// scoped to input positions: an entry in an `_inputs` map, or — when validating a standalone inputs
// split file — a top-level entry (the file itself is an `_inputs` map).
function isInputUnion(instancePath: string, rootSchema: AnySchemaObject): boolean {
	const parent = instancePath.slice(0, instancePath.lastIndexOf('/'));
	if (parent.endsWith('/_inputs')) {
		return true;
	}
	return (
		typeof rootSchema.$id === 'string' &&
		rootSchema.$id.endsWith('cloudcannon-inputs.schema.json') &&
		instancePath.lastIndexOf('/') === 0
	);
}

// If `union` is a discriminated input union whose `type` matches a branch (and at least one other
// branch rejects it), re-validates the data against the matching branch(es) and returns their
// errors.
function matchedBranchErrors(
	union: ErrorObject,
	rootSchema: AnySchemaObject
): ErrorObject[] | undefined {
	if (!isInputUnion(union.instancePath, rootSchema)) {
		return undefined;
	}

	const branches = union.parentSchema?.[union.keyword];
	const data = union.data;
	if (!Array.isArray(branches) || !data || typeof data !== 'object') {
		return undefined;
	}

	const actual = (data as Record<string, unknown>)[DISCRIMINATOR];
	if (actual === undefined) {
		return undefined;
	}

	let discriminated = 0;
	const matched: AnySchemaObject[] = [];
	for (const branch of branches) {
		const allowed = branchDiscriminatorValues(branch, rootSchema);
		if (!allowed) {
			continue;
		}
		discriminated += 1;
		if (allowed.includes(actual)) {
			matched.push(branch);
		}
	}

	// Only suppress when this really is a discriminated union: something matched, and at least one
	// other discriminated branch didn't (otherwise there's no cross-branch noise to remove).
	if (matched.length === 0 || discriminated <= matched.length) {
		return undefined;
	}

	const result: ErrorObject[] = [];
	for (const branch of matched) {
		const branchErrors = revalidateBranch(data, branch, rootSchema);
		if (!branchErrors) {
			return undefined;
		}
		result.push(...branchErrors);
	}
	return result;
}

// `.nullable()` emits as `anyOf: [X, {type: 'null'}]`, where null only exists to silence the key.
// When non-null data fails such a wrapper, X is the only branch that can apply: re-validates
// against X so its errors are presented instead of the wrapper's "must be null" noise.
function nullableWrapperErrors(
	union: ErrorObject,
	rootSchema: AnySchemaObject
): ErrorObject[] | undefined {
	if (union.keyword !== 'anyOf' || union.data === null) {
		return;
	}

	const branches = union.parentSchema?.anyOf;
	if (!Array.isArray(branches)) {
		return;
	}

	const nonNullBranches = branches.filter(
		(branch) => resolveRef(branch, rootSchema)?.type !== 'null'
	);
	if (nonNullBranches.length !== 1 || nonNullBranches.length === branches.length) {
		return;
	}

	return revalidateBranch(union.data, nonNullBranches[0], rootSchema);
}

function branchDiscriminatorValues(
	branch: unknown,
	rootSchema: AnySchemaObject
): unknown[] | undefined {
	const type = resolveRef(branch, rootSchema)?.properties?.[DISCRIMINATOR];

	if (!type || typeof type !== 'object') {
		return undefined;
	}

	if ('const' in type) {
		return [type.const];
	}

	return Array.isArray(type.enum) ? type.enum : undefined;
}

function resolveRef(
	schema: unknown,
	rootSchema: AnySchemaObject,
	depth = 0
): AnySchemaObject | undefined {
	if (schema && typeof schema === 'object' && depth <= MAX_BRANCH_DEPTH && '$ref' in schema) {
		if (typeof schema.$ref === 'string') {
			const match = schema.$ref.match(/^#\/(definitions|\$defs)\/(.+)$/);
			if (match) {
				const dictionary = (rootSchema as Record<string, AnySchemaObject>)[match[1]];
				return resolveRef(dictionary?.[match[2]], rootSchema, depth + 1);
			}
		}
	}
	return (schema ?? undefined) as AnySchemaObject | undefined;
}

function revalidateBranch(
	data: unknown,
	branch: AnySchemaObject,
	rootSchema: AnySchemaObject
): ErrorObject[] | undefined {
	let validate = branchValidators.get(branch);
	if (validate === undefined) {
		try {
			validate = branchAjv.compile({
				allOf: [branch],
				definitions: rootSchema.definitions,
				$defs: rootSchema.$defs,
			});
		} catch {
			validate = null;
		}
		branchValidators.set(branch, validate);
	}

	if (!validate) {
		return;
	}

	validate(data);
	return (validate.errors ?? []).map((error) => ({ ...error }));
}

// When a field fails against multiple oneOf/anyOf branches, AJV reports one error per branch. This
// collapses the duplicates into one error per kind of mismatch: const/enum branches merge into one
// "allowed values: ..." list, and `type` branches merge into one "instead of string or object".
function aggregateBranchExpectations(errors: ErrorObject[]): ErrorObject[] {
	const valuesByPath = new Map<string, Set<unknown>>();
	const typesByPath = new Map<string, Set<string>>();

	for (const error of errors) {
		if (error.keyword === 'const') {
			addTo(valuesByPath, error.instancePath, [error.params.allowedValue]);
		} else if (error.keyword === 'enum') {
			addTo(valuesByPath, error.instancePath, error.params.allowedValues);
		} else if (error.keyword === 'type') {
			const type = error.params.type;
			addTo(typesByPath, error.instancePath, Array.isArray(type) ? type : [type]);
		}
	}

	const seen = new Set<string>();
	const result: ErrorObject[] = [];

	for (const error of errors) {
		if (isValueKeyword(error.keyword)) {
			if (!addNew(seen, `value|${error.instancePath}`)) {
				continue;
			}
			const types = typesByPath.get(error.instancePath);
			const allowedValues = Array.from(valuesByPath.get(error.instancePath) ?? []).filter(
				(value) => !types?.has(jsonType(value))
			);
			if (allowedValues.length === 0) {
				continue;
			}
			result.push(
				allowedValues.length === 1 && error.keyword === 'const'
					? error
					: { ...error, keyword: 'enum', params: { allowedValues } }
			);
		} else if (error.keyword === 'required') {
			// Every branch of a union can demand the same property; report each missing property once.
			if (!addNew(seen, `required|${error.instancePath}|${error.params.missingProperty}`)) {
				continue;
			}
			result.push(error);
		} else if (error.keyword === 'type') {
			if (!addNew(seen, `type|${error.instancePath}`)) {
				continue;
			}
			const type = Array.from(typesByPath.get(error.instancePath) ?? []);
			const values = Array.from(valuesByPath.get(error.instancePath) ?? []);
			const literalsByType: Record<string, unknown[]> = {};
			for (const name of type) {
				const literals = values.filter((value) => jsonType(value) === name);
				if (literals.length > 0) {
					literalsByType[name] = literals;
				}
			}
			result.push({
				...error,
				params: { ...error.params, type: type.length === 1 ? type[0] : type, literalsByType },
			});
		} else {
			result.push(error);
		}
	}

	return result;
}

function isValueKeyword(keyword: string): boolean {
	return keyword === 'const' || keyword === 'enum';
}

function jsonType(value: unknown): string {
	return value === null ? 'null' : Array.isArray(value) ? 'array' : typeof value;
}

function isStructuralKeyword(keyword: string): boolean {
	return keyword === 'oneOf' || keyword === 'anyOf' || keyword === 'additionalProperties';
}

// Trims redundant union noise. At an anyOf/oneOf location AJV reports both an umbrella "no branch
// matched" error and each branch's own complaint; this drops the umbrella when a concrete error
// already explains the failure at that path or deeper, and a losing branch's "wrong type" error
// when the value actually matched another branch and failed deeper inside it.
function filterStructuralErrors(errors: ErrorObject[]): ErrorObject[] {
	const compositionPaths = new Set<string>();
	const nonStructuralPaths: string[] = [];

	for (const error of errors) {
		if (error.keyword === 'oneOf' || error.keyword === 'anyOf') {
			compositionPaths.add(error.instancePath);
		}

		if (!isStructuralKeyword(error.keyword)) {
			nonStructuralPaths.push(error.instancePath);
		}
	}

	const hasDeeperError = (path: string): boolean =>
		nonStructuralPaths.some((p) => p.startsWith(`${path}/`));
	const hasSameOrDeeperError = (path: string): boolean =>
		hasDeeperError(path) || nonStructuralPaths.includes(path);

	return errors.filter((error) => {
		if (!compositionPaths.has(error.instancePath)) {
			return true;
		}

		if (isStructuralKeyword(error.keyword)) {
			return !hasSameOrDeeperError(error.instancePath);
		}

		if (error.keyword === 'type') {
			return !hasDeeperError(error.instancePath);
		}

		return true;
	});
}

function addNew(set: Set<string>, key: string): boolean {
	if (set.has(key)) {
		return false;
	}

	set.add(key);
	return true;
}

function addTo<T>(map: Map<string, Set<T>>, key: string, values: Iterable<T>): void {
	let set = map.get(key);
	if (!set) {
		set = new Set();
		map.set(key, set);
	}

	for (const value of values) {
		set.add(value);
	}
}

const comparisons: Record<string, string> = {
	'>=': 'at least',
	'<=': 'at most',
	'>': 'greater than',
	'<': 'less than',
};

function formatError(error: ErrorObject, highlight: (value: unknown) => string): string {
	switch (error.keyword) {
		case 'const':
			return `value ${highlight(error.data)} should be ${highlight(error.params.allowedValue)}`;
		case 'additionalProperties':
			return `unexpected property ${highlight(error.params.additionalProperty)}`;
		case 'required':
			return `must have required property ${highlight(error.params.missingProperty)}`;
		case 'enum': {
			const visibleValues = 20;
			const allowedValues: unknown[] = error.params.allowedValues;

			// Too many to list usefully (e.g. the ~3500 icon names): show the count, and point at the
			// nearest match so the user has something actionable rather than a truncated dump.
			if (allowedValues.length > visibleValues) {
				const candidates = allowedValues.filter(
					(value): value is string => typeof value === 'string'
				);
				const match =
					typeof error.data === 'string' && candidates.length > 0
						? ` (closest: ${highlight(closest(error.data, candidates))})`
						: '';
				return `unexpected value ${highlight(error.data)}, allowed values: ${allowedValues.length} values${match}`;
			}

			const shown = allowedValues.map(highlight).join(', ');
			return `unexpected value ${highlight(error.data)}, allowed values: ${shown}`;
		}
		case 'type': {
			const types = Array.isArray(error.params.type) ? error.params.type : [error.params.type];
			const literalsByType: Record<string, unknown[]> = error.params.literalsByType ?? {};
			const allowed = types
				.map((name: string) => {
					const literals = literalsByType[name];
					return literals?.length
						? `${highlight(name)} (${literals.map(highlight).join(', ')})`
						: highlight(name);
				})
				.join(', ');

			return `unexpected type ${highlight(jsonType(error.data))}, allowed types: ${allowed}`;
		}
		case 'anyOf':
			return 'does not match any of the allowed formats';
		case 'oneOf':
			return 'must match exactly one of the allowed formats';
		case 'pattern':
			return `does not match pattern ${highlight(error.params.pattern)}`;
		case 'format':
			return `not a valid ${highlight(error.params.format)}`;
		case 'propertyNames':
			return `invalid property name ${highlight(error.params.propertyName)}`;
		case 'uniqueItems':
			return 'must not contain duplicate items';
		case 'not':
			return 'must not match the disallowed format';
		case 'minLength':
		case 'maxLength': {
			const limit: number = error.params.limit;
			const bound = error.keyword === 'minLength' ? 'at least' : 'at most';
			return `must be ${bound} ${limit} character${limit === 1 ? '' : 's'}`;
		}
		case 'minimum':
		case 'maximum':
		case 'exclusiveMinimum':
		case 'exclusiveMaximum': {
			const comparison = comparisons[error.params.comparison] ?? error.params.comparison;
			return `must be ${comparison} ${error.params.limit}`;
		}
		default:
			return error.message ?? 'unknown error';
	}
}
