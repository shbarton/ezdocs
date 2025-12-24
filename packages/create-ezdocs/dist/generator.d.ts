import { ProjectConfig, TemplateInfo } from './types';
export declare class ProjectGenerator {
    private templatesDir;
    constructor();
    generateProject(config: ProjectConfig): Promise<void>;
    installDependencies(projectPath: string): Promise<void>;
    getTemplateInfo(): TemplateInfo[];
    private copyTemplate;
    private configureProject;
    private updatePackageJson;
    private updateEZDocsConfig;
    private updateReadme;
}
//# sourceMappingURL=generator.d.ts.map