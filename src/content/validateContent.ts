import type { AirMission, AirState } from "../domain/types";
import { MISSIONS, MISSION_IDS } from "./missions";

const APPROVED_MISSION_IDS = [
  "air-sealed-01",
  "air-sealed-02",
  "air-open-03",
  "air-pull-04",
  "air-leak-05",
  "air-diagnose-06",
] as const;

/** 승인된 상태 fixture (계획 문서 4.1 표). 벗어나는 값은 빌드를 실패시킨다. */
const APPROVED_STATES: Readonly<Record<string, AirState>> = {
  "sealed-60": {
    id: "sealed-60",
    sealState: "sealed",
    modelVolume: 60,
    airMarkerCount: 12,
    spacingLevel: "high",
    pressureLevel: "low",
    resistanceFeel: "low",
  },
  "sealed-40": {
    id: "sealed-40",
    sealState: "sealed",
    modelVolume: 40,
    airMarkerCount: 12,
    spacingLevel: "medium",
    pressureLevel: "medium",
    resistanceFeel: "medium",
  },
  "sealed-20": {
    id: "sealed-20",
    sealState: "sealed",
    modelVolume: 20,
    airMarkerCount: 12,
    spacingLevel: "low",
    pressureLevel: "high",
    resistanceFeel: "high",
  },
  "open-60": {
    id: "open-60",
    sealState: "open",
    modelVolume: 60,
    airMarkerCount: 12,
    spacingLevel: "high",
    pressureLevel: "low",
    resistanceFeel: "low",
  },
  "open-20": {
    id: "open-20",
    sealState: "open",
    modelVolume: 20,
    airMarkerCount: 4,
    spacingLevel: "high",
    pressureLevel: "low",
    resistanceFeel: "low",
  },
  "leaking-60": {
    id: "leaking-60",
    sealState: "leaking",
    modelVolume: 60,
    airMarkerCount: 12,
    spacingLevel: "high",
    pressureLevel: "low",
    resistanceFeel: "low",
  },
};

const APPROVED_TRANSITIONS = new Set([
  "sealed-60-push-40",
  "sealed-40-push-20",
  "open-60-push-20",
  "sealed-20-pull-40",
]);

export interface ContentValidationResult {
  readonly ok: boolean;
  readonly errors: readonly string[];
}

export function validateContent(
  missions: readonly AirMission[] = MISSIONS
): ContentValidationResult {
  const errors: string[] = [];

  if (missions.length !== 6) {
    errors.push(`미션은 정확히 6개여야 합니다: 현재 ${missions.length}개`);
  }

  const seenIds = new Set<string>();
  for (const mission of missions) {
    if (seenIds.has(mission.id)) errors.push(`미션 ID가 중복됩니다: ${mission.id}`);
    seenIds.add(mission.id);
  }

  for (const mission of missions) {
    if (!APPROVED_MISSION_IDS.includes(mission.id)) {
      errors.push(`승인되지 않은 미션 ID입니다: ${mission.id}`);
    }
    if (mission.reviewStatus !== "approved") {
      errors.push(`검수되지 않은 미션이 있습니다: ${mission.id} (${mission.reviewStatus})`);
    }
    if (!mission.sourceNote || mission.sourceNote.trim().length < 10) {
      errors.push(`sourceNote가 필요합니다: ${mission.id}`);
    }
    if (!mission.misconceptionGuard || mission.misconceptionGuard.trim().length < 10) {
      errors.push(`misconceptionGuard가 필요합니다: ${mission.id}`);
    }
    if (!mission.scene || !mission.task || !mission.title) {
      errors.push(`어린이용 문구(title/scene/task)가 필요합니다: ${mission.id}`);
    }
    if (
      !mission.expectedDiagnosis &&
      (mission.expectedDecisions.length === 0 || mission.expectedDecisions.length > 2)
    ) {
      errors.push(`기대 판단이 1~2개(복수 해법)여야 합니다: ${mission.id}`);
    }

    const stateIds = new Set<string>();
    for (const state of mission.states) {
      if (stateIds.has(state.id)) errors.push(`상태 ID가 중복됩니다: ${mission.id}/${state.id}`);
      stateIds.add(state.id);
      const approved = APPROVED_STATES[state.id];
      if (!approved) {
        errors.push(`승인되지 않은 상태입니다: ${mission.id}/${state.id}`);
      } else if (JSON.stringify(state) !== JSON.stringify(approved)) {
        errors.push(`상태 값이 승인된 fixture와 다릅니다: ${mission.id}/${state.id}`);
      }
    }

    for (const transition of mission.transitions) {
      if (!stateIds.has(transition.fromStateId)) {
        errors.push(`from 상태가 미션에 없습니다: ${mission.id}/${transition.fromStateId}`);
      }
      if (!stateIds.has(transition.toStateId)) {
        errors.push(`to 상태가 미션에 없습니다: ${mission.id}/${transition.toStateId}`);
      }
      if (!APPROVED_TRANSITIONS.has(transition.id)) {
        errors.push(`승인되지 않은 전이입니다: ${mission.id}/${transition.id}`);
      }
      if (transition.observationKeys.length === 0) {
        errors.push(`전이에 관찰 키가 없습니다: ${mission.id}/${transition.id}`);
      }
    }

    if (mission.id === "air-sealed-01" || mission.id === "air-sealed-02" || mission.id === "air-pull-04") {
      const from = mission.states[0];
      const to = mission.states[1];
      if (from && to && from.sealState === "sealed" && from.airMarkerCount !== to.airMarkerCount) {
        errors.push(`밀폐 미션에서 표식 수가 보존되지 않습니다: ${mission.id}`);
      }
    }
  }

  if (!MISSION_IDS || MISSION_IDS.length !== missions.length) {
    errors.push("MISSION_IDS가 미션 목록과 일치하지 않습니다");
  }

  return { ok: errors.length === 0, errors };
}

const result = validateContent();
if (!result.ok) {
  throw new Error(`검수되지 않은 콘텐츠로 빌드를 중단합니다:\n- ${result.errors.join("\n- ")}`);
}
