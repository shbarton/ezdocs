export declare function discoverFiles(pattern: string, baseDir: string, ignore?: string[]): Promise<string[]>;
export declare function readFile(filePath: string): string;
export declare function getFileStats(filePath: string): {
    size: number;
    modified: string;
    created: string;
};
export declare function generateId(sourcePath: string): string;
export declare function resolvePath(path: string, basePath?: string): string;
export declare function fileExists(path: string): boolean;
export declare function getRelativePath(from: string, to: string): string;
export declare function parseFileName(filePath: string): {
    name: string;
    ext: string;
    dir: string;
};
//# sourceMappingURL=filesystem.d.ts.map