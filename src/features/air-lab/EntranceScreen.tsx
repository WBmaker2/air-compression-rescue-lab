import { useEffect, useRef } from "react";
import { ActionButton } from "../../components/ActionButton";
import { MISSIONS, DECISION_LABELS } from "../../content/missions";
import type { SessionAction } from "../../app/sessionReducer";
import entranceImage from "../../assets/generated/safe-virtual-air-lab.webp";

interface EntranceScreenProps {
  readonly dispatch: (action: SessionAction) => void;
}

export function EntranceScreen({ dispatch }: EntranceScreenProps) {
  const startRef = useRef<HTMLButtonElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    startRef.current?.focus();
  }, []);

  return (
    <section className="entrance" aria-labelledby="entrance-heading">
      <img
        src={entranceImage}
        alt=""
        aria-hidden="true"
        className="entrance-image"
        width={960}
        height={420}
      />
      <h2 id="entrance-heading" ref={heading} tabIndex={-1} className="entrance-title">
        공기 부피 압축 연구소
      </h2>
      <p className="entrance-goal">
        오늘의 목표: 밀폐·열림·누출 조건의 가상 주사기 모형에서 공기가 차지하는 공간과
        모형 공기 표식의 변화를 예측하고, 관찰 근거로 설명해요.
      </p>
      <ul className="entrance-facts">
        <li>초등 5~6학년 과학 활동 · 예상 시간 20~30분</li>
        <li>검수된 6개 미션 (밀폐 2개, 열림 1개, 당기기 1개, 누출 1개, 진단 1개)</li>
        <li>여기에는 실제 주사기 실험 지시가 없어요. 가상 모형만 다뤄요.</li>
        <li>응답은 저장되지 않아요. 새로고침하면 지금까지의 답이 사라져요.</li>
      </ul>

      <h2>미션 목록</h2>
      <ol className="entrance-missions">
        {MISSIONS.map((mission, index) => (
          <li key={mission.id}>
            <strong>
              미션 {index + 1}. {mission.title}
            </strong>
            <span> — {mission.task}</span>
          </li>
        ))}
      </ol>

      <h2>예측에 쓰는 판단</h2>
      <ul className="entrance-decisions">
        {Object.entries(DECISION_LABELS).map(([key, label]) => (
          <li key={key}>{label}</li>
        ))}
      </ul>

      <ActionButton
        ref={startRef}
        pulse
        className="start-button"
        onClick={() => dispatch({ type: "START" })}
      >
        가상 실험 시작하기
      </ActionButton>
      <p className="entrance-note">
        이 앱은 이름이나 학급 정보를 묻지 않고, 어떤 것도 저장하지 않는 밝은 교실용 활동이에요.
      </p>
    </section>
  );
}
