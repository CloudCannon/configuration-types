# Description alignment passes (configuration-types)

Tracking for corpus-wide alignment work that follows from the style guide but is too large to do in one pass. These are deferred clean-up tasks, not reader-facing style rules, so they live here rather than in `STYLE_GUIDE.md`.

## 1. Legacy `.meta` voice → remove `src` descriptions (gated on overlay fix + two gaps)

Originally framed as a voice rewrite (convert legacy `src` `.meta` strings — "Enables…", "Sets…", "Provides…" — to the "This key …" voice). Investigation changed the direction.

**Root cause found and fixed.** The IDE schema is meant to overlay each key's canonical `docs/documentation/*.yml` description via `redocumentSchema`, but `deref()` discarded the `$def` name, so the overlay silently missed every key reached through a `$ref` (i.e. all nested `type.*` keys — inputs, editables, structures, snippets); only top-level keys (whose structural path already equalled their gid) matched. Fixed on this branch in `redocument-schemas.ts` by carrying the `$def` name onto the resolved node as `id`, which is what `walk()`'s path-reset was written to consume. Overlaid "This key" descriptions jumped 348 → 1212; the residual legacy in the IDE schema dropped from ~184 to 14. Fix isolated to `redocument-schemas.ts` and reported to the maintainer.

**Maintainer direction.** The yml files are canonical and overwrite the `src` `.meta` descriptions; the maintainer intends to **remove the `description` fields from `src/*.ts` entirely** (they have "been meaning to remove" them). So this pass is no longer a voice rewrite — it is deleting the now-redundant `src` descriptions, **once every key is safely covered by yml**. Do not remove anything until both gaps below are closed.

### Gap 1 — keys with no yml override (14 `src` descriptions; ~9 distinct keys)

The original list was from a heuristic prefix match; instrumenting the overlay walk (temporary `[GAP]` logging in `redocumentSchema`) gave the precise gids and reclassified them. Corrections:

- **`type._inputs.*.type` is NOT a gap.** Every real `(x-input).type` already has a yml page (`hasDoc=true`); only `(automatic-input)`/`(unknown-input)` lack one, which falls under those input types below.

**Resolved — `documentation` (no new ids needed; page generalized).** Fact-checked against `app`: every context (input, object-input group, structure value, mutable-object add-key, collection browser) reads the identical `{url, text, icon}` shape and renders through the **one** `DocumentationLink` (`c-documentation-link`) component — same feature, placement only differs. `DocumentationSchema` already has `id: 'type.documentation'`, and `docs/documentation/type.documentation.yml` already exists. What broke the share was the per-usage `.meta({ description })` override, which forces Zod to inline the usage instead of `$ref`-ing the shared def. So the fix is just the **removal step** (deleting those overrides collapses every `documentation` key back onto `type.documentation`, which the page overlays everywhere) — no per-usage ids required. **Done:** generalized `type.documentation.yml` from collection-specific wording to placement-agnostic. (The old `src` text was unreliable anyway — `inputs.ts:500`'s "above the collection file list" is actually an object-input *group*.)

**Content pages — DONE / resolved** (fact-checked against `app`):

- **`type._inputs.*.(date-input).options.timezone` — DONE.** Authored `docs/documentation/type._inputs.*.(date-input).options.timezone.yml`; verified it overlays into the IDE schema and the old `src` text is gone. All three behaviors confirmed against `app`: dates are displayed/edited in the timezone (`date-helper.ts` `overrideTimezone`), the saved value's UTC offset suffix reflects it (`parse` / `normaliseTimezoneSuffix`), and it falls back to the *Site* `timezone` then `Etc/UTC` (`block.view.ts` resolution chain). Default phrased as behavior per the guide (the input key has no schema default).
- **`(automatic-input)` and `(unknown-input)` — no page needed.** Both carry `excludeFromDocumentation: true`, honored by `docs/index.ts`, so they are deliberately undocumented internal types. Their `src` descriptions are simply removed in the removal step (nothing to overlay, nothing to author).

**Convention decisions — fold into the Gap 2 maintainer note** (these share the cause: ids that are not `type.`-prefixed, so `walk()`'s path-reset at line 52 ignores them and the gid becomes `<parent>.(name)` with no yml):

- `icon` (IconSchema, `id: 'icon'`) — appears as `<parent>.icon.(icon)` across ~7 contexts
- `syntax` (Syntax enum) — `(code-input).options.syntax.(syntax)`
- `select-values` — covered as `type._select_data.*` but not the inline `type._inputs.*.options.values.(any-of-1)` branch
- root `type.Configuration` resolves to an empty gid — leave undocumented (it is the root object)

Each needs either a `type.`-prefixed `id` (so it collapses to one canonical gid + page) or a tweak to the line-52 condition. Same class of structural call as Gap 2.

**Also discovered during the §5 audit — no-yml keys with runtime defaults:** the build-coupled keys in `src/build-coupled.ts` (`filter.base` "all"/"strict", `parser` "latest schema", `output` false, the integration-folder output path) and the image-conversion `format` in `src/image-options.ts` have no yml page. Their `src` "Defaults to …" lines describe runtime defaults that would be lost on removal. Decide per key whether to author a yml page (so the default behavior is documented) or treat as intentionally undocumented (the build-coupled config may be).

### Gap 2 — schemas that don't apply the overlay (NEEDS MAINTAINER FEEDBACK)

Only schemas with `redocument: true` get the yml overlay (`.latest`, `structures`, `inputs`, `structure-value`, `snippets`, `snippets-imports`, `editables`, `collections`, `schemas`, `routing`, `initial-site-settings`). These 8 do **not**, so they still read `src` descriptions and would lose them on removal:

- `cloudcannon-config.legacy-jekyll`, `-hugo`, `-eleventy`, `-reader` — published artifacts (their `$id` points at GitHub release download URLs); `legacy-jekyll` confirmed to still carry ~84 raw `src` strings
- `cloudcannon-config.documentation`, `cloudcannon-routing.documentation`, `cloudcannon-initial-site-settings.documentation`
- `cloudcannon-snippets-definitions`

**⏳ Waiting on the maintainer:** for each, either add `redocument: true` so yml overlays it too, or confirm it is deprecated / does not need descriptions. The legacy SSG schemas are the key question. Do not strip any `src` description that feeds these schemas until this is resolved.

### Removal step (only after Gap 1 and Gap 2 are both closed)

Delete the `description` fields from `src/*.ts` `.meta` calls. Verify every published schema still carries descriptions (from the yml overlay), and that `npm test` and `tsc --noEmit` pass.

**Folded-in follow-up — `type.snippet.inline`:** the §5 strip pass left an interim `src` string for `snippets.ts` `inline`. Under the removal approach this `src` string just gets deleted; the only open item is a yml-content question — the canonical `docs/documentation/type.snippet.inline.yml` does not mention the block-level (`false`) behavior. Decide during §4 whether to add it so the detail survives in the canonical copy.

## 2. "Collection Browser" capitalization — DONE (commit `161c1a3`)

The guide (§5) specifies the capital B in "Collection Browser", but the corpus used lowercase "Collection browser". Fixed: 12 occurrences in `src/collections.ts` changed to `_Collection Browser_`; no other casing variants remained.

## 3. `image_size_attributes` schema default — DONE (commit `0fbca86`)

`src/image-options.ts` set `image_size_attributes: z.boolean().default(true)`, so the reference rendered "Defaults to: `true`". The app's runtime has no static `true` default — it falls back to the site `image_size_attributes_default` flag (set `true` only for sites that existed at the 2023-06-20 migration; `false`/unset for newer sites), confirmed against `app` at `rich-text-view.ts` (`inputConfig?.options?.image_size_attributes ?? flags?.image_size_attributes_default`) and the migration `20230620222008`. Fixed: removed `.default(true)` so the badge no longer asserts a wrong default, and corrected the docs page date from "June 23" to "June 20 2023" to match the migration.

## 4. Input-type page enrichment — DONE

The canonical `(x-input).yml` pages should meet the higher bar in §3: opener + distinguishing context (the `type` token(s), what it stores, how it differs from related inputs) + a usage example. `select-input` was the model.

All 10 pages that lacked examples now have one, plus a distinguishing sentence where thin: `array`, `code`, `color`, `date`, `file`, `object`, `range`, `rich-text`, `time`, `url`. Each example is valid config drawn from that type's real schema options (e.g. `range` `min`/`max`/`step`, `code` `syntax`, `color` `format`/`alpha`, `array` `structures`). Distinguishing sentences use `*X Inputs* …` / action-led phrasing per STYLE_GUIDE.mdx §1.3.3 (never "editor"/"editors" as a person; "code editor"/"WYSIWYG editor" used only as the guide's permitted generic controls). Verified: all 10 build, overlay into the IDE schema, `tsc` and the 102 tests pass.

§4-adjacent follow-up (from §5) — DONE. Audited all ~24 runtime-default keys' yml. The yml already describes the derived default for almost all of them (`color` `format`/`alpha`, `value_key`, `options.values`, `snippet view`, `structure values icon`, `add_options` `name`/`editor`/`schema`/`collection`, `sort_options label`) — the initial "gap" list was a truncated-grep artifact. Fixes/findings:

- **`context.title` — fixed.** Added "If you do not set this key, CloudCannon uses `Context`." (confirmed against `app`: `context.view.ts` renders `heading || 'Context'`).
- **`context.icon` — no action.** The yml correctly says "This key has no default"; the `src` "Defaults to `auto_stories`" is stale — `auto_stories` appears nowhere in `app`, and `context.view.ts` renders an icon only when one is set. The wrong `src` string is removed in §1's removal step.
- **`add_options.(add-option).base_path` — left as-is (borderline).** No explicit "If you do not set…" sentence, but the description conveys the default via "overrides the path for the current *Collection* and subfolder open in the *Collection Browser*."
- **`*_custom_markup` booleans — left as-is (borderline).** The toggle wording covers them; `allow_custom_markup`'s conditional runtime default (true for non-content-editable regions, false otherwise) is not stated, but adding it would need app verification of the exact condition.

## 7. Empty descriptions in the snippets area

47 keys in the snippets cluster have `description: ''` (no description at all) and need authoring from scratch — 41 in `type._snippets_imports.*` (the SSG import presets: `eleventy_liquid`, `hugo`, `jekyll`, `markdoc`, `mdx`, etc., each with `(include-list)`, `(exclude-list)`, their `.[*]` items, and `(full-import)`), plus 6 others (e.g. `type.snippet-reference.ref`). This is content authoring (like the missing examples), deferred from the descriptions+terminology pass. The repetitive `_snippets_imports` presets can be templated once the feature's behavior is confirmed.

## 6. Annotation notation for non-YAML examples

The `___N___` annotation marker is a suffix on a *keyed* line, so it only works for YAML examples. Example languages such as `markdown`, `liquid`, and `css` have no keyed line to suffix, so callouts can't be tied to code the same way. Consider a notation that works across languages (for example a line/column reference, or an inline comment marker) if annotated non-YAML examples are needed.

Related fix already landed on the style-guide branch: `redocument-schemas.ts` now strips `___\d+___` markers from example code before embedding it in the IDE `markdownDescription`, and lists the annotation content as plain numbered text below the code (previously the IDE showed raw `data_config___1___:` markers and dropped the callout text). The web reference still renders badges via `platform-documentation/_components/CodeBlock.tsx`.

## 5. Remaining default-restatements — schema-default strips DONE; runtime rewording folded into §1

Re-scoped on inspection. The earlier "~56 files" estimate was stale, and the corpus does not use the "By default, this key is `X`" phrasing outside the (already-stripped) input files — it uses "Defaults to X" in `src/*.ts` `.meta` descriptions. The canonical web pages (`docs/documentation/*.yml`) are already compliant (zero "Defaults to" prose; the few "by default" hits are legitimate). So the only restatements left were in `src`.

Of the 32 `src` "Defaults to" lines, the rule (strip where a static schema `.default()` auto-renders the badge; keep where runtime-derived) split them:

- **Stripped (DONE, uncommitted at time of writing):** 7 lines that restated a static schema default — `structures.ts` (`reorder_inputs`, `hide_extra_inputs`, `remove_empty_inputs`, `remove_extra_inputs`, `id_key`), `collections.ts` (`hide_extra_inputs`), `build-coupled.ts` (`collections_config_override`). Plus one info-preserving rewrite of `snippets.ts` `inline` (kept the block-level behavior; see the follow-up note in §1).
- **Remaining (~24 lines):** all runtime/derived defaults. Under §1's removal direction these `src` strings will simply be **deleted**, not reworded — so the work shifts to the canonical yml: confirm each such key's `docs/documentation/*.yml` describes the runtime default as behavior ("If you do not set this key, CloudCannon …"), since the auto-rendered badge shows nothing for a runtime default. Most of these keys have a yml page (they are not in §1 Gap 1); the check is whether that yml mentions the derived default. Fold this yml-content check into §4.

**Rule confirmed (matches guide §3):** schema default → strip; runtime/derived default → behavior phrasing, never "By default, this key is `X`"; no default → state "This key has no default."
