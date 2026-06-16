# Handover: configuration-types documentation style guide

This is a context handover for a fresh chat to finish and land the **style guide** in the `configuration-types` repo. The companion work (the 10 `_editables` override docs) is being committed separately and is **not** part of this handover.

## What this is

A writing style guide for the docs in `configuration-types` — the `title` / `description` / `examples` that generate CloudCannon's published config-file reference (web) and feed IDE autocomplete. It mirrors `platform-documentation`'s two-file pattern:

- `configuration-types/STYLE_GUIDE.md` — prose, authoritative.
- `configuration-types/STYLE_GUIDE_AGENTS.md` — machine-readable YAML companion.

Both already exist in the working tree (currently **untracked**). They are at version **1.0 / June 12, 2026**.

## Branching

- The style guide must move to **its own branch off `main`** (use `--no-track`), separate from the editables override-doc work currently on `feat/doc-overrides`.
- Suggested: `git switch -c <style-guide-branch> --no-track origin/main`, then `git add STYLE_GUIDE.md STYLE_GUIDE_AGENTS.md && git commit`. (Untracked files carry across the switch.)
- **Never commit autonomously** in this repo — propose the commit and let Ella run it. **Never edit on `main`.**
- A pointer to the guide was added to Ella's global `~/.claude/CLAUDE.md` "Key reference files" (outside the repo; not part of any commit).

## Settled design decisions (already in the files — do not relitigate)

- **Organized by doc-file field:** §1 Where descriptions live · §2 Title · §3 Description (Voice and openings + Templates by key kind) · §4 Examples · §5 Terminology · §6 Doc-file fields · §7 Building and verifying · §8 Quick checklist · §9 Revision history.
- **Full sentences throughout** the prose guide (no fragment bullets/table cells). The agents file stays terse YAML by design.
- **One voice, three openings only:** every description uses `This key defines …` / `This key toggles whether …` / `This key represents …`. Applies to **both** surfaces (`src/*.ts` `.meta` and `docs/documentation/*.yml`). The terse legacy `src/.meta` voice ("Enables…/Sets…/Hides…") is a documented **alignment target**, not allowed for new writing.
- **Never open with availability, status, or a prerequisite** — those are secondary sentences only.
- **Boolean-value keys** (value is literal `true`/`false`): two-sentence toggle pattern, and the second sentence calls out the **non-default** value (most default `false` → describe `true`; default-`true` keys → describe `false`).
- **Terminology/spelling/US English defer to `platform-documentation`** (`STYLE_GUIDE.mdx` + `STYLE_GUIDE_AGENTS.md`) as source of truth; the agents file keeps a **minimal local subset** so it works standalone. Specifics: US English; **avoid em dashes** (only one literal `(—)` is allowed, in the agents rule that names the banned character); "Collection Browser" capital B; "WYSIWYG" plain text.
- **Do not restate what the reference auto-generates from the schema.** Confirmed auto-rendered by the `platform-documentation` renderer (see facts below): **Defaults to**, **Allowed values**, **Appears in**, the **Required** pill, and the **properties table** (every child key the object can contain). Exception: state `This key has no default.` by hand when there is no default (the renderer shows nothing in that case, and silence reads as a doc gap).
- **Input-type pages (`(x-input)`) have a higher bar:** opener + distinguishing context (the `type` token(s), what it stores, how it differs from related inputs) + a required usage example. Model example is `select-input`. Most type pages are thin one-liners today = alignment target.

## PENDING edits to apply on the style-guide branch (IMPORTANT)

Three findings were made *after* the files were last fully edited, so the two files are slightly out of sync / stale. Apply these, then rebuild:

1. **Sync `single_input` into the agents file.** `STYLE_GUIDE.md` §3 enriched the input-type-page format to the 3-part bar above, but `STYLE_GUIDE_AGENTS.md` (around line 95) still has the old one-liner:
   `single_input: template: "This key defines an editing interface for [purpose]."`
   → Replace with the enriched format (opener + `also_cover` the type token/stored value/vs-related-inputs + `require_example: yes`).

2. **Add "Required" to the "do not restate" lists.** The renderer shows a red **Required** pill auto-derived from the schema `required` array (`docs/index.ts:280` sets `page.required`; `platform-documentation/_components/Reference/RefType.tsx:198-199` renders the pill). Confirmed: the `type` child of url/text/select/boolean inputs is `required=True`.
   → Add a bullet to `STYLE_GUIDE.md` §3 "Do not restate" (after `Appears in`, ~line 98) and a `required` entry to `STYLE_GUIDE_AGENTS.md` `do_not_restate` (~line 57): never write "this key is required"; the pill handles it.

3. **Stop enumerating the object's child keys (properties table is auto-rendered).** The renderer shows a `PropertiesTable` of every child key (`platform-documentation/_components/Reference/ReferenceContent.tsx`; the `url-input` page's `properties` already lists `comment, context, documentation, label, hidden, disabled, instance_value, disable_instance_value_rehydration, cascade, type, options`). So the enumeration sentence is redundant.
   → In `STYLE_GUIDE.md` §3 "Templates by key kind", the **input-definition keys** template (~line 159) currently reads:
   `This key defines the input for [purpose]. The value is an object that can contain `label`, `comment`, `options`, and other input-specific properties.`
   Drop the second sentence so the template is just the purpose sentence. Do the same to `STYLE_GUIDE_AGENTS.md` `object_input.template` (~line 92).
   → Add "the object's child keys (the properties table)" to both "do not restate" lists.
   Note: this matches what the 10 override docs already do (their descriptions are single purpose sentences with the enumeration removed).

After applying: bump the revision history in **both** files (the cross-sync rule) — `Last Updated`/`Version` + table row in `STYLE_GUIDE.md`, and `last_updated`/`style_guide_version` in the agents YAML.

## Cross-repo facts the guide relies on (for verification)

In `platform-documentation` (public repo), the config reference is rendered from `configuration-types`' generated `documentation.json` / schemas:
- `_components/Reference/RefType.tsx` — the **Required** pill.
- `_components/Reference/RefItem.tsx` / `ReferenceContent.tsx` — **Appears in**, **Defaults to**, **Allowed values**, and the **PropertiesTable** (child keys).
- `_components/Reference/helpers.ts` `resolveRef()` — merges a per-reference `documentation` override onto the resolved type page; `description: docRef.documentation.description || doc.description` (empty string falls back to the shared type).
- IDE: the build copies `description` → `markdownDescription` (`generate-schemas.ts`), so backticks render as inline code in VS Code hovers. **Override-only YAML docs** (dedupe `$ref` cases like `_editables.*_options`) surface on the **web only**; the IDE shows the shared type's description.

## Build & verify

- Always run the full build from the repo root: **`npm run build`**.
- **Never run `npm run build:docs` alone** — it reads a stale `dist/` schema and sweeps committed override docs into `docs/documentation-unused/`. The full `build` runs `build:schemas` first.
- The style-guide files are plain top-level markdown, **outside** the doc pipeline, so editing them does not require a build. Run a build only to confirm nothing else regressed.
- Sanity-check after edits: no em dashes except the one literal `(—)` in the agents file; `STYLE_GUIDE.md` and `STYLE_GUIDE_AGENTS.md` agree (every YAML rule has prose backing; version/date stamps match).

## Quick file map

- `configuration-types/STYLE_GUIDE.md` — prose guide (authoritative).
- `configuration-types/STYLE_GUIDE_AGENTS.md` — YAML rules (derived; keep in sync).
- Schema source for descriptions: `configuration-types/src/*.ts` (`.meta({ description })`); e.g. `src/editables.ts`, `src/input-base.ts`, `src/inputs.ts`.
- Doc generation: `docs/index.ts` (`buildPageRef`, `required` at line 280), `docs/docs.ts` (`writeNewDocs` round-trip, `show_in_navigation` rule), `redocument-schemas.ts`.
- Generated reference data: `dist/documentation.json`, `dist/cloudcannon-config.latest.schema.json`.
