#!/usr/bin/env node

const { build, loadConfig } = require('../dist/index.js')
const { program } = require('commander')
const { spawn } = require('child_process')
const { watch } = require('chokidar')
const { join } = require('path')

async function main() {
  program
    .name('ezdocs-dev')
    .description('Start EZ Docs development server with file watching')
    .option('-c, --config <path>', 'Path to configuration file')
    .option('-p, --port <number>', 'Port for development server', '3000')
    .action(async (options) => {
    try {
      // Load config to get output directory
      const config = await loadConfig(options.config)
      const outputDir = config.output.nextra.directory

      // Initial build
      console.log('🏗️  Initial build...')
      await build(options.config)

      // Start Next.js dev server
      console.log('🚀 Starting development server...')
      const nextProcess = spawn('npm', ['run', 'dev'], {
        cwd: outputDir,
        stdio: 'inherit',
        env: { ...process.env, PORT: options.port }
      })

      // Watch for content changes
      const contentDir = config.content.source
      console.log(`👀 Watching for changes in ${contentDir}...`)
      
      const watcher = watch([
        join(contentDir, '**/*.md'),
        join(contentDir, '**/*.mdx'),
        'ezdocs.config.yml'
      ], {
        ignored: config.content.ignore
      })

      let isBuilding = false
      watcher.on('change', async (path) => {
        if (isBuilding) return
        
        isBuilding = true
        console.log(`📝 Content changed: ${path}`)
        console.log('🔄 Rebuilding...')
        
        try {
          await build(options.config)
          console.log('✅ Rebuild completed')
        } catch (error) {
          console.error('❌ Rebuild failed:', error)
        }
        
        isBuilding = false
      })

      // Handle process termination
      const cleanup = () => {
        console.log('🛑 Shutting down...')
        watcher.close()
        nextProcess.kill()
        process.exit(0)
      }

      process.on('SIGINT', cleanup)
      process.on('SIGTERM', cleanup)

    } catch (error) {
      console.error('❌ Development server failed to start:', error)
      process.exit(1)
    }
  })

  await program.parseAsync()
}

main().catch(console.error)