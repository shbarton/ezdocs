# Configuration Schema (Draft)

EZ Docs config lives in `ezdocs.config.yml`. This is the source of truth for collections, routing, and outputs.

## Example
```yaml
version: "1.0"
name: "My Docs"
description: "Project documentation"

content:
  source: "./content"
  ignore:
    - "**/drafts/**"
    - "**/*.draft.md"

collections:
  docs:
    pattern: "docs/**/*.md"
    route: "/docs/{slug}"
    sort:
      by: "order"
      fallback: "title"
      order: "asc"
    nextra:
      sidebar: true
      searchable: true

site:
  title: "My Docs"
  description: "Project documentation"
  baseUrl: "https://docs.example.com"
  logo: "./assets/logo.svg"

output:
  nextra:
    directory: "./.ezdocs"
    theme: "docs"
  exports:
    - type: "json"
      path: "./content.json"
    - type: "typescript"
      path: "./src/generated/content.ts"

images:
  formats: ["webp", "jpeg"]
  sizes: [640, 1280, 1920]
  quality: 85

dev:
  port: 3000
  watch: true
```

## Top-Level Fields
- `version` (string, required): schema version.
- `name` (string, optional): project name.
- `description` (string, optional): project description.
- `content` (object, required): source settings.
- `collections` (object, required): collection map.
- `site` (object, optional): site metadata.
- `output` (object, required): build outputs.
- `images` (object, optional): image processing.
- `dev` (object, optional): dev server settings.

## Content
- `content.source` (string, required): content root dir.
- `content.ignore` (array of string, optional): glob ignores.

## Collections
Each key under `collections` is a collection name.

- `pattern` (string, required): glob pattern relative to `content.source`.
- `route` (string, required): route template, supports `{slug}` and `{category}`.
- `sort.by` (string, optional): frontmatter field name.
- `sort.fallback` (string, optional): fallback sort field.
- `sort.order` (string, optional): `asc` or `desc`.
- `nextra` (object, optional): Nextra sidebar behavior.

## Site
- `site.title` (string, optional)
- `site.description` (string, optional)
- `site.baseUrl` (string, optional)
- `site.logo` (string, optional): path to logo asset.

## Output
- `output.nextra.directory` (string, required)
- `output.nextra.theme` (string, required): `docs` or `blog`
- `output.exports` (array, optional): export definitions.

### Export Definition
- `type` (string, required): `json` or `typescript`
- `path` (string, required): output file path

## Images
- `images.formats` (array of string, optional)
- `images.sizes` (array of number, optional)
- `images.quality` (number, optional)

## Dev
- `dev.port` (number, optional)
- `dev.watch` (boolean, optional)

## Defaults (Proposed)
- `content.source`: `./content`
- `output.nextra.directory`: `./.ezdocs`
- `output.nextra.theme`: `docs`
- `dev.port`: `3000`
- `dev.watch`: `true`
