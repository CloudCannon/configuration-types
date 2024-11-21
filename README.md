# Configuration types

Contains TypeScript declarations and generates JSON Schema files for the [CloudCannon](https://cloudcannon.com/) configuration file.

[<img src="https://img.shields.io/npm/v/@cloudcannon%2Fconfiguration-types?logo=npm" alt="version badge">](https://www.npmjs.com/package/@cloudcannon%2Fconfiguration-types)

---

- [Installation](#installation)
- [Usage](#usage)
- [Development](#development)
- [License](#license)

---

## Installation

```sh
npm i -D @cloudcannon/configuration-types
```

## Usage

We plan to add the configuration schema to [JSON Schema Store](https://www.schemastore.org/json/), which would automatically enable in-editor validation, autocomplete and tooltips with the YAML or JSON LSP enabled.

Alternatively, you can add a comment to the top of your file to use a specific schema for YAML files:

```yaml
# yaml-language-server: $schema=https://raw.githubusercontent.com/CloudCannon/configuration-types/main/dist/schema/cloudcannon-config.schema.json

collections_config:
  posts:
    path: content/posts
    name: Blog
    icon: event
```

Or the top-level `$schema` entry for JSON files:

```json
{
  "$schema": "https://raw.githubusercontent.com/CloudCannon/configuration-types/main/dist/schema/cloudcannon-config.schema.json",

  "collections_config": {
    "posts": {
      "path": "content/posts",
      "name": "Blog",
      "icon": "event"
    }
  }
}
```

You could also/alternatively validate the file on the command line with something like [ajv-cli](https://github.com/ajv-validator/ajv-cli):

```sh
npm i @cloudcannon/configuration-types ajv-cli
npm run ajv validate -s node_modules/@cloudcannon/configuration-types/schema/cloudcannon-config.schema.json -d cloudcannon.config.yml
```

***

## Development

Install dependencies:

```sh
npm i
```

Build:

```sh
npm run build
```

## License

MIT
