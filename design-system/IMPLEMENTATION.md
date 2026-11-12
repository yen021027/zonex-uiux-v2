# Current implementation direction

## Owner correction

The owner rejected visually referencing the original website because it looked too AI-generated. The 2026-11-12 local revision is a new visual direction, not a reskin of the original. The official site is used only to verify business facts, contact destinations and the provenance of already-public photographs.

## Current source of truth

Use `design-system/zonex-fieldwork/MASTER.md` with the product-specific adaptations below. The older `zonex-transport-concept/MASTER.md` is historical and must not restore the former blue/orange design.

UI/UX Pro Max was run with `freight company minimal trustworthy --design-system --variance 5 --motion 1 --density 5`. The verified match was Minimalism & Swiss Style: useful high-contrast type, an orderly grid, clear navigation and restrained interaction. The preceding `freight editorial industrial minimal` query over-weighted Brutalism and returned an artistic pink direction; that recommendation was rejected as inappropriate for a working freight business.

## Product-specific decisions

- Warm paper #f6f4ee, charcoal #242823, restrained rust #a33928, fine rules, square controls and no shadows. The brand logo remains an identity asset, not a palette template.
- Prominent direct Chinese headings, real unretouched truck/cargo photographs and useful shipping information. No decorative English slogans, floating stamps, pills, gradients, decorative metrics, maps implying an operating network, or status dots suggesting live tracking.
- Locally hosted Noto Sans TC and system fallbacks. No remote fonts. Plain HTML/CSS/JavaScript, no added framework or runtime.
- New homepage composition lives in `src/home.cjs`; `scripts/build.cjs` generates nine HTML documents. Shared CSS is rewritten for the homepage, all seven service pages and 404.
- Service detail prose remains fact-checked against public source content. Decorative source labels are removed; all page layouts use the new typographic system. A machinery subheading was shortened to keep complete Chinese phrases together.
- Preserve accessible menu, service tabs and inquiry helper behavior. Mobile service choices use a two-column list. Contact has real telephone/LINE destinations but no data entry or submission.
- All pages remain noindex with official canonical URLs. The initial review was local-only. Subsequent owner approval authorizes publishing this revision solely to the existing independent GitHub Pages demo, never the official Cloudflare site.

## Verification

Run `npm run build`, `npm run check`, then `npm test` against the local preview server. Inspect actual desktop and mobile screenshots, not just DOM checks. See `tests/QA-RESULTS.md` for the current run and limitations.
