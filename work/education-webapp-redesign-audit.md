# 공기 부피 압축 연구소 초기 리디자인 감사

⚠️ 초기 감사 상태: DEGRADED (초기 사전 점검 시점에는 `$ui-ux-pro-max` 런타임 등록과 유효한 전용 브라우저 서버가 확인되지 않음). 구현 후 해소 기록은 아래에 추가했습니다.

> 감사일: 2026-08-30 (Asia/Seoul)
>
> 이 문서는 구현 전 초기 감사입니다. 코드·콘텐츠·설정·이미지는 수정하지 않았습니다. 소스 검토와 자동 기준선 결과를 분리했으며, 브라우저 E2E 실패는 다른 앱이 4173 포트를 점유한 환경 충돌로 확인되어 제품 결함으로 집계하지 않았습니다.

## 1. 감사 범위와 근거

### 읽은 대상

- `src/app/App.tsx`, `src/app/sessionReducer.ts`
- `src/features/air-lab/EntranceScreen.tsx`, `SyringeWorkbench.tsx`, `SyringeFigure.tsx`, `FeedbackPanel.tsx`
- `src/features/report/LearningReport.tsx`, `src/features/report/print.css`
- `src/components/*.tsx`, `src/styles/*.css`, `src/content/*.ts`, `src/domain/*.ts`
- `index.html`, `vite.config.ts`, `package.json`, `README.md`
- `docs/content-review.md`, `docs/image-rights-ledger.md`, `docs/qa/acceptance-checklist.md`

### 실행한 기준선

| 명령/검사 | 결과 | 해석 |
|---|---|---|
| `npm run lint` | exit 0 | 통과 |
| `npm run typecheck` | exit 0 | 통과 |
| `npm run test:run` | 47 tests passed | 통과 |
| `npm run test:a11y` | 3 tests passed | serious/critical 0건; jsdom canvas `getContext` 경고 별도 보류 |
| `npm run check:lines` | exit 0 | TS/TSX/CSS 500줄 이상 없음 |
| `npm run build` | exit 0 | production base `/air-compression-rescue-lab/`와 해시 자산 생성 |
| `npm run test:e2e` | 7개 중 1 pass, 6 fail | 4173 포트가 “소수 자리 교환소”를 제공하여 앱 흐름을 검증하지 못함 |
| `impeccable detect.mjs --json ...` | degraded + `[]` | `htmlparser2`, `css-select`, `css-tree`, `domutils` 부재로 regex fallback; clean 증거가 아님 |

브라우저 E2E의 실패 근거는 `e2e/learner-flow.spec.ts`가 기대한 `공기 부피 압축 연구소` 대신 `소수 자리 교환소`를 수신한 것입니다. 다음 실행에서는 프로젝트 전용 preview 포트와 프로젝트 이름이 포함된 브라우저 세션을 사용해야 합니다.

## 2. Audit Health Score

| # | Dimension | Score | 핵심 근거 |
|---|---|---:|---|
| 1 | Accessibility | 2/4 | semantic table/fieldset, focus-visible, reducer-based focus는 좋지만 현재 단계 제목 focus·skip/back·내부 ID 비노출·modal focus restore가 불완전 |
| 2 | Performance | 3/4 | 정적 로컬 자산 1개, 작은 의존성, 순수 판정; hero 이미지 최적화·시각 검증과 canvas 경고는 보류 |
| 3 | Responsive Design | 2/4 | 480px breakpoint와 button stack은 있으나 CTA가 긴 입구 뒤에 있고 표가 내부 가로 스크롤, SVG 표식 overflow 가능 |
| 4 | Theming | 2/4 | 토큰 파일은 있으나 CSS에 색·반경·경계 값이 반복되고 상태 색의 역할이 분산됨; 라이트 고정은 의도된 계약 |
| 5 | Implementation Integrity | 2/4 | finite-state 학습 모델은 제품별로 명확하나 피드백 raw key, 누출/열림 도식 분기, 숨은 전역 H1이 화면 의미를 흔듦 |
| **Total** |  | **11/20** | **Acceptable — significant redesign work needed** |

점수는 전체 리디자인 승인이나 접근성 승인을 의미하지 않습니다. 특히 detector가 undercount 상태이므로 구현 뒤 동일한 검사와 전용 브라우저 검증이 필요합니다.

## 3. Nielsen heuristic snapshot

| # | Heuristic | Score | 핵심 이슈 |
|---:|---|---:|---|
| 1 | Visibility of system status | 3/4 | 진행 단계와 feedback은 있으나 현재 단계 제목 focus가 전역 숨은 H1로 이동 |
| 2 | Match system / real world | 3/4 | 모형 부피·표식·밀폐/열림/누출 언어가 실제 학습 계약과 맞음; low/medium/high 영문 노출은 다듬을 여지 |
| 3 | User control and freedom | 2/4 | reducer의 `BACK`은 있지만 화면에 연결되지 않음; restart와 modal은 있음 |
| 4 | Consistency and standards | 2/4 | 버튼/표/선택지는 반복되나 화면별 CTA 문장·간격·상태 표시가 균일하지 않음 |
| 5 | Error prevention | 3/4 | 필수 선택 없이 다음으로 못 감; 누출 정보 부족을 판단 보류로 안내. raw key는 오류 회복을 방해 |
| 6 | Recognition rather than recall | 2/4 | 전후 표는 인식에 도움되나 입구의 긴 목록과 4개 장문 선택지가 한 번에 노출 |
| 7 | Flexibility and efficiency | 2/4 | 클릭·키보드 테스트는 있으나 back/단계 요약/모바일 대체표가 부족 |
| 8 | Aesthetic and minimalist design | 2/4 | 파란 표면·둥근 카드·일렬 목록이 기능은 하지만 교육용 실험대의 구체적 시각 계층이 약함 |
| 9 | Help users recognize/recover from errors | 3/4 | 오답에서 정답을 바로 공개하지 않고 근거 재확인 제공; 어느 근거가 왜 중요한지 더 선명해야 함 |
| 10 | Help and documentation | 3/4 | 모형 한계·무저장·업데이트 내역이 있음; 긴 안내가 첫 행동보다 앞섬 |

## 4. 학습자 흐름 감사

### 잘 작동하는 점

- 처음부터 전체 기록까지 상태가 `INTRO → OBSERVE → PREDICT → RUN → COMPARE → DIAGNOSE → REVISE → REPORT`로 명시되어 있습니다.
- 밀폐·열림·누출을 같은 연속 물리식으로 임의 계산하지 않고 승인된 상태 전이표에서 판정합니다.
- 오답 시 관찰 근거를 다시 확인하고 한 번 수정할 수 있으며, 점수·순위·속도 압박이 없습니다.
- `aria-live`, `fieldset/legend`, table caption/scope, `:focus-visible`, reduced-motion 대체, 무저장 문구가 이미 있습니다.

### 첫 시선과 인지 부하

- 입구는 목표, 사실 목록, 6개 미션의 전체 task, 4개 판단 목록, 시작 버튼을 순서대로 길게 보여 줍니다. 학생의 첫 질문인 “무엇을 하고 지금 무엇을 누르지?”가 화면 아래로 밀릴 수 있습니다.
- 예측 선택지는 4개 모두 긴 설명을 포함합니다. 특히 `insufficient-information`은 판단 보류라는 중요한 태도이지만 다른 결과와 같은 시각 무게라 의미가 흐려질 수 있습니다.
- 비교판은 표·근거 checkbox·도식이 한 화면에 이어져 있습니다. 핵심 변화(부피 감소, 표식 보존, 간격 감소)를 먼저 요약한 뒤 세부 근거를 보여 주는 계층이 필요합니다.

### 정서적 흐름

- 입구의 가상 모형 경계와 무저장 안내는 안전감을 줍니다.
- 첫 실행에서 전후 변화가 분명하게 보이면 학습의 peak가 될 수 있으나, 현재는 주사기 도식의 표식 overflow와 내부 key가 그 순간을 약화시킬 수 있습니다.
- 결과는 정답 축하보다 기록·수정 중심이라는 방향이 적절합니다. 끝 화면에는 “다음에 무엇을 볼지”가 더 명확한 행동으로 고정되어야 합니다.

## 5. 우선순위별 상세 발견

### P1 — 수정 전까지 리디자인 수용 기준을 막는 문제

#### [P1] 새 단계의 실제 heading으로 초점이 이동하지 않음

- 위치: `src/app/App.tsx:52-79`, 각 단계의 `src/features/air-lab/SyringeWorkbench.tsx:80-121`, `125-163`
- 범주: Accessibility / Visibility
- 근거: `useEffect`는 `headingRef`인 숨은 전역 `<h1>`에 focus하고, 실제 단계 제목 `<h2 id="step-heading">`에는 ref가 없습니다.
- 영향: 키보드 사용자와 보조기술 사용자가 단계 이동 뒤 “조건 관찰”, “예측판” 같은 현재 맥락을 즉시 확인하기 어렵습니다.
- 권고: 앱 셸이 현재 화면 heading ref를 전달하거나 단계 heading을 공통 `StepHeading`으로 만들고, focus 후 필요한 경우 `scrollIntoView`를 호출합니다. 전역 제품명 H1과 현재 단계 heading의 역할을 분리합니다.
- 제안 명령: `$impeccable harden`, `$impeccable layout`

#### [P1] 학생 화면에 내부 observation/evidence key가 노출될 수 있음

- 위치: `src/features/air-lab/FeedbackPanel.tsx:40-48`, `src/features/air-lab/SyringeWorkbench.tsx:68-71`, `src/content/missions.ts:210-224`
- 범주: Content / Recognition
- 근거: `evidence.from.sealed-60`, `evidence.to.sealed-40`, `evidence.compressed.markers-conserved-in-smaller-space`, `obs.not-enough-information`에 대응하는 표시 라벨이 없어서 fallback raw key가 렌더링됩니다.
- 영향: 아동에게 시스템 내부 식별자가 보이고, 누출 미션의 정보 부족 근거도 읽을 수 있는 문장으로 전달되지 않습니다.
- 권고: 화면용 `FeedbackEvidence` 표시 모델 또는 모든 evidence key의 명시적 문구 매핑을 둡니다. raw key를 UI fallback으로 사용하지 말고 개발 검증에서 누락을 실패시킵니다.
- 제안 명령: `$impeccable clarify`, `$impeccable harden`

#### [P1] 입구의 첫 행동이 긴 설명 아래에 묻힘

- 위치: `src/features/air-lab/EntranceScreen.tsx:19-72`, `src/styles/app.css:142-177`
- 범주: Responsive / Cognitive load
- 근거: 시작 CTA가 목표·4개 사실·6개 미션·4개 판단 목록 뒤에 있습니다.
- 영향: 320/375px에서 학생이 해야 할 첫 행동을 찾기 위해 긴 내용을 스크롤해야 합니다.
- 권고: 첫 viewport를 목표 + 가상 모형 + 시작 CTA + 짧은 무저장 안내로 구성하고, 미션 목록/판단 용어는 접히는 개요나 아래 섹션으로 이동합니다. 정보 자체는 삭제하지 않습니다.
- 제안 명령: `$impeccable onboard`, `$impeccable distill`, `$impeccable adapt`

#### [P1] 승인된 표식이 좁은 barrel 밖으로 배치될 수 있음

- 위치: `src/features/air-lab/SyringeFigure.tsx:3-29`
- 범주: Implementation Integrity / Visual accuracy
- 근거: `spacingLevel`을 row 간격으로 직접 사용하고, 20·40 모형의 높이(80px) 안에 12개 marker를 fit하는 계산이 없습니다. 12개·low(2열 6행)에서는 y가 barrel 하단을 넘어갑니다.
- 영향: 도식이 모형 상태와 다르게 보이고 학생이 표식 수·간격 개념을 잘못 읽을 수 있습니다.
- 권고: SVG 내부 safe area와 row/column을 별도로 계산하고 모든 승인 fixture를 geometry 테스트로 고정합니다. 표식 수를 줄이거나 도식 밖으로 빼서 해결하지 않습니다.
- 제안 명령: `$impeccable audit`, `$impeccable polish`

#### [P1] 누출과 열린 상태가 도식에서 같은 출구 분기로 처리됨

- 위치: `src/features/air-lab/SyringeFigure.tsx:93-115`
- 범주: Content / Implementation Integrity
- 근거: `sealed`만 cap을 그리고 나머지는 모두 opening을 그립니다. `leaking`은 figcaption에서만 “마개가 느슨함”으로 구분됩니다.
- 영향: air-open-03과 air-leak-05의 핵심 개념 차이가 시각적으로 약해집니다.
- 권고: `sealed`, `open`, `leaking`을 각각 cap/open/loose-cap 같은 검수 가능한 SVG 상태로 분리하고 캡션·aria-label을 같은 용어로 맞춥니다.
- 제안 명령: `$impeccable clarify`, `$impeccable polish`

### P2 — 다음 개선에서 수정할 문제

#### [P2] `BACK` 상태는 존재하지만 화면에 없음

- 위치: `src/app/sessionReducer.ts:176-180`, `SyringeWorkbench.tsx` 전체
- 범주: User control / Navigation
- 영향: 이전 근거·예측을 확인하려면 새로고침하거나 처음부터 다시 해야 하는 것처럼 느껴집니다.
- 권고: INTRO를 제외한 화면에 작고 일관된 뒤로 가기를 제공하고, 기록·완료 이후에는 계약에 맞게 잠급니다. 뒤로 가도 응답을 보존하는 테스트를 확장합니다.

#### [P2] 좁은 화면 표가 내부 가로 스크롤에 의존

- 위치: `src/styles/app.css:480-485`
- 범주: Responsive / Accessibility
- 영향: 320px·200% 확대에서 핵심 비교 항목을 좌우로 찾아야 합니다.
- 권고: 조건표·전후표는 모바일에서 label/value stack 또는 `data-label` 기반 읽기 순서로 바꾸고, 인쇄용 table은 별도로 유지합니다. global `scrollWidth` 0뿐 아니라 내부 overflow도 검사합니다.

#### [P2] reduced-motion이 유용한 모든 transition을 전역으로 제거

- 위치: `src/styles/motion.css:20-34`
- 범주: Motion / Accessibility
- 영향: 필수 CTA 강조뿐 아니라 선택·상태 피드백의 transition도 0.01ms가 됩니다.
- 권고: `gi-pulse`와 장식 이동만 제거하고, 상태 변화는 정적 outline·배지·텍스트로 유지합니다. 모션 축소에서 정보 계층이 사라지지 않는지 확인합니다.

#### [P2] 토큰과 스타일 규칙이 분산됨

- 위치: `src/styles/tokens.css:1-35`, `src/styles/app.css:72-496`
- 범주: Theming / Consistency
- 영향: primary, warning, border, radius와 상태 배경이 하드코딩되어 새 화면이 기존 규칙에서 쉽게 벗어납니다.
- 권고: `$ui-ux-pro-max` 활성화 뒤 `design-system/MASTER.md`와 토큰을 함께 확정하고, 임의 색을 상태 의미 토큰으로 치환합니다. 라이트 모드 고정 계약은 유지합니다.

#### [P2] feedback의 핵심 변화와 한계 안내가 같은 무게로 섞임

- 위치: `src/features/air-lab/FeedbackPanel.tsx:25-52`
- 범주: Hierarchy / Learning UX
- 영향: 학생이 “그래서 무엇을 관찰했나?”보다 내부 근거 목록과 모형 한계 문장을 먼저 읽을 수 있습니다.
- 권고: 결과 요약(한 문장) → 근거 2~4개 → 다음 행동 → 모형 한계 순서로 시각적 계층을 나눕니다.

## 6. 자산 감사

| 자산 | 역할 | 판정 | 근거 | 상태 |
|---|---|---|---|---|
| `src/assets/generated/safe-virtual-air-lab.webp` | 입구의 일반 분위기 장식 | 유지 우선; 생성 후보는 사람 검토 | 과학 도식·정답·수치를 전달하지 않는 로컬 일반 일러스트. 현재 표시 폭 대비 원본 960×420은 1x 기준 충분하나 retina/분위기는 브라우저 확인 필요 | 원본 유지, 새 버전 생성 안 함 |
| `SyringeFigure.tsx` inline SVG | 부피·표식·밀폐 상태를 전달하는 과학 도식 | 자동 교체 금지 | 승인된 상태 fixture와 직접 연결된 정보성 도식 | 코드 geometry 수정 후보, 이미지 생성 금지 |
| `public/favicon.svg` | 브랜드/식별 마크 | 자동 생성·교체 금지 | 로고·마크는 출처/정체성이 중요 | 유지, Pages base-aware 참조만 구현 단계 점검 |
| `docs/hvc-registration/hvc-thumbnail-1280x800.png` | 등록 증거 캡처 | 자동 교체 금지 | 배포 화면의 증거 캡처 | 리디자인 이후 별도 승인 없이는 갱신하지 않음 |

`$imagegen`은 읽었지만 이번 게이트에서 생성 호출하지 않았습니다. 생성·교체가 필요해지는 경우 `references/asset-safety.md`의 분류와 버전 파일·권리 기록을 먼저 적용합니다.

## 7. 사람 검토 대기

- 교과 검수자가 밀폐·열림·누출·판단 보류 문구를 승인했는지 `docs/content-review.md`의 빈 검수란을 확인해야 합니다.
- 새 색상·서체·시각적 분위기는 `$ui-ux-pro-max`가 활성화된 뒤 교사/학생 읽기 난이도와 함께 확인해야 합니다.
- 실제 태블릿 가독성, 320/375/768/1280px의 물리 화면, 브라우저 확대는 자동 통과와 분리해 사람이 확인해야 합니다.
- VoiceOver 수동 검증은 프로젝트 계약상 수행·보고하지 않습니다.

## 8. 구현 후 해소 기록

| 초기 발견 | 처리 결과 | 근거 |
|---|---|---|
| 단계 heading focus 부재 | 해결 | `StepHeader`, `headingRef`, 단계 전환 focus/scroll 테스트·Chromium 확인 |
| 내부 observation/evidence key 노출 | 해결 | `src/content/labels.ts`와 한국어 관찰·근거 매핑, 52 tests |
| 입구 CTA가 긴 설명 뒤에 위치 | 해결 | 첫 hero 묶음에 목표·모형·CTA·무저장 안내 배치, 1280/375 확인 |
| SVG 표식 safe area 부재 | 해결 | `calculateMarkerPositions()`와 모든 승인 상태 geometry 테스트 |
| 열림·누출 도식 분기 부재 | 해결 | cap/open/loose-cap 분기와 aria/caption 테스트 |
| BACK UI 부재 | 해결 | 공통 `이전 단계` 버튼과 응답 보존 테스트 |
| 모바일 표 읽기 불편 | 해결 | 고정 테이블 폭·wrap·responsive stack, 320px overflow E2E 통과 |
| reduced-motion 전역 transition 제거 | 해결 | `gi-pulse`와 piston transition만 reduce 대상, 375px E2E 통과 |
| 토큰·스타일 분산 | 해결 | `tokens/layout/components/responsive/motion` 분리 및 500줄 검사 통과 |
| feedback hierarchy 약함 | 부분 해결 | 상태 요약 → 관찰 결과 → 함께 볼 근거 → 모형 한계 순서로 재구성 |

최종 detector는 parser 모듈 부재로 `DEGRADED` regex fallback을 보고했습니다. 이 결과는 undercount이며 clean bill로 해석하지 않았습니다. 출력된 side-tab/layout-transition 경고는 상단 강조선과 transform 기반 progress bar로 조정한 뒤, 최종 UI의 자동 검증·브라우저 검증을 별도로 완료했습니다. 배경 notebook grid는 학습용 관찰 표면이라는 제품 맥락상 유지했습니다.

최종 자동·브라우저 결과와 공개 범위는 `work/education-webapp-redesign-report.md`에 기록했습니다.

## 9. 커밋·푸시·배포 후 상태

- 리디자인 구현 커밋: `0e36427`.
- CI Playwright 설치 보완 커밋: `e56b998`.
- 최종 [GitHub Actions CI](https://github.com/WBmaker2/air-compression-rescue-lab/actions/runs/33294613035)와 [GitHub Pages 배포](https://github.com/WBmaker2/air-compression-rescue-lab/actions/runs/33294613032)가 성공했습니다.
- [공개 Pages 주소](https://wbmaker2.github.io/air-compression-rescue-lab/)에서 HTTP 200, 앱 제목, 해시 자산을 확인했습니다.
- HVC 등록 데이터는 수정하지 않았습니다.

## 10. 다음 실행 순서

1. 교과 검수자에게 `docs/content-review.md`의 밀폐·열림·누출·판단 보류 문구를 확인받습니다.
2. 실제 태블릿·물리 화면과 브라우저 200% 확대에서 읽기 순서를 확인합니다.
3. 공개 Pages 경로는 확인 완료했으므로, 다음은 교과 검수와 실제 태블릿·물리 화면·200% 확대 검토입니다.
