import { useEffect, useRef, type RefObject } from "react";
import { ActionButton } from "../../components/ActionButton";
import { MISSIONS, DECISION_LABELS } from "../../content/missions";
import type { SessionAction } from "../../app/sessionReducer";
import entranceImage from "../../assets/generated/safe-virtual-air-lab.webp";

interface EntranceScreenProps {
  readonly dispatch: (action: SessionAction) => void;
  readonly headingRef: RefObject<HTMLHeadingElement>;
}

export function EntranceScreen({ dispatch, headingRef }: EntranceScreenProps) {
  const startRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    startRef.current?.focus();
  }, []);

  return (
    <section className="entrance" aria-labelledby="entrance-heading">
      <div className="entrance-hero">
        <div className="entrance-copy">
          <p className="section-kicker">오늘의 탐구 · 공기는 어디에 있을까?</p>
          <h1 id="entrance-heading" ref={headingRef} tabIndex={-1} className="entrance-title">
            공기 부피 압축 연구소
          </h1>
          <p className="entrance-goal">
            오늘의 목표: 밀폐·열림·누출 조건의 가상 주사기 모형을 관찰하고, 공기가 차지하는
            공간과 표식의 변화를 근거로 설명해요.
          </p>
          <div className="entrance-actions">
            <ActionButton
              ref={startRef}
              pulse
              className="start-button"
              onClick={() => dispatch({ type: "START" })}
            >
              가상 실험 시작하기
            </ActionButton>
            <p className="entrance-note">
              응답은 저장되지 않아요. 이름·학급을 묻지 않는 교실용 활동이에요.
            </p>
          </div>
        </div>
        <figure className="entrance-visual">
          <img
            src={entranceImage}
            alt=""
            aria-hidden="true"
            className="entrance-image"
            width={960}
            height={420}
          />
          <figcaption className="entrance-caption">
            오늘의 관찰 도구 · 가상 주사기 모형
          </figcaption>
        </figure>
      </div>

      <ul className="entrance-facts" aria-label="활동 안내">
        <li className="fact-card">
          <span className="fact-label">대상</span>
          <strong>초등 5–6학년</strong>
          <span>예상 20–30분</span>
        </li>
        <li className="fact-card">
          <span className="fact-label">미션</span>
          <strong>검수된 6개</strong>
          <span>밀폐·열림·누출·진단</span>
        </li>
        <li className="fact-card">
          <span className="fact-label">안전한 범위</span>
          <strong>가상 모형만</strong>
          <span>실제 주사기 조작 지시 없음</span>
        </li>
        <li className="fact-card">
          <span className="fact-label">기록</span>
          <strong>저장하지 않음</strong>
          <span>새로고침하면 지금까지의 답이 사라져요</span>
        </li>
      </ul>

      <div className="mission-library">
        <div className="mission-library-header">
          <div>
            <p className="section-kicker">탐구 순서</p>
            <h2>6개의 미션을 차례로 풀어요</h2>
          </div>
          <p>먼저 예측하고, 실행 뒤 관찰 근거를 골라요.</p>
        </div>
        <ol className="entrance-missions">
          {MISSIONS.map((mission, index) => (
            <li key={mission.id} className="mission-item">
              <span className="mission-number" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <strong className="mission-title">
                  <span className="visually-hidden">미션 {index + 1}. </span>
                  {mission.title}
                </strong>
                <span className="mission-task">{mission.task}</span>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="decision-guide">
        <div>
          <p className="section-kicker">예측 어휘</p>
          <h2>관찰 뒤 고를 네 가지 판단</h2>
        </div>
        <ul className="entrance-decisions">
          {Object.entries(DECISION_LABELS).map(([key, label]) => (
            <li key={key}>{label}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
