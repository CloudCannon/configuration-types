/**
 * @type {import('../src').ReaderConfiguration}
 */
const config = {
	collections_config: {
		posts: {
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

module.exports = config;
