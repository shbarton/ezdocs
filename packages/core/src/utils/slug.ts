export function createSlug(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces, underscores, and multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}

export function slugFromFileName(filePath: string): string {
  const fileName = filePath.split('/').pop() || ''
  const baseName = fileName.replace(/\.(md|mdx)$/, '')
  return createSlug(baseName)
}

export function validateSlug(slug: string): boolean {
  const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
  return slugPattern.test(slug)
}

export function normalizeSlug(slug: string): string {
  if (!validateSlug(slug)) {
    return createSlug(slug)
  }
  return slug
}