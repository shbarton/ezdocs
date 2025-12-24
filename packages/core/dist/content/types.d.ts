export interface ContentItem {
    id: string;
    collection: string;
    sourcePath: string;
    slug: string;
    route: string;
    title: string;
    description?: string;
    summary?: string;
    date?: string;
    lastModified: string;
    draft: boolean;
    featured: boolean;
    tags: string[];
    categories: string[];
    author?: Author;
    order?: number;
    parent?: string;
    children: string[];
    frontmatter: Record<string, any>;
    body: string;
    excerpt?: string;
    readingTimeMinutes: number;
    wordCount: number;
    images: ImageAsset[];
    videos: VideoAsset[];
    downloads: FileAsset[];
    seo?: SEOMetadata;
}
export interface Author {
    name: string;
    email?: string;
    bio?: string;
    avatar?: string;
    social?: Record<string, string>;
}
export interface ImageAsset {
    originalPath: string;
    publicPath: string;
    filename: string;
    alt?: string;
    caption?: string;
    width: number;
    height: number;
    sizes: ImageSize[];
    format: string;
    size: number;
}
export interface ImageSize {
    width: number;
    height: number;
    path: string;
    format: string;
    size: number;
}
export interface VideoAsset {
    originalPath: string;
    publicPath: string;
    filename: string;
    duration?: number;
    width: number;
    height: number;
    format: string;
    size: number;
}
export interface FileAsset {
    originalPath: string;
    publicPath: string;
    filename: string;
    type: string;
    size: number;
}
export interface SEOMetadata {
    title?: string;
    description?: string;
    keywords?: string[];
    ogImage?: string;
    twitterCard?: 'summary' | 'summary_large_image';
}
export interface CollectionConfig {
    pattern: string;
    route: string;
    sort?: SortConfig;
    nextra?: NextraConfig;
    validation?: ValidationConfig;
}
export interface SortConfig {
    by: string;
    order: 'asc' | 'desc';
    fallback?: string;
}
export interface NextraConfig {
    sidebar: boolean;
    searchable: boolean;
    breadcrumbs: boolean;
    toc: boolean;
    editLink: boolean;
    feedback: boolean;
    navigation: boolean;
}
export interface ValidationConfig {
    required?: string[];
    dateFormat?: string;
    slugPattern?: string;
}
export interface ContentIndex {
    items: ContentItem[];
    collections: Record<string, ContentItem[]>;
    routes: Record<string, ContentItem>;
    metadata: {
        totalItems: number;
        totalCollections: number;
        lastBuild: string;
        version: string;
    };
}
export interface EZDocsConfig {
    version: string;
    name: string;
    description?: string;
    content: {
        source: string;
        ignore: string[];
    };
    collections: Record<string, CollectionConfig>;
    site: {
        title: string;
        description: string;
        baseUrl?: string;
        logo?: string;
    };
    output: {
        nextra: {
            directory: string;
            theme: 'docs' | 'blog';
            config?: Record<string, any>;
        };
        exports?: Array<{
            type: 'json' | 'typescript';
            path: string;
        }>;
    };
    images?: {
        formats: string[];
        sizes: number[];
        quality: number;
    };
    dev?: {
        port: number;
        watch: boolean;
        livereload: boolean;
    };
}
//# sourceMappingURL=types.d.ts.map