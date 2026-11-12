# Zonex independent redesign QA

The harness uses Chromium through Playwright and axe-core. It tests only the independent project, not the original source or production site. It never clicks an external contact link or transmits form data.

## Run locally

1. Install the project's dependencies with `npm install` and Chromium with `npx playwright install chromium` if needed.
2. Run `npm run build`, then start `npm run serve` in another terminal. Expected URL: `http://127.0.0.1:4176/zonex-uiux-v2/`.
3. Run `npm test`.

Optional environment variables: `QA_ORIGIN`, `QA_PREFIX` (must include leading/trailing slash), `QA_MENU_SELECTOR`, and `QA_NODE_MODULES`. The last is a local convenience for reusing an existing dependency installation; it is not needed after `npm install`.

Results and screenshots are written under `test-results/`. Each test catches failures independently so later checks continue. A failing run exits nonzero. Axe reports include failing nodes; zero axe findings do not replace manual keyboard or screen-reader review.

## Coverage

- Homepage and all seven service routes at 320, 375, 390, 768, 1024, and 1440 pixels.
- Real image decoding, alt attributes, one main landmark and h1, title and document language.
- GitHub Pages prefix retention, same-page anchor targets, external-tab safety, placeholder links.
- JavaScript runtime errors and unexpected third-party requests.
- Visible arrows/emoji, prohibited LINE ID copy UI, and common unsupported claims.
- WCAG A/AA and best-practice axe scans on every route at mobile width.
- Mobile menu repetition, Escape, outside click, resize, navigation, and browser history.
- Service tab selection, roving tabindex, directional/Home/End keys and responsive orientation.
- Every service-guide option, CTA synchronization, clipboard success, permission-denied and unavailable clipboard fallbacks, selected fallback text, and stale-state clearing.
- Expanded-menu and desktop homepage axe scans in addition to route-level mobile scans.
- Keyboard skip link and focus indicators, including an immediate first-Tab assertion that the hero CTA receives focus without a delayed reset to main; reduced motion and JavaScript-disabled core links.
- A nonexistent URL returning actual HTTP 404 and a recovery link.
- Full-page desktop/mobile home and mobile service screenshots.

## Manual checks before publishing

Inspect generated screenshots at full resolution, especially Chinese heading wraps, contact targets, image crops, sticky elements, and section spacing. Verify source-approved telephone, LINE URL, service wording and location claims against the read-only source. Review axe results and exercise at least one keyboard flow manually. After GitHub Pages deployment, rerun the link and routing checks at the deployed URL, and separately confirm its real missing-route HTTP status. Do not claim live deployment verification from local tests alone.
