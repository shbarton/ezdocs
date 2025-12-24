---
title: "Troubleshooting"
description: "Common issues and solutions when using EZ Docs"
date: 2024-01-01
tags: ["troubleshooting", "debugging", "help"]
author: "EZ Docs Team"
---

# Troubleshooting Guide

This guide covers common issues you might encounter when using EZ Docs and how to resolve them.

## Build Issues

### Build Fails with "Configuration file not found"

**Problem**: EZ Docs can't find your configuration file.

**Solution**:
1. Ensure `ezdocs.config.yml` exists in your project root
2. Check the file name (must be exactly `ezdocs.config.yml`)
3. Verify the YAML syntax is valid

```bash
# Check if config file exists
ls -la ezdocs.config.yml

# Validate YAML syntax
npx js-yaml ezdocs.config.yml
```

### Build Fails with YAML Parsing Error

**Problem**: Invalid YAML syntax in configuration or frontmatter.

**Symptoms**:
```
Error: Failed to load configuration: YAMLException
```

**Solution**:
1. Check indentation (use spaces, not tabs)
2. Ensure proper quoting for strings with special characters
3. Validate YAML syntax online or with a linter

```yaml
# ❌ Bad: Mixed tabs and spaces
collections:
	docs:
  pattern: "docs/**/*.md"

# ✅ Good: Consistent spacing
collections:
  docs:
    pattern: "docs/**/*.md"
```

### No Content Found

**Problem**: Build succeeds but no content is generated.

**Symptoms**:
- Empty `.ezdocs` directory
- "0 items processed" message

**Solution**:
1. Verify your glob patterns match your file structure
2. Check that files have `.md` or `.mdx` extensions
3. Ensure files are not in ignored directories

```yaml
# Debug: Use broader patterns temporarily
collections:
  docs:
    pattern: "**/*.md"  # Finds all .md files
```

## Content Issues

### Frontmatter Not Parsed

**Problem**: YAML frontmatter is displayed as content instead of being parsed.

**Symptoms**:
- YAML appears on the rendered page
- Metadata not available in navigation

**Solution**:
1. Ensure frontmatter is at the very beginning of the file
2. Use exactly three dashes (`---`) to delimit frontmatter
3. Check for invisible characters or encoding issues

```markdown
---
title: "My Title"
---

Content starts here...
```

### Images Not Displaying

**Problem**: Images referenced in Markdown don't appear in the generated site.

**Symptoms**:
- Broken image links
- 404 errors for image files

**Solution**:
1. Place images in the `public/` directory
2. Use relative paths from the public directory
3. Check image file names and extensions

```markdown
<!-- ❌ Bad: Wrong path -->
![Alt text](../images/screenshot.png)

<!-- ✅ Good: Relative to public directory -->
![Alt text](/images/screenshot.png)
```

### Incorrect Route Generation

**Problem**: Content appears at unexpected URLs.

**Solution**:
1. Check your route templates in the configuration
2. Verify frontmatter fields used in routes exist
3. Test with simple route patterns first

```yaml
# Simple route for debugging
collections:
  docs:
    pattern: "docs/**/*.md"
    route: "/{slug}"  # Simple pattern
```

## Development Server Issues

### Development Server Won't Start

**Problem**: `npm run dev` fails or hangs.

**Common Causes**:
1. Port already in use
2. Missing dependencies
3. Node.js version incompatibility

**Solutions**:

```bash
# Check if port is in use
lsof -i :3000

# Kill process using the port
kill -9 $(lsof -t -i:3000)

# Try different port
ezdocs-dev --port 3001

# Check Node.js version
node --version  # Should be 18.0.0 or higher

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### File Changes Not Reflected

**Problem**: Editing content files doesn't trigger rebuilds.

**Solution**:
1. Check file watching is enabled in config
2. Verify file paths are correct
3. Restart the development server

```yaml
# Ensure watching is enabled
dev:
  watch: true
  livereload: true
```

## Performance Issues

### Slow Build Times

**Problem**: Builds take too long to complete.

**Symptoms**:
- Build hangs on content processing
- Memory usage increases significantly

**Solutions**:
1. Reduce image sizes and optimize formats
2. Limit the number of files being processed
3. Use more specific glob patterns
4. Exclude unnecessary files

```yaml
content:
  ignore:
    - "**/node_modules/**"
    - "**/drafts/**"
    - "**/*.tmp"
    - "**/large-files/**"
```

### Memory Issues

**Problem**: Build process runs out of memory.

**Solution**:
1. Process files in smaller batches
2. Optimize large images before processing
3. Increase Node.js memory limit

```bash
# Increase memory limit
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

## Deployment Issues

### Site Not Loading After Deployment

**Problem**: Generated site doesn't work on hosting platform.

**Common Causes**:
1. Missing dependencies in production
2. Incorrect build output
3. Server configuration issues

**Solutions**:

```bash
# Ensure production build works locally
npm run build
cd .ezdocs
npm install
npm run build
npm run start
```

### Assets Not Loading

**Problem**: CSS, images, or other assets return 404 errors.

**Solution**:
1. Check base URL configuration
2. Verify asset paths are correct
3. Ensure assets are copied to output directory

```yaml
site:
  baseUrl: "https://yourdomain.com"  # Set correct base URL
```

## Getting Help

### Enable Debug Logging

Add debug information to troubleshoot issues:

```bash
# Enable verbose logging
DEBUG=ezdocs* npm run build

# Check file discovery
DEBUG=ezdocs:files npm run build

# Check content processing
DEBUG=ezdocs:content npm run build
```

### Common Debug Steps

1. **Start simple**: Use minimal configuration first
2. **Check one thing**: Change one setting at a time
3. **Verify basics**: Ensure files exist and have correct extensions
4. **Test incrementally**: Add content gradually
5. **Clear cache**: Remove `.ezdocs` directory and rebuild

### Report Issues

If you can't resolve an issue:

1. Check existing [GitHub issues](https://github.com/samuelcolvin/ezdocs/issues)
2. Create a minimal reproduction case
3. Include error messages and configuration
4. Specify your environment (Node.js version, OS, etc.)

### Community Support

- Join our Discord community
- Ask questions in GitHub Discussions
- Check the documentation website
- Browse example projects

Remember: Most issues are configuration-related. Double-check your `ezdocs.config.yml` and frontmatter syntax when troubleshooting.