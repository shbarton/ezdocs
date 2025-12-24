# Templates and Starters

## Template Goals
- Provide a working docs site within minutes.
- Show real examples of frontmatter and collection structure.
- Be minimal and easy to customize.

## Templates (Proposed)
- `docs` (default): standard product docs.
- `api`: API reference with reusable components.

## Template Structure (Docs)
```
templates/docs/
├── content/
│   ├── docs/
│   └── guides/
├── public/
│   └── images/
├── ezdocs.config.yml
├── next.config.js
├── theme.config.jsx
└── package.json
```

## Placeholders
Use token replacement at generation time:
- `{{PROJECT_NAME}}`
- `{{PROJECT_DESCRIPTION}}`
- `{{AUTHOR_NAME}}`
- `{{BASE_URL}}`

## Template Manifest (Optional)
Consider a `template.json` per template:
```json
{
  "name": "docs",
  "description": "Standard docs starter",
  "features": ["docs", "guides", "search"],
  "recommendedFor": ["product", "open-source"]
}
```

## Template Validation
- Template must build with `npm run dev`.
- `ezdocs.config.yml` must match the content folder.
- README should document the template features.
