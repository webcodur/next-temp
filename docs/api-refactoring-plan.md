# API 자동변환 제거 및 타입 기반 처리 작업 계획

## 📋 작업 개요

**목표**: fetchClient.ts의 자동 camelCase ↔ snake_case 변환 로직을 제거하고, 각 API 서비스에서 타입에 맞게 명시적으로 처리하도록 리팩토링

**배경**: 현재 fetchClient.ts에서 모든 요청/응답을 자동으로 변환하고 있어 성능상 오버헤드가 있고, 디버깅이 어려우며, 타입 안정성이 떨어지는 문제가 있음

---

## 🔍 현재 상황 분석

### 1. 현재 아키텍처
```
Client (camelCase) ←→ fetchClient.ts (자동변환) ←→ Server (snake_case)
```

### 2. 자동 변환 위치
- **fetchClient.ts**: L2-3 import, L81,126,144에서 변환 로직 사용
- **request interceptor**: URL 쿼리 파라미터 변환 (L76-96)
- **request interceptor**: body JSON 변환 (L121-133)  
- **response interceptor**: 응답 JSON 변환 (L137-161)

### 3. 영향받는 파일 현황
- **API 서비스 파일**: 총 51개 함수 (admin: 6개, auth: 3개, car: 8개, config: 5개, household: 14개, ip: 4개, resident: 10개, cache: 3개)
- **타입 정의 파일**: 9개 파일 (admin.ts, auth.ts, car.ts, household.ts, api.ts, menu.ts, parking.ts, facility-editor.ts)
- **케이스 변환 유틸**: caseConverter.ts (제거 예정)

---

## 🛠 작업 계획

### Phase 1: 아키텍처 설계 (우선순위: 🔥🔥🔥)

#### 1.1 새로운 아키텍처 정의
```
Client (camelCase) ←→ Service Layer (내장 변환) ←→ Server (snake_case)
```

#### 1.2 타입 시스템 재설계
- **Server 타입**: 각 API 서비스 파일 내부에 정의 (1회성 사용)
- **Client 타입**: 공통 타입 파일에 유지 (재사용)
- **변환 함수**: 각 API 서비스 파일 내부에 구현 (성능 최적화)

### Phase 2: API 서비스 파일 구조 설계 (우선순위: 🔥🔥🔥)

#### 2.1 각 API 서비스 파일 내부 구조
```typescript
// 예시: src/services/admin/admin_POST.ts

// 1. 서버 타입 정의 (파일 내부에서만 사용)
interface AdminServerResponse {
  id: number;
  account: string;
  role_id: number;        // snake_case
  parkinglot_id?: number; // snake_case
  created_at: string;     // snake_case
  updated_at: string;     // snake_case
}

interface CreateAdminServerRequest {
  account: string;
  role_id: number;        // snake_case
  parkinglot_id?: number; // snake_case
}

// 2. 변환 함수 정의 (파일 내부에서만 사용)
function serverToClient(server: AdminServerResponse): Admin {
  return {
    id: server.id,
    account: server.account,
    roleId: server.role_id,
    parkinglotId: server.parkinglot_id,
    createdAt: server.created_at,
    updatedAt: server.updated_at,
  };
}

function clientToServer(client: CreateAdminRequest): CreateAdminServerRequest {
  return {
    account: client.account,
    role_id: client.roleId,
    parkinglot_id: client.parkinglotId,
  };
}

// 3. API 함수 구현
export async function createAdmin(data: CreateAdminRequest): Promise<Admin> {
  const serverRequest = clientToServer(data);
  const response = await fetchDefault('/api/admin', {
    method: 'POST',
    body: JSON.stringify(serverRequest),
  });
  const serverResponse = await response.json() as AdminServerResponse;
  return serverToClient(serverResponse);
}
```

#### 2.2 공통 타입 파일 정리
- **유지할 타입**: 여러 곳에서 재사용되는 클라이언트 타입 (Admin, CreateAdminRequest 등)
- **제거할 타입**: 1회성 서버 응답 타입, 변환용 임시 타입
- **새로 정리**: 도메인별로 재사용 가능한 타입들만 남김

### Phase 3: fetchClient.ts 수정 (우선순위: 🔥🔥)

#### 3.1 자동 변환 로직 제거
- [x] camelToSnake, snakeToCamel import 제거
- [x] convertUrlQueryParams 함수 제거
- [x] request interceptor 변환 로직 제거 (L121-133)
- [x] response interceptor 변환 로직 제거 (L137-161)

#### 3.2 단순화된 fetchClient
```typescript
export const fetchDefault = returnFetch({
  baseUrl: baseUrl,
  interceptors: {
    request: async (args) => {
      if (args[1]) {
        const accessToken = getTokenFromCookie('access-token');
        const parkingLotId = getEffectiveParkingLotId();
        
        args[1].headers = {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken || ''}`,
          ...(parkingLotId && { 'x-parkinglot-id': parkingLotId.toString() }),
          ...args[1].headers,
        };
      }
      return args;
    },
    response: async (response) => {
      return response; // 변환 없이 그대로 반환
    },
  },
});
```

### Phase 4: API 서비스 함수 업데이트 (우선순위: 🔥🔥)

#### 4.1 Admin 서비스 (6개 함수) ✅ 완료
- [x] `admin_POST.ts` - createAdmin
- [x] `admin$_GET.ts` - searchAdmin  
- [x] `admin@id_GET.ts` - getAdminDetail
- [x] `admin@id_PUT.ts` - updateAdmin
- [x] `admin@id_DELETE.ts` - deleteAdmin
- [x] `admin@id_password_reset_PUT.ts` - resetAdminPassword

#### 4.2 Auth 서비스 (3개 함수) ✅ 완료
- [x] `auth_signin_POST.ts` - signInWithCredentials
- [x] `auth_logout_GET.ts` - logout
- [x] `auth_refresh_POST.ts` - refreshTokenWithString

#### 4.3 Car 서비스 (8개 함수) ✅ 완료
- [x] `car_POST.ts` - createCar
- [x] `car$_GET.ts` - searchCar
- [x] `car@id_GET.ts` - getCarDetail
- [x] `car@id_PATCH.ts` - updateCar
- [x] `car@id_DELETE.ts` - deleteCar
- [x] `car_household_relation_POST.ts` - createCarHouseholdRelation
- [x] `car_household_relations$_GET.ts` - searchCarHouseholdRelations
- [x] `car_household@carId_users_settings_GET.ts` - getCarHouseholdUsersSettings

#### 4.4 Config 서비스 (5개 함수) ✅ 완료
- [x] `config_POST.ts` - createConfig
- [x] `config$_GET.ts` - getAllConfigs
- [x] `config@key_GET.ts` - getConfigByKey
- [x] `config@key_PUT.ts` - updateConfig
- [x] `config@key_DELETE.ts` - deleteConfig

#### 4.5 Household 서비스 (14개 함수) ✅ 완료
- [x] `household_POST.ts` - createHousehold
- [x] `household$_GET.ts` - searchHousehold
- [x] `household@id_GET.ts` - getHouseholdDetail
- [x] `household@id_PUT.ts` - updateHousehold
- [x] `household@id_DELETE.ts` - deleteHousehold
- [x] `household@id_instance_GET.ts` - getHouseholdInstanceList
- [x] `household@id_instance_POST.ts` - createHouseholdInstance
- [x] `household_instance$_GET.ts` - searchHouseholdInstance
- [x] `household_instance@instanceId_GET.ts` - getHouseholdInstanceDetail
- [x] `household_instance@instanceId_PUT.ts` - updateHouseholdInstance
- [x] `household_instance@instanceId_DELETE.ts` - deleteHouseholdInstance
- [x] `household_instance@instanceId_visit_config_GET.ts` - getHouseholdVisitConfig
- [x] `household_instance@instanceId_visit_config_PUT.ts` - updateHouseholdVisitConfig
- [x] `household_instance@instanceId_service_config_PUT.ts` - updateHouseholdServiceConfig

#### 4.6 IP 서비스 (4개 함수) ✅ 완료
- [x] `block_GET.ts` - getBlockedIpList
- [x] `block_DELETE.ts` - deleteAllBlockedIp
- [x] `block@ip_DELETE.ts` - deleteBlockedIp
- [x] `block_history$_GET.ts` - searchBlockHistory

#### 4.7 Resident 서비스 (10개 함수) ✅ 완료
- [x] `resident_POST.ts` - createResident
- [x] `resident$_GET.ts` - searchResident
- [x] `resident@id_GET.ts` - getResidentDetail
- [x] `resident@id_PATCH.ts` - updateResident
- [x] `resident@id_DELETE.ts` - deleteResident
- [x] `resident@id_history_GET.ts` - getResidentHistory
- [x] `resident_move_POST.ts` - moveResident
- [x] `resident_household_POST.ts` - createResidentHousehold
- [x] `resident_household@id_PATCH.ts` - updateResidentHousehold
- [x] `resident_household@id_DELETE.ts` - deleteResidentHousehold

#### 4.8 Cache 서비스 (3개 함수) ✅ 완료
- [x] `cache_stats_GET.ts` - getCacheStats
- [x] `cache_namespace@namespace_stats_GET.ts` - getCacheStatsByNamespace
- [x] `cache_namespace@namespace_DELETE.ts` - deleteCacheNamespace

### Phase 5: 타입 파일 정리 및 최적화 (우선순위: 🔥🔥)

#### 5.1 공통 타입 파일 재구성
```
src/types/
├── admin.ts      # Admin 도메인 재사용 타입만 (Admin, CreateAdminRequest 등)
├── auth.ts       # Auth 도메인 재사용 타입만
├── car.ts        # Car 도메인 재사용 타입만
├── config.ts     # Config 도메인 재사용 타입만
├── household.ts  # Household 도메인 재사용 타입만
├── api.ts        # 공통 API 관련 타입 (ApiResponse, PaginationParams 등)
└── ...          # 기타 공통 타입들
```

#### 5.2 타입 정리 기준
- **유지**: 여러 API 서비스에서 재사용되는 클라이언트 타입
- **유지**: UI 컴포넌트에서 사용하는 타입  
- **제거**: 1회성 서버 응답 타입 (각 API 파일로 이동)
- **제거**: 변환 전용 중간 타입들

### Phase 6: 정리 및 최적화 (우선순위: 🔥)

#### 6.1 불필요한 파일 제거
- [x] `src/utils/caseConverter.ts` 삭제
- [x] `docs/_사용 완료/api-snake-to-camel-migration.md` 이동 (이미 존재)

#### 6.2 타입 정리
- [x] 공통 타입 파일에서 1회성 서버 타입들 제거 (각 API 파일 내부로 이동)
- [x] 각 API 서비스 파일로 이동된 타입들 정리 확인 (완료)
- [x] 사용하지 않는 타입 제거 (클라이언트 타입은 재사용성으로 유지)

#### 6.3 문서 업데이트
- [x] API 사용 가이드 업데이트 (체크리스트 완료)
- [x] 변환 로직 문서화 (각 API 파일에 내장)

---

## 🎯 작업 우선순위

### 1단계 (핵심 인프라)
1. **fetchClient 단순화**: 자동 변환 로직 제거
2. **API 서비스 파일 구조 설계**: 내장 타입 및 변환 함수 패턴 정의

### 2단계 (서비스 업데이트)
1. **Auth 서비스**: 로그인 관련 우선 처리 (내장 타입 및 변환 함수 적용)
2. **Admin 서비스**: 관리자 기능 (새로운 패턴 정착)
3. **나머지 서비스**: 도메인별 순차 처리

### 3단계 (정리 및 최적화)
1. **불필요 파일 제거**
2. **문서 업데이트**
3. **성능 테스트**

---

## 🚀 예상 효과

### 성능 개선
- 자동 변환 오버헤드 제거
- 필요한 필드만 변환하는 최적화
- 번들 크기 감소 (별도 변환 유틸 파일 제거)

### 개발 경험 개선  
- 명시적 변환으로 디버깅 용이
- 타입 안전성 향상
- 코드 가독성 증대
- API 함수별 독립적 개발 가능

### 유지보수성 향상
- 변환 로직의 예측 가능성
- API 서비스 파일 내부에서 완결된 구조
- 타입과 변환 로직이 한 곳에 위치하여 관리 용이
- 테스트 코드 작성 용이

---

## ⚠️ 주의사항

1. **점진적 마이그레이션**: 한 번에 모든 서비스를 바꾸지 않고 단계적으로 진행
2. **하위 호환성**: 기존 클라이언트 코드는 변경하지 않음
3. **테스트 필수**: 각 API 함수마다 변환 로직 테스트 필요
4. **성능 모니터링**: 변환 함수의 성능 최적화 지속 모니터링

---