# EZ Docs - Project Overview

## Vision

EZ Docs is a reusable documentation generator that combines the superior authoring experience of YAML frontmatter + Markdown with the polished rendering capabilities of Nextra. It enables developers to create professional documentation sites while maintaining IDE-friendly, git-friendly, and Obsidian-compatible workflows.

## Core Philosophy

**Content-first, Developer-friendly**
- Metadata lives with content (YAML frontmatter)
- Works seamlessly in any IDE or markdown editor
- Single-file changes, clear git diffs
- Compatible with knowledge management tools like Obsidian
- Framework-agnostic content that survives technology changes

## What We're Building

### 1. Reusable CLI Tool/Package
```bash
npx create-ezdocs my-docs-site
cd my-docs-site
npm run build  # YAML frontmatter → Nextra structure
npm run dev    # Nextra development server
```

### 2. Hybrid Content Management System
- **ContentKit**: Enhanced version from dragonfly-site-test for content processing
- **Nextra Integration**: Auto-generates Nextra-compatible structure
- **Configuration-driven**: YAML config defines collections, routes, and behavior

### 3. Key Features
- **YAML Frontmatter**: Title, author, date, tags, summary, navigation order, etc.
- **File-based Collections**: Organize content into logical groups (docs, guides, api, etc.)
- **Auto-generated Navigation**: Creates Nextra `_meta.json` files from frontmatter
- **Image Processing**: Handles image assets and path management
- **TypeScript Support**: Generated types for content consumption
- **Multi-format Export**: JSON, TypeScript, and Nextra structure generation

## Architecture Overview

### Input Layer (Author Experience)
```
content/
├── docs/
│   ├── getting-started.md
│   └── advanced-usage.md
├── guides/
│   └── best-practices.md
└── ezdocs.config.yml
```

### Processing Layer (ContentKit Enhanced)
- Parse markdown files with YAML frontmatter
- Extract metadata and content
- Process images and assets
- Generate routing and navigation structure
- Create TypeScript types

### Output Layer (Nextra Compatible)
```
.ezdocs/
├── pages/
│   ├── docs/
│   │   ├── getting-started.mdx
│   │   ├── advanced-usage.mdx
│   │   └── _meta.json
│   └── guides/
│       ├── best-practices.mdx
│       └── _meta.json
├── content.json
└── content.ts
```

## Target Use Cases

1. **Project Documentation**: API docs, user guides, developer documentation
2. **Knowledge Bases**: Internal wikis, process documentation, best practices
3. **Multi-project Organizations**: Consistent documentation across multiple repos
4. **Content Management**: Blog-style content with sophisticated metadata
5. **Obsidian Integration**: Seamless workflow from personal notes to published docs

## User Workflow

### Content Creation
1. Create markdown files with YAML frontmatter in IDE/Obsidian
2. Organize files in logical directory structure
3. Configure collections and routing in `ezdocs.config.yml`
4. Run build process to generate Nextra site

### Development Experience
```bash
# Initialize new docs project
npx create-ezdocs my-docs

# Add content files
vim content/docs/getting-started.md

# Build and preview
npm run build
npm run dev
```

## Success Criteria

### Technical Goals
- ✅ Reusable across multiple projects
- ✅ Maintains authoring workflow from dragonfly-site-test
- ✅ Generates production-ready Nextra sites
- ✅ Supports all ContentKit features (images, metadata, routing)
- ✅ Type-safe content consumption

### User Experience Goals
- ✅ Zero-config initialization for common use cases
- ✅ Flexible configuration for advanced scenarios
- ✅ Clear documentation and examples
- ✅ Consistent behavior across different operating systems
- ✅ Integration with existing development workflows

## Technical Stack

### Core Dependencies
- **Nextra**: Documentation site generation and rendering
- **ContentKit**: Enhanced content processing system
- **Gray-matter**: YAML frontmatter parsing
- **Fast-glob**: File pattern matching
- **Sharp**: Image processing
- **TypeScript**: Type generation and safety

### CLI Framework
- **Commander.js** or **Yargs**: Command-line interface
- **Inquirer**: Interactive prompts for setup
- **Chalk**: Terminal styling and feedback

## Deliverables

1. **NPM Package**: `create-ezdocs` CLI tool
2. **Documentation**: Comprehensive setup and usage guides
3. **Examples**: Sample projects demonstrating different use cases
4. **Templates**: Pre-configured project templates
5. **Migration Guide**: Moving from other documentation systems

## Risks & Considerations

### Technical Risks
- Nextra API changes could break integration
- Complex file watching and rebuilding requirements
- Image processing performance with large assets

### User Experience Risks
- Learning curve for YAML frontmatter conventions
- Balancing simplicity with configurability
- Ensuring cross-platform compatibility

### Mitigation Strategies
- Comprehensive testing across platforms
- Clear documentation and examples
- Gradual feature rollout with user feedback
- Version pinning for critical dependencies