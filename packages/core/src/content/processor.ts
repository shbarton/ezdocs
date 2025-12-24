import { resolve, join } from 'path'
import { ContentItem, ContentIndex, EZDocsConfig, CollectionConfig } from './types.js'
import { discoverFiles } from '../utils/filesystem.js'
import { parseMarkdownFile, validateContentItem } from './parser.js'

export class ContentProcessor {
  constructor(private config: EZDocsConfig) {}

  async process(): Promise<ContentIndex> {
    console.log('🔄 Processing content...')

    // 1. Discover content files
    const filesByCollection = await this.discoverFiles()

    // 2. Parse and validate content
    const items = await this.parseContent(filesByCollection)

    // 3. Build relationships
    this.buildRelationships(items)

    // 4. Create content index
    return this.createIndex(items)
  }

  private async discoverFiles(): Promise<Record<string, string[]>> {
    const filesByCollection: Record<string, string[]> = {}
    const baseDir = resolve(process.cwd(), this.config.content.source)

    for (const [collectionName, collectionConfig] of Object.entries(this.config.collections)) {
      console.log(`  📁 Discovering files for collection: ${collectionName}`)
      
      const files = await discoverFiles(
        collectionConfig.pattern,
        baseDir,
        this.config.content.ignore
      )

      filesByCollection[collectionName] = files
      console.log(`    Found ${files.length} files`)
    }

    return filesByCollection
  }

  private async parseContent(filesByCollection: Record<string, string[]>): Promise<ContentItem[]> {
    const items: ContentItem[] = []
    const errors: string[] = []

    for (const [collectionName, files] of Object.entries(filesByCollection)) {
      const collectionConfig = this.config.collections[collectionName]
      
      console.log(`  📝 Parsing content for collection: ${collectionName}`)

      for (const filePath of files) {
        try {
          const item = parseMarkdownFile(filePath, collectionName, this.config)

          // Validate content item
          const validationErrors = validateContentItem(item, collectionConfig)
          if (validationErrors.length > 0) {
            errors.push(`${filePath}: ${validationErrors.join(', ')}`)
            continue
          }

          // Filter out drafts in production
          if (item.draft && process.env.NODE_ENV === 'production') {
            continue
          }

          items.push(item)
        } catch (error) {
          errors.push(`${filePath}: ${error}`)
        }
      }
    }

    if (errors.length > 0) {
      console.warn('⚠️  Content parsing warnings:')
      errors.forEach(error => console.warn(`    ${error}`))
    }

    console.log(`  ✅ Successfully parsed ${items.length} items`)
    return items
  }

  private buildRelationships(items: ContentItem[]): void {
    console.log('  🔗 Building content relationships...')

    // Build parent-child relationships
    const itemsBySlug = new Map(items.map(item => [item.slug, item]))

    for (const item of items) {
      if (item.parent) {
        const parentItem = itemsBySlug.get(item.parent)
        if (parentItem) {
          parentItem.children.push(item.id)
        }
      }
    }

    // Sort children by order or title
    for (const item of items) {
      if (item.children.length > 0) {
        const childItems = item.children
          .map(childId => items.find(i => i.id === childId))
          .filter(Boolean) as ContentItem[]

        childItems.sort((a, b) => {
          if (a.order !== undefined && b.order !== undefined) {
            return a.order - b.order
          }
          if (a.order !== undefined) return -1
          if (b.order !== undefined) return 1
          return a.title.localeCompare(b.title)
        })

        item.children = childItems.map(child => child.id)
      }
    }
  }

  private createIndex(items: ContentItem[]): ContentIndex {
    console.log('  📚 Creating content index...')

    // Group items by collection
    const collections: Record<string, ContentItem[]> = {}
    for (const item of items) {
      if (!collections[item.collection]) {
        collections[item.collection] = []
      }
      collections[item.collection]!.push(item)
    }

    // Sort collections according to config
    for (const [collectionName, collectionItems] of Object.entries(collections)) {
      const collectionConfig = this.config.collections[collectionName]
      if (collectionConfig?.sort) {
        this.sortCollection(collectionItems, collectionConfig)
      }
    }

    // Create routes map
    const routes: Record<string, ContentItem> = {}
    for (const item of items) {
      routes[item.route] = item
    }

    return {
      items,
      collections,
      routes,
      metadata: {
        totalItems: items.length,
        totalCollections: Object.keys(collections).length,
        lastBuild: new Date().toISOString(),
        version: this.config.version,
      },
    }
  }

  private sortCollection(items: ContentItem[], config: CollectionConfig): void {
    const { sort } = config
    if (!sort) return

    items.sort((a, b) => {
      let aValue = a.frontmatter[sort.by] ?? (sort.fallback ? a.frontmatter[sort.fallback!] : undefined)
      let bValue = b.frontmatter[sort.by] ?? (sort.fallback ? b.frontmatter[sort.fallback!] : undefined)

      // Handle undefined values
      if (aValue === undefined && bValue === undefined) return 0
      if (aValue === undefined) return 1
      if (bValue === undefined) return -1

      // Handle dates
      if (sort.by === 'date' || sort.fallback === 'date') {
        if (typeof aValue === 'string') aValue = new Date(aValue)
        if (typeof bValue === 'string') bValue = new Date(bValue)
      }

      // Compare values
      let comparison = 0
      if (aValue < bValue) comparison = -1
      if (aValue > bValue) comparison = 1

      return sort.order === 'desc' ? -comparison : comparison
    })
  }
}