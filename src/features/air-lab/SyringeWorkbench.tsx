import { useEffect, useMemo, useState } from "react";
import { ActionButton } from "../../components/ActionButton";
import { ModalDialog } from "../../components/ModalDialog";
import { SyringeFigure } from "./SyringeFigure";
import { FeedbackPanel } from "./FeedbackPanel";
import {
  compareAirStates,
  evaluateDiagnosis,
  simulateAirCase,
} from "../../domain/airModel";
import {
  DECISION_LABELS,
  OBSERVATION_LABELS,
  SEAL_LABELS,
} from "../../content/missions";
import type { AirDecision, AirMission, SealState } from "../../domain/types";
import type { SessionStep } from "../../domain/types";
import type { MissionRecord, SessionAction } from "../../app/sessionReducer";

const PREDICTION_OPTIONS: readonly AirDecision[] = [
  "compressed",
  "expanded",
  "escaped",
  "insufficient-information",
];

const DIAGNOSIS_SEALS: readonly SealState[] = ["sealed", "open", "leaking"];

const LEVEL_LABELS: Readonly<Record<string, string>> = {
  low: "낮음",
  medium: "중간",
  high: "높음",
};

interface SyringeWorkbenchProps {
  readonly mission: AirMission;
  readonly missionIndex: number;
  readonly step: SessionStep;
  readonly record: MissionRecord;
  readonly dispatch: (action: SessionAction) => void;
}

export function SyringeWorkbench({
  mission,
  missionIndex,
  step,
  record,
  dispatch,
}: SyringeWorkbenchProps) {
  const [runResult, setRunResult] = useState<
    ReturnType<typeof simulateAirCase> | "no-run" | null
  >(null);
  const [evidence, setEvidence] = useState<readonly string[]>([]);
  const [diagnosis, setDiagnosis] = useState<AirDecision | SealState | null>(null);
  const [confirmRestart, setConfirmRestart] = useState(false);

  useEffect(() => {
    setRunResult(null);
    setEvidence([]);
    setDiagnosis(record.finalDiagnosis ?? null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mission.id]);

  const isDiagnoseMission = Boolean(mission.observationSignatures);
  const fromState = mission.states[0];
  const observationKeys = useMemo(() => {
    if (runResult && runResult !== "no-run") return runResult.evaluation.observationKeys;
    if (runResult === "no-run") return ["obs.not-enough-information"];
    if (isDiagnoseMission)
      return mission.observationSignatures?.[0]?.observationKeys ?? [];
    return [];
  }, [runResult, isDiagnoseMission, mission.observationSignatures]);

  const evaluateChoice = (choice: AirDecision | SealState): boolean => {
    if (isDiagnoseMission) return evaluateDiagnosis(mission, choice as SealState).correct;
    if (mission.id === "air-leak-05") return choice === "insufficient-information";
    return mission.expectedDecisions.includes(choice as AirDecision);
  };

  if (step === "OBSERVE") {
    return (
      <section aria-labelledby="step-heading">
        <h2 id="step-heading">
          조건 관찰 — 미션 {missionIndex + 1}: {mission.title}
        </h2>
        <p className="misconception-guard">
          <strong>생각 점검:</strong> {mission.misconceptionGuard}
        </p>
        <p>{mission.scene}</p>
        <table className="condition-table">
          <caption>조건 요약 (모형 값)</caption>
          <thead>
            <tr>
              <th scope="col">끝 상태</th>
              <th scope="col">모형 부피</th>
              <th scope="col">모형 공기 표식</th>
              <th scope="col">간격</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                {fromState.sealState === "sealed"
                  ? "밀폐"
                  : fromState.sealState === "open"
                    ? "열림"
                    : "누출 가능"}
              </td>
              <td>{fromState.modelVolume}</td>
              <td>{fromState.airMarkerCount}개</td>
              <td>{LEVEL_LABELS[fromState.spacingLevel]}</td>
            </tr>
          </tbody>
        </table>
        <SyringeFigure state={fromState} label="시작 상태" />
        <div className="step-actions">
          <ActionButton pulse onClick={() => dispatch({ type: "NEXT_STEP" })}>
            조건을 확인했어요, 예측하기
          </ActionButton>
        </div>
      </section>
    );
  }

  if (step === "PREDICT") {
    return (
      <section aria-labelledby="step-heading">
        <h2 id="step-heading">예측판 — 먼저 생각해 보기</h2>
        <p>{mission.task}</p>
        <fieldset>
          <legend>피스톤을 움직인 뒤 어떤 일이 일어날 것 같나요?</legend>
          {PREDICTION_OPTIONS.map((option) => (
            <label key={option} className="choice">
              <input
                type="radio"
                name={`prediction-${mission.id}`}
                checked={record.prediction === option}
                onChange={() => dispatch({ type: "SET_PREDICTION", decision: option })}
              />
              <span className="choice-text">
                {record.prediction === option ? (
                  <strong>
                    ✓ 선택됨 — {DECISION_LABELS[option]}
                  </strong>
                ) : (
                  DECISION_LABELS[option]
                )}
              </span>
            </label>
          ))}
        </fieldset>
        <div className="step-actions">
          <ActionButton
            pulse
            disabled={record.prediction === null}
            onClick={() => dispatch({ type: "NEXT_STEP" })}
          >
            예측을 골랐어요, 실행 준비
          </ActionButton>
        </div>
      </section>
    );
  }

  if (step === "RUN") {
    const transition = mission.transitions[0];
    const actionLabel =
      transition?.action === "pull" ? "피스톤 당기기" : "피스톤 누르기";
    return (
      <section aria-labelledby="step-heading">
        <h2 id="step-heading">가상 실행 — 한 단계만 움직여요</h2>
        <SyringeFigure state={fromState} label="실행 전" />
        {transition ? (
          <p>
            예측한 행동: <strong>{actionLabel}</strong> ({fromState.modelVolume} →{" "}
            {mission.states.find((s) => s.id === transition.toStateId)?.modelVolume})
          </p>
        ) : (
          <p>
            이 미션에는 확정된 결과 상태가 제공되지 않아요. 그래서 이 화면에서는 실행 결과를
            확정하지 않고, 관찰 기록을 확인하는 것으로 넘어가요.
          </p>
        )}
        <div className="step-actions">
          {transition ? (
            <ActionButton
              pulse
              onClick={() => {
                setRunResult(simulateAirCase(mission, fromState.id, transition.action));
                dispatch({ type: "NEXT_STEP" });
              }}
            >
              가상 실험 실행
            </ActionButton>
          ) : (
            <ActionButton pulse onClick={() => {
              setRunResult("no-run");
              dispatch({ type: "NEXT_STEP" });
            }}>
              관찰 결과 확인
            </ActionButton>
          )}
        </div>
      </section>
    );
  }

  if (step === "COMPARE") {
    const before = runResult && runResult !== "no-run" ? runResult.from : fromState;
    const after =
      runResult && runResult !== "no-run"
        ? runResult.to
        : isDiagnoseMission
          ? null
          : fromState;
    const compareKeys =
      runResult && runResult !== "no-run" ? compareAirStates(before, after!) : [];
    return (
      <section aria-labelledby="step-heading">
        <h2 id="step-heading">비교판 — 전과 후를 같은 표에서</h2>
        {runResult && runResult !== "no-run" ? (
          <>
            <table className="compare-table">
              <caption>전후 비교 (모형 값)</caption>
              <thead>
                <tr>
                  <th scope="col">항목</th>
                  <th scope="col">실행 전</th>
                  <th scope="col">실행 후</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">모형 부피</th>
                  <td>{before.modelVolume}</td>
                  <td>{after?.modelVolume}</td>
                </tr>
                <tr>
                  <th scope="row">모형 공기 표식</th>
                  <td>{before.airMarkerCount}개</td>
                  <td>{after?.airMarkerCount}개</td>
                </tr>
                <tr>
                  <th scope="row">간격</th>
                  <td>{LEVEL_LABELS[before.spacingLevel]}</td>
                  <td>{LEVEL_LABELS[after?.spacingLevel ?? "medium"]}</td>
                </tr>
                <tr>
                  <th scope="row">저항 느낌</th>
                  <td>{LEVEL_LABELS[before.resistanceFeel]}</td>
                  <td>{LEVEL_LABELS[after?.resistanceFeel ?? "medium"]}</td>
                </tr>
              </tbody>
            </table>
            <ul className="compare-keys">
              {compareKeys.map((key) => (
                <li key={key}>{OBSERVATION_LABELS[key.replace("compare.", "obs.")] ?? key}</li>
              ))}
            </ul>
            <SyringeFigure state={after!} label="실행 후" />
          </>
        ) : isDiagnoseMission ? (
          <table className="compare-table">
            <caption>가상 펌프의 세 번의 관찰 기록 (모형 값)</caption>
            <thead>
              <tr>
                <th scope="col">관찰</th>
                <th scope="col">모형 부피</th>
                <th scope="col">모형 공기 표식</th>
                <th scope="col">저항 느낌</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">관찰 1</th>
                <td>60</td>
                <td>12개</td>
                <td>낮음</td>
              </tr>
              <tr>
                <th scope="row">관찰 2</th>
                <td>40</td>
                <td>10개</td>
                <td>낮음</td>
              </tr>
              <tr>
                <th scope="row">관찰 3</th>
                <td>20</td>
                <td>8개</td>
                <td>중간</td>
              </tr>
            </tbody>
          </table>
        ) : (
          <p>
            확정된 실행 결과가 없어요. 이유: 누출률과 결과 상태 정보가 제공되지 않았어요.
            정보가 부족할 때는 판단을 보류하는 것이 과학적인 태도예요.
          </p>
        )}

        <fieldset>
          <legend>어떤 근거를 확인했나요? (하나 이상)</legend>
          {observationKeys.map((key) => (
            <label key={key} className="choice">
              <input
                type="checkbox"
                checked={evidence.includes(key)}
                onChange={(event) =>
                  setEvidence(
                    event.target.checked
                      ? [...evidence, key]
                      : evidence.filter((candidate) => candidate !== key)
                  )
                }
              />
              <span className="choice-text">{OBSERVATION_LABELS[key] ?? key}</span>
            </label>
          ))}
        </fieldset>
        <div className="step-actions">
          <ActionButton
            pulse
            disabled={evidence.length === 0}
            onClick={() => {
              dispatch({ type: "SET_EVIDENCE", keys: evidence });
              dispatch({ type: "NEXT_STEP" });
            }}
          >
            근거를 골랐어요, 진단하기
          </ActionButton>
        </div>
      </section>
    );
  }

  if (step === "DIAGNOSE" || step === "REVISE") {
    const revising = step === "REVISE";
    const chosen = diagnosis;
    const accepted = chosen !== null ? evaluateChoice(chosen) : null;
    const firstWasWrong =
      record.firstDiagnosis !== null && !evaluateChoice(record.firstDiagnosis);
    const options: readonly (AirDecision | SealState)[] = isDiagnoseMission
      ? DIAGNOSIS_SEALS
      : PREDICTION_OPTIONS;
    const optionLabel = (option: AirDecision | SealState) =>
      isDiagnoseMission ? SEAL_LABELS[option] : DECISION_LABELS[option];

    return (
      <section aria-labelledby="step-heading">
        <h2 id="step-heading">{revising ? "규칙 수정 — 한 번 다시 볼까요?" : "진단판"}</h2>
        {revising && firstWasWrong ? (
          <p>
            처음 판단이 관찰 근거와 맞지 않아요. 근거를 다시 읽고 한 번 수정할 수 있어요.
            (정답을 대신 알려 주지는 않아요. 관찰이 힌트예요.)
          </p>
        ) : null}
        <fieldset>
          <legend>{revising ? "수정한 판단 고르기" : "관찰 근거와 맞는 결론 고르기"}</legend>
          {options.map((option) => (
            <label key={option} className="choice">
              <input
                type="radio"
                name={`diagnosis-${mission.id}-${revising ? "revise" : "first"}`}
                checked={chosen === option}
                onChange={() => {
                  setDiagnosis(option);
                  dispatch({ type: revising ? "REVISE_DIAGNOSIS" : "SET_DIAGNOSIS", diagnosis: option });
                }}
              />
              <span className="choice-text">
                {chosen === option ? <strong>✓ 선택됨 — {optionLabel(option)}</strong> : optionLabel(option)}
              </span>
            </label>
          ))}
        </fieldset>
        {accepted !== null ? (
          <FeedbackPanel
            accepted={accepted}
            decision={String(chosen)}
            observationKeys={observationKeys}
            revised={revising || (record.revised && accepted)}
          />
        ) : null}
        <div className="step-actions">
          {!revising ? (
            <ActionButton disabled={chosen === null} onClick={() => dispatch({ type: "NEXT_STEP" })}>
              {accepted ? "판단을 골랐어요, 기록으로" : "판단을 골랐어요, 검토하기"}
            </ActionButton>
          ) : (
            <ActionButton
              disabled={chosen === null || !(record.revised || accepted === true)}
              onClick={() => dispatch({ type: "NEXT_STEP" })}
            >
              실험 기록 보기
            </ActionButton>
          )}
        </div>
        <div className="step-actions">
          <ActionButton variant="secondary" onClick={() => setConfirmRestart(true)}>
            처음부터 다시 하기
          </ActionButton>
        </div>
        <ModalDialog
          open={confirmRestart}
          title="처음부터 다시 하기"
          onClose={() => setConfirmRestart(false)}
        >
          <p>
            지금까지의 응답은 저장되지 않아요. 처음부터 다시 하면 모든 기록이 사라져요. 계속할까요?
          </p>
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
      </section>
    );
  }

  // REPORT (미션 단위)
  return (
    <section aria-labelledby="step-heading">
      <h2 id="step-heading">
        미션 {missionIndex + 1} 기록 — {mission.title}
      </h2>
      <table className="compare-table">
        <caption>나의 판단 기록</caption>
        <tbody>
          <tr>
            <th scope="row">최초 예측</th>
            <td>{record.prediction ? DECISION_LABELS[record.prediction] : "없음"}</td>
          </tr>
          <tr>
            <th scope="row">사용한 근거</th>
            <td>
              {record.evidenceKeys.length > 0
                ? record.evidenceKeys.map((key) => OBSERVATION_LABELS[key] ?? key).join(", ")
                : "없음"}
            </td>
          </tr>
          <tr>
            <th scope="row">최종 판단</th>
            <td>
              {record.finalDiagnosis
                ? isDiagnoseMission
                  ? SEAL_LABELS[record.finalDiagnosis]
                  : DECISION_LABELS[record.finalDiagnosis]
                : "없음"}
            </td>
          </tr>
          <tr>
            <th scope="row">판단 수정</th>
            <td>{record.revised ? "근거를 보고 수정했어요" : "수정 없음"}</td>
          </tr>
        </tbody>
      </table>
      <p className="refresh-note">이 기록은 저장되지 않아요. 새로고침하면 사라져요.</p>
      <div className="step-actions">
        {missionIndex < 5 ? (
          <ActionButton pulse onClick={() => dispatch({ type: "NEXT_MISSION" })}>
            다음 미션으로
          </ActionButton>
        ) : (
          <ActionButton pulse onClick={() => dispatch({ type: "FINISH" })}>
            전체 활동 기록 보기
          </ActionButton>
        )}
      </div>
    </section>
  );
}
