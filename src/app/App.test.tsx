import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

async function startFirstMission(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole("button", { name: /가상 실험 시작하기/ }));
  await user.click(screen.getByRole("button", { name: /예측하기/ }));
}

async function startStepOnly(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole("button", { name: /가상 실험 시작하기/ }));
}

async function beginObservation(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole("button", { name: /예측하기/ }));
}

describe("App — 입구", () => {
  it("본문 건너뛰기 링크가 실제 main을 가리킨다", () => {
    render(<App />);
    expect(screen.getByRole("link", { name: "본문으로 건너뛰기" })).toHaveAttribute(
      "href",
      "#main-content"
    );
  });

  it("학습 목표, 6개 미션, 새로고침 경고, 업데이트 내역을 보여 준다", () => {
    render(<App />);
    expect(screen.getByText(/오늘의 목표/)).toBeInTheDocument();
    expect(screen.getByText(/air-sealed-01|밀폐 주사기 60/)).toBeInTheDocument();
    expect(screen.getByText(/새로고침하면 지금까지의 답이 사라져요/)).toBeInTheDocument();
    const items = screen.getAllByRole("listitem");
    const missionItems = items.filter((item) => /미션 \d\./.test(item.textContent ?? ""));
    expect(missionItems).toHaveLength(6);
    expect(screen.getByRole("button", { name: "업데이트 내역" })).toBeInTheDocument();
    expect(screen.queryByText(/실제 주사기를/)).not.toBeInTheDocument();
  });

  it("업데이트 내역 대화상자는 열고 닫으면 호출 버튼으로 초점이 돌아온다", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: "업데이트 내역" }));
    const dialog = screen.getByRole("dialog", { name: "업데이트 내역" });
    expect(within(dialog).getByText(/구현 계획 확정/)).toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "업데이트 내역" })).toHaveFocus();
  });

  it("시작하면 조건 관찰 단계로 이동하고 제목으로 초점이 이동한다", async () => {
    const user = userEvent.setup();
    render(<App />);
    await startStepOnly(user);
    expect(screen.getByRole("heading", { name: /조건 관찰/ })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 })).toHaveFocus();
  });

  it("예측 단계에서 이전 단계로 돌아갈 수 있다", async () => {
    const user = userEvent.setup();
    render(<App />);
    await startFirstMission(user);
    await user.click(screen.getByRole("button", { name: "이전 단계" }));
    expect(screen.getByRole("heading", { name: /조건 관찰/ })).toBeInTheDocument();
  });
});

describe("App — 첫 미션 전체 흐름 (air-sealed-01)", () => {
  it("관찰 → 예측 → 실행 → 비교 → 진단 → 기록까지 완주한다", async () => {
    const user = userEvent.setup();
    render(<App />);
    await startFirstMission(user);

    await user.click(screen.getByRole("radio", { name: /같은 공기가 더 작은 공간에 모인다/ }));
    await user.click(screen.getByRole("button", { name: /실행 준비/ }));

    await user.click(screen.getByRole("button", { name: /가상 실험 실행/ }));

    expect(screen.getByRole("heading", { name: /비교판/ })).toBeInTheDocument();
    expect(screen.getByText("전후 비교 (모형 값)")).toBeInTheDocument();
    await user.click(screen.getByRole("checkbox", { name: /모형 부피가 줄었다/ }));
    await user.click(screen.getByRole("button", { name: /진단하기/ }));

    await user.click(screen.getByRole("radio", { name: /같은 공기가 더 작은 공간에 모인다/ }));
    expect(screen.getByText("판단이 관찰과 일치해요")).toBeInTheDocument();
    expect(screen.queryByText(/처음 판단을 관찰 근거로 수정했어요/)).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /기록으로/ }));
    expect(screen.getByRole("heading", { name: /검토판/ })).toBeInTheDocument();
    expect(screen.queryByText(/처음 판단을 관찰 근거로 수정했어요/)).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /실험 기록 보기/ }));

    expect(screen.getByRole("heading", { name: /미션 1 기록/ })).toBeInTheDocument();
    expect(screen.getByText(/최초 예측/)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /다음 미션으로/ }));
    expect(screen.getByRole("heading", { name: /미션 2/ })).toBeInTheDocument();
  });

  it("오답을 고르면 정답을 공개하지 않고 근거 재확인과 수정 기회를 준다", async () => {
    const user = userEvent.setup();
    render(<App />);
    await startFirstMission(user);

    await user.click(screen.getByRole("radio", { name: /같은 공기가 더 작은 공간에 모인다/ }));
    await user.click(screen.getByRole("button", { name: /실행 준비/ }));
    await user.click(screen.getByRole("button", { name: /가상 실험 실행/ }));
    await user.click(screen.getByRole("checkbox", { name: /모형 부피가 줄었다/ }));
    await user.click(screen.getByRole("button", { name: /진단하기/ }));

    await user.click(screen.getByRole("radio", { name: /빠져나감/ }));
    expect(screen.getByText("관찰 근거를 다시 확인해 볼까요?")).toBeInTheDocument();
    expect(screen.queryByText(/정답은/)).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /검토하기/ }));
    expect(screen.getByText(/한 번 수정할 수 있어요/)).toBeInTheDocument();
  });
});

describe("App — 판단 보류 미션 (air-leak-05)", () => {
  it("정보 부족 판단 보류를 고르면 정상 판정된다", async () => {
    const user = userEvent.setup();
    render(<App />);
    const answers = [
      /같은 공기가 더 작은 공간에 모인다/,
      /같은 공기가 더 작은 공간에 모인다/,
      /빠져나감/,
      /공간이 커지고 간격이 넓어진다/,
    ];
    for (const [index, answer] of answers.entries()) {
      if (index === 0) {
        await startStepOnly(user);
      }
      await beginObservation(user);
      await user.click(screen.getByRole("radio", { name: answer }));
      await user.click(screen.getByRole("button", { name: /실행 준비/ }));
      await user.click(screen.getByRole("button", { name: /가상 실험 실행|관찰 결과 확인/ }));
      await user.click(screen.getAllByRole("checkbox")[0]);
      await user.click(screen.getByRole("button", { name: /진단하기/ }));
      await user.click(screen.getByRole("radio", { name: answer }));
      await user.click(screen.getByRole("button", { name: /기록으로/ }));
      await user.click(screen.getByRole("button", { name: /실험 기록 보기/ }));
      await user.click(screen.getByRole("button", { name: /다음 미션으로/ }));
    }

    // 미션 5: 누출 — 근거를 확인할 관찰 기록이 제공되지 않는다
    expect(screen.getByText(/얼마나 새는지.*알려지지 않았습니다/)).toBeInTheDocument();
    await beginObservation(user);
    await user.click(screen.getByRole("radio", { name: /정보가 부족해 판단을 보류한다/ }));
    await user.click(screen.getByRole("button", { name: /실행 준비/ }));
    await user.click(screen.getByRole("button", { name: /관찰 결과 확인/ }));
    expect(screen.getByRole("button", { name: /진단하기/ })).toBeDisabled();
    expect(screen.getByText(/판단을 보류하는 것/)).toBeInTheDocument();
  });
});

describe("App — 관찰 기록 진단 미션 (air-diagnose-06)", () => {
  it("누출 진단 피드백에 실제 12→10→8 관찰 근거를 보여 준다", async () => {
    const user = userEvent.setup();
    render(<App />);
    const answers = [
      /같은 공기가 더 작은 공간에 모인다/,
      /같은 공기가 더 작은 공간에 모인다/,
      /빠져나감/,
      /공간이 커지고 간격이 넓어진다/,
    ];

    for (const [index, answer] of answers.entries()) {
      if (index === 0) await startStepOnly(user);
      await beginObservation(user);
      await user.click(screen.getByRole("radio", { name: answer }));
      await user.click(screen.getByRole("button", { name: /실행 준비/ }));
      await user.click(screen.getByRole("button", { name: /가상 실험 실행|관찰 결과 확인/ }));
      await user.click(screen.getAllByRole("checkbox")[0]);
      await user.click(screen.getByRole("button", { name: /진단하기/ }));
      await user.click(screen.getByRole("radio", { name: answer }));
      await user.click(screen.getByRole("button", { name: /기록으로/ }));
      await user.click(screen.getByRole("button", { name: /실험 기록 보기/ }));
      await user.click(screen.getByRole("button", { name: /다음 미션으로/ }));
    }

    await beginObservation(user);
    await user.click(screen.getByRole("radio", { name: /정보가 부족해 판단을 보류한다/ }));
    await user.click(screen.getByRole("button", { name: /실행 준비/ }));
    await user.click(screen.getByRole("button", { name: /관찰 결과 확인/ }));
    await user.click(screen.getByRole("checkbox", { name: /누출량과 누른 뒤 변화 정보/ }));
    await user.click(screen.getByRole("button", { name: /진단하기/ }));
    await user.click(screen.getByRole("radio", { name: /정보가 부족해 판단을 보류한다/ }));
    await user.click(screen.getByRole("button", { name: /기록으로/ }));
    await user.click(screen.getByRole("button", { name: /실험 기록 보기/ }));
    await user.click(screen.getByRole("button", { name: /다음 미션으로/ }));

    expect(screen.getByText(/관찰 1: 모형 부피 60.*저항 낮음/)).toBeInTheDocument();
    expect(screen.getByText(/관찰 3: 모형 부피 20.*저항 중간/)).toBeInTheDocument();
    await beginObservation(user);
    expect(screen.getByText("관찰 기록을 보기 전, 어떤 결과를 먼저 예상하나요?")).toBeInTheDocument();
    await user.click(screen.getByRole("radio", { name: /같은 공기가 더 작은 공간에 모인다/ }));
    await user.click(screen.getByRole("button", { name: /실행 준비/ }));
    await user.click(screen.getByRole("button", { name: /관찰 결과 확인/ }));

    await user.click(screen.getByRole("checkbox", { name: /표식 수가 12→10→8로 줄어드는 누출 무늬/ }));
    await user.click(screen.getByRole("button", { name: /진단하기/ }));
    await user.click(screen.getByRole("radio", { name: /누출 — 조금씩 새어 나간다/ }));

    expect(screen.getByText("판단이 관찰과 일치해요")).toBeInTheDocument();
    expect(screen.getByText("표식 수가 12→10→8로 줄어드는 누출 무늬가 나타났다")).toBeInTheDocument();
    expect(screen.queryByText(/누출량과 누른 뒤 변화 정보가 부족해 확정할 수 없다/)).not.toBeInTheDocument();
  });
});
