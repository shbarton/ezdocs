---
title: "Installation"
description: "Detailed installation and setup instructions"
order: 2
date: 2024-01-01
tags: ["installation", "setup"]
---

# Installation

This guide covers the installation and initial setup of your EZ Docs project.

## Prerequisites

Before you begin, ensure you have:

- **Node.js** 18.0.0 or higher
- **npm** or **yarn** package manager
- A text editor (VS Code, Vim, etc.)
- Git (optional, but recommended)

## Creating a New Project

You've already created this project using:

```bash
npx create-ezdocs my-docs
cd my-docs
npm install
```

## Project Structure

Your EZ Docs project has the following structure:

```
my-docs/
├── content/              # Your markdown content
│   ├── docs/            # Documentation pages
│   └── guides/          # Guides and tutorials
├── public/              # Static assets (images, files)
├── .ezdocs/            # Generated Nextra site (auto-generated)
├── ezdocs.config.yml   # EZ Docs configuration
├── package.json        # Node.js project configuration
└── README.md           # Project readme
```

## Key Directories

### `content/`
This is where all your Markdown content lives. Organize your files into logical directories:

- `docs/` - Core documentation
- `guides/` - Step-by-step guides
- `api/` - API reference (if applicable)
- `blog/` - Blog posts or articles

### `public/`
Static assets that will be served by your site:

- Images referenced in your Markdown
- Downloads (PDFs, etc.)
- Favicons and other assets

### `.ezdocs/`
Auto-generated Nextra site. This directory is created when you run `npm run build` and should be added to your `.gitignore`.

## Configuration

Your site is configured through `ezdocs.config.yml`. Key sections include:

```yaml
# Basic project info
name: "My Documentation"
description: "Project description"

# Content sources
content:
  source: "./content"
  ignore: ["**/drafts/**"]

# Content collections
collections:
  docs:
    pattern: "docs/**/*.md"
    route: "/docs/{slug}"
    
# Site settings
site:
  title: "My Docs"
  description: "Documentation site"
```

## Environment Setup

### Development Environment

For the best development experience:

1. **VS Code Extensions**:
   - Markdown All in One
   - YAML Language Support
   - Prettier

2. **Optional Tools**:
   - Obsidian (for visual content management)
   - Git for version control

### Production Deployment

EZ Docs generates a standard Next.js/Nextra site that can be deployed to:

- Vercel
- Netlify
- GitHub Pages
- Any static hosting provider

## Next Steps

1. Start the development server: `npm run dev`
2. Edit content in `content/` and see live changes
3. Customize your configuration in `ezdocs.config.yml`
4. Add your own content and organize it as needed

Continue to [Configuration](./configuration) to learn about advanced options.