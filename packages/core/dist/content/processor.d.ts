import { ContentIndex, EZDocsConfig } from './types.js';
export declare class ContentProcessor {
    private config;
    constructor(config: EZDocsConfig);
    process(): Promise<ContentIndex>;
    private discoverFiles;
    private parseContent;
    private buildRelationships;
    private createIndex;
    private sortCollection;
}
//# sourceMappingURL=processor.d.ts.map