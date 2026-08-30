import {
  labelForDecision,
  labelForEvidence,
  labelForObservation,
} from "../../content/labels";
import type { AirEvaluation } from "../../domain/types";

interface FeedbackPanelProps {
  readonly accepted: boolean;
  readonly decision: string;
  readonly observationKeys?: readonly string[];
  readonly evidenceKeys?: readonly string[];
  readonly revised?: boolean;
}

export function FeedbackPanel({
  accepted,
  decision,
  observationKeys = [],
  evidenceKeys = [],
  revised = false,
}: FeedbackPanelProps) {
  return (
    <div
      role="status"
      className={accepted ? "feedback accepted" : "feedback revise"}
      aria-live="polite"
    >
      <div className="feedback-heading">
        <span className="feedback-status" aria-hidden="true">
          {accepted ? "맞음" : "다시 보기"}
        </span>
        <h3>{accepted ? "판단이 관찰과 일치해요" : "관찰 근거를 다시 확인해 볼까요?"}</h3>
      </div>
      <p className="feedback-choice">
        네가 고른 판단: <strong>{labelForDecision(decision)}</strong>
      </p>
      {revised ? <p>처음 판단을 관찰 근거로 수정했어요. 수정도 좋은 과학 태도예요.</p> : null}
      {observationKeys.length > 0 ? (
        <>
          <h4>관찰 결과</h4>
          <ul>
            {observationKeys.map((key) => (
              <li key={key}>{labelForObservation(key)}</li>
            ))}
          </ul>
        </>
      ) : null}
      {evidenceKeys.length > 0 ? (
        <>
          <h4>함께 볼 근거</h4>
          <ul>
            {evidenceKeys.map((key) => (
              <li key={key}>{labelForEvidence(key)}</li>
            ))}
          </ul>
        </>
      ) : null}
      <p className="feedback-limit">
        이 판정은 검수된 가상 모형의 결과예요. 실제 세계 전체를 보장하지 않아요.
      </p>
    </div>
  );
}

export function evaluationToFeedback(evaluation: AirEvaluation, revised = false): {
  accepted: boolean;
  decision: string;
  observationKeys: readonly string[];
  evidenceKeys: readonly string[];
  revised: boolean;
} {
  return {
    accepted: evaluation.accepted,
    decision: evaluation.decision,
    observationKeys: evaluation.observationKeys,
    evidenceKeys: evaluation.evidenceKeys,
    revised,
  };
}
