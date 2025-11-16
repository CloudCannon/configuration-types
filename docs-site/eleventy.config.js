import schema from '../dist/cloudcannon-config.documentation.schema.json' with { type: 'json' };
import { RenderPlugin } from "@11ty/eleventy";
import util from 'node:util';

const docs = {};
const pagesObj = { types: {}, pages: {} };
const pages = [];

let slugify;

function deref(doc) {
	if (doc?.$ref) {
		const refDoc = deref(schema.$defs[doc.$ref.replace('#/$defs/', '')]);

		Object.keys(refDoc).forEach((key) => {
			if (doc[key] === undefined) {
				if (key === 'id' && doc.id && doc.id !== refDoc.id) {
					throw new Error(`Overriding id through deref: ${refDoc.id} overriding ${doc.id}`);
				}

				if (key === 'gid' && doc.gid !== refDoc.gid) {
					throw new Error(`Overriding gid through deref: ${refDoc.gid} overriding ${doc.gid}`);
				}

				doc[key] = refDoc[key];
			}
		});
	}

	flattenNestedAnyOf(doc);
	return doc;
}

function flattenNestedAnyOf(doc) {
	if (doc?.anyOf) {
		const anyOf = [];

		for (let i = 0; i < doc.anyOf.length; i++) {
			flattenNestedAnyOf(doc.anyOf[i]);
			if (doc.anyOf[i]?.anyOf) {
				anyOf.push(...doc.anyOf[i]?.anyOf);
			} else {
				anyOf.push(doc.anyOf[i]);
			}
		}

		doc.anyOf = anyOf;
	}
}

function processDoc(doc, { path, key, parent, required }) {
	if (!Object.keys(doc).length) {
		return;
	}

	const thisPath = doc.id?.startsWith('type.')
		? [doc.id.replace('type.', '')]
		: key
			? [...path, key]
			: [...path];

	const gid = thisPath.join('.');
	const seen = docs[gid];

	if (seen) {
		doc = seen;
	}

	if (doc.id?.startsWith('type.')) {
		required = false;
		doc.appears_in = [...(doc.appears_in || []), parent];
		parent = undefined;
	}

	if (seen) {
		return;
	}

	const full_key = thisPath.join('.').replaceAll('.[', '[').replaceAll('.(', '(');
	doc.gid = gid;

	const url = !thisPath.length ? '/' : `/${thisPath.join('/')}/`;
	docs[gid] = doc;

	if (doc.items) {
		const items = Array.isArray(doc.items) ? doc.items : [doc.items];
		for (let i = 0; i < items.length; i++) {
			deref(items[i]);
			processDoc(items[i], {
				parent: { url, full_key },
				path: thisPath,
				key: items.length === 1 ? '[*]' : 'item-' + i
			});
		}
	}

	if (doc.properties) {
		const keys = Object.keys(doc.properties);
		for (let i = 0; i < keys.length; i++) {
			deref(doc.properties[keys[i]]);
			processDoc(doc.properties[keys[i]], {
				parent: { url, full_key },
				path: thisPath,
				key: keys[i],
				required: !!doc.required?.includes(keys[i])
			});
		}
	}

	if (doc.additionalProperties) {
		const additionalProperties = Array.isArray(doc.additionalProperties) ? doc.additionalProperties : [doc.additionalProperties];
		for (let i = 0; i < additionalProperties.length; i++) {
			deref(additionalProperties[i]);
			processDoc(additionalProperties[i], {
				parent: { url, full_key },
				path: thisPath,
				key: additionalProperties.length === 1 ? '*' : 'additional-property-' + i
			});
		}
	}

	if (doc.anyOf) {
		for (let i = 0; i < doc.anyOf.length; i++) {
			deref(doc.anyOf[i]);
			processDoc(doc.anyOf[i], {
				parent: { url, full_key },
				path: thisPath,
				key: `(${slugify(doc.anyOf[i].title || doc.anyOf[i].id || `any-of-${i}`)})`
			});
		}
	}

	// TODO: handle doc.allOf, although there are not currently any instances of this in the schema.

	const page = {
		doc,
		url,
		required: !!required,
		full_key,
		parent_url: parent?.url,
		title: doc.title || doc.id || doc.type || doc.gid,
	};

	if (doc.id?.startsWith('type.')) {
		pagesObj.types[doc.id] = page;
	} else {
		pagesObj.pages[doc.gid] = page;
	}

	pages.push(page);
}

export default function (eleventyConfig) {
	slugify = eleventyConfig.getFilter("slugify");
	eleventyConfig.addPlugin(RenderPlugin);

	processDoc(schema, { path: [] });
	eleventyConfig.addGlobalData('docPages', pages);

	eleventyConfig.addFilter("arrayify", function (doc) {
		if (doc === undefined) {
			return [];
		}

		return Array.isArray(doc) ? doc : [doc];
	});

	eleventyConfig.addFilter("json", function (json) {
		// return '';
		return util.inspect(json, { depth: null, maxArrayLength: 30 });
	});

	eleventyConfig.addFilter("getDocPage", (d) => {
		if (d) {
			return d.id?.startsWith('type.') ? pagesObj.types[d.id] : pagesObj.pages[d.gid];
		}
	});

	eleventyConfig.addFilter("getDocTitle", (d) => d.title || d.id || d.type || d.gid);
};
