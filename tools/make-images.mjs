#!/usr/bin/env node
/* ==========================================================================
   Uygulama ikonlarını ve paylaşım görselini üretir.

     npx playwright@1 install chromium      # bir kez
     node tools/make-images.mjs

   Çıktılar depoya commit'lenir; siteyi yayınlamak için bu script'i
   çalıştırmak gerekmez. Amblemi ya da renkleri değiştirdiğinde tekrar
   çalıştırıp çıktıları güncelle.

   Kaynak biçim favicon.svg ile aynı: mor-mavi degrade yuvarlak kare +
   üç satır. Renkler css/style.css içindeki --violet / --blue ile bir
   olmalı; değiştirirsen buradaki sabitleri de değiştir.
   ========================================================================== */

import { chromium } from "playwright";
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const VIOLET = "#8b5cf6";
const INDIGO = "#6366f1";
const BLUE = "#3b82f6";
const CYAN = "#22d3ee";
const BG = "#0a0a12";
const TEXT = "#eceaf6";
const MUTED = "#8b8aa0";

/* Amblem — SVG olarak, ölçekten bağımsız.
   pad: maskeli ikonlarda köşelerin kırpılmasına karşı iç boşluk payı.
   id: aynı sayfada birden çok amblem olursa degradeler çakışmasın. */
function mark({ size, radius, pad = 0, id = "g" }) {
  const s = size - pad * 2;
  const u = s / 32;
  const bar = (y, w) =>
    `<rect x="${pad + 8 * u}" y="${pad + y * u}" width="${w * u}" height="${2.6 * u}" rx="${1.3 * u}" fill="#fff"/>`;
  return `
    <defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${VIOLET}"/><stop offset="1" stop-color="${BLUE}"/>
    </linearGradient></defs>
    <rect x="${pad}" y="${pad}" width="${s}" height="${s}" rx="${radius}" fill="url(#${id})"/>
    ${bar(8.7, 16)}${bar(14.7, 16)}${bar(20.7, 9.5)}`;
}

const ICONS = [
  { file: "icon-192.png", size: 192, svg: mark({ size: 192, radius: 42 }) },
  { file: "icon-512.png", size: 512, svg: mark({ size: 512, radius: 112 }) },
  { file: "apple-touch-icon.png", size: 180, svg: mark({ size: 180, radius: 0 }) },
  /* Maskeli ikon: güvenli alan kenarın %10'u içeride kalmalı. Zemin
     köşeden köşeye degrade, amblem ortada. */
  {
    file: "icon-512-maskable.png",
    size: 512,
    svg:
      `<defs><linearGradient id="gbg" x1="0" y1="0" x2="1" y2="1">` +
      `<stop offset="0" stop-color="${VIOLET}"/><stop offset="1" stop-color="${BLUE}"/>` +
      `</linearGradient></defs><rect width="512" height="512" fill="url(#gbg)"/>` +
      mark({ size: 512, radius: 0, pad: 92, id: "gfg" }),
  },
];

function iconPage(size, svg) {
  return `<!DOCTYPE html><meta charset="utf-8">
<style>html,body{margin:0;padding:0}svg{display:block}</style>
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">${svg}</svg>`;
}

/* Paylaşım görseli — bağlantı bir yere yapıştırıldığında görünen kart.
   Sitenin giriş bölümünün küçültülmüş hali: koyu zemin, köşelerde
   ortam ışığı, degrade başlık. */
function ogPage() {
  return `<!DOCTYPE html><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=Newsreader:opsz,wght@6..72,500&display=swap">
<style>
  html,body{margin:0}
  body{
    width:1200px;height:630px;background:${BG};color:${TEXT};
    font-family:Inter,sans-serif;
    display:flex;flex-direction:column;justify-content:space-between;
    padding:74px 86px;box-sizing:border-box;
    position:relative;overflow:hidden;
  }
  /* Ortam ışığı — sitedeki body::before ile aynı fikir. */
  body::before{
    content:"";position:absolute;inset:0;pointer-events:none;
    background:
      radial-gradient(680px 460px at 88% -8%, rgba(139,92,246,.30), transparent 62%),
      radial-gradient(560px 420px at 6% 106%, rgba(59,130,246,.24), transparent 64%),
      radial-gradient(420px 300px at 52% 118%, rgba(34,211,238,.14), transparent 66%);
  }
  body>*{position:relative}
  .top{display:flex;align-items:center;gap:20px}
  .top svg{width:52px;height:52px}
  .top span{font-family:Newsreader,serif;font-size:30px;font-weight:500}
  h1{font-family:Newsreader,serif;font-weight:500;font-size:76px;line-height:1.12;
     letter-spacing:-.015em;margin:0;max-width:19ch;
     background:linear-gradient(100deg,${TEXT} 34%,${VIOLET} 68%,${CYAN});
     -webkit-background-clip:text;background-clip:text;color:transparent}
  .foot{display:flex;justify-content:space-between;align-items:baseline;
        font-size:22px;color:${MUTED}}
  .foot b{color:${TEXT};font-weight:500}
  /* Üst kenar çizgisi: eski sürümdeki düz kırmızı şeridin degrade hali. */
  .edge{position:absolute;inset:0 0 auto 0;height:6px;
        background:linear-gradient(90deg,${VIOLET},${INDIGO},${BLUE},${CYAN})}
</style>
<div class="edge"></div>
<div class="top">
  <svg viewBox="0 0 32 32">${mark({ size: 32, radius: 8, id: "gog" })}</svg>
  <span>Açık Defter</span>
</div>
<h1>Öğrendiğimi unutmadan buraya yazıyorum.</h1>
<div class="foot">
  <span><b>Farhad Yaqoobi</b> — NRW, Almanya</span>
  <span>ferhat-yasinoglu.github.io/acik-defter</span>
</div>`;
}

const browser = await chromium.launch();

for (const { file, size, svg } of ICONS) {
  const page = await browser.newPage({ viewport: { width: size, height: size }, deviceScaleFactor: 1 });
  await page.setContent(iconPage(size, svg));
  writeFileSync(join(ROOT, file), await page.screenshot({ omitBackground: true }));
  await page.close();
  console.log("yazıldı:", file, `${size}×${size}`);
}

const og = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await og.setContent(ogPage(), { waitUntil: "networkidle" });
await og.evaluate(() => document.fonts.ready);
writeFileSync(join(ROOT, "og.png"), await og.screenshot());
console.log("yazıldı: og.png 1200×630");

await browser.close();
