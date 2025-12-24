"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gatherProjectInfo = gatherProjectInfo;
exports.confirmProjectCreation = confirmProjectCreation;
const inquirer_1 = __importDefault(require("inquirer"));
const chalk_1 = __importDefault(require("chalk"));
const validate_npm_package_name_1 = __importDefault(require("validate-npm-package-name"));
async function gatherProjectInfo(projectName) {
    console.log(chalk_1.default.blue('🚀 Welcome to EZ Docs!'));
    console.log(chalk_1.default.gray('Let\'s set up your documentation project.\n'));
    const questions = [
        {
            type: 'input',
            name: 'name',
            message: 'What is the name of your project?',
            default: projectName || 'my-docs',
            validate: (input) => {
                if (!input.trim()) {
                    return 'Project name is required';
                }
                const validation = (0, validate_npm_package_name_1.default)(input);
                if (!validation.validForNewPackages) {
                    return validation.errors?.[0] || validation.warnings?.[0] || 'Invalid project name';
                }
                return true;
            },
            when: () => !projectName,
        },
        {
            type: 'input',
            name: 'description',
            message: 'Describe your documentation project:',
            default: 'Documentation site built with EZ Docs',
        },
        {
            type: 'list',
            name: 'template',
            message: 'Choose a template:',
            choices: [
                {
                    name: '📖 Basic Documentation - Simple docs with getting started guide',
                    value: 'basic',
                },
                {
                    name: '📰 Blog Style - Blog-like documentation with articles',
                    value: 'blog',
                },
                {
                    name: '🔌 API Reference - API documentation with endpoints and examples',
                    value: 'api',
                },
            ],
            default: 'basic',
        },
        {
            type: 'input',
            name: 'author',
            message: 'Author name (optional):',
            validate: (input) => {
                if (input.trim() && input.length < 2) {
                    return 'Author name must be at least 2 characters';
                }
                return true;
            },
        },
        {
            type: 'confirm',
            name: 'installDependencies',
            message: 'Install dependencies now?',
            default: true,
        },
    ];
    const answers = await inquirer_1.default.prompt(questions);
    // Use provided project name if available
    if (projectName) {
        answers.name = projectName;
    }
    return answers;
}
function confirmProjectCreation(projectPath) {
    return inquirer_1.default.prompt([
        {
            type: 'confirm',
            name: 'confirmed',
            message: `Create project at ${chalk_1.default.cyan(projectPath)}?`,
            default: true,
        },
    ]);
}
//# sourceMappingURL=prompts.js.map