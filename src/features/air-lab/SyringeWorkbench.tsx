import { useEffect, useMemo, useState, type RefObject } from "react";
import { ActionButton } from "../../components/ActionButton";
import { ModalDialog } from "../../components/ModalDialog";
import { StepHeader } from "../../components/StepHeader";
import {
  labelForComparison,
  labelForDecision,
  labelForLevel,
  labelForObservation,
  labelForSeal,
} from "../../content/labels";
import { evaluateDiagnosis, compareAirStates, simulateAirCase } from "../../domain/airModel";
import type { AirDecision, AirMission, SealState, SessionStep } from "../../domain/types";
import type { MissionRecord, SessionAction } from "../../app/sessionReducer";
import { FeedbackPanel } from "./FeedbackPanel";
import { SyringeFigure } from "./SyringeFigure";

const PREDICTION_OPTIONS: readonly AirDecision[] = [
  "compressed",
  "expanded",
  "escaped",
  "insufficient-information",
];

const DIAGNOSIS_SEALS: readonly SealState[] = ["sealed", "open", "leaking"];

interface SyringeWorkbenchProps {
  readonly mission: AirMission;
  readonly missionIndex: number;
  readonly step: SessionStep;
  readonly record: MissionRecord;
  readonly headingRef: RefObject<HTMLHeadingElement>;
  readonly dispatch: (action: SessionAction) => void;
}

export function SyringeWorkbench({
  mission,
  missionIndex,
  step,
  record,
  headingRef,
  dispatch,
}: SyringeWorkbenchProps) {
  const [runResult, setRunResult] = useState<ReturnType<typeof simulateAirCase> | "no-run" | null>(null);
  const [evidence, setEvidence] = useState<readonly string[]>([]);
  const [diagnosis, setDiagnosis] = useState<AirDecision | SealState | null>(null);
  const [confirmRestart, setConfirmRestart] = useState(false);

  useEffect(() => {
    setRunResult(null);
    setEvidence([]);
    setDiagnosis(record.finalDiagnosis ?? null);
    // 미션이 바뀔 때만 로컬 실행 결과를 비운다. 단계 뒤로 가기는 기록을 보존한다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mission.id]);

  const isDiagnoseMission = Boolean(mission.observationSignatures);
  const fromState = mission.states[0];
  const observationKeys = useMemo(() => {
    if (runResult && runResult !== "no-run") return runResult.evaluation.observationKeys;
    if (isDiagnoseMission) return mission.observationSignatures?.[0]?.observationKeys ?? [];
    if (runResult === "no-run") return ["obs.not-enough-information"];
    return [];
  }, [runResult, isDiagnoseMission, mission.observationSignatures]);

  const evaluateChoice = (choice: AirDecision | SealState): boolean => {
    if (isDiagnoseMission) return evaluateDiagnosis(mission, choice as SealState).correct;
    if (mission.id === "air-leak-05") return choice === "insufficient-information";
    return mission.expectedDecisions.includes(choice as AirDecision);
  };

  const back = () => dispatch({ type: "BACK" });

  if (step === "OBSERVE") {
    return (
      <section className="workbench-step" aria-labelledby="step-heading">
        <StepHeader
          eyebrow={`미션 ${missionIndex + 1} · 첫 번째 기록`}
          title={`조건 관찰 — 미션 ${missionIndex + 1}: ${mission.title}`}
          headingRef={headingRef}
        />
        <p className="misconception-guard">
          <strong>생각 점검</strong> {mission.misconceptionGuard}
        </p>
        <p className="step-lede">{mission.scene}</p>
        <div className="step-split observation-split">
          <div className="data-card">
            <p className="data-card__label">시작 상태 · 모형 값</p>
            <table className="condition-table">
              <caption>조건 요약 (모형 값)</caption>
              <tbody>
                <tr>
                  <th scope="row">끝 상태</th>
                  <td>{labelForSeal(fromState.sealState)}</td>
                </tr>
                <tr>
                  <th scope="row">모형 부피</th>
                  <td>{fromState.modelVolume}</td>
                </tr>
                <tr>
                  <th scope="row">모형 공기 표식</th>
                  <td>{fromState.airMarkerCount}개</td>
                </tr>
                <tr>
                  <th scope="row">표식 간격</th>
                  <td>{labelForLevel(fromState.spacingLevel)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <SyringeFigure state={fromState} label="시작 상태" />
        </div>
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
      <section className="workbench-step" aria-labelledby="step-heading">
        <StepHeader eyebrow="두 번째 기록 · 실행 전" title="예측판 — 먼저 생각해 보기" headingRef={headingRef} onBack={back} />
        <p className="step-lede">{mission.task}</p>
        <fieldset className="choice-list">
          <legend>
            {isDiagnoseMission
              ? "관찰 기록을 보기 전, 어떤 결과를 먼저 예상하나요?"
              : "피스톤을 움직인 뒤 어떤 일이 일어날 것 같나요?"}
          </legend>
          {PREDICTION_OPTIONS.map((option) => (
            <label key={option} className="choice">
              <input
                type="radio"
                name={`prediction-${mission.id}`}
                checked={record.prediction === option}
                onChange={() => dispatch({ type: "SET_PREDICTION", decision: option })}
              />
              <span className="choice-text">
                {record.prediction === option ? <strong>선택됨 · {labelForDecision(option)}</strong> : labelForDecision(option)}
              </span>
            </label>
          ))}
        </fieldset>
        <div className="step-actions">
          <ActionButton
            pulse={record.prediction !== null}
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
    const actionLabel = transition?.action === "pull" ? "피스톤 당기기" : "피스톤 누르기";
    return (
      <section className="workbench-step" aria-labelledby="step-heading">
        <StepHeader eyebrow="세 번째 기록 · 한 단계 실행" title="가상 실행 — 한 단계만 움직여요" headingRef={headingRef} onBack={back} />
        <div className="run-layout">
          <SyringeFigure state={fromState} label="실행 전" />
          <div className="run-copy">
            <p className="data-card__label">가상 행동</p>
            {transition ? (
              <p>
                예측한 행동은 <strong>{actionLabel}</strong>이에요. 모형 부피가 {fromState.modelVolume}에서{" "}
                {mission.states.find((state) => state.id === transition.toStateId)?.modelVolume}으로 바뀌는 한 단계만 실행해요.
              </p>
            ) : (
              <p>
                확정된 결과 상태가 제공되지 않아요. 실행 결과를 만들어 내지 않고, 관찰 기록을 확인하는 것으로 넘어가요.
              </p>
            )}
            <p className="model-note">실제 주사기를 움직이는 안내가 아니라, 이 활동의 가상 모형 변화를 보여 줍니다.</p>
          </div>
        </div>
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
            <ActionButton
              pulse
              onClick={() => {
                setRunResult("no-run");
                dispatch({ type: "NEXT_STEP" });
              }}
            >
              관찰 결과 확인
            </ActionButton>
          )}
        </div>
      </section>
    );
  }

  if (step === "COMPARE") {
    const before = runResult && runResult !== "no-run" ? runResult.from : fromState;
    const after = runResult && runResult !== "no-run" ? runResult.to : isDiagnoseMission ? null : fromState;
    const compareKeys = runResult && runResult !== "no-run" && after ? compareAirStates(before, after) : [];

    return (
      <section className="workbench-step" aria-labelledby="step-heading">
        <StepHeader eyebrow="네 번째 기록 · 변화 찾기" title="비교판 — 전과 후를 같은 기준으로" headingRef={headingRef} onBack={back} />
        {runResult && runResult !== "no-run" ? (
          <div className="step-split compare-split">
            <div>
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
                    <th scope="row">표식 간격</th>
                    <td>{labelForLevel(before.spacingLevel)}</td>
                    <td>{labelForLevel(after?.spacingLevel ?? "medium")}</td>
                  </tr>
                  <tr>
                    <th scope="row">누르기 어려운 정도</th>
                    <td>{labelForLevel(before.resistanceFeel)}</td>
                    <td>{labelForLevel(after?.resistanceFeel ?? "medium")}</td>
                  </tr>
                </tbody>
              </table>
              <ul className="compare-keys" aria-label="찾은 변화">
                {compareKeys.map((key) => (
                  <li key={key}>{labelForComparison(key)}</li>
                ))}
              </ul>
            </div>
            <SyringeFigure state={after!} label="실행 후" />
          </div>
        ) : isDiagnoseMission ? (
          <table className="compare-table">
            <caption>가상 펌프의 세 번의 관찰 기록 (모형 값)</caption>
            <thead>
              <tr>
                <th scope="col">관찰</th>
                <th scope="col">모형 부피</th>
                <th scope="col">공기 표식</th>
                <th scope="col">누르기 어려운 정도</th>
              </tr>
            </thead>
            <tbody>
              {[ ["관찰 1", "60", "12개", "낮음"], ["관찰 2", "40", "10개", "낮음"], ["관찰 3", "20", "8개", "중간"] ].map(([observation, volume, markers, resistance]) => (
                <tr key={observation}>
                  <th scope="row">{observation}</th>
                  <td>{volume}</td>
                  <td>{markers}</td>
                  <td>{resistance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="empty-state">
            확정된 실행 결과가 없어요. 누출량과 누른 뒤 변화 정보가 없어서 판단을 보류하는 것이 과학적인 태도예요.
          </p>
        )}

        <fieldset className="choice-list evidence-list">
          <legend>어떤 근거를 확인했나요? (하나 이상)</legend>
          {observationKeys.map((key) => (
            <label key={key} className="choice">
              <input
                type="checkbox"
                checked={evidence.includes(key)}
                onChange={(event) =>
                  setEvidence(
                    event.target.checked ? [...evidence, key] : evidence.filter((candidate) => candidate !== key)
                  )
                }
              />
              <span className="choice-text">{labelForObservation(key)}</span>
            </label>
          ))}
        </fieldset>
        <div className="step-actions">
          <ActionButton
            pulse={evidence.length > 0}
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
    const diagnosisEvaluation = chosen === null
      ? null
      : isDiagnoseMission
        ? evaluateDiagnosis(mission, chosen as SealState)
        : {
            correct: evaluateChoice(chosen),
            evidenceKeys: runResult && runResult !== "no-run" ? runResult.evaluation.evidenceKeys : [],
          };
    const accepted = diagnosisEvaluation?.correct ?? false;
    const firstWasWrong = record.firstDiagnosis !== null && !evaluateChoice(record.firstDiagnosis);
    const options: readonly (AirDecision | SealState)[] = isDiagnoseMission ? DIAGNOSIS_SEALS : PREDICTION_OPTIONS;
    const optionLabel = (option: AirDecision | SealState) =>
      isDiagnoseMission ? labelForSeal(option) : labelForDecision(option);

    return (
      <section className="workbench-step" aria-labelledby="step-heading">
        <StepHeader
          eyebrow={
            revising
              ? firstWasWrong
                ? "여섯 번째 기록 · 다시 보기"
                : "여섯 번째 기록 · 판단 확인"
              : "다섯 번째 기록 · 결론 세우기"
          }
          title={
            revising
              ? firstWasWrong
                ? "규칙 수정 — 한 번 다시 볼까요?"
                : "검토판 — 판단을 기록하기 전에"
              : "진단판 — 관찰로 설명하기"
          }
          headingRef={headingRef}
          onBack={back}
        />
        {revising && firstWasWrong ? (
          <p className="misconception-guard">
            처음 판단이 관찰 근거와 맞지 않아요. 근거를 다시 읽고 한 번 수정할 수 있어요. 정답을 대신 알려 주지는 않아요.
          </p>
        ) : null}
        <fieldset className="choice-list">
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
              <span className="choice-text">{chosen === option ? <strong>선택됨 · {optionLabel(option)}</strong> : optionLabel(option)}</span>
            </label>
          ))}
        </fieldset>
        {diagnosisEvaluation ? (
          <FeedbackPanel
            accepted={accepted}
            decision={String(chosen)}
            observationKeys={observationKeys}
            evidenceKeys={diagnosisEvaluation.evidenceKeys}
            revised={record.revised && accepted === true}
          />
        ) : null}
        <div className="step-actions">
          {!revising ? (
            <ActionButton
              pulse={chosen !== null}
              disabled={chosen === null}
              onClick={() => dispatch({ type: "NEXT_STEP" })}
            >
              {accepted ? "판단을 골랐어요, 기록으로" : "판단을 골랐어요, 검토하기"}
            </ActionButton>
          ) : (
            <ActionButton
              pulse={chosen !== null && (record.revised || accepted === true)}
              disabled={chosen === null || !(record.revised || accepted === true)}
              onClick={() => dispatch({ type: "NEXT_STEP" })}
            >
              실험 기록 보기
            </ActionButton>
          )}
        </div>
        <div className="secondary-actions">
          <ActionButton variant="secondary" onClick={() => setConfirmRestart(true)}>
            처음부터 다시 하기
          </ActionButton>
        </div>
        <ModalDialog open={confirmRestart} title="처음부터 다시 하기" onClose={() => setConfirmRestart(false)}>
          <p>지금까지의 응답은 저장되지 않아요. 처음부터 다시 하면 모든 기록이 사라져요. 계속할까요?</p>
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

  return (
    <section className="workbench-step" aria-labelledby="step-heading">
      <StepHeader eyebrow={`미션 ${missionIndex + 1} · 마지막 기록`} title={`미션 ${missionIndex + 1} 기록 — ${mission.title}`} headingRef={headingRef} onBack={back} />
      <div className="record-summary">
        <p className="data-card__label">이번 미션에서 남긴 흐름</p>
        <p>첫 생각에서 근거 확인, 최종 판단까지의 과정을 한눈에 살펴보세요.</p>
      </div>
      <table className="compare-table record-table">
        <caption>나의 판단 기록</caption>
        <tbody>
          <tr>
            <th scope="row">최초 예측</th>
            <td>{record.prediction ? labelForDecision(record.prediction) : "없음"}</td>
          </tr>
          <tr>
            <th scope="row">사용한 근거</th>
            <td>
              {record.evidenceKeys.length > 0 ? record.evidenceKeys.map(labelForObservation).join(", ") : "없음"}
            </td>
          </tr>
          <tr>
            <th scope="row">최종 판단</th>
            <td>
              {record.finalDiagnosis
                ? isDiagnoseMission
                  ? labelForSeal(String(record.finalDiagnosis))
                  : labelForDecision(String(record.finalDiagnosis))
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
