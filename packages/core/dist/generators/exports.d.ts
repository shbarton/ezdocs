import { ContentIndex, EZDocsConfig } from '../content/types.js';
export declare class ExportsGenerator {
    private config;
    constructor(config: EZDocsConfig);
    generate(index: ContentIndex): Promise<void>;
    private generateJSONExport;
    private generateTypeScriptExport;
    private generateTypeDefinitions;
    private generateContentExport;
}
//# sourceMappingURL=exports.d.ts.map