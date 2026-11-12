# Local redesign QA result

Tested: 2026-11-12, 10:20 Taiwan time (02:20 UTC).
Target: http://127.0.0.1:4176/zonex-uiux-v2/
Final assets: `style.6815659f5c.css` and `app.80b191ab0f.js`.

## Result

- `npm run build`: passed; homepage, seven service pages and 404 generated.
- `npm run check`: passed; nine HTML documents, 370 local references and 28 metadata-free JPEG assets validated.
- `npm test`: 74/74 passed. The complete suite was run again after final Chinese-heading fixes and passed again.
- `git diff --check`: passed. Git printed line-ending normalization notices, not whitespace errors.
- Additional 844 x 390 landscape homepage check: no horizontal overflow.

## Automated coverage

- Homepage and all seven service pages load with decoded images and correct local subpath links.
- No page-level horizontal overflow at 320, 375, 390, 768, 1024 or 1440 pixels. The 404 passes those widths and returns HTTP 404.
- No axe violations under the configured WCAG A/AA and best-practice tags on the homepage, all seven service pages, 404, expanded mobile navigation and desktop homepage.
- Mobile menu repeated activation, Escape, outside click, resize, navigation and browser history.
- Keyboard skip link/focus behavior, service tabs and responsive keyboard orientation.
- Inquiry selection, CTA synchronization, clipboard success, denied/unavailable clipboard fallback, selected fallback text and stale-state clearing.
- Reduced motion and JavaScript-disabled essential navigation/contact links.
- No unexpected third-party requests or JavaScript page errors during route checks. No contact link was activated and no inquiry was sent.

## Visual review

Actual rendered screenshots were inspected at 1440, 390 and 320 pixels, plus machinery detail desktop/mobile screenshots. A separate reviewer found the restrained palette, direct Chinese headings, real freight images and ruled lists suitable for a working freight company rather than a generic AI template.

Two issues were corrected and re-rendered:
- The 320px inquiry heading now intentionally breaks after `照著清單，`, keeping `需求` together.
- Machinery detail's introductory heading now reads `尺寸、包裝、裝卸。 / 運送前一起確認。`, avoiding a split of `裝卸方式`.

The mobile contact bar is 58px and the page reserves bottom/safe-area space. Service options and contact controls remain reachable. The mobile hero crop retains both cargo and truck; more of the real ground/roof is visible than on desktop.

Evidence in ignored `test-results/` includes `redesign-hero-{1440,390,320}.png`, `redesign-home-{1440,390,320}.png`, `home-desktop.png`, `home-mobile.png`, `service-mobile.png`, `final-preparation-320.png` and `final-detail-heading.png`. Reviewer captures use the `review-` prefix. Full-page screenshot capture places fixed UI at the initial viewport position; separate scrolled checks verified that the contact bar does not make footer content permanently inaccessible.

## Business fact check

The live official homepage at https://zonex-transport.com.tw/ returned HTTP 200 through ordinary Node fetch with normal TLS validation. Its public text confirmed the two phone numbers, company address, approved LINE destination, box-wing/liftgate vehicle description, electric pallet truck, industrial materials and nationwide delivery. The original read-only page snapshots remain the source for service-detail prose.

No business hours, metrics, prices, customer reviews, certifications, guaranteed availability or tracking service were introduced. No generated operational photographs were used.

## Scope and limitations

Only `C:\Users\User\zonex-uiux-v2` was edited. At the time of this local review, no commit, push or deployment had been made. The owner subsequently authorized publishing only to the existing independent GitHub Pages demo. No Cloudflare configuration or production DNS change is part of that authorization. The local loopback preview server was left running for review on DESKTOP-95MCASJ.

Automated Chromium and screenshot checks are not a screen-reader audit, physical-phone test or complete accessibility certification. Safari/iOS and live deployment verification were not run. The design is a local preview, not an operating booking or quote system.


## Authorized publication follow-up

The owner approved publication after reviewing the local redesign. Pre-publication build, static checks and the complete browser suite are rerun before committing. Deployment uses the existing `Publish design preview` workflow on this repository only. Remote commit, workflow result and actual served assets will be verified before reporting publication complete.
