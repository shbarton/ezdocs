import inquirer from 'inquirer'
import chalk from 'chalk'
import validateNpmName from 'validate-npm-package-name'
import { ProjectAnswers, TemplateType } from './types'

export async function gatherProjectInfo(projectName?: string): Promise<ProjectAnswers> {
  console.log(chalk.blue('🚀 Welcome to EZ Docs!'))
  console.log(chalk.gray('Let\'s set up your documentation project.\n'))

  const questions: any[] = [
    {
      type: 'input',
      name: 'name',
      message: 'What is the name of your project?',
      default: projectName || 'my-docs',
      validate: (input: string) => {
        if (!input.trim()) {
          return 'Project name is required'
        }
        
        const validation = validateNpmName(input)
        if (!validation.validForNewPackages) {
          return validation.errors?.[0] || validation.warnings?.[0] || 'Invalid project name'
        }
        
        return true
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
          value: 'basic' as TemplateType,
        },
        {
          name: '📰 Blog Style - Blog-like documentation with articles',
          value: 'blog' as TemplateType,
        },
        {
          name: '🔌 API Reference - API documentation with endpoints and examples',
          value: 'api' as TemplateType,
        },
      ],
      default: 'basic',
    },
    {
      type: 'input',
      name: 'author',
      message: 'Author name (optional):',
      validate: (input: string) => {
        if (input.trim() && input.length < 2) {
          return 'Author name must be at least 2 characters'
        }
        return true
      },
    },
    {
      type: 'confirm',
      name: 'installDependencies',
      message: 'Install dependencies now?',
      default: true,
    },
  ]

  const answers = await inquirer.prompt(questions) as ProjectAnswers
  
  // Use provided project name if available
  if (projectName) {
    answers.name = projectName
  }

  return answers
}

export function confirmProjectCreation(projectPath: string): Promise<{ confirmed: boolean }> {
  return inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirmed',
      message: `Create project at ${chalk.cyan(projectPath)}?`,
      default: true,
    },
  ])
}