import { expect, test } from "@playwright/test";

test("키보드만으로 조건·예측·실행·진단을 완료한다", async ({ page }) => {
  await page.goto("./");
  await page.getByRole("button", { name: /가상 실험 시작하기/ }).focus();
  await page.keyboard.press("Enter");

  // 조건 관찰 → 예측
  await page.getByRole("button", { name: /예측하기/ }).focus();
  await page.keyboard.press("Enter");

  // 예측 선택 (Space)
  const radio = page.getByRole("radio", { name: /같은 공기가 더 작은 공간에 모인다/ });
  await radio.focus();
  await page.keyboard.press("Space");
  await page.getByRole("button", { name: /실행 준비/ }).focus();
  await page.keyboard.press("Enter");

  // 실행
  await page.getByRole("button", { name: /가상 실험 실행/ }).focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("table", { name: /전후 비교/ })).toBeVisible();

  // 근거 선택 후 진단
  await page.getByRole("checkbox", { name: /모형 부피가 줄었다/ }).focus();
  await page.keyboard.press("Space");
  await page.getByRole("button", { name: /진단하기/ }).focus();
  await page.keyboard.press("Enter");
  await page.getByRole("radio", { name: /같은 공기가 더 작은 공간에 모인다/ }).focus();
  await page.keyboard.press("Space");
  await expect(page.getByText("판단이 관찰과 일치해요")).toBeVisible();
});

test("Tab 순서에 업데이트 내역 버튼이 포함되고 Escape로 대화상자가 닫힌다", async ({ page }) => {
  await page.goto("./");
  await page.getByRole("button", { name: "업데이트 내역" }).focus();
  await page.keyboard.press("Enter");
  const dialog = page.getByRole("dialog", { name: "업데이트 내역" });
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(page.getByRole("button", { name: "업데이트 내역" })).toBeFocused();
});
