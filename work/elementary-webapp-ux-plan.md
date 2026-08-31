# 교육용 UX 후속 개선 계획

- 작성일: 2026-08-31
- 상태: 구현 완료·로컬 검증 완료
- 근거 문서: `elementary-webapp-ux-audit.md`, `elementary-webapp-ux-language-audit.md`, `elementary-webapp-ux-simulation-decision.md`

## 목표

학습자가 미션 5의 판단 보류와 미션 6의 누출 진단을 서로 헷갈리지 않게 하고, 모형 값에서 실제로 읽은 근거가 최종 피드백에 정확히 이어지도록 합니다. 기존 화면 구조·학습 순서·평가 계약·개인정보 경계·밝은 디자인 시스템은 보존합니다.

## 구현 범위

1. `SyringeWorkbench`에서 진단 미션의 observation signature를 `no-run` 정보 부족 분기보다 먼저 선택합니다.
2. 미션 5의 scene/guard/비교 빈 상태를 `누출 가능 조건은 알려졌지만 누출량과 누른 뒤 변화는 모름`으로 정리합니다.
3. 미션 6의 `low`/`medium`과 `signature`를 `저항 낮음`/`저항 중간`/`누출 무늬`로 바꿉니다.
4. 학생 화면의 `저항 느낌`을 `누르기 어려운 정도`로 바꿉니다. 내부 도메인 키와 질적 level 값은 바꾸지 않습니다.
5. 미션 6 예측 legend를 실행 전 일반 질문과 분리합니다.
6. 학생 화면의 `검수된` 표현을 `6개 미션` 또는 `이 활동의 가상 모형`으로 바꿉니다. 내부 review metadata는 보존합니다.
7. 업데이트 내역에 2026-08-31 개선 내용을 추가합니다.
8. 미션 6의 최종 feedback 회귀 테스트와 문구 계약 테스트를 추가합니다.

## 구현하지 않는 범위

- 새 물리 시뮬레이터, 랜덤화, 슬라이더, Canvas/WebGL
- 새 이미지 또는 외부 네트워크 리소스
- 로그인·저장·분석·쿠키·실제 장비 조작 안내
- VoiceOver, TTS, 녹음/재생
- 대규모 레이아웃/색상 재설계
- 이번 후속 작업의 commit/push/deploy

## 검증 순서

1. 변경 파일의 줄 수가 500줄 미만인지 확인합니다.
2. `npm run lint`, `npm run typecheck`, `npm run test:run`, `npm run test:a11y`, `npm run build`, `npm run check:lines`를 실행합니다.
3. 변경된 TSX 마크업에 impeccable detector를 실행하고, 실제 위반과 false positive를 분리합니다.
4. 로컬 Playwright CLI를 한 번 시도하고, macOS Chromium 시작 권한 오류가 재현되면 반복하지 않습니다. 앱 내 브라우저 fallback으로 375px/320px learner path를 확인합니다.
5. 미션 1 오답→수정, 미션 3 열림, 미션 5 판단 보류, 미션 6 누출 진단, 업데이트 내역 Escape 복귀를 재확인합니다.
6. 콘솔 오류 0, 동적 네트워크 요청 없음, 가로 overflow 없음, reduced-motion 대체 상태를 확인합니다.

## 롤백 기준

새 테스트가 기존 reducer/evaluator 계약을 깨거나 미션 5의 판단 보류가 실제로 결과를 만들어 내면 해당 변경만 되돌립니다. 기존 사용자 변경을 지우는 reset/checkout은 사용하지 않습니다.

## 완료 조건

계획 범위의 소스·테스트·업데이트 내역이 반영되고 정적 검증이 통과했습니다. 로컬 Chromium 환경 오류는 제품 실패로 합산하지 않되, CI e2e 게이트와 현재 공개 배포/HVC 주소가 이번 로컬 변경과 별개임을 최종 보고서에 명시합니다.
