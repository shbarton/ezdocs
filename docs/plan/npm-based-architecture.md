# Simplified CLI Approach - EZ Docs

## Overview

Instead of building a complex CLI tool, we use the standard npm ecosystem patterns:
- **Project Initialization**: `npm create ezdocs` (standard npm create pattern)
- **Project Commands**: Standard npm scripts (`npm run build`, `npm run dev`)
- **Simple Binaries**: Basic node scripts for core functionality

## User Experience

### Project Creation
```bash
npm create ezdocs my-docs
cd my-docs
npm run dev
```

### Standard npm Scripts
```json
{
  "scripts": {
    "build": "ezdocs-build",           # Build content + Nextra site
    "dev": "ezdocs-dev",              # Start Nextra dev server  
    "validate": "ezdocs-validate",     # Validate content
    "clean": "rimraf .ezdocs"         # Clean generated files
  }
}
```

## Implementation Details

### 1. Create-EZDocs Package
**Purpose**: Project initialization only
**Usage**: `npm create ezdocs my-project`

```
packages/create-ezdocs/
├── src/
│   ├── index.ts             # Main entry point
│   ├── prompts.ts           # Interactive setup
│   ├── generator.ts         # Project generation
│   └── templates.ts         # Template management
├── templates/               # Project templates
│   ├── basic/
│   ├── blog/
│   └── api/
└── package.json
```

**Key Features:**
- Interactive project setup (optional)
- Template selection
- Project generation
- Dependency installation
- Git initialization
- Success instructions

### 2. Core Package with Simple Binaries
**Purpose**: Content processing and Nextra integration
**Usage**: Via npm scripts in generated projects

```
packages/core/
├── src/                     # Core library code
│   ├── content/
│   ├── generators/
│   ├── config/
│   └── index.ts
├── bin/                     # Simple command scripts
│   ├── build.js             # ezdocs-build
│   ├── dev.js               # ezdocs-dev
│   └── validate.js          # ezdocs-validate
└── package.json
```

**Simple Binaries:**
```javascript
#!/usr/bin/env node
// bin/build.js
const { build } = require('../dist/index.js')

async function run() {
  try {
    await build()
    console.log('✅ Build completed')
  } catch (error) {
    console.error('❌ Build failed:', error.message)
    process.exit(1)
  }
}

run()
```

### 3. Generated Project Structure

```
my-docs/
├── content/                 # User content files
│   ├── docs/
│   │   ├── getting-started.md
│   │   └── advanced.md
│   └── guides/
│       └── best-practices.md
├── public/                  # Static assets
│   └── images/
├── .ezdocs/                # Generated Nextra site (gitignored)
├── ezdocs.config.yml       # EZ Docs configuration
├── package.json            # Standard npm project
├── next.config.js          # Nextra configuration
├── theme.config.jsx        # Nextra theme config
├── .gitignore
└── README.md
```

## Implementation Benefits

### 1. Simplicity
- **No custom CLI framework** - just npm create + npm scripts
- **Standard tooling** - developers know how to use it
- **Less complexity** - fewer moving parts to maintain

### 2. Familiar Patterns
- **npm create** - standard for project generators
- **npm scripts** - standard for project commands
- **Standard binaries** - simple node scripts

### 3. Reduced Maintenance
- **No complex CLI arg parsing** 
- **No custom help systems**
- **No command framework dependencies**
- **Simpler error handling**

### 4. Better Integration
- **Works with any package manager** (npm, yarn, pnpm)
- **Integrates with existing workflows**
- **Compatible with CI/CD systems**

## Command Details

### Build Command (`ezdocs-build`)
```javascript
#!/usr/bin/env node
const { ContentProcessor, NextraGenerator } = require('@ezdocs/core')

async function build() {
  // 1. Load configuration
  const config = await loadConfig()
  
  // 2. Process content
  const processor = new ContentProcessor(config)
  const index = await processor.process()
  
  // 3. Generate Nextra structure
  const generator = new NextraGenerator(config)
  await generator.generate(index)
  
  console.log(`✅ Built ${index.items.length} pages`)
}

build().catch(error => {
  console.error('❌ Build failed:', error.message)
  process.exit(1)
})
```

### Dev Command (`ezdocs-dev`)
```javascript
#!/usr/bin/env node
const { spawn } = require('child_process')
const chokidar = require('chokidar')
const { build } = require('@ezdocs/core')

async function dev() {
  // 1. Initial build
  await build()
  
  // 2. Watch content files
  const watcher = chokidar.watch('content/**/*.md')
  watcher.on('change', async () => {
    console.log('Content changed, rebuilding...')
    await build()
  })
  
  // 3. Start Nextra dev server
  const nextra = spawn('npx', ['next', 'dev', '-p', '3000'], {
    cwd: '.ezdocs',
    stdio: 'inherit'
  })
  
  // 4. Cleanup on exit
  process.on('SIGINT', () => {
    watcher.close()
    nextra.kill()
    process.exit(0)
  })
}

dev()
```

### Validate Command (`ezdocs-validate`)
```javascript
#!/usr/bin/env node
const { ContentValidator } = require('@ezdocs/core')

async function validate() {
  const validator = new ContentValidator()
  const results = await validator.validate()
  
  if (results.errors.length > 0) {
    console.error('❌ Validation failed:')
    results.errors.forEach(error => console.error(`  • ${error.message}`))
    process.exit(1)
  }
  
  if (results.warnings.length > 0) {
    console.warn('⚠️  Warnings:')
    results.warnings.forEach(warning => console.warn(`  • ${warning.message}`))
  }
  
  console.log('✅ Content validation passed')
}

validate()
```

## Package.json for Generated Projects

```json
{
  "name": "my-docs",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "build": "ezdocs-build && next build .ezdocs",
    "dev": "ezdocs-dev",
    "start": "next start .ezdocs",
    "validate": "ezdocs-validate",
    "clean": "rimraf .ezdocs"
  },
  "dependencies": {
    "@ezdocs/core": "^1.0.0",
    "nextra": "^2.13.0",
    "nextra-theme-docs": "^2.13.0",
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  },
  "devDependencies": {
    "chokidar": "^3.5.3",
    "rimraf": "^5.0.0"
  }
}
```

## Advantages Over Complex CLI

### Development Speed
- **Faster to implement** - no CLI framework needed
- **Easier to test** - standard npm scripts
- **Simpler debugging** - less abstraction layers

### User Experience  
- **Familiar commands** - developers know npm scripts
- **IDE integration** - npm scripts show up in IDE
- **Package manager agnostic** - works with npm/yarn/pnpm

### Maintenance
- **Fewer dependencies** - no CLI framework
- **Simpler codebase** - less complex error handling
- **Standard patterns** - easier for contributors

This approach gives us all the functionality we need with significantly less complexity and better alignment with standard npm ecosystem patterns.