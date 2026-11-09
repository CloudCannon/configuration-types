import type { Configuration } from '../src/index.js';

const config: Configuration = {
	collections_config: {
		posts: {
			path: 'collections/blog',
			name: 'Posts',
		},
	},
	_inputs: {
		image: {
			type: 'image',
			options: {
				width: 50,
			},
		},
	},
};

export default config;
