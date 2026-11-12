# 宗錸物流 · 獨立 UI/UX 設計預覽

以 UI/UX Pro Max skill 的「Hero + Features + CTA / Minimalism」方向，重新設計宗錸物流公開網站。這是獨立 GitHub Pages 預覽，不會更新或取代 Cloudflare 正式網站。

- 正式網站：https://zonex-transport.com.tw/
- 預覽網址：https://yen021027.github.io/zonex-uiux-v2/
- 適用語言：繁體中文（台灣）

## 設計與功能

- 深藍、亮橘與冷白的工業編排，保留宗錸標誌與真實運送照片。
- 首頁的服務切換介面，完整保留七個服務說明頁。
- 依服務類型顯示洽詢準備清單，產生可複製的空白洽詢範本。
- 手機選單、底部電話／LINE 聯絡、鍵盤操作與降低動態效果支援。
- 公司電話、地址、業務範圍以原站公開內容為準。不捏造年資、營運數據、評論、認證或營業時間。
- 無追蹤碼、分析服務、登入、資料庫、付費或線上預約。配送地圖僅為示意，不是即時車輛追蹤。

## 開發與驗證

```sh
npm ci
npm run build
npm run check
npm run serve
# 另一個終端機
npm test
```

本機預覽：http://127.0.0.1:4176/zonex-uiux-v2/

`src/` 為來源，`scripts/build.cjs` 產出 `public/` 並更新 CSS／JavaScript 指紋。所有資源與路由皆以 GitHub Pages 子路徑為準。CI 只發布 `public/`，不發布研究檔案、原始照片或部署帳號設定。

`scripts/import-public.cjs` 是初次擷取原站公開頁面的輔助程式，不屬於一般 build 流程。後續可直接修改 `src/original-public.json` 中的公開頁面內容。

## 預覽站限制

- 所有頁面標示 noindex，canonical 保留正式網站對應頁；本版不提交搜尋引擎 sitemap，避免與正式站競爭收錄。
- 電話與 LINE 連結會前往真實聯絡方式。複製範本不會自動發送、報價或成立預約。
- GitHub Pages 無法設定自訂 HTTP 安全標頭。頁面保留 CSP 與 referrer meta，但不能替代正式站的 frame-ancestors、X-Frame-Options、Permissions-Policy 及自訂快取標頭。正式站的 Cloudflare 安全設定未改動。
- GitHub Pages 的自訂 404 文件已提供，沒有使用將所有錯誤轉成首頁的 SPA fallback。

## 資產來源與權利

- 圖片、標誌及公司資料來自宗錸既有公開官網專案，僅使用其已壓縮、移除私人中繼資料的公開版本。本預覽未將這些資產重新授權為公有領域或開放素材，相關權利仍歸原權利人。
- Noto Sans TC：SIL Open Font License，授權文件位於 `public/assets/noto-sans-tc-OFL.txt`。
- 台灣輪廓：Natural Earth 1:50m Admin 0（public domain），來源 https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_50m_admin_0_countries.geojson 。配送線條僅為示意。
- 沒有新增外部圖庫照片、第三方追蹤碼或遠端字型請求。

請勿使用原專案的 Cloudflare deploy 指令發布本預覽。
