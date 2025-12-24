import { readFileSync } from 'fs'
import { resolve } from 'path'
import * as yaml from 'js-yaml'
import { EZDocsConfig } from '../content/types.js'

export async function loadConfig(configPath?: string): Promise<EZDocsConfig> {
  const defaultPath = resolve(process.cwd(), 'ezdocs.config.yml')
  const path = configPath || defaultPath

  try {
    const configContent = readFileSync(path, 'utf8')
    const config = yaml.load(configContent) as EZDocsConfig

    // Validate required fields
    validateConfig(config)

    // Set defaults
    return setDefaults(config)
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      throw new Error(`Configuration file not found: ${path}`)
    }
    throw new Error(`Failed to load configuration: ${error}`)
  }
}

function validateConfig(config: any): asserts config is EZDocsConfig {
  if (!config) {
    throw new Error('Configuration is empty')
  }

  if (!config.version) {
    throw new Error('Configuration version is required')
  }

  if (!config.name) {
    throw new Error('Configuration name is required')
  }

  if (!config.collections || typeof config.collections !== 'object') {
    throw new Error('Collections configuration is required')
  }

  if (!config.site || !config.site.title) {
    throw new Error('Site title is required')
  }

  if (!config.output || !config.output.nextra) {
    throw new Error('Output configuration is required')
  }

  // Validate collections
  for (const [name, collection] of Object.entries(config.collections)) {
    const coll = collection as any
    if (!coll.pattern) {
      throw new Error(`Collection '${name}' requires a pattern`)
    }
    if (!coll.route) {
      throw new Error(`Collection '${name}' requires a route template`)
    }
  }
}

function setDefaults(config: EZDocsConfig): EZDocsConfig {
  return {
    version: config.version,
    name: config.name,
    description: config.description,
    collections: config.collections,
    content: {
      source: config.content?.source || './content',
      ignore: config.content?.ignore || ['**/drafts/**', '**/*.draft.md'],
    },
    site: {
      title: config.site?.title || config.name,
      description: config.site?.description || config.description || '',
      baseUrl: config.site?.baseUrl,
      logo: config.site?.logo,
    },
    output: {
      nextra: {
        directory: config.output?.nextra?.directory || './.ezdocs',
        theme: (config.output?.nextra?.theme as 'docs' | 'blog') || 'docs',
        config: config.output?.nextra?.config,
      },
      exports: config.output?.exports || [],
    },
    images: {
      formats: config.images?.formats || ['webp', 'jpeg'],
      sizes: config.images?.sizes || [640, 1280, 1920],
      quality: config.images?.quality || 85,
    },
    dev: {
      port: config.dev?.port || 3000,
      watch: config.dev?.watch ?? true,
      livereload: config.dev?.livereload ?? true,
    },
  }
}