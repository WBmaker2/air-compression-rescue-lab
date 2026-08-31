# 교육용 웹앱 학습자 UX 감사

- 대상: `air-compression-rescue-lab`
- 감사일: 2026-08-31
- 범위: elementary-webapp-ux-orchestrator 후속 점검 및 보수적 개선
- 학습자 가정: 초등 5–6학년, 개인 기기에서 교사 설명과 함께 활동하는 10–12세 학습자
- 사실성 경계: 고정된 가상 모형 값과 관찰 근거만 다루며, 실제 주사기 조작 안내·실험 결과·점수로 확장하지 않음
- 제외: VoiceOver 구현 및 검증, 학생 개인정보 수집, TTS/녹음/재생 기능 추가

## 사용한 절차와 런타임 상태

Stage 0 preflight는 `ready`였습니다. elementary-webapp-ux-orchestrator, playwright, impeccable, design-system, redesign-existing-projects, imagegen, education-webapp-redesign의 로컬 지침과 프로젝트의 기존 디자인 시스템을 확인했습니다. `ui-ux-pro-max`는 디스크에 있는 파일은 확인했지만 현재 런타임 호출 가능한 전문 스킬로 로드되지 않아 사용했다고 주장하지 않습니다. 별도 simulation specialist도 없어, 현재 DOM/SVG 기반 유한 상태 모형을 유지하는 방향으로 판단했습니다.

기존 디자인 시스템의 프로젝트 적용 규칙을 우선했습니다. 밝은 관찰 노트/가상 실험대, 주사기와 근거의 중심 배치, 한 번에 한 행동, 현재 단계 포커스, 모바일 읽기 순서, light-only, 기존 인라인 SVG를 유지했습니다. 새 이미지나 외부 리소스는 필요하지 않았고 기존 장식용 `safe-virtual-air-lab.webp`를 유지했습니다.

## 기준선 증거

### 실제 학습자 패널 관찰

- 1280px에서 입구 화면의 목표, 전체 폭 시작 CTA, 가상 모형 이미지, 6개 미션 안내가 한 흐름으로 보였습니다.
- 375px와 320px에서 실제 가로 스크롤은 없었고, 시작 CTA는 첫 화면 안에 보였습니다.
- 미션 1에서 `팽창` 오답을 선택해 실행·비교·진단까지 진행한 뒤, 정답을 자동 공개하지 않고 `다시 보기`와 한 번의 판단 수정으로 `압축`을 선택할 수 있었습니다. 기록에는 최초 판단과 최종 판단이 모두 남았습니다.
- 미션 3에서 `열림` 상태와 실행 후 표식 12→4, 출구로 나간 표식 8개가 보였습니다.
- 미션 5에서 `판단 보류`를 선택하면 결과를 꾸며 내지 않고 비교 단계에서 실행 결과 없음으로 남았습니다.
- 미션 6에서 12→10→8 관찰 표와 3개의 상태 선택지를 확인했으나, 최종 피드백의 `관찰 결과`가 `정보 부족`으로 표시되는 내용 불일치가 발견되었습니다. 실제 진단 근거인 누출 관찰 무늬는 별도 근거 목록에만 표시됩니다.
- 업데이트 내역 대화상자는 Escape로 닫을 때 호출 버튼으로 포커스가 돌아왔고, 단계 이동 시 실제 단계 제목으로 포커스가 이동했습니다.

### 자동·정적 기준선

| 항목 | 결과 | 해석 |
| --- | --- | --- |
| lint | 통과 | 정적 규칙 위반 없음 |
| typecheck | 통과 | TypeScript 계약 유지 |
| unit/component | 7개 파일, 52개 통과 | 기존 학습 흐름·모형·콘텐츠 계약 통과 |
| a11y | 3개 통과 | 심각/치명 위반 없음. jsdom canvas 경고는 axe 색상 대비 경로의 비차단 경고 |
| 500줄 검사 | 통과 | TS/TSX/CSS 파일 분리 기준 준수 |
| console | 오류 0건 | 직접 브라우저 관찰 기준 |
| 네트워크 | 정적 리소스만 | 동적 요청 없음 |
| 모바일 overflow | 375/320에서 없음 | 실제 document scrollWidth가 viewport를 넘지 않음 |
| Playwright CLI e2e | 로컬 브라우저 시작 단계 차단 | macOS Chromium `MachPortRendezvous... Permission denied (1100)` 환경 오류. 앱 assertion이 실행되기 전 종료됨 |

Playwright CLI의 브라우저 시작 오류 때문에 이를 제품 기능 실패로 해석하지 않았습니다. 대신 앱 내 브라우저에서 동일 learner path를 직접 관찰했으며, 최종 수용 기준에서는 CI 브라우저 실행 결과를 별도 게이트로 남깁니다.

## 차원별 감사

| 차원 | 점수 | 근거 |
| --- | ---: | --- |
| 접근성 | 3/4 | 의미 있는 heading/fieldset/table, skip link, 단계 포커스, modal focus 복귀, 44px급 터치 영역이 있음. 다만 일부 학생용 문구가 기술 용어에 기대고 최종 피드백이 혼동을 일으킴 |
| 성능 | 3/4 | 정적 번들·장식 이미지·동적 요청 없음. 단일 입구 이미지와 작은 SVG라 현재 범위의 성능 위험은 낮음 |
| 테마 | 3/4 | 기존 토큰과 밝은 종이/잉크/파랑 계층이 일관됨. 이번 개선은 색상 재설계가 아니라 문구·상태 표현의 정합성에 집중 |
| 반응형 | 3/4 | 375/320 overflow 없음, CTA와 표가 축소됨. 긴 예측 선택지에서는 CTA가 첫 812px viewport 아래로 내려갈 수 있어 보조 개선 후보로 남김 |
| 구현 정합성 | 2/4 | 미션 6 `no-run` 분기 때문에 실제 관찰 시그니처와 피드백의 관찰 목록이 어긋남. 미션 5의 알려진 누출 조건과 알려지지 않은 누출량 표현도 분리 필요 |

종합 판단은 `개선 후 수용 가능`입니다. 시각 구조를 다시 흔들기보다 학습 정확성·학생 언어·상태 분기를 먼저 고치는 것이 위험 대비 효과가 큽니다.

## 우선순위 findings

### P1 — 미션 6 최종 피드백의 관찰 결과 불일치

`src/features/air-lab/SyringeWorkbench.tsx:59-64`에서 `runResult === "no-run"`을 진단 미션의 고정 관찰 시그니처보다 먼저 처리합니다. 그 결과 12→10→8 표를 보고 `누출`을 고른 뒤에도 `관찰 결과`에는 정보 부족 문구가 들어옵니다. 학습자가 무엇을 근거로 맞혔는지 잘못 이해할 수 있습니다.

개선: 진단 미션의 `observationSignatures`를 먼저 사용하고, 판단 보류 미션에서만 `obs.not-enough-information`을 사용합니다. 이 분기에 회귀 테스트를 추가합니다.

### P1 — 미션 5의 알려진 조건과 알려지지 않은 결과가 섞임

`src/content/missions.ts:170-181`은 화면 표와 도식에서 `누출 — 조금씩 새어 나간다`는 조건을 보여 주면서, 장면·guard·비교 화면은 누출 여부 자체를 모른다고 읽힐 수 있습니다. 이는 판단 보류를 가르치려는 의도와 충돌합니다.

개선: 마개가 느슨하고 공기가 샐 수 있다는 사실은 알려 주되, `얼마나 새는지`와 `누른 뒤 어떤 변화가 생기는지`가 제공되지 않았다고 구분합니다.

### P1 — 미션 6에 raw English와 전문 용어가 노출됨

`src/content/missions.ts:187,202,223`의 `low`, `medium`, `signature`는 초등 학습자가 관찰 근거로 쓰기 어렵습니다. 표식 수 변화와 누출 관계는 보존하면서 `저항 낮음/중간`, `누출 무늬`로 바꿉니다.

### P2 — `저항 느낌`의 학생용 의미가 불분명함

`src/content/missions.ts:98,113,219-222`, `src/features/air-lab/SyringeWorkbench.tsx:243,265`, `src/features/air-lab/SyringeFigure.tsx:63,139`의 `저항 느낌`과 `저항 느낌 라벨`은 내부 질적 모형 값의 이름처럼 들립니다. 화면에서는 `누르기 어려운 정도`로 번역하고 내부 `resistanceFeel` 키와 low/medium/high 계약은 유지합니다.

### P2 — 진단 미션의 예측 질문이 일반 실행 질문과 같음

`src/features/air-lab/SyringeWorkbench.tsx:128`은 미션 6에서도 `피스톤을 움직인 뒤`를 묻습니다. 미션 6은 실행 전환 없이 관찰 기록을 읽는 진단이므로, `관찰 기록을 보기 전, 어떤 결과를 먼저 예상하나요?`로 문맥을 맞춥니다.

### P2 — 학생 화면에서 검수/승인처럼 읽힐 수 있는 표현

`EntranceScreen.tsx:68`, `FeedbackPanel.tsx:60`, `LearningReport.tsx:82`, `SyringeWorkbench.tsx:176`의 `검수된`은 학생에게 승인 권위를 과하게 암시할 수 있습니다. 화면에서는 `6개 미션`, `이 활동의 가상 모형`으로 바꾸고, 내부 source note/review 계약은 보존합니다.

### P2 — 모바일 예측 단계의 세로 길이

375px에서 4개의 긴 선택지를 모두 읽으면 CTA가 첫 812px viewport 아래로 내려갑니다. 현재 선택 후 브라우저의 자연 스크롤과 100% 폭 CTA로 조작은 가능하므로 P2로 남기며, 이번 범위에서는 선택지 문구를 불필요하게 늘리지 않습니다.

## 유지할 강점

- 첫 화면에서 목표와 시작 행동이 명확하고 중요한 CTA에 pulse와 reduced-motion 대체 상태가 있음
- 주사기 SVG가 장식이 아니라 부피·표식·간격·끝 상태를 함께 보여 주는 학습 도구임
- 전후 비교 표와 근거 선택이 있어 답만 맞히는 흐름을 피함
- 오답을 비난하거나 정답을 즉시 공개하지 않고 한 번의 수정 기회를 제공함
- `열림`과 `누출`을 도식과 문구로 구분함
- 저장·로그인·외부 AI·분석·쿠키 없이 개인정보 경계가 분명함

## 수용 기준

1. 미션 5·6의 학생용 문구가 알려진 조건과 모르는 결과를 구분하고 raw English/`signature`가 보이지 않는다.
2. 미션 6에서 `누출` 진단 후 피드백의 관찰 결과가 12→10→8 누출 무늬를 가리키며, 정보 부족 문구를 잘못 관찰 결과로 표시하지 않는다.
3. 미션 1 오답→수정, 미션 3 열림, 미션 5 판단 보류, 미션 6 진단의 learner path가 유지된다.
4. lint, typecheck, unit/component, a11y, build, 500줄 검사를 통과한다.
5. 375/320에서 overflow가 없고, 단계 제목 포커스·Escape focus 복귀·reduced-motion 규칙이 유지된다.
6. 이 로컬 후속 개선에서는 commit/push/deploy를 수행하지 않는다. 공개 URL/HVC는 이전 배포 참고 주소로만 보고하고, 새 변경을 배포된 것으로 표현하지 않는다.

## 구현 후 검증 결과

- 변경 범위: 미션 5·6 문구, 학생용 저항 표현, 진단 미션 legend, `observationKeys` 분기, 업데이트 내역, App 회귀 테스트
- 정적 게이트: `lint` 통과, `typecheck` 통과, unit/component 7개 파일·53개 통과, a11y 3개 통과, `build` 통과, `check:lines` 통과
- impeccable detector: 변경한 TSX 4개 파일에서 `[]` 반환
- 모바일 learner path: 375px에서 오답→수정, 열림, 판단 보류, 미션 6 누출 진단 통과
- 미션 6 최종 피드백: `feedbackHasSignature=true`, `feedbackHasInsufficientInfo=false`
- 375px: `scrollWidth=360`, `innerWidth=375`, viewport 기준 가로 overflow 0
- 320px: `bodyScrollWidth=320`, `innerWidth=320`, viewport 기준 가로 overflow 0. `documentElement.clientWidth=305`인 것은 세로 스크롤바 폭이며 가로 콘텐츠 overflow가 아님
- 콘솔/동적 요청: 오류 0, 동적 네트워크 요청 0
- modal: 업데이트 내역을 Escape로 닫은 뒤 호출 버튼에 포커스 복귀
- reduced motion: 필수 CTA에 `gi-pulse` 클래스는 유지되고 computed animation은 `none`, focus outline은 `3px solid`
- 로컬 Playwright CLI e2e: Chromium 시작 시 macOS `MachPortRendezvous... Permission denied (1100)`로 assertion 실행 전 차단. CI 브라우저 게이트는 별도 확인 필요
