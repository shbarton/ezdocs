# EZ Docs - Simplified Implementation Plan

## Phase 1: Project Setup & Infrastructure

### 1.1 Repository Structure
```
ezdocs/
├── packages/
│   ├── create-ezdocs/       # Project initialization only
│   ├── core/                # Core ContentKit + Nextra library
│   └── templates/           # Project templates
├── docs/                    # This project's documentation
├── examples/                # Example projects
├── scripts/                 # Build and release scripts
├── package.json             # Monorepo configuration
├── tsconfig.json            # TypeScript configuration
└── README.md
```

### 1.2 Simplified Setup
- **Tool**: Basic npm workspaces (no Turborepo needed)
- **Package Manager**: npm
- **TypeScript**: Shared configuration
- **Testing**: Jest for core library only
- **Linting**: ESLint + Prettier

### 1.3 Build Pipeline
```bash
# Development workflow
npm run build        # Build packages
npm run test         # Run tests
npm run lint         # Lint packages
```

## Phase 2: ContentKit Core Library

### 2.1 Enhanced ContentKit Architecture
```
packages/core/
├── src/
│   ├── content/
│   │   ├── parser.ts        # Markdown + frontmatter parsing
│   │   ├── processor.ts     # Content processing pipeline
│   │   ├── validator.ts     # Content validation
│   │   └── types.ts         # Type definitions
│   ├── assets/
│   │   ├── image-processor.ts
│   │   ├── asset-manager.ts
│   │   └── optimization.ts
│   ├── config/
│   │   ├── loader.ts        # Config file loading
│   │   ├── validator.ts     # Config validation
│   │   └── schema.ts        # Config schema definition
│   ├── generators/
│   │   ├── nextra.ts        # Nextra structure generation
│   │   ├── json.ts          # JSON export
│   │   ├── typescript.ts    # TypeScript generation
│   │   └── meta.ts          # _meta.json generation
│   ├── utils/
│   │   ├── filesystem.ts
│   │   ├── slug.ts
│   │   ├── routing.ts
│   │   └── helpers.ts
│   ├── bin/                 # Simple command scripts
│   │   ├── build.js         # npm run build script
│   │   ├── dev.js           # npm run dev script
│   │   └── validate.js      # npm run validate script
│   └── index.ts
├── __tests__/
└── package.json
```

### 2.2 Enhanced Configuration Schema
```yaml
# ezdocs.config.yml
version: "1.0"
name: "My Documentation"
description: "Comprehensive documentation for my project"

# Content source configuration
content:
  source: "./content"
  ignore: ["**/drafts/**", "**/*.draft.md"]
  
# Collection definitions
collections:
  docs:
    pattern: "docs/**/*.md"
    route: "/docs/{slug}"
    sort:
      by: "order"         # frontmatter field
      fallback: "date"
      order: "asc"
    nextra:
      sidebar: true
      searchable: true
      
  guides:
    pattern: "guides/**/*.md" 
    route: "/guides/{category}/{slug}"
    sort:
      by: "date"
      order: "desc"
    nextra:
      sidebar: true
      breadcrumbs: true

# Site configuration
site:
  title: "My Documentation"
  description: "Comprehensive docs"
  baseUrl: "https://docs.example.com"
  logo: "./assets/logo.svg"
  
# Output configuration
output:
  nextra:
    directory: "./.ezdocs"
    theme: "docs"        # or "blog"
    config:
      docsRepositoryBase: "https://github.com/user/repo/tree/main"
      
  exports:
    - type: "json"
      path: "./content.json"
    - type: "typescript" 
      path: "./src/generated/content.ts"

# Image processing
images:
  formats: ["webp", "avif", "jpeg"]
  sizes: [640, 1280, 1920]
  quality: 85
  
# Development settings
dev:
  port: 3000
  watch: true
  livereload: true
```

### 2.3 Enhanced ContentKit Types
```typescript
// packages/core/src/content/types.ts

export interface ContentItem {
  id: string
  collection: string
  sourcePath: string
  slug: string
  route: string
  
  // Metadata
  title: string
  description?: string
  summary?: string
  date?: string
  lastModified: string
  draft: boolean
  featured: boolean
  
  // Organization
  tags: string[]
  categories: string[]
  author?: Author
  
  // Navigation
  order?: number
  parent?: string
  children: string[]
  
  // Content
  frontmatter: Record<string, any>
  body: string
  excerpt?: string
  readingTimeMinutes: number
  wordCount: number
  
  // Assets
  images: ImageAsset[]
  videos: VideoAsset[]
  downloads: FileAsset[]
  
  // SEO
  seo?: SEOMetadata
}

export interface Author {
  name: string
  email?: string
  bio?: string
  avatar?: string
  social?: Record<string, string>
}

export interface ImageAsset {
  originalPath: string
  publicPath: string
  filename: string
  alt?: string
  caption?: string
  width: number
  height: number
  sizes: ImageSize[]
  format: string
  size: number
}

export interface ImageSize {
  width: number
  height: number
  path: string
  format: string
  size: number
}

export interface CollectionConfig {
  pattern: string
  route: string
  sort?: SortConfig
  nextra?: NextraConfig
  validation?: ValidationConfig
}

export interface NextraConfig {
  sidebar: boolean
  searchable: boolean
  breadcrumbs: boolean
  toc: boolean
  editLink: boolean
  feedback: boolean
  navigation: boolean
}
```

### 2.4 ContentKit Processing Pipeline
```typescript
// packages/core/src/content/processor.ts

export class ContentProcessor {
  constructor(private config: EZDocsConfig) {}
  
  async process(): Promise<ContentIndex> {
    // 1. Discover content files
    const files = await this.discoverFiles()
    
    // 2. Parse and validate content
    const items = await this.parseContent(files)
    
    // 3. Process assets
    await this.processAssets(items)
    
    // 4. Build relationships
    this.buildRelationships(items)
    
    // 5. Generate routes and navigation
    this.generateNavigation(items)
    
    // 6. Create content index
    return this.createIndex(items)
  }
  
  private async discoverFiles(): Promise<string[]> {
    // Glob pattern matching with ignore rules
  }
  
  private async parseContent(files: string[]): Promise<ContentItem[]> {
    // Parallel processing of markdown files
    // YAML frontmatter extraction
    // Content validation
  }
  
  private async processAssets(items: ContentItem[]): Promise<void> {
    // Image optimization and resizing
    // Video processing
    // Asset copying and path resolution
  }
  
  private buildRelationships(items: ContentItem[]): void {
    // Parent-child relationships
    // Category hierarchies
    // Cross-references
  }
}
```

## Phase 3: Nextra Integration Layer

### 3.1 Nextra Structure Generation
```typescript
// packages/core/src/generators/nextra.ts

export class NextraGenerator {
  async generate(index: ContentIndex, config: EZDocsConfig): Promise<void> {
    // 1. Create Nextra directory structure
    await this.createDirectoryStructure()
    
    // 2. Generate MDX files from content
    await this.generateMDXFiles(index.items)
    
    // 3. Create _meta.json files for navigation
    await this.generateMetaFiles(index)
    
    // 4. Generate theme configuration
    await this.generateThemeConfig(config)
    
    // 5. Copy assets to public directory
    await this.copyAssets(index)
  }
  
  private async generateMDXFiles(items: ContentItem[]): Promise<void> {
    // Convert markdown to MDX
    // Inject frontmatter as props
    // Handle custom components
  }
  
  private async generateMetaFiles(index: ContentIndex): Promise<void> {
    // Create navigation structure
    // Handle ordering and hierarchy
    // Generate sidebar configuration
  }
}
```

### 3.2 MDX Template System
```mdx
{/* Generated MDX template */}
---
title: {title}
description: {description}
---

import { ContentLayout } from '@ezdocs/components'
import { Breadcrumbs } from '@ezdocs/components'
import { TableOfContents } from '@ezdocs/components'

export const meta = {
  title: "{title}",
  description: "{description}",
  author: "{author}",
  date: "{date}",
  tags: {JSON.stringify(tags)},
  readingTime: {readingTimeMinutes}
}

<ContentLayout meta={meta}>
  <Breadcrumbs />
  
  {/* Processed markdown content */}
  {body}
  
  <TableOfContents />
</ContentLayout>
```

### 3.3 Custom Nextra Components
```typescript
// packages/core/templates/components/

export { ContentLayout } from './ContentLayout'
export { Breadcrumbs } from './Breadcrumbs'
export { TableOfContents } from './TableOfContents'
export { AuthorBio } from './AuthorBio'
export { TagList } from './TagList'
export { RelatedContent } from './RelatedContent'
export { LastUpdated } from './LastUpdated'
```

## Phase 4: Create-EZDocs Package (Project Initialization Only)

### 4.1 Create Package Architecture
```
packages/create-ezdocs/
├── src/
│   ├── index.ts             # Main entry point
│   ├── prompts.ts           # Interactive setup
│   ├── generator.ts         # Project generation
│   ├── utils.ts             # Helper functions
│   └── types.ts             # Type definitions
├── templates/               # Project templates
│   ├── basic/
│   ├── blog/
│   └── api/
└── package.json
```

### 4.2 Simple Create Command
```typescript
// packages/create-ezdocs/src/index.ts

export async function createProject(projectName: string) {
  // 1. Interactive setup (optional)
  const config = await gatherProjectInfo()
  
  // 2. Choose template
  const template = await selectTemplate()
  
  // 3. Generate project
  await generateProject(projectName, config, template)
  
  // 4. Install dependencies
  await runCommand('npm install')
  
  // 5. Success message
  console.log(`✅ Created ${projectName}`)
  console.log(`cd ${projectName} && npm run dev`)
}
```

### 4.3 Generated Project Structure
```
my-docs/
├── content/                 # User content
├── public/                  # Static assets
├── ezdocs.config.yml       # EZ Docs configuration
├── package.json            # Standard npm project
├── next.config.js          # Nextra configuration
├── theme.config.jsx        # Nextra theme
└── README.md
```

### 4.4 Generated Package.json Scripts
```json
{
  "scripts": {
    "build": "ezdocs-build",    # Simple script from @ezdocs/core
    "dev": "ezdocs-dev",        # Nextra dev server
    "validate": "ezdocs-validate"
  },
  "dependencies": {
    "@ezdocs/core": "^1.0.0",
    "nextra": "^2.13.0",
    "nextra-theme-docs": "^2.13.0"
  }
}

## Phase 5: Project Templates

### 5.1 Basic Documentation Template
```
templates/docs/
├── content/
│   ├── docs/
│   │   ├── getting-started.md
│   │   ├── installation.md
│   │   └── configuration.md
│   └── guides/
│       ├── best-practices.md
│       └── troubleshooting.md
├── public/
│   └── images/
├── ezdocs.config.yml
├── package.json
├── next.config.js
├── tailwind.config.js
└── README.md
```

### 5.2 API Documentation Template
```
templates/api/
├── content/
│   ├── api/
│   │   ├── authentication.md
│   │   ├── endpoints/
│   │   └── examples/
│   ├── guides/
│   └── reference/
├── components/
│   ├── ApiEndpoint.tsx
│   ├── CodeExample.tsx
│   └── ParameterTable.tsx
├── ezdocs.config.yml
└── package.json
```

### 5.3 Template Configuration
```yaml
# templates/docs/ezdocs.config.yml
version: "1.0"
name: "{{PROJECT_NAME}}"
description: "{{PROJECT_DESCRIPTION}}"

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
      
  guides:
    pattern: "guides/**/*.md"
    route: "/guides/{slug}" 
    sort:
      by: "date"
      order: "desc"

site:
  title: "{{PROJECT_NAME}} Documentation"
  description: "{{PROJECT_DESCRIPTION}}"
  
output:
  nextra:
    directory: "./.ezdocs"
    theme: "docs"
```

## Phase 6: Testing Strategy

### 6.1 Test Categories
- **Unit Tests**: Core ContentKit functions
- **Integration Tests**: Full pipeline processing
- **Create Package Tests**: Project generation
- **Template Tests**: Generated project validation
- **E2E Tests**: Full workflow validation

### 6.2 Test Infrastructure
```typescript
// packages/core/__tests__/content-processor.test.ts

describe('ContentProcessor', () => {
  let processor: ContentProcessor
  let mockConfig: EZDocsConfig
  
  beforeEach(() => {
    mockConfig = createMockConfig()
    processor = new ContentProcessor(mockConfig)
  })
  
  describe('process()', () => {
    it('should process basic markdown files', async () => {
      // Test basic processing
    })
    
    it('should handle complex frontmatter', async () => {
      // Test YAML frontmatter parsing
    })
    
    it('should process images correctly', async () => {
      // Test image processing
    })
  })
})
```

## Phase 7: Documentation & Examples

### 7.1 Project Documentation
- **Getting Started Guide**
- **Configuration Reference**
- **Content Authoring Guide**
- **Deployment Guide**
- **Migration Guide**
- **API Reference**

### 7.2 Example Projects
```
examples/
├── basic-docs/              # Simple documentation
├── blog-style/              # Blog with categories
├── api-reference/           # API documentation
├── knowledge-base/          # Complex hierarchical content
└── multi-language/          # Internationalization
```

## Phase 8: Release & Distribution

### 8.1 NPM Package Structure
```json
{
  "name": "create-ezdocs",
  "version": "1.0.0",
  "bin": {
    "create-ezdocs": "./dist/index.js"
  },
  "files": [
    "dist/",
    "templates/"
  ]
}

{
  "name": "@ezdocs/core", 
  "version": "1.0.0",
  "bin": {
    "ezdocs-build": "./bin/build.js",
    "ezdocs-dev": "./bin/dev.js", 
    "ezdocs-validate": "./bin/validate.js"
  },
  "files": [
    "dist/",
    "bin/"
  ]
}
```

### 8.2 Release Pipeline
- **Automated Testing**: GitHub Actions
- **Version Management**: Changesets
- **NPM Publishing**: Automated releases
- **Documentation Deployment**: Vercel/Netlify

## Implementation Timeline

### Week 1-2: Foundation
- [ ] Simple npm workspace setup
- [ ] Core ContentKit extraction and enhancement
- [ ] Basic configuration system
- [ ] Initial test suite

### Week 3-4: Nextra Integration  
- [ ] MDX generation system
- [ ] Navigation structure generation
- [ ] Asset processing pipeline
- [ ] Simple npm scripts (build, dev, validate)

### Week 5-6: Create Package Development
- [ ] Project initialization only
- [ ] Interactive setup flow
- [ ] Template system
- [ ] Project generation

### Week 7-8: Polish & Release
- [ ] Comprehensive testing
- [ ] Documentation writing
- [ ] Example projects
- [ ] Release automation

## Success Metrics

### Technical Metrics
- [ ] 95%+ test coverage
- [ ] <5s build time for typical documentation
- [ ] Support for 1000+ pages
- [ ] Cross-platform compatibility

### User Experience Metrics
- [ ] <60s from init to running dev server
- [ ] Zero-config setup for basic use cases
- [ ] Clear error messages and debugging
- [ ] Comprehensive documentation