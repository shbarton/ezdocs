import { ProjectGenerator } from '../src/generator'
import { ProjectConfig } from '../src/types'
import { join } from 'path'
import { existsSync, readFileSync, rmSync, mkdirSync } from 'fs'
import { tmpdir } from 'os'

describe('ProjectGenerator', () => {
  let generator: ProjectGenerator
  let testDir: string

  beforeEach(() => {
    generator = new ProjectGenerator()
    testDir = join(tmpdir(), `ezdocs-gen-test-${Date.now()}`)
    mkdirSync(testDir, { recursive: true })
  })

  afterEach(() => {
    if (existsSync(testDir)) {
      rmSync(testDir, { recursive: true, force: true })
    }
  })

  describe('generateProject', () => {
    it('should create project directory', async () => {
      const config: ProjectConfig = {
        name: 'test-docs',
        description: 'Test documentation',
        template: 'basic',
        directory: join(testDir, 'test-docs'),
        author: 'Test Author',
      }

      await generator.generateProject(config)

      expect(existsSync(config.directory)).toBe(true)
    })

    it('should copy template files', async () => {
      const config: ProjectConfig = {
        name: 'test-docs',
        description: 'Test documentation',
        template: 'basic',
        directory: join(testDir, 'test-docs'),
        author: 'Test Author',
      }

      await generator.generateProject(config)

      // Check that essential template files exist
      expect(existsSync(join(config.directory, 'package.json'))).toBe(true)
      expect(existsSync(join(config.directory, 'ezdocs.config.yml'))).toBe(true)
      expect(existsSync(join(config.directory, 'README.md'))).toBe(true)
      expect(existsSync(join(config.directory, 'content'))).toBe(true)
    })

    it('should update package.json with project name', async () => {
      const config: ProjectConfig = {
        name: 'my-awesome-docs',
        description: 'My awesome documentation',
        template: 'basic',
        directory: join(testDir, 'test-docs'),
        author: 'John Doe',
      }

      await generator.generateProject(config)

      const packageJsonPath = join(config.directory, 'package.json')
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'))

      expect(packageJson.name).toBe('my-awesome-docs')
      expect(packageJson.description).toBe('My awesome documentation')
      expect(packageJson.author).toBe('John Doe')
    })

    it('should replace placeholders in ezdocs.config.yml', async () => {
      const config: ProjectConfig = {
        name: 'my-docs',
        description: 'My documentation site',
        template: 'basic',
        directory: join(testDir, 'test-docs'),
      }

      await generator.generateProject(config)

      const configPath = join(config.directory, 'ezdocs.config.yml')
      const configContent = readFileSync(configPath, 'utf8')

      expect(configContent).toContain('my-docs')
      expect(configContent).toContain('My documentation site')
      expect(configContent).not.toContain('{{PROJECT_NAME}}')
      expect(configContent).not.toContain('{{PROJECT_DESCRIPTION}}')
    })

    it('should replace placeholders in README.md', async () => {
      const config: ProjectConfig = {
        name: 'test-project',
        description: 'Test project description',
        template: 'basic',
        directory: join(testDir, 'test-docs'),
      }

      await generator.generateProject(config)

      const readmePath = join(config.directory, 'README.md')
      const readmeContent = readFileSync(readmePath, 'utf8')

      expect(readmeContent).toContain('test-project')
      expect(readmeContent).toContain('Test project description')
      expect(readmeContent).not.toContain('{{PROJECT_NAME}}')
      expect(readmeContent).not.toContain('{{PROJECT_DESCRIPTION}}')
    })

    it('should throw error if directory already exists', async () => {
      const config: ProjectConfig = {
        name: 'test-docs',
        description: 'Test documentation',
        template: 'basic',
        directory: join(testDir, 'existing'),
      }

      // Create directory first
      mkdirSync(config.directory, { recursive: true })

      await expect(generator.generateProject(config)).rejects.toThrow(
        /already exists/
      )
    })

    it('should throw error if template does not exist', async () => {
      const config: ProjectConfig = {
        name: 'test-docs',
        description: 'Test documentation',
        template: 'nonexistent-template',
        directory: join(testDir, 'test-docs'),
      }

      await expect(generator.generateProject(config)).rejects.toThrow(
        /not found/
      )
    })

    it('should handle project without author', async () => {
      const config: ProjectConfig = {
        name: 'test-docs',
        description: 'Test documentation',
        template: 'basic',
        directory: join(testDir, 'test-docs'),
      }

      await generator.generateProject(config)

      const packageJsonPath = join(config.directory, 'package.json')
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'))

      // Author field should not be added if not provided
      expect(packageJson.author).toBeUndefined()
    })

    it('should create content directory structure', async () => {
      const config: ProjectConfig = {
        name: 'test-docs',
        description: 'Test documentation',
        template: 'basic',
        directory: join(testDir, 'test-docs'),
      }

      await generator.generateProject(config)

      // Check content directories exist
      expect(existsSync(join(config.directory, 'content'))).toBe(true)
      expect(existsSync(join(config.directory, 'content', 'docs'))).toBe(true)
      expect(existsSync(join(config.directory, 'content', 'guides'))).toBe(true)
    })

    it('should create sample markdown files', async () => {
      const config: ProjectConfig = {
        name: 'test-docs',
        description: 'Test documentation',
        template: 'basic',
        directory: join(testDir, 'test-docs'),
      }

      await generator.generateProject(config)

      // Check sample files exist
      const docsDir = join(config.directory, 'content', 'docs')
      const guidesDir = join(config.directory, 'content', 'guides')

      const docFiles = require('fs').readdirSync(docsDir)
      const guideFiles = require('fs').readdirSync(guidesDir)

      expect(docFiles.length).toBeGreaterThan(0)
      expect(guideFiles.length).toBeGreaterThan(0)

      // Check that files are markdown
      expect(docFiles.some((f: string) => f.endsWith('.md'))).toBe(true)
      expect(guideFiles.some((f: string) => f.endsWith('.md'))).toBe(true)
    })

    it('should create .gitignore file', async () => {
      const config: ProjectConfig = {
        name: 'test-docs',
        description: 'Test documentation',
        template: 'basic',
        directory: join(testDir, 'test-docs'),
      }

      await generator.generateProject(config)

      const gitignorePath = join(config.directory, '.gitignore')
      expect(existsSync(gitignorePath)).toBe(true)

      const gitignoreContent = readFileSync(gitignorePath, 'utf8')
      expect(gitignoreContent).toContain('node_modules')
      expect(gitignoreContent).toContain('.ezdocs')
    })
  })

  describe('getTemplateInfo', () => {
    it('should return available templates', () => {
      const templates = generator.getTemplateInfo()

      expect(templates).toBeDefined()
      expect(Array.isArray(templates)).toBe(true)
      expect(templates.length).toBeGreaterThan(0)
    })

    it('should include basic template', () => {
      const templates = generator.getTemplateInfo()

      const basicTemplate = templates.find(t => t.name === 'basic')
      expect(basicTemplate).toBeDefined()
      expect(basicTemplate!.description).toBeDefined()
      expect(basicTemplate!.path).toBeDefined()
    })

    it('should return templates with valid paths', () => {
      const templates = generator.getTemplateInfo()

      for (const template of templates) {
        expect(existsSync(template.path)).toBe(true)
      }
    })
  })

  describe('installDependencies', () => {
    it('should be defined', () => {
      expect(generator.installDependencies).toBeDefined()
      expect(typeof generator.installDependencies).toBe('function')
    })

    // Note: We won't actually test npm install in unit tests
    // as it's slow and requires network. This would be better
    // suited for an E2E test or manual testing.
  })

  describe('template validation', () => {
    it('should ensure basic template has required files', () => {
      const templates = generator.getTemplateInfo()
      const basicTemplate = templates.find(t => t.name === 'basic')

      expect(basicTemplate).toBeDefined()

      const requiredFiles = [
        'package.json',
        'ezdocs.config.yml',
        'README.md',
        '.gitignore',
      ]

      for (const file of requiredFiles) {
        const filePath = join(basicTemplate!.path, file)
        expect(existsSync(filePath)).toBe(true)
      }
    })

    it('should ensure basic template has content directory', () => {
      const templates = generator.getTemplateInfo()
      const basicTemplate = templates.find(t => t.name === 'basic')

      const contentPath = join(basicTemplate!.path, 'content')
      expect(existsSync(contentPath)).toBe(true)
    })

    it('should ensure ezdocs.config.yml has placeholders', () => {
      const templates = generator.getTemplateInfo()
      const basicTemplate = templates.find(t => t.name === 'basic')

      const configPath = join(basicTemplate!.path, 'ezdocs.config.yml')
      const configContent = readFileSync(configPath, 'utf8')

      expect(configContent).toContain('{{PROJECT_NAME}}')
      expect(configContent).toContain('{{PROJECT_DESCRIPTION}}')
    })

    it('should ensure package.json has placeholders', () => {
      const templates = generator.getTemplateInfo()
      const basicTemplate = templates.find(t => t.name === 'basic')

      const packageJsonPath = join(basicTemplate!.path, 'package.json')
      const packageJsonContent = readFileSync(packageJsonPath, 'utf8')

      expect(packageJsonContent).toContain('{{PROJECT_NAME}}')
      expect(packageJsonContent).toContain('{{PROJECT_DESCRIPTION}}')
    })
  })
})
