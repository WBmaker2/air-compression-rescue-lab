# HVC(vibehong.shop) 등록 기록

> 2026-08-29 완료. 사용자가 관리자 비밀번호를 제공해 자동화로 등록·동기화를 수행했다.
> 비밀번호와 세션 쿠키는 작업 직후 삭제했으며 이 문서나 저장소에 남기지 않는다.

## 등록 내용

| 필드 | 값 |
|---|---|
| title | 공기 부피 압축 연구소 |
| summary | 초등 5~6학년 학생이 밀폐·열림·누출 조건의 가상 주사기 모형에서 공기가 차지하는 공간과 모형 공기 표식의 변화를 예측하고, 유한 상태표의 관찰 결과로 판단을 근거 있게 수정하는 과학 활동 앱입니다. |
| url | https://wbmaker2.github.io/air-compression-rescue-lab/ |
| githubUrl | https://github.com/WBmaker2/air-compression-rescue-lab |
| tags | 과학, 시뮬레이션, 수업 |
| thumbnailMode | auto (링크에서 자동 수집) |
| subject | 과학 |
| grade | 초등 5~6학년 |
| memo | 여섯 개의 검수된 고정 미션으로 밀폐 압축·개방 배출·당김 팽창·누출 판단 보류를 다룹니다. 점수 없이 최초 판단→근거→수정 기록을 남기고, 서버·저장 없이 동작해 오프라인 교실에서도 사용할 수 있습니다. 학생 응답은 새로고침하면 사라집니다. |
| audience | 학생 |
| interactionType | 시뮬레이션 |
| learningProcess | 예측, 관찰, 비교, 설명 |

## 수행 절차와 결과

1. 관리자 로그인 → 등록/수정 워크벤치에서 위 값으로 등록 (DB 앱 108 → 109)
2. **수정 사항 동기화** 실행 → `sync-static-gallery.yml` 성공, DB 109 = 정적 스냅샷 109 일치
3. 공개 확인:
   - 랜딩 https://www.vibehong.shop/ 에 앱 카드 노출
   - 앱 상세 https://www.vibehong.shop/apps/air-compression-rescue-lab-7cdc3225-e941-4b39-bb38-29e828ed77f0 (HTTP 200, 앱 링크 포함)

## 비고

- 임베디드 브라우저(IAB)에서는 이 사이트의 React 이벤트가 붙지 않아(서버 HTML만 렌더) 로컬 Chromium + Playwright로 수행했다.
- `vibecoding-lab`의 `apps:verify-production-gallery`는 기준 84개로 노후되어 현재 109개와 어긋난다(등록 전 108개). 필요하면 별도 작업으로 기준값을 최신화한다.
