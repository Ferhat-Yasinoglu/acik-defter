#!/usr/bin/env node
/* ==========================================================================
   Uygulama ikonlarını ve paylaşım görselini üretir.

     npm install --no-save playwright@1 && npx playwright install chromium
     node tools/make-images.mjs

   Çıktılar depoya commit'lenir; siteyi yayınlamak için bu script'i
   çalıştırmak gerekmez. Amblemi ya da renkleri değiştirdiğinde tekrar
   çalıştırıp çıktıları güncelle.

   Kaynak biçim favicon.svg ile aynı: krem bir defter yaprağı, kırmızı marj
   çizgisi, üç mavi satır, arkasında hafif dönmüş ikinci yaprak. Renkler
   css/style.css içindeki --ink / --pen / --blue ile bir olmalı;
   değiştirirsen buradaki sabitleri de değiştir.
   ========================================================================== */

import { chromium } from "playwright";
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const INK = "#1b2540";
const INK_2 = "#3f4a63";
const INK_3 = "#565d70";
const PEN = "#a8362c";
const BLUE = "#2b4a8f";
const PAPER = "#faf6ea";
const SHEET = "#fdfaf3";
const BACK = "#cfc4ad";
const BOARD = "#2f2822";
const RULE = "rgba(43,74,143,.17)";

/* Amblem — SVG olarak, ölçekten bağımsız. 32 birimlik çizim size'a
   ölçekleniyor; pad maskeli ikonlarda köşelerin kırpılmasına karşı pay. */
function mark({ size, pad = 0, bg = null, radius = 0 }) {
  const s = size - pad * 2;
  const k = s / 32;
  const plate = bg ? `<rect width="${size}" height="${size}" rx="${radius}" fill="${bg}"/>` : "";
  return `${plate}<g transform="translate(${pad} ${pad}) scale(${k})">
    <rect x="7" y="2.5" width="22" height="25" rx="2.5" fill="${BACK}" transform="rotate(6 18 15)"/>
    <rect x="3.5" y="4" width="22" height="25" rx="2.5" fill="${SHEET}" stroke="${INK}" stroke-width="1.5"/>
    <path d="M9 4v25" stroke="${PEN}" stroke-width="1.3"/>
    <path d="M12.5 11.5h9M12.5 16.5h9M12.5 21.5h5.5" stroke="${BLUE}" stroke-width="1.7" stroke-linecap="round"/>
  </g>`;
}

const ICONS = [
  /* Yuvarlak köşeli kapak zemini: ana ekranda ikon kağıt gibi görünsün. */
  { file: "icon-192.png", size: 192, svg: mark({ size: 192, pad: 22, bg: BOARD, radius: 42 }) },
  { file: "icon-512.png", size: 512, svg: mark({ size: 512, pad: 60, bg: BOARD, radius: 112 }) },
  { file: "apple-touch-icon.png", size: 180, svg: mark({ size: 180, pad: 22, bg: BOARD, radius: 0 }) },
  /* Maskeli ikon: güvenli alan kenarın %10'u içeride kalmalı. */
  { file: "icon-512-maskable.png", size: 512, svg: mark({ size: 512, pad: 104, bg: BOARD, radius: 0 }) },
];

function iconPage(size, svg) {
  return `<!DOCTYPE html><meta charset="utf-8">
<style>html,body{margin:0;padding:0}svg{display:block}</style>
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">${svg}</svg>`;
}

/* Paylaşım görseli — bağlantı bir yere yapıştırıldığında görünen kart.
   Masanın üstünde duran çizgili bir yaprak: kırmızı marj, mürekkep başlık,
   el yazısıyla altına çekilmiş çizgi. */
function ogPage() {
  return `<!DOCTYPE html><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Caveat:wght@600&family=Inter:wght@400;500&family=Newsreader:opsz,wght@6..72,500&display=swap">
<style>
  html,body{margin:0}
  body{
    width:1200px;height:630px;background:#e6ddca;
    font-family:Inter,sans-serif;color:${INK};
    position:relative;overflow:hidden;
  }
  .sheet{
    position:absolute;inset:34px 40px 0 40px;
    background:${PAPER};
    box-shadow:0 0 0 1px rgba(35,31,26,.14),6px 6px 0 -1px #f3ecdb,6px 6px 0 0 rgba(35,31,26,.14),0 40px 60px -30px rgba(40,30,15,.35);
  }
  .board{position:absolute;inset:0 0 auto 0;height:72px;background:${BOARD};border-bottom:2px dashed rgba(255,255,255,.28);
         display:flex;align-items:center;gap:16px;padding:0 60px;color:#f6f1e6;font-family:Newsreader,serif;font-size:30px}
  .board svg{width:40px;height:40px}
  .tab{margin-left:auto;display:flex;gap:8px;align-self:flex-end}
  .tab span{padding:8px 18px 10px;border-radius:0 0 8px 8px;background:rgba(255,255,255,.06);border-top:3px solid var(--c);font-size:15px;font-family:Inter,sans-serif;color:#cfc4ad}
  .tab span.on{background:${PAPER};color:${BOARD};font-weight:600}
  .lines{position:absolute;inset:72px 0 0 0;
         background:repeating-linear-gradient(to bottom,transparent 0 47px,${RULE} 47px 48px);}
  .margin{position:absolute;top:72px;bottom:0;left:120px;width:0;border-left:2px solid ${PEN};opacity:.45}
  .holes{position:absolute;top:100px;bottom:0;left:16px;width:14px;
         background:radial-gradient(circle at 50% 50%,#e6ddca 0 5px,rgba(35,31,26,.3) 6px,transparent 7px) 0 0/14px 74px repeat-y}
  .stitch{position:absolute;top:72px;bottom:0;left:38px;border-left:2px dashed rgba(35,31,26,.3)}
  .copy{position:absolute;left:150px;top:118px;right:70px}
  .eyebrow{font-family:ui-monospace,Menlo,monospace;font-size:14px;letter-spacing:.14em;text-transform:uppercase;color:${INK_3};margin:0 0 22px}
  h1{font-family:Newsreader,serif;font-weight:500;font-size:74px;line-height:1.12;letter-spacing:-.015em;margin:0;max-width:16ch}
  .ink{width:520px;height:22px;margin-top:6px;background:${BLUE};
       -webkit-mask:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 220 12' preserveAspectRatio='none'><path d='M3 7 C 40 3, 70 10, 110 6 S 180 2, 217 7' fill='none' stroke='%23000' stroke-width='3' stroke-linecap='round'/></svg>") no-repeat center/100% 100%;
       mask:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 220 12' preserveAspectRatio='none'><path d='M3 7 C 40 3, 70 10, 110 6 S 180 2, 217 7' fill='none' stroke='%23000' stroke-width='3' stroke-linecap='round'/></svg>") no-repeat center/100% 100%}
  .lead{font-family:Newsreader,serif;font-size:26px;color:${INK_2};margin:26px 0 0;max-width:34ch}
  .foot{position:absolute;left:150px;right:70px;bottom:44px;display:flex;justify-content:space-between;align-items:baseline;font-size:20px;color:${INK_3}}
  .foot b{color:${INK};font-weight:500}
  .hand{position:absolute;right:96px;top:150px;font-family:Caveat,cursive;font-weight:600;font-size:34px;color:${PEN};transform:rotate(-6deg)}
</style>
<div class="sheet">
  <div class="lines"></div>
  <div class="margin"></div>
  <div class="stitch"></div>
  <div class="holes"></div>
  <div class="board">
    <svg viewBox="0 0 32 32">${mark({ size: 32 })}</svg><span>Açık Defter</span>
    <div class="tab"><span class="on" style="--c:#d99a2b">Ana Sayfa</span><span style="--c:#2f8f83">Yolculuğum</span><span style="--c:#c05f5f">Projeler</span><span style="--c:#4b63a8">Notlar</span></div>
  </div>
  <div class="copy">
    <p class="eyebrow">NRW, Almanya</p>
    <h1>Öğrendiğimi unutmadan buraya yazıyorum.</h1>
    <div class="ink"></div>
    <p class="lead">Almanya'da IT okuyan bir öğrencinin projeleri, notları ve öğrenme günlüğü.</p>
  </div>
  <div class="hand">no. 1</div>
  <div class="foot">
    <span><b>Farhad Yaqoobi</b> — Açık Defter</span>
    <span>acik-defter.fyajan.com</span>
  </div>
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
