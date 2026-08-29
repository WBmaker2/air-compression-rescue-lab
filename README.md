# 공기 부피 압축 연구소 (Air Compression Rescue Lab)

초등 5~6학년 과학 활동용 정적 웹 앱. 밀폐·열림·누출 조건이 고정된 가상 주사기 모형에서
공기가 차지하는 공간과 모형 공기 표식의 간격 변화를 예측하고, 유한 상태표의 관찰 결과로
설명하는 활동을 제공합니다.

- 대상: 초등 5~6학년 / 과학 / 20~30분
- 6개의 검수된 고정 미션 (런타임 무작위 생성 없음)
- 서버·로그인·외부 AI·분석·쿠키·localStorage 사용 없음 (응답은 탭 메모리에만 존재)
- 새로고침하면 응답이 사라집니다 (입구와 결과 화면에 안내 표시)

## 개발

```bash
npm install
npm run dev
```

## 검증

```bash
npm run lint
npm run typecheck
npm run test:run      # 단위·컴포넌트 테스트
npm run test:a11y     # 자동 axe 접근성 검사
npm run check:lines   # 파일 500줄 미만 검사
npm run build         # base /air-compression-rescue-lab/ 로 빌드
npm run test:e2e      # Playwright (빌드 + preview 필요)
npm run verify        # 위 전부
```

## 문서

- [docs/content-review.md](docs/content-review.md) — 교과 검수 기록
- [docs/image-rights-ledger.md](docs/image-rights-ledger.md) — 생성 이미지 권리 장부
- [docs/qa/acceptance-checklist.md](docs/qa/acceptance-checklist.md) — 완료 기준 체크리스트

## 배포

**라이브: https://wbmaker2.github.io/air-compression-rescue-lab/**

GitHub Pages: WBmaker2 저장소, main 브랜치, Pages build_type=workflow.
출시 증거는 [docs/release-evidence.md](docs/release-evidence.md)에 기록되어 있다.
