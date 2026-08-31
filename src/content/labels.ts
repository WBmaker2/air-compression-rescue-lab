import {
  DECISION_LABELS,
  OBSERVATION_LABELS,
  SEAL_LABELS,
} from "./missions";

export const LEVEL_LABELS: Readonly<Record<string, string>> = {
  low: "낮음",
  medium: "중간",
  high: "높음",
};

export function labelForObservation(key: string): string {
  return OBSERVATION_LABELS[key] ?? "이 관찰 결과를 확인했어요";
}

export function labelForDecision(key: string): string {
  return DECISION_LABELS[key] ?? SEAL_LABELS[key] ?? "선택한 판단";
}

export function labelForSeal(key: string): string {
  return SEAL_LABELS[key] ?? "끝 상태를 확인해요";
}

export function labelForEvidence(key: string): string {
  const directLabel: Readonly<Record<string, string>> = {
    "evidence.compressed.markers-conserved-in-smaller-space":
      "같은 표식이 더 작은 공간에 모였어요",
    "evidence.expanded.same-markers-in-larger-space":
      "같은 표식이 더 큰 공간에 퍼졌어요",
    "evidence.escaped.markers-left-through-opening":
      "표식 일부가 열린 출구로 나갔어요",
    "evidence.unknown.not-enough-information":
      "누출량과 누른 뒤 변화 정보가 부족해요",
    "evidence.diagnosis.signature-match":
      "표식 수가 12→10→8로 줄어드는 누출 무늬와 맞아요",
    "evidence.diagnosis.signature-mismatch":
      "선택한 끝 상태와 관찰 무늬가 맞지 않아요",
    "evidence.diagnosis.check-marker-count":
      "관찰마다 표식 수가 줄었는지 다시 세어 보세요",
  };

  if (directLabel[key]) return directLabel[key];
  if (key.startsWith("evidence.from.")) return "실험 전 모형 상태를 확인했어요";
  if (key.startsWith("evidence.to.")) return "실험 후 모형 상태를 확인했어요";
  return "실험에서 확인한 근거를 다시 살펴봤어요";
}

export function labelForComparison(key: string): string {
  if (key === "compare.volume-decreased") return "모형 부피가 줄었어요";
  if (key === "compare.volume-increased") return "모형 부피가 커졌어요";
  if (key === "compare.markers-conserved") return "모형 공기 표식 수가 그대로예요";
  if (key.startsWith("compare.markers-lost.")) {
    const lost = Number(key.split(".").at(-1));
    return Number.isFinite(lost) ? `모형 공기 표식 ${lost}개가 줄었어요` : "모형 공기 표식 수가 줄었어요";
  }
  if (key === "compare.spacing-narrower") return "표식 사이 간격이 좁아졌어요";
  if (key === "compare.spacing-wider") return "표식 사이 간격이 넓어졌어요";
  if (key === "compare.resistance-higher") return "누르기 어려운 정도가 커졌어요";
  if (key === "compare.resistance-lower") return "누르기 어려운 정도가 작아졌어요";
  return "눈에 띄는 변화가 없어요";
}

export function labelForLevel(level: string): string {
  return LEVEL_LABELS[level] ?? "확인 필요";
}
