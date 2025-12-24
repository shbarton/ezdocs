import { ContentIndex, EZDocsConfig } from '../content/types.js';
export declare class NextraGenerator {
    private config;
    constructor(config: EZDocsConfig);
    generate(index: ContentIndex): Promise<void>;
    private createDirectoryStructure;
    private generateMDXFiles;
    private generateMDXContent;
    private getMDXOutputPath;
    private generateMetaFiles;
    private groupItemsByPath;
    private generateMetaContent;
    private generateRootMeta;
    private getFileNameFromRoute;
    private generateThemeConfig;
    private generateNextConfig;
    private generatePackageJson;
}
//# sourceMappingURL=nextra.d.ts.map