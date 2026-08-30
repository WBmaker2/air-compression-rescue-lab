# 출시 증거 (Release Evidence)

> 작성일: 2026-08-29. 사용자 출시 승인(2026-08-29 "승인")에 따라 배포와 HVC 등록을 수행했다.

## 1. 배포 정보

| 항목 | 값 |
|---|---|
| 저장소 | https://github.com/WBmaker2/air-compression-rescue-lab |
| 브랜치 | main |
| Pages build_type | workflow (`.github/workflows/deploy-pages.yml`) |
| 배포 URL | https://wbmaker2.github.io/air-compression-rescue-lab/ |
| HVC 갤러리 등록 | 완료 (2026-08-29) — https://www.vibehong.shop/apps/air-compression-rescue-lab-7cdc3225-e941-4b39-bb38-29e828ed77f0 |
| 확인 링크 | https://www.vibehong.shop/ |

## 2. 배포 전 로컬 검증 (`npm run verify` exit 0, 2026-08-29)

| 단계 | 결과 |
|---|---|
| lint / typecheck | 0 오류 |
| 단위·컴포넌트·프라이버시 테스트 | 47개 통과 (6개 미션, 네트워크·저장소 경계 포함) |
| 자동 접근성 (axe serious/critical) | 0건 (입구·비교판·대화상자) |
| 파일 줄 수 검사 | 전 TS·TSX·CSS 500줄 미만 |
| 정적 빌드 | `dist/` + 해시 자산, base `/air-compression-rescue-lab/` |
| 배포 자산 검사 | 3개 통과 (base 경로·동일 출처 자산·권리 장부 1:1) |
| Playwright E2E | 7개 통과 (밀폐·열림·당기기·누출·키보드·320px·축소 모션) |

## 3. 배포 후 공개 확인 (scripts/verify-production.mjs, 2026-08-29)

| 항목 | 결과 |
|---|---|
| 제목 | PASS — "공기 부피 압축 연구소" |
| favicon | PASS — HTTP 200 |
| 실제 학습 흐름 (밀폐 60→40 전후 비교표) | PASS |
| 공기 표식 보존 (12개) | PASS |
| 375px 가로 넘침 | PASS — 0px |
| 콘솔 오류 | PASS — 0건 (SVG height="auto" 오류는 배포 1차 확인에서 발견 → 수정 후 재배포 d036480에서 0건) |
| HTTP 4xx/5xx | PASS — 0건 |

## 4. HVC 등록 기록 (2026-08-29, 사용자 승인·비밀번호 제공)

| 단계 | 결과 |
|---|---|
| 관리자 로그인 (vibehong.shop/admin) | 완료 |
| 앱 등록 (제목·설명·링크·GitHub·태그 3개·과학·초등 5~6학년·학생·시뮬레이션·학습 과정·메이커 노트, 썸네일 자동 수집) | 완료 — DB 앱 108 → 109 |
| 수정 사항 동기화 (sync-static-gallery.yml) | 완료 — 상태 완료·결과 성공, DB 109 = 정적 스냅샷 109 |
| 공개 갤러리 확인 | 완료 — 랜딩 카드 노출, 앱 상세 페이지 HTTP 200 + 앱 링크 확인 |

- 등록에 사용한 임시 자동화 스크립트(비밀번호 포함)와 세션 쿠키는 사용 직후 삭제했다. 저장소에 남기지 않았다.
- `vibecoding-lab`의 `apps:verify-production-gallery`는 기준값 84개(오래된 로컬 기준)라 현재 109개와 어긋난다. 등록 전에도 108개였으므로 본 등록과 무관한 스크립트 노후화다.

## 5. 남은 단계

1. **교과 검수** — docs/content-review.md 서명 (구현 전 승인 값은 계획 문서 기준, 사람 검수는 별도)

## 6. 명시적 제외

- VoiceOver 수동 검증 (계획상 제외 — 실행·완료 보고하지 않음)
- 학생 응답 저장·점수·순위·다크 모드 (계획상 제외)

## 7. 리디자인 릴리스 (2026-08-30)

| 항목 | 결과 |
|---|---|
| 리디자인 커밋 | `0e36427` — `feat: redesign air compression rescue lab` |
| CI 보완 커밋 | `e56b998` — Playwright Chromium 설치 단계 추가 |
| 최종 CI | [33294613035](https://github.com/WBmaker2/air-compression-rescue-lab/actions/runs/33294613035) — 성공, `npm run verify` 전체 통과 |
| 최종 Pages 배포 | [33294613032](https://github.com/WBmaker2/air-compression-rescue-lab/actions/runs/33294613032) — build·deploy 성공 |
| 공개 주소 | [https://wbmaker2.github.io/air-compression-rescue-lab/](https://wbmaker2.github.io/air-compression-rescue-lab/) |
| 공개 확인 | HTTP 200, `공기 부피 압축 연구소` 제목, 리디자인 해시 JS/CSS 자산 응답 확인 |
| HVC | 기존 등록 유지, 이번 리디자인 릴리스에서 등록 데이터 수정 없음 |

첫 리디자인 커밋의 CI는 Playwright 브라우저 미설치로 실패했으며, `e56b998`에서 워크플로를 보완한 뒤 최종 CI가 성공했습니다. Pages 배포는 최종 커밋 기준 성공했습니다.
