# Commercial Model (Draft)

This document outlines how EZ Docs could be packaged and sold as a one-time purchase that supports reuse across multiple doc sites.

## Goals
- One-time purchase for customers, with clear reuse rights.
- Simple licensing and low support overhead.
- Protect against direct redistribution of the toolkit itself.

## Packaging Options
1. **Binary + Templates Only**
   - Users install via npm and use published packages.
   - Fast onboarding, simpler updates.
2. **Source + Binary + Templates**
   - Buyers get source access for customization.
   - Higher perceived value, higher support expectations.

## Licensing Options (Select One)
- **Per-Organization License**
  - Unlimited internal projects within a company.
  - Pro: simple and reusable; Con: pricing risk for large orgs.
- **Per-Developer License**
  - License tied to named users.
  - Pro: scales with usage; Con: harder tracking.
- **Per-Project License**
  - One license per published doc site.
  - Pro: higher revenue in agency use; Con: friction for buyers.

## Suggested Usage Rights (Core Idea)
- Buyer can use EZ Docs to generate unlimited documentation sites.
- Buyer cannot resell or redistribute EZ Docs as a competing product.
- Buyer can include output sites in commercial products.

## Pricing Bands (Placeholder)
- Indie: low one-time price.
- Team: mid price with source access.
- Agency: higher price with templates bundle.

## Support and Updates
- Define a support window (for example, 6-12 months).
- Define update policy: minor updates included; major updates discounted.
- Publish a public roadmap for major updates.

## Distribution Channels
- Gumroad, Lemon Squeezy, or self-hosted checkout.
- Private npm registry or token-gated downloads.

## Third-Party License Considerations
- Nextra and Next.js licenses must be compatible with commercial distribution.
- Ensure all dependencies allow redistribution in templates.

## Decision Needed
- Choose license type and draft a formal license text.
- Decide if source code is included in the purchase.
