---
title: "Getting Started"
description: "Learn how to get up and running with your new documentation site"
order: 1
date: 2024-01-01
---

# Getting Started

Welcome to your new documentation site built with **EZ Docs**! This guide will help you get up and running quickly.

## What is EZ Docs?

EZ Docs is a powerful documentation generator that combines the simplicity of Markdown with YAML frontmatter and the beautiful rendering capabilities of Nextra. It's designed to be:

- **Developer-friendly**: Write in Markdown with your favorite editor
- **Git-friendly**: Clear diffs and version control
- **IDE-compatible**: Works seamlessly with VS Code, Obsidian, and other editors
- **Framework-agnostic**: Content survives technology changes

## Quick Start

### 1. Add Your Content

Create new Markdown files in the `content/` directory:

```
content/
├── docs/
│   ├── getting-started.md    (this file)
│   ├── installation.md
│   └── configuration.md
└── guides/
    ├── best-practices.md
    └── troubleshooting.md
```

### 2. Write with Frontmatter

Each Markdown file should start with YAML frontmatter:

```yaml
---
title: "Your Page Title"
description: "A brief description"
order: 1
date: 2024-01-01
tags: ["documentation", "guide"]
---
```

### 3. Build Your Site

```bash
# Build once
npm run build

# Start development server with auto-rebuild
npm run dev

# Validate your content
npm run validate
```

### 4. Customize Configuration

Edit `ezdocs.config.yml` to:

- Add new content collections
- Configure routing patterns
- Set up site metadata
- Customize build outputs

## What's Next?

- Read the [Installation Guide](./installation) for detailed setup instructions
- Learn about [Configuration](./configuration) options
- Check out our [Best Practices Guide](../guides/best-practices)
- Explore [Troubleshooting](../guides/troubleshooting) tips

## Need Help?

- Check the [EZ Docs Documentation](https://ezdocs.dev)
- File issues on [GitHub](https://github.com/samuelcolvin/ezdocs)
- Join our community discussions

Happy documenting! 📝