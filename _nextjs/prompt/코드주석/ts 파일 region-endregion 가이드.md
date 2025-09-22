# Region/EndRegion 코드 구조화 가이드

## 목적
긴 파일을 논리적 그룹으로 나누어 가독성을 향상시킨다.

## 적용 기준
- **100줄 이상** 파일에 적용
- **비슷한 역할**끼리 그룹화
- **한국어**로 명명

## 헤더 주석 구조
```typescript
/* 
  파일명: /utils/dataProcessor.ts
  기능: 데이터 가공 유틸리티
  책임: API 응답을 UI 형태로 변환
  
  주요 기능:
  - 데이터 정규화 및 검증
  - 타입 변환 및 필터링
  - 에러 처리 및 로깅
*/ // ------------------------------
```

## 주석 작성 규칙
- **JSDoc 사용 금지** (@param, @returns 등)
- 기능/기술 명세는 **파일 최상단** 헤더에 작성
- 함수 주석은 **간결한 한 줄**로 작성
- 복잡한 로직만 **인라인 주석** 추가

## 구조 순서
타입 → 상수 → 유틸리티 → 메인 로직

## 예시
```typescript
/* 
  파일명: /services/userService.ts
  기능: 사용자 관리 서비스
  책임: 사용자 CRUD 및 인증
  
  주요 기능:
  - 로그인/로그아웃 처리
  - 사용자 정보 조회/수정
  - 권한 검증
*/ // ------------------------------

// #region 타입 정의
interface User { id: string; name: string; }
// #endregion

// #region 상수
const API_URL = '/api/users';
// #endregion

// #region API 통신
// 사용자 로그인
async function login(credentials: LoginData) { ... }

// 사용자 정보 조회  
async function getUser(id: string) { ... }
// #endregion
``` 