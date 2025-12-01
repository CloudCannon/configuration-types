import documentation from '../dist/documentation.json' with { type: 'json' };
import { RenderPlugin } from "@11ty/eleventy";

export default function (eleventyConfig) {
	eleventyConfig.addPlugin(RenderPlugin);
	eleventyConfig.addGlobalData('docs', Object.values(documentation));

	eleventyConfig.addFilter("json", (json) => {
		if (typeof json === 'object') {
			return JSON.stringify({ ...json, page: undefined, eleventy: undefined }, undefined, '  ');
		}

		return JSON.stringify(json, undefined, '  ');
	});
	eleventyConfig.addFilter("isGidInside", (gid, parentGid) => parentGid === 'type.Configuration' ?
		!gid.startsWith('type.') : gid.startsWith(parentGid + '.')
	);
	eleventyConfig.addFilter("parentGidsFromDoc", (doc) => {
		const parentGids = [];
		let parentGid = doc.parent;
		while (parentGid) {
			parentGids.unshift(parentGid);
			parentGid = documentation[parentGid].parent;
		}
		return parentGids;
	});
	eleventyConfig.addFilter("docFromGid", (gid) => documentation[gid]);
	eleventyConfig.addFilter("docFromRef", (docRef) => {
		const doc = documentation[docRef?.gid] || docRef;

		if (docRef.documentation) {
			// Use more specific documentation entry
			return {
				...doc,
				title: docRef.documentation.title || doc.title,
				description: docRef.documentation.description || doc.description,
				examples: docRef.documentation.examples.length ? docRef.documentation.examples : doc.examples,
				documentation: docRef.documentation
			};
		}

		return doc;
	});
};
