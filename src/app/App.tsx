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
  }, [state.step, state.missionIndex, state.history.length]);

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
          <a className="skip-link" href="#main-content">
            본문으로 건너뛰기
          </a>
          <div className="app-header__inner">
            <div className="app-brand">
              <span className="brand-mark" aria-hidden="true">
                <svg viewBox="0 0 32 32" width="32" height="32">
                  <path d="M16 3.5c5.8 0 10.5 4.6 10.5 10.3 0 7.8-7.1 12.6-10.5 14.7C12.6 26.4 5.5 21.6 5.5 13.8 5.5 8.1 10.2 3.5 16 3.5Z" fill="none" stroke="currentColor" strokeWidth="2" />
                  <path d="M10.5 14.5h11M13 10.5h6M13 18.5h6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </span>
              <div>
                <p className="app-kicker">가상 과학 활동 · 5–6학년</p>
                <p className="app-title">공기 부피 압축 연구소</p>
              </div>
            </div>
            <UpdateHistoryButton />
          </div>
        </header>
        <main id="main-content" className="app-main">
          {state.step === "INTRO" ? (
            <EntranceScreen dispatch={dispatch} headingRef={headingRef} />
          ) : state.step === "REPORT" && state.missionIndex === 5 && state.history.includes("활동 완료") ? (
            <>
              <ProgressSteps
                current={state.step}
                missionIndex={state.missionIndex}
                missionCount={6}
              />
              <LearningReport
                records={state.records}
                headingRef={headingRef}
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
                headingRef={headingRef}
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
