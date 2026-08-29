import { expect, test } from "@playwright/test";

test("320px에서 가로 넘침이 없다", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto("./");
  let overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
  expect(overflow).toBeLessThanOrEqual(0);

  await page.getByRole("button", { name: /가상 실험 시작하기/ }).click();
  await page.getByRole("button", { name: /예측하기/ }).click();
  await page.getByRole("radio", { name: /같은 공기가 더 작은 공간에 모인다/ }).check();
  await page.getByRole("button", { name: /실행 준비/ }).click();
  await page.getByRole("button", { name: /가상 실험 실행/ }).click();
  await expect(page.getByRole("table", { name: /전후 비교/ })).toBeVisible();
  overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
  expect(overflow).toBeLessThanOrEqual(0);
});

test("375px에서 축소 모션이 gi-pulse를 제거한다", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("./");
  const pulseButton = page.getByRole("button", { name: /가상 실험 시작하기/ });
  await expect(pulseButton).toBeVisible();
  const animationName = await pulseButton.evaluate((el) => getComputedStyle(el).animationName);
  expect(animationName === "none" || animationName === "").toBe(true);
  // 축소 모션 안내가 노출된다
  await expect(page.getByText(/움직임 줄임 모드/)).toBeVisible();
});
