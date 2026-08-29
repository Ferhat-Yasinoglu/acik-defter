#!/usr/bin/env node
/* ==========================================================================
   Uygulama ikonlarını ve paylaşım görselini üretir.

     npx playwright@1 install chromium      # bir kez
     node tools/make-images.mjs

   Çıktılar depoya commit'lenir; siteyi yayınlamak için bu script'i
   çalıştırmak gerekmez. Amblemi ya da renkleri değiştirdiğinde tekrar
   çalıştırıp çıktıları güncelle.

   Kaynak biçim favicon.svg ile aynı: kırmızı yuvarlak kare + üç satır.
   ========================================================================== */

import { chromium } from "playwright";
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const RED = "#a4382a";
const PAPER = "#fbfaf7";
const INK = "#1b1a17";
const MUTED = "#857f75";

/* Amblem — SVG olarak, ölçekten bağımsız.
   pad: maskeli ikonlarda köşelerin kırpılmasına karşı iç boşluk payı. */
function mark({ size, radius, bg = RED, fg = PAPER, pad = 0 }) {
  const s = size - pad * 2;
  const u = s / 32;
  const bar = (y, w) =>
    `<rect x="${pad + 8 * u}" y="${pad + y * u}" width="${w * u}" height="${2.6 * u}" rx="${1.3 * u}" fill="${fg}"/>`;
  return `
    <rect x="${pad}" y="${pad}" width="${s}" height="${s}" rx="${radius}" fill="${bg}"/>
    ${bar(8.7, 16)}${bar(14.7, 16)}${bar(20.7, 9.5)}`;
}

const ICONS = [
  { file: "icon-192.png", size: 192, svg: mark({ size: 192, radius: 42 }) },
  { file: "icon-512.png", size: 512, svg: mark({ size: 512, radius: 112 }) },
  { file: "apple-touch-icon.png", size: 180, svg: mark({ size: 180, radius: 0 }) },
  /* Maskeli ikon: güvenli alan kenarın %10'u içeride kalmalı. */
  { file: "icon-512-maskable.png", size: 512, svg: `<rect width="512" height="512" fill="${RED}"/>` + mark({ size: 512, radius: 0, pad: 92, bg: RED }) },
];

function iconPage(size, svg) {
  return `<!DOCTYPE html><meta charset="utf-8">
<style>html,body{margin:0;padding:0}svg{display:block}</style>
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">${svg}</svg>`;
}

/* Paylaşım görseli — bağlantı bir yere yapıştırıldığında görünen kart. */
function ogPage() {
  return `<!DOCTYPE html><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=Newsreader:opsz,wght@6..72,500&display=swap">
<style>
  html,body{margin:0}
  body{
    width:1200px;height:630px;background:${PAPER};color:${INK};
    font-family:Inter,sans-serif;
    display:flex;flex-direction:column;justify-content:space-between;
    padding:74px 86px;box-sizing:border-box;
    border-top:14px solid ${RED};
  }
  .top{display:flex;align-items:center;gap:20px}
  .top svg{width:52px;height:52px}
  .top span{font-family:Newsreader,serif;font-size:30px;font-weight:500}
  h1{font-family:Newsreader,serif;font-weight:500;font-size:76px;line-height:1.12;
     letter-spacing:-.015em;margin:0;max-width:19ch}
  .foot{display:flex;justify-content:space-between;align-items:baseline;
        font-size:22px;color:${MUTED}}
  .foot b{color:${INK};font-weight:500}
</style>
<div class="top">
  <svg viewBox="0 0 32 32">${mark({ size: 32, radius: 7 })}</svg>
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
