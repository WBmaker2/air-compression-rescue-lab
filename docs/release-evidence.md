# 출시 증거 (Release Evidence)

> 작성일: 2026-08-29. 사용자 출시 승인(2026-08-29 "승인")에 따라 배포를 수행했다.
> HVC 관리자 등록과 정적 갤러리 동기화는 아직 수행하지 않은 별도 단계다.

## 1. 배포 정보

| 항목 | 값 |
|---|---|
| 저장소 | https://github.com/WBmaker2/air-compression-rescue-lab |
| 브랜치 | main |
| Pages build_type | workflow (`.github/workflows/deploy-pages.yml`) |
| 배포 URL | https://wbmaker2.github.io/air-compression-rescue-lab/ |
| 확인 링크 | https://www.vibehong.shop/ (갤러리 동기화는 HVC 등록 후) |

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

## 4. 남은 단계

1. **교과 검수** — docs/content-review.md 서명 (구현 전 승인 값은 계획 문서 기준, 사람 검수는 별도)
2. **HVC 관리자 등록** — 공개 앱 확인 완료. 관리자 인증이 필요해 자동 등록 불가 → 등록 필드·절차·썸네일을 docs/hvc-registration.md로 준비 완료 (2026-08-29 사용자 승인 확인). 관리자 로그인 세션 제공 시 대신 수행 가능
3. **정적 갤러리 동기화** — HVC 등록 + 수정 사항 동기화 버튼 실행 후 https://www.vibehong.shop/ 확인

## 5. 명시적 제외

- VoiceOver 수동 검증 (계획상 제외 — 실행·완료 보고하지 않음)
- 학생 응답 저장·점수·순위·다크 모드 (계획상 제외)
