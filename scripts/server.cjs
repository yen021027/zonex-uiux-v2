const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '../public');
const base = '/zonex-uiux-v2';
const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.jpg':'image/jpeg','.woff2':'font/woff2','.txt':'text/plain; charset=utf-8','.xml':'application/xml'};
http.createServer((req,res) => {
  const url = new URL(req.url,'http://localhost');
  if (url.pathname === '/') {res.writeHead(302,{Location:base + '/'}); res.end(); return;}
  if (url.pathname === base) {res.writeHead(301,{Location:base + '/'});res.end();return;}
  let relative;
  try { relative = decodeURIComponent(url.pathname.slice(base.length)); } catch { res.writeHead(400);res.end();return; }
  let file = path.resolve(root, '.' + relative);
  if (!url.pathname.startsWith(base + '/') || (file !== root && !file.startsWith(root + path.sep))) {res.writeHead(404);res.end();return;}
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) {
    if (!url.pathname.endsWith('/')) {res.writeHead(301,{Location:url.pathname + '/' + url.search});res.end();return;}
    file = path.join(file,'index.html');
  }
  const exists = fs.existsSync(file) && fs.statSync(file).isFile();
  if (!exists) file = path.join(root,'404.html');
  res.writeHead(exists ? 200 : 404,{'Content-Type':types[path.extname(file)] || 'application/octet-stream','Cache-Control':'no-cache','X-Content-Type-Options':'nosniff'});
  if (req.method === 'HEAD') res.end(); else fs.createReadStream(file).pipe(res);
}).listen(4176,'127.0.0.1',() => console.log('Preview http://127.0.0.1:4176/zonex-uiux-v2/'));
