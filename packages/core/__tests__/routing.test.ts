import { generateRoute, extractRouteParams, validateRouteTemplate } from '../src/utils/routing'
import { ContentItem } from '../src/content/types'

// Helper function to create a minimal ContentItem for testing
function createTestItem(overrides: Partial<ContentItem> = {}): ContentItem {
  return {
    id: 'test-id',
    collection: 'docs',
    sourcePath: '/path/to/file.md',
    slug: 'test-slug',
    route: '',
    title: 'Test Title',
    lastModified: '2024-01-01T00:00:00.000Z',
    draft: false,
    featured: false,
    tags: [],
    categories: [],
    children: [],
    frontmatter: {},
    body: 'Test content',
    readingTimeMinutes: 5,
    wordCount: 1000,
    images: [],
    videos: [],
    downloads: [],
    ...overrides,
  }
}

describe('routing utilities', () => {
  describe('generateRoute', () => {
    it('should replace {slug} placeholder', () => {
      const item = createTestItem({ slug: 'my-post' })
      const route = generateRoute('/docs/{slug}', item)
      expect(route).toBe('/docs/my-post')
    })

    it('should replace {collection} placeholder', () => {
      const item = createTestItem({ collection: 'guides' })
      const route = generateRoute('/{collection}/{slug}', item)
      expect(route).toBe('/guides/test-slug')
    })

    it('should replace {category} when category exists', () => {
      const item = createTestItem({ categories: ['tutorials'] })
      const route = generateRoute('/docs/{category}/{slug}', item)
      expect(route).toBe('/docs/tutorials/test-slug')
    })

    it('should remove {category} when category does not exist', () => {
      const item = createTestItem({ categories: [] })
      const route = generateRoute('/docs/{category}/{slug}', item)
      expect(route).toBe('/docs/test-slug')
    })

    it('should handle {category} at different positions', () => {
      const item = createTestItem({ categories: [] })
      expect(generateRoute('/{category}/docs/{slug}', item)).toBe('/docs/test-slug')
      expect(generateRoute('/docs/{slug}/{category}', item)).toBe('/docs/test-slug')
    })

    it('should replace {author} when author exists', () => {
      const item = createTestItem({ author: { name: 'John Doe' } })
      const route = generateRoute('/blog/{author}/{slug}', item)
      expect(route).toBe('/blog/john-doe/test-slug')
    })

    it('should slugify author name', () => {
      const item = createTestItem({ author: { name: 'John Smith Jr' } })
      const route = generateRoute('/blog/{author}/{slug}', item)
      expect(route).toBe('/blog/john-smith-jr/test-slug')
    })

    it('should remove {author} when author does not exist', () => {
      const item = createTestItem({ author: undefined })
      const route = generateRoute('/blog/{author}/{slug}', item)
      expect(route).toBe('/blog/test-slug')
    })

    it('should replace date components when date exists', () => {
      const item = createTestItem({ date: '2024-03-15T00:00:00.000Z' })
      const route = generateRoute('/blog/{year}/{month}/{day}/{slug}', item)
      expect(route).toBe('/blog/2024/03/15/test-slug')
    })

    it('should pad month and day with zeros', () => {
      const item = createTestItem({ date: '2024-01-05T00:00:00.000Z' })
      const route = generateRoute('/blog/{year}/{month}/{day}/{slug}', item)
      expect(route).toBe('/blog/2024/01/05/test-slug')
    })

    it('should remove date components when date does not exist', () => {
      const item = createTestItem({ date: undefined })
      const route = generateRoute('/blog/{year}/{month}/{day}/{slug}', item)
      expect(route).toBe('/blog/test-slug')
    })

    it('should handle partial date templates', () => {
      const item = createTestItem({ date: '2024-03-15T00:00:00.000Z' })
      expect(generateRoute('/blog/{year}/{month}/{slug}', item)).toBe('/blog/2024/03/test-slug')
      expect(generateRoute('/blog/{year}/{slug}', item)).toBe('/blog/2024/test-slug')
    })

    it('should handle complex templates with multiple placeholders', () => {
      const item = createTestItem({
        slug: 'my-post',
        collection: 'blog',
        categories: ['tutorials'],
        author: { name: 'Jane Doe' },
        date: '2024-03-15T00:00:00.000Z',
      })
      const route = generateRoute('/{collection}/{year}/{category}/{author}/{slug}', item)
      expect(route).toBe('/blog/2024/tutorials/jane-doe/my-post')
    })

    it('should clean up multiple consecutive slashes', () => {
      const item = createTestItem({ categories: [] })
      const route = generateRoute('/docs//{category}//{slug}', item)
      expect(route).toBe('/docs/test-slug')
    })

    it('should ensure route starts with /', () => {
      const item = createTestItem()
      const route = generateRoute('docs/{slug}', item)
      expect(route).toBe('/docs/test-slug')
    })

    it('should handle routes with only {slug}', () => {
      const item = createTestItem({ slug: 'hello-world' })
      const route = generateRoute('/{slug}', item)
      expect(route).toBe('/hello-world')
    })

    it('should handle empty optional placeholders gracefully', () => {
      const item = createTestItem({
        categories: [],
        author: undefined,
        date: undefined,
      })
      const route = generateRoute('/{category}/{author}/{year}/{slug}', item)
      expect(route).toBe('/test-slug')
    })
  })

  describe('extractRouteParams', () => {
    it('should extract single parameter', () => {
      expect(extractRouteParams('/docs/{slug}')).toEqual(['slug'])
    })

    it('should extract multiple parameters', () => {
      const params = extractRouteParams('/blog/{year}/{month}/{slug}')
      expect(params).toEqual(['year', 'month', 'slug'])
    })

    it('should extract all valid parameters', () => {
      const template = '/{collection}/{category}/{author}/{year}/{month}/{day}/{slug}'
      const params = extractRouteParams(template)
      expect(params).toEqual(['collection', 'category', 'author', 'year', 'month', 'day', 'slug'])
    })

    it('should handle templates with no parameters', () => {
      expect(extractRouteParams('/static/path')).toEqual([])
    })

    it('should handle duplicate parameters', () => {
      const params = extractRouteParams('/blog/{slug}/edit/{slug}')
      expect(params).toEqual(['slug', 'slug'])
    })

    it('should ignore malformed parameters', () => {
      const params = extractRouteParams('/blog/{}/{slug}')
      expect(params).toEqual(['slug'])
    })
  })

  describe('validateRouteTemplate', () => {
    it('should validate templates with {slug}', () => {
      expect(validateRouteTemplate('/docs/{slug}')).toBe(true)
      expect(validateRouteTemplate('/{slug}')).toBe(true)
    })

    it('should validate templates with valid parameters', () => {
      expect(validateRouteTemplate('/docs/{collection}/{slug}')).toBe(true)
      expect(validateRouteTemplate('/blog/{year}/{month}/{day}/{slug}')).toBe(true)
      expect(validateRouteTemplate('/posts/{category}/{slug}')).toBe(true)
      expect(validateRouteTemplate('/authors/{author}/{slug}')).toBe(true)
    })

    it('should reject templates without {slug}', () => {
      expect(validateRouteTemplate('/docs/{category}')).toBe(false)
      expect(validateRouteTemplate('/blog/{year}/{month}')).toBe(false)
      expect(validateRouteTemplate('/static')).toBe(false)
    })

    it('should reject templates with invalid parameters', () => {
      expect(validateRouteTemplate('/docs/{invalid}/{slug}')).toBe(false)
      expect(validateRouteTemplate('/blog/{unknown}/{slug}')).toBe(false)
      expect(validateRouteTemplate('/posts/{title}/{slug}')).toBe(false)
    })

    it('should handle complex valid templates', () => {
      const template = '/{collection}/{category}/{author}/{year}/{month}/{day}/{slug}'
      expect(validateRouteTemplate(template)).toBe(true)
    })

    it('should handle empty templates', () => {
      expect(validateRouteTemplate('')).toBe(false)
    })

    it('should allow templates with static parts', () => {
      expect(validateRouteTemplate('/docs/guides/{category}/{slug}')).toBe(true)
      expect(validateRouteTemplate('/api/v1/{slug}')).toBe(true)
    })
  })
})
