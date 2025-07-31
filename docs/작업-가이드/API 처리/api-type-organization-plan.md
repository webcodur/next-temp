# API 타입 구조 개편 계획

## 📋 개요

현재 프로젝트의 API 타입 관리 방식을 **혼합 접근법**으로 개편하는 계획이다. 기존의 전역 타입 파일 중심 방식에서 **도메인별 공통 타입 + API별 특화 타입** 조합으로 변경하여 더 명확하고 유지보수하기 쉬운 구조를 만들고자 한다.

### 현재 상황 분석

#### ✅ 해결된 문제
- **snake_case ↔ camelCase 변환 이슈**: `address_1depth` → `address1Depth` 변환 문제 해결
- **fetchClient.ts 인터셉터 방식 유지**: 글로벌 자동 변환 방식 계속 사용
- **caseConverter.ts 개선**: 숫자 포함 케이스 올바른 변환 지원

#### 🔄 개편 필요 사항
- **타입 배치 전략**: 공통 vs 개별 API 파일 타입 구분 기준 명확화
- **문서화 업데이트**: 새로운 혼합 방식에 대한 가이드라인 작성
- **기존 코드 정리**: services/ 내부 타입들의 적절한 재배치

## 🎯 혼합 접근법 원칙

### 공통 타입 파일 (`types/`)에 배치할 것들
- **도메인 엔티티**: `User`, `Admin`, `Household`, `Resident` 등
- **페이지네이션**: `PageMetaDto`, `ApiResponse<T>` 등
- **공통 enum/constant**: 여러 API에서 사용하는 값들
- **시스템 전반 타입**: `SystemConfig`, `IpBlock` 등

### API 파일 내부에 배치할 것들
- **API별 특화 request DTO**: 해당 엔드포인트만의 파라미터
- **일회성 response 구조**: 특정 API에만 사용되는 응답 형태
- **API별 validation 규칙**: 엔드포인트별 제약사항
- **변환/가공 인터페이스**: 특정 API에서만 필요한 데이터 변환

### 예시 구조
```typescript
// types/household.ts - 공통 도메인 타입
export interface Household {
  id: number;
  parkinglotId: number;
  address1Depth: string;
  // ...
}

// services/household/household$_GET.ts - API별 특화 타입
interface SearchHouseholdParams {
  keyword?: string;
  status?: 'ACTIVE' | 'INACTIVE';
  page?: number;
}

export async function searchHousehold(params?: SearchHouseholdParams): Promise<ApiResponse<{
  data: Household[];
  meta: PageMetaDto;
}>> {
  // ...
}
```

## 📋 TODO List

### 1. 문서화 재편 📚
#### 우선순위: 높음
- [x] **api-generation.md 업데이트**
  - 혼합 방식 타입 배치 원칙 추가
  - 공통 vs 개별 타입 구분 기준 명시
  - 실제 코드 예시 포함
  - 기존 fetchClient 자동 변환 가이드 유지

- [x] **타입 배치 가이드라인 작성**
  - 중복 가능성 판단 기준 문서화
  - 새로운 API 작성시 타입 배치 결정 플로우
  - 마이그레이션 가이드 포함

### 2. services/ 내부 파일 전수 조사 및 재배치 🔍
#### 우선순위: 중간

#### 2-1. 도메인별 타입 사용 현황 분석
- [x] **admin/ 디렉토리 분석**
  - ✅ 모든 API가 types/admin.ts 공통 타입 활용
  - ✅ 중복 정의 없음 (ResetAdminPasswordRequest는 미구현 API)

- [x] **auth/ 디렉토리 분석**
  - ✅ TokenResponse, ApiMessageResponse 등 공통 타입 활용
  - ✅ 중복 정의 없음

- [x] **cache/ 디렉토리 분석**
  - ✅ CacheStats, CacheNamespaceStats 등 공통 타입 활용 (주석으로 명시)
  - ✅ 중복 정의 없음

- [x] **car/ 디렉토리 분석**
  - ✅ 모든 API가 types/car.ts 공통 타입 효율적 활용
  - ✅ 중복 정의 없음

- [x] **config/ 디렉토리 분석**
  - ✅ SystemConfig, CreateSystemConfigRequest 등 공통 타입 활용
  - ✅ 중복 정의 없음

- [x] **household/ 디렉토리 분석**
  - ✅ SearchHouseholdRequest 등 공통 타입 활용
  - ✅ 중복 정의 없음

- [x] **ip/ 디렉토리 분석**
  - ✅ SearchIpBlockHistoryRequest 등 공통 타입 활용
  - ✅ 중복 정의 없음

- [x] **resident/ 디렉토리 분석**
  - ⚠️ **중복 정의 발견**: resident$_GET.ts에서 PageMetaDto, SearchResidentResponse 재정의
  - ⚠️ **불필요한 타입 별칭**: SearchResidentParams, ResidentDto

#### 2-2. 타입 분류 및 중복 식별
- [x] **공통 타입 목록 작성**
  - ✅ 대부분 도메인이 공통 타입을 잘 활용 중
  - ✅ 페이지네이션: types/api.ts의 PaginatedResponse<T> 활용
  - ✅ 공통 응답: ApiResponse<T>, ApiError 등 정리됨

- [x] **특화 타입 목록 작성**  
  - ✅ 대부분 API에서 특화 타입은 없거나 최소화됨
  - ✅ Request/Response DTO는 대부분 공통 타입에서 import
  - ✅ 도메인별 enum/constant는 적절히 분리됨

- [x] **중복 정의 타입 목록 작성**
  - ⚠️ **resident$_GET.ts**: PageMetaDto 재정의 (PaginatedResponse<T>와 중복)
  - ⚠️ **resident$_GET.ts**: SearchResidentParams, ResidentDto 불필요한 별칭
  - ⚠️ **resident$_GET.ts**: SearchResidentResponse 특화 타입 (재배치 필요)

#### 2-3. 타입 재배치 실행
- [x] **API별 특화 타입들을 해당 파일로 이동**
  - ✅ 대부분 API가 이미 적절히 구성됨
  - ✅ import 경로가 올바르게 설정됨

- [x] **공통 사용 타입들을 types/ 디렉토리로 이동**
  - ✅ 대부분 공통 타입이 이미 types/에 잘 배치됨
  - ✅ 모든 사용처에서 올바른 import 경로 사용

- [x] **타입 중복 제거 및 정리**
  - ✅ **resident$_GET.ts 정리 완료**: 중복 타입 제거, PaginatedResponse<Resident> 활용
  - ✅ 불필요한 타입 별칭 제거 (SearchResidentParams, ResidentDto)
  - ✅ PageMetaDto 중복 정의 제거

### 3. 공용 타입 파일 정리 🧹
#### 우선순위: 중간
- [x] **types/ 디렉토리 구조 최적화**
  - ✅ 도메인별 파일 분리가 적절히 구성됨
  - ✅ 파일 크기 적당함 (최대 337줄로 관리 가능한 수준)
  - ✅ 사용되지 않는 타입 거의 없음

- [x] **공통 타입들의 재사용성 개선**
  - ✅ Generic 타입 활용됨 (PaginatedResponse<T>, ApiResponse<T>)
  - ✅ 확장 가능한 인터페이스 구조 잘 구성됨
  - ✅ 타입 유틸리티 함수는 필요시 추가 예정

- [x] **타입 문서화**
  - ✅ 대부분 타입에 적절한 주석 있음
  - ✅ 사용 예시는 API 가이드에서 제공
  - ✅ 의존 관계가 명확히 구성됨

### 4. 코드 품질 개선 ⚡
#### 우선순위: 낮음
- [x] **타입 안정성 강화**
  - ✅ `unknown` 타입 사용이 적절한 수준으로 제한됨
  - ✅ 대부분 구체적인 타입 정의 사용 중
  - ✅ 옵셔널 프로퍼티 정확성 적절함

- [x] **일관성 있는 네이밍**
  - ✅ Request/Response 접미사가 일관되게 적용됨
  - ✅ 도메인별 네이밍 컨벤션 잘 준수됨
  - ✅ 약어 사용 기준 적절함

## 🎯 기대 효과

### 개발자 경험 개선
- **명확한 타입 위치**: 어디서 타입을 찾아야 할지 명확
- **중복 제거**: 동일한 타입을 여러 곳에서 정의하는 문제 해결
- **유지보수성**: API별 변경사항이 다른 API에 영향 최소화

### 코드 품질 향상
- **재사용성**: 공통 타입의 효율적 활용
- **확장성**: 새로운 API 추가시 타입 정의 용이
- **일관성**: 프로젝트 전반의 타입 사용 패턴 통일

## 📅 진행 계획

1. **1주차**: 문서화 재편 (TODO #1)
2. **2주차**: 도메인별 타입 사용 현황 분석 (TODO #2-1)
   - admin, auth, cache, car 디렉토리 분석
3. **3주차**: 도메인별 타입 사용 현황 분석 완료 (TODO #2-1)
   - config, household, ip, resident 디렉토리 분석
4. **4주차**: 타입 분류 및 중복 식별 (TODO #2-2)
5. **5-6주차**: 타입 재배치 실행 (TODO #2-3)
6. **7주차**: 공용 타입 파일 정리 및 최종 검토 (TODO #3)

## ✅ 작업 완료 요약

### 주요 성과
1. **📚 문서화 재편 완료**
   - `api-generation.md`에 혼합 접근법 원칙 추가
   - `type-placement-guide.md` 신규 작성

2. **🔍 전체 코드베이스 분석 완료** 
   - 8개 도메인 (admin, auth, cache, car, config, household, ip, resident) 전수 조사
   - 대부분 도메인이 이미 혼합 접근법을 잘 구현 중

3. **🧹 중복 타입 정리 완료**
   - `resident$_GET.ts`의 중복 정의 제거
   - PageMetaDto → PaginatedResponse<T> 통합
   - 불필요한 타입 별칭 제거

### 현재 상태 평가
- **🟢 매우 양호**: 프로젝트의 타입 구조가 이미 혼합 접근법에 부합하게 잘 구성됨
- **🟢 일관성 확보**: 모든 도메인이 공통 타입을 효율적으로 활용
- **🟢 확장성 보장**: 새로운 API 추가시 명확한 가이드라인 제공

### 결론
API 타입 구조 개편 작업이 성공적으로 완료되었다. 기존 코드베이스가 이미 **혼합 접근법의 원칙**을 잘 따르고 있었으며, 소수의 중복 정의만 정리하면 되는 상황이었다. 

향후 새로운 API 개발시 작성된 가이드라인을 참고하여 일관성 있는 타입 구조를 유지할 수 있다.

---

*✅ 작업 완료일: 2024년 (혼합 접근법 기반 API 타입 구조 개편 완료)*