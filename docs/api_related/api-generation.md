---
description: 
globs: 
alwaysApply: false
---
# API 코드 생성 규칙

## 디렉토리 구조 및 파일명 규칙

### 1. 디렉토리 분류
- 기본 구조: `app/services/`
- 도메인/기능별로 서브 디렉토리 구성 (camelCase)
- 예시:
  - `app/services/auth/` (인증)
  - `app/services/user/` (사용자)
  - `app/services/product/` (상품)
  - `app/services/order/` (주문) 등
- 공통 HTTP 클라이언트는 `app/services/` 레벨에 배치

### 2. 파일명 명명 규칙

#### 핵심 규칙
- **도메인**: 항상 단수형 (user, product, order)
- **파라미터**: `@파라미터명` (해당 리소스에 바로 붙임)
- **검색/쿼리**: `$` (쿼리 파라미터가 있는 GET 요청)
- **중첩 리소스**: 언더스코어(_)로 연결
- **구분자**: 언더스코어(_)만 사용

#### 패턴
```
{도메인}[@파라미터][_{서브리소스}[@파라미터]][_$]_{HTTP메소드}.ts
```

#### 기본 CRUD
- `user_GET.ts` (사용자 목록)
- `user@id_GET.ts` (사용자 상세)
- `user_POST.ts` (사용자 생성)
- `user@id_PUT.ts` (사용자 수정)
- `user@id_DELETE.ts` (사용자 삭제)

#### 검색/필터
- `user$_GET.ts` (사용자 검색 - 모든 쿼리 파라미터)
- `product$_GET.ts` (상품 검색/필터)
- `user@id_order$_GET.ts` (특정 사용자의 주문 검색)

#### 중첩 리소스
- `user@id_order_GET.ts` (특정 사용자의 주문 목록)
- `user@id_order@orderId_GET.ts` (특정 사용자의 특정 주문)
- `user@id_profile_PUT.ts` (특정 사용자의 프로필 수정)

#### 특수 엔드포인트
- `auth_login_POST.ts` (로그인)
- `payment_history$_GET.ts` (결제 이력 검색)
- `admin_user_stats_GET.ts` (관리자 사용자 통계)

## 코드 구조 템플릿

### 필수 구조
```typescript
'use client';
import { fetchDefault } from '@/services/fetchClient';

/**
 * {기능 설명}
 * @param {파라미터명} {파라미터 설명}
 * @returns {반환값 설명}
 */
export async function {함수명}({파라미터들}) {
  // 쿼리 파라미터 처리 (GET 요청시)
  const params = new URLSearchParams();
  // 파라미터별 조건 추가
  
  const response = await fetchDefault(`{엔드포인트}`, {
    method: '{HTTP메소드}',
    body: JSON.stringify({데이터}), // POST/PUT/PATCH만
  });

  const result = await response.json();
  
  if (!response.ok) {
    const errorMsg = result.message || `{작업명} 실패(코드): ${response.status}`
    console.log(errorMsg) // 서버 출력 필수
    return {
      success: false,
      errorMsg: errorMsg,
    }
  }
  
  return {
    success: true,
    data: result,
  }
}
```

## 함수명 명명 규칙

### HTTP 메소드별 패턴
- **GET (목록)**: `get{Entity}List`
- **GET (상세)**: `get{Entity}Detail`  
- **GET (검색)**: `search{Entity}`
- **POST**: `create{Entity}`
- **PUT**: `update{Entity}`
- **DELETE**: `delete{Entity}`

### 파일명과 함수명 매핑
| 파일명 | 함수명 | 설명 |
|---|---|---|
| `user_GET.ts` | `getUserList()` | 사용자 목록 |
| `user@id_GET.ts` | `getUserDetail()` | 사용자 상세 |
| `user$_GET.ts` | `searchUser()` | 사용자 검색 |
| `user_POST.ts` | `createUser()` | 사용자 생성 |
| `user@id_PUT.ts` | `updateUser()` | 사용자 수정 |
| `user@id_DELETE.ts` | `deleteUser()` | 사용자 삭제 |
| `user@id_order_GET.ts` | `getUserOrderList()` | 특정 사용자 주문 목록 |
| `user@id_order@orderId_GET.ts` | `getUserOrderDetail()` | 특정 사용자 주문 상세 |

## 반환값 표준화

### 일반 API
```typescript
// 성공 시
{
  success: true,
  data: result
}

// 실패 시  
{
  success: false,
  errorMsg: string
}
```

### 인증 API (특수 케이스)
```typescript
// 성공 시
{
  success: true,
  code: response.status,
  message: string
}

// 실패 시
{
  success: false,
  code: response.status,
  error: string
}
```

**주의**: 기존 코드에서 `result` 키를 사용하는 경우가 있으나, 새로 작성시에는 `data` 키 사용 권장

## 중요 참고 사항

1. **공통 HTTP 클라이언트**: `app/services/fetchClient.ts` 모듈 임포트
   - `fetchDefault`: 일반 JSON API 요청
   - `fetchForm`: FormData/파일 업로드 요청

2. **클라이언트 사이드**: fetchClient가 브라우저 API(localStorage, cookie)를 사용하므로 'use client' 지시어 필수

3. **파일명 규칙 엄수**:
   - 도메인은 **반드시 단수형** (users ❌, user ✅)
   - 파라미터는 **@** 접두사로 구분 (`user@id`)
   - 쿼리 파라미터는 **$** 표기 (`user$_GET.ts`)
   - 중첩 리소스는 **언더스코어(_)** 연결

4. **에러 처리**: 일관된 에러 메시지 형식과 로깅

5. **타입 정의**: 주석으로 응답 타입 가이드 제공

6. **쿼리 파라미터**: URLSearchParams로 동적 URL 구성

7. **파일 분량**: 200줄 이하 권장, 단일 책임 원칙

8. **코드 스타일**: 
   - 스페이스 일관성 유지 (`success: true`, `errorMsg: string`)
   - 반환값 키 일관성 (`data` vs `result` 주의)

## 적용 원칙

- **일관성**: 동일한 패턴으로 예측 가능한 구조
- **분리**: 도메인별 명확한 책임 분리
- **확장성**: 새로운 엔드포인트 추가가 용이한 구조
- **재사용성**: 다른 프로젝트에도 적용 가능한 범용 패턴

이 규칙을 따라 API 레이어를 구성하면 maintainable하고 scalable한 코드베이스를 만들 수 있다.
