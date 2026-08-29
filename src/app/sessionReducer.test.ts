import { describe, expect, it } from "vitest";
import {
  initialSessionState,
  missionIdForIndex,
  sessionReducer,
  type SessionState,
} from "./sessionReducer";
import type { AirDecision } from "../domain/types";

const start = (state: SessionState = initialSessionState): SessionState =>
  sessionReducer(state, { type: "START" });

function advanceToPredict(state = start()): SessionState {
  return sessionReducer(state, { type: "NEXT_STEP" });
}

function withPrediction(state: SessionState, decision: AirDecision = "compressed"): SessionState {
  return sessionReducer(sessionReducer(state, { type: "SET_PREDICTION", decision }), {
    type: "NEXT_STEP",
  });
}

describe("sessionReducer", () => {
  it("INTRO 이외의 단계에서 START를 무시한다", () => {
    expect(sessionReducer(advanceToPredict(), { type: "START" }).step).toBe("PREDICT");
  });

  it("예측 없이는 PREDICT에서 RUN으로 가지 않는다", () => {
    const state = advanceToPredict();
    expect(sessionReducer(state, { type: "NEXT_STEP" }).step).toBe("PREDICT");
    const withAnswer = sessionReducer(state, { type: "SET_PREDICTION", decision: "compressed" });
    expect(sessionReducer(withAnswer, { type: "NEXT_STEP" }).step).toBe("RUN");
  });

  it("정의되지 않은 단계 건너뛰기(2단계 점프)는 상태를 바꾸지 않는다", () => {
    const state = advanceToPredict();
    const jumped = sessionReducer(state, { type: "SET_DIAGNOSIS", diagnosis: "compressed" });
    expect(jumped.step).toBe("PREDICT");
    expect(jumped.records[0]?.firstDiagnosis).toBeNull();
  });

  it("back은 응답을 보존한다", () => {
    const predicted = withPrediction(advanceToPredict());
    const back = sessionReducer(predicted, { type: "BACK" });
    expect(back.step).toBe("PREDICT");
    expect(back.records[0]?.prediction).toBe("compressed");
  });

  it("OBSERVE보다 뒤로 가지 않는다", () => {
    const state = start();
    expect(sessionReducer(state, { type: "BACK" }).step).toBe("OBSERVE");
  });

  it("완료(REPORT) 이후에는 진단을 바꾸지 않는다", () => {
    let state = withPrediction(advanceToPredict());
    state = sessionReducer(state, { type: "NEXT_STEP" }); // RUN → COMPARE
    state = sessionReducer(state, { type: "SET_EVIDENCE", keys: ["evidence.x"] });
    state = sessionReducer(state, { type: "NEXT_STEP" }); // COMPARE → DIAGNOSE
    expect(state.step).toBe("DIAGNOSE");
    state = sessionReducer(state, { type: "SET_DIAGNOSIS", diagnosis: "compressed" });
    state = sessionReducer(state, { type: "NEXT_STEP" }); // DIAGNOSE → REVISE
    expect(state.step).toBe("REVISE");
    state = sessionReducer(state, { type: "NEXT_STEP" }); // REVISE → REPORT
    expect(state.step).toBe("REPORT");
    const after = sessionReducer(state, { type: "SET_DIAGNOSIS", diagnosis: "expanded" });
    expect(after.records[0]?.finalDiagnosis).toBe("compressed");
  });

  it("RESTART_CONFIRMED는 초기 상태를 새 객체로 만든다", () => {
    const state = withPrediction(advanceToPredict());
    const restarted = sessionReducer(state, { type: "RESTART_CONFIRMED" });
    expect(restarted.step).toBe("INTRO");
    expect(restarted.records).toEqual([]);
    expect(restarted).not.toBe(state);
    expect(restarted.history).not.toBe(state.history);
  });

  it("REQUEST_RESTART는 상태를 바꾸지 않는다 (확인 대화상자가 담당)", () => {
    const state = advanceToPredict();
    expect(sessionReducer(state, { type: "REQUEST_RESTART" })).toBe(state);
  });

  it("NEXT_MISSION은 0~5 범위 안에서만 미션을 바꾼다", () => {
    expect(missionIdForIndex(5)).toBe("air-diagnose-06");
    let state: SessionState = { ...initialSessionState, missionIndex: 5, step: "REPORT" };
    expect(sessionReducer(state, { type: "NEXT_MISSION" }).missionIndex).toBe(5);
    state = { ...initialSessionState, missionIndex: 4, step: "REPORT" };
    const next = sessionReducer(state, { type: "NEXT_MISSION" });
    expect(next.missionIndex).toBe(5);
    expect(next.step).toBe("OBSERVE");
  });

  it("미션 6의 REPORT에서 FINISH하면 활동이 완료된다", () => {
    const state: SessionState = { ...initialSessionState, missionIndex: 5, step: "REPORT" };
    const finished = sessionReducer(state, { type: "FINISH" });
    expect(finished.history[finished.history.length - 1]).toBe("활동 완료");
    const mid: SessionState = { ...initialSessionState, missionIndex: 2, step: "REPORT" };
    expect(sessionReducer(mid, { type: "FINISH" }).history).toHaveLength(mid.history.length);
  });
});
