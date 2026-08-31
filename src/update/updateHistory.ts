export interface UpdateHistoryEntry {
  readonly date: string;
  readonly description: string;
}

export const UPDATE_HISTORY: readonly UpdateHistoryEntry[] = [
  {
    date: "2026-08-31",
    description: "미션 5·6의 관찰 근거 정합성, 누출 문구, 학생용 표현 개선",
  },
  {
    date: "2026-08-30",
    description: "가상 실험대 중심 화면, 현재 단계 포커스, 근거 문구, 모바일 읽기 순서 개선",
  },
  {
    date: "2026-08-28",
    description: "구현 계획 확정",
  },
];
