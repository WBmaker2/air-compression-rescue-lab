import type {
  AirDecision,
  AirEvaluation,
  AirMission,
  AirState,
  AirTransition,
  SealState,
} from "./types";

const LEVEL_ORDER = { low: 0, medium: 1, high: 2 } as const;

export function findAirState(
  mission: AirMission,
  stateId: string
): AirState | undefined {
  return mission.states.find((state) => state.id === stateId);
}

export function findAirTransition(
  mission: AirMission,
  fromStateId: string,
  action: "push" | "pull"
): AirTransition | undefined {
  return mission.transitions.find(
    (transition) => transition.fromStateId === fromStateId && transition.action === action
  );
}

/**
 * 승인된 유한 상태 전이표만 조회한다. 연속 물리식 계산은 하지 않으며,
 * 알 수 없는 상태·전이는 insufficient-information을 반환한다.
 */
export function simulateAirCase(
  mission: AirMission,
  fromStateId: string,
  action: "push" | "pull"
): { from: AirState; to: AirState; evaluation: AirEvaluation } | null {
  const from = findAirState(mission, fromStateId);
  const transition = findAirTransition(mission, fromStateId, action);
  if (!from || !transition) return null;
  const to = findAirState(mission, transition.toStateId);
  if (!to) return null;

  const conservedMarkerCount =
    from.sealState === "sealed" ? from.airMarkerCount === to.airMarkerCount : null;

  const decision: AirDecision =
    to.modelVolume < from.modelVolume && conservedMarkerCount
      ? "compressed"
      : to.modelVolume > from.modelVolume && conservedMarkerCount
        ? "expanded"
        : to.airMarkerCount < from.airMarkerCount
          ? "escaped"
          : "insufficient-information";

  return {
    from,
    to,
    evaluation: {
      accepted: mission.expectedDecisions.includes(decision),
      decision,
      conservedMarkerCount,
      observationKeys: [...transition.observationKeys],
      evidenceKeys: [
        `evidence.from.${from.id}`,
        `evidence.to.${to.id}`,
        decision === "compressed"
          ? "evidence.compressed.markers-conserved-in-smaller-space"
          : decision === "expanded"
            ? "evidence.expanded.same-markers-in-larger-space"
            : decision === "escaped"
              ? "evidence.escaped.markers-left-through-opening"
              : "evidence.unknown.not-enough-information",
      ],
    },
  };
}

export function validateConservation(
  from: AirState,
  to: AirState
): boolean | null {
  if (from.sealState !== "sealed") return null;
  return from.airMarkerCount === to.airMarkerCount;
}

export function compareAirStates(from: AirState, to: AirState): readonly string[] {
  const results: string[] = [];
  if (to.modelVolume < from.modelVolume) results.push("compare.volume-decreased");
  if (to.modelVolume > from.modelVolume) results.push("compare.volume-increased");
  if (to.airMarkerCount === from.airMarkerCount) results.push("compare.markers-conserved");
  if (to.airMarkerCount < from.airMarkerCount)
    results.push(`compare.markers-lost.${from.airMarkerCount - to.airMarkerCount}`);
  if (LEVEL_ORDER[to.spacingLevel] < LEVEL_ORDER[from.spacingLevel])
    results.push("compare.spacing-narrower");
  if (LEVEL_ORDER[to.spacingLevel] > LEVEL_ORDER[from.spacingLevel])
    results.push("compare.spacing-wider");
  if (LEVEL_ORDER[to.resistanceFeel] > LEVEL_ORDER[from.resistanceFeel])
    results.push("compare.resistance-higher");
  if (LEVEL_ORDER[to.resistanceFeel] < LEVEL_ORDER[from.resistanceFeel])
    results.push("compare.resistance-lower");
  if (results.length === 0) results.push("compare.no-change");
  return results;
}

/** 관찰 signature가 누출/밀폐/열림 중 어느 것과 일치하는지 검수된 기록만으로 판단한다. */
export function evaluateDiagnosis(
  mission: AirMission,
  chosenSealState: SealState
): { correct: boolean; evidenceKeys: readonly string[] } {
  if (!mission.observationSignatures) return { correct: false, evidenceKeys: [] };
  const correct = mission.expectedDiagnosis === chosenSealState;
  return {
    correct,
    evidenceKeys: correct
      ? ["evidence.diagnosis.signature-match"]
      : ["evidence.diagnosis.signature-mismatch", "evidence.diagnosis.check-marker-count"],
  };
}
