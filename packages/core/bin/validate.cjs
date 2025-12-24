#!/usr/bin/env node

const { validate } = require('../dist/index.js')
const { program } = require('commander')

async function main() {
  program
    .name('ezdocs-validate')
    .description('Validate EZ Docs content and configuration')
    .option('-c, --config <path>', 'Path to configuration file')
    .action(async (options) => {
      const isValid = await validate(options.config)
      process.exit(isValid ? 0 : 1)
    })

  await program.parseAsync()
}

main().catch(console.error)