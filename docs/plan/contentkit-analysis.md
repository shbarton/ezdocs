# ContentKit System Analysis & Requirements

## Current ContentKit Implementation (from dragonfly-site-test)

### Dependencies Required
```json
{
  "dependencies": {
    "gray-matter": "^4.0.3",        // YAML frontmatter parsing
    "fast-glob": "^3.3.2",          // File pattern matching
    "js-yaml": "^4.1.0",            // YAML processing
    "sharp": "^0.33.2"              // Image processing
  },
  "devDependencies": {
    "@types/js-yaml": "^4.0.9"
  }
}
```

### Core File Structure Analysis

#### 1. Configuration System (`contentkit.config.yml`)
```yaml
contentDir: "./content"              # Source directory for content

collections:                        # Content type definitions
  blog:                             # Collection name
    pattern: "blog/**/*.md"         # Glob pattern for files
    route: "/blog/{slug}"           # URL route template
    sort:                           # Sorting configuration
      by: "date"                    # Sort field
      order: "desc"                 # Sort direction

outputs:                            # Build outputs
  - type: "json"                    # JSON export
    path: "./src/generated/content.json"
  - type: "ts"                      # TypeScript export
    path: "./src/generated/content.ts"
```

#### 2. Core ContentKit Library (`src/lib/contentkit.ts`)

**Key Interfaces:**
```typescript
interface ContentItem {
  id: string                        // SHA-256 hash of source path
  collection: string                // Collection name (e.g., "blog")
  sourcePath: string               // Original file path
  slug: string                     // URL-friendly identifier
  route: string                    // Full route path
  title: string                    // From frontmatter
  summary?: string                 // From frontmatter
  date?: string                    // ISO date string
  draft: boolean                   // Draft status
  tags: string[]                   // Tag array
  author?: string                  // Author name
  frontmatter: Record<string, any> // Raw frontmatter object
  body: string                     // Processed markdown content
  readingTimeMinutes?: number      // Calculated reading time
  wordCount: number                // Word count
  images: string[]                 // Processed image paths
}
```

**Core Functions:**
- `loadConfig()` - YAML config file parsing
- `generateId()` - SHA-256 hash generation
- `estimateReadingTime()` - 200 words/minute calculation
- `deriveSlug()` - Slug generation from filename or frontmatter
- `extractImageReferences()` - Parse markdown for images
- `processImage()` - Image optimization and path management
- `parseContentItem()` - Full content item processing
- `buildContentIndex()` - Complete content indexing
- `generateOutputs()` - JSON/TypeScript file generation

#### 3. Content Processing Pipeline

**Input Processing:**
1. **File Discovery**: Uses `fast-glob` with collection patterns
2. **Content Parsing**: `gray-matter` for frontmatter + content separation
3. **Metadata Extraction**: Title, date, tags, author from YAML frontmatter
4. **Slug Generation**: From frontmatter.slug or filename processing
5. **Image Processing**: Extract references, optimize with Sharp, update paths

**Content Processing:**
1. **Reading Time**: 200 words/minute calculation
2. **Word Count**: Simple whitespace-based splitting
3. **Draft Filtering**: Exclude drafts in production builds
4. **Sorting**: Configurable by any frontmatter field
5. **Route Generation**: Template-based URL generation

**Output Generation:**
1. **JSON Export**: Full content index as JSON
2. **TypeScript Export**: Typed content with interfaces
3. **Image Assets**: Optimized images in public directory

### Sample Content Structure

#### Frontmatter Format (from `ai-postmodernist-narcissus.md`):
```yaml
---
title: "AI, Postmodernist Narcissus"
author: "Linda Phompak"
date: 2024-06-18
slug: "ai-postmodernist-narcissus"
draft: false
tags: ["ai", "philosophy", "postmodernism"]
summary: "We didn't build AI to think for us. We built it to watch us think. A reflection on AI as a mirror of humanity, exploring the paradoxes of digital reflection and algorithmic narcissism."
---
```

#### Image Processing Capabilities:
- **Formats**: JPEG, PNG, WebP conversion
- **Optimization**: Quality settings, progressive JPEG, compression
- **Path Management**: Automatic public directory organization
- **Reference Updates**: Markdown image path rewriting
- **Metadata Extraction**: Width, height, file size

### Build Process Analysis

#### Build Script (`scripts/build-content.ts`):
```typescript
import { build } from '../src/lib/contentkit'

async function main() {
  try {
    await build()
  } catch (error) {
    console.error('Content build failed:', error)
    process.exit(1)
  }
}
```

#### Generated Output Structure:
```
src/generated/
├── content.json          # Full content index
└── content.ts           # TypeScript exports with types
```

### Enhancements Needed for EZ Docs

#### 1. Configuration Enhancements
```yaml
# Extended configuration for EZ Docs
version: "1.0"
collections:
  docs:
    pattern: "docs/**/*.md"
    route: "/docs/{slug}"
    sort:
      by: "order"           # NEW: Custom ordering
      fallback: "title"     # NEW: Fallback sort field
    nextra:                 # NEW: Nextra-specific config
      sidebar: true
      searchable: true
      navigation: true
```

#### 2. Enhanced Content Types
```typescript
// Extended ContentItem interface
interface ContentItem {
  // ... existing fields
  order?: number           // NEW: Manual ordering
  parent?: string          // NEW: Hierarchical relationships
  children: string[]       // NEW: Child content items
  lastModified: string     // NEW: File modification time
  excerpt?: string         // NEW: Auto-generated excerpt
  seo?: SEOMetadata       // NEW: SEO metadata
}
```

#### 3. Nextra Integration Requirements
```typescript
// Generate _meta.json files for Nextra navigation
interface NextraMetadata {
  title?: string
  href?: string
  newWindow?: boolean
  hidden?: boolean
  disabled?: boolean
  type?: 'page' | 'menu' | 'separator'
  items?: Record<string, NextraMetadata>
}
```

#### 4. Asset Processing Enhancements
- **Multiple Format Generation**: WebP, AVIF, original format
- **Responsive Image Sets**: Multiple sizes for different breakpoints
- **Video Processing**: Basic video optimization
- **File Asset Management**: PDFs, downloads, etc.

#### 5. Template System
```typescript
// MDX template generation for Nextra
interface MDXTemplate {
  frontmatter: Record<string, any>
  imports: string[]
  content: string
  components: string[]
}
```

### Required NPM Dependencies for EZ Docs

#### Core Dependencies:
```json
{
  "gray-matter": "^4.0.3",           // YAML frontmatter (existing)
  "fast-glob": "^3.3.2",             // File globbing (existing)
  "js-yaml": "^4.1.0",               // YAML processing (existing)
  "sharp": "^0.33.2",                // Image processing (existing)
  "nextra": "^2.13.0",               // Nextra framework (NEW)
  "nextra-theme-docs": "^2.13.0",    // Nextra docs theme (NEW)
  "commander": "^11.1.0",            // CLI framework (NEW)
  "inquirer": "^9.2.0",              // Interactive prompts (NEW)
  "chalk": "^5.3.0",                 // Terminal colors (NEW)
  "fs-extra": "^11.2.0",             // Enhanced file system (NEW)
  "chokidar": "^3.5.3",              // File watching (NEW)
  "@types/fs-extra": "^11.0.4"       // TypeScript types (NEW)
}
```

### Performance Considerations

#### Current Limitations:
- **Synchronous Processing**: Sequential file processing
- **Image Processing**: No parallel optimization
- **Memory Usage**: Loads all content into memory
- **Cache Management**: No build caching

#### Proposed Improvements:
- **Parallel Processing**: Async/await with Promise.all
- **Incremental Builds**: File change detection and partial rebuilds
- **Memory Optimization**: Stream processing for large files
- **Build Caching**: Hash-based cache invalidation

### Integration Points with Nextra

#### 1. File Structure Mapping
```
ContentKit Output → Nextra Structure
content/docs/getting-started.md → .ezdocs/pages/docs/getting-started.mdx
content/guides/setup.md → .ezdocs/pages/guides/setup.mdx
```

#### 2. Navigation Generation
```typescript
// Generate _meta.json from ContentKit collections
const generateNextraMeta = (items: ContentItem[]) => {
  // Sort by order field or title
  // Group by directory structure
  // Generate nested navigation object
}
```

#### 3. Theme Integration
```javascript
// next.config.js for Nextra
const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.jsx'
})

module.exports = withNextra({
  // EZ Docs specific configuration
})
```

### Migration Strategy from Current ContentKit

#### 1. Preserve Existing Features
- ✅ YAML frontmatter parsing
- ✅ Image processing pipeline
- ✅ Content indexing and routing
- ✅ TypeScript generation

#### 2. Enhance for Reusability
- 🔄 Extract core library to separate package
- 🔄 Add configuration validation
- 🔄 Improve error handling and logging
- 🔄 Add comprehensive test coverage

#### 3. Add Nextra Integration
- ➕ MDX file generation
- ➕ _meta.json creation for navigation
- ➕ Theme configuration generation
- ➕ Asset copying to public directory

#### 4. CLI Tool Development
- ➕ Project initialization command
- ➕ Build and watch commands
- ➕ Development server integration
- ➕ Template selection system