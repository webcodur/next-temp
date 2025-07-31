# 타입 배치 가이드라인

## 🎯 개요

이 문서는 API 타입을 **어디에 배치할지 결정하는 구체적인 가이드라인**을 제공한다. 혼합 접근법을 사용하여 **도메인별 공통 타입**과 **API별 특화 타입**을 효율적으로 구분하는 방법을 설명한다.

## 🔍 타입 배치 결정 플로우

### 단계별 결정 과정

```
1. 이 타입이 여러 API에서 사용되는가?
   ├─ YES → 2단계로
   └─ NO → API 파일 내부에 정의

2. 도메인 엔티티 또는 공통 구조인가?
   ├─ YES → types/{domain}.ts 에 배치
   └─ NO → 3단계로

3. 시스템 전반적으로 사용되는가?
   ├─ YES → types/api.ts 에 배치
   └─ NO → API 파일 내부에 정의
```

### 판단 기준표

| 기준 | 공통 타입 파일 | API 파일 내부 |
|---|---|---|
| **사용 범위** | 2개 이상 API | 1개 API만 |
| **변경 빈도** | 낮음 (안정적) | 높음 (자주 변경) |
| **도메인 성격** | 핵심 엔티티 | 특화된 DTO |
| **재사용 가능성** | 높음 | 낮음 |

## 📁 배치 위치별 상세 가이드

### 1. `types/api.ts` - 시스템 공통 타입

#### 배치 대상
- **페이지네이션**: `PageMetaDto`, `ApiResponse<T>`
- **시스템 설정**: `SystemConfig`, `CacheStats`
- **공통 응답**: `ApiMessageResponse`, `ApiErrorResponse`
- **IP 관리**: `IpBlock`, `IpBlockHistory`

#### 예시
```typescript
// types/api.ts
export interface PageMetaDto {
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  data: T;
  meta?: PageMetaDto;
}

export interface SystemConfig {
  configKey: string;
  configValue: string;
  description?: string;
}
```

### 2. `types/{domain}.ts` - 도메인별 공통 타입

#### 배치 대상
- **핵심 엔티티**: `Admin`, `Household`, `Resident`, `Car`
- **도메인 enum**: `HouseholdType`, `AdminRole`
- **도메인 공통 DTO**: 여러 API에서 사용하는 request/response

#### 예시
```typescript
// types/household.ts
export interface Household {
  id: number;
  parkinglotId: number;
  address1Depth: string;
  address2Depth: string;
  address3Depth: string;
  householdType: HouseholdType;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}

export enum HouseholdType {
  GENERAL = 'GENERAL',
  COMMERCIAL = 'COMMERCIAL'
}

// 여러 API에서 사용하는 공통 DTO
export interface CreateHouseholdBaseRequest {
  parkinglotId: number;
  address1Depth: string;
  address2Depth: string;
  householdType: HouseholdType;
}
```

### 3. `services/{domain}/{파일}.ts` - API별 특화 타입

#### 배치 대상
- **API별 request 파라미터**: 해당 엔드포인트만의 파라미터
- **검색/필터 조건**: 특정 API의 쿼리 조건
- **API별 response 구조**: 특정 API만의 응답 형태
- **변환 인터페이스**: 특정 로직에서만 사용

#### 예시
```typescript
// services/household/household$_GET.ts
interface SearchHouseholdParams {  // 🔥 검색 API에서만 사용
  keyword?: string;
  status?: 'ACTIVE' | 'INACTIVE';
  householdType?: HouseholdType;  // 🔥 공통 enum 재사용
  parkinglotId?: number;
  page?: number;
  limit?: number;
}

interface SearchHouseholdResponse {  // 🔥 검색 응답 구조
  data: Household[];  // 🔥 공통 엔티티 재사용
  meta: PageMetaDto;  // 🔥 공통 페이지네이션 재사용
}

// services/household/household_POST.ts
interface CreateHouseholdRequest extends CreateHouseholdBaseRequest {  // 🔥 공통 베이스 확장
  address3Depth: string;  // 🔥 생성시에만 필요한 추가 필드
  initialResidentName?: string;  // 🔥 생성 API 특화 필드
}
```

## 🔄 중복 가능성 판단 기준

### ✅ 공통 타입으로 추출해야 하는 경우

1. **동일한 구조의 타입**이 2개 이상 API에서 사용
2. **핵심 비즈니스 엔티티**를 나타내는 타입
3. **시스템 전반의 공통 구조** (페이지네이션, 에러 응답 등)

### ❌ API 파일에 남겨둬야 하는 경우

1. **해당 API에서만 사용**하는 특화된 구조
2. **자주 변경**되는 임시적 구조
3. **검색 조건, 필터 파라미터** 등 API별 특화 로직

## 🚀 새로운 API 작성시 타입 배치 결정 가이드

### Step 1: 필요한 타입 목록 작성
```typescript
// 예: 새로운 차량 관리 API
// 필요 타입들:
// - Car (엔티티)
// - SearchCarParams (검색 조건)
// - CarWithOwnerInfo (조인 결과)
```

### Step 2: 각 타입별 판단
```typescript
// Car → 여러 API에서 사용 예상 → types/car.ts
// SearchCarParams → 검색 API에서만 사용 → API 파일 내부
// CarWithOwnerInfo → 특정 조회 API에서만 사용 → API 파일 내부
```

### Step 3: 기존 타입 확인
```typescript
// types/ 디렉토리에서 재사용 가능한 타입 확인
// - PageMetaDto (페이지네이션)
// - User (소유자 정보)
// - ApiResponse<T> (응답 래핑)
```

### Step 4: 최종 구조 결정
```typescript
// types/car.ts - 공통 엔티티
export interface Car {
  id: number;
  licensePlate: string;
  model: string;
  ownerId: number;
}

// services/car/car$_GET.ts - API별 특화
interface SearchCarParams {
  keyword?: string;
  ownerId?: number;
  status?: 'ACTIVE' | 'INACTIVE';
}

interface CarWithOwnerInfo {
  car: Car;      // 공통 타입 재사용
  owner: User;   // 기존 공통 타입 재사용
}
```

## 📋 마이그레이션 가이드

### 기존 API 파일의 타입 재배치

#### 1. 타입 사용 현황 분석
```bash
# 특정 타입이 어디서 사용되는지 확인
grep -r "interface UserDto" src/services/
grep -r "UserDto" src/services/
```

#### 2. 중복 타입 식별
```typescript
// 동일한 구조가 여러 파일에 정의된 경우
// services/admin/admin_POST.ts
interface CreateUserRequest { ... }

// services/user/user_POST.ts  
interface CreateUserRequest { ... }  // 🔥 중복!
```

#### 3. 공통 타입으로 추출
```typescript
// types/user.ts - 새로 생성
export interface CreateUserRequest {
  username: string;
  email: string;
  role: UserRole;
}

// services/admin/admin_POST.ts - import로 변경
import { CreateUserRequest } from '@/types/user';
```

#### 4. 특화 타입은 확장으로 처리
```typescript
// services/admin/admin_POST.ts
interface CreateAdminRequest extends CreateUserRequest {
  parkinglotId: number;  // 관리자 생성시에만 필요
  permissions: string[]; // 관리자 특화 필드
}
```

## 🎯 베스트 프랙티스

### 1. 네이밍 컨벤션
```typescript
// 공통 타입 - 명확하고 간결한 이름
export interface User { ... }
export interface Household { ... }

// API 특화 타입 - 용도가 명확한 이름
interface SearchHouseholdParams { ... }
interface CreateAdminRequest { ... }
interface HouseholdWithResidentsResponse { ... }
```

### 2. 타입 확장 활용
```typescript
// 기본 타입
export interface BaseEntity {
  id: number;
  createdAt: string;
  updatedAt: string;
}

// 확장하여 사용
export interface User extends BaseEntity {
  username: string;
  email: string;
}
```

### 3. Generic 타입 활용
```typescript
// 공통 검색 응답 구조
export interface SearchResponse<T> {
  data: T[];
  meta: PageMetaDto;
  filters?: Record<string, any>;
}

// 사용
type UserSearchResponse = SearchResponse<User>;
type HouseholdSearchResponse = SearchResponse<Household>;
```

## ⚠️ 주의사항

### 1. 과도한 공통화 금지
- 구조가 비슷하다고 무조건 공통 타입으로 만들지 않는다
- 각 도메인의 특성을 고려하여 적절한 수준에서 공통화

### 2. API 변경시 영향 범위 고려
- 공통 타입 변경시 여러 API에 영향
- 변경 빈도가 높은 타입은 API별로 분리 고려

### 3. Import 경로 일관성
```typescript
// ✅ 일관된 import 경로
import { User, UserRole } from '@/types/user';
import { PageMetaDto } from '@/types/api';

// ❌ 혼재된 import 방식
import { User } from '@/types/user';
import { PageMetaDto } from '../../../types/api';
```

---

*이 가이드라인을 따라 타입을 적절히 배치하면 유지보수하기 쉽고 확장 가능한 타입 구조를 만들 수 있다.*