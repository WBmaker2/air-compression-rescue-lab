import { ActionButton } from "../../components/ActionButton";
import { DECISION_LABELS, MISSIONS, OBSERVATION_LABELS, SEAL_LABELS } from "../../content/missions";
import type { MissionRecord } from "../../app/sessionReducer";
import "./print.css";

interface LearningReportProps {
  readonly records: readonly MissionRecord[];
  readonly onRestartRequest: () => void;
}

export function LearningReport({ records, onRestartRequest }: LearningReportProps) {
  return (
    <section aria-labelledby="report-heading" className="learning-report">
      <h2 id="report-heading">실험 기록 전체 보기</h2>
      <p>
        점수나 순위 없이, 최초 판단 → 사용한 근거 → 최종 결과의 흐름만 기록해요. 이 기록은
        저장되지 않으니 인쇄하거나 지금 화면에서 함께 보세요.
      </p>
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
                <td>{record?.prediction ? DECISION_LABELS[record.prediction] : "—"}</td>
                <td>
                  {record && record.evidenceKeys.length > 0
                    ? record.evidenceKeys.map((key) => OBSERVATION_LABELS[key] ?? key).join(", ")
                    : "—"}
                </td>
                <td>
                  {record?.finalDiagnosis
                    ? isDiagnoseMission
                      ? SEAL_LABELS[record.finalDiagnosis]
                      : DECISION_LABELS[record.finalDiagnosis]
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
        이 기록은 검수된 가상 모형에 대한 활동이며 실제 기기 실험 결과나 점수가 아니에요.
      </p>
    </section>
  );
}
