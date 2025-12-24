import { join, resolve } from 'path'
import { existsSync, ensureDirSync, copySync, writeFileSync, readFileSync } from 'fs-extra'
import { spawn } from 'child_process'
import chalk from 'chalk'
import { ProjectConfig, TemplateInfo } from './types'

// Get directory name for CommonJS
const currentDir = __dirname

export class ProjectGenerator {
  private templatesDir: string

  constructor() {
    this.templatesDir = join(currentDir, '..', 'templates')
  }

  async generateProject(config: ProjectConfig): Promise<void> {
    const projectPath = resolve(process.cwd(), config.directory)

    // Check if directory exists
    if (existsSync(projectPath)) {
      throw new Error(`Directory ${projectPath} already exists`)
    }

    console.log(chalk.blue('📁 Creating project directory...'))
    ensureDirSync(projectPath)

    console.log(chalk.blue('📋 Copying template files...'))
    await this.copyTemplate(config.template, projectPath)

    console.log(chalk.blue('⚙️  Configuring project...'))
    await this.configureProject(config, projectPath)

    console.log(chalk.green(`✅ Project created successfully at ${projectPath}`))
  }

  async installDependencies(projectPath: string): Promise<void> {
    console.log(chalk.blue('📦 Installing dependencies...'))
    
    return new Promise((resolve, reject) => {
      const npm = spawn('npm', ['install'], {
        cwd: projectPath,
        stdio: 'inherit',
      })

      npm.on('close', (code) => {
        if (code === 0) {
          console.log(chalk.green('✅ Dependencies installed successfully'))
          resolve()
        } else {
          reject(new Error(`npm install failed with code ${code}`))
        }
      })

      npm.on('error', (error) => {
        reject(error)
      })
    })
  }

  getTemplateInfo(): TemplateInfo[] {
    return [
      {
        name: 'basic',
        description: 'Basic documentation template with getting started guide',
        path: join(this.templatesDir, 'basic'),
      },
    ]
  }

  private async copyTemplate(template: string, projectPath: string): Promise<void> {
    const templatePath = join(this.templatesDir, template)
    
    if (!existsSync(templatePath)) {
      throw new Error(`Template ${template} not found`)
    }

    copySync(templatePath, projectPath)
  }

  private async configureProject(config: ProjectConfig, projectPath: string): Promise<void> {
    // Update package.json
    await this.updatePackageJson(config, projectPath)

    // Update EZ Docs config
    await this.updateEZDocsConfig(config, projectPath)

    // Update README
    await this.updateReadme(config, projectPath)
  }

  private async updatePackageJson(config: ProjectConfig, projectPath: string): Promise<void> {
    const packageJsonPath = join(projectPath, 'package.json')
    
    if (existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'))
      
      packageJson.name = config.name
      packageJson.description = config.description
      
      if (config.author) {
        packageJson.author = config.author
      }

      writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8')
    }
  }

  private async updateEZDocsConfig(config: ProjectConfig, projectPath: string): Promise<void> {
    const configPath = join(projectPath, 'ezdocs.config.yml')
    
    if (existsSync(configPath)) {
      let configContent = readFileSync(configPath, 'utf8')
      
      // Replace template placeholders
      configContent = configContent.replace(/{{PROJECT_NAME}}/g, config.name)
      configContent = configContent.replace(/{{PROJECT_DESCRIPTION}}/g, config.description)
      
      if (config.author) {
        configContent = configContent.replace(/{{AUTHOR_NAME}}/g, config.author)
      } else {
        // Remove author lines if no author provided
        configContent = configContent.replace(/.*{{AUTHOR_NAME}}.*/g, '')
      }

      writeFileSync(configPath, configContent, 'utf8')
    }
  }

  private async updateReadme(config: ProjectConfig, projectPath: string): Promise<void> {
    const readmePath = join(projectPath, 'README.md')
    
    if (existsSync(readmePath)) {
      let readmeContent = readFileSync(readmePath, 'utf8')
      
      readmeContent = readmeContent.replace(/{{PROJECT_NAME}}/g, config.name)
      readmeContent = readmeContent.replace(/{{PROJECT_DESCRIPTION}}/g, config.description)
      
      if (config.author) {
        readmeContent = readmeContent.replace(/{{AUTHOR_NAME}}/g, config.author)
      } else {
        readmeContent = readmeContent.replace(/.*{{AUTHOR_NAME}}.*/g, '')
      }

      writeFileSync(readmePath, readmeContent, 'utf8')
    }
  }
}