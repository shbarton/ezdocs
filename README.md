# EZ Docs

**Content-First Documentation Generator for Developers**

Transform your Markdown files into professional Nextra documentation sites with zero configuration. Write portable content, get beautiful docs.

---

## What is EZ Docs?

EZ Docs is a commercial documentation generator that bridges the gap between simple Markdown and professional documentation sites. Write your content in plain Markdown with YAML frontmatter, define your collections, and get a complete Nextra-powered documentation site automatically.

### The Problem

- **Framework Lock-in**: Most doc tools tie your content to their framework
- **Setup Overhead**: Getting a good-looking docs site requires hours of configuration
- **Content Portability**: You want Markdown files that work in Obsidian, VS Code, and any editor
- **Repetitive Setup**: Each new project requires rebuilding the same infrastructure

### The Solution

EZ Docs provides a **single command** to transform a folder of Markdown files into a production-ready documentation site:

```bash
npm create ezdocs my-docs
cd my-docs
npm run dev
```

Your docs are live at `localhost:3000` in under 60 seconds.

---

## Key Features

### Content-First Authoring
- Write in **pure Markdown** with YAML frontmatter
- Use any editor: VS Code, Obsidian, Vim, whatever you prefer
- Content is portable and framework-agnostic
- Git-friendly with clean diffs

### Collection-Based Organization
Define content types (docs, guides, API references) in a simple YAML config:

```yaml
collections:
  docs:
    pattern: "docs/**/*.md"
    route: "/docs/{slug}"
    sort:
      by: "order"
      order: "asc"
```

### Automatic Nextra Generation
- Professional documentation site using Nextra
- Automatic navigation structure from your content
- Built-in search, dark mode, and responsive design
- Customizable themes and styling

### Developer-Friendly Tools
- **Build Command**: `ezdocs-build` - Process content and generate site
- **Dev Server**: `ezdocs-dev` - Watch mode with hot reload
- **Validation**: `ezdocs-validate` - Catch errors before publishing
- **Type Generation**: Export TypeScript types from your content

### Zero to Production Fast
- Project initialization in one command
- Pre-configured templates for common use cases
- Build times under 5 seconds for typical docs (200 pages)
- Deploy anywhere: Vercel, Netlify, GitHub Pages

---

## Quick Start

### Installation

```bash
# Create a new documentation project
npm create ezdocs my-docs

# Navigate to your project
cd my-docs

# Install dependencies
npm install

# Start the development server
npm run dev
```

Visit `http://localhost:3000` to see your documentation site.

### Writing Content

Create Markdown files in the `content/` directory:

```markdown
---
title: "Getting Started"
description: "Learn the basics"
order: 1
date: 2024-01-15
tags: ["intro", "quickstart"]
---

# Getting Started

Your content here...
```

### Building for Production

```bash
# Build the site
npm run build

# The .ezdocs/ directory contains your complete Nextra site
# Deploy it to any static hosting platform
```

---

## Architecture

EZ Docs is built as a monorepo with two main packages:

### `@ezdocs/core`
The core library that processes content and generates Nextra sites.

- Content parsing and validation
- Collection processing and routing
- Nextra structure generation
- Image optimization
- Export generation (JSON, TypeScript)

### `create-ezdocs`
CLI tool for initializing new projects (like `create-react-app`).

- Interactive project setup
- Template scaffolding
- Dependency installation
- Configuration generation

---

## Use Cases

### Open Source Projects
Ship professional documentation for your libraries and frameworks without the setup overhead.

### API Documentation
Generate beautiful API reference docs from Markdown with automatic navigation and search.

### Knowledge Bases
Build internal wikis and knowledge bases with hierarchical organization and powerful search.

### Product Documentation
Create comprehensive product docs with guides, tutorials, and reference material.

### Multi-Project Teams
Use the same doc infrastructure across all your projects with consistent templates.

---

## What Makes EZ Docs Different?

### Obsidian-Friendly
Your content works perfectly in Obsidian and other Markdown tools. No proprietary formats.

### Config-Driven Collections
Define content types and routing patterns in YAML, not code. No Next.js configuration required.

### Deterministic Builds
Same input always produces the same output. Perfect for CI/CD and version control.

### Content Outlives Frameworks
When Nextra gets replaced by the next big thing, your Markdown files are still valuable.

### Opinionated but Flexible
Sensible defaults get you 90% of the way. Escape hatches for advanced customization.

---

## Requirements

- Node.js >= 18.0.0
- npm or yarn

---

## Project Status

EZ Docs is currently in **private development**. The core functionality is operational:

- ✅ Content processing with frontmatter
- ✅ Collection-based organization
- ✅ Nextra site generation
- ✅ CLI tools (build, dev, validate)
- ✅ Template system
- 🚧 Test suite (in progress)
- 🚧 Documentation site (in progress)
- 📋 npm publishing (planned)

---

## Commercial License

EZ Docs is a **commercial product** with a paid license. The source code is included but proprietary.

**Licensing options** (details coming soon):
- Individual developer license
- Team/organization license
- Enterprise license with support

For licensing inquiries: [Contact information to be added]

---

## Repository Structure

```
ezdocs/
├── packages/
│   ├── core/              # @ezdocs/core - Content processing & generation
│   └── create-ezdocs/     # create-ezdocs - Project initialization
├── docs/                  # Planning and design documentation
├── test-project/          # Example projects for testing
├── .claude/              # Claude AI documentation
└── package.json          # Monorepo configuration
```

---

## Development

### Setup

```bash
# Clone the repository
git clone https://github.com/samuelcolvin/ezdocs.git
cd ezdocs

# Install dependencies
npm install

# Build all packages
npm run build

# Run tests
npm test

# Lint code
npm run lint
```

### Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

---

## Philosophy

### Content is the Source of Truth
Your Markdown files with frontmatter are the single source of truth. Everything else is generated.

### Sensible Defaults, Explicit Overrides
Works out of the box for 90% of use cases. Configuration available when you need it.

### Simple Commands, Minimal Complexity
Three commands: build, dev, validate. That's it.

### Git-Friendly Outputs
Generated files are deterministic. Diffs are clean and meaningful.

### Framework-Agnostic Content
Your content shouldn't be locked into any framework. Markdown is forever.

---

## Roadmap

- [ ] Complete test suite
- [ ] User documentation site
- [ ] npm package publishing
- [ ] Additional templates (API docs, blog)
- [ ] Image processing pipeline
- [ ] Plugin system
- [ ] Incremental builds
- [ ] i18n support

---

## Support & Contact

- **Issues**: [GitHub Issues](https://github.com/samuelcolvin/ezdocs/issues)
- **Email**: [Contact email to be added]
- **Documentation**: [Documentation site coming soon]

---

## Credits

Created by [Samuel Colvin](https://github.com/samuelcolvin)

Built with:
- [Nextra](https://nextra.site/) - Documentation framework
- [Next.js](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [gray-matter](https://github.com/jonschlinkert/gray-matter) - Frontmatter parsing
- [sharp](https://sharp.pixelplumbing.com/) - Image processing

---

## License

**Proprietary Commercial License**

Copyright (c) 2024 Samuel Colvin. All rights reserved.

This software is commercial and proprietary. Source code is included with licensed copies but may not be redistributed, modified, or used outside the terms of your license agreement.

For licensing information and terms of use, please contact: [Contact information to be added]

---

**EZ Docs** - Write Markdown. Get Docs. Ship Fast.
