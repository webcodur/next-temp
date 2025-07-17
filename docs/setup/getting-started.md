# 🚀 API 클라이언트 설정 및 사용 가이드

프로젝트에 API 클라이언트가 완전히 설정되었습니다! 이 가이드를 따라 설정을 완료하고 사용해보세요.

## 📋 완료된 설정들

✅ **API 타입 정의** (`src/types/api.ts`)
✅ **공통 HTTP 클라이언트** (`src/services/fetchClient.ts`)  
✅ **React Query Provider** (`src/providers/QueryProvider.tsx`)
✅ **Next.js Middleware** (`src/middleware.ts`)
✅ **에러 바운더리** (`src/components/errors/ErrorBoundary.tsx`)
✅ **주요 API 함수들** (`src/services/*/`)

## 🔧 필수 설정

### 1. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일 생성:

```bash
# 프로젝트 루트에서 실행
touch .env.local
```

아래 내용 추가:

```env
# API 설정
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NEXT_PUBLIC_API_TIMEOUT=10000

# 개발 환경 설정
NODE_ENV=development
NEXT_PUBLIC_APP_NAME=주차관리시스템
NEXT_PUBLIC_APP_VERSION=1.0.0

# 인증 설정
NEXTAUTH_SECRET=your-secret-key-here-change-this-in-production
NEXTAUTH_URL=http://localhost:3000

# 로깅 설정
NEXT_PUBLIC_LOG_LEVEL=debug

# 캐시 설정
NEXT_PUBLIC_CACHE_TTL=300000
```

### 2. React Query Devtools 설치 (선택사항)

개발용 디버깅 도구를 원한다면:

```bash
npm install @tanstack/react-query-devtools
```

그리고 `src/providers/QueryProvider.tsx`에서 주석 해제:

```typescript
// 이 부분의 주석을 해제하세요
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// return 부분에 추가
{process.env.NODE_ENV === 'development' && (
  <ReactQueryDevtools
    initialIsOpen={false}
    position="bottom-right"
    buttonPosition="bottom-right"
  />
)}
```

## 🎯 사용법

### 기본 API 호출

```typescript
import { createAdmin } from '@/services/admin/admin_POST';
import { searchAdmin } from '@/services/admin/admin$_GET';

// 관리자 생성
const handleCreateAdmin = async () => {
  const result = await createAdmin({
    account: 'admin01',
    role_id: 1,
    password: 'password123',
    name: '홍길동'
  });

  if (result.success) {
    console.log('관리자 생성 성공:', result.data);
  } else {
    console.error('관리자 생성 실패:', result.errorMsg);
  }
};

// 관리자 검색
const handleSearchAdmin = async () => {
  const result = await searchAdmin({
    name: '홍길동',
    page: 1,
    limit: 10
  });

  if (result.success) {
    console.log('검색 결과:', result.data);
  }
};
```

### React Query와 함께 사용

```typescript
'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { searchAdmin, createAdmin } from '@/services/admin';

function AdminManagement() {
  const queryClient = useQueryClient();

  // 관리자 목록 조회
  const { 
    data: adminList, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['admins', { page: 1, limit: 10 }],
    queryFn: () => searchAdmin({ page: 1, limit: 10 })
  });

  // 관리자 생성
  const createAdminMutation = useMutation({
    mutationFn: createAdmin,
    onSuccess: () => {
      // 성공 시 목록 다시 불러오기
      queryClient.invalidateQueries({ queryKey: ['admins'] });
    }
  });

  const handleCreate = (formData) => {
    createAdminMutation.mutate(formData);
  };

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>에러 발생: {error.message}</div>;

  return (
    <div>
      {/* UI 구현 */}
    </div>
  );
}
```

### 에러 처리

```typescript
// 컴포넌트별 에러 바운더리
import { withErrorBoundary } from '@/components/errors/ErrorBoundary';

const MyComponent = () => {
  // 컴포넌트 구현
};

export default withErrorBoundary(MyComponent, {
  onError: (error, errorInfo) => {
    console.error('컴포넌트 에러:', error);
  }
});
```

## 🔍 디버깅

### API 요청 로깅

개발 환경에서 모든 API 요청이 콘솔에 로깅됩니다:

```
[API] POST http://localhost:3000/api/auth/signin
[API] GET http://localhost:3000/api/admins/search?page=1&limit=10
```

### React Query Devtools

React Query Devtools를 설치했다면 우하단에 버튼이 나타납니다. 클릭해서 쿼리 상태를 확인할 수 있습니다.

### 에러 추적

개발 환경에서는 에러 바운더리가 상세한 에러 정보를 표시합니다.

## 📝 새로운 API 추가하기

1. **API 타입 정의** (`src/types/api.ts`에 추가)

```typescript
export interface NewFeatureRequest {
  name: string;
  description: string;
}

export interface NewFeatureResponse {
  id: number;
  name: string;
  createdAt: string;
}
```

2. **API 함수 생성** (`src/services/newFeature/`)

```typescript
// src/services/newFeature/newFeature_POST.ts
import { fetchDefault } from '@/services/fetchClient';
import type { NewFeatureRequest, NewFeatureResponse } from '@/types/api';

export async function createNewFeature(data: NewFeatureRequest) {
  return await fetchDefault<NewFeatureResponse>('/new-feature', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
```

## 🔒 인증 관리

### 토큰 저장

현재는 localStorage를 사용하지만, 쿠키나 다른 저장소로 변경 가능:

```typescript
// src/services/fetchClient.ts의 getAuthHeaders 함수 수정
async function getAuthHeaders(): Promise<Record<string, string>> {
  if (typeof window !== 'undefined') {
    // localStorage 대신 쿠키 사용
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('accessToken='))
      ?.split('=')[1];
    
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
  return {};
}
```

### 인증 흐름

1. 로그인 → 토큰 저장
2. API 요청 시 자동으로 토큰 추가
3. 401 에러 시 middleware에서 로그인 페이지로 리다이렉트

## 🚀 실행 확인

```bash
# 개발 서버 실행
npm run dev

# 브라우저에서 확인
open http://localhost:3000
```

콘솔에서 API 로그와 에러 정보를 확인할 수 있습니다.

## 📚 추가 문서

- [환경 변수 설정](./environment.md)
- [API 매핑 테이블](../rules/api-mapping.md)
- [API 생성 규칙](../rules/api-generation.md)

## ❓ 문제 해결

### API 연결 안됨
- `.env.local` 파일 확인
- `NEXT_PUBLIC_API_URL` 설정 확인
- 백엔드 서버 실행 상태 확인

### 타입 에러
- `src/types/api.ts`에서 타입 정의 확인
- API 응답 구조와 타입 일치 여부 확인

### 인증 문제
- 토큰 저장 위치 확인 (localStorage/쿠키)
- middleware의 보호 경로 설정 확인

모든 설정이 완료되었습니다! 🎉 