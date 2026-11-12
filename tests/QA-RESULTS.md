# Local QA result

Tested: 2026-11-12 01:56 UTC. Target: `http://127.0.0.1:4176/zonex-uiux-v2/`.

**74 of 74 automated checks passed** using `npm test` and this project's installed Playwright/axe dependencies. Build assets tested: `style.cb4aafa9d6.css` and `app.8d70530331.js`.

## Verified

- Homepage and all seven service pages load with working images, expected structure and subpath-safe links.
- No horizontal page overflow at 320, 375, 390, 768, 1024 or 1440 pixels. The custom 404 also passes all six widths and returns HTTP 404.
- No axe violations under the configured WCAG A/AA and best-practice tags on homepage, seven service pages and 404. Expanded mobile navigation and desktop homepage also pass their configured axe checks.
- Menu opening/closing, repeated interactions, Escape, outside click, breakpoint change, navigation and browser history pass.
- Service tabs, keyboard movement, responsive orientation, all inquiry-guide options and service CTA synchronization pass.
- Clipboard success, denied access and missing clipboard API behave correctly. Manual fallback text receives focus and selection; changing service clears stale feedback.
- Keyboard skip link and focus indicators, reduced-motion preference and JavaScript-disabled essential navigation/contact links pass.
- No unexpected third-party requests or page JavaScript errors were observed during route checks. No external contact link was clicked and no inquiry was transmitted.
- Telephone targets `tel:0919083060`, `tel:0426633352` and LINE target `https://line.me/ti/p/swxaMQm3yw` match the original public homepage snapshot exactly.

## Visual evidence

Full-page artifacts in `test-results/`: `home-desktop.png` (1440 px), `home-mobile.png` (390 px), and `service-mobile.png` (390 px). The homepage screenshots were taken after entrance animations settled. Desktop/mobile review found clear heading wraps, consistent spacing and no visible clipped content. The fixed mobile contact bar appears at the initial viewport position in a full-page screenshot, as expected.

## Fixed during QA

The implementation owner corrected the local server's root-path handling, brand accessible-name mismatch, missing preview/contact landmarks, and invalid native element for tabpanel semantics. The initial copyright-symbol detector false positive was corrected in the tests. The final run includes those fixes.

## Limitations

This is a Chromium/local-build result, not confirmation of GitHub Pages publication. Deployment checks remain pending. Automated axe results are not a formal accessibility certification or a substitute for assistive-technology testing. Responsive widths were exercised, but physical iOS/Android devices were not tested.
