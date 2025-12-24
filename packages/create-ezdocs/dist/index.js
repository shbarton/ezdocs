#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const path_1 = require("path");
const chalk_1 = __importDefault(require("chalk"));
const prompts_1 = require("./prompts");
const generator_1 = require("./generator");
async function createProject(projectName) {
    try {
        console.log(chalk_1.default.bold.blue('🚀 EZ Docs Project Generator\n'));
        // Gather project information
        const answers = await (0, prompts_1.gatherProjectInfo)(projectName);
        const config = {
            name: answers.name,
            description: answers.description,
            template: answers.template,
            directory: answers.name,
            author: answers.author,
        };
        const projectPath = (0, path_1.resolve)(process.cwd(), config.directory);
        // Confirm project creation
        const { confirmed } = await (0, prompts_1.confirmProjectCreation)(projectPath);
        if (!confirmed) {
            console.log(chalk_1.default.yellow('⏸️  Project creation cancelled'));
            return;
        }
        // Generate project
        const generator = new generator_1.ProjectGenerator();
        await generator.generateProject(config);
        // Install dependencies if requested
        if (answers.installDependencies) {
            await generator.installDependencies(projectPath);
        }
        // Success message with next steps
        console.log(chalk_1.default.green('\n🎉 Project created successfully!\n'));
        console.log(chalk_1.default.bold('Next steps:'));
        console.log(chalk_1.default.gray(`  cd ${config.name}`));
        if (!answers.installDependencies) {
            console.log(chalk_1.default.gray('  npm install'));
        }
        console.log(chalk_1.default.gray('  npm run build  # Build your documentation'));
        console.log(chalk_1.default.gray('  npm run dev    # Start development server'));
        console.log('');
        console.log(chalk_1.default.blue('📖 Edit content in the content/ directory'));
        console.log(chalk_1.default.blue('⚙️  Configure your site in ezdocs.config.yml'));
        console.log('');
        console.log(chalk_1.default.gray('Happy documenting! 📝'));
    }
    catch (error) {
        console.error(chalk_1.default.red('❌ Error creating project:'), error);
        process.exit(1);
    }
}
// CLI program setup
commander_1.program
    .name('create-ezdocs')
    .description('Create a new EZ Docs documentation project')
    .version('0.1.0')
    .argument('[project-name]', 'Name of the project to create')
    .action(createProject);
// Show help if no arguments provided
if (process.argv.length === 2) {
    commander_1.program.help();
}
commander_1.program.parse();
//# sourceMappingURL=index.js.map