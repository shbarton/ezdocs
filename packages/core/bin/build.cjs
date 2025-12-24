#!/usr/bin/env node

const { build } = require('../dist/index.js')
const { program } = require('commander')

async function main() {
  program
    .name('ezdocs-build')
    .description('Build EZ Docs content into Nextra structure')
    .option('-c, --config <path>', 'Path to configuration file')
    .action(async (options) => {
      await build(options.config)
    })

  await program.parseAsync()
}

main().catch(console.error)