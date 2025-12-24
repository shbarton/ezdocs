# EZ Docs Requirements

This document defines MVP and v1 requirements for productizing EZ Docs.

## Scope Definitions
- MVP: A sellable, stable documentation generator for Nextra with a working starter template.
- v1: Adds more templates, improved asset pipeline, and stronger validation/testing.

## Functional Requirements (MVP)

### Project Initialization
- Provide `npm create ezdocs <name>` to scaffold a new docs project.
- Generate a working Nextra site with sample content.
- Create a default `ezdocs.config.yml` with documented fields.

### Content Processing
- Parse Markdown with YAML frontmatter.
- Build a content index with metadata and file paths.
- Generate deterministic routes using collection config + slug.

### Nextra Output
- Generate `.ezdocs/pages` with MDX content.
- Generate `_meta.json` navigation files.
- Generate theme config stubs compatible with Nextra docs theme.

### CLI Commands
- `ezdocs-build`: Build content and Nextra output.
- `ezdocs-dev`: Build on change and run Nextra dev server.
- `ezdocs-validate`: Validate config and frontmatter.

### Configuration
- Define collections, patterns, routes, and sorting.
- Define site metadata and output directory.
- Allow ignoring draft content.

### Errors and Validation
- Provide clear error messages when frontmatter is invalid.
- Fail fast on missing required fields (title, route).
- Warn on duplicate routes or slugs.

## Functional Requirements (v1)

### Content Features
- Support hierarchical navigation with parent/child relationships.
- Support per-collection sidebar settings for Nextra.
- Generate TypeScript types for content consumers.

### Assets
- Process images (resize + optimize).
- Copy static assets referenced in Markdown.
- Provide asset path rewriting.

### Templates
- Provide at least two templates (docs + api).
- Template placeholders for name/description/logo.

### Developer Experience
- Config schema validation with helpful hints.
- Dev watcher for content changes with incremental rebuilds.
- Standardized logging output.

## Non-Functional Requirements
- Cross-platform (macOS, Windows, Linux).
- Deterministic builds.
- No network requirement at build time.
- Build memory under 1 GB for typical repos (500 pages).

## Acceptance Criteria (MVP)
- A new project builds and runs with `npm run dev`.
- Editing a Markdown file updates output without manual steps.
- Generated `_meta.json` matches the order rules in config.
- Config and content validation covers basic errors.

## Out of Scope (for MVP)
- Full WYSIWYG editor.
- Automatic internationalization.
- Multi-theme support beyond Nextra docs theme.
- Advanced search indexing beyond Nextra defaults.
