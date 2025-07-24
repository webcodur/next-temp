# API snake_case → camelCase 마이그레이션 작업 명세서

## 📋 현재 상황

### 변경 사항
- **백엔드**: 기존 camelCase/snake_case 혼재 → 모든 API 응답이 snake_case로 통일됨
- **프론트엔드**: 각 서비스 함수에서 snake_case 응답을 camelCase로 명시적 변환 필요
- **헤더**: 모든 API에 `x-parkinglot-id` 헤더 첨부 (기존 방식 유지)

### 목표
1. 각 API 서비스 함수에서 snake_case 응답을 camelCase로 변환
2. page/view 코드에서 일관된 camelCase 사용
3. 명시적 변환 과정을 통한 데이터 일관성 확보

---

## 🔧 작업 범위

### 1. 변환 유틸리티 함수
- **caseConverter.ts**: snake ↔ camel 변환 함수들
- **타입 정의**: camelCase 기준 인터페이스

### 2. Services API 함수들 (25개 파일)
- **각 함수에서 명시적 변환**: `response.json()` 후 `snakeToCamel()` 적용
- **요청 데이터**: 필요시 camelCase → snake_case 변환
- **응답 데이터**: 반드시 snake_case → camelCase 변환

### 3. Page/View 컴포넌트들
- 기존 camelCase 방식 유지 (변경 없음)
- 서비스에서 이미 camelCase로 변환된 데이터 사용

---

## 📝 TODO List

### Phase 1: 변환 유틸리티 구축 (우선순위: 🔥🔥🔥)

#### 1.1 유틸리티 함수 생성
- [ ] `src/utils/caseConverter.ts` 생성
  - [ ] `snakeToCamel()` 함수 - 객체/배열의 키를 snake → camel 변환
  - [ ] `camelToSnake()` 함수 - 객체/배열의 키를 camel → snake 변환  
  - [ ] 중첩 객체/배열 재귀 처리 로직
  - [ ] 예외 케이스 처리 (URL, ID, ENUM 등)
  - [ ] null/undefined 안전 처리

### Phase 2: TypeScript 타입 정의 (우선순위: 🔥🔥)

#### 2.1 API 응답 타입 정의
- [ ] **Admin 타입**: `src/types/admin.ts` 업데이트
- [ ] **Auth 타입**: `src/types/auth.ts` 업데이트  
- [ ] **Household 타입**: 새로 생성 필요
- [ ] **Menu 타입**: `src/types/menu.ts` 업데이트
- [ ] **공통 API 타입**: `src/types/api.ts` 업데이트

#### 2.2 요청/응답 인터페이스 분리
- [ ] 각 도메인별 Request/Response 타입 명확히 분리
- [ ] 일관된 네이밍 컨벤션 적용

### Phase 3: Services API 함수 수정 (우선순위: 🔥🔥)

> **핵심**: 각 함수에서 `const result = await response.json()` 후 `snakeToCamel(result)` 적용

#### 3.1 Admin API (`src/services/admin/`)
- [ ] `admin_POST.ts`: 응답 데이터 `snakeToCamel()` 변환 적용
- [ ] `admin$_GET.ts`: 응답 데이터 `snakeToCamel()` 변환 적용  
- [ ] `admin@id_GET.ts`: 응답 데이터 `snakeToCamel()` 변환 적용
- [ ] `admin@id_PUT.ts`: 요청 `camelToSnake()`, 응답 `snakeToCamel()` 적용
- [ ] `admin@id_DELETE.ts`: 응답 데이터 `snakeToCamel()` 변환 적용
- [ ] `admin@id_password_reset_PUT.ts`: 응답 데이터 `snakeToCamel()` 변환 적용

#### 3.2 Auth API (`src/services/auth/`)
- [ ] `auth_signin_POST.ts`: 응답 데이터 `snakeToCamel()` 변환 적용
- [ ] `auth_refresh_POST.ts`: 응답 데이터 `snakeToCamel()` 변환 적용
- [ ] `auth_logout_GET.ts`: 응답 데이터 `snakeToCamel()` 변환 적용

#### 3.3 Household API (`src/services/household/`)
- [ ] `household_POST.ts`: 요청 `camelToSnake()`, 응답 `snakeToCamel()` 적용
- [ ] `household$_GET.ts`: 응답 데이터 `snakeToCamel()` 변환 적용
- [ ] `household@id_GET.ts`: 응답 데이터 `snakeToCamel()` 변환 적용
- [ ] `household@id_PUT.ts`: 요청 `camelToSnake()`, 응답 `snakeToCamel()` 적용
- [ ] `household@id_DELETE.ts`: 응답 데이터 `snakeToCamel()` 변환 적용
- [ ] `household@id_instance_POST.ts`: 요청 `camelToSnake()`, 응답 `snakeToCamel()` 적용
- [ ] `household@id_instance_GET.ts`: 응답 데이터 `snakeToCamel()` 변환 적용
- [ ] `household_instance$_GET.ts`: 응답 데이터 `snakeToCamel()` 변환 적용
- [ ] `household_instance@instanceId_GET.ts`: 응답 데이터 `snakeToCamel()` 변환 적용
- [ ] `household_instance@instanceId_PUT.ts`: 요청 `camelToSnake()`, 응답 `snakeToCamel()` 적용
- [ ] `household_instance@instanceId_DELETE.ts`: 응답 데이터 `snakeToCamel()` 변환 적용
- [ ] `household_instance@instanceId_service_config_PUT.ts`: 요청 `camelToSnake()`, 응답 `snakeToCamel()` 적용
- [ ] `household_instance@instanceId_visit_config_GET.ts`: 응답 데이터 `snakeToCamel()` 변환 적용
- [ ] `household_instance@instanceId_visit_config_PUT.ts`: 요청 `camelToSnake()`, 응답 `snakeToCamel()` 적용

#### 3.4 Menu API (`src/services/menu/`)
- [ ] `menu_all_GET.ts`: 응답 데이터 `snakeToCamel()` 변환 적용
- [ ] `menu@menuId_order_PUT.ts`: 요청 `camelToSnake()`, 응답 `snakeToCamel()` 적용
- [ ] `menu_parking_lot@parkinglotId_GET.ts`: 응답 데이터 `snakeToCamel()` 변환 적용
- [ ] `menu_parking_lot@parkinglotId_assign_PUT.ts`: 요청 `camelToSnake()`, 응답 `snakeToCamel()` 적용
- [ ] `menu_parking_lot@parkinglotId_remove_PUT.ts`: 요청 `camelToSnake()`, 응답 `snakeToCamel()` 적용
- [ ] `menu_parking_lot_bulk_assign_PUT.ts`: 요청 `camelToSnake()`, 응답 `snakeToCamel()` 적용

#### 3.5 기타 API
- [ ] `ipBlock_history$_GET.ts`: 응답 데이터 `snakeToCamel()` 변환 적용

### Phase 4: Page/View 검증 및 조정 (우선순위: 🔥)

#### 4.1 데이터 사용 패턴 검증
- [ ] **Menu Management**: `src/app/temp/menu-management/` - API 응답 데이터 사용 패턴 확인
- [ ] **Household Management**: `src/app/temp/household/` - API 응답 데이터 사용 패턴 확인  
- [ ] **Auth 관련 컴포넌트들**: 로그인 폼 등 토큰 처리 확인

#### 4.2 필요시에만 수정
- [ ] 기존에 snake_case로 접근하던 부분이 있다면 camelCase로 수정
- [ ] 상태 관리 (store)에서 snake_case 사용 부분 확인 및 수정
- [ ] 대부분은 변경 불필요 (서비스에서 이미 camelCase 변환됨)

### Phase 5: 테스트 및 검증 (우선순위: 🔥)

#### 5.1 기능 테스트
- [ ] **Admin 관리**: 생성/조회/수정/삭제 전체 플로우
- [ ] **Household 관리**: 세대 및 인스턴스 관리 전체 플로우
- [ ] **Menu 관리**: 메뉴 조회 및 할당 관리
- [ ] **Auth**: 로그인/로그아웃/토큰 갱신

#### 5.2 데이터 변환 검증
- [ ] snake_case API 응답이 camelCase로 정상 변환되는지 확인
- [ ] camelCase 요청이 snake_case로 정상 변환되는지 확인
- [ ] 중첩 객체/배열 변환 정상 동작 확인

---

## 🚨 주의사항

### 1. 각 서비스 함수에서 변환 적용 예시
```typescript
// BEFORE (기존)
export async function getHouseholdDetail(id: number) {
  const response = await fetchDefault(`/households/${id}`, {
    method: 'GET',
  });
  const result = await response.json();
  
  if (!response.ok) {
    return { success: false, errorMsg: result.message };
  }
  
  return { success: true, data: result }; // snake_case 그대로 반환
}

// AFTER (수정)
import { snakeToCamel } from '@/utils/caseConverter';

export async function getHouseholdDetail(id: number) {
  const response = await fetchDefault(`/households/${id}`, {
    method: 'GET',
  });
  const result = await response.json();
  
  if (!response.ok) {
    return { success: false, errorMsg: result.message };
  }
  
  return { 
    success: true, 
    data: snakeToCamel(result) // 🔥 여기서 변환
  };
}
```

### 2. 변환 결과 예시
```typescript
// API 응답 (snake_case)
{
  household_id: 1,
  address_1depth: "101동",
  household_type: "GENERAL",
  created_at: "2024-01-01"
}

// 서비스 함수 반환값 (camelCase)
{
  householdId: 1,
  address1Depth: "101동", 
  householdType: "GENERAL",
  createdAt: "2024-01-01"
}
```

### 3. POST/PUT 요청시 변환 예시
```typescript
// POST/PUT 요청의 경우
import { camelToSnake, snakeToCamel } from '@/utils/caseConverter';

export async function updateHousehold(id: number, data: HouseholdUpdateRequest) {
  const response = await fetchDefault(`/households/${id}`, {
    method: 'PUT',
    body: JSON.stringify(camelToSnake(data)), // 🔥 요청 데이터 변환
  });
  
  const result = await response.json();
  
  if (!response.ok) {
    return { success: false, errorMsg: result.message };
  }
  
  return { 
    success: true, 
    data: snakeToCamel(result) // 🔥 응답 데이터 변환
  };
}
```

### 4. 예외 케이스
- **ENUM 값**: 변환하지 않음 ('GENERAL', 'TEMP' 등)
- **특수 필드**: 이미 camelCase인 필드는 유지
- **URL/path**: 변환 대상 아님
- **에러 메시지**: `message` 필드는 보통 변환 불필요

### 5. 순차 진행
- **Phase 1**: 유틸리티 함수 생성 후 Phase 2 진행
- **Phase 2**: 타입 정의 완료 후 Phase 3 진행  
- **Phase 3**: 서비스 함수 변환 (25개 파일) 후 Phase 4 진행
- **Phase 4**: 검증 및 필요시 조정
- **Phase 5**: 전체 테스트

---

## 📚 참고 자료

- **기존 타입 정의**: `src/types/` 디렉토리
- **현재 API 사용 패턴**: `src/app/temp/` 디렉토리
- **API 규칙**: `docs/api_related/api-generation.md`
- **코딩 규칙**: `.cursor/rules/project-guidelines.mdc`

---

## 🔄 마이그레이션 완료 기준

1. ✅ **유틸리티 함수** 정상 동작 (snake ↔ camel 변환)
2. ✅ **25개 서비스 함수**에서 모두 명시적 변환 적용
3. ✅ page/view 코드에서 일관된 camelCase 데이터 사용
4. ✅ TypeScript 타입 에러 없음
5. ✅ 기존 기능 정상 동작 (관리자/세대/메뉴 관리) 