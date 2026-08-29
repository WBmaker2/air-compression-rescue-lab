import { Component, useEffect, useRef, useState, type ReactNode } from "react";
import { ActionButton } from "../components/ActionButton";
import { ProgressSteps } from "../components/ProgressSteps";
import { UpdateHistoryButton } from "../components/UpdateHistoryButton";
import { AccessibilityToolbar } from "../accessibility/AccessibilityToolbar";
import { EntranceScreen } from "../features/air-lab/EntranceScreen";
import { SyringeWorkbench } from "../features/air-lab/SyringeWorkbench";
import { LearningReport } from "../features/report/LearningReport";
import { ModalDialog } from "../components/ModalDialog";
import { MISSIONS } from "../content/missions";
import {
  initialSessionState,
  missionIdForIndex,
  sessionReducer,
} from "./sessionReducer";

export class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch() {
    // 기술 정보를 학생 화면에 노출하지 않는다.
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="app-main">
          <h1>공기 부피 압축 연구소</h1>
          <p>활동을 다시 불러오지 못했어요.</p>
          <ActionButton onClick={() => window.location.reload()}>
            처음부터 다시 하기
          </ActionButton>
        </main>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const [state, dispatch] = useStateReducer();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [confirmRestart, setConfirmRestart] = useState(false);

  useEffect(() => {
    if (state.step !== "INTRO") headingRef.current?.focus();
  }, [state.step, state.missionIndex]);

  const mission = MISSIONS[state.missionIndex];
  const record =
    state.records.find((candidate) => candidate.missionId === missionIdForIndex(state.missionIndex)) ?? {
      missionId: missionIdForIndex(state.missionIndex),
      prediction: null,
      evidenceKeys: [],
      firstDiagnosis: null,
      revised: false,
      finalDiagnosis: null,
    };

  return (
    <ErrorBoundary>
      <div className="app-shell">
      <header className="app-header">
        <p className="app-title">
          <span aria-hidden="true">🫧</span> 공기 부피 압축 연구소
        </p>
        <UpdateHistoryButton />
      </header>
      <main className="app-main">
        <h1 ref={headingRef} tabIndex={-1} className="visually-hidden">
          공기 부피 압축 연구소
        </h1>
        {state.step === "INTRO" ? (
          <EntranceScreen dispatch={dispatch} />
        ) : state.step === "REPORT" && state.missionIndex === 5 && state.history.includes("활동 완료") ? (
          <>
            <ProgressSteps
              current={state.step}
              missionIndex={state.missionIndex}
              missionCount={6}
            />
            <LearningReport
              records={state.records}
              onRestartRequest={() => setConfirmRestart(true)}
            />
          </>
        ) : (
          <>
            <ProgressSteps
              current={state.step}
              missionIndex={state.missionIndex}
              missionCount={6}
            />
            <SyringeWorkbench
              mission={mission}
              missionIndex={state.missionIndex}
              step={state.step}
              record={record}
              dispatch={dispatch}
            />
          </>
        )}
      </main>
      <footer className="app-footer">
        <AccessibilityToolbar />
        <p>가상 모형 활동 · 저장 없음 · 초등 5~6학년 과학</p>
      </footer>
      <ModalDialog
        open={confirmRestart}
        title="처음부터 다시 하기"
        onClose={() => setConfirmRestart(false)}
      >
        <p>지금까지의 응답은 저장되지 않아요. 처음부터 다시 하면 모든 기록이 사라져요.</p>
        <div className="step-actions">
          <ActionButton
            variant="danger"
            onClick={() => {
              setConfirmRestart(false);
              dispatch({ type: "RESTART_CONFIRMED" });
            }}
          >
            네, 처음부터 다시 할게요
          </ActionButton>
          <ActionButton variant="secondary" onClick={() => setConfirmRestart(false)}>
            아니요, 계속할게요
          </ActionButton>
        </div>
      </ModalDialog>
    </div>
    </ErrorBoundary>
  );
}

function useStateReducer() {
  const [state, setState] = useState(initialSessionState);
  const dispatch = (action: Parameters<typeof sessionReducer>[1]) => {
    setState((current) => sessionReducer(current, action));
  };
  return [state, dispatch] as const;
}
