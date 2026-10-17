// Renders .body.html (marked output) into a standalone index.html.
// Usage: node render.mjs   (after `npx marked -i README.md -o .body.html`)
import { readFileSync, writeFileSync } from "node:fs";

const body = readFileSync(".body.html", "utf8");

// --- GitHub-compatible heading slugger (so the markdown TOC anchors work) ---
const seen = new Map();
function slug(text) {
  let s = text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .trim()
    .replace(/\s+/g, "-");
  if (seen.has(s)) {
    const n = seen.get(s) + 1;
    seen.set(s, n);
    s = `${s}-${n}`;
  } else {
    seen.set(s, 0);
  }
  return s;
}

let html = body.replace(/<(h[1-6])>([\s\S]*?)<\/\1>/g, (m, tag, inner) => {
  const text = inner.replace(/<[^>]+>/g, "");
  return `<${tag} id="${slug(text)}">${inner}</${tag}>`;
});

// marked percent-encodes CJK in href="#..." — decode so href matches id exactly.
html = html.replace(/href="#([^"]+)"/g, (m, frag) => {
  let decoded = frag;
  try { decoded = decodeURIComponent(frag); } catch {}
  return `href="#${decoded}"`;
});

// Lift the document's own h1 into the page hero.
let title = "Usagi Engine 新手教程";
const h1 = html.match(/<h1 id="[^"]*">([\s\S]*?)<\/h1>/);
if (h1) {
  title = h1[1].replace(/<[^>]+>/g, "").trim();
  html = html.replace(h1[0], "");
}

const page = `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="Usagi Engine 中文新手教程：安装、游戏循环、输入、State 与热重载、碰撞、音效、存档、导出发布。基于官网 v1.3.3 与官方书整理。">
<meta property="og:title" content="${title}">
<meta property="og:description" content="基于 usagiengine.com 官方文档与官方书整理的中文入门教程。">
<meta property="og:type" content="article">
<style>
:root{
  --fg:#1f2328; --fg-mut:#59636e; --bg:#ffffff; --bg-soft:#f6f8fa;
  --line:#d1d9e0; --line-soft:#e7ecf0;
  --accent:#0969da; --accent-soft:#ddf4ff;
  --code-bg:#0d1117; --code-fg:#e6edf3;
  --inline-bg:#eff2f5; --inline-fg:#b31d28;
}
*{box-sizing:border-box}
html{-webkit-text-size-adjust:100%;scroll-behavior:smooth}
body{
  margin:0; background:var(--bg); color:var(--fg);
  font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Hiragino Sans GB","Microsoft YaHei","Noto Sans CJK SC",sans-serif;
  font-size:16px; line-height:1.78;
  -webkit-font-smoothing:antialiased;
}
.wrap{max-width:860px;margin:0 auto;padding:0 22px 96px}
header.hero{
  border-bottom:1px solid var(--line-soft);
  background:linear-gradient(180deg,#fafbfc,#fff);
  margin-bottom:34px; padding:52px 22px 30px;
}
header.hero .inner{max-width:860px;margin:0 auto}
header.hero .kicker{
  display:inline-block;font-size:12px;letter-spacing:.12em;text-transform:uppercase;
  color:var(--accent);background:var(--accent-soft);
  border-radius:999px;padding:3px 11px;margin-bottom:16px;font-weight:600;
}
header.hero h1{margin:0 0 10px;font-size:clamp(26px,4.4vw,38px);line-height:1.3;letter-spacing:-.01em}
header.hero p.sub{margin:0;color:var(--fg-mut);font-size:15px}
header.hero a{color:var(--accent);text-decoration:none}
header.hero a:hover{text-decoration:underline}

h2,h3,h4,h5,h6{scroll-margin-top:24px;line-height:1.4}
h2{
  font-size:23px;margin:2.6em 0 .9em;padding-bottom:.4em;
  border-bottom:1px solid var(--line-soft);
}
h3{font-size:18px;margin:2em 0 .7em}
h1{font-size:26px}
p{margin:0 0 1.1em}
a{color:var(--accent);text-decoration:none}
a:hover{text-decoration:underline}
strong{font-weight:650}
hr{border:0;border-top:1px solid var(--line-soft);margin:3em 0}
ul,ol{margin:0 0 1.15em;padding-left:1.6em}
li{margin:.34em 0}
li>ul,li>ol{margin:.34em 0}

blockquote{
  margin:0 0 1.3em;padding:.85em 1.1em;
  border-left:4px solid var(--line);border-radius:0 8px 8px 0;
  background:var(--bg-soft);color:#3d444d;
}
blockquote p:last-child{margin-bottom:0}

code{
  font-family:ui-monospace,SFMono-Regular,"SF Mono",Menlo,Consolas,"Liberation Mono",monospace;
  font-size:.875em;
}
:not(pre)>code{
  background:var(--inline-bg);color:var(--inline-fg);
  padding:.18em .4em;border-radius:5px;
  word-break:break-word;
}
pre{
  background:var(--code-bg);color:var(--code-fg);
  padding:16px 18px;border-radius:10px;overflow-x:auto;
  margin:0 0 1.3em;line-height:1.62;
  -webkit-overflow-scrolling:touch;
}
pre code{background:none;color:inherit;padding:0;font-size:13.5px;white-space:pre}

table{
  border-collapse:collapse;width:100%;margin:0 0 1.4em;
  font-size:14.5px;display:block;overflow-x:auto;
}
th,td{border:1px solid var(--line);padding:8px 12px;text-align:left;vertical-align:top}
th{background:var(--bg-soft);font-weight:650;white-space:nowrap}
tbody tr:nth-child(even){background:#fbfcfd}

footer.foot{
  margin-top:64px;padding-top:22px;border-top:1px solid var(--line-soft);
  color:var(--fg-mut);font-size:13.5px;
}
footer.foot a{color:var(--accent)}
@media (max-width:600px){
  body{font-size:15.5px}
  header.hero{padding:36px 18px 24px}
  .wrap{padding:0 18px 72px}
  pre{padding:13px 14px;border-radius:8px}
  pre code{font-size:12.5px}
}
@media print{
  header.hero{background:none}
  pre{background:#f6f8fa;color:#111;border:1px solid #ddd}
  a{color:#111}
}
</style>
</head>
<body>
<header class="hero">
  <div class="inner">
    <span class="kicker">Guide · v1.3.3</span>
    <h1>${title}</h1>
    <p class="sub">依据 <a href="https://usagiengine.com/">usagiengine.com</a> 官方文档与官方书 <a href="https://book.usagiengine.com/">Game Programming with Usagi</a> 整理。</p>
  </div>
</header>
<div class="wrap">
${html.trim()}
  <footer class="foot">
    <p>本页为第三方中文学习笔记，非官方文档。最新内容以 <a href="https://usagiengine.com/">官网</a> 与 <a href="https://book.usagiengine.com/">官方书</a> 为准。</p>
    <p>Usagi Engine 由 Brett Chalupa 开发，源码与官方书均捐献至公有领域。</p>
  </footer>
</div>
</body>
</html>
`;

writeFileSync("index.html", page);
console.log(`index.html written (${(page.length / 1024).toFixed(1)} KB), title="${title}"`);
