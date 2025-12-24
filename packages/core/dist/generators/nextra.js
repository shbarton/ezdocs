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
        // 5.5. Generate custom _app.js
        await this.generateAppJs(outputDir);
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
        // Generate modern CSS
        this.generateModernCSS(outputDir);
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
import { useRouter } from 'next/router'

const Logo = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 600 }}>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="18" height="18" rx="3" fill="url(#gradient)" />
      <path d="M8 12h8M12 8v8" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
      </defs>
    </svg>
    <span>${this.config.site.title}</span>
  </div>
)

const config: DocsThemeConfig = {
  logo: <Logo />,
  primaryHue: 220,
  primarySaturation: 100,
  
  project: {
    link: 'https://github.com/samuelcolvin/ezdocs'
  },
  
  docsRepositoryBase: 'https://github.com/samuelcolvin/ezdocs/tree/main',
  
  footer: {
    text: (
      <span className="flex items-center gap-1">
        © {new Date().getFullYear()} ${this.config.site.title}.{' '}
        <span className="text-gray-400">Built with</span>
        <a
          href="https://github.com/samuelcolvin/ezdocs"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:text-blue-600 font-medium"
        >
          EZ Docs
        </a>
      </span>
    )
  },
  
  useNextSeoProps() {
    const { asPath } = useRouter()
    if (asPath !== '/') {
      return {
        titleTemplate: '%s – ${this.config.site.title}'
      }
    }
    return {
      title: '${this.config.site.title} – ${this.config.site.description}'
    }
  },
  
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta property="og:title" content="${this.config.site.title}" />
      <meta property="og:description" content="${this.config.site.description}" />
      <meta name="description" content="${this.config.site.description}" />
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <link rel="icon" type="image/png" href="/favicon.png" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
    </>
  ),
  
  sidebar: {
    titleComponent({ title }) {
      return <span className="font-semibold">{title}</span>
    },
    defaultMenuCollapseLevel: 1,
    autoCollapse: true
  },
  
  navbar: {
    extraContent: () => (
      <div className="flex items-center space-x-2">
        <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full font-medium">
          v${this.config.version || '1.0'}
        </span>
      </div>
    )
  },
  
  toc: {
    title: 'On This Page',
    backToTop: true
  },
  
  editLink: {
    text: 'Edit this page on GitHub →'
  },
  
  feedback: {
    content: 'Question? Give us feedback →',
    labels: 'feedback'
  },
  
  search: {
    placeholder: 'Search documentation...'
  },
  
  gitTimestamp: ({ timestamp }) => (
    <span className="text-gray-400 text-sm">
      Last updated on {timestamp.toLocaleDateString()}
    </span>
  ),
  
  banner: {
    key: 'release-1.0',
    text: (
      <span>
        🎉 EZ Docs v1.0 is released.{' '}
        <a href="/docs/getting-started" className="underline">
          Read more →
        </a>
      </span>
    )
  }
}

export default config
`;
        fs.writeFileSync(join(outputDir, 'theme.config.tsx'), config, 'utf8');
    }
    generateModernCSS(outputDir) {
        const css = `/* EZ Docs Modern Styling - GitBook/Claude Inspired */

/* CSS Variables for theming */
:root {
  --ez-primary-50: #eff6ff;
  --ez-primary-100: #dbeafe;
  --ez-primary-500: #3b82f6;
  --ez-primary-600: #2563eb;
  --ez-primary-700: #1d4ed8;
  
  --ez-gray-50: #f9fafb;
  --ez-gray-100: #f3f4f6;
  --ez-gray-200: #e5e7eb;
  --ez-gray-300: #d1d5db;
  --ez-gray-400: #9ca3af;
  --ez-gray-500: #6b7280;
  --ez-gray-600: #4b5563;
  --ez-gray-700: #374151;
  --ez-gray-800: #1f2937;
  --ez-gray-900: #111827;
  
  --ez-orange-500: #f97316;
  --ez-orange-600: #ea580c;
  
  --ez-border-radius: 12px;
  --ez-border-radius-sm: 8px;
  --ez-shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --ez-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --ez-shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
}

/* Typography improvements */
.nextra-content {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  line-height: 1.7;
  color: var(--ez-gray-700);
}

.nextra-content h1 {
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.025em;
  color: var(--ez-gray-900);
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, var(--ez-primary-600) 0%, var(--ez-orange-500) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nextra-content h2 {
  font-size: 2rem;
  font-weight: 600;
  line-height: 1.3;
  color: var(--ez-gray-800);
  margin-top: 3rem;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--ez-gray-200);
}

.nextra-content h3 {
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1.4;
  color: var(--ez-gray-800);
  margin-top: 2rem;
  margin-bottom: 0.75rem;
}

.nextra-content p {
  margin-bottom: 1.5rem;
  font-size: 1rem;
  line-height: 1.75;
}

/* Code blocks with modern styling */
.nextra-content pre {
  background: var(--ez-gray-900) !important;
  border: 1px solid var(--ez-gray-200);
  border-radius: var(--ez-border-radius);
  padding: 1.5rem;
  margin: 1.5rem 0;
  overflow-x: auto;
  box-shadow: var(--ez-shadow-sm);
}

.nextra-content code {
  background: var(--ez-gray-100);
  color: var(--ez-primary-700);
  padding: 0.25rem 0.5rem;
  border-radius: var(--ez-border-radius-sm);
  font-size: 0.875rem;
  font-weight: 500;
}

.nextra-content pre code {
  background: transparent;
  color: inherit;
  padding: 0;
  border-radius: 0;
}

/* Improved blockquotes */
.nextra-content blockquote {
  border-left: 4px solid var(--ez-primary-500);
  background: var(--ez-primary-50);
  padding: 1rem 1.5rem;
  margin: 1.5rem 0;
  border-radius: 0 var(--ez-border-radius-sm) var(--ez-border-radius-sm) 0;
  font-style: italic;
  color: var(--ez-gray-700);
}

/* Modern lists */
.nextra-content ul li {
  position: relative;
  margin-bottom: 0.5rem;
  padding-left: 1.5rem;
}

.nextra-content ul li::before {
  content: '•';
  color: var(--ez-primary-500);
  font-weight: bold;
  position: absolute;
  left: 0;
}

/* Enhanced links */
.nextra-content a {
  color: var(--ez-primary-600);
  text-decoration: none;
  font-weight: 500;
  border-bottom: 1px solid transparent;
  transition: all 0.2s ease;
}

.nextra-content a:hover {
  color: var(--ez-primary-700);
  border-bottom-color: var(--ez-primary-300);
}

/* Table styling */
.nextra-content table {
  width: 100%;
  border-collapse: collapse;
  margin: 1.5rem 0;
  border-radius: var(--ez-border-radius);
  overflow: hidden;
  box-shadow: var(--ez-shadow-sm);
}

.nextra-content th {
  background: var(--ez-gray-50);
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: var(--ez-gray-800);
  border-bottom: 1px solid var(--ez-gray-200);
}

.nextra-content td {
  padding: 1rem;
  border-bottom: 1px solid var(--ez-gray-100);
}

.nextra-content tr:last-child td {
  border-bottom: none;
}

/* Navigation improvements */
.nextra-nav-container {
  backdrop-filter: blur(20px);
  background: rgba(255, 255, 255, 0.8);
  border-bottom: 1px solid var(--ez-gray-200);
}

.nextra-sidebar {
  background: var(--ez-gray-50);
  border-right: 1px solid var(--ez-gray-200);
}

/* Card-like content sections */
.nextra-content > div {
  background: white;
  border-radius: var(--ez-border-radius);
  padding: 2rem;
  margin: 1rem 0;
  box-shadow: var(--ez-shadow-sm);
  border: 1px solid var(--ez-gray-100);
}

/* Feature cards for landing pages */
.ez-feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
}

.ez-feature-card {
  background: white;
  border: 1px solid var(--ez-gray-200);
  border-radius: var(--ez-border-radius);
  padding: 1.5rem;
  box-shadow: var(--ez-shadow-sm);
  transition: all 0.2s ease;
}

.ez-feature-card:hover {
  box-shadow: var(--ez-shadow);
  transform: translateY(-2px);
}

.ez-feature-card h3 {
  margin-top: 0;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.ez-feature-icon {
  font-size: 1.5rem;
}

/* Improved buttons and badges */
.ez-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  background: var(--ez-primary-100);
  color: var(--ez-primary-700);
}

.ez-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: var(--ez-primary-600);
  color: white;
  border-radius: var(--ez-border-radius-sm);
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s ease;
  box-shadow: var(--ez-shadow-sm);
}

.ez-button:hover {
  background: var(--ez-primary-700);
  box-shadow: var(--ez-shadow);
  transform: translateY(-1px);
}

/* Dark mode overrides */
.dark .nextra-content {
  color: var(--ez-gray-300);
}

.dark .nextra-content h1,
.dark .nextra-content h2,
.dark .nextra-content h3 {
  color: var(--ez-gray-100);
}

.dark .nextra-nav-container {
  background: rgba(17, 24, 39, 0.8);
  border-bottom-color: var(--ez-gray-800);
}

.dark .nextra-sidebar {
  background: var(--ez-gray-900);
  border-right-color: var(--ez-gray-800);
}

.dark .ez-feature-card {
  background: var(--ez-gray-800);
  border-color: var(--ez-gray-700);
}

/* Responsive improvements */
@media (max-width: 768px) {
  .nextra-content h1 {
    font-size: 2rem;
  }
  
  .nextra-content h2 {
    font-size: 1.5rem;
  }
  
  .ez-feature-grid {
    grid-template-columns: 1fr;
  }
}
`;
        fs.writeFileSync(join(outputDir, 'styles', 'globals.css'), css, 'utf8');
    }
    async generateNextConfig(outputDir) {
        const config = `const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
})

module.exports = withNextra({
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    newNextLinkBehavior: true
  }
})
`;
        fs.writeFileSync(join(outputDir, 'next.config.js'), config, 'utf8');
    }
    async generateAppJs(outputDir) {
        const appJs = `import '../styles/globals.css'

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />
}
`;
        fs.writeFileSync(join(outputDir, 'pages', '_app.js'), appJs, 'utf8');
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