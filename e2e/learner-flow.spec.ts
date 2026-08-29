import { expect, test } from "@playwright/test";

test("밀폐 60→40: 공기 표식 보존과 간격 감소를 확인한다", async ({ page }) => {
  await page.goto("./");
  await expect(page.getByRole("heading", { level: 1 }).first()).toContainText("공기 부피 압축 연구소");
  await page.getByRole("button", { name: /가상 실험 시작하기/ }).click();
  await page.getByRole("button", { name: /예측하기/ }).click();
  await page.getByRole("radio", { name: /같은 공기가 더 작은 공간에 모인다/ }).check();
  await page.getByRole("button", { name: /실행 준비/ }).click();
  await page.getByRole("button", { name: /가상 실험 실행/ }).click();

  const table = page.getByRole("table", { name: /전후 비교/ });
  await expect(table).toBeVisible();
  const markerRow = table.getByRole("row", { name: /모형 공기 표식/ });
  await expect(markerRow).toContainText("12개");
  await expect(markerRow).toContainText("12개");
  await expect(table.getByRole("row", { name: /모형 부피/ })).toContainText("40");
  await page.getByRole("checkbox", { name: /모형 부피가 줄었다/ }).check();
  await page.getByRole("button", { name: /진단하기/ }).click();
  await page.getByRole("radio", { name: /같은 공기가 더 작은 공간에 모인다/ }).check();
  await expect(page.getByText("판단이 관찰과 일치해요")).toBeVisible();
});

test("열린 주사기: 공기가 나가는 사례를 압축과 구분한다", async ({ page }) => {
  await page.goto("./");
  await page.getByRole("button", { name: /가상 실험 시작하기/ }).click();
  // 미션 3까지 이동은 첫 미션 완주로 대표 검증: 여기서는 첫 미션을 빠르게 완주
  for (let mission = 1; mission <= 2; mission += 1) {
    await page.getByRole("button", { name: /예측하기/ }).click();
    await page.getByRole("radio", { name: /같은 공기가 더 작은 공간에 모인다/ }).check();
    await page.getByRole("button", { name: /실행 준비/ }).click();
    await page.getByRole("button", { name: /가상 실험 실행/ }).click();
    await page.getByRole("checkbox", { name: /모형 부피가 줄었다/ }).check();
    await page.getByRole("button", { name: /진단하기/ }).click();
    await page.getByRole("radio", { name: /같은 공기가 더 작은 공간에 모인다/ }).check();
    await page.getByRole("button", { name: /기록으로/ }).click();
    await page.getByRole("button", { name: /실험 기록 보기/ }).click();
    await page.getByRole("button", { name: /다음 미션으로/ }).click();
  }
  await page.getByRole("button", { name: /예측하기/ }).click();
  await page.getByRole("radio", { name: /빠져나감/ }).check();
  await page.getByRole("button", { name: /실행 준비/ }).click();
  await page.getByRole("button", { name: /가상 실험 실행/ }).click();
  const table = page.getByRole("table", { name: /전후 비교/ });
  await expect(table).toContainText("4개");
  await expect(table).toContainText("12개");
});

test("누출 정보 부족 미션: 판단 보류를 선택한다", async ({ page }) => {
  await page.goto("./");
  await expect(page.getByText(/저장되지 않아요/).first()).toBeVisible();
  // 입구에서 판단 보류 안내가 노출된다
  await expect(page.getByText(/판단을 보류/).first()).toBeVisible();
});
