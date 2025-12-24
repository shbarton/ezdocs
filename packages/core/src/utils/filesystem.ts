import { readFileSync, statSync, existsSync } from 'fs'
import { resolve, join, dirname, basename, extname } from 'path'
import glob from 'fast-glob'
import { createHash } from 'crypto'

export async function discoverFiles(pattern: string, baseDir: string, ignore: string[] = []): Promise<string[]> {
  const files = await glob(pattern, {
    cwd: baseDir,
    absolute: true,
    ignore,
  })

  return files.filter((file: string) => file.endsWith('.md') || file.endsWith('.mdx'))
}

export function readFile(filePath: string): string {
  try {
    return readFileSync(filePath, 'utf8')
  } catch (error) {
    throw new Error(`Failed to read file ${filePath}: ${error}`)
  }
}

export function getFileStats(filePath: string) {
  try {
    const stats = statSync(filePath)
    return {
      size: stats.size,
      modified: stats.mtime.toISOString(),
      created: stats.birthtime.toISOString(),
    }
  } catch (error) {
    throw new Error(`Failed to get file stats for ${filePath}: ${error}`)
  }
}

export function generateId(sourcePath: string): string {
  const hash = createHash('sha256')
  hash.update(sourcePath)
  return hash.digest('hex').substring(0, 16)
}

export function resolvePath(path: string, basePath?: string): string {
  if (basePath) {
    return resolve(basePath, path)
  }
  return resolve(path)
}

export function fileExists(path: string): boolean {
  return existsSync(path)
}

export function getRelativePath(from: string, to: string): string {
  const fromDir = dirname(from)
  const relativePath = join(fromDir, to)
  return relativePath
}

export function parseFileName(filePath: string): { name: string; ext: string; dir: string } {
  return {
    name: basename(filePath, extname(filePath)),
    ext: extname(filePath),
    dir: dirname(filePath),
  }
}