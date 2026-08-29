import { describe, expect, it } from "vitest";
import { MISSIONS, MISSION_IDS } from "./missions";
import { validateContent } from "./validateContent";

describe("missions 콘텐츠", () => {
  it("정확히 6개의 미션을 제공한다", () => {
    expect(MISSIONS).toHaveLength(6);
  });

  it("미션 ID가 계획 문서의 6개 ID와 정확히 일치한다", () => {
    expect([...MISSION_IDS]).toEqual([
      "air-sealed-01",
      "air-sealed-02",
      "air-open-03",
      "air-pull-04",
      "air-leak-05",
      "air-diagnose-06",
    ]);
  });

  it("모든 미션에 검수 메타데이터가 있다", () => {
    for (const mission of MISSIONS) {
      expect(mission.reviewStatus).toBe("approved");
      expect(mission.sourceNote.length).toBeGreaterThan(10);
      expect(mission.misconceptionGuard.length).toBeGreaterThan(10);
    }
  });

  it("모든 전이의 from·to 상태가 해당 미션에 존재한다", () => {
    for (const mission of MISSIONS) {
      const ids = new Set(mission.states.map((state) => state.id));
      for (const transition of mission.transitions) {
        expect(ids.has(transition.fromStateId)).toBe(true);
        expect(ids.has(transition.toStateId)).toBe(true);
      }
    }
  });

  it("sealed 승인 signature(표식 보존, 저항 증가)와 open signature(표식 감소)가 고정되어 있다", () => {
    const sealed01 = MISSIONS[0];
    expect(sealed01.id).toBe("air-sealed-01");
    const before = sealed01.states[0];
    const after = sealed01.states[1];
    expect(before.airMarkerCount).toBe(12);
    expect(after.airMarkerCount).toBe(12);
    expect(after.resistanceFeel).toBe("medium");

    const open03 = MISSIONS.find((mission) => mission.id === "air-open-03");
    const escaped = open03?.states[1];
    expect(escaped?.airMarkerCount).toBe(4);
  });
});

describe("validateContent", () => {
  it("승인된 콘텐츠를 통과시킨다", () => {
    const result = validateContent();
    expect(result.errors).toEqual([]);
    expect(result.ok).toBe(true);
  });

  it("미션 수가 6개가 아니면 실패한다", () => {
    const result = validateContent(MISSIONS.slice(0, 5));
    expect(result.ok).toBe(false);
    expect(result.errors.some((error) => error.includes("정확히 6개"))).toBe(true);
  });

  it("ID가 중복되면 실패한다", () => {
    const duplicated = [...MISSIONS, { ...MISSIONS[0] }];
    const result = validateContent(duplicated);
    expect(result.ok).toBe(false);
    expect(result.errors.some((error) => error.includes("중복"))).toBe(true);
  });

  it("검수되지 않은 미션이 있으면 실패한다", () => {
    const pending = MISSIONS.map((mission, index) =>
      index === 0 ? { ...mission, reviewStatus: "pending" as const } : mission
    );
    const result = validateContent(pending);
    expect(result.ok).toBe(false);
    expect(result.errors.some((error) => error.includes("검수되지 않은 미션"))).toBe(true);
  });

  it("오개념 방지 문구가 없으면 실패한다", () => {
    const missing = MISSIONS.map((mission, index) =>
      index === 2 ? { ...mission, misconceptionGuard: "" } : mission
    );
    const result = validateContent(missing);
    expect(result.ok).toBe(false);
    expect(result.errors.some((error) => error.includes("misconceptionGuard"))).toBe(true);
  });

  it("승인되지 않은 전이가 있으면 실패한다", () => {
    const rogue = MISSIONS.map((mission, index) =>
      index === 0
        ? {
            ...mission,
            transitions: [
              {
                ...mission.transitions[0],
                id: "sealed-60-push-20",
                toStateId: "sealed-40",
              },
            ],
          }
        : mission
    );
    const result = validateContent(rogue);
    expect(result.ok).toBe(false);
    expect(result.errors.some((error) => error.includes("승인되지 않은 전이"))).toBe(true);
  });
});
