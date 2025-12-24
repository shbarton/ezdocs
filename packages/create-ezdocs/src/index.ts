#!/usr/bin/env node

import { program } from 'commander'
import { resolve } from 'path'
import chalk from 'chalk'
import { gatherProjectInfo, confirmProjectCreation } from './prompts'
import { ProjectGenerator } from './generator'
import { ProjectConfig } from './types'

async function createProject(projectName?: string) {
  try {
    console.log(chalk.bold.blue('🚀 EZ Docs Project Generator\n'))

    // Gather project information
    const answers = await gatherProjectInfo(projectName)
    
    const config: ProjectConfig = {
      name: answers.name,
      description: answers.description,
      template: answers.template,
      directory: answers.name,
      author: answers.author,
    }

    const projectPath = resolve(process.cwd(), config.directory)
    
    // Confirm project creation
    const { confirmed } = await confirmProjectCreation(projectPath)
    if (!confirmed) {
      console.log(chalk.yellow('⏸️  Project creation cancelled'))
      return
    }

    // Generate project
    const generator = new ProjectGenerator()
    await generator.generateProject(config)

    // Install dependencies if requested
    if (answers.installDependencies) {
      await generator.installDependencies(projectPath)
    }

    // Success message with next steps
    console.log(chalk.green('\n🎉 Project created successfully!\n'))
    console.log(chalk.bold('Next steps:'))
    console.log(chalk.gray(`  cd ${config.name}`))
    
    if (!answers.installDependencies) {
      console.log(chalk.gray('  npm install'))
    }
    
    console.log(chalk.gray('  npm run build  # Build your documentation'))
    console.log(chalk.gray('  npm run dev    # Start development server'))
    console.log('')
    console.log(chalk.blue('📖 Edit content in the content/ directory'))
    console.log(chalk.blue('⚙️  Configure your site in ezdocs.config.yml'))
    console.log('')
    console.log(chalk.gray('Happy documenting! 📝'))

  } catch (error) {
    console.error(chalk.red('❌ Error creating project:'), error)
    process.exit(1)
  }
}

// CLI program setup
program
  .name('create-ezdocs')
  .description('Create a new EZ Docs documentation project')
  .version('0.1.0')
  .argument('[project-name]', 'Name of the project to create')
  .action(createProject)

// Show help if no arguments provided
if (process.argv.length === 2) {
  program.help()
}

program.parse()