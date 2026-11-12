# Zonex implementation decisions

UI/UX Pro Max was run locally with: `freight company landing trust --design-system --variance 7 --motion 2 --density 3`. Its verified result is saved in `zonex-transport-concept/MASTER.md`.

The first query matched a real-time operations dashboard. That was rejected: this is a freight company marketing site with no live vehicle data. The narrower query matched Hero + Features + CTA, Minimalism, a blue/orange palette, and subtle transitions.

## Product-specific adaptations

- Preserve the existing navy/orange logo. Use navy #142c3a, orange #f28a45, trust blue #235e81, and cool-white #f5f6f8. Use dark text on orange rather than low-contrast white.
- Use the already-licensed, locally served Noto Sans TC plus platform CJK fallbacks instead of adding Latin-only Outfit/Work Sans requests.
- Use spacious editorial grids, real operational photography, a service selector, and clear contact/preparation sections. Avoid fake metrics, review badges, moving status dots and claims of live tracking.
- The detected stack is plain HTML/CSS/JavaScript. No framework was assumed or introduced. An html-tailwind lookup was read only for generic focus/z-index principles; no Tailwind runtime is claimed or needed.
- Use native details/summary for FAQs, a native select for service preparation, and the WAI-ARIA keyboard tab pattern for service exploration.
- Retain all seven original public service pages and their factual text. The independent preview does not change original routes, DNS, Cloudflare configuration or source files.
- All meaningful actions have text labels. No emoji, arrow icons, or LINE ID display. Copying refers only to an empty inquiry template.
- Reduced motion disables the short hero entrance. No continuous animation or auto-rotating carousel.
- No form backend. No visitor-entered private data is collected. Copying requires an explicit visitor click and fails to a selectable text fallback.

## Review checklist

Use 320, 375, 390, 768, 1024 and 1440px viewports, keyboard navigation, repeated/cancelled menu flows, axe scans, no-JavaScript pages, image integrity, subpath links, CSP, metadata inspection, and deployed 404 verification. See tests/README.md and test output for actual pass/fail results.
