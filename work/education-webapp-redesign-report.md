# 공기 부피 압축 연구소 리디자인 실행 보고

> 보고일: 2026-08-30 (Asia/Seoul)
>
> 상태: **implementation complete — 자동·브라우저 검증 완료, 사람 검토 대기**

## 사전 작업과 디자인 게이트

- 프로젝트 규칙 문서 검색: 저장소·상위 작업 디렉터리에 `AGENTS.md`, `EDUCATION_DESIGN.md`, `design-system/MASTER.md` 없음 확인
- 기존 구현 계획·README·콘텐츠 검수·자산 장부·QA 문서 읽기
- 시작 Git 상태 확인: clean, `main`, `eed1f1a`
- 프레임워크·패키지·스크립트·라우트·정적 자산·6개 미션·학생 흐름 조사
- `work/education-webapp-redesign-plan.md` 작성
- `work/education-webapp-redesign-audit.md` 작성
- `work/education-webapp-redesign-assets.md` 작성
- 기존 코드 변경 없음, 이미지 생성 없음, 의존성 설치 없음, 커밋/푸시/배포/HVC 작업 없음
- 초기 중단 뒤 사용자가 `$ui-ux-pro-max`를 명시적으로 활성화하고 전문을 제공함
- `design-system/air-compression-rescue-lab/MASTER.md` 생성·검토 완료; 어두운 HUD 기본값은 라이트 교육용 프로젝트 오버라이드로 조정함

기준선 표의 47개 테스트와 4173 포트 브라우저 실패는 구현 전 상태의 기록입니다. 초기 실행에서 `$ui-ux-pro-max`가 런타임에 등록되지 않았던 사실도 보존하며, 이후 사용자 활성화와 전문 검토 후 디자인 시스템을 `design-system/air-compression-rescue-lab/MASTER.md`에 저장했습니다.

## 기준선 증거

| 증거 영역 | 결과 |
|---|---|
| lint | PASS — `npm run lint`, exit 0 |
| typecheck | PASS — `npm run typecheck`, exit 0 |
| 단위·컴포넌트·프라이버시 | PASS — `npm run test:run`, 47 tests |
| 자동 axe | PASS — `npm run test:a11y`, 3 tests; jsdom canvas 경고 기록 |
| 줄 수 | PASS — `npm run check:lines` |
| build | PASS — `npm run build`, production base와 해시 자산 생성 |
| browser E2E | NOT VALID — `npm run test:e2e`의 7개 중 6개가 4173에서 다른 앱 `소수 자리 교환소`를 받아 실패; 1개만 통과 |
| impeccable detector | DEGRADED — parser 모듈 부재로 regex fallback, `[]`는 clean 증거가 아님 |
| Visual browser capture | NOT RUN — 유효한 프로젝트 전용 브라우저 서버 확인 전 게이트 중단 |
| VoiceOver | NOT RUN — 프로젝트 계약상 제외 |

## 하위 스킬 상태

| Skill | 상태 | 비고 |
|---|---|---|
| `$impeccable` | available/read | context loader 실행; detector는 degraded |
| `$redesign-existing-projects` | available/read | 구현 호출하지 않음 |
| `$imagegen` | available/read | 생성 호출하지 않음 |
| `$ui-ux-pro-max` | user-activated/read | 전문 읽기, `--design-system`·React·UX 보조 검색, 프로젝트 디자인 시스템 저장 완료 |

## 초기 중단 이유

상위 `education-webapp-redesign` 안전 계약은 필수 구현·디자인·자산 역할 중 하나라도 없으면 코드 수정과 이미지 생성을 금지합니다. 초기 실행에서는 `$ui-ux-pro-max`가 런타임에 등록되지 않은 상태였으므로 디자인 토큰이나 화면 방향을 대신 확정하지 않고 구현을 중단했습니다.

## 재개 확인

사용자가 `$ui-ux-pro-max`를 명시적으로 호출하고 스킬 전문을 제공했으며, 해당 지침을 읽고 디자인 시스템을 저장했습니다. 계획·감사 문서를 입력으로 하여 디자인 시스템 → 기존 코드 구현 → 필요한 일반 자산 판정 → 최종 검수 → 자동·브라우저 검증까지 완료했습니다.

## 구현 결과

- 입구는 학습 목표·관찰 도구·시작 CTA를 첫 행동 묶음으로 보여 주고, 6개 미션과 네 가지 판단 어휘는 아래 개요로 분리했습니다.
- 모든 학습 단계에 실제 제목을 두고 단계 전환 시 제목으로 focus/scroll을 이동했습니다. `본문으로 건너뛰기`, `이전 단계`, 업데이트 내역 대화상자 focus 복원을 유지했습니다.
- 내부 `obs.*`, `evidence.*`, `compare.*` 키는 학생용 관찰·근거 문장으로 변환했습니다. 정답을 맞힌 검토 화면에서는 실제로 수정하지 않았다는 사실을 그대로 보여 줍니다.
- 주사기 도식은 승인된 상태 전이와 같은 수치를 사용하며, 표식 safe area 계산·열림/누출 상태 분기·한국어 aria/caption을 추가했습니다.
- 색·타이포그래피·spacing·반응형·motion 토큰을 `src/styles/tokens.css`, `src/styles/layout.css`, `src/styles/components.css`, `src/styles/responsive.css`, `src/styles/motion.css`로 분리했습니다.
- 새 이미지·폰트·외부 의존성은 추가하지 않았습니다. 기존 생성 장식 이미지는 정보성 도식을 대신하지 않는 역할로 유지했습니다.
- `src/update/updateHistory.ts`에 2026-08-30 변경 내역을 추가했습니다.

## 최종 검증 증거

| 검사 | 결과 |
|---|---|
| `npm run lint` | PASS |
| `npm run typecheck` | PASS |
| `npm run build` | PASS — production base `/air-compression-rescue-lab/`, 해시 자산 생성 |
| `npm run test:run` | PASS — 7 files, 52 tests |
| `npm run test:a11y` | PASS — 3 tests, serious/critical 0건; jsdom canvas 경고 기록 |
| `npm run check:lines` | PASS — TS/TSX/CSS 500줄 이상 없음 |
| `npm run test:e2e` | PASS — Chromium 7 tests; 4217 전용 preview |
| `npm run verify` | PARTIAL — lint/typecheck/build/test/a11y/check-lines 통과 후 Chromium headless child launch가 macOS `MachPortRendezvous` 권한 오류로 종료; 개별 `npm run test:e2e` 7/7 통과 증거는 별도 확보 |
| 브라우저 확인 | PASS — 1280×800 입구, 375×812 모바일 입구/단계 흐름, 업데이트 내역 열기·Escape·focus 복원, console error 0건, 동적 network request 0건 |
| `$impeccable` detector | DEGRADED — parser 모듈 부재로 regex fallback; 최종 출력은 의도적인 notebook grid advisory 1건이며 clean bill로 표현하지 않음 |
| VoiceOver | 수행·보고하지 않음 — 프로젝트 계약상 제외 |

`npm run test:a11y`의 `HTMLCanvasElement.prototype.getContext` stderr는 jsdom에서 axe 색상 대비 계산 시 발생한 환경 경고이며 테스트 자체는 통과했습니다. 실제 교과 검수, 태블릿/물리 화면, 브라우저 200% 확대의 사람 확인은 아직 별도 대기 상태입니다.

## 확인 링크와 공개 범위

- 로컬 검토 주소: `http://127.0.0.1:4217/air-compression-rescue-lab/` (검증용 preview)
- 기존 GitHub Pages 경로: [air-compression-rescue-lab](https://wbmaker2.github.io/air-compression-rescue-lab/) — 이번 요청에서는 배포하지 않았으므로 공개 화면의 리디자인 반영 여부는 별도 배포 후 확인해야 합니다.
- HVC 확인 경로: [HVC 앱 등록](https://www.vibehong.shop/apps/air-compression-rescue-lab-7cdc3225-e941-4b39-bb38-29e828ed77f0) — 기존 등록 경로이며 이번 요청에서 HVC 데이터는 수정하지 않았습니다.

커밋·푸시·Pages 재배포·HVC 등록/수정은 사용자 요청 범위가 아니어서 실행하지 않았습니다.
