import { parseMarkdownFile, validateContentItem } from '../src/content/parser'
import { EZDocsConfig } from '../src/content/types'
import { join } from 'path'

const fixturesDir = join(__dirname, 'fixtures')

function createTestConfig(): EZDocsConfig {
  return {
    version: '1.0',
    name: 'Test Project',
    description: 'Test project for parsing',
    content: {
      source: './content',
      ignore: [],
    },
    collections: {
      docs: {
        pattern: 'docs/**/*.md',
        route: '/docs/{slug}',
        sort: {
          by: 'order',
          order: 'asc',
        },
        nextra: {
          sidebar: true,
          searchable: true,
          breadcrumbs: false,
          toc: true,
          editLink: false,
          feedback: false,
          navigation: true,
        },
      },
      blog: {
        pattern: 'blog/**/*.md',
        route: '/blog/{year}/{month}/{slug}',
        sort: {
          by: 'date',
          order: 'desc',
        },
        nextra: {
          sidebar: false,
          searchable: true,
          breadcrumbs: true,
          toc: true,
          editLink: false,
          feedback: false,
          navigation: true,
        },
      },
    },
    site: {
      title: 'Test Site',
      description: 'Test site description',
    },
    output: {
      nextra: {
        directory: './.ezdocs',
        theme: 'docs',
      },
    },
  }
}

describe('content parser', () => {
  describe('parseMarkdownFile', () => {
    it('should parse basic markdown file with frontmatter', () => {
      const config = createTestConfig()
      const filePath = join(fixturesDir, 'basic.md')
      const item = parseMarkdownFile(filePath, 'docs', config)

      expect(item.title).toBe('Basic Test Article')
      expect(item.description).toBe('A simple test article for parsing')
      expect(item.tags).toEqual(['test', 'basic'])
      expect(item.categories).toEqual(['tutorial'])
      expect(item.order).toBe(1)
      expect(item.collection).toBe('docs')
      expect(item.draft).toBe(false)
      expect(item.featured).toBe(false)
    })

    it('should extract body content', () => {
      const config = createTestConfig()
      const filePath = join(fixturesDir, 'basic.md')
      const item = parseMarkdownFile(filePath, 'docs', config)

      expect(item.body).toContain('# Basic Test Article')
      expect(item.body).toContain('This is a basic test article')
      expect(item.body).not.toContain('title:')
      expect(item.body).not.toContain('---')
    })

    it('should generate slug from filename', () => {
      const config = createTestConfig()
      const filePath = join(fixturesDir, 'basic.md')
      const item = parseMarkdownFile(filePath, 'docs', config)

      expect(item.slug).toBe('basic')
    })

    it('should generate route based on collection config', () => {
      const config = createTestConfig()
      const filePath = join(fixturesDir, 'basic.md')
      const item = parseMarkdownFile(filePath, 'docs', config)

      expect(item.route).toBe('/docs/basic')
    })

    it('should parse date field', () => {
      const config = createTestConfig()
      const filePath = join(fixturesDir, 'basic.md')
      const item = parseMarkdownFile(filePath, 'docs', config)

      expect(item.date).toBeDefined()
      expect(item.date).toContain('2024-01-15')
    })

    it('should calculate word count', () => {
      const config = createTestConfig()
      const filePath = join(fixturesDir, 'basic.md')
      const item = parseMarkdownFile(filePath, 'docs', config)

      expect(item.wordCount).toBeGreaterThan(0)
      expect(typeof item.wordCount).toBe('number')
    })

    it('should estimate reading time', () => {
      const config = createTestConfig()
      const filePath = join(fixturesDir, 'basic.md')
      const item = parseMarkdownFile(filePath, 'docs', config)

      expect(item.readingTimeMinutes).toBeGreaterThan(0)
      expect(typeof item.readingTimeMinutes).toBe('number')
    })

    it('should generate excerpt from content', () => {
      const config = createTestConfig()
      const filePath = join(fixturesDir, 'basic.md')
      const item = parseMarkdownFile(filePath, 'docs', config)

      expect(item.excerpt).toBeDefined()
      expect(item.excerpt!.length).toBeLessThanOrEqual(160)
      expect(item.excerpt).toContain('basic test article')
    })

    it('should parse author as string', () => {
      const config = createTestConfig()
      const filePath = join(fixturesDir, 'with-author.md')
      const item = parseMarkdownFile(filePath, 'docs', config)

      expect(item.author).toBeDefined()
      expect(item.author!.name).toBe('John Doe')
    })

    it('should handle minimal frontmatter', () => {
      const config = createTestConfig()
      const filePath = join(fixturesDir, 'minimal.md')
      const item = parseMarkdownFile(filePath, 'docs', config)

      expect(item.title).toBe('minimal') // Falls back to filename
      expect(item.tags).toEqual([])
      expect(item.categories).toEqual([])
      expect(item.author).toBeUndefined()
      expect(item.date).toBeUndefined()
      expect(item.draft).toBe(false)
    })

    it('should set draft flag from frontmatter', () => {
      const config = createTestConfig()
      // We'll test this with inline content since we don't have a draft fixture
      const { writeFileSync } = require('fs')
      const { tmpdir } = require('os')
      const testFile = join(tmpdir(), 'draft-test.md')

      writeFileSync(testFile, `---
title: "Draft Article"
draft: true
---

# Draft Article
`)

      const item = parseMarkdownFile(testFile, 'docs', config)
      expect(item.draft).toBe(true)

      // Cleanup
      require('fs').unlinkSync(testFile)
    })

    it('should set featured flag from frontmatter', () => {
      const config = createTestConfig()
      const { writeFileSync } = require('fs')
      const { tmpdir } = require('os')
      const testFile = join(tmpdir(), 'featured-test.md')

      writeFileSync(testFile, `---
title: "Featured Article"
featured: true
---

# Featured Article
`)

      const item = parseMarkdownFile(testFile, 'docs', config)
      expect(item.featured).toBe(true)

      // Cleanup
      require('fs').unlinkSync(testFile)
    })

    it('should generate route with date components for blog collection', () => {
      const config = createTestConfig()
      const { writeFileSync } = require('fs')
      const { tmpdir } = require('os')
      const testFile = join(tmpdir(), 'blog-post.md')

      writeFileSync(testFile, `---
title: "Blog Post"
date: 2024-03-15
---

# Blog Post
`)

      const item = parseMarkdownFile(testFile, 'blog', config)
      expect(item.route).toContain('/blog/2024/03/blog-post')

      // Cleanup
      require('fs').unlinkSync(testFile)
    })

    it('should initialize empty arrays for images, videos, downloads', () => {
      const config = createTestConfig()
      const filePath = join(fixturesDir, 'basic.md')
      const item = parseMarkdownFile(filePath, 'docs', config)

      expect(item.images).toEqual([])
      expect(item.videos).toEqual([])
      expect(item.downloads).toEqual([])
    })

    it('should include all frontmatter in frontmatter field', () => {
      const config = createTestConfig()
      const filePath = join(fixturesDir, 'basic.md')
      const item = parseMarkdownFile(filePath, 'docs', config)

      expect(item.frontmatter.title).toBe('Basic Test Article')
      expect(item.frontmatter.description).toBe('A simple test article for parsing')
      expect(item.frontmatter.tags).toEqual(['test', 'basic'])
    })

    it('should set lastModified timestamp', () => {
      const config = createTestConfig()
      const filePath = join(fixturesDir, 'basic.md')
      const item = parseMarkdownFile(filePath, 'docs', config)

      expect(item.lastModified).toBeDefined()
      expect(typeof item.lastModified).toBe('string')
      expect(new Date(item.lastModified).getTime()).toBeGreaterThan(0)
    })
  })

  describe('validateContentItem', () => {
    it('should pass validation when all required fields are present', () => {
      const config = createTestConfig()
      const filePath = join(fixturesDir, 'basic.md')
      const item = parseMarkdownFile(filePath, 'docs', config)

      const collectionConfig = {
        validation: {
          required: ['title', 'description'],
        },
      }

      const errors = validateContentItem(item, collectionConfig)
      expect(errors).toEqual([])
    })

    it('should fail validation when required fields are missing', () => {
      const config = createTestConfig()
      const filePath = join(fixturesDir, 'minimal.md')
      const item = parseMarkdownFile(filePath, 'docs', config)

      const collectionConfig = {
        validation: {
          required: ['description'],
        },
      }

      const errors = validateContentItem(item, collectionConfig)
      expect(errors.length).toBeGreaterThan(0)
      expect(errors[0]).toContain('description')
    })

    it('should validate date format when specified', () => {
      const config = createTestConfig()
      const { writeFileSync } = require('fs')
      const { tmpdir } = require('os')
      const testFile = join(tmpdir(), 'date-test.md')

      writeFileSync(testFile, `---
title: "Date Test"
date: 2024-01-15T00:00:00.000Z
---

# Date Test
`)

      const item = parseMarkdownFile(testFile, 'docs', config)

      const collectionConfig = {
        validation: {
          dateFormat: '^\\d{4}-\\d{2}-\\d{2}',
        },
      }

      const errors = validateContentItem(item, collectionConfig)
      expect(errors).toEqual([])

      // Cleanup
      require('fs').unlinkSync(testFile)
    })

    it('should validate slug pattern when specified', () => {
      const config = createTestConfig()
      const filePath = join(fixturesDir, 'basic.md')
      const item = parseMarkdownFile(filePath, 'docs', config)

      const collectionConfig = {
        validation: {
          slugPattern: '^[a-z0-9-]+$',
        },
      }

      const errors = validateContentItem(item, collectionConfig)
      expect(errors).toEqual([])
    })

    it('should return no errors when no validation configured', () => {
      const config = createTestConfig()
      const filePath = join(fixturesDir, 'minimal.md')
      const item = parseMarkdownFile(filePath, 'docs', config)

      const collectionConfig = {}

      const errors = validateContentItem(item, collectionConfig)
      expect(errors).toEqual([])
    })
  })
})
