import type { RefObject } from "react";
import { ActionButton } from "../../components/ActionButton";
import { MISSIONS } from "../../content/missions";
import { labelForDecision, labelForObservation, labelForSeal } from "../../content/labels";
import type { MissionRecord } from "../../app/sessionReducer";
import "./print.css";

interface LearningReportProps {
  readonly records: readonly MissionRecord[];
  readonly headingRef: RefObject<HTMLHeadingElement>;
  readonly onRestartRequest: () => void;
}

export function LearningReport({ records, headingRef, onRestartRequest }: LearningReportProps) {
  return (
    <section aria-labelledby="report-heading" className="learning-report">
      <div className="step-header">
        <div className="step-heading-copy">
          <p className="step-eyebrow">활동 완료 · 전체 기록</p>
          <h1 id="report-heading" ref={headingRef} tabIndex={-1} className="step-title">
            실험 기록 전체 보기
          </h1>
        </div>
      </div>
      <p className="report-lede">
        점수나 순위 없이 첫 생각 → 사용한 근거 → 최종 결과의 흐름만 남겼어요. 저장되지 않으니
        인쇄하거나 지금 화면에서 함께 살펴보세요.
      </p>
      <div className="report-summary" aria-label="기록 읽는 순서">
        <span><strong>01</strong> 처음 생각</span>
        <span><strong>02</strong> 확인한 근거</span>
        <span><strong>03</strong> 최종 판단</span>
      </div>
      <table className="compare-table report-table">
        <caption>미션별 판단 기록 (모형 값)</caption>
        <thead>
          <tr>
            <th scope="col">미션</th>
            <th scope="col">최초 예측</th>
            <th scope="col">사용한 근거</th>
            <th scope="col">최종 판단</th>
            <th scope="col">수정</th>
          </tr>
        </thead>
        <tbody>
          {MISSIONS.map((mission, index) => {
            const record = records.find((candidate) => candidate.missionId === mission.id);
            const isDiagnoseMission = Boolean(mission.observationSignatures);
            return (
              <tr key={mission.id}>
                <th scope="row">
                  {index + 1}. {mission.title}
                </th>
                <td>{record?.prediction ? labelForDecision(record.prediction) : "—"}</td>
                <td>
                  {record && record.evidenceKeys.length > 0
                    ? record.evidenceKeys.map(labelForObservation).join(", ")
                    : "—"}
                </td>
                <td>
                  {record?.finalDiagnosis
                    ? isDiagnoseMission
                      ? labelForSeal(String(record.finalDiagnosis))
                      : labelForDecision(String(record.finalDiagnosis))
                    : "—"}
                </td>
                <td>{record?.revised ? "수정함" : "수정 없음"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="step-actions no-print">
        <ActionButton variant="secondary" onClick={() => window.print()}>
          인쇄하기
        </ActionButton>
        <ActionButton variant="secondary" onClick={onRestartRequest}>
          처음부터 다시 하기
        </ActionButton>
      </div>
      <p className="feedback-limit">
        이 기록은 이 활동의 가상 모형에 대한 기록이며 실제 기기 실험 결과나 점수가 아니에요.
      </p>
    </section>
  );
}
