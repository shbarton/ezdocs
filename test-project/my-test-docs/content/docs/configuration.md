---
title: "Configuration"
description: "Learn how to configure your EZ Docs project"
order: 3
date: 2024-01-01
tags: ["configuration", "setup"]
---

# Configuration

EZ Docs is configured through the `ezdocs.config.yml` file in your project root. This guide covers all available configuration options.

## Basic Structure

```yaml
version: "1.0"
name: "My Documentation"
description: "Project description"

content:
  source: "./content"
  ignore: ["**/drafts/**"]

collections:
  # Collection definitions

site:
  title: "My Docs"
  description: "Documentation site"

output:
  nextra:
    directory: "./.ezdocs"
    theme: "docs"
```

## Content Configuration

### Source Directory

```yaml
content:
  source: "./content"        # Where your markdown files are located
  ignore:                    # Files and directories to ignore
    - "**/drafts/**"
    - "**/*.draft.md"
    - "**/private/**"
```

## Collections

Collections define how different types of content are organized and displayed:

```yaml
collections:
  docs:
    pattern: "docs/**/*.md"   # Glob pattern for files
    route: "/docs/{slug}"     # URL structure
    sort:
      by: "order"             # Sort field (from frontmatter)
      fallback: "title"       # Fallback if sort field missing
      order: "asc"           # "asc" or "desc"
    nextra:
      sidebar: true          # Show in sidebar
      searchable: true       # Include in search
      breadcrumbs: true      # Show breadcrumbs
```

### Route Templates

Routes support these placeholders:

- `{slug}` - File slug (required)
- `{collection}` - Collection name
- `{category}` - First category from frontmatter
- `{author}` - Author name (slugified)
- `{year}`, `{month}`, `{day}` - Date components

Examples:
```yaml
route: "/docs/{slug}"                    # /docs/getting-started
route: "/{collection}/{category}/{slug}" # /docs/setup/installation
route: "/blog/{year}/{month}/{slug}"     # /blog/2024/01/my-post
```

## Site Configuration

```yaml
site:
  title: "My Documentation"
  description: "Comprehensive documentation for my project"
  baseUrl: "https://docs.example.com"    # Optional
  logo: "./assets/logo.svg"              # Optional
```

## Output Configuration

### Nextra Output

```yaml
output:
  nextra:
    directory: "./.ezdocs"    # Where to generate the site
    theme: "docs"             # "docs" or "blog"
    config:                   # Additional Nextra config
      docsRepositoryBase: "https://github.com/user/repo/tree/main"
      feedback.content: "Question? Give us feedback →"
      editLink.text: "Edit this page on GitHub →"
```

### Additional Exports

```yaml
output:
  exports:
    - type: "json"
      path: "./content.json"           # Export all content as JSON
    - type: "typescript" 
      path: "./src/generated/content.ts" # Generate TypeScript types
```

## Image Processing

```yaml
images:
  formats: ["webp", "avif", "jpeg"]   # Output formats
  sizes: [640, 1280, 1920]           # Responsive sizes
  quality: 85                        # Image quality (1-100)
```

## Development Settings

```yaml
dev:
  port: 3000          # Development server port
  watch: true         # Watch for file changes
  livereload: true    # Auto-reload browser
```

## Content Validation

Add validation rules to your collections:

```yaml
collections:
  docs:
    pattern: "docs/**/*.md"
    route: "/docs/{slug}"
    validation:
      required: ["title", "description"]    # Required frontmatter fields
      dateFormat: "YYYY-MM-DD"             # Date format validation
      slugPattern: "^[a-z0-9-]+$"          # Slug pattern validation
```

## Advanced Examples

### Multi-language Setup

```yaml
collections:
  docs_en:
    pattern: "en/docs/**/*.md"
    route: "/en/docs/{slug}"
  docs_es:
    pattern: "es/docs/**/*.md"
    route: "/es/docs/{slug}"
```

### Blog-style Content

```yaml
collections:
  blog:
    pattern: "blog/**/*.md"
    route: "/blog/{year}/{month}/{slug}"
    sort:
      by: "date"
      order: "desc"
    nextra:
      sidebar: false
      searchable: true
```

### API Documentation

```yaml
collections:
  api:
    pattern: "api/**/*.md"
    route: "/api/{category}/{slug}"
    sort:
      by: "order"
      fallback: "title"
    nextra:
      sidebar: true
      breadcrumbs: true
      toc: true
```

## Environment Variables

You can use environment variables in your config:

```yaml
site:
  baseUrl: ${SITE_URL}
  title: ${SITE_TITLE}
```

Set them when building:
```bash
SITE_URL=https://docs.example.com npm run build
```

## Next Steps

- Learn about [Frontmatter](../guides/frontmatter) options
- Explore [Content Organization](../guides/organization) best practices
- Check out [Deployment](../guides/deployment) guides