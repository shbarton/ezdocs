# Quality Plan

## Test Types
- Unit tests: parsing, slugging, routing, sorting.
- Integration tests: full pipeline build with fixtures.
- Template tests: generated project builds and runs.
- Regression tests: previously fixed bugs.

## Core Fixtures
- Minimal content set with basic frontmatter.
- Large content set to validate performance.
- Edge cases: duplicate slugs, missing title, invalid date.

## Automation
- `npm test` runs core unit and integration tests.
- `npm run lint` for TypeScript and formatting.
- CI runs tests on macOS, Linux, Windows.

## Performance Targets
- <5s build for 200 pages.
- <20s build for 1000 pages.

## Manual QA Checklist
- Create new project using `npm create ezdocs`.
- Run `npm run dev` and confirm docs render.
- Edit a markdown file and confirm refresh.
- Build and verify `_meta.json` ordering.

## Release Gate
- All tests passing.
- Example templates build successfully.
- Docs updated for any breaking changes.
