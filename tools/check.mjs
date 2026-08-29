#!/usr/bin/env node
/* ==========================================================================
   Sitenin sağlık kontrolü.  `node tools/check.mjs`

   Burada derleme adımı yok — başlık, gezinme ve altbilgi her sayfada elle
   duruyor. Onların zamanla birbirinden ayrışmaması bu script'in işi.
   Daha önce tam olarak bu yüzden bir hata çıkmıştı: "yukarı çık" bağlantısı
   yalnız bir sayfada çalışıyordu, çünkü hedefi olan id sadece orada vardı.

   Denetlenenler:
     1. Ortak çerçeve (başlık + altbilgi) bütün sayfalarda birebir aynı mı
     2. Dört sözlük de aynı anahtarları taşıyor mu
     3. HTML'de kullanılan her data-i18n anahtarı sözlükte var mı
     4. Yer tutucu bağlantı kalmış mı (example.com, YOUR_ID, boş profil...)
     5. Site içi bağlantılar ve #çapalar gerçekten bir yere gidiyor mu
     6. sitemap.xml'deki adresler dosya olarak duruyor mu
   ========================================================================== */

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";
import { createRequire } from "node:module";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);

const problems = [];
const notes = [];
const fail = (m) => problems.push(m);
const note = (m) => notes.push(m);

/* Gezinmede yer alan sayfalar. Yönlendirme sayfaları ve 404 hariç. */
const PAGES = ["index.html", "yolculugum.html", "projeler.html", "notlar.html", "hakkimda.html"];
const ALL_HTML = readdirSync(ROOT).filter((f) => f.endsWith(".html"));
const read = (f) => readFileSync(join(ROOT, f), "utf8");

/* ---------------------------------------------------- 1. ortak çerçeve */

function slice(html, startTag, endTag) {
  const a = html.indexOf(startTag);
  const b = html.indexOf(endTag, a);
  return a === -1 || b === -1 ? null : html.slice(a, b + endTag.length);
}

/* Sayfayı işaretleyen tek fark aria-current; karşılaştırmadan önce silinir. */
const normalise = (s) => s.replace(/\s*aria-current="page"/g, "");

let refHeader = null;
let refFooter = null;

for (const file of PAGES) {
  const html = read(file);
  const header = slice(html, '<header class="masthead">', "</header>");
  const footer = slice(html, '<footer class="site-footer">', "</footer>");

  if (!header) { fail(`${file}: <header class="masthead"> bulunamadı`); continue; }
  if (!footer) { fail(`${file}: <footer class="site-footer"> bulunamadı`); continue; }

  if (refHeader === null) { refHeader = normalise(header); refFooter = footer; continue; }
  if (normalise(header) !== refHeader) fail(`${file}: başlık ${PAGES[0]} ile aynı değil`);
  if (footer !== refFooter) fail(`${file}: altbilgi ${PAGES[0]} ile aynı değil`);
}

/* Her sayfa kendi gezinme bağlantısını işaretlemeli. */
for (const file of PAGES) {
  const n = (read(file).match(/aria-current="page"/g) || []).length;
  if (n !== 1) fail(`${file}: aria-current="page" ${n} kez geçiyor, 1 olmalı`);
}

/* ----------------------------------------------------- 2 ve 3. çeviriler */

const { translations, LANG_META } = require(join(ROOT, "js/i18n.js"));
const langs = Object.keys(translations);

if (langs.length !== 4) fail(`Beklenen 4 dil, bulunan ${langs.length}`);

for (const l of langs) {
  if (!LANG_META[l]) fail(`LANG_META içinde "${l}" yok`);
}

const base = new Set(Object.keys(translations[langs[0]]));
for (const l of langs.slice(1)) {
  const keys = new Set(Object.keys(translations[l]));
  for (const k of base) if (!keys.has(k)) fail(`${l}: "${k}" anahtarı eksik`);
  for (const k of keys) if (!base.has(k)) fail(`${l}: "${k}" anahtarı fazladan var`);
}

const used = new Map();
for (const file of ALL_HTML) {
  const html = read(file);
  for (const m of html.matchAll(/data-i18n(?:-aria-label)?="([^"]+)"/g)) {
    if (!used.has(m[1])) used.set(m[1], new Set());
    used.get(m[1]).add(file);
  }
}

for (const [key, files] of used) {
  if (!base.has(key)) fail(`"${key}" anahtarı ${[...files].join(", ")} içinde kullanılıyor ama sözlükte yok`);
}

/* Sayfa başlıkları JS tarafından title_<data-page> ile ayarlanıyor. */
for (const file of PAGES) {
  const key = read(file).match(/<body data-page="([^"]+)"/)?.[1];
  if (!key) fail(`${file}: <body data-page="..."> yok`);
  else if (!base.has("title_" + key)) fail(`${file}: "title_${key}" çevirisi yok`);
}

/* Bazı anahtarlar HTML'de değil, JS içinden okunuyor (tekil/çoğul gibi). */
const fromJs = new Set();
for (const f of readdirSync(join(ROOT, "js")).filter((f) => f.endsWith(".js") && f !== "i18n.js")) {
  for (const m of read(join("js", f)).matchAll(/"([a-z0-9_]+)"/g)) {
    if (base.has(m[1])) fromJs.add(m[1]);
  }
}

const unused = [...base].filter((k) => !used.has(k) && !fromJs.has(k) && !k.startsWith("title_"));
if (unused.length) note(`Sözlükte var ama hiçbir yerde kullanılmıyor: ${unused.join(", ")}`);

/* --------------------------------------------------- 4. yer tutucu izleri */

const PLACEHOLDERS = [
  [/example\.com/i, "example.com"],
  [/YOUR_[A-Z_]+/, "YOUR_... yer tutucusu"],
  [/BURAYA_/, "BURAYA_... yer tutucusu"],
  [/href="https:\/\/github\.com\/?"/, "boş GitHub bağlantısı"],
  [/href="https:\/\/(www\.)?linkedin\.com\/?"/, "boş LinkedIn bağlantısı"],
  [/lorem ipsum/i, "lorem ipsum"],
];

for (const file of [...ALL_HTML, "css/style.css", "js/i18n.js", "js/site.js", "js/notes.js", "manifest.webmanifest"]) {
  const text = read(file);
  for (const [re, label] of PLACEHOLDERS) {
    if (re.test(text)) fail(`${file}: ${label} kalmış`);
  }
}

/* ------------------------------------------ 5. site içi bağlantılar ve çapalar */

for (const file of ALL_HTML) {
  const html = read(file);
  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));

  for (const m of html.matchAll(/href="([^"]+)"/g)) {
    const href = m[1];
    if (/^(https?:|mailto:|tel:|data:)/.test(href)) continue;

    if (href.startsWith("#")) {
      const id = href.slice(1);
      if (id && !ids.has(id)) fail(`${file}: "${href}" çapası bu sayfada yok`);
      continue;
    }
    if (href.startsWith("/")) {
      fail(`${file}: "${href}" kökten yazılmış — proje sayfası depo adının altında, göreli olmalı`);
      continue;
    }
    const target = href.split(/[?#]/)[0];
    if (target && !existsSync(join(ROOT, target))) fail(`${file}: "${href}" diye bir dosya yok`);
  }
}

/* -------------------------------------------------------- 6. sitemap.xml */

const sitemap = read("sitemap.xml");
const BASE = "https://ferhat-yasinoglu.github.io/acik-defter/";
const listed = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

for (const loc of listed) {
  if (!loc.startsWith(BASE)) { fail(`sitemap.xml: "${loc}" beklenen adresle başlamıyor`); continue; }
  const rel = loc.slice(BASE.length) || "index.html";
  if (!existsSync(join(ROOT, rel))) fail(`sitemap.xml: "${loc}" diye bir dosya yok`);
}

for (const p of PAGES) {
  const expected = p === "index.html" ? BASE : BASE + p;
  if (!listed.includes(expected)) fail(`sitemap.xml: ${p} listede yok`);
}

/* --------------------------------------------------- service worker kabuğu */

const sw = read("sw.js");
for (const p of [...PAGES, "css/style.css", "js/i18n.js", "js/site.js"]) {
  if (!sw.includes(`"${p}"`)) fail(`sw.js: önbellek listesinde ${p} yok`);
}

/* ------------------------------------------------------------------ rapor */

for (const n of notes) console.log("  bilgi:  " + n);

if (problems.length) {
  console.error("\n✗ " + problems.length + " sorun:\n");
  for (const p of problems) console.error("  • " + p);
  console.error("");
  process.exit(1);
}

console.log(`\n✓ ${ALL_HTML.length} sayfa, ${langs.length} dil, ${base.size} anahtar — hepsi yerinde.\n`);
