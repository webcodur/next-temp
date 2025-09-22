---
alwaysApply: true
---

# 프로젝트 개발 가이드라인

## 원칙

- **KISS** - Keep It Simple Stupid!
- **YAGNI** - You Ain't Gonna Need It
- **DRY** - Do not Repeat Yourself

## 대화

- 한국어로 대화
- 사용자를 주니어 개발자로 가정하고 응답
- 간결하고 권위적인 말투 사용 (있다, 이다, 하다, 했다, 한다 등)
- 사용자를 주니어 개발자로 가정하고 응답

## 파일

- `index` 파일 생성 금지(개별 파일 import 처리)

## 코드

- 파일당 권장 코드 분량은 **200줄 이하**
- `if/else` 문보다 **삼항식** 권장 (컴포넌트는 삼항식보다 && 권장)
- `switch` 문보다 **객체 맵핑** 권장
- **early return** 적극 활용
- 스타일링: hover 시 스타일 변화는 즉각적이어야 한다
- 절대경로: 대규모 외부 컴포넌트 임포트 시 사용
- 상대경로: 소규모 내부 컴포넌트 임포트 시 사용
- hook: 훅스 생성 시 전역 hooks 디렉토리에 배치
- type: any, Record<string, unknown> 등 임시방편 방식의 타입 사용 금지
- 테이블 생성 시 ID값과 관련된 것은 무조건 보여지도록 한다 (ID 값 출력여부는 별도 로직이 처리함)
- ENUM 타입은 "ENUM" 접두사 + 언더바 형식으로 작성

## 주석

- **한국어** 사용
- **JS DOC 사용 금지**
- 코드가 길어질 경우 논리적 그룹별로 `region/endregion` 처리
- `region/endregion`은 접기 기능이 유용한 경우에만 적용 (덩어리당 수십줄)

## 컴포넌트

- left right 이 아닌 start end 처리
- 컴포넌트 랜더링에 삼항연산자 사용 금지, && 사용
- 이모지 사용 금지 => lucide icons
- transition 및 delay 처리 금지. UI 는 느리면 안된다.

## UI 모듈

- 폼: GridFormAuto + simple-input
- 검색대: AdvancedSearch + field

## 웹서버 실행

- 웹서버 실행 및 빌드는 **사용자만** 수행 가능
- AI는 코드 작성 및 수정만
