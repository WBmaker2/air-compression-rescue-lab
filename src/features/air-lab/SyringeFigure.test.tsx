import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MISSIONS } from "../../content/missions";
import { labelForComparison, labelForEvidence } from "../../content/labels";
import { calculateMarkerPositions, SyringeFigure } from "./SyringeFigure";

describe("SyringeFigure — 모형 도식 계약", () => {
  it("승인된 모든 상태의 표식이 통 안에 들어온다", () => {
    for (const mission of MISSIONS) {
      for (const state of mission.states) {
        const innerWidth = state.modelVolume === 20 ? 60 : state.modelVolume === 40 ? 140 : 220;
        const positions = calculateMarkerPositions(innerWidth, state.airMarkerCount, state.spacingLevel);
        expect(positions).toHaveLength(state.airMarkerCount);
        expect(positions.every((position) => position.x >= 46 && position.x <= 254)).toBe(true);
        expect(positions.every((position) => position.y >= 66 && position.y <= 134)).toBe(true);
      }
    }
  });

  it("열림과 누출을 서로 다른 사용자 문구로 표시한다", () => {
    const open = MISSIONS.find((mission) => mission.id === "air-open-03")!.states[1];
    const leaking = MISSIONS.find((mission) => mission.id === "air-leak-05")!.states[0];
    render(
      <>
        <SyringeFigure state={open} label="열린 상태" />
        <SyringeFigure state={leaking} label="누출 상태" />
      </>
    );
    expect(screen.getByRole("img", { name: /끝 상태 열림/ })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /끝 상태 누출/ })).toBeInTheDocument();
    expect(screen.getByText(/열림 — 공기가 출구로 나갈 수 있다/)).toBeInTheDocument();
    expect(screen.getByText(/누출 — 조금씩 새어 나간다/)).toBeInTheDocument();
  });
});

describe("labels — 내부 키 비노출", () => {
  it("evidence와 compare 키를 학생용 문구로 변환한다", () => {
    expect(labelForEvidence("evidence.from.sealed-60")).not.toContain("evidence.");
    expect(labelForEvidence("evidence.compressed.markers-conserved-in-smaller-space")).toContain("작은 공간");
    expect(labelForComparison("compare.markers-lost.8")).toContain("8개");
    expect(labelForComparison("compare.spacing-narrower")).toContain("좁아졌어요");
  });
});
