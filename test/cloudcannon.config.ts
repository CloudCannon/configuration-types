import type { JekyllConfiguration } from '../src';

const config: JekyllConfiguration = {
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

export default config;
