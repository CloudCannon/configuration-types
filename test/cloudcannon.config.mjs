/** @type {import("../src").JekyllConfiguration} */
export default {
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
