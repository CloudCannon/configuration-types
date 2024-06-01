# Configuration types

Contains TypeScript declarations and generates JSONSchema files for the [CloudCannon](https://cloudcannon.com/) configuration file.

[<img src="https://img.shields.io/npm/v/@cloudcannon%2Fconfiguration-types?logo=npm" alt="version badge">](https://www.npmjs.com/package/@cloudcannon%2Fconfiguration-types)

---

- [Installation](#installation)
- [Usage](#usage)
  - [YAML and JSON](#yaml-and-json)
  - [JavaScript](#javascript)
- [Development](#development)
- [License](#license)

---

## Installation

```sh
npm i -D @cloudcannon/configuration-types
```

## Usage

The primary use of this package is to validate your configuration file. You can also use it to autocomplete and read inline documention while editing. Here are some suggested workflows below.

### YAML and JSON

We plan to add the configuration schema to [JSON Schema Store](https://www.schemastore.org/json/), which would automatically enable in-editor validation, autocomplete and tooltips with the YAML or JSON LSP enabled.

Alternatively, you can add a comment to the top of your file to use a specific schema for YAML files:

```yaml
# yaml-language-server: $schema=https://raw.githubusercontent.com/CloudCannon/configuration-types/main/build/cloudcannon-config.json

collections_config:
  posts:
    name: Blog
    icon: event
```

Or the top-level `$schema` entry for JSON files:

```json
{
  "$schema": "https://raw.githubusercontent.com/CloudCannon/configuration-types/main/build/cloudcannon-config.json",

  "collections_config": {
    "posts": {
      "name": "Blog",
      "icon": "event"
    }
  }
}
```

You could also/alternatively validate the file on the command line with something like [ajv-cli](https://github.com/ajv-validator/ajv-cli):

```sh
npm i @cloudcannon/configuration-types ajv-cli
npm run ajv validate -s node_modules/@cloudcannon/configuration-types/cloudcannon-config.json -d cloudcannon.config.yml
```

### JavaScript

For a CommonJS formatted configuration file (e.g. `/cloudcannon.config.cjs`), you can use a JSDoc comment to indicate the type of the module export:

```javascript
/** @type {import("@cloudcannon/configuration-types").DefaultConfiguration} */
const config = {
  collections_config: {
    posts: {
      name: 'Blog',
      icon: 'event',
    },
  },
};

module.exports = config;
```

Then use the TypeScript LSP in your supported editor, ensuring it is set up to check JavaScript files. This would provide in-editor validation, autocomplete and tooltips as you modify the file.

You could also/alternatively run `tsc` over your file to validate there are no issues outside of your editor:

```sh
npx tsc test/cloudcannon.config.js --allowJs --checkJs --noEmit
```

***

## Development

Install dependencies:

```sh
npm i
```

Build JSONSchema files:

```sh
npm run build
```

## License

MIT
