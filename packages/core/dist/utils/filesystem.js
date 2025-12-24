import { readFileSync, statSync, existsSync } from 'fs';
import { resolve, join, dirname, basename, extname } from 'path';
import glob from 'fast-glob';
import { createHash } from 'crypto';
export async function discoverFiles(pattern, baseDir, ignore = []) {
    const files = await glob(pattern, {
        cwd: baseDir,
        absolute: true,
        ignore,
    });
    return files.filter((file) => file.endsWith('.md') || file.endsWith('.mdx'));
}
export function readFile(filePath) {
    try {
        return readFileSync(filePath, 'utf8');
    }
    catch (error) {
        throw new Error(`Failed to read file ${filePath}: ${error}`);
    }
}
export function getFileStats(filePath) {
    try {
        const stats = statSync(filePath);
        return {
            size: stats.size,
            modified: stats.mtime.toISOString(),
            created: stats.birthtime.toISOString(),
        };
    }
    catch (error) {
        throw new Error(`Failed to get file stats for ${filePath}: ${error}`);
    }
}
export function generateId(sourcePath) {
    const hash = createHash('sha256');
    hash.update(sourcePath);
    return hash.digest('hex').substring(0, 16);
}
export function resolvePath(path, basePath) {
    if (basePath) {
        return resolve(basePath, path);
    }
    return resolve(path);
}
export function fileExists(path) {
    return existsSync(path);
}
export function getRelativePath(from, to) {
    const fromDir = dirname(from);
    const relativePath = join(fromDir, to);
    return relativePath;
}
export function parseFileName(filePath) {
    return {
        name: basename(filePath, extname(filePath)),
        ext: extname(filePath),
        dir: dirname(filePath),
    };
}
//# sourceMappingURL=filesystem.js.map