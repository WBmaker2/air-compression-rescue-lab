import type { AirState } from "../../domain/types";

const VOLUME_TO_PX: Readonly<Record<number, number>> = { 20: 60, 40: 140, 60: 220 };
const SPACING_PX: Readonly<Record<string, number>> = { low: 14, medium: 24, high: 34 };

interface SyringeFigureProps {
  readonly state: AirState;
  readonly label: string;
}

/** 검수된 상태 값과 정확히 일치하는 프로그램 SVG 주사기 단면. */
export function SyringeFigure({ state, label }: SyringeFigureProps) {
  const barrelX = 40;
  const barrelTop = 60;
  const barrelHeight = 80;
  const barrelWidth = 300;
  const innerWidth = VOLUME_TO_PX[state.modelVolume] ?? 220;
  const spacing = SPACING_PX[state.spacingLevel] ?? 24;

  const markers: Array<{ x: number; y: number }> = [];
  const cols = Math.max(1, Math.floor((innerWidth - 20) / spacing));
  for (let i = 0; i < state.airMarkerCount; i += 1) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    markers.push({
      x: barrelX + 14 + col * Math.min(spacing, (innerWidth - 20) / cols),
      y: barrelTop + 18 + row * spacing,
    });
  }

  const pistonX = barrelX + innerWidth;

  return (
    <figure className="syringe-figure">
      <svg
        viewBox="0 0 380 200"
        width="100%"
        role="img"
        aria-label={`${label}: 모형 부피 ${state.modelVolume}, 모형 공기 표식 ${state.airMarkerCount}개, 간격 ${state.spacingLevel}, 저항 느낌 ${state.resistanceFeel}`}
      >
        <rect
          x={barrelX}
          y={barrelTop}
          width={barrelWidth}
          height={barrelHeight}
          rx={8}
          className="syringe-barrel"
        />
        {/* 눈금 (모형 부비 표시용, 실제 측정값이 아님) */}
        {[20, 40, 60].map((mark) => {
          const x = barrelX + (VOLUME_TO_PX[mark] ?? 0);
          return (
            <g key={mark}>
              <line x1={x} y1={barrelTop} x2={x} y2={barrelTop - 8} className="syringe-tick" />
              <text x={x - 4} y={barrelTop - 12} className="syringe-tick-label">
                {mark}
              </text>
            </g>
          );
        })}
        <rect
          x={barrelX}
          y={barrelTop}
          width={innerWidth}
          height={barrelHeight}
          rx={8}
          className="syringe-air"
        />
        {markers.map((marker, index) => (
          <circle
            key={index}
            cx={marker.x}
            cy={marker.y}
            r={6}
            className="syringe-marker"
          />
        ))}
        <rect
          x={pistonX}
          y={barrelTop + 4}
          width={10}
          height={barrelHeight - 8}
          rx={3}
          className="syringe-piston"
        />
        <rect
          x={pistonX + 10}
          y={barrelTop + barrelHeight / 2 - 6}
          width={70}
          height={12}
          className="syringe-rod"
        />
        {state.sealState === "sealed" ? (
          <circle cx={barrelX} cy={barrelTop + barrelHeight / 2} r={7} className="syringe-cap" />
        ) : (
          <g className="syringe-opening">
            <line
              x1={barrelX - 10}
              y1={barrelTop + 10}
              x2={barrelX - 10}
              y2={barrelTop + barrelHeight - 10}
            />
            <text x={barrelX - 34} y={barrelTop + barrelHeight / 2 + 4}>
              출구
            </text>
          </g>
        )}
      </svg>
      <figcaption>
        모형 부피 {state.modelVolume} · 모형 공기 표식 {state.airMarkerCount}개 · 간격{" "}
        {state.spacingLevel} · 저항 느낌 {state.resistanceFeel}
        {state.sealState === "sealed" ? " · 끝이 막힘" : ""}
        {state.sealState === "open" ? " · 끝이 열림" : ""}
        {state.sealState === "leaking" ? " · 마개가 느슨함(누출 가능)" : ""}
      </figcaption>
    </figure>
  );
}
