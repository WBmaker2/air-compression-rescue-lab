export interface UpdateHistoryEntry {
  readonly date: string;
  readonly description: string;
}

export const UPDATE_HISTORY: readonly UpdateHistoryEntry[] = [
  {
    date: "2026-08-28",
    description: "구현 계획 확정",
  },
];
