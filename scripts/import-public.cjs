// One-time import of the existing, public website. No private project files are read.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const source = path.join(root, 'research');
const original = fs.readFileSync(path.join(source, 'original-index.html'), 'utf8');
const get = (text, re) => { const m = text.match(re); if (!m) throw new Error(`Missing ${re}`); return m[1]; };
const data = {
  businessSchema: JSON.parse(get(original, /<script type="application\/ld\+json">([\s\S]*?)<\/script>/)),
  map: get(original, /(<svg class="taiwan-map"[\s\S]*?<\/svg>)/),
  pages: {}
};
for (const slug of fs.readdirSync(path.join(source, 'original-services'))) {
  const html = fs.readFileSync(path.join(source, 'original-services', slug, 'index.html'), 'utf8');
  data.pages[slug] = {
    title: get(html, /<title>([^<]+)<\/title>/),
    description: get(html, /<meta name="description" content="([^"]+)"/),
    schema: JSON.parse(get(html, /<script type="application\/ld\+json">([\s\S]*?)<\/script>/)),
    main: get(html, /<main id="main">([\s\S]*?)<\/main>/)
  };
}
fs.mkdirSync(path.join(root, 'src'), {recursive:true});
fs.writeFileSync(path.join(root, 'src', 'original-public.json'), JSON.stringify(data, null, 2) + '\n');
console.log('Imported public content:', Object.keys(data.pages).length, 'service pages.');
