import { labelForLevel, labelForSeal } from "../../content/labels";
import type { AirState } from "../../domain/types";

const VOLUME_TO_PX: Readonly<Record<number, number>> = { 20: 60, 40: 140, 60: 220 };
const SPACING_PX: Readonly<Record<string, number>> = { low: 14, medium: 24, high: 34 };
const BARREL_X = 40;
const BARREL_TOP = 60;
const BARREL_HEIGHT = 80;

export interface MarkerPosition {
  readonly x: number;
  readonly y: number;
}

/** 표식은 검수된 모형 값과 일치하면서 항상 주사기 통 안에 배치한다. */
export function calculateMarkerPositions(
  innerWidth: number,
  markerCount: number,
  spacingLevel: string
): readonly MarkerPosition[] {
  const safeWidth = Math.max(20, innerWidth - 20);
  const safeHeight = BARREL_HEIGHT - 24;
  const preferredSpacing = SPACING_PX[spacingLevel] ?? SPACING_PX.medium;
  const columns = Math.min(
    Math.max(1, markerCount),
    Math.max(1, Math.floor(safeWidth / preferredSpacing) + 1)
  );
  const rows = Math.max(1, Math.ceil(markerCount / columns));
  const xStep = columns > 1 ? safeWidth / (columns - 1) : 0;
  const yStep = rows > 1 ? safeHeight / (rows - 1) : 0;

  return Array.from({ length: markerCount }, (_, index) => {
    const column = index % columns;
    const row = Math.floor(index / columns);
    return {
      x: BARREL_X + 10 + column * xStep,
      y: rows === 1 ? BARREL_TOP + BARREL_HEIGHT / 2 : BARREL_TOP + 12 + row * yStep,
    };
  });
}

interface SyringeFigureProps {
  readonly state: AirState;
  readonly label: string;
}

/** 검수된 상태 값과 정확히 일치하는 프로그램 SVG 주사기 단면. */
export function SyringeFigure({ state, label }: SyringeFigureProps) {
  const barrelWidth = 300;
  const innerWidth = VOLUME_TO_PX[state.modelVolume] ?? 220;
  const pistonX = BARREL_X + innerWidth;
  const markers = calculateMarkerPositions(innerWidth, state.airMarkerCount, state.spacingLevel);
  const sealLabel = labelForSeal(state.sealState);
  const spacingLabel = labelForLevel(state.spacingLevel);
  const resistanceLabel = labelForLevel(state.resistanceFeel);

  return (
    <figure className="syringe-figure">
      <svg
        viewBox="0 0 380 200"
        width="100%"
        role="img"
        aria-label={`${label}: 모형 부피 ${state.modelVolume}, 모형 공기 표식 ${state.airMarkerCount}개, 간격 ${spacingLabel}, 누르기 어려운 정도 ${resistanceLabel}, 끝 상태 ${sealLabel}`}
      >
        <rect
          x={BARREL_X}
          y={BARREL_TOP}
          width={barrelWidth}
          height={BARREL_HEIGHT}
          rx={8}
          className="syringe-barrel"
        />
        {/* 눈금은 모형 부피 표시용이며 실제 측정값이 아니다. */}
        {[20, 40, 60].map((mark) => {
          const x = BARREL_X + (VOLUME_TO_PX[mark] ?? 0);
          return (
            <g key={mark}>
              <line x1={x} y1={BARREL_TOP} x2={x} y2={BARREL_TOP - 8} className="syringe-tick" />
              <text x={x - 4} y={BARREL_TOP - 12} className="syringe-tick-label">
                {mark}
              </text>
            </g>
          );
        })}
        <rect
          x={BARREL_X}
          y={BARREL_TOP}
          width={innerWidth}
          height={BARREL_HEIGHT}
          rx={8}
          className="syringe-air"
        />
        {markers.map((marker, index) => (
          <circle key={`${marker.x}-${marker.y}-${index}`} cx={marker.x} cy={marker.y} r={6} className="syringe-marker" />
        ))}
        <rect
          x={pistonX}
          y={BARREL_TOP + 4}
          width={10}
          height={BARREL_HEIGHT - 8}
          rx={3}
          className="syringe-piston"
        />
        <rect
          x={pistonX + 10}
          y={BARREL_TOP + BARREL_HEIGHT / 2 - 6}
          width={70}
          height={12}
          className="syringe-rod"
        />
        {state.sealState === "sealed" ? (
          <circle cx={BARREL_X} cy={BARREL_TOP + BARREL_HEIGHT / 2} r={7} className="syringe-cap" />
        ) : state.sealState === "open" ? (
          <g className="syringe-opening">
            <line
              x1={BARREL_X - 10}
              y1={BARREL_TOP + 10}
              x2={BARREL_X - 10}
              y2={BARREL_TOP + BARREL_HEIGHT - 10}
            />
            <text x={BARREL_X - 34} y={BARREL_TOP + BARREL_HEIGHT / 2 + 4}>
              열림
            </text>
          </g>
        ) : (
          <g className="syringe-leaking">
            <circle cx={BARREL_X - 2} cy={BARREL_TOP + BARREL_HEIGHT / 2} r={7} />
            <path d={`M${BARREL_X - 10} 78v44M${BARREL_X - 17} 88h7M${BARREL_X - 17} 112h7`} />
            <circle cx={BARREL_X - 25} cy={BARREL_TOP + 30} r={2.5} />
            <circle cx={BARREL_X - 31} cy={BARREL_TOP + 48} r={2} />
            <text x={BARREL_X - 36} y={BARREL_TOP + BARREL_HEIGHT / 2 + 4}>
              누출
            </text>
          </g>
        )}
      </svg>
      <figcaption>
        모형 부피 {state.modelVolume} · 모형 공기 표식 {state.airMarkerCount}개 · 간격 {spacingLabel} ·
        누르기 어려운 정도 {resistanceLabel} · {sealLabel}
      </figcaption>
    </figure>
  );
}
