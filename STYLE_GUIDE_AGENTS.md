# configuration-types Style Guide: Agent Reference

Machine-readable rules for writing documentation descriptions and examples in this repo (`configuration-types`). Companion to the human-readable `STYLE_GUIDE.md`, which holds the full prose, examples, and rationale. When rules conflict or a case is ambiguous, `STYLE_GUIDE.md` is authoritative.

**Before writing or editing any description or example (whether in a `src/*.ts` `.meta({ description })` string or a `docs/documentation/*.yml` file), read `STYLE_GUIDE.md` in full.**

**For agents updating this file:** also update the matching prose in `STYLE_GUIDE.md`, and bump the revision history in both: the `last_updated` / `style_guide_version` fields in the YAML block below, and the `Last Updated` / `Version` fields plus the revision-history table in `STYLE_GUIDE.md`.

```yaml
style_guide_version: "1.1"
last_updated: "2026-06-16"

# Terminology, capitalization, and spelling are governed by the docs repo.
# What follows is a MINIMAL local subset so this repo functions without the
# docs repo checked out. The docs repo is authoritative and fuller; keep the
# two aligned; do not let this subset drift.
terminology:
  source_of_truth: >-
    platform-documentation/STYLE_GUIDE.mdx and STYLE_GUIDE_AGENTS.md are
    authoritative for all terminology, capitalization, and spelling. If in
    doubt, the docs repo wins. The two repos must align.
  spelling: "US English always."
  avoid:
    - "em dashes (—): rephrase, or use a period or parentheses"
    - "evaluative / marketing language (powerful, simply, easily, just): describe behavior, not quality"
  # Capitalized product/UI concepts that actually appear in config descriptions.
  # Italicize UI/product nouns with *asterisks* in description prose.
  capitalized_concepts:
    - "Site"
    - "Collection"
    - "Collection Browser"   # capital B, per docs repo (corpus has 'Collection browser'; align over time)
    - "Visual Editor"
    - "Content Editor"
    - "Data Editor"
    - "Source Editor"
    - "Schema"
    - "Structure"
    - "Input"                # and named input types: Object Input, Select Input, Multiselect Input, Text Input, etc.
  not_italicized:
    - "WYSIWYG"              # plain text, e.g. 'WYSIWYG toolbar'

description_opening_patterns:
  applies_to: "ALL descriptions, wherever authored: src/*.ts .meta strings and docs/documentation/*.yml alike."
  allowed_openings:               # open with EXACTLY one of these three
    default: "This key defines ..."
    boolean_value: "This key toggles whether ..."        # see key_category_templates.boolean_value
    array_item_or_entry: "This key represents ..."        # also for noun-ish type/value entries (not bare noun phrases)
  option_group_parent: "This key defines the controls/options ..."  # a 'defines' variant; value is a group of sub-keys (e.g. link_options); not "Configure the ..."
  after_the_opener:               # cover these in following sentences as the key warrants; never as the opening sentence
    interactions_and_prerequisites: "how it relates to / requires / overrides other keys, e.g. 'This key requires you to define `options.required`.'"
    availability: "which narrower set of input types a key applies to when its schema location is broader. For options in the shared _inputs.*.options bag that apply to only some input types (e.g. options.required lists the input types it supports). Redundant (skip) if the key is already nested under a type-specific parent (e.g. show_count under (textarea-input).options), since Appears in shows it."
    no_default: "State 'This key has no default.' when the key has neither a schema default nor a derived default behavior (see default_behavior); the reference renders nothing otherwise, and the silence can read as a doc gap."
    default_behavior: "When a key has NO schema default but CloudCannon derives one at runtime (naming convention, site flag, value of another key), the reference shows nothing, so describe that behavior. Phrase as behavior ('If you do not set this key, CloudCannon ...'), NOT as a value ('By default, this key is `X`'). For a boolean, can fold into the non-default sentence."
    non_obvious_behavior: "edge cases, side effects, or recommendations the type alone doesn't convey"
    further_reading: "OPTIONAL and uncommon trailer, only when a genuinely relevant article exists: 'For more information, please read our documentation on [topic](link).' Never add as a default. Applies to any key, not just cascade keys."
  do_not_restate:                 # the reference + IDE auto-render these from the schema; keep them OUT of the prose
    defaults_to: "an actual default VALUE (from a schema `default`); but DO state 'This key has no default.' when there is none (see after_the_opener.no_default), and describe a derived default as behavior when there is no schema default (see after_the_opener.default_behavior)"
    allowed_values: "an enum's options (from `enum`)"
    appears_in: "the structural parent location(s) where the key sits; but add an availability sentence (see after_the_opener.availability) when a shared key applies to only a narrower context this can't show"
    required: "the red 'Required' pill (auto-derived from the schema `required` array); never write 'this key is required'"
    properties_table: "when the value is an object, the auto-rendered properties table of every child key it can contain; never enumerate those child keys in the prose"
  rules:
    - "Open with defines / toggles / represents only."
    - "The opening sentence leads with what the key does; defaults, accepted values, interactions, availability/status go in following sentences."
    - "Descriptions must be self-contained; they render in isolation. No 'as above' / 'the following'."
  legacy_voice:
    note: >-
      Some existing src/*.ts .meta strings use a terser legacy voice: imperative
      openings (Enables/Sets/Hides/Controls/Provides/Changes...) and bare noun
      phrases (A single..., An array of...). Do not mirror that voice.
    rule: "Write new/edited descriptions in the 'This key ...' voice, even when revising a legacy string."

key_category_templates:
  boolean_value:               # value is a literal true/false (e.g. code_block, disable_add)
    template: |
      This key toggles whether CloudCannon will [outcome].

      Setting this key to `[non-default]` will [effect].
    default_rule: >-
      Most booleans default to false, so describe what `true` does. When the key
      defaults to true, call out `false` instead.
    note: >-
      A key whose value is a Boolean Input DEFINITION (an object) is NOT a
      boolean-value key; use object_input. The 'Setting this key to ...' sentence
      does not apply to it.
  map_collection:              # _inputs, _select_data, _structures
    template: |
      This key defines which [things] are available at a given level of the configuration cascade.

      This key has no default.

      If undefined at higher levels of the [configuration cascade](/documentation/articles/using-the-configuration-cascade/), `X` will default to any values configured in the [CloudCannon configuration file](/documentation/articles/what-is-the-cloudcannon-configuration-file/).
    optional_trailer: "For more information, please read our documentation on [topic](link)."
  object_input:                # type._inputs.*, editables *_options sub-keys (value is an input definition)
    template: "This key defines the input for [purpose]."
    note: "Do not enumerate the object's child keys; the reference auto-renders a properties table of every child key it can contain (see do_not_restate.properties_table)."
  single_input:                # (x-input) type pages: canonical reference for each input; higher bar than ordinary keys
    template: "This key defines an editing interface for [purpose]."
    also_cover: >-
      The distinguishing context a reader needs to choose the input: the `type` token(s)
      it accepts, what value it stores, and how it differs from related inputs.
    require_example: yes        # include a usage example showing the input configured with its `type`
  option_group_parent:         # value is a group of related sub-keys (e.g. link_options)
    template: "This key defines the controls for [purpose]."
  array_item_or_set_entry:     # one item in an array / one entry in a set
    template: "This key represents [what one entry is]."

schema_formatting:
  backtick:                    # use `backticks` for:
    - "key names (`_inputs`, `base_url`)"
    - "config paths and dotted key paths (`options.required`, `_inputs.*.options.max_items`)"
    - "literal values (`true`, `false`, `select`)"
    - "file paths (`/cloudcannon.config.yml`)"
  cross_reference: >-
    Reference another key by its backticked dot-path, e.g. 'This key requires
    you to define `options.required`.'
  link_path_prefixes:
    - "/documentation/articles/..."
    - "/documentation/developer-articles/..."
    - "/documentation/developer-reference/..."

rendering:                     # why backticks are safe; where text surfaces
  ide: >-
    dist/*.schema.json (e.g. cloudcannon-config.latest.schema.json) drives IDE
    validation/autocomplete for cloudcannon.config.yml. The build copies
    description into markdownDescription, which the YAML/JSON LSP renders as
    markdown, so backticks show as inline code (not literal characters).
  web: "documentation.json feeds the published config reference, which also renders markdown."
  src_meta_vs_override: >-
    Descriptions in src/*.ts .meta appear in BOTH the IDE schema and the web
    reference. Override-only YAML docs (dedupe $ref cases, e.g. _editables
    *_options sub-keys) appear on the WEB reference only; in the IDE those keys
    inherit the shared type's description.

doc_file_fields:               # docs/documentation/*.yml
  gid: "Identifier and filename. The page's identity; do not change casually."
  url: "Derived from gid by the build. Do not hand-edit."
  title: "Leave '' (empty). Only named top-level type pages carry a display title (e.g. 'Text Input')."
  description: "The prose. Follows description_opening_patterns and key_category_templates."
  examples: "See examples_rules."
  show_in_navigation:
    default_rule: >-
      true only when gid starts with 'type.' AND has exactly 2 dot-separated
      parts; otherwise false. YAML may override.
  deprecation_template:
    deprecated: true
    deprecated_description: "This key is deprecated. Use `X` instead."
  do_not_edit:
    - "url"

examples_rules:
  min_examples: 1              # EVERY key has at least one example
  max_examples: 3              # up to 3 when each shows a distinct, common configuration option
  standalone: >-
    Each page must stand on its own; readers land via search without seeing the parent. Write a small but
    COMPLETE snippet showing the key in context. Repeating parent context is fine and often necessary. A
    trivial example (e.g. a single boolean set to `true`) still counts. For a union-branch key (e.g. date vs
    ISO8601 string), show that branch's specific value shape.
  description: "Phrase as 'In this example, we have configured ... to ...'."
  language: "Mostly yaml; also markdown, liquid, css."
  code: "YAML literal block (|-)."
  source: "Where the snippet belongs, mostly /cloudcannon.config.yml; also /page.md and per-file config paths."
  annotations:
    default: "[]"
    when_used: >-
      Numbered callouts [{number, content}] linked to code lines via a `___N___`
      suffix on the keyed line (e.g. `data_config___1___:` ties to annotation
      number 1). Suffix assumes a YAML keyed line; does not apply cleanly to other
      languages. Web renders badges on the code; IDE lists callout content as plain
      numbered text below the code (markers stripped). Write each callout standalone.
  fictional_names: "Use 'Jetstream' for fictional company / team / URL examples."

build:
  command: "npm run build"            # run from repo root
  never_run_alone: "npm run build:docs"
  why: >-
    build:docs alone reads whatever schema is already in dist/, which is stale
    unless build:schemas ran first; in that state it sweeps committed override
    docs into docs/documentation-unused/. The full build runs build:schemas
    (regenerating dist/) before build:docs, so docs read a fresh schema.
  clean_run:
    - "only intended files change"
    - "no docs/documentation-unused/ directory is created"
    - "descriptions round-trip unchanged"
  git: "Never edit on main. Propose commits; do not auto-commit."
```
