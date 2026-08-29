# HVC(vibehong.shop) 등록 준비물

> 2026-08-29 작성. 공개 앱 확인(https://wbmaker2.github.io/air-compression-rescue-lab/)은 완료.
> HVC 관리자 등록은 관리자 인증이 필요해 이 문서의 값으로 관리자 페이지에서 등록하면 바로 완료된다.

## 관리자 등록 절차 (vibecoding-lab README 기준)

1. https://www.vibehong.shop/admin/login 에서 관리자 로그인
2. 앱 등록 → 아래 "등록 필드" 값을 입력, 썸네일로 `docs/hvc-registration/hvc-thumbnail-1280x800.png` 업로드
3. 관리자 페이지의 **수정 사항 동기화** 버튼 실행
   - `sync-static-gallery.yml` GitHub Actions가 `src/data/public-apps.json`과 `public/app-thumbnails/`을 재생성·커밋
   - Vercel 배포 완료 후 공개 갤러리에 반영
4. https://www.vibehong.shop/ 에서 등록 확인 (`npm run apps:verify-production-gallery`로 검증 가능)

## 등록 필드 (최신 등록 스키마 기준)

| 필드 | 값 |
|---|---|
| title | 공기 부피 압축 연구소 |
| summary | 초등 5~6학년 학생이 밀폐·열림·누출 조건의 가상 주사기 모형에서 공기가 차지하는 공간과 모형 공기 표식의 변화를 예측하고, 유한 상태표의 관찰 결과로 판단을 근거 있게 수정하는 과학 활동 앱입니다. |
| url | https://wbmaker2.github.io/air-compression-rescue-lab/ |
| githubUrl | https://github.com/WBmaker2/air-compression-rescue-lab |
| tags | 과학, 시뮬레이션, 수업 |
| thumbnailMode | upload |
| subject | 과학 |
| grade | 초등 5~6학년 |
| memo | 여섯 개의 검수된 고정 미션으로 밀폐 압축·개방 배출·당김 팽창·누출 판단 보류를 다룹니다. 점수 없이 최초 판단→근거→수정 기록을 남기고, 서버·저장 없이 동작해 오프라인 교실에서도 사용할 수 있습니다. 학생 응답은 새로고침하면 사라집니다. |
| subjects | 과학 |
| gradeBands | 5-6 |
| audience | student |
| interactionType | simulation |
| learningProcess | 예측, 관찰, 비교, 설명 |

## 자동화 경계

- 이 머신에는 vibehong.shop 관리자 비밀번호와 Turso DB 토큰이 없어(Vercel 환경변수로만 존재) 자동 등록이 불가능하다.
- 임의로 `src/data/public-apps.json`만 직접 수정하는 방식은 DB와 정적 스냅샷의 불일치를 만들고 다음 관리자 동기화 때 사라지므로 사용하지 않는다.
- 관리자 로그인 세션을 제공받으면 computer-use 브라우저로 위 절차를 대신 수행할 수 있다.
