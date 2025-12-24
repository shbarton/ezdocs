# Content Model and Frontmatter

## Frontmatter Fields (MVP)
Required:
- `title` (string)

Optional:
- `slug` (string)
- `summary` (string)
- `description` (string)
- `date` (string, ISO)
- `draft` (boolean)
- `tags` (array of string)
- `order` (number)
- `author` (string)
- `category` (string)

## Example
```yaml
---
title: "Getting Started"
slug: "getting-started"
summary: "Quick start for new users."
date: "2024-07-01"
tags: ["setup", "intro"]
order: 1
draft: false
---
```

## Derived Fields
- `id`: hash of file path.
- `route`: built from collection `route` template and `slug`.
- `readingTimeMinutes`: 200 words per minute.
- `wordCount`: whitespace split.
- `lastModified`: file stat mtime.

## Slug Rules
- If `frontmatter.slug` exists, use it.
- Else derive from filename.
- Lowercase, replace spaces with `-`, strip non-url-safe chars.

## Route Templates
- Supports `{slug}`.
- Supports `{category}` (from frontmatter `category` or directory name).
- Route must be unique across collections.

## Navigation Rules (Nextra)
- Sort by `order` if present.
- If `order` missing, fallback to `title` (configurable).
- Hidden items: support `draft: true` to omit in production.

## Validation Rules (Proposed)
- `title` required.
- `slug` must be URL safe.
- `date` must be ISO-like if present.
- `order` must be a number if present.
