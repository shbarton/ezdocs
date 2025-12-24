import { ContentItem } from '../content/types.js'

export function generateRoute(template: string, item: ContentItem): string {
  let route = template

  // Replace placeholders with actual values
  route = route.replace('{slug}', item.slug)
  route = route.replace('{collection}', item.collection)

  // Handle category if present
  if (item.categories.length > 0 && item.categories[0]) {
    route = route.replace('{category}', item.categories[0])
  } else {
    route = route.replace('/{category}', '')
    route = route.replace('{category}/', '')
    route = route.replace('{category}', '')
  }

  // Handle author if present
  if (item.author?.name) {
    route = route.replace('{author}', item.author.name.toLowerCase().replace(/\s+/g, '-'))
  } else {
    route = route.replace('/{author}', '')
    route = route.replace('{author}/', '')
    route = route.replace('{author}', '')
  }

  // Handle date components if date exists
  if (item.date) {
    const date = new Date(item.date)
    route = route.replace('{year}', date.getFullYear().toString())
    route = route.replace('{month}', (date.getMonth() + 1).toString().padStart(2, '0'))
    route = route.replace('{day}', date.getDate().toString().padStart(2, '0'))
  } else {
    route = route.replace('/{year}', '')
    route = route.replace('/{month}', '')
    route = route.replace('/{day}', '')
    route = route.replace('{year}/', '')
    route = route.replace('{month}/', '')
    route = route.replace('{day}/', '')
    route = route.replace('{year}', '')
    route = route.replace('{month}', '')
    route = route.replace('{day}', '')
  }

  // Clean up multiple slashes and ensure route starts with /
  route = route.replace(/\/+/g, '/')
  if (!route.startsWith('/')) {
    route = '/' + route
  }

  return route
}

export function extractRouteParams(template: string): string[] {
  const paramRegex = /{(\w+)}/g
  const params: string[] = []
  let match

  while ((match = paramRegex.exec(template)) !== null) {
    if (match[1]) {
      params.push(match[1])
    }
  }

  return params
}

export function validateRouteTemplate(template: string): boolean {
  // Must contain {slug}
  if (!template.includes('{slug}')) {
    return false
  }

  // Check for valid parameter syntax
  const paramRegex = /{(\w+)}/g
  const validParams = ['slug', 'collection', 'category', 'author', 'year', 'month', 'day']

  let match
  while ((match = paramRegex.exec(template)) !== null) {
    const param = match[1]
    if (param && !validParams.includes(param)) {
      return false
    }
  }

  return true
}