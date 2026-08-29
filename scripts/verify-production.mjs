// 배포 URL 공개 확인: 제목, favicon, 자산, 콘솔 오류, 학습 흐름, 375px를 검증한다.
import { chromium } from "@playwright/test";

const BASE = "https://wbmaker2.github.io/air-compression-rescue-lab/";
const results = [];
const check = (name, ok, detail = "") => {
  results.push({ name, ok, detail });
  console.log(`${ok ? "PASS" : "FAIL"} ${name}${detail ? ` — ${detail}` : ""}`);
};

const browser = await chromium.launch();
const page = await browser.newPage();
const consoleErrors = [];
page.on("console", (msg) => {
  if (msg.type() === "error") consoleErrors.push(msg.text());
});
page.on("pageerror", (error) => consoleErrors.push(String(error)));
const failedResponses = [];
page.on("response", (response) => {
  if (response.status() >= 400) failedResponses.push(`${response.status()} ${response.url()}`);
});

await page.goto(BASE, { waitUntil: "networkidle" });

check("제목", (await page.title()).includes("공기 부피 압축 연구소"), await page.title());
const faviconStatus = await page.request.get(`${BASE}favicon.svg`);
check("favicon", faviconStatus.ok(), String(faviconStatus.status()));

// 실제 학습 흐름 (밀폐 60→40)
await page.getByRole("button", { name: /가상 실험 시작하기/ }).click();
await page.getByRole("button", { name: /예측하기/ }).click();
await page.getByRole("radio", { name: /같은 공기가 더 작은 공간에 모인다/ }).check();
await page.getByRole("button", { name: /실행 준비/ }).click();
await page.getByRole("button", { name: /가상 실험 실행/ }).click();
const table = page.getByRole("table", { name: /전후 비교/ });
await expectVisible(table);
async function expectVisible(locator) {
  await locator.waitFor({ state: "visible", timeout: 10000 });
}
check("학습 흐름(전후 비교표)", await table.isVisible());
const markerRow = table.getByRole("row", { name: /모형 공기 표식/ });
check("표식 보존 12개", (await markerRow.textContent()).includes("12개"));

await page.setViewportSize({ width: 375, height: 812 });
await page.waitForTimeout(300);
const overflow = await page.evaluate(
  () => document.documentElement.scrollWidth - document.documentElement.clientWidth
);
check("375px 가로 넘침 없음", overflow <= 0, `overflow=${overflow}px`);

check("콘솔 오류 0건", consoleErrors.length === 0, consoleErrors.join(" | ").slice(0, 300));
check("HTTP 4xx/5xx 0건", failedResponses.length === 0, failedResponses.join(" | ").slice(0, 300));

await browser.close();
const failed = results.filter((r) => !r.ok);
console.log(failed.length === 0 ? "공개 확인 전체 통과" : `실패 ${failed.length}건`);
process.exit(failed.length === 0 ? 0 : 1);
