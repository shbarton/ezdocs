import fs from 'fs-extra';
import { dirname } from 'path';
export class ExportsGenerator {
    constructor(config) {
        this.config = config;
    }
    async generate(index) {
        if (!this.config.output.exports) {
            return;
        }
        console.log('📦 Generating exports...');
        for (const exportConfig of this.config.output.exports) {
            switch (exportConfig.type) {
                case 'json':
                    this.generateJSONExport(index, exportConfig.path);
                    break;
                case 'typescript':
                    this.generateTypeScriptExport(index, exportConfig.path);
                    break;
            }
        }
        console.log('✅ Exports generated successfully');
    }
    generateJSONExport(index, outputPath) {
        fs.ensureDirSync(dirname(outputPath));
        const jsonContent = JSON.stringify(index, null, 2);
        fs.writeFileSync(outputPath, jsonContent, 'utf8');
        console.log(`  📄 JSON export written to: ${outputPath}`);
    }
    generateTypeScriptExport(index, outputPath) {
        fs.ensureDirSync(dirname(outputPath));
        const typeDefinitions = this.generateTypeDefinitions();
        const contentExport = this.generateContentExport(index);
        const tsContent = `${typeDefinitions}

${contentExport}
`;
        fs.writeFileSync(outputPath, tsContent, 'utf8');
        console.log(`  📘 TypeScript export written to: ${outputPath}`);
    }
    generateTypeDefinitions() {
        return `// Auto-generated content types
export interface Author {
  name: string
  email?: string
  bio?: string
  avatar?: string
  social?: Record<string, string>
}

export interface ContentItem {
  id: string
  collection: string
  sourcePath: string
  slug: string
  route: string
  title: string
  description?: string
  summary?: string
  date?: string
  lastModified: string
  draft: boolean
  featured: boolean
  tags: string[]
  categories: string[]
  author?: Author
  order?: number
  parent?: string
  children: string[]
  frontmatter: Record<string, any>
  body: string
  excerpt?: string
  readingTimeMinutes: number
  wordCount: number
  images: any[]
  videos: any[]
  downloads: any[]
  seo?: any
}

export interface ContentIndex {
  items: ContentItem[]
  collections: Record<string, ContentItem[]>
  routes: Record<string, ContentItem>
  metadata: {
    totalItems: number
    totalCollections: number
    lastBuild: string
    version: string
  }
}`;
    }
    generateContentExport(index) {
        const collections = Object.entries(index.collections)
            .map(([name, items]) => {
            return `export const ${name}: ContentItem[] = ${JSON.stringify(items, null, 2)} as const`;
        })
            .join('\n\n');
        const routes = `export const routes: Record<string, ContentItem> = ${JSON.stringify(index.routes, null, 2)} as const`;
        const allItems = `export const allItems: ContentItem[] = ${JSON.stringify(index.items, null, 2)} as const`;
        const metadata = `export const metadata = ${JSON.stringify(index.metadata, null, 2)} as const`;
        const contentIndex = `export const contentIndex: ContentIndex = ${JSON.stringify(index, null, 2)} as const`;
        return `// Content exports
${collections}

${routes}

${allItems}

${metadata}

${contentIndex}

// Helper functions
export function getItemByRoute(route: string): ContentItem | undefined {
  return routes[route]
}

export function getItemsByCollection(collection: string): ContentItem[] {
  return contentIndex.collections[collection] || []
}

export function getItemsByTag(tag: string): ContentItem[] {
  return allItems.filter(item => item.tags.includes(tag))
}

export function getItemsByCategory(category: string): ContentItem[] {
  return allItems.filter(item => item.categories.includes(category))
}

export function getItemsByAuthor(authorName: string): ContentItem[] {
  return allItems.filter(item => item.author?.name === authorName)
}

export default contentIndex`;
    }
}
//# sourceMappingURL=exports.js.map