# Nextra Integration

## Output Structure
```
.ezdocs/
├── pages/
│   ├── index.mdx
│   ├── docs/
│   │   ├── getting-started.mdx
│   │   ├── advanced.mdx
│   │   └── _meta.json
│   └── guides/
│       ├── best-practices.mdx
│       └── _meta.json
├── theme.config.jsx
├── next.config.js
└── package.json
```

## MDX Generation
- Convert Markdown to MDX (or wrap Markdown as MDX).
- Inject frontmatter as `export const meta = { ... }`.
- Optionally include shared layout components.

## `_meta.json` Generation
The `_meta.json` file defines sidebar ordering and labels.

Example:
```json
{
  "getting-started": "Getting Started",
  "advanced": "Advanced Usage"
}
```

Rules:
- Use `order` to determine ordering.
- Use `title` for display label.
- If `hidden` or `draft`, exclude in production.

## Theme Configuration
Generate a minimal `theme.config.jsx` with site title and links.

## Next.js Config
Generate a standard `next.config.js` that includes Nextra plugin setup.

## Versioning
- Pin Nextra version in templates.
- Use a compatibility matrix in docs for supported Nextra versions.
