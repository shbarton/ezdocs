# EZ Docs Product Brief

## Summary
EZ Docs is a reusable documentation generator that lets authors write Markdown with YAML frontmatter while publishing polished Nextra sites. It targets developers who want fast docs setup, predictable outputs, and content that is portable across tools.

## Problem
- Existing doc systems either lock content into a framework or require heavy manual setup.
- Authors want Markdown-first workflows (IDE, Obsidian) without losing metadata or navigation.
- Teams need a repeatable, fast way to ship good-looking docs for multiple projects.

## Target Audience
- Indie developers and OSS maintainers shipping docs for multiple repos.
- Small teams and agencies that need consistent docs setups for clients.
- Product teams who want a docs pipeline with minimal customization.

## Jobs To Be Done (JTBD)
- "When I start a new project, I want docs online fast without relearning a new system."
- "When content changes, I want clean diffs and portable files that outlive my framework."
- "When I publish, I want a professional docs site with minimal configuration."

## Value Proposition
- Content-first authoring with durable Markdown + YAML.
- Consistent Nextra output with automatic navigation and metadata.
- Reusable templates and a standard config that works across projects.
- A single command workflow for build and dev.

## Differentiators
- Obsidian-friendly authoring flow.
- Config-driven collections and routing without bespoke Next.js setup.
- Built-in content indexing and typed exports.
- Opinionated defaults with escape hatches for advanced users.

## Product Principles
- Content is the source of truth.
- Sensible defaults, explicit overrides.
- Simple commands; minimal custom CLI complexity.
- Outputs are deterministic and git-friendly.

## Success Metrics
- Time from init to running docs: under 60 seconds.
- Typical build completes under 5 seconds for 200 pages.
- 90 percent of users need no config changes to publish.
- Low support burden: clear errors and actionable diagnostics.

## Constraints
- Must remain framework-agnostic at the content layer.
- Must not require custom authoring tools.
- Must remain easy to install in a standard JS project.

## Known Risks
- Nextra changes breaking integration.
- Image processing performance on large repos.
- Balancing simplicity with power.

## Assumptions
- Users accept a Nextra-based output layer.
- Users are comfortable with npm-based workflows.
- There is demand for a one-time purchase docs kit with reuse rights.
