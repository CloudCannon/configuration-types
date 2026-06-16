# Description alignment passes (configuration-types)

Tracking for corpus-wide alignment work that follows from the style guide but is too large to do in one pass. These are deferred clean-up tasks, not reader-facing style rules, so they live here rather than in `STYLE_GUIDE.md`.

## 1. Legacy `.meta` voice

Many existing `src/*.ts` `.meta({ description })` strings still use a terser legacy voice: imperative openings such as "Enables…", "Sets…", "Hides…", "Controls…", "Provides…", "Changes…", and bare noun phrases such as "A single…", "An array of…". These predate the style guide.

They surface in IDE hovers for any key that has no `docs/documentation/*.yml` page (the YAML `description` wins for keys that do have a page — see `docs/index.ts` `description: documentation?.description || doc.description`). So the web reference can already be in the "This key …" voice while the IDE hover still shows the legacy string.

**The pass:** convert the remaining legacy `.meta` strings to the "This key …" voice so IDE hovers match the web reference. Parallel to the terminology alignment in §5 of the guide.

**Rule that stays in the guide:** write new and edited descriptions in the "This key …" voice, even when revising a legacy string; do not mirror the legacy voice.

## 2. "Collection Browser" capitalization

The guide (§5) specifies the capital B in "Collection Browser", but the current corpus mostly uses lowercase "Collection browser". Aligning the corpus is a separate find-and-fix task.

## 3. `image_size_attributes` schema default

`src/image-options.ts:34` sets `image_size_attributes: z.boolean().default(true)`, so the reference renders "Defaults to: `true`". The app's runtime has no static `true` default — it falls back to the site `image_size_attributes_default` flag (set `true` only for sites that existed at the 2023-06-20 migration; `false`/unset for newer sites). The default of `true` is therefore wrong for any site created after mid-2023. Fixing this is a `src` change (affects the published reference and IDE autocomplete), deferred off the docs-focused branch. The doc prose already describes the real flag-based behavior.

## 4. Input-type page enrichment (in progress)

The canonical `(x-input).yml` pages should meet the higher bar in §3: opener + distinguishing context (the `type` token(s), what it stores, how it differs from related inputs) + a usage example. As of this branch, 10 still have no example (`array`, `code`, `color`, `date`, `file`, `object`, `range`, `rich-text`, `time`, `url`) and several lack distinguishing context. `select-input` is the model.

## 6. Annotation notation for non-YAML examples

The `___N___` annotation marker is a suffix on a *keyed* line, so it only works for YAML examples. Example languages such as `markdown`, `liquid`, and `css` have no keyed line to suffix, so callouts can't be tied to code the same way. Consider a notation that works across languages (for example a line/column reference, or an inline comment marker) if annotated non-YAML examples are needed.

Related fix already landed on the style-guide branch: `redocument-schemas.ts` now strips `___\d+___` markers from example code before embedding it in the IDE `markdownDescription`, and lists the annotation content as plain numbered text below the code (previously the IDE showed raw `data_config___1___:` markers and dropped the callout text). The web reference still renders badges via `platform-documentation/_components/CodeBlock.tsx`.

## 5. Remaining "By default …" default-restatements

The "By default, this key is `X`" default-restatement was stripped from the in-scope input files on this branch. Roughly 56 files outside the input scope still carry it (markdown options, snippet/structure types, `collections_config` add-options, `type._editables.*.code_inline`, deeply nested object-input entries). Strip per the same rule: drop the restatement where the default is a schema default (auto-rendered); keep as a behavior note where the default is runtime-derived.
