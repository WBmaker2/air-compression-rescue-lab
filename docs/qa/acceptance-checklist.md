# 수용 체크리스트 (QA)

## 자동 검증 (npm run verify)

- [ ] lint / typecheck 오류 0건
- [ ] 단위·컴포넌트 테스트 실패 0건 (6개 미션, 네트워크·저장소 경계 포함)
- [ ] 자동 axe serious/critical 위반 0건
- [ ] TS·TSX·CSS 500줄 이상 파일 0개
- [ ] 빌드 성공, base `/air-compression-rescue-lab/`
- [ ] E2E 시나리오 전부 통과

## 앱별 완료 기준

- [ ] simulateAirCase가 승인된 유한 상태 밖의 값을 계산하지 않는다
- [ ] 밀폐 상태에서 airMarkerCount가 모든 전환 전후에 보존된다
- [ ] unknown / 정보 부족을 확정적 압축 결과로 바꾸지 않는다
- [ ] 실제 압력 수치·폭발·신체 안전을 보장한다는 표현이 없다
- [ ] 과학 도식은 프로그램 SVG로 제공된다

## 사람 검수

- [ ] 교과 정확성 (docs/content-review.md)
- [ ] 어린이용 문구 난이도
- [ ] 생성 이미지의 맥락·편향·권리 (docs/image-rights-ledger.md)
- [ ] 실제 태블릿 가독성 (320×568, 375×812, 768×1024, 1280×800)

## 명시적 제외

- VoiceOver 수동 검증 (계획상 제외 — 실행하거나 완료로 보고하지 않는다)
- 다크 모드, 학생 저장, 점수·순위
