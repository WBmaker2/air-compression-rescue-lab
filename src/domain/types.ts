export type MissionId =
  | "air-sealed-01"
  | "air-sealed-02"
  | "air-open-03"
  | "air-pull-04"
  | "air-leak-05"
  | "air-diagnose-06";

export type SealState = "sealed" | "open" | "leaking" | "unknown";

export type Level = "low" | "medium" | "high";

export type AirDecision = "compressed" | "expanded" | "escaped" | "insufficient-information";

export type AirAction = "push" | "pull";

export interface AirState {
  readonly id: string;
  readonly sealState: SealState;
  readonly modelVolume: 20 | 40 | 60;
  readonly airMarkerCount: number;
  readonly spacingLevel: Level;
  readonly pressureLevel: Level;
  readonly resistanceFeel: Level;
}

export interface AirTransition {
  readonly id: string;
  readonly fromStateId: string;
  readonly action: AirAction;
  readonly toStateId: string;
  readonly observationKeys: readonly string[];
}

export interface AirMission {
  readonly id: MissionId;
  readonly title: string;
  readonly scene: string;
  readonly task: string;
  readonly states: readonly AirState[];
  readonly transitions: readonly AirTransition[];
  readonly expectedDecisions: readonly AirDecision[];
  readonly sourceNote: string;
  readonly reviewStatus: "pending" | "approved";
  readonly misconceptionGuard: string;
  readonly observationSignatures?: readonly {
    readonly observationKeys: readonly string[];
    readonly decision: AirDecision;
  }[];
  readonly expectedDiagnosis?: SealState;
}

export interface AirEvaluation {
  readonly accepted: boolean;
  readonly decision: AirDecision;
  readonly conservedMarkerCount: boolean | null;
  readonly observationKeys: readonly string[];
  readonly evidenceKeys: readonly string[];
}

export type SessionStep =
  | "INTRO"
  | "OBSERVE"
  | "PREDICT"
  | "RUN"
  | "COMPARE"
  | "DIAGNOSE"
  | "REVISE"
  | "REPORT";

export interface PredictionChoice {
  readonly decision: AirDecision;
  readonly label: string;
}

export interface EvidenceChoice {
  readonly key: string;
  readonly label: string;
}
