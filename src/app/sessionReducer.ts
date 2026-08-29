import type { AirDecision, MissionId, SealState, SessionStep } from "../domain/types";

export interface MissionRecord {
  readonly missionId: MissionId;
  readonly prediction: AirDecision | null;
  readonly evidenceKeys: readonly string[];
  readonly firstDiagnosis: AirDecision | SealState | null;
  readonly revised: boolean;
  readonly finalDiagnosis: AirDecision | SealState | null;
}

export interface SessionState {
  readonly step: SessionStep;
  readonly missionIndex: number;
  readonly records: readonly MissionRecord[];
  readonly history: readonly string[];
}

export type SessionAction =
  | { type: "START" }
  | { type: "NEXT_STEP" }
  | { type: "BACK" }
  | { type: "SET_PREDICTION"; decision: AirDecision }
  | { type: "SET_EVIDENCE"; keys: readonly string[] }
  | { type: "SET_DIAGNOSIS"; diagnosis: AirDecision | SealState }
  | { type: "REVISE_DIAGNOSIS"; diagnosis: AirDecision | SealState }
  | { type: "NEXT_MISSION" }
  | { type: "FINISH" }
  | { type: "REQUEST_RESTART" }
  | { type: "RESTART_CONFIRMED" };

export const STEP_ORDER: readonly SessionStep[] = [
  "INTRO",
  "OBSERVE",
  "PREDICT",
  "RUN",
  "COMPARE",
  "DIAGNOSE",
  "REVISE",
  "REPORT",
];

export const MISSION_COUNT = 6;

export const initialSessionState: SessionState = {
  step: "INTRO",
  missionIndex: 0,
  records: [],
  history: [],
};

function currentRecord(state: SessionState): MissionRecord {
  return (
    state.records.find(
      (record) => record.missionId === missionIdForIndex(state.missionIndex)
    ) ?? {
      missionId: missionIdForIndex(state.missionIndex),
      prediction: null,
      evidenceKeys: [],
      firstDiagnosis: null,
      revised: false,
      finalDiagnosis: null,
    }
  );
}

export function missionIdForIndex(index: number): MissionId {
  const ids: MissionId[] = [
    "air-sealed-01",
    "air-sealed-02",
    "air-open-03",
    "air-pull-04",
    "air-leak-05",
    "air-diagnose-06",
  ];
  return ids[index];
}

const ALLOWED_TRANSITIONS: Readonly<Record<SessionStep, readonly SessionStep[]>> = {
  INTRO: ["OBSERVE"],
  OBSERVE: ["PREDICT"],
  PREDICT: ["RUN"],
  RUN: ["COMPARE"],
  COMPARE: ["DIAGNOSE"],
  DIAGNOSE: ["REVISE", "REPORT"],
  REVISE: ["REPORT"],
  REPORT: ["REPORT"],
};

function canAdvance(step: SessionStep, next: SessionStep): boolean {
  return ALLOWED_TRANSITIONS[step].includes(next);
}

function upsertRecord(state: SessionState, record: MissionRecord): SessionState {
  const others = state.records.filter(
    (candidate) => candidate.missionId !== record.missionId
  );
  const sorted = [...others, record].sort(
    (a, b) =>
      (missionIdForIndex(state.missionIndex) === b.missionId ? 1 : 0) -
      (missionIdForIndex(state.missionIndex) === a.missionId ? 1 : 0)
  );
  return { ...state, records: sorted };
}

function requireDiagnosis(state: SessionState): boolean {
  return currentRecord(state).firstDiagnosis !== null;
}

export function sessionReducer(
  state: SessionState,
  action: SessionAction
): SessionState {
  switch (action.type) {
    case "START": {
      if (state.step !== "INTRO") return state;
      const record: MissionRecord = {
        missionId: missionIdForIndex(0),
        prediction: null,
        evidenceKeys: [],
        firstDiagnosis: null,
        revised: false,
        finalDiagnosis: null,
      };
      return {
        ...state,
        step: "OBSERVE",
        missionIndex: 0,
        records: [record],
        history: [...state.history, "시작: 미션 1 (air-sealed-01)"],
      };
    }

    case "SET_PREDICTION": {
      if (state.step !== "PREDICT") return state;
      return upsertRecord(state, {
        ...currentRecord(state),
        prediction: action.decision,
      });
    }

    case "SET_EVIDENCE": {
      if (state.step !== "COMPARE") return state;
      return upsertRecord(state, {
        ...currentRecord(state),
        evidenceKeys: [...action.keys],
      });
    }

    case "SET_DIAGNOSIS": {
      if (state.step !== "DIAGNOSE" && state.step !== "REVISE") return state;
      const record = currentRecord(state);
      const isFirst = record.firstDiagnosis === null;
      return upsertRecord(state, {
        ...record,
        firstDiagnosis: isFirst ? action.diagnosis : record.firstDiagnosis,
        finalDiagnosis: action.diagnosis,
      });
    }    case "REVISE_DIAGNOSIS": {
      if (state.step !== "REVISE") return state;
      return upsertRecord(state, {
        ...currentRecord(state),
        revised: true,
        finalDiagnosis: action.diagnosis,
      });
    }

    case "NEXT_STEP": {
      const next = STEP_ORDER[STEP_ORDER.indexOf(state.step) + 1];
      if (!next || !canAdvance(state.step, next)) return state;
      if (state.step === "PREDICT" && currentRecord(state).prediction === null) return state;
      if (state.step === "DIAGNOSE" && !requireDiagnosis(state)) return state;
      return { ...state, step: next, history: [...state.history, `단계 이동: ${state.step} → ${next}`] };
    }

    case "BACK": {
      const prev = STEP_ORDER[STEP_ORDER.indexOf(state.step) - 1];
      if (!prev || prev === "INTRO") return state;
      return { ...state, step: prev };
    }

    case "NEXT_MISSION": {
      if (state.step !== "REPORT") return state;
      const nextIndex = state.missionIndex + 1;
      if (nextIndex >= MISSION_COUNT) return state;
      return {
        ...state,
        missionIndex: nextIndex,
        step: "OBSERVE",
        records: [
          ...state.records,
          {
            missionId: missionIdForIndex(nextIndex),
            prediction: null,
            evidenceKeys: [],
            firstDiagnosis: null,
            revised: false,
            finalDiagnosis: null,
          },
        ],
        history: [...state.history, `미션 이동: ${state.missionIndex + 1} → ${nextIndex + 1}`],
      };
    }

    case "FINISH": {
      if (state.step !== "REPORT" || state.missionIndex !== MISSION_COUNT - 1) return state;
      return { ...state, history: [...state.history, "활동 완료"] };
    }

    case "REQUEST_RESTART":
      return state;

    case "RESTART_CONFIRMED": {
      return {
        step: "INTRO",
        missionIndex: 0,
        records: [],
        history: ["처음부터 다시 시작"],
      };
    }

    default: {
      const exhaustive: never = action;
      void exhaustive;
      return state;
    }
  }
}
