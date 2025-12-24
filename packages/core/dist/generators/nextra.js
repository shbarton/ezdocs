import { join, dirname } from 'path';
import fs from 'fs-extra';
export class NextraGenerator {
    constructor(config) {
        this.config = config;
    }
    async generate(index) {
        console.log('🚀 Generating Nextra structure...');
        const outputDir = this.config.output.nextra.directory;
        // 1. Create directory structure
        this.createDirectoryStructure(outputDir);
        // 2. Generate MDX files
        await this.generateMDXFiles(index.items, outputDir);
        // 3. Generate _meta.json files
        await this.generateMetaFiles(index, outputDir);
        // 4. Generate theme configuration
        await this.generateThemeConfig(outputDir);
        // 5. Generate Next.js configuration
        await this.generateNextConfig(outputDir);
        // 6. Generate package.json for the Nextra project
        await this.generatePackageJson(outputDir);
        console.log('✅ Nextra structure generated successfully');
    }
    createDirectoryStructure(outputDir) {
        fs.ensureDirSync(join(outputDir, 'pages'));
        fs.ensureDirSync(join(outputDir, 'public'));
        fs.ensureDirSync(join(outputDir, 'styles'));
        // Create collection directories
        for (const collectionName of Object.keys(this.config.collections)) {
            fs.ensureDirSync(join(outputDir, 'pages', collectionName));
        }
    }
    async generateMDXFiles(items, outputDir) {
        for (const item of items) {
            // Skip drafts in production
            if (item.draft && process.env.NODE_ENV === 'production') {
                continue;
            }
            const mdxContent = this.generateMDXContent(item);
            const outputPath = this.getMDXOutputPath(item, outputDir);
            fs.ensureDirSync(dirname(outputPath));
            fs.writeFileSync(outputPath, mdxContent, 'utf8');
        }
    }
    generateMDXContent(item) {
        const frontmatter = {
            title: item.title,
            description: item.description || item.summary,
            ...(item.date && { date: item.date }),
            ...(item.author && { author: item.author.name }),
        };
        const frontmatterString = Object.entries(frontmatter)
            .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
            .join('\n');
        return `---
${frontmatterString}
---

${item.body}
`;
    }
    getMDXOutputPath(item, outputDir) {
        // Convert route to file path
        let path = item.route;
        // Remove leading slash
        if (path.startsWith('/')) {
            path = path.substring(1);
        }
        // Add .mdx extension
        if (!path.endsWith('.mdx')) {
            path += '.mdx';
        }
        return join(outputDir, 'pages', path);
    }
    async generateMetaFiles(index, outputDir) {
        // Generate _meta.json for each collection directory
        for (const [collectionName, items] of Object.entries(index.collections)) {
            const collectionConfig = this.config.collections[collectionName];
            // Group items by their directory structure
            const itemsByPath = this.groupItemsByPath(items);
            for (const [dirPath, dirItems] of Object.entries(itemsByPath)) {
                const metaContent = this.generateMetaContent(dirItems, collectionConfig);
                const metaPath = join(outputDir, 'pages', dirPath, '_meta.json');
                fs.ensureDirSync(dirname(metaPath));
                fs.writeFileSync(metaPath, JSON.stringify(metaContent, null, 2), 'utf8');
            }
        }
        // Generate root _meta.json
        const rootMeta = this.generateRootMeta(index);
        fs.writeFileSync(join(outputDir, 'pages', '_meta.json'), JSON.stringify(rootMeta, null, 2), 'utf8');
    }
    groupItemsByPath(items) {
        const groups = {};
        for (const item of items) {
            let routePath = item.route;
            // Remove leading slash
            if (routePath.startsWith('/')) {
                routePath = routePath.substring(1);
            }
            // Get directory path
            const dirPath = dirname(routePath);
            const normalizedPath = dirPath === '.' ? '' : dirPath;
            if (!groups[normalizedPath]) {
                groups[normalizedPath] = [];
            }
            groups[normalizedPath].push(item);
        }
        return groups;
    }
    generateMetaContent(items, collectionConfig) {
        const meta = {};
        for (const item of items) {
            const fileName = this.getFileNameFromRoute(item.route);
            meta[fileName] = {
                title: item.title,
                ...(item.description && { description: item.description }),
                ...(collectionConfig?.nextra?.hidden && { hidden: true }),
            };
        }
        return meta;
    }
    generateRootMeta(index) {
        const meta = {};
        // Add collections as top-level navigation
        for (const collectionName of Object.keys(index.collections)) {
            const collectionConfig = this.config.collections[collectionName];
            meta[collectionName] = {
                title: collectionName.charAt(0).toUpperCase() + collectionName.slice(1),
                type: 'menu',
            };
        }
        return meta;
    }
    getFileNameFromRoute(route) {
        let path = route;
        // Remove leading slash
        if (path.startsWith('/')) {
            path = path.substring(1);
        }
        // Get the base name without extension
        const parts = path.split('/');
        const fileName = parts[parts.length - 1];
        return fileName || 'index';
    }
    async generateThemeConfig(outputDir) {
        const config = `import React from 'react'
import { DocsThemeConfig } from 'nextra-theme-docs'

const config: DocsThemeConfig = {
  logo: <span>${this.config.site.title}</span>,
  project: {
    link: 'https://github.com/samuelcolvin/ezdocs'
  },
  docsRepositoryBase: 'https://github.com/samuelcolvin/ezdocs/tree/main',
  footer: {
    text: '© ${new Date().getFullYear()} ${this.config.site.title}. Built with EZ Docs.'
  },
  useNextSeoProps() {
    return {
      titleTemplate: '%s – ${this.config.site.title}'
    }
  },
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta property="og:title" content="${this.config.site.title}" />
      <meta property="og:description" content="${this.config.site.description}" />
    </>
  )
}

export default config
`;
        fs.writeFileSync(join(outputDir, 'theme.config.tsx'), config, 'utf8');
    }
    async generateNextConfig(outputDir) {
        const config = `const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
})

module.exports = withNextra({
  // Next.js config
})
`;
        fs.writeFileSync(join(outputDir, 'next.config.js'), config, 'utf8');
    }
    async generatePackageJson(outputDir) {
        const packageJson = {
            name: this.config.name.toLowerCase().replace(/\s+/g, '-'),
            version: '0.1.0',
            private: true,
            scripts: {
                dev: 'next dev',
                build: 'next build',
                start: 'next start',
                lint: 'next lint',
            },
            dependencies: {
                next: '^14.0.0',
                nextra: '^2.13.0',
                'nextra-theme-docs': '^2.13.0',
                react: '^18.0.0',
                'react-dom': '^18.0.0',
            },
            devDependencies: {
                '@types/node': '^20.0.0',
                '@types/react': '^18.0.0',
                '@types/react-dom': '^18.0.0',
                eslint: '^8.0.0',
                'eslint-config-next': '^14.0.0',
                typescript: '^5.0.0',
            },
        };
        fs.writeFileSync(join(outputDir, 'package.json'), JSON.stringify(packageJson, null, 2), 'utf8');
    }
}
//# sourceMappingURL=nextra.js.map