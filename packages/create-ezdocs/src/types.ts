export interface ProjectConfig {
  name: string
  description: string
  template: TemplateType
  directory: string
  author?: string
  license?: string
}

export type TemplateType = 'basic' | 'blog' | 'api'

export interface TemplateInfo {
  name: string
  description: string
  path: string
}

export interface ProjectAnswers {
  name: string
  description: string
  template: TemplateType
  author?: string
  installDependencies: boolean
}