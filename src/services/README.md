# API Services

api-generation.md 룰북에 따라 생성된 API 클라이언트 함수들입니다.

## 디렉토리 구조

```
src/services/
├── fetchClient.ts              # 공통 HTTP 클라이언트
├── auth/                       # 인증 관련 API
├── admin/                      # 관리자 관리 API
├── systemConfig/               # 시스템 설정 API
├── ipBlock/                    # IP 차단 관리 API
├── cache/                      # 캐시 관리 API
├── menu/                       # 메뉴 관리 API
├── resident/                   # 거주자 관리 API
└── household/                  # 세대 관리 API
```

## 사용법

### 기본 패턴

```typescript
import { createAdmin } from '@/services/admin/admin_POST';
import { searchAdmin } from '@/services/admin/admin$_GET';
import { getAdminDetail } from '@/services/admin/admin@id_GET';
import { updateAdmin } from '@/services/admin/admin@id_PUT';
import { deleteAdmin } from '@/services/admin/admin@id_DELETE';

// 관리자 생성
const createResult = await createAdmin({
  account: 'admin01',
  role_id: 1,
  password: 'password123'
});

// 관리자 검색
const searchResult = await searchAdmin({
  name: '김철수',
  page: 1,
  limit: 10
});

// 관리자 상세 조회
const detailResult = await getAdminDetail({ id: 1 });

// 관리자 수정
const updateResult = await updateAdmin({
  id: 1,
  name: '김철수',
  email: 'kim@example.com'
});

// 관리자 삭제
const deleteResult = await deleteAdmin({ id: 1 });
```

### 응답 처리

모든 API 함수는 일관된 응답 형식을 반환합니다:

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

// 인증 API (특수 케이스)
{
  success: true,
  code: number,
  message: string
}
```

### 사용 예시

```typescript
const handleAdminCreate = async (formData) => {
  const result = await createAdmin(formData);
  
  if (result.success) {
    console.log('관리자 생성 성공:', result.data);
    // 성공 처리
  } else {
    console.error('관리자 생성 실패:', result.errorMsg);
    // 에러 처리
  }
};
```

## API 패턴별 예시

### 1. GET (목록) - 쿼리 파라미터

```typescript
import { searchAdmin } from '@/services/admin/admin$_GET';

const result = await searchAdmin({
  account: 'admin',
  name: '홍길동',
  page: 1,
  limit: 20
});
```

### 2. GET (상세) - 경로 파라미터

```typescript
import { getAdminDetail } from '@/services/admin/admin@id_GET';

const result = await getAdminDetail({ id: 123 });
```

### 3. POST (생성) - 요청 본문

```typescript
import { createAdmin } from '@/services/admin/admin_POST';

const result = await createAdmin({
  account: 'newadmin',
  role_id: 2,
  password: 'securepass123',
  name: '신규관리자'
});
```

### 4. PUT (수정) - 경로 파라미터 + 요청 본문

```typescript
import { updateAdmin } from '@/services/admin/admin@id_PUT';

const result = await updateAdmin({
  id: 123,
  name: '수정된이름',
  email: 'new@email.com'
});
```

### 5. DELETE (삭제) - 경로 파라미터

```typescript
import { deleteAdmin } from '@/services/admin/admin@id_DELETE';

const result = await deleteAdmin({ id: 123 });
```

### 6. 복잡한 검색 - 다중 쿼리 파라미터

```typescript
import { searchIpBlockHistory } from '@/services/ipBlock/ipBlock_history$_GET';

const result = await searchIpBlockHistory({
  ip: '192.168.1.100',
  startDate: '2024-01-01',
  endDate: '2024-12-31',
  blockType: 'AUTO',
  page: 1,
  limit: 50
});
```

### 7. 중첩 리소스 - 복잡한 경로

```typescript
import { updateMenuParkingLotAssign } from '@/services/menu/menu_parkingLot@parkingLotId_assign_PUT';

const result = await updateMenuParkingLotAssign({
  parkingLotId: 'lot123',
  menuIds: ['menu1', 'menu2', 'menu3']
});
```

## 에러 처리

모든 API 함수는 네트워크 에러와 HTTP 에러를 처리합니다:

```typescript
try {
  const result = await createAdmin(data);
  
  if (result.success) {
    // 성공 처리
  } else {
    // 서버 에러 처리
    alert(result.errorMsg);
  }
} catch (error) {
  // 네트워크 에러 등 예외 처리
  console.error('API 호출 실패:', error);
}
```

## 인증

fetchClient는 자동으로 localStorage에서 액세스 토큰을 읽어 Authorization 헤더에 추가합니다.

```typescript
// localStorage의 'accessToken' 키에서 토큰을 자동으로 읽음
// Authorization: Bearer {token} 헤더 자동 추가
```

## 환경 설정

`.env` 파일에서 API 베이스 URL을 설정할 수 있습니다:

```env
NEXT_PUBLIC_API_URL=https://api.example.com
```

기본값: `http://localhost:3000/api`

## 규칙 준수

이 API 클라이언트들은 다음 규칙을 준수합니다:

- **파일명**: `{도메인}[@파라미터][_{서브리소스}[@파라미터]][_$]_{HTTP메소드}.ts`
- **함수명**: HTTP 메소드별 일관된 네이밍 (create, get, search, update, delete)
- **반환값**: 표준화된 응답 형식
- **에러 처리**: 일관된 에러 메시지와 로깅
- **타입 안전성**: TypeScript 타입 정의

## 추가 API 생성

새로운 API를 추가할 때는 `docs/rules/api-mapping.md`의 매핑 테이블을 참고하여 일관된 패턴으로 생성하세요. 