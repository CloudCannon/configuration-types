# configuration-types Documentation Style Guide

**Last Updated:** June 18, 2026
**Version:** 1.2

This guide sets the writing standards for the documentation in this repo: the `title`, `description`, and `examples` that generate CloudCannon's published configuration-file reference. It applies to descriptions wherever they are authored, whether in `src/*.ts` zod `.meta({ description })` strings or in `docs/documentation/*.yml` files.

This guide is for anyone editing those descriptions or examples, human or agent. The audience for the *output* is a developer reading the config reference, so write for them: be accurate, literal, and behavior-focused.

The machine-readable rules are extracted to `STYLE_GUIDE_AGENTS.md` for loading into agent contexts.

> **For agents and contributors:** if you change a rule here, also change it in `STYLE_GUIDE_AGENTS.md`. The two files must stay in sync. `STYLE_GUIDE.md` is authoritative, and `STYLE_GUIDE_AGENTS.md` is derived from it. Always update the revision history in both files: update the `Last Updated` and `Version` fields and the revision-history table (Section 9) here, and update `last_updated` and `style_guide_version` in the YAML block of `STYLE_GUIDE_AGENTS.md`.

## Audience

These descriptions are read by developers configuring CloudCannon, the people editing `cloudcannon.config.yml`, building schemas, and setting up sites. Write for them:

- **Assume technical fluency.** They are comfortable with git, static site generators, the command line, and YAML, so do not explain those basics.
- **Account for several reading contexts.** A reader may be building and tailoring many sites for external clients, maintaining an in-house portfolio of related sites with shared schemas and cross-site consistency, migrating configuration from another system, or evaluating whether CloudCannon fits their stack.
- **Give them what a description is for.** State precisely what the key does and how it interacts with related keys. Defaults and allowed values are auto-generated from the schema, so they do not belong in the prose (see [Section 3](#3-description)). Code examples carry more weight than prose.
- **Describe honestly, without salesmanship.** State tradeoffs and constraints plainly (see [Section 5](#5-terminology-capitalization-spelling)).

## Table of contents

- [configuration-types Documentation Style Guide](#configuration-types-documentation-style-guide)
  - [Audience](#audience)
  - [Table of contents](#table-of-contents)
  - [1. Where descriptions live](#1-where-descriptions-live)
    - [Where descriptions surface](#where-descriptions-surface)
  - [2. Title](#2-title)
  - [3. Description](#3-description)
    - [Voice and openings](#voice-and-openings)
    - [Templates by key kind](#templates-by-key-kind)
      - [Defines: most keys](#defines-most-keys)
      - [Toggles: boolean-value keys](#toggles-boolean-value-keys)
      - [Represents: array items and set entries](#represents-array-items-and-set-entries)
  - [4. Examples](#4-examples)
  - [5. Terminology, capitalization, spelling](#5-terminology-capitalization-spelling)
  - [6. Doc-file fields](#6-doc-file-fields)
  - [7. Building and verifying](#7-building-and-verifying)
  - [8. Quick checklist](#8-quick-checklist)
  - [9. Revision history](#9-revision-history)

---

## 1. Where descriptions live

Descriptions originate in `src/*.ts` zod schemas, via `.meta({ description })`. The build turns these into `dist/*.schema.json` and into the per-key documentation files in `docs/documentation/*.yml`. Those YAML files are committed and hand-editable, and `redocument-schemas.ts` merges the YAML back into the published JSON schema.

Some `docs/documentation/*.yml` files are hand-authored overrides for keys whose reference resolves (dedupes) to a shared type page. For example, the `_editables` `*_options` sub-keys resolve to a shared input type. The override mechanism is `buildPageRef` in `docs/index.ts` plus the round-trip in `docs/docs.ts` (`writeNewDocs`), which preserves these files on rebuild.

The same writing conventions apply wherever the text is authored, so a `.meta` string and a YAML `description` are governed identically by this guide. Note that much of the existing `src/.meta` still uses a terser legacy voice; see the note on legacy voice in [Section 3](#3-description).

### Where descriptions surface

Descriptions reach two audiences. The first is the IDE: the generated `dist/*.schema.json` files (notably `cloudcannon-config.latest.schema.json`) drive validation and autocomplete for `cloudcannon.config.yml` in editors like VS Code. The build copies each `description` into a `markdownDescription` field, which the YAML/JSON language server renders as markdown, so backticks appear as inline code in hovers and autocomplete rather than as literal characters. The second is the web reference: `documentation.json` feeds the published config reference, which also renders markdown.

There is one consequence worth knowing. Descriptions authored in `src/*.ts` `.meta` appear in both the IDE schema and the web reference. Override-only YAML docs (the dedupe `$ref` cases, such as the `_editables` `*_options` sub-keys) appear on the web reference only, and in the IDE those keys inherit the shared type's description. To give such a key its own IDE-visible description, you must author it on the schema node itself, not just as an override doc.

## 2. Title

The `title` field is almost always an empty string (`''`), and you should leave it that way. The page's display name in the reference is derived from its `gid`.

The exception is the named type pages (the input-type pages and the top-level schema pages), which carry a human-readable display title:

```yaml
gid: type._inputs.*.(text-input)
title: Text Input
```

Do not hand-set `title` for ordinary keys; leave it `''`.

## 3. Description

### Voice and openings

Every description uses the "This key …" voice, wherever it is authored, in `src/*.ts` `.meta` strings and `docs/documentation/*.yml` alike. Open with exactly one of these three patterns, chosen by the kind of key:

| Opening | Use when |
| --- | --- |
| `This key defines …` | Use this for most keys, as the default. |
| `This key toggles whether …` | Use this when the value is a literal `true` or `false`. |
| `This key represents …` | Use this when the key is an array item or an individual entry in a set. |

[Templates by key kind](#templates-by-key-kind) gives the exact template and a real example for each.

The opening sentence says what the key does, and you should cover everything else in following sentences. Add whatever the reader needs that the reference does not already show, in roughly the order below:

- **Interactions and prerequisites.** Explain how the key relates to, requires, or overrides others, as in "This key requires you to define `options.required`."
- **Availability.** Name the narrower set of input types a key applies to when its schema location is broader. Use this for options that sit in the shared `_inputs.*.options` bag but apply to only some input types, because "Appears in" shows only the shared parent. The `options.required` key does this, listing the input types it supports. When the key is already nested under a type-specific parent, as `show_count` is under `(textarea-input).options`, "Appears in" conveys this and the sentence is redundant.
- **No default.** State `This key has no default.` when the key has neither a default nor a derived default behavior (see below), because the reference renders nothing in that case and the silence can read as a documentation gap.
- **Default behavior.** When a key has no schema default but CloudCannon still derives one at runtime (for example from a naming convention, a site flag, or the value of another key), the reference shows nothing, so describe that behavior in a following sentence. Phrase it as behavior, as in "If you do not set this key, CloudCannon shows the transparency control when the input key ends with `a`", rather than as a value like "By default, this key is `true`". For a boolean, you can fold this into the non-default sentence instead.
- **Non-obvious behavior.** Note any edge cases, side effects, or recommendations that the type alone does not convey.
- **Further reading.** When a genuinely relevant article exists, you may close with a trailer that links to it, in the form "For more information, please read our documentation on [topic](link)." This is optional and uncommon, so add it only when there is a real article to point to, never as a default.

Do not restate what the reference auto-generates from the schema. When a default or allowed values exist, the published reference and IDE render them as their own fields, so leave them out of the prose:

- **Defaults to.** The reference shows the default value from a schema `default`, so never restate an actual default value. State `This key has no default.` when there is none, as above, and describe a derived default as behavior when there is no schema default, as in "Default behavior" above.
- **Allowed values.** The reference lists an enum's options from `enum`.
- **Appears in.** The reference shows the structural parent locations where the key sits. When a shared key applies to only a narrower context, add an availability sentence as above, because "Appears in" can only show the shared parent.
- **Required.** The reference shows a red "Required" pill, derived from the schema's `required` array, so never write that a key is required.
- **Properties table.** When a key's value is an object, the reference auto-renders a properties table of every child key the object can contain, so never enumerate those child keys in the prose.

These additions are follow-ups, not openers, because the opening sentence always leads with what the key does.

Some existing `src/*.ts` `.meta` strings still use a terser legacy voice, with imperative openings such as "Enables…", "Sets…", "Hides…", and "Controls…", or bare noun phrases. Do not mirror that voice. Write new and edited descriptions in the "This key …" voice, even when you are revising a legacy string.

Descriptions must be self-contained. Each one renders in isolation in the reference and may be quoted out of context, so never write "as described above" or "the following keys".

Formatting of description text (backticks, italics, links, and US English) is covered in [Section 5](#5-terminology-capitalization-spelling).

### Templates by key kind

The three openings expand into the exact templates below. Pick by what the key's *value* is.

#### Defines: most keys

This is the default opening, and it takes a few shapes depending on what the value is.

A general key states what it does, then adds any clarifying sentence. Here is an example from `base_url.yml`:

```yaml
description: >-
  This key defines which base URL (or subpath) CloudCannon should use when
  matching output URLs for your *Site*.


  The base URL will prefix the output URL of each file.
```

The keys in the configuration cascade (`_inputs`, `_select_data`, `_structures`) hold a map of things at a given level of the cascade. Use the cascade boilerplate (and optionally close with a "Further reading" trailer, as above, when a relevant article exists):

```
This key defines which [things] are available at a given level of the configuration cascade.

This key has no default.

If undefined at higher levels of the [configuration cascade](/documentation/articles/using-the-configuration-cascade/), `X` will default to any values configured in the [CloudCannon configuration file](/documentation/articles/what-is-the-cloudcannon-configuration-file/).
```

Here is an example from `type._inputs.yml`:

```yaml
description: >-
  This key defines which inputs are available at a given level of the
  configuration cascade.


  This key has no default.


  If undefined at higher levels of the [configuration
  cascade](/documentation/articles/using-the-configuration-cascade/), `_inputs`
  will default to any values configured in the [CloudCannon configuration
  file](/documentation/articles/what-is-the-cloudcannon-configuration-file/).
```

The input-definition keys (entries under `type._inputs.*`, and the `_editables` `*_options` sub-keys like `link_options.href`) have a value that is an input definition object. Say what the input edits, and do not enumerate the object's child keys, because the reference auto-renders them in the properties table.

```
This key defines the input for [purpose].
```

The standalone input type pages (the `(x-input)` pages) are the canonical reference for each input, so they have a higher bar than ordinary keys. Do three things:

1. Open with `This key defines an editing interface for [purpose].`
2. Add the distinguishing context a reader needs to choose the input, such as the `type` token (or tokens) it accepts, what value it stores, and how it differs from related inputs.
3. Include a usage example that shows the input configured with its `type`.

Here is an example from `type._inputs.*.(select-input).yml`:

```yaml
title: Select Input
description: >-
  This key defines an editing interface for data with multiple predefined
  options.


  *Select Inputs* only allow one value.
examples:
  - description: >-
      In this example, we have configured the `category` key as a *Select
      Input*.
    language: yaml
    code: |-
      _inputs:
        category:
          type: select
          label: Category
          options:
            values:
              - Blog
              - News
              - Events
    annotations: []
    source: /cloudcannon.config.yml
```

The option-group and parent keys have a value that is a group of related sub-keys, for example `link_options`:

```
This key defines the controls for [purpose].
```

#### Toggles: boolean-value keys

Use this format when the value is a literal `true` or `false` (for example `code_block` or `disable_add`). Write two sentences separated by a blank line: the first says what the key controls, and the second says what setting the key to its non-default value does.

```
This key toggles whether CloudCannon will [outcome].

Setting this key to `[non-default]` will [effect].
```

Most booleans default to `false`, so the second sentence describes what `true` does. Here is an example from `type._editables.*.code_block.yml`:

```yaml
description: >-
  This key toggles whether CloudCannon will display a control in your WYSIWYG
  toolbar to insert a code block in editable regions.


  Setting this key to `true` will display the code block control in your
  WYSIWYG toolbar.
```

When a key defaults to `true`, call out `false` instead. Here is an example from `type._inputs.*.(code-input).options.show_gutter.yml`:

```yaml
description: >-
  This key toggles whether CloudCannon displays line numbers in the gutter of
  *Code Inputs*.


  Setting this key to `false` will hide line numbers in the left gutter of the
  code editor.
```

> **Not a boolean-value key:** if the value is a Boolean *Input* definition (an object, for example `link_options.is_target_blank`, which configures a switch the editor toggles), it is an input-definition key. Use the input-definition template under [Defines](#defines-most-keys). "Setting this key to `true`" does not apply, because you give it an input definition rather than `true`.

#### Represents: array items and set entries

Use this when the key is one item in an array or one entry in a set, rather than a setting in its own right. Write a typed entry rather than a bare noun phrase.

```
This key represents [what one entry is].
```

Here is an example from `collection_groups.[*].collections.[*].yml`:

```yaml
description: >-
  This key represents an individual Collection key name string in the
  `collection_groups.[*].collections` array.


  The value is a string that specifies the key name of a Collection defined in
  `collections_config` to include in a group in the *Site Navigation*.
```

## 4. Examples

Every key has at least one example, and up to three when separate examples show different common configuration options. Readers can land on a single reference page through search without seeing its parent, so each page must stand on its own.

Write each example as a small but complete snippet that shows the key in context. Repeating context from a parent key is fine, and often necessary, so the page makes sense on its own. A trivial example, such as a single boolean set to `true`, is still worth including. When a key's value is one branch of a union (for example a date versus an ISO8601 string), show the specific value shape that branch accepts, since a reader who lands on the branch page sees only that form.

Each example has these fields:

- **`description`.** Phrase this as "In this example, we have configured … to …".
- **`language`.** This is usually `yaml`, and is sometimes `markdown`, `liquid`, or `css`.
- **`code`.** Write a multi-line snippet as a YAML literal block (`|-`); a single-line value may be inline, as in the `base_url` example below.
- **`source`.** Give the path where the snippet belongs, usually `/cloudcannon.config.yml`, and sometimes `/page.md` or a per-file config path.
- **`annotations`.** Leave this as `[]` in most cases. When you need callouts, provide a list of `{number, content}` entries, each tied to a code line by a `___N___` suffix on the keyed line. This suffix notation assumes a YAML keyed line, so it does not apply cleanly to other example languages. The web reference renders these as numbered badges on the code, while the IDE lists the callout content as plain numbered text below the code (with the markers stripped), so write each callout to read on its own.

Use "Jetstream" for any fictional company, team, or URL in examples.

Here is a plain example from `base_url.yml`:

```yaml
examples:
  - description: >-
      In this example, we have configured the base URL to `/documentation/` so
      all output URLs will be prefixed with this path.
    language: yaml
    code: 'base_url: /documentation/'
    annotations: []
    source: /cloudcannon.config.yml
```

Here is an annotated example from `type.structure.id_key.yml`. Note that the `___1___`, `___2___`, and `___3___` markers in `code` are matched by `number: 1`, `2`, and `3` in `annotations`:

```yaml
    code: |-
      _inputs:
        content_blocks___1___:
          type: array
          options:
            structures: _structures.page_components
      _structures:
        page_components:
          id_key___2___: component
          values:
            - label: Hero Component
              value:
                component___3___: hero
                title:
                description:
                image_path:
                link:
                  text:
                  url:
            - label: Feature Component
              value:
                component: feature
                image_path:
                title:
                description:
                button:
                  link:
                  text:
                reversed_layout: false
            - label: Video Component
              value:
                component: video
                image_path:
                videoUrl:
    annotations:
      - number: 1
        content: >-
          We have configured the Array input `content_blocks` to use the
          `page_components` Structures.
      - number: 2
        content: The `id_key` for `page_components` is `component`.
      - number: 3
        content: >-
          Each option in the `values` array has the `component` key with a
          different value to identify that option.
```

## 5. Terminology, capitalization, spelling

The docs repo is the source of truth. For all product and UI terminology, capitalization of concepts, US English spelling, em-dash policy, and general prose rules such as voice and "describe, don't evaluate", follow `platform-documentation/STYLE_GUIDE.mdx` and `STYLE_GUIDE_AGENTS.md`. The two repos must align, and if in doubt, the docs repo wins.

Because you may not have the docs repo checked out, the minimal local subset you need most often is below:

- **Use US English.** Always use US English spelling.
- **Avoid em dashes.** Rephrase the sentence, or use a period or parentheses instead.
- **Describe, do not evaluate.** Avoid words like "powerful", "simply", "easily", and "just".
- **Italicize product and UI nouns** with `*asterisks*` in description prose, such as `*Collection*`, `*Collection Browser*`, `*Visual Editor*`, `*Schema*`, and `*Input*`, along with named input types like `*Object Input*`, `*Select Input*`, `*Multiselect Input*`, and `*Text Input*`.
- **Capitalize the B in "Collection Browser"** (per the docs repo). The current corpus mostly uses lowercase "Collection browser", so prefer the capitalized form in new writing.
- **Write "WYSIWYG" as plain text**, not italicized, as in "WYSIWYG toolbar".

Some formatting is specific to this repo and is not covered by the docs guide:

- **Use backticks** for schema key names, config paths, dotted key paths, and literal values, such as `` `_inputs` ``, `` `options.required` ``, `` `true` ``, and `` `/cloudcannon.config.yml` ``.
- **Cross-reference another key** with its backticked dot-path, as in "This key requires you to define `options.required`."
- **Name a key's folder, path, file, or value with the backticked key.** When prose refers to the thing a key defines, backtick the key name, as in "the files in your `source` folder" or "the `uploads` path". This applies even when the word reads like a plain noun, because it names the configured key.
- **Write links** as markdown to `/documentation/articles/…`, `/documentation/developer-articles/…`, or `/documentation/developer-reference/…`.

## 6. Doc-file fields

The `title` ([Section 2](#2-title)), `description` ([Section 3](#3-description)), and `examples` ([Section 4](#4-examples)) fields have their own sections. Each `docs/documentation/*.yml` file also has these structural fields:

| Field | Convention |
| --- | --- |
| `gid` | This is the page's identity and filename, so do not change it casually. |
| `url` | The build derives this from `gid`, so do not hand-edit it. |
| `show_in_navigation` | This follows the rule described below. |
| `deprecated` / `deprecated_description` | These follow the deprecation convention described below. |

The `show_in_navigation` field defaults (in `docs/docs.ts`) to `true` only when `gid` starts with `type.` and has exactly two dot-separated parts (for example `type._inputs`); otherwise it defaults to `false`. A value in the YAML overrides the default.

Deprecation uses `deprecated: true` plus a `deprecated_description` that names the replacement. Here is an example from `type._inputs.*.options.allow_empty.yml`:

```yaml
deprecated: true
deprecated_description: >-
  This key is deprecated. If you want to prevent empty values, we recommend
  setting `_inputs.*.options.required` to `true` instead.
```

## 7. Building and verifying

Always run the full build from the repo root:

```
npm run build
```

Never run `npm run build:docs` on its own. It reads whatever schema is already in `dist/`, which is stale unless `build:schemas` ran first, and in that state it sweeps committed override docs into `docs/documentation-unused/`. The full `build` runs `build:schemas` (which regenerates `dist/`) before `build:docs`, so the docs read a fresh schema.

A clean run changes only the files you intended, creates no `docs/documentation-unused/` directory, and round-trips descriptions unchanged.

Never edit on `main`. Propose commits rather than committing automatically.

## 8. Quick checklist

- [ ] The `title` is left `''`, unless the page is a named type page.
- [ ] The description opens with `defines`, `toggles`, or `represents`, and never with availability, status, or a prerequisite.
- [ ] The description is self-contained, with no "as above" or "the following".
- [ ] The description does not restate what the reference auto-generates: the default value, allowed values, the "Required" pill, or the object's child keys (the properties table).
- [ ] Boolean-value keys use the two-sentence pattern and call out the non-default value, while Boolean-input keys do not.
- [ ] Terminology, capitalization, and spelling match the docs repo, using US English, no em dashes, italics on UI nouns, and backticks on keys and values.
- [ ] The `url` is not hand-edited.
- [ ] Every key has at least one example (up to three), each a self-contained snippet that stands on its own (repeating parent context is fine), and every example description reads "In this example, we have configured …".
- [ ] `npm run build` runs clean, producing no `documentation-unused/` directory and only the changes you intended.

## 9. Revision history

| Date | Version | Change |
| --- | --- | --- |
| June 18, 2026 | 1.2 | Added a backtick rule: when prose names the folder, path, file, or value a key defines, backtick the key (the `source` folder, the `uploads` path), even when it reads like a plain noun. |
| June 16, 2026 | 1.1 | Added "Required" (the auto-rendered pill) and the object's child keys (the auto-rendered properties table) to the "do not restate" list; dropped the child-key enumeration sentence from the input-definition template; enriched the input-type-page format in the agents file to match §3 (opener, distinguishing context, required example); added the "Default behavior" rule for keys with no schema default but a runtime-derived default (describe it as behavior, not a value); trimmed the legacy-voice note down to the rule, moving the alignment-pass tracking out of the guide; lifted the optional "Further reading" trailer out of the cascade template into the general follow-ups, marked explicitly optional; changed the example rule to require at least one self-contained example per key (up to three for distinct common configurations), since readers land on a page directly from search; clarified that `___N___` annotations assume a YAML keyed line and render as badges on the web but as plain numbered text in the IDE; review pass: italicized the named input types in the select/multiselect/choice/multichoice model descriptions, removed the trailer from the cascade boilerplate (covered by "Further reading"), moved the "Collection Browser" corpus-alignment note out of the guide, softened the `code` literal-block rule for single-line values, and added a "do not restate" checklist item. |
| June 12, 2026 | 1.0 | Initial guide: organized by doc-file field (title, description, examples); description voice unified on "This key …" across both surfaces (`src/.meta` and docs YAML) with the terser legacy voice noted as an alignment target; terminology deferral to the docs repo; doc-file fields; build and verification. |
