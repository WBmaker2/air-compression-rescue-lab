# 콘텐츠 검수 기록

## 검수 대상

6개 고정 미션(`air-sealed-01`, `air-sealed-02`, `air-open-03`, `air-pull-04`, `air-leak-05`, `air-diagnose-06`)과
각 미션의 선택지, 판정 피드백, 오개념 방지 문구.

## 승인된 유한 상태표 (모형 값)

| 상태 | sealState | modelVolume | airMarkerCount | spacing | pressure | resistance |
|---|---|---|---|---|---|---|
| sealed-60 | sealed | 60 | 12 | high | low | low |
| sealed-40 | sealed | 40 | 12 | medium | medium | medium |
| sealed-20 | sealed | 20 | 12 | low | high | high |
| open-60 | open | 60 | 12 | high | low | low |
| open-20 | open | 20 | 4 | high | low | low |
| leaking-60 | leaking | 60 | 12 | high | low | low |

| 전이 | action | to | 관찰 |
|---|---|---|---|
| sealed-60 | push | sealed-40 | 표식 12 보존, 간격·압축·저항 증가 |
| sealed-40 | push | sealed-20 | 표식 12 보존, 간격 감소·저항 high |
| open-60 | push | open-20 | 표식 12→4 (8개 출구로 이동), 저항 변화 없음 |
| sealed-20 | pull | sealed-40 | 표식 12 보존, 공간·간격 증가 |
| leaking-60 | push | 없음 | 누출률 정보 부족 → 판단 보류 |
| air-diagnose-06 관찰 | 60→40→20 | — | marker 12→10→8, resistance low→low→medium → 누출 signature |

비교용 승인 signature: sealed=`12→12→12, low→medium→high`, open=`12→8→4, low→low→low`,
leaking=`12→10→8, low→low→medium`.

## 모형 한계 명시

- 표식 수와 단계 라벨(low·medium·high)은 개념 모형이며 실제 분자 수·압력 수치·힘의 크기가 아니다.
- 화면에는 `모형 공기 표식`, `모형 부피`로 일관 표기한다.
- 이 교육 모형은 실제 세계 전체를 보장하지 않는다. 실제 기기 실험 지시는 포함하지 않는다.

## 검수 절차

1. 구현 전: 교사 또는 교과 검수자가 위 표와 문구를 승인한다.
2. 자동 검사: `src/content/validateContent.ts`가 미션 수, ID 유일성, 참조 무결성,
   검수 메타데이터(`sourceNote`, `reviewStatus`, `misconceptionGuard`)를 빌드 시 검사한다.
3. 검수 상태가 `approved`가 아닌 미션은 빌드를 실패시킨다.

## 검수 결과

- [ ] 교과 정확성 승인 (검수자: ______, 일자: ______)
- [ ] 어린이용 문구 난이도 승인 (검수자: ______, 일자: ______)
- [ ] 모형 한계 표기 승인 (검수자: ______, 일자: ______)
