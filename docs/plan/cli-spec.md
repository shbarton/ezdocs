# CLI Specification

EZ Docs uses simple binaries rather than a complex CLI framework.

## Commands

### `ezdocs-build`
Build content and generate Nextra output.

**Flags**
- `--config <path>`: path to `ezdocs.config.yml` (default: project root)
- `--out <path>`: override output directory (default: `.ezdocs`)
- `--verbose`: extra logging
- `--drafts`: include draft content

**Exit Codes**
- `0`: success
- `1`: build or validation error

### `ezdocs-dev`
Runs a dev loop: build on change + Nextra dev server.

**Flags**
- `--port <port>`: dev server port (default: 3000)
- `--config <path>`: config path
- `--watch`: enable file watcher (default: true)

### `ezdocs-validate`
Validate config and content without generating output.

**Flags**
- `--config <path>`: config path
- `--strict`: treat warnings as errors

## Logging
- Standard levels: info, warn, error.
- Provide file paths for validation errors.
- Provide a summary at the end of build (pages generated, duration).

## Environment Variables
- `EZDOCS_CONFIG`: default config path.
- `EZDOCS_ENV`: `development` or `production`.
