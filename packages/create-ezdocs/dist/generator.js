"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectGenerator = void 0;
const path_1 = require("path");
const fs_extra_1 = require("fs-extra");
const child_process_1 = require("child_process");
const chalk_1 = __importDefault(require("chalk"));
// Get directory name for CommonJS
const currentDir = __dirname;
class ProjectGenerator {
    constructor() {
        this.templatesDir = (0, path_1.join)(currentDir, '..', 'templates');
    }
    async generateProject(config) {
        const projectPath = (0, path_1.resolve)(process.cwd(), config.directory);
        // Check if directory exists
        if ((0, fs_extra_1.existsSync)(projectPath)) {
            throw new Error(`Directory ${projectPath} already exists`);
        }
        console.log(chalk_1.default.blue('📁 Creating project directory...'));
        (0, fs_extra_1.ensureDirSync)(projectPath);
        console.log(chalk_1.default.blue('📋 Copying template files...'));
        await this.copyTemplate(config.template, projectPath);
        console.log(chalk_1.default.blue('⚙️  Configuring project...'));
        await this.configureProject(config, projectPath);
        console.log(chalk_1.default.green(`✅ Project created successfully at ${projectPath}`));
    }
    async installDependencies(projectPath) {
        console.log(chalk_1.default.blue('📦 Installing dependencies...'));
        return new Promise((resolve, reject) => {
            const npm = (0, child_process_1.spawn)('npm', ['install'], {
                cwd: projectPath,
                stdio: 'inherit',
            });
            npm.on('close', (code) => {
                if (code === 0) {
                    console.log(chalk_1.default.green('✅ Dependencies installed successfully'));
                    resolve();
                }
                else {
                    reject(new Error(`npm install failed with code ${code}`));
                }
            });
            npm.on('error', (error) => {
                reject(error);
            });
        });
    }
    getTemplateInfo() {
        return [
            {
                name: 'basic',
                description: 'Basic documentation template with getting started guide',
                path: (0, path_1.join)(this.templatesDir, 'basic'),
            },
        ];
    }
    async copyTemplate(template, projectPath) {
        const templatePath = (0, path_1.join)(this.templatesDir, template);
        if (!(0, fs_extra_1.existsSync)(templatePath)) {
            throw new Error(`Template ${template} not found`);
        }
        (0, fs_extra_1.copySync)(templatePath, projectPath);
    }
    async configureProject(config, projectPath) {
        // Update package.json
        await this.updatePackageJson(config, projectPath);
        // Update EZ Docs config
        await this.updateEZDocsConfig(config, projectPath);
        // Update README
        await this.updateReadme(config, projectPath);
    }
    async updatePackageJson(config, projectPath) {
        const packageJsonPath = (0, path_1.join)(projectPath, 'package.json');
        if ((0, fs_extra_1.existsSync)(packageJsonPath)) {
            const packageJson = JSON.parse((0, fs_extra_1.readFileSync)(packageJsonPath, 'utf8'));
            packageJson.name = config.name;
            packageJson.description = config.description;
            if (config.author) {
                packageJson.author = config.author;
            }
            (0, fs_extra_1.writeFileSync)(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8');
        }
    }
    async updateEZDocsConfig(config, projectPath) {
        const configPath = (0, path_1.join)(projectPath, 'ezdocs.config.yml');
        if ((0, fs_extra_1.existsSync)(configPath)) {
            let configContent = (0, fs_extra_1.readFileSync)(configPath, 'utf8');
            // Replace template placeholders
            configContent = configContent.replace(/{{PROJECT_NAME}}/g, config.name);
            configContent = configContent.replace(/{{PROJECT_DESCRIPTION}}/g, config.description);
            if (config.author) {
                configContent = configContent.replace(/{{AUTHOR_NAME}}/g, config.author);
            }
            else {
                // Remove author lines if no author provided
                configContent = configContent.replace(/.*{{AUTHOR_NAME}}.*/g, '');
            }
            (0, fs_extra_1.writeFileSync)(configPath, configContent, 'utf8');
        }
    }
    async updateReadme(config, projectPath) {
        const readmePath = (0, path_1.join)(projectPath, 'README.md');
        if ((0, fs_extra_1.existsSync)(readmePath)) {
            let readmeContent = (0, fs_extra_1.readFileSync)(readmePath, 'utf8');
            readmeContent = readmeContent.replace(/{{PROJECT_NAME}}/g, config.name);
            readmeContent = readmeContent.replace(/{{PROJECT_DESCRIPTION}}/g, config.description);
            if (config.author) {
                readmeContent = readmeContent.replace(/{{AUTHOR_NAME}}/g, config.author);
            }
            else {
                readmeContent = readmeContent.replace(/.*{{AUTHOR_NAME}}.*/g, '');
            }
            (0, fs_extra_1.writeFileSync)(readmePath, readmeContent, 'utf8');
        }
    }
}
exports.ProjectGenerator = ProjectGenerator;
//# sourceMappingURL=generator.js.map