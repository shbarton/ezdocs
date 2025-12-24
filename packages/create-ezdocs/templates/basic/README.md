# {{PROJECT_NAME}}

{{PROJECT_DESCRIPTION}}

This documentation site is built with [EZ Docs](https://github.com/samuelcolvin/ezdocs), a powerful documentation generator that combines Markdown with YAML frontmatter and Nextra.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Validate content
npm run validate
```

## Writing Content

Add your Markdown files to the `content/` directory:

```
content/
├── docs/              # Core documentation
├── guides/            # How-to guides
└── api/               # API reference
```

Each Markdown file should include frontmatter:

```yaml
---
title: "Page Title"
description: "Page description"
order: 1
date: 2024-01-01
---
```

## Configuration

Edit `ezdocs.config.yml` to:

- Configure content collections
- Set up routing patterns
- Customize site metadata
- Define build outputs

## Project Structure

- `content/` - Your Markdown content
- `public/` - Static assets (images, files)
- `ezdocs.config.yml` - EZ Docs configuration
- `.ezdocs/` - Generated Nextra site (auto-generated)

## Learn More

- [Getting Started Guide](./content/docs/getting-started.md)
- [Configuration Reference](./content/docs/configuration.md)
- [Best Practices](./content/guides/best-practices.md)
- [EZ Docs Documentation](https://ezdocs.dev)

## Support

- [GitHub Issues](https://github.com/samuelcolvin/ezdocs/issues)
- [Documentation](https://ezdocs.dev)
- [Community Discussions](https://github.com/samuelcolvin/ezdocs/discussions)

---

Built with ❤️ using [EZ Docs](https://github.com/samuelcolvin/ezdocs)