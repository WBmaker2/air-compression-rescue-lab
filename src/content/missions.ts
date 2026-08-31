import type { AirMission, AirState } from "../domain/types";

const sealed60: AirState = {
  id: "sealed-60",
  sealState: "sealed",
  modelVolume: 60,
  airMarkerCount: 12,
  spacingLevel: "high",
  pressureLevel: "low",
  resistanceFeel: "low",
};

const sealed40: AirState = {
  id: "sealed-40",
  sealState: "sealed",
  modelVolume: 40,
  airMarkerCount: 12,
  spacingLevel: "medium",
  pressureLevel: "medium",
  resistanceFeel: "medium",
};

const sealed20: AirState = {
  id: "sealed-20",
  sealState: "sealed",
  modelVolume: 20,
  airMarkerCount: 12,
  spacingLevel: "low",
  pressureLevel: "high",
  resistanceFeel: "high",
};

const open60: AirState = {
  id: "open-60",
  sealState: "open",
  modelVolume: 60,
  airMarkerCount: 12,
  spacingLevel: "high",
  pressureLevel: "low",
  resistanceFeel: "low",
};

const open20: AirState = {
  id: "open-20",
  sealState: "open",
  modelVolume: 20,
  airMarkerCount: 4,
  spacingLevel: "high",
  pressureLevel: "low",
  resistanceFeel: "low",
};

const leaking60: AirState = {
  id: "leaking-60",
  sealState: "leaking",
  modelVolume: 60,
  airMarkerCount: 12,
  spacingLevel: "high",
  pressureLevel: "low",
  resistanceFeel: "low",
};

const sealedPushObservations = [
  "obs.volume-decreased",
  "obs.markers-conserved",
  "obs.spacing-decreased",
  "obs.resistance-increased",
];

const missions: readonly AirMission[] = [
  {
    id: "air-sealed-01",
    title: "밀폐 주사기 60 → 40",
    scene:
      "끝이 막힌 가상 주사기 모형에 모형 공기 표식 12개가 모형 부피 60에 들어 있습니다. 입구가 막혀 있어 공기가 밖으로 나갈 수 없습니다.",
    task: "피스톤을 60에서 40으로 누르기 전과 후, 모형 공기 표식은 어떻게 될지 먼저 예측해 보세요.",
    states: [sealed60, sealed40],
    transitions: [
      {
        id: "sealed-60-push-40",
        fromStateId: "sealed-60",
        action: "push",
        toStateId: "sealed-40",
        observationKeys: sealedPushObservations,
      },
    ],
    expectedDecisions: ["compressed"],
    sourceNote: "초등 과학 5~6학년 '공기는 공간을 차지한다' 단원의 가상 압축 모형 (2026-08-28 검수)",
    reviewStatus: "approved",
    misconceptionGuard:
      "공기가 사라지는 것이 아니라 같은 공기 표식이 더 작은 공간에 모입니다. 누르기 전후 표식 수를 꼭 세어 보세요.",
  },
  {
    id: "air-sealed-02",
    title: "밀폐 주사기 40 → 20",
    scene:
      "같은 밀폐 주사기 모형입니다. 이번에는 모형 부피 40에서 한 번 더 20까지 누릅니다. 간격이 이미 좁아진 표식 12개가 더 좁은 공간으로 모입니다.",
    task: "두 번째로 누를 때 표식의 간격과 누르기 어려운 정도가 어떻게 바뀔지 예측해 보세요.",
    states: [sealed40, sealed20],
    transitions: [
      {
        id: "sealed-40-push-20",
        fromStateId: "sealed-40",
        action: "push",
        toStateId: "sealed-20",
        observationKeys: sealedPushObservations,
      },
    ],
    expectedDecisions: ["compressed"],
    sourceNote: "초등 과학 5~6학년 '공기는 공간을 차지한다' 단원의 가상 압축 모형 (2026-08-28 검수)",
    reviewStatus: "approved",
    misconceptionGuard:
      "간격이 좁아질수록 누르기 어려운 정도가 커집니다. 이는 질적 모형 표현이며 실제 압력 수치가 아닙니다.",
  },
  {
    id: "air-open-03",
    title: "열린 주사기 60 → 20",
    scene:
      "이번 주사기 모형의 끝은 열려 있습니다. 모형 부피 60에 표식 12개가 있을 때 피스톤을 20까지 밀면 표식 일부가 출구로 나갑니다.",
    task: "밀폐 주사기와 비교해 열린 주사기에서 무엇이 다른지 예측해 보세요.",
    states: [open60, open20],
    transitions: [
      {
        id: "open-60-push-20",
        fromStateId: "open-60",
        action: "push",
        toStateId: "open-20",
        observationKeys: [
          "obs.volume-decreased",
          "obs.markers-escaped",
          "obs.spacing-unchanged",
          "obs.resistance-unchanged",
        ],
      },
    ],
    expectedDecisions: ["escaped"],
    sourceNote: "초등 과학 5~6학년 '공기는 공간을 차지한다' 단원의 가상 개방 모형 (2026-08-28 검수)",
    reviewStatus: "approved",
    misconceptionGuard:
      "열린 주사기의 결과는 압축이 아닙니다. 남은 표식의 간격은 누르기 전과 거의 같고, 표식 8개가 출구로 이동합니다.",
  },
  {
    id: "air-pull-04",
    title: "밀폐 주사기 20 → 40 당기기",
    scene:
      "끝이 막힌 주사기 모형을 모형 부피 20에서 40까지 당깁니다. 표식 12개는 그대로이지만 공간이 넓어집니다.",
    task: "당긴 뒤 공간, 표식 수, 간격이 어떻게 될지 예측해 보세요.",
    states: [sealed20, sealed40],
    transitions: [
      {
        id: "sealed-20-pull-40",
        fromStateId: "sealed-20",
        action: "pull",
        toStateId: "sealed-40",
        observationKeys: [
          "obs.volume-increased",
          "obs.markers-conserved",
          "obs.spacing-increased",
          "obs.resistance-decreased",
        ],
      },
    ],
    expectedDecisions: ["expanded"],
    sourceNote: "초등 과학 5~6학년 '공기는 공간을 차지한다' 단원의 가상 팽창 모형 (2026-08-28 검수)",
    reviewStatus: "approved",
    misconceptionGuard:
      "공간이 커졌다고 해서 공기 표식이 새로 생기지 않습니다. 당기기 전후 표식 수가 12개로 같은지 확인하세요.",
  },
  {
    id: "air-leak-05",
    title: "마개가 느슨한 주사기",
    scene:
      "마개가 느슨해 공기가 샐 수 있는 주사기 모형입니다. 하지만 얼마나 새는지, 누른 뒤 표식이 어떻게 바뀌는지는 알려지지 않았습니다.",
    task: "이 주사기를 누르면 어떻게 될까요? 확실하지 않다면 판단을 보류하는 것도 정식 답입니다.",
    states: [leaking60],
    transitions: [],
    expectedDecisions: ["insufficient-information"],
    sourceNote: "초등 과학 5~6학년 판단 보류 훈련용 가상 모형 (2026-08-28 검수)",
    reviewStatus: "approved",
    misconceptionGuard:
      "누출량과 누른 뒤 결과를 모르면 압축만으로 결과를 확정하지 않습니다. 정보가 부족하면 '판단 보류'를 고르세요.",
  },
  {
    id: "air-diagnose-06",
    title: "가상 펌프 진단",
    scene:
      "가상 펌프의 세 번의 관찰 기록입니다. 관찰 1: 모형 부피 60, 표식 12개, 저항 낮음. 관찰 2: 모형 부피 40, 표식 10개, 저항 낮음. 관찰 3: 모형 부피 20, 표식 8개, 저항 중간.",
    task: "이 펌프는 밀폐, 열림, 누출 중 어느 상태일까요? 관찰 근거와 함께 진단하세요.",
    states: [sealed60, open20],
    transitions: [],
    expectedDecisions: [],
    expectedDiagnosis: "leaking",
    observationSignatures: [
      {
        observationKeys: ["obs.signature.leaking", "obs.markers-decreasing", "obs.resistance-rising"],
        decision: "insufficient-information",
      },
    ],
    sourceNote: "초등 과학 5~6학년 관찰 signature 진단 활동 (2026-08-28 검수)",
    reviewStatus: "approved",
    misconceptionGuard:
      "표식이 12→10→8로 줄어드는 것은 누출 무늬예요. 밀폐라면 표식 수가 그대로여야 해요.",
  },
];

export const MISSIONS: readonly AirMission[] = missions;

export const MISSION_IDS = MISSIONS.map((mission) => mission.id);

export const OBSERVATION_LABELS: Readonly<Record<string, string>> = {
  "obs.volume-decreased": "모형 부피가 줄었다",
  "obs.volume-increased": "모형 부피가 커졌다",
  "obs.markers-conserved": "모형 공기 표식 수가 그대로였다",
  "obs.markers-escaped": "모형 공기 표식 일부가 출구로 나갔다",
  "obs.markers-decreasing": "관찰마다 표식 수가 조금씩 줄었다",
  "obs.spacing-decreased": "표식 사이 간격이 좁아졌다",
  "obs.spacing-increased": "표식 사이 간격이 넓어졌다",
  "obs.spacing-unchanged": "남은 표식의 간격은 그대로였다",
  "obs.resistance-increased": "누르기 어려운 정도가 커졌다",
  "obs.resistance-decreased": "누르기 어려운 정도가 작아졌다",
  "obs.resistance-unchanged": "누르기 어려운 정도가 그대로였다",
  "obs.resistance-rising": "나중 관찰에서 누르기 어려운 정도가 커졌다",
  "obs.signature.leaking": "표식 수가 12→10→8로 줄어드는 누출 무늬가 나타났다",
  "obs.not-enough-information": "누출량과 누른 뒤 변화 정보가 부족해 확정할 수 없다",
};

export const DECISION_LABELS: Readonly<Record<string, string>> = {
  compressed: "같은 공기가 더 작은 공간에 모인다 (압축)",
  expanded: "공간이 커지고 간격이 넓어진다 (팽창)",
  escaped: "공기 일부가 밖으로 나간다 (빠져나감)",
  "insufficient-information": "정보가 부족해 판단을 보류한다",
};

export const SEAL_LABELS: Readonly<Record<string, string>> = {
  sealed: "밀폐 — 공기가 나갈 수 없다",
  open: "열림 — 공기가 출구로 나갈 수 있다",
  leaking: "누출 — 조금씩 새어 나간다",
};
