---
description:
globs:
alwaysApply: false
---

# API 코드 생성 규칙

## 🔥 중요 원칙

### **API 스펙 우선 원칙**

- **명시적 변환 처리**: 각 API 파일에서 서버 타입과 클라이언트 타입 간 명시적 변환 구현
- **중앙집중식 에러 처리**: 서버 에러 메시지 대신 커스텀 메시지 사용, `getApiErrorMessage()` 함수 활용

## 파일명 규칙

별도 문서로 분리됨

## 명시적 타입 변환 시스템

각 API 파일은 **서버 타입 + 변환 함수**를 내장하여 자체 완결성을 가진다:

```typescript
// 서버 타입 (snake_case)
interface AdminServerResponse {
	id: number;
	role_id: number;
	created_at: string;
}

// 변환 함수
function serverToClient(server: AdminServerResponse): Admin {
	return {
		id: server.id,
		roleId: server.role_id, // camelCase 변환
		createdAt: server.created_at,
	};
}
```

## 코드 템플릿

### 완전한 API 서비스 파일 구조

```typescript
'use client';
import { fetchDefault } from '@/services/fetchClient';
import { CreateAdminRequest, Admin } from '@/types/admin';
import { getApiErrorMessage, getNetworkErrorMessage } from '@/utils/apiErrorMessages';

// #region 서버 타입 정의 (내부 사용)
interface AdminServerResponse {
	id: number;
	account: string;
	role_id: number;
	created_at: string;
}

interface CreateAdminServerRequest {
	account: string;
	role_id: number;
}
// #endregion

// #region 변환 함수 (내부 사용)
function serverToClient(server: AdminServerResponse): Admin {
	return {
		id: server.id,
		account: server.account,
		roleId: server.role_id,
		createdAt: server.created_at,
	};
}

function clientToServer(client: CreateAdminRequest): CreateAdminServerRequest {
	return {
		account: client.account,
		role_id: client.roleId,
	};
}
// #endregion

export async function createAdmin(data: CreateAdminRequest) {
	try {
		const serverRequest = clientToServer(data);
		const response = await fetchDefault('/admin', {
			method: 'POST',
			body: JSON.stringify(serverRequest),
		});

		const result = await response.json();

		if (!response.ok) {
			return { 
				success: false, 
				errorMsg: getApiErrorMessage('admin_create', result, response.status),
			};
		}

		// DELETE 요청의 경우 204 처리
		if (response.status === 204) {
			return { success: true, data: { message: '삭제 완료' } };
		}

		const serverResponse = result as AdminServerResponse;
		return {
			success: true,
			data: serverToClient(serverResponse),
		};
	} catch {
		return {
			success: false,
			errorMsg: getNetworkErrorMessage(),
		};
	}
}
```

### GET 요청 (쿼리 파라미터)

```typescript
// 쿼리 파라미터는 snake_case로 전송
if (params?.roleId) searchParams.append('role_id', params.roleId.toString());
```

## 에러 처리 시스템

### 중앙집중식 에러 메시지 관리

모든 API는 **커스텀 에러 메시지**를 사용하여 일관된 사용자 경험을 제공한다:

```typescript
// src/constants/apiErrors.ts에서 중앙 관리
export const API_ERRORS = {
  'admin_create': '관리자 계정 생성 실패',
  'admin_detail': '관리자 상세 조회 실패',
  'network_error': '네트워크 오류',
  // ...
} as const;
```

### 에러 처리 패턴

**1. HTTP 에러 (4xx, 5xx)**
```typescript
if (!response.ok) {
  return { 
    success: false, 
    errorMsg: getApiErrorMessage('admin_create', result, response.status),
  };
}
```

**2. 네트워크 에러 (연결 실패)**
```typescript
} catch {
  return {
    success: false,
    errorMsg: getNetworkErrorMessage(),
  };
}
```

### API 키 명명 규칙

에러 메시지 키는 `{service}_{action}` 패턴을 따른다:

```
admin_create     → 관리자 계정 생성 실패
admin_detail     → 관리자 상세 조회 실패  
cars_search      → 차량 목록 조회 실패
violations_update → 위반 기록 수정 실패
```

### 에러 메시지 형식

최종 사용자에게 표시되는 에러 메시지 형식:

```
기본 메시지: 상태코드
예시: "관리자 상세 조회 실패: 404"
```

**전역 에러 처리**
- `fetchClient.ts`에서 자동으로 URL을 분석하여 API 키를 추론
- 서버 에러코드는 유지하되, 메시지는 커스텀 메시지로 대체
- 모든 에러 토스트에 줄바꿈 방지 스타일 적용

## 타입 시스템

### 타입 배치 원칙

- **클라이언트 타입**: `src/types/{domain}.ts` (재사용)
- **서버 타입**: API 파일 내부 (1회성)
- **변환 함수**: API 파일 내부 (필수)

### 명명 규칙

```
클라이언트: Admin, CreateAdminRequest (camelCase)
서버: AdminServerResponse, CreateAdminServerRequest (snake_case)
변환 함수: serverToClient(), clientToServer()
```

## 필수 체크리스트

각 API 서비스 파일 작성 시 반드시 포함:

- [ ] **서버 타입 정의**: `{Entity}ServerResponse`, `{Operation}{Entity}ServerRequest`
- [ ] **변환 함수**: `serverToClient()`, `clientToServer()`
- [ ] **클라이언트 타입 import**: `@/types/{domain}`에서 가져오기
- [ ] **에러 유틸리티 import**: `getApiErrorMessage`, `getNetworkErrorMessage` 
- [ ] **명시적 변환**: 요청/응답 데이터 변환 처리
- [ ] **HTTP 에러 처리**: `getApiErrorMessage('{service}_{action}', result, response.status)`
- [ ] **네트워크 에러 처리**: try-catch 구문으로 `getNetworkErrorMessage()` 사용
- [ ] **쿼리 파라미터**: snake_case 필드명으로 전송
- [ ] **204 응답**: DELETE 요청 별도 처리
- [ ] **API 에러 키 등록**: `src/constants/apiErrors.ts`에 해당 키 추가

## 핵심 원칙

- **명시적 변환**: 자동 변환 대신 명시적 타입 변환
- **자체 완결성**: 각 API 파일이 독립적으로 동작
- **타입 안전성**: 컴파일 타임 오류 감지
- **중앙집중식 에러**: 서버 메시지 대신 커스텀 메시지 사용
- **일관된 에러 형식**: `${메시지}: ${상태코드}` 형태로 표시
