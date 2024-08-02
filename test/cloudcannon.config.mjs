/**
 * @type {import('../src').Configuration}
 */
const config = {
	collections_config: {
		posts: {
			path: 'collections/posts',
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
