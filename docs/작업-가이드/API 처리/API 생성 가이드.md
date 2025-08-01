---
description: 
globs: 
alwaysApply: false
---
# API 코드 생성 규칙

## 🔥 중요 원칙

### **API 스펙 우선 원칙**
- **명시적 변환 처리**: 각 API 파일에서 서버 타입과 클라이언트 타입 간 명시적 변환 구현

## 디렉토리 구조 및 파일명 규칙

### 디렉토리 구조
```
src/services/
├── admin/           # 관리자 관리
├── auth/            # 인증
└── ...              # 기타...
└── fetchClient.ts   # HTTP 클라이언트
```

### 파일명 규칙
**패턴**: `{도메인}[@파라미터][_{서브리소스}[@파라미터]][_$]_{HTTP메소드}.ts`

**핵심 예시**:
- `admin_POST.ts` (생성)
- `admin$_GET.ts` (검색 - 쿼리 파라미터)
- `admin@id_GET.ts` (상세 조회)
- `admin@id_PUT.ts` (수정)
- `admin@id_DELETE.ts` (삭제)
- `household@id_instance_POST.ts` (중첩 리소스)

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
    roleId: server.role_id,      // camelCase 변환
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
  const serverRequest = clientToServer(data);
  const response = await fetchDefault('/admin', {
    method: 'POST',
    body: JSON.stringify(serverRequest),
  });

  const result = await response.json();
  
  if (!response.ok) {
    const errorMsg = result.message || `관리자 생성 실패(코드): ${response.status}`;
    console.log(errorMsg);
    return { success: false, errorMsg };
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
}
```

### GET 요청 (쿼리 파라미터)
```typescript
// 쿼리 파라미터는 snake_case로 전송
if (params?.roleId) searchParams.append('role_id', params.roleId.toString());
```

## 함수명 규칙

**HTTP 메소드별 패턴**:
- `search{Entity}()` - 검색/목록 (GET with $)
- `get{Entity}Detail()` - 상세 조회 (GET with @id)
- `create{Entity}()` - 생성 (POST)
- `update{Entity}()` - 수정 (PUT)
- `delete{Entity}()` - 삭제 (DELETE)

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
- [ ] **명시적 변환**: 요청/응답 데이터 변환 처리
- [ ] **쿼리 파라미터**: snake_case 필드명으로 전송
- [ ] **에러 처리**: console.log + errorMsg 반환
- [ ] **204 응답**: DELETE 요청 별도 처리

## 핵심 원칙

- **명시적 변환**: 자동 변환 대신 명시적 타입 변환
- **자체 완결성**: 각 API 파일이 독립적으로 동작
- **타입 안전성**: 컴파일 타임 오류 감지
