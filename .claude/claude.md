# EZ Docs Project Documentation

## Overview

EZ Docs is a content-first documentation generator that transforms Markdown files with YAML frontmatter into professional Nextra-based documentation sites. It enables developers to write portable, framework-agnostic content and automatically generates beautiful, searchable documentation with minimal configuration.

## Problem Statement

Existing documentation systems either lock content into a framework or require extensive manual setup. Developers want:
- Markdown-first workflows compatible with tools like Obsidian and standard IDEs
- Content that outlives any specific framework
- Professional-looking documentation sites without heavy configuration
- Fast setup for multiple projects

## Solution

EZ Docs provides:
1. **Content Processing**: Parse Markdown files with YAML frontmatter from a `content/` directory
2. **Collection System**: Define content collections (docs, guides, API references) via configuration
3. **Nextra Generation**: Automatically generate a complete Nextra site with navigation and metadata
4. **Developer Tools**: CLI commands for building, dev server, and validation

## Architecture

### Monorepo Structure
```
ezdocs/
├── packages/
│   ├── core/              # @ezdocs/core - Content processing & Nextra generation
│   └── create-ezdocs/     # create-ezdocs - Project initialization CLI
├── docs/plan/             # Extensive planning documentation
├── test-project/          # Test/example projects
└── package.json           # Monorepo root with npm workspaces
```

### Core Components

#### @ezdocs/core
**Location**: `packages/core/`

The main library that processes content and generates Nextra sites.

**Key modules**:
- `content/parser.ts` - Parses Markdown with YAML frontmatter using gray-matter
- `content/processor.ts` - Main ContentProcessor class that orchestrates the build
- `content/validator.ts` - Validates content and frontmatter
- `config/loader.ts` - Loads and validates ezdocs.config.yml
- `generators/nextra.ts` - Generates Nextra site structure, pages, and _meta.json
- `generators/exports.ts` - Generates JSON and TypeScript exports
- `utils/slug.ts` - Slug generation for URLs
- `utils/routing.ts` - Route generation based on collection patterns

**CLI binaries** (in `packages/core/bin/`):
- `ezdocs-build` - Process content and generate Nextra site
- `ezdocs-dev` - Watch mode + Nextra dev server
- `ezdocs-validate` - Validate configuration and content

**Dependencies**:
- `gray-matter` - YAML frontmatter parsing
- `fast-glob` - File pattern matching
- `sharp` - Image processing
- `chokidar` - File watching
- `nextra` + `nextra-theme-docs` - Documentation site framework

#### create-ezdocs
**Location**: `packages/create-ezdocs/`

CLI tool for initializing new EZ Docs projects (like `create-react-app`).

**Key modules**:
- `index.ts` - Main CLI entry point using Commander
- `prompts.ts` - Interactive setup using Inquirer
- `generator.ts` - ProjectGenerator class for scaffolding
- `templates/basic/` - Basic documentation template

**Usage**: `npm create ezdocs my-docs` or `node packages/create-ezdocs/dist/index.js my-docs`

## User Workflow

### 1. Create a new project
```bash
npm create ezdocs my-docs
cd my-docs
npm install
```

This scaffolds:
- `content/` directory with sample Markdown files
- `ezdocs.config.yml` configuration file
- `package.json` with ezdocs scripts
- Sample docs and guides

### 2. Write content
Users create Markdown files in `content/` with frontmatter:

```markdown
---
title: "Getting Started"
description: "Learn how to use our API"
order: 1
date: 2024-01-15
tags: ["intro", "quickstart"]
---

# Getting Started

Your markdown content here...
```

### 3. Configure collections
Edit `ezdocs.config.yml`:

```yaml
collections:
  docs:
    pattern: "docs/**/*.md"
    route: "/docs/{slug}"
    sort:
      by: "order"
      order: "asc"
```

### 4. Build and preview
```bash
npm run build    # Process content → generate .ezdocs/ Nextra site
npm run dev      # Start Nextra dev server at localhost:3000
```

## Configuration Schema

The `ezdocs.config.yml` file defines:

- **content**: Source directory and ignore patterns
- **collections**: Define content types with patterns, routes, sorting
- **site**: Title, description, metadata
- **output**: Where to generate Nextra files, export formats
- **images**: Image processing settings (formats, sizes, quality)
- **dev**: Development server configuration

See `packages/create-ezdocs/templates/basic/ezdocs.config.yml` for a complete example.

## Build Process

When `ezdocs-build` runs:

1. **Load config** (`config/loader.ts`) - Parse and validate `ezdocs.config.yml`
2. **Discover files** - Use fast-glob to find Markdown files matching collection patterns
3. **Parse content** (`content/parser.ts`) - Extract frontmatter and body from each file
4. **Process content** (`content/processor.ts`) - Build content index with metadata
5. **Generate Nextra** (`generators/nextra.ts`):
   - Create `.ezdocs/pages/` directory structure
   - Generate MDX files from Markdown
   - Create `_meta.json` navigation files
   - Generate theme configuration
   - Copy assets to public directory
6. **Generate exports** (`generators/exports.ts`) - Create JSON and TypeScript exports

## Current State (as of latest analysis)

### Working ✅
- Core build pipeline functional
- Content parsing with frontmatter
- Nextra site generation
- CLI commands operational
- Template system working
- Test project builds successfully

### Missing/In Progress ❌
- **Tests**: `packages/core/__tests__/` is empty
- **Root README.md**: No GitHub landing page
- **npm publishing**: Not yet published to npm registry
- **Documentation site**: No user-facing docs
- **CI/CD**: No automated testing/releases
- **License decision**: Open source vs commercial not decided

### Planned Features (from docs/plan/)
- Image processing pipeline
- TypeScript type generation for content
- Multiple templates (API docs, blog)
- Hierarchical navigation
- Incremental builds
- Plugin system

## Development

### Setup
```bash
# Install all dependencies
npm install

# Build all packages
npm run build

# Run in development mode
npm run dev

# Lint code
npm run lint

# Type check
npm run typecheck
```

### Testing (TODO)
Tests should cover:
- Content parsing and validation
- Slug and route generation
- Nextra structure generation
- Template generation
- Full integration tests

### Key Files to Understand

1. **packages/core/src/index.ts** - Main build() and validate() functions
2. **packages/core/src/content/processor.ts** - ContentProcessor class (orchestrates build)
3. **packages/core/src/generators/nextra.ts** - NextraGenerator (creates site structure)
4. **packages/create-ezdocs/src/generator.ts** - ProjectGenerator (scaffolds new projects)
5. **docs/plan/implementation-plan.md** - Comprehensive technical plan
6. **docs/plan/requirements.md** - MVP and v1 requirements

## Design Principles

1. **Content is the source of truth** - Markdown files with frontmatter are portable and framework-agnostic
2. **Sensible defaults, explicit overrides** - Works out-of-the-box but configurable
3. **Deterministic builds** - Same input always produces same output
4. **Git-friendly** - Clean diffs, no binary artifacts in source
5. **Simple commands** - Minimal CLI complexity
6. **Obsidian-friendly** - Content works in Obsidian and other Markdown editors

## Target Users

- Indie developers and OSS maintainers with multiple projects
- Small teams needing consistent docs across projects
- Agencies building documentation for clients
- Product teams wanting fast docs deployment

## Success Metrics (from planning docs)

- Time from init to running docs: <60 seconds
- Build time: <5 seconds for 200 pages
- 90% of users need no config changes to publish
- Cross-platform compatibility (macOS, Linux, Windows)

## Commercial Model (Under Discussion)

From `docs/plan/commercial-model.md`, options being considered:
- License model (org vs per-dev vs per-project)
- Source code access vs binary distribution
- Support and update policy
- Template pricing

**Current status**: Not decided. Project is currently private.

## Planning Documentation

Extensive planning docs in `docs/plan/`:
- `product-brief.md` - Vision and value proposition
- `requirements.md` - MVP and v1 functional requirements
- `implementation-plan.md` - Detailed technical implementation
- `architecture.md` - System architecture
- `roadmap.md` - Milestones and timeline
- `open-questions.md` - Unresolved decisions

## Common Tasks for Claude

### Adding new features
1. Check `docs/plan/requirements.md` for scope
2. Update relevant modules in `packages/core/src/`
3. Add tests in `packages/core/__tests__/`
4. Update TypeScript types if needed
5. Test with test-project

### Debugging build issues
1. Check `ezdocs.config.yml` validity
2. Run `ezdocs-validate` to check content
3. Look at content processor logs
4. Check generated `.ezdocs/` directory
5. Verify Nextra configuration

### Understanding the flow
1. Start at `packages/core/src/index.ts` build() function
2. Follow ContentProcessor.process() in `content/processor.ts`
3. See how NextraGenerator.generate() creates the site
4. Check template files in `packages/create-ezdocs/templates/`

## Notes

- Uses npm workspaces (not Lerna or Turborepo)
- TypeScript with ES modules for core, CommonJS for create-ezdocs
- Requires Node.js >=18.0.0
- Built files go to `dist/` directories (gitignored)
- Generated Nextra sites go to `.ezdocs/` (gitignored in user projects)
