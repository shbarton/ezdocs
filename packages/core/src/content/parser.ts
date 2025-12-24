import { readFileSync } from 'fs'
import matter from 'gray-matter'
import { ContentItem, EZDocsConfig } from './types.js'
import { generateId, getFileStats, parseFileName } from '../utils/filesystem.js'
import { slugFromFileName, normalizeSlug } from '../utils/slug.js'
import { generateRoute } from '../utils/routing.js'

export function parseMarkdownFile(
  filePath: string,
  collectionName: string,
  config: EZDocsConfig
): ContentItem {
  const fileContent = readFileSync(filePath, 'utf8')
  const { data: frontmatter, content } = matter(fileContent)
  const stats = getFileStats(filePath)
  const { name } = parseFileName(filePath)

  // Extract basic metadata
  const title = frontmatter.title || name
  const slug = normalizeSlug(frontmatter.slug || slugFromFileName(filePath))
  const draft = Boolean(frontmatter.draft)
  const featured = Boolean(frontmatter.featured)

  // Parse arrays
  const tags = Array.isArray(frontmatter.tags) ? frontmatter.tags : []
  const categories = Array.isArray(frontmatter.categories) ? frontmatter.categories : []

  // Parse author
  const author = frontmatter.author
    ? typeof frontmatter.author === 'string'
      ? { name: frontmatter.author }
      : frontmatter.author
    : undefined

  // Calculate content metrics
  const wordCount = countWords(content)
  const readingTimeMinutes = estimateReadingTime(wordCount)

  // Generate excerpt
  const excerpt = frontmatter.excerpt || generateExcerpt(content)

  // Create base item
  const item: ContentItem = {
    id: generateId(filePath),
    collection: collectionName,
    sourcePath: filePath,
    slug,
    route: '', // Will be set after route generation
    title,
    description: frontmatter.description,
    summary: frontmatter.summary,
    date: frontmatter.date ? new Date(frontmatter.date).toISOString() : undefined,
    lastModified: stats.modified,
    draft,
    featured,
    tags,
    categories,
    author,
    order: frontmatter.order,
    parent: frontmatter.parent,
    children: [],
    frontmatter,
    body: content,
    excerpt,
    readingTimeMinutes,
    wordCount,
    images: [],
    videos: [],
    downloads: [],
    seo: frontmatter.seo,
  }

  // Generate route using collection config
  const collectionConfig = config.collections[collectionName]
  if (collectionConfig) {
    item.route = generateRoute(collectionConfig.route, item)
  }

  return item
}

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length
}

function estimateReadingTime(wordCount: number, wordsPerMinute = 200): number {
  return Math.ceil(wordCount / wordsPerMinute)
}

function generateExcerpt(content: string, maxLength = 160): string {
  const plainText = content
    .replace(/^#+\s+/gm, '') // Remove headers
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.*?)\*/g, '$1') // Remove italic
    .replace(/`(.*?)`/g, '$1') // Remove inline code
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links but keep text
    .replace(/!\[.*?\]\(.*?\)/g, '') // Remove images
    .trim()

  if (plainText.length <= maxLength) {
    return plainText
  }

  return plainText.substring(0, maxLength).replace(/\s+\S*$/, '') + '…'
}

export function validateContentItem(item: ContentItem, collectionConfig: any): string[] {
  const errors: string[] = []

  // Check required fields from collection config
  if (collectionConfig.validation?.required) {
    for (const field of collectionConfig.validation.required) {
      if (!item.frontmatter[field]) {
        errors.push(`Required field '${field}' is missing`)
      }
    }
  }

  // Validate date format
  if (item.date && collectionConfig.validation?.dateFormat) {
    const dateRegex = new RegExp(collectionConfig.validation.dateFormat)
    if (!dateRegex.test(item.date)) {
      errors.push(`Date format does not match expected pattern: ${collectionConfig.validation.dateFormat}`)
    }
  }

  // Validate slug pattern
  if (collectionConfig.validation?.slugPattern) {
    const slugRegex = new RegExp(collectionConfig.validation.slugPattern)
    if (!slugRegex.test(item.slug)) {
      errors.push(`Slug format does not match expected pattern: ${collectionConfig.validation.slugPattern}`)
    }
  }

  return errors
}