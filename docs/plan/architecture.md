# System Architecture

## Overview
EZ Docs consists of two published packages:
- `create-ezdocs`: project generator only.
- `@ezdocs/core`: content processing and Nextra output.

## High-Level Flow
1. Author writes Markdown + YAML frontmatter in `content/`.
2. `@ezdocs/core` parses files and builds a content index.
3. Nextra-compatible pages and metadata are generated into `.ezdocs/`.
4. Nextra dev/build runs inside `.ezdocs/`.

## Modules (Core Package)
- Config loader and validator.
- Content discovery and parsing.
- Metadata normalization and validation.
- Asset processing (images, files).
- Nextra generator (MDX + `_meta.json`).
- Export generators (JSON + TS).

## Data Flow (Simplified)
```
content/ + ezdocs.config.yml
      |
      v
ContentProcessor
  - parse frontmatter
  - generate slug + route
  - build index
      |
      v
Generators
  - Nextra pages
  - _meta.json
  - exports
      |
      v
.ezdocs/ (Nextra project)
```

## File System Layout
- `content/`: source Markdown content.
- `public/`: static assets (copied or referenced).
- `.ezdocs/`: generated Nextra project (gitignored).
- `ezdocs.config.yml`: configuration.

## Build Phases
1. Load and validate config.
2. Discover files with glob patterns.
3. Parse Markdown + frontmatter.
4. Validate content (required fields, duplicates).
5. Process assets (optional in MVP).
6. Generate Nextra output.
7. Generate exports (optional for MVP).

## Error Strategy
- Fail fast on invalid config.
- Soft fail (warnings) on optional metadata issues.
- Clear error location with file path + frontmatter field.

## Integration Boundaries
- Nextra is a runtime dependency of generated projects, not of core.
- The `.ezdocs/` project is a standard Next.js app.
- Core is responsible only for content and layout scaffolding.
