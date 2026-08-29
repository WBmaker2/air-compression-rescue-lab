// 생성 이미지 자산 제작 스크립트: Chromium canvas로 로컬 webp를 만든다.
// 입력 그림은 문자·수치 없는 밝은 가상 연구소 분위기 일러스트(SVG)다.
import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { chromium } from "@playwright/test";

const OUT = join(process.cwd(), "src", "assets", "generated", "safe-virtual-air-lab.webp");

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="960" height="420" viewBox="0 0 960 420">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#dbeafe"/><stop offset="1" stop-color="#fef9c3"/>
    </linearGradient>
  </defs>
  <rect width="960" height="420" fill="url(#sky)"/>
  <rect x="0" y="330" width="960" height="90" fill="#bfdbfe"/>
  <circle cx="130" cy="90" r="46" fill="#fef3c7" stroke="#f59e0b" stroke-width="4"/>
  <circle cx="820" cy="70" r="30" fill="#ffffff" opacity="0.8"/>
  <circle cx="880" cy="110" r="20" fill="#ffffff" opacity="0.6"/>
  <rect x="120" y="330" width="720" height="16" fill="#93c5fd"/>
  <!-- 실험대 -->
  <rect x="150" y="250" width="300" height="18" rx="6" fill="#64748b"/>
  <rect x="170" y="268" width="14" height="66" fill="#475569"/>
  <rect x="416" y="268" width="14" height="66" fill="#475569"/>
  <!-- 주사기 모형 -->
  <rect x="180" y="200" width="200" height="52" rx="10" fill="#e0f2fe" stroke="#334155" stroke-width="4"/>
  <rect x="180" y="204" width="120" height="44" rx="8" fill="#bae6fd"/>
  <rect x="296" y="206" width="12" height="44" rx="4" fill="#f59e0b" stroke="#92400e" stroke-width="2"/>
  <circle cx="210" cy="226" r="7" fill="#1e3a8a"/>
  <circle cx="244" cy="218" r="7" fill="#1e3a8a"/>
  <circle cx="244" cy="236" r="7" fill="#1e3a8a"/>
  <circle cx="272" cy="227" r="7" fill="#1e3a8a"/>
  <!-- 선반과 책상 -->
  <rect x="560" y="150" width="260" height="12" rx="6" fill="#94a3b8"/>
  <rect x="560" y="230" width="260" height="12" rx="6" fill="#94a3b8"/>
  <rect x="590" y="180" width="60" height="70" rx="6" fill="#fca5a5"/>
  <rect x="680" y="100" width="50" height="50" rx="8" fill="#a5b4fc"/>
  <rect x="760" y="255" width="44" height="75" rx="6" fill="#86efac"/>
  <rect x="588" y="255" width="120" height="14" rx="6" fill="#64748b"/>
  <rect x="600" y="269" width="12" height="61" fill="#475569"/>
  <rect x="684" y="269" width="12" height="61" fill="#475569"/>
  <!-- 공기 방울 -->
  <circle cx="470" cy="120" r="14" fill="#ffffff" opacity="0.75"/>
  <circle cx="510" cy="90" r="9" fill="#ffffff" opacity="0.65"/>
  <circle cx="445" cy="80" r="6" fill="#ffffff" opacity="0.6"/>
</svg>`;

mkdirSync(dirname(OUT), { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 960, height: 420 } });
await page.setContent(`<body style="margin:0">${svg}</body>`);
const dataUrl = await page.evaluate(async () => {
  const svgElement = document.querySelector("svg");
  const canvas = document.createElement("canvas");
  canvas.width = 960;
  canvas.height = 420;
  const context = canvas.getContext("2d");
  const image = new Image();
  const svgBlob = new Blob([svgElement.outerHTML], { type: "image/svg+xml" });
  const url = URL.createObjectURL(svgBlob);
  await new Promise((resolve, reject) => {
    image.onload = resolve;
    image.onerror = reject;
    image.src = url;
  });
  context.drawImage(image, 0, 0);
  URL.revokeObjectURL(url);
  return canvas.toDataURL("image/webp", 0.9);
});
await browser.close();

const base64 = dataUrl.replace(/^data:image\/webp;base64,/, "");
writeFileSync(OUT, Buffer.from(base64, "base64"));
if (!existsSync(OUT)) throw new Error("webp 생성 실패");
console.log(`생성 완료: ${OUT}`);
