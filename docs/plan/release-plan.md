# Release and Distribution Plan

## Versioning
- Use semantic versioning.
- Breaking changes only in major releases.

## Package Publishing
- `create-ezdocs` published to npm.
- `@ezdocs/core` published to npm.
- Templates included in `create-ezdocs` package.

## Release Pipeline
1. Update changelog.
2. Run full test suite.
3. Build packages.
4. Publish to npm.
5. Announce release and update docs site.

## Distribution of Commercial License
- If paid, gate template downloads or provide access token.
- Option: separate paid package name with private registry.

## Backward Compatibility
- Maintain a compatibility matrix for Nextra.
- Provide migration notes for config changes.

## Release Checklist
- Version bump complete.
- `npm pack` sanity check.
- Templates verified.
- Example projects updated.
