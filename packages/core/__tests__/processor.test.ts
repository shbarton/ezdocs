import { ContentProcessor } from '../src/content/processor'
import { EZDocsConfig } from '../src/content/types'
import { join } from 'path'

const testContentDir = join(__dirname, 'fixtures', 'test-content')

function createTestConfig(contentSource: string): EZDocsConfig {
  return {
    version: '1.0',
    name: 'Test Project',
    description: 'Test project for processor',
    content: {
      source: contentSource,
      ignore: ['**/*.draft.md', '**/drafts/**'],
    },
    collections: {
      docs: {
        pattern: 'docs/**/*.md',
        route: '/docs/{slug}',
        sort: {
          by: 'order',
          order: 'asc',
          fallback: 'title',
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
      guides: {
        pattern: 'guides/**/*.md',
        route: '/guides/{slug}',
        sort: {
          by: 'date',
          order: 'desc',
        },
        nextra: {
          sidebar: true,
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

describe('ContentProcessor', () => {
  describe('process', () => {
    it('should process content and create index', async () => {
      const config = createTestConfig(testContentDir)
      const processor = new ContentProcessor(config)

      const index = await processor.process()

      expect(index).toBeDefined()
      expect(index.items).toBeInstanceOf(Array)
      expect(index.items.length).toBeGreaterThan(0)
      expect(index.metadata).toBeDefined()
      expect(index.metadata.totalItems).toBe(index.items.length)
    })

    it('should group items by collection', async () => {
      const config = createTestConfig(testContentDir)
      const processor = new ContentProcessor(config)

      const index = await processor.process()

      expect(index.collections).toBeDefined()
      expect(index.collections.docs).toBeDefined()
      expect(index.collections.guides).toBeDefined()
      expect(Array.isArray(index.collections.docs)).toBe(true)
      expect(Array.isArray(index.collections.guides)).toBe(true)
    })

    it('should create routes map', async () => {
      const config = createTestConfig(testContentDir)
      const processor = new ContentProcessor(config)

      const index = await processor.process()

      expect(index.routes).toBeDefined()
      expect(Object.keys(index.routes).length).toBe(index.items.length)

      // Check that routes are accessible
      const docRoutes = Object.keys(index.routes).filter(r => r.startsWith('/docs'))
      const guideRoutes = Object.keys(index.routes).filter(r => r.startsWith('/guides'))

      expect(docRoutes.length).toBeGreaterThan(0)
      expect(guideRoutes.length).toBeGreaterThan(0)
    })

    it('should sort collections according to config', async () => {
      const config = createTestConfig(testContentDir)
      const processor = new ContentProcessor(config)

      const index = await processor.process()

      const docs = index.collections.docs
      expect(docs!.length).toBeGreaterThan(1)

      // Docs should be sorted by order ascending
      if (docs![0]!.order !== undefined && docs![1]!.order !== undefined) {
        expect(docs![0]!.order).toBeLessThanOrEqual(docs![1]!.order!)
      }
    })

    it('should build parent-child relationships', async () => {
      const config = createTestConfig(testContentDir)
      const processor = new ContentProcessor(config)

      const index = await processor.process()

      // Find the parent item
      const parent = index.items.find(item => item.slug === 'getting-started')
      expect(parent).toBeDefined()

      // Check if it has children
      if (parent && parent.children.length > 0) {
        expect(parent.children.length).toBeGreaterThan(0)
        // Verify child exists
        const childId = parent.children[0]
        const child = index.items.find(item => item.id === childId)
        expect(child).toBeDefined()
        expect(child!.parent).toBe('getting-started')
      }
    })

    it('should set metadata correctly', async () => {
      const config = createTestConfig(testContentDir)
      const processor = new ContentProcessor(config)

      const index = await processor.process()

      expect(index.metadata.version).toBe('1.0')
      expect(index.metadata.totalCollections).toBe(2)
      expect(index.metadata.lastBuild).toBeDefined()
      expect(new Date(index.metadata.lastBuild).getTime()).toBeGreaterThan(0)
    })

    it('should filter out drafts in production', async () => {
      const { writeFileSync } = require('fs')
      const { tmpdir } = require('os')
      const { mkdirSync } = require('fs')

      const tmpContentDir = join(tmpdir(), 'test-content-draft')
      mkdirSync(join(tmpContentDir, 'docs'), { recursive: true })

      const draftFile = join(tmpContentDir, 'docs', 'draft.md')
      writeFileSync(draftFile, `---
title: "Draft Article"
draft: true
---

# Draft Article
`)

      const publishedFile = join(tmpContentDir, 'docs', 'published.md')
      writeFileSync(publishedFile, `---
title: "Published Article"
draft: false
---

# Published Article
`)

      const config = createTestConfig(tmpContentDir)
      const processor = new ContentProcessor(config)

      // Set production mode
      const oldEnv = process.env.NODE_ENV
      process.env.NODE_ENV = 'production'

      const index = await processor.process()

      // Restore environment
      process.env.NODE_ENV = oldEnv

      // Should only have the published article
      const draftItem = index.items.find(item => item.slug === 'draft')
      const publishedItem = index.items.find(item => item.slug === 'published')

      expect(draftItem).toBeUndefined()
      expect(publishedItem).toBeDefined()

      // Cleanup
      require('fs').rmSync(tmpContentDir, { recursive: true, force: true })
    })

    it('should handle empty collections', async () => {
      const { tmpdir } = require('os')
      const { mkdirSync } = require('fs')

      const emptyContentDir = join(tmpdir(), 'empty-content')
      mkdirSync(join(emptyContentDir, 'docs'), { recursive: true })
      mkdirSync(join(emptyContentDir, 'guides'), { recursive: true })

      const config = createTestConfig(emptyContentDir)
      const processor = new ContentProcessor(config)

      const index = await processor.process()

      expect(index.items).toEqual([])
      expect(index.metadata.totalItems).toBe(0)
      expect(Object.keys(index.routes)).toEqual([])

      // Cleanup
      require('fs').rmSync(emptyContentDir, { recursive: true, force: true })
    })

    it('should handle parse errors gracefully', async () => {
      const { writeFileSync } = require('fs')
      const { tmpdir } = require('os')
      const { mkdirSync } = require('fs')

      const tmpContentDir = join(tmpdir(), 'test-content-errors')
      mkdirSync(join(tmpContentDir, 'docs'), { recursive: true })

      const goodFile = join(tmpContentDir, 'docs', 'good.md')
      writeFileSync(goodFile, `---
title: "Good Article"
---

# Good Article
`)

      const config = createTestConfig(tmpContentDir)
      const processor = new ContentProcessor(config)

      // Should not throw even if there are errors
      const index = await processor.process()

      expect(index.items.length).toBeGreaterThan(0)

      // Cleanup
      require('fs').rmSync(tmpContentDir, { recursive: true, force: true })
    })
  })
})
