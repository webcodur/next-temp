---
description: 
globs: 
alwaysApply: false
---
# API 코드 생성 규칙

## 🔥 중요 원칙

### **API 스펙 우선 원칙**
- **_paths.txt가 절대 기준**: URL 경로, parameter 명명은 API 스펙과 정확히 일치
- **DTO 불일치 가능성**: DTO가 업데이트되지 않을 수 있으므로 path 기준으로 개발
- **snake_case 적용**: 모든 API는 snake_case 기준 (fetchClient.ts에서 자동 변환)

## 디렉토리 구조 및 파일명 규칙

### 1. 디렉토리 분류
- 기본 구조: `src/services/`
- 도메인/기능별로 서브 디렉토리 구성 (camelCase)
- 실제 예시:
  - `src/services/admin/` (관리자 관리)
  - `src/services/auth/` (인증)
  - `src/services/household/` (세대 관리)
  - `src/services/config/` (시스템 설정)
  - `src/services/ip/` (IP 차단 관리)
  - `src/services/cache/` (캐시 관리)
  - `src/services/menu/` (메뉴 관리)
- 공통 HTTP 클라이언트는 `src/services/` 레벨에 배치

### 2. 파일명 명명 규칙

#### 핵심 규칙
- **도메인**: 항상 단수형 (admin, household, config)
- **파라미터**: `@파라미터명` (snake_case 사용)
- **검색/쿼리**: `$` (쿼리 파라미터가 있는 GET 요청)
- **중첩 리소스**: 언더스코어(_)로 연결
- **구분자**: 언더스코어(_)만 사용

#### 패턴
```
{도메인}[@파라미터][_{서브리소스}[@파라미터]][_$]_{HTTP메소드}.ts
```

#### 기본 CRUD (실제 예시)
- `admin_POST.ts` (관리자 생성)
- `admin$_GET.ts` (관리자 검색)
- `admin@id_GET.ts` (관리자 상세)
- `admin@id_PUT.ts` (관리자 수정)
- `admin@id_DELETE.ts` (관리자 삭제)

#### 검색/필터
- `admin$_GET.ts` (관리자 검색 - 모든 쿼리 파라미터)
- `household$_GET.ts` (세대 검색/필터)
- `block_history$_GET.ts` (IP 차단 내역 검색)

#### 중첩 리소스 (실제 예시)
- `household@id_instance_POST.ts` (특정 세대의 인스턴스 생성)
- `household_instance@instance_id_GET.ts` (세대 인스턴스 상세)
- `household_instance@instance_id_config_service_PUT.ts` (세대 서비스 설정)
- `menu@menu_id_order_PUT.ts` (메뉴 순서 변경)

#### 특수 엔드포인트
- `auth_signin_POST.ts` (로그인)
- `auth_refresh_POST.ts` (토큰 갱신)
- `cache_stats_GET.ts` (캐시 통계)
- `cache_namespace@namespace_DELETE.ts` (네임스페이스 캐시 삭제)

## 🔄 fetchClient 자동 변환

### snake_case ↔ camelCase 자동 변환
```typescript
// 프론트엔드에서는 camelCase 사용
const data = { 
  householdType: 'GENERAL',
  address1Depth: '101동' 
};

// fetchClient.ts가 자동으로 snake_case로 변환하여 전송
// { household_type: 'GENERAL', address_1depth: '101동' }

// 서버 응답의 snake_case도 자동으로 camelCase로 변환
// created_at → createdAt, parkinglot_id → parkinglotId
```

### Path Parameter 규칙
```typescript
// ❌ camelCase (과거)
`/menus/${menuId}/order`

// ✅ snake_case (현재) - API 스펙 기준
`/menus/${menu_id}/order`
```

## 📝 코드 구조 템플릿

### 필수 구조
```typescript
'use client';
import { fetchDefault } from '@/services/fetchClient';
import { SomeRequestType, SomeResponseType } from '@/types/{domain}'; // 기존 타입 활용

/**
 * {기능 설명}
 * @param {파라미터명} {파라미터 설명}
 * @returns {반환값 설명} ({타입명})
 */
export async function {함수명}({파라미터들}) {
  // 쿼리 파라미터 처리 (GET 요청시)
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.append('page', params.page.toString());
  if (params?.limit) searchParams.append('limit', params.limit.toString());
  // 기타 파라미터들...

  const queryString = searchParams.toString();
  const url = queryString ? `{엔드포인트}?${queryString}` : '{엔드포인트}';
  
  const response = await fetchDefault(url, {
    method: '{HTTP메소드}',
    body: JSON.stringify({데이터}), // 🔥 자동 변환됨 (camelCase → snake_case)
  });

  const result = await response.json();
  
  if (!response.ok) {
    const errorMsg = result.message || `{작업명} 실패(코드): ${response.status}`;
    console.log(errorMsg); // 서버 출력 필수
    return {
      success: false,
      errorMsg: errorMsg,
    };
  }
  
  return {
    success: true,
    data: result, // 🔥 자동 변환됨 (snake_case → camelCase) - {타입명} 타입
  };
}
```

### 204 No Content 응답 처리
```typescript
// DELETE 요청의 경우
if (response.status === 204) {
  return {
    success: true,
    data: { message: '{작업}이 성공적으로 완료되었습니다.' },
  };
}
```

## 📋 함수명 명명 규칙

### HTTP 메소드별 패턴
- **GET (목록)**: `get{Entity}List`
- **GET (상세)**: `get{Entity}Detail`  
- **GET (검색)**: `search{Entity}`
- **POST**: `create{Entity}`
- **PUT**: `update{Entity}`
- **DELETE**: `delete{Entity}`

### 파일명과 함수명 매핑 (실제 예시)
| 파일명 | 함수명 | 설명 |
|---|---|---|
| `admin$_GET.ts` | `searchAdmin()` | 관리자 검색 |
| `admin@id_GET.ts` | `getAdminDetail()` | 관리자 상세 |
| `admin_POST.ts` | `createAdmin()` | 관리자 생성 |
| `admin@id_PUT.ts` | `updateAdmin()` | 관리자 수정 |
| `admin@id_DELETE.ts` | `deleteAdmin()` | 관리자 삭제 |
| `household_instance@instance_id_GET.ts` | `getHouseholdInstanceDetail()` | 세대 인스턴스 상세 |
| `config@key_GET.ts` | `getConfigByKey()` | 특정 설정값 조회 |
| `block_history$_GET.ts` | `searchBlockHistory()` | IP 차단 내역 검색 |

## 🔧 타입 활용 가이드

### 1. 기존 타입 우선 사용
```typescript
// ✅ 기존 정의된 타입 활용
import { SearchAdminRequest, AdminDto } from '@/types/admin';
import { UpdateSystemConfigRequest, SystemConfig } from '@/types/api';

// ❌ 중복 타입 생성 금지
interface UpdateConfigRequest { // 이미 UpdateSystemConfigRequest가 존재
  configValue: string;
}
```

### 2. 타입 위치별 역할
- `src/types/api.ts`: 공통 시스템 타입 (SystemConfig, IpBlock, CacheStats 등)
- `src/types/{domain}.ts`: 도메인별 타입 (admin.ts, household.ts 등)
- `src/types/facility/`: 시설 관련 특화 타입들

### 3. 반환 타입 명시
```typescript
/**
 * 특정 설정값을 조회한다
 * @param key 조회할 설정 키
 * @returns 설정값 정보 (SystemConfig)
 */
export async function getConfigByKey(key: string) {
  // ...
  return {
    success: true,
    data: result, // 🔥 자동 변환됨 (snake_case → camelCase) - SystemConfig 타입
  };
}
```

## 📊 반환값 표준화

### 일반 API
```typescript
// 성공 시
{
  success: true,
  data: result // 실제 데이터 (자동 변환됨)
}

// 실패 시  
{
  success: false,
  errorMsg: string
}
```

### 페이지네이션 API
```typescript
// 성공 시 (예: searchAdmin)
{
  success: true,
  data: {
    data: AdminDto[], // 실제 데이터 배열
    meta: PageMetaDto // 페이지 정보
  }
}
```

## ⚠️ 중요 참고 사항

### 1. **fetchClient 의존성**
- `fetchDefault`: 일반 JSON API 요청 (자동 변환 포함)
- `fetchForm`: FormData/파일 업로드 요청
- 'use client' 지시어 필수 (브라우저 API 사용)

### 2. **API 스펙 준수**
```typescript
// ✅ _paths.txt 기준으로 정확한 경로 사용
const response = await fetchDefault(`/admin/${id}`, { method: 'GET' });

// ❌ 추측으로 경로 작성
const response = await fetchDefault(`/admins/${id}`, { method: 'GET' });
```

### 3. **snake_case Parameter**
```typescript
// ✅ API 스펙에 맞는 snake_case parameter
export async function updateMenuOrder(menu_id: number, newOrder: number) {
  const response = await fetchDefault(`/menus/${menu_id}/order`, {
    method: 'PUT',
    body: JSON.stringify({ newOrder }), // newOrder → new_order로 자동 변환
  });
}
```

### 4. **쿼리 파라미터 자동 변환**
```typescript
// camelCase로 작성하면 fetchClient가 자동으로 snake_case로 변환
if (params?.householdType) searchParams.append('householdType', params.householdType);
// URL: ?household_type=GENERAL
```

### 5. **에러 처리 일관성**
- console.log로 서버 로그 출력 필수
- errorMsg 키 사용으로 일관성 유지
- 204 No Content 응답 별도 처리

### 6. **index.ts 파일 생성**
각 도메인별로 index.ts 파일을 생성하여 clean import 지원:
```typescript
// src/services/config/index.ts
export { getConfigByKey } from './config@key_GET';
export { updateConfig } from './config@key_PUT';
export { getAllConfigs } from './config$_GET';
```

## 🎯 적용 원칙

- **API 스펙 우선**: _paths.txt가 절대 기준, 추측 금지
- **타입 재사용**: 기존 정의된 타입 최대한 활용
- **자동 변환 활용**: fetchClient의 camelCase ↔ snake_case 자동 변환 신뢰
- **일관성**: 동일한 패턴으로 예측 가능한 구조
- **확장성**: 새로운 엔드포인트 추가가 용이한 구조

이 규칙을 따라 API 레이어를 구성하면 **maintainable하고 scalable하며 type-safe한** 코드베이스를 만들 수 있다.
