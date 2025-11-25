import documentation from '../dist/documentation.json' with { type: 'json' };
import { RenderPlugin } from "@11ty/eleventy";

export default function (eleventyConfig) {
	eleventyConfig.addPlugin(RenderPlugin);
	eleventyConfig.addGlobalData('documentationPages', Object.values(documentation));

	eleventyConfig.addFilter("json", (json) => JSON.stringify(json, undefined, '  '));
	eleventyConfig.addFilter("docFromGid", (gid) => documentation[gid]);
	eleventyConfig.addFilter("docFromRef", (docRef) => {
		const doc = documentation[docRef?.gid] || docRef;

		if (docRef.documentation) {
			// Use more specific documentation entry
			return { ...doc, ...docRef };
		}

		return doc;
	});
};
