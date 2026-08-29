// HVC(vibehong.shop) 등록용 썸네일 생성: 배포된 앱 입구를 1280×800로 캡처한다.
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { chromium } from "@playwright/test";

const OUT_DIR = join(process.cwd(), "docs", "hvc-registration");
mkdirSync(OUT_DIR, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
await page.goto("https://wbmaker2.github.io/air-compression-rescue-lab/", {
  waitUntil: "networkidle",
});
await page.waitForTimeout(800);
const path = join(OUT_DIR, "hvc-thumbnail-1280x800.png");
await page.screenshot({ path });
await browser.close();
console.log(`썸네일 생성: ${path}`);
