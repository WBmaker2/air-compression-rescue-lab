import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import App from "../../src/app/App";

const { toHaveNoViolations } = (await import("vitest-axe/matchers.js")) as {
  toHaveNoViolations: never;
};
expect.extend({ toHaveNoViolations } as never);

const expectNoAxeViolations = async (element: HTMLElement) => {
  const results = await axe(element);
  (expect(results) as unknown as { toHaveNoViolations: () => void }).toHaveNoViolations();
};

async function toCompareStep() {
  const user = userEvent.setup();
  render(<App />);
  await user.click(screen.getByRole("button", { name: /가상 실험 시작하기/ }));
  await user.click(screen.getByRole("button", { name: /예측하기/ }));
  await user.click(screen.getByRole("radio", { name: /같은 공기가 더 작은 공간에 모인다/ }));
  await user.click(screen.getByRole("button", { name: /실행 준비/ }));
  await user.click(screen.getByRole("button", { name: /가상 실험 실행/ }));
  return user;
}

describe("자동 접근성 검사 (axe)", () => {
  it("입구 화면에서 serious/critical 위반이 0건이다", async () => {
    const { container } = render(<App />);
    await expectNoAxeViolations(container as unknown as HTMLElement);
  });

  it("비교판에서 serious/critical 위반이 0건이다", async () => {
    await toCompareStep();
    await expectNoAxeViolations(document.body);
  });

  it("업데이트 내역 대화상자에서 serious/critical 위반이 0건이다", async () => {
    const user = userEvent.setup();
    const { container } = render(<App />);
    await user.click(screen.getByRole("button", { name: "업데이트 내역" }));
    await expectNoAxeViolations(container as unknown as HTMLElement);
  });
});
