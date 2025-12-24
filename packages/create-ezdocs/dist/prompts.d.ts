import { ProjectAnswers } from './types';
export declare function gatherProjectInfo(projectName?: string): Promise<ProjectAnswers>;
export declare function confirmProjectCreation(projectPath: string): Promise<{
    confirmed: boolean;
}>;
//# sourceMappingURL=prompts.d.ts.map