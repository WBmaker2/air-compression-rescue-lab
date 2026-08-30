import { STEP_ORDER } from "../app/sessionReducer";
import type { SessionStep } from "../domain/types";

const STEP_LABELS: Readonly<Record<SessionStep, string>> = {
  INTRO: "입구",
  OBSERVE: "관찰",
  PREDICT: "예측",
  RUN: "실행",
  COMPARE: "비교",
  DIAGNOSE: "진단",
  REVISE: "수정",
  REPORT: "기록",
};

interface ProgressStepsProps {
  readonly current: SessionStep;
  readonly missionIndex: number;
  readonly missionCount: number;
}

export function ProgressSteps({ current, missionIndex, missionCount }: ProgressStepsProps) {
  const currentIndex = STEP_ORDER.indexOf(current);
  const visible = STEP_ORDER.filter((step) => step !== "INTRO");
  return (
    <nav aria-label="학습 진행 상태" className="progress-steps">
      <div className="progress-topline">
        <p className="progress-mission">
          <span className="progress-mission-label">탐구 미션</span>
          <strong>
            {missionIndex + 1} / {missionCount}
          </strong>
        </p>
        <span className="progress-stage">
          {currentIndex} / {visible.length} 단계
        </span>
      </div>
      <div className="progress-track" aria-hidden="true">
        <span style={{ transform: `scaleX(${Math.max(0, currentIndex / visible.length)})` }} />
      </div>
      <ol>
        {visible.map((step) => {
          const index = STEP_ORDER.indexOf(step);
          const state =
            index === currentIndex ? "현재" : index < currentIndex ? "지난" : "예정";
          return (
            <li
              key={step}
              aria-current={index === currentIndex ? "step" : undefined}
              className={index === currentIndex ? "progress-step current" : "progress-step"}
              data-state={state}
            >
              <span className="progress-number" aria-hidden="true">
                {String(index).padStart(2, "0")}
              </span>
              <span>
                <span className="visually-hidden">{state} 단계: </span>
                {STEP_LABELS[step]}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
