import { build } from '../src/index'
import { join } from 'path'
import { existsSync, readFileSync, mkdirSync, writeFileSync, rmSync } from 'fs'
import { tmpdir } from 'os'

describe('Integration Tests', () => {
  let testProjectDir: string

  beforeEach(() => {
    // Create a temporary test project directory
    testProjectDir = join(tmpdir(), `ezdocs-test-${Date.now()}`)
    mkdirSync(testProjectDir, { recursive: true })
  })

  afterEach(() => {
    // Clean up test project
    if (existsSync(testProjectDir)) {
      rmSync(testProjectDir, { recursive: true, force: true })
    }
  })

  describe('Full build pipeline', () => {
    it('should build a complete documentation site from markdown files', async () => {
      // Create test content structure
      const contentDir = join(testProjectDir, 'content')
      mkdirSync(join(contentDir, 'docs'), { recursive: true })
      mkdirSync(join(contentDir, 'guides'), { recursive: true })

      // Create test markdown files
      writeFileSync(
        join(contentDir, 'docs', 'intro.md'),
        `---
title: "Introduction"
description: "Getting started"
order: 1
---

# Introduction

Welcome to the docs.
`
      )

      writeFileSync(
        join(contentDir, 'docs', 'setup.md'),
        `---
title: "Setup"
description: "How to set up"
order: 2
---

# Setup

Follow these steps.
`
      )

      writeFileSync(
        join(contentDir, 'guides', 'best-practices.md'),
        `---
title: "Best Practices"
date: 2024-01-15
categories: ["advanced"]
---

# Best Practices

Here are some tips.
`
      )

      // Create config file
      const configPath = join(testProjectDir, 'ezdocs.config.yml')
      writeFileSync(
        configPath,
        `version: "1.0"
name: "Test Docs"
description: "Test documentation site"

content:
  source: "./content"
  ignore: []

collections:
  docs:
    pattern: "docs/**/*.md"
    route: "/docs/{slug}"
    sort:
      by: "order"
      order: "asc"
    nextra:
      sidebar: true
      searchable: true
      breadcrumbs: false
      toc: true
      editLink: false
      feedback: false
      navigation: true

  guides:
    pattern: "guides/**/*.md"
    route: "/guides/{slug}"
    sort:
      by: "date"
      order: "desc"
    nextra:
      sidebar: true
      searchable: true
      breadcrumbs: true
      toc: true
      editLink: false
      feedback: false
      navigation: true

site:
  title: "Test Docs"
  description: "Test documentation site"

output:
  nextra:
    directory: "./.ezdocs"
    theme: "docs"
  exports:
    - type: "json"
      path: "./content.json"
`
      )

      // Change to test project directory
      const originalCwd = process.cwd()
      process.chdir(testProjectDir)

      try {
        // Run build
        await build(configPath)

        // Verify Nextra structure was created
        const ezdocsDir = join(testProjectDir, '.ezdocs')
        expect(existsSync(ezdocsDir)).toBe(true)

        // Verify pages directory
        const pagesDir = join(ezdocsDir, 'pages')
        expect(existsSync(pagesDir)).toBe(true)

        // Verify MDX files were generated
        const docsIntroPath = join(pagesDir, 'docs', 'intro.mdx')
        const docsSetupPath = join(pagesDir, 'docs', 'setup.mdx')
        const guidesPath = join(pagesDir, 'guides', 'best-practices.mdx')

        expect(existsSync(docsIntroPath)).toBe(true)
        expect(existsSync(docsSetupPath)).toBe(true)
        expect(existsSync(guidesPath)).toBe(true)

        // Verify MDX content
        const introContent = readFileSync(docsIntroPath, 'utf8')
        expect(introContent).toContain('title: "Introduction"')
        expect(introContent).toContain('# Introduction')
        expect(introContent).toContain('Welcome to the docs')

        // Verify _meta.json files were created
        const docsMetaPath = join(pagesDir, 'docs', '_meta.json')
        expect(existsSync(docsMetaPath)).toBe(true)

        // Verify _meta.json content is valid JSON
        const metaContent = readFileSync(docsMetaPath, 'utf8')
        const meta = JSON.parse(metaContent)
        expect(meta).toBeDefined()
        expect(meta.intro).toBeDefined()
        expect(meta.setup).toBeDefined()

        // Verify JSON export was created
        const jsonExportPath = join(testProjectDir, 'content.json')
        expect(existsSync(jsonExportPath)).toBe(true)

        const jsonContent = readFileSync(jsonExportPath, 'utf8')
        const contentData = JSON.parse(jsonContent)
        expect(contentData.items).toBeDefined()
        expect(contentData.items.length).toBe(3)
        expect(contentData.collections.docs.length).toBe(2)
        expect(contentData.collections.guides.length).toBe(1)

        // Verify theme config was created
        const themeConfigPath = join(ezdocsDir, 'theme.config.tsx')
        expect(existsSync(themeConfigPath)).toBe(true)

        // Verify Next.js config was created
        const nextConfigPath = join(ezdocsDir, 'next.config.js')
        expect(existsSync(nextConfigPath)).toBe(true)

        // Verify package.json was created
        const packageJsonPath = join(ezdocsDir, 'package.json')
        expect(existsSync(packageJsonPath)).toBe(true)

        const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'))
        expect(packageJson.dependencies.nextra).toBeDefined()
        expect(packageJson.dependencies['nextra-theme-docs']).toBeDefined()
      } finally {
        // Restore original working directory
        process.chdir(originalCwd)
      }
    })

    it('should handle complex routing patterns', async () => {
      // Create test content
      const contentDir = join(testProjectDir, 'content')
      mkdirSync(join(contentDir, 'blog'), { recursive: true })

      writeFileSync(
        join(contentDir, 'blog', 'my-post.md'),
        `---
title: "My Blog Post"
date: 2024-03-15
categories: ["tutorials"]
author: "Jane Doe"
---

# My Blog Post

Content here.
`
      )

      // Create config with complex routing
      const configPath = join(testProjectDir, 'ezdocs.config.yml')
      writeFileSync(
        configPath,
        `version: "1.0"
name: "Blog"

content:
  source: "./content"
  ignore: []

collections:
  blog:
    pattern: "blog/**/*.md"
    route: "/blog/{year}/{month}/{category}/{slug}"
    sort:
      by: "date"
      order: "desc"
    nextra:
      sidebar: false
      searchable: true
      breadcrumbs: true
      toc: true
      editLink: false
      feedback: false
      navigation: true

site:
  title: "Blog"
  description: "My blog"

output:
  nextra:
    directory: "./.ezdocs"
    theme: "blog"
`
      )

      const originalCwd = process.cwd()
      process.chdir(testProjectDir)

      try {
        await build(configPath)

        // Verify complex route was generated correctly
        const expectedPath = join(
          testProjectDir,
          '.ezdocs',
          'pages',
          'blog',
          '2024',
          '03',
          'tutorials',
          'my-post.mdx'
        )
        expect(existsSync(expectedPath)).toBe(true)
      } finally {
        process.chdir(originalCwd)
      }
    })

    it('should filter drafts in production mode', async () => {
      const contentDir = join(testProjectDir, 'content')
      mkdirSync(join(contentDir, 'docs'), { recursive: true })

      writeFileSync(
        join(contentDir, 'docs', 'published.md'),
        `---
title: "Published"
---

Published content.
`
      )

      writeFileSync(
        join(contentDir, 'docs', 'draft.md'),
        `---
title: "Draft"
draft: true
---

Draft content.
`
      )

      const configPath = join(testProjectDir, 'ezdocs.config.yml')
      writeFileSync(
        configPath,
        `version: "1.0"
name: "Test"

content:
  source: "./content"
  ignore: []

collections:
  docs:
    pattern: "docs/**/*.md"
    route: "/docs/{slug}"
    nextra:
      sidebar: true
      searchable: true
      breadcrumbs: false
      toc: true
      editLink: false
      feedback: false
      navigation: true

site:
  title: "Test"
  description: "Test"

output:
  nextra:
    directory: "./.ezdocs"
    theme: "docs"
  exports:
    - type: "json"
      path: "./content.json"
`
      )

      const originalCwd = process.cwd()
      const oldEnv = process.env.NODE_ENV
      process.chdir(testProjectDir)
      process.env.NODE_ENV = 'production'

      try {
        await build(configPath)

        // Published file should exist
        const publishedPath = join(testProjectDir, '.ezdocs', 'pages', 'docs', 'published.mdx')
        expect(existsSync(publishedPath)).toBe(true)

        // Draft file should NOT exist
        const draftPath = join(testProjectDir, '.ezdocs', 'pages', 'docs', 'draft.mdx')
        expect(existsSync(draftPath)).toBe(false)

        // Check JSON export - should only have 1 item
        const jsonContent = JSON.parse(
          readFileSync(join(testProjectDir, 'content.json'), 'utf8')
        )
        expect(jsonContent.items.length).toBe(1)
        expect(jsonContent.items[0].slug).toBe('published')
      } finally {
        process.chdir(originalCwd)
        process.env.NODE_ENV = oldEnv
      }
    })

    it('should respect ignore patterns', async () => {
      const contentDir = join(testProjectDir, 'content')
      mkdirSync(join(contentDir, 'docs'), { recursive: true })
      mkdirSync(join(contentDir, 'docs', 'drafts'), { recursive: true })

      writeFileSync(
        join(contentDir, 'docs', 'published.md'),
        `---
title: "Published"
---

Content.
`
      )

      writeFileSync(
        join(contentDir, 'docs', 'drafts', 'wip.md'),
        `---
title: "WIP"
---

Work in progress.
`
      )

      const configPath = join(testProjectDir, 'ezdocs.config.yml')
      writeFileSync(
        configPath,
        `version: "1.0"
name: "Test"

content:
  source: "./content"
  ignore: ["**/drafts/**"]

collections:
  docs:
    pattern: "docs/**/*.md"
    route: "/docs/{slug}"
    nextra:
      sidebar: true
      searchable: true
      breadcrumbs: false
      toc: true
      editLink: false
      feedback: false
      navigation: true

site:
  title: "Test"
  description: "Test"

output:
  nextra:
    directory: "./.ezdocs"
    theme: "docs"
  exports:
    - type: "json"
      path: "./content.json"
`
      )

      const originalCwd = process.cwd()
      process.chdir(testProjectDir)

      try {
        await build(configPath)

        // Only published file should be in output
        const jsonContent = JSON.parse(
          readFileSync(join(testProjectDir, 'content.json'), 'utf8')
        )
        expect(jsonContent.items.length).toBe(1)
        expect(jsonContent.items[0].slug).toBe('published')
      } finally {
        process.chdir(originalCwd)
      }
    })
  })
})
