import { describe, expect, it } from "vitest";
import {
  compareAirStates,
  evaluateDiagnosis,
  findAirTransition,
  simulateAirCase,
  validateConservation,
} from "./airModel";
import { MISSIONS } from "../content/missions";
import type { AirMission } from "./types";

const mission = (id: string): AirMission => {
  const found = MISSIONS.find((candidate) => candidate.id === id);
  if (!found) throw new Error(`미션 없음: ${id}`);
  return found;
};

describe("simulateAirCase — 밀폐 push·pull", () => {
  const cases: Array<[string, string, "push" | "pull", string, string]> = [
    ["air-sealed-01", "sealed-60", "push", "sealed-40", "compressed"],
    ["air-sealed-02", "sealed-40", "push", "sealed-20", "compressed"],
    ["air-pull-04", "sealed-20", "pull", "sealed-40", "expanded"],
  ];

  for (const [missionId, fromId, action, toId, decision] of cases) {
    it(`${missionId}: ${fromId} ${action} → ${toId} (${decision})`, () => {
      const result = simulateAirCase(mission(missionId), fromId, action);
      expect(result).not.toBeNull();
      expect(result?.to.id).toBe(toId);
      expect(result?.evaluation.decision).toBe(decision);
      expect(result?.evaluation.accepted).toBe(true);
      expect(result?.evaluation.conservedMarkerCount).toBe(true);
      expect(result?.from.airMarkerCount).toBe(result?.to.airMarkerCount);
    });
  }

  it("밀폐 전이 3건 모두에서 표식이 보존되고 저항 느낌이 질적으로 변한다", () => {
    const sealed01 = simulateAirCase(mission("air-sealed-01"), "sealed-60", "push");
    expect(sealed01?.from.resistanceFeel).toBe("low");
    expect(sealed01?.to.resistanceFeel).toBe("medium");
    const sealed02 = simulateAirCase(mission("air-sealed-02"), "sealed-40", "push");
    expect(sealed02?.to.resistanceFeel).toBe("high");
    const pull = simulateAirCase(mission("air-pull-04"), "sealed-20", "pull");
    expect(pull?.to.resistanceFeel).toBe("medium");
  });
});

describe("simulateAirCase — 열린 상태", () => {
  it("air-open-03: 표식 8개가 출구로 이동하고 escaped로 판정한다", () => {
    const result = simulateAirCase(mission("air-open-03"), "open-60", "push");
    expect(result?.evaluation.decision).toBe("escaped");
    expect(result?.from.airMarkerCount).toBe(12);
    expect(result?.to.airMarkerCount).toBe(4);
    expect(result?.evaluation.conservedMarkerCount).toBeNull();
  });

  it("열린 상태에서는 보존 검사가 null이다", () => {
    const open03 = mission("air-open-03");
    const from = open03.states[0];
    const to = open03.states[1];
    expect(validateConservation(from, to)).toBeNull();
  });
});

describe("simulateAirCase — 누출과 판단 보류", () => {
  it("air-leak-05: 전이가 없어 null을 반환한다", () => {
    const result = simulateAirCase(mission("air-leak-05"), "leaking-60", "push");
    expect(result).toBeNull();
  });

  it("unknown sealState 상태로는 판정할 수 없다", () => {
    const unknownMission: AirMission = {
      ...mission("air-sealed-01"),
      states: [
        {
          id: "unknown-60",
          sealState: "unknown",
          modelVolume: 60,
          airMarkerCount: 12,
          spacingLevel: "high",
          pressureLevel: "low",
          resistanceFeel: "low",
        },
        ...mission("air-sealed-01").states,
      ],
    };
    expect(findAirTransition(unknownMission, "unknown-60", "push")).toBeUndefined();
    expect(simulateAirCase(unknownMission, "unknown-60", "push")).toBeNull();
  });

  it("잘못된 전이(다른 상태에서 push)는 null을 반환한다", () => {
    expect(simulateAirCase(mission("air-sealed-01"), "sealed-40", "push")).toBeNull();
    expect(simulateAirCase(mission("air-sealed-01"), "sealed-20", "pull")).toBeNull();
  });

  it("존재하지 않는 상태 ID도 null을 반환한다", () => {
    expect(simulateAirCase(mission("air-sealed-01"), "ghost-60", "push")).toBeNull();
  });
});

describe("여섯 미션의 기대 결과 재현 (컴포넌트 없이 순수 함수만)", () => {
  it("승인된 전이만으로 기대 판단이 재현된다", () => {
    const decisions = [
      simulateAirCase(mission("air-sealed-01"), "sealed-60", "push")?.evaluation.decision,
      simulateAirCase(mission("air-sealed-02"), "sealed-40", "push")?.evaluation.decision,
      simulateAirCase(mission("air-open-03"), "open-60", "push")?.evaluation.decision,
      simulateAirCase(mission("air-pull-04"), "sealed-20", "pull")?.evaluation.decision,
    ];
    expect(decisions).toEqual(["compressed", "compressed", "escaped", "expanded"]);
    const leak = simulateAirCase(mission("air-leak-05"), "leaking-60", "push");
    expect(leak).toBeNull();
    const diagnosis = evaluateDiagnosis(mission("air-diagnose-06"), "leaking");
    expect(diagnosis.correct).toBe(true);
  });

  it("진단을 틀리면 근거 재확인 키를 반환한다", () => {
    const wrong = evaluateDiagnosis(mission("air-diagnose-06"), "sealed");
    expect(wrong.correct).toBe(false);
    expect(wrong.evidenceKeys).toContain("evidence.diagnosis.check-marker-count");
  });
});

describe("readonly 입력과 어린이용 evidence", () => {
  it("입력 미션을 변이하지 않는다", () => {
    const target = JSON.parse(JSON.stringify(mission("air-sealed-01"))) as AirMission;
    const snapshot = JSON.stringify(target);
    simulateAirCase(target, "sealed-60", "push");
    compareAirStates(target.states[0], target.states[1]);
    expect(JSON.stringify(target)).toBe(snapshot);
  });

  it("모든 전이 결과에 어린이용 evidenceKeys가 있다", () => {
    for (const candidate of MISSIONS) {
      for (const state of candidate.states) {
        for (const action of ["push", "pull"] as const) {
          const result = simulateAirCase(candidate, state.id, action);
          if (!result) continue;
          expect(result.evaluation.evidenceKeys.length).toBeGreaterThan(0);
          for (const key of result.evaluation.evidenceKeys) {
            expect(key.startsWith("evidence.")).toBe(true);
          }
        }
      }
    }
  });
});

describe("compareAirStates", () => {
  it("압축 전후 비교 키를 반환한다", () => {
    const result = simulateAirCase(mission("air-sealed-01"), "sealed-60", "push");
    expect(result).not.toBeNull();
    const keys = compareAirStates(result!.from, result!.to);
    expect(keys).toContain("compare.volume-decreased");
    expect(keys).toContain("compare.markers-conserved");
    expect(keys).toContain("compare.spacing-narrower");
    expect(keys).toContain("compare.resistance-higher");
  });
});
