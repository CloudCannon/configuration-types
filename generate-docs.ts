#!/usr/bin/env tsx
import fs from 'node:fs';
import path from 'node:path';
import * as z from 'zod/v4';

// Import all the schemas
import { ConfigurationSchema } from './zod/configuration.ts';

interface SchemaInfo {
	name: string;
	schema: z.core.JSONSchema.JSONSchema;
	description: string;
	filename: string;
}

const baseSchema = z.toJSONSchema(ConfigurationSchema, { reused: 'ref' });
const definitions = baseSchema?.$defs || {};

const schemas: SchemaInfo[] = [
	{
		name: 'Configuration',
		schema: baseSchema,
		description: 'Main CloudCannon configuration schema',
		filename: 'configuration'
	},

    ...Object.entries(definitions).filter(([key, value]) => value.name).map(([key, value]): SchemaInfo => ({
        name: value.name as string,
        schema: value,
        description: value.description || '',
        filename: key
    })),
];

function escapeHtml(text: string): string {
	return text
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');
}

function formatArrayType(items: boolean | z.core.JSONSchema.JSONSchema | z.core.JSONSchema._JSONSchema[], depth): string {
    if (!Array.isArray(items)) {
        return formatJsonSchemaType(items, depth + 1);
    }

    const firstItem = items[0];
    if (firstItem) {
        return `${formatJsonSchemaType(firstItem, depth + 1)}[]`;
    }

    return 'unknown';
}


function formatJsonSchemaType(jsonSchema: boolean | z.core.JSONSchema.JSONSchema, depth): string {
    if (typeof jsonSchema === 'boolean') {
        return 'true';
    }

	if (jsonSchema.type) {
		if (jsonSchema.type === 'array' && jsonSchema.items) {
			return `${formatArrayType(jsonSchema.items, depth + 1)}[]`;
		}

        const additionalProperties = jsonSchema.additionalProperties;
		if (jsonSchema.type === 'object' && additionalProperties) {
            if (typeof additionalProperties === 'boolean') {
                return `Record<string, ${additionalProperties}>`;
            }

			return `Record<string, ${formatJsonSchemaType(additionalProperties, depth + 1)}>`;
		}
		return jsonSchema.type;
	}
	
	if (jsonSchema.anyOf || jsonSchema.oneOf) {
		const options = jsonSchema.anyOf || jsonSchema.oneOf || [];
		return options.map(option => formatJsonSchemaType(option, depth + 1)).join(' | ');
	}
	
	if (jsonSchema.$ref) {
        const refName = jsonSchema.$ref.split('/').pop() ?? '';
        const def = definitions?.[refName];
        if (def) {
            if (def?.name) {
                return def.name as string;
            }
            return formatJsonSchemaType(def, depth + 1);
        }
	}

	return 'unknown';
}

function getDefaultValue(jsonSchema: any): string | null {
	if (jsonSchema.default !== undefined) {
		return JSON.stringify(jsonSchema.default);
	}
	return null;
}

function isRequired(propertyName: string, parentSchema: z.core.JSONSchema.JSONSchema): boolean {
	return !!parentSchema.required?.includes(propertyName);
}

function generatePropertiesFromJsonSchema(jsonSchema: z.core.JSONSchema.JSONSchema, depth): string {
	if (!jsonSchema.properties) {
		const type = formatJsonSchemaType(jsonSchema, depth);
		const description = jsonSchema.description || '';
		let html = `
			<div class="property-type-only">
				<div class="property-type">${escapeHtml(type)}</div>
				${description ? `<div class="property-description">${escapeHtml(description)}</div>` : ''}
                ${jsonSchema.anyOf ? `<div class="property-any-of">${jsonSchema.anyOf.map((anyOf: any) => formatJsonSchemaType(anyOf, depth + 1)).join(' | ')}</div>` : ''}
		`;

		if (jsonSchema.enum) {
			html += `
				<div class="enum-values">
					<strong>Allowed values:</strong>
					${jsonSchema.enum.map((val: any) => `<code class="enum-value">${escapeHtml(JSON.stringify(val))}</code>`).join(' ')}
				</div>
			`;
		}

        if (jsonSchema.anyOf) {
			html += `<div class="array-items-label">Any of:</div>`;
			html += `<ol>${jsonSchema.anyOf.map(item => `<li>${generatePropertiesFromJsonSchema(item, depth + 1)}</li>`).join('')}</ol>`;
        }

        if (jsonSchema.oneOf) {
			html += `<div class="array-items-label">One of:</div>`;
			html += `<ol>${jsonSchema.oneOf.map(item => `<li>${generatePropertiesFromJsonSchema(item, depth + 1)}</li>`).join('')}</ol>`;
        }

        html += '</div>';

        return html
	}

	const properties = jsonSchema.properties;
	let html = '<div class="schema-properties">';

	for (const [key, propertySchema] of Object.entries(properties)) {
		const prop = propertySchema as any;
		const description = prop.description || '';
		const type = formatJsonSchemaType(prop, depth + 1);
		const defaultValue = getDefaultValue(prop);
		const required = isRequired(key, jsonSchema);

		// Resolve $ref if needed
		let resolvedProp: z.core.JSONSchema.JSONSchema | undefined;
		if (prop.$ref && definitions) {
			const refPath = prop.$ref.replace('#/', '').split('/').pop();
			resolvedProp = refPath ? definitions[refPath] : undefined;
		}

		html += `
			<div class="property" style="margin-left: ${depth * 20}px;">
				<div class="property-header">
					<code class="property-name">${escapeHtml(key)}</code>
					${required ? '<span class="required-badge">required</span>' : '<span class="optional-badge">optional</span>'}
					${defaultValue ? `<span class="default-badge">default: ${escapeHtml(defaultValue)}</span>` : ''}
				</div>
				<div class="property-type">${escapeHtml(type)}</div>
				${description ? `<div class="property-description">${escapeHtml(description)}</div>` : ''}
		`;

		// Add enum values if present
		if (prop.enum) {
			html += `
				<div class="enum-values">
					<strong>Allowed values:</strong>
					${prop.enum.map((val: any) => `<code class="enum-value">${escapeHtml(JSON.stringify(val))}</code>`).join(' ')}
				</div>
			`;
		}

		// Add nested properties for objects (but limit depth to avoid overwhelming UI)
		if (resolvedProp) {
            if (prop.$ref) {
                html += `<p><a href="/docs-${prop.$ref.replace('#/', '').split('/').pop()}.html">${resolvedProp.name || key}</a></p>`;
            }

            if (!resolvedProp.name) {
                html += generatePropertiesFromJsonSchema(resolvedProp, depth + 1);
            }

		} else if (depth < 2 && prop.items && prop.items.properties) {
			html += `<div class="array-items-label">Array items:</div>`;
			html += generatePropertiesFromJsonSchema(prop.items, depth + 1);
		}

		html += '</div>';
	}

	html += '</div>';
	return html;
}

function generateNavigation(schemaInfo?: SchemaInfo): string {
    return `
        <nav class="sidebar">
            <h2><a href="docs-index.html">CloudCannon Docs</a></h2>
            <ul class="nav-list">
                ${schemas.map(s => `
                    <li><a href="docs-${s.filename}.html" ${s.filename === schemaInfo?.filename ? 'class="active"' : ''}>${s.name}</a></li>
                `).join('')}
            </ul>
            <div class="nav-footer">
                <a href="index.html">← Back to Validator</a>
            </div>
        </nav>
    `
}

function generateSchemaPage(schemaInfo: SchemaInfo): string {
	const jsonSchema = schemaInfo.schema;
	
	// Extract the main schema and definitions
	const mainSchema = jsonSchema;
	const definitions = jsonSchema.$defs || {};
	
	const properties = generatePropertiesFromJsonSchema(mainSchema, definitions, 0);
	
	return `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<title>${schemaInfo.name} Schema | CloudCannon Configuration Documentation</title>
	<link href="docs-style.css" rel="stylesheet">
	<link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📚</text></svg>">
</head>
<body>
    ${generateNavigation(schemaInfo)}
	
	<main class="content">
		<header class="page-header">
			<h1>${schemaInfo.name} Schema</h1>
			<p class="schema-description">${schemaInfo.description}</p>
			${mainSchema.description ? `<p class="schema-json-description">${escapeHtml(mainSchema.description)}</p>` : ''}
		</header>
		
		<section class="schema-content">
			<h2>Properties</h2>
			${properties}
		</section>
	</main>
</body>
</html>`;
}

function generateIndexPage(): string {
	return `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<title>CloudCannon Configuration Documentation</title>
	<link href="docs-style.css" rel="stylesheet">
	<link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📚</text></svg>">
</head>
<body>
    ${generateNavigation()}
	
	<main class="content">
		<header class="page-header">
			<h1>CloudCannon Configuration Documentation</h1>
			<p>Complete reference for CloudCannon configuration schemas</p>
		</header>
		
		<section class="schema-list">
			<h2>Available Schemas</h2>
			<div class="schema-grid">
				${schemas.map(s => `
					<div class="schema-card">
						<h3><a href="docs-${s.filename}.html">${s.name}</a></h3>
						<p>${s.description}</p>
					</div>
				`).join('')}
			</div>
		</section>
		
		<section class="getting-started">
			<h2>Getting Started</h2>
			<p>CloudCannon uses these schemas to validate and provide editor interfaces for your site configuration. Click on any schema above to see detailed documentation about its properties and options.</p>
			
			<h3>Quick Links</h3>
			<ul>
				<li><a href="docs-configuration.html">Configuration</a> - Main configuration file structure</li>
				<li><a href="docs-inputs.html">Inputs</a> - Editor input field definitions</li>
				<li><a href="docs-structures.html">Structures</a> - Content structure templates</li>
			</ul>
		</section>
	</main>
</body>
</html>`;
}

function generateStylesheet(): string {
	return `/* Documentation Styles */
* {
	box-sizing: border-box;
}

body {
	margin: 0;
	font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
	background: #f8f9fa;
	display: flex;
	min-height: 100vh;
}

.sidebar {
	width: 280px;
	background: #fff;
	border-right: 1px solid #e9ecef;
	padding: 2rem 0;
	position: fixed;
	height: 100vh;
	overflow-y: auto;
}

.sidebar h2 {
	margin: 0 0 2rem 0;
	padding: 0 2rem;
	font-size: 1.25rem;
	color: #495057;
}

.sidebar h2 a {
	text-decoration: none;
	color: inherit;
}

.nav-list {
	list-style: none;
	margin: 0;
	padding: 0;
}

.nav-list li {
	margin: 0;
}

.nav-list a {
	display: block;
	padding: 0.75rem 2rem;
	text-decoration: none;
	color: #6c757d;
	transition: all 0.2s;
	border-right: 3px solid transparent;
}

.nav-list a:hover,
.nav-list a.active {
	background: #f8f9fa;
	color: #495057;
	border-right-color: #007bff;
}

.nav-footer {
	margin-top: 2rem;
	padding: 0 2rem;
	border-top: 1px solid #e9ecef;
	padding-top: 1rem;
}

.nav-footer a {
	color: #6c757d;
	text-decoration: none;
	font-size: 0.9rem;
}

.content {
	margin-left: 280px;
	flex: 1;
	padding: 2rem;
}

.page-header {
	margin-bottom: 3rem;
}

.page-header h1 {
	margin: 0 0 1rem 0;
	color: #495057;
	font-size: 2.5rem;
}

.schema-description {
	font-size: 1.1rem;
	color: #6c757d;
	margin: 0;
}

.schema-json-description {
	font-size: 1rem;
	color: #495057;
	margin: 0.5rem 0 0 0;
	font-style: italic;
}

.schema-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
	gap: 1.5rem;
	margin-top: 1rem;
}

.schema-card {
	background: #fff;
	border: 1px solid #e9ecef;
	border-radius: 8px;
	padding: 1.5rem;
	transition: transform 0.2s, box-shadow 0.2s;
}

.schema-card:hover {
	transform: translateY(-2px);
	box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.schema-card h3 {
	margin: 0 0 0.5rem 0;
	font-size: 1.25rem;
}

.schema-card h3 a {
	text-decoration: none;
	color: #007bff;
}

.schema-card p {
	margin: 0;
	color: #6c757d;
}

.schema-content,
.definitions-section {
	background: #fff;
	border: 1px solid #e9ecef;
	border-radius: 8px;
	padding: 2rem;
	margin-bottom: 2rem;
}

.schema-properties {
	margin-top: 1rem;
}

.property {
	margin-bottom: 1.5rem;
	padding: 1rem;
	background: #f8f9fa;
	border-radius: 6px;
	border-left: 4px solid #e9ecef;
}

.property:hover {
	border-left-color: #007bff;
}

.property-header {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	margin-bottom: 0.5rem;
	flex-wrap: wrap;
}

.property-name {
	font-weight: 600;
	color: #495057;
	background: #fff;
	padding: 0.25rem 0.5rem;
	border-radius: 4px;
	border: 1px solid #dee2e6;
}

.optional-badge,
.required-badge,
.default-badge {
	font-size: 0.75rem;
	padding: 0.25rem 0.5rem;
	border-radius: 12px;
	font-weight: 500;
}

.optional-badge {
	background: #e3f2fd;
	color: #1976d2;
}

.required-badge {
	background: #ffebee;
	color: #d32f2f;
}

.default-badge {
	background: #f3e5f5;
	color: #7b1fa2;
}

.property-type {
	font-family: 'SFMono-Regular', Monaco, monospace;
	font-size: 0.9rem;
	color: #6f42c1;
	margin-bottom: 0.5rem;
}

.property-type-only {
	margin: 1rem 0;
}

.property-description {
	color: #6c757d;
	line-height: 1.5;
	margin-bottom: 0.5rem;
}

.enum-values {
	margin-top: 0.5rem;
	padding: 0.5rem;
	background: #fff;
	border-radius: 4px;
	border: 1px solid #dee2e6;
}

.enum-value {
	display: inline-block;
	background: #e9ecef;
	padding: 0.2rem 0.4rem;
	border-radius: 3px;
	margin: 0.1rem;
	font-size: 0.8rem;
}

.array-items-label {
	font-weight: 600;
	margin: 0.5rem 0;
	color: #495057;
}

.definitions {
	margin-top: 1rem;
}

.definition {
	margin-bottom: 2rem;
	padding: 1.5rem;
	background: #f8f9fa;
	border-radius: 8px;
	border: 1px solid #e9ecef;
}

.definition h3 {
	margin: 0 0 1rem 0;
	color: #495057;
	padding-bottom: 0.5rem;
	border-bottom: 2px solid #e9ecef;
}

.getting-started {
	margin-top: 3rem;
	background: #fff;
	padding: 2rem;
	border-radius: 8px;
	border: 1px solid #e9ecef;
}

.getting-started h2,
.getting-started h3 {
	color: #495057;
}

.getting-started ul {
	margin: 1rem 0;
}

.getting-started li {
	margin-bottom: 0.5rem;
}

.getting-started a {
	color: #007bff;
	text-decoration: none;
}

.getting-started a:hover {
	text-decoration: underline;
}

@media (max-width: 768px) {
	.sidebar {
		display: none;
	}
	
	.content {
		margin-left: 0;
	}
}`;
}

// Ensure site directory exists
const siteDir = path.join(process.cwd(), 'site');
if (!fs.existsSync(siteDir)) {
	fs.mkdirSync(siteDir, { recursive: true });
}

// Generate documentation files
console.log('🔧 Generating documentation from JSON Schema...');

// Generate index page
fs.writeFileSync(
	path.join(siteDir, 'docs-index.html'),
	generateIndexPage()
);
console.log('✅ docs-index.html');

// Generate individual schema pages
for (const schemaInfo of schemas) {
	try {
		const filename = `docs-${schemaInfo.filename}.html`;
		fs.writeFileSync(
			path.join(siteDir, filename),
			generateSchemaPage(schemaInfo)
		);
		console.log(`✅ ${filename}`);
	} catch (error) {
		console.error(`❌ Error generating ${schemaInfo.filename}:`, error);
	}
}

// Generate stylesheet
fs.writeFileSync(
	path.join(siteDir, 'docs-style.css'),
	generateStylesheet()
);
console.log('✅ docs-style.css');

console.log('\n📚 Documentation generated successfully from JSON Schema!');
console.log('👀 Open site/docs-index.html to view the documentation'); 