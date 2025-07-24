# 메뉴 시스템 개편 계획서

## 현재 상황

### 기존 시스템 구조
- **파일**: `src/data/menuData.ts`에서 정적으로 메뉴 데이터 관리
- **구조**: 4개 대분류 (주차, 커뮤니티, 공지사항, 연구소)
- **렌더링**: `PrimaryBar`에서 아이콘 버튼, `SecondaryPanel`에서 계층 메뉴
- **문제점**: 모든 현장이 동일한 메뉴, 권한 무시, 현장별 특성 미반영

### 앞으로 반영해야 하는 신규 API (9개)
**조회 API**:
- `getMyMenuList()`: 내 권한에 따른 메뉴 조회
- `getAllMenuList()`: 모든 메뉴 조회 (관리자)
- `getParkingLotMenuList()`: 주차장별 메뉴 조회  
- `getMenuBreadcrumb()`: 메뉴 breadcrumb 조회

**순서 관리 API**:
- `updateMenuOrder()`: 개별 메뉴 순서 변경
- `updateBatchMenuOrder()`: 메뉴 순서 일괄 변경

**할당 관리 API**:
- `assignMenuToParkingLot()`: 주차장에 메뉴 할당
- `removeMenuFromParkingLot()`: 주차장에서 메뉴 제거
- `bulkAssignMenuToParkingLots()`: 여러 주차장 일괄 할당

## 어떻게 바꿀지

### 1단계: menuData 개선
```typescript
// 현재 → 개편 후
export const menuData = {
  연구소: { icon: FlaskConical, key: '연구소', midItems: {...} }, // 유지
  temp: { icon: Construction, key: 'temp', midItems: {} } // 신규 추가
  // 주차, 커뮤니티, 공지사항 삭제 → API로 대체
};
```

### 2단계: API 부착 (1/n) - 동적 메뉴 통합
- `getMyMenuList()` API로 사용자별/현장별 메뉴 조회
- 정적 메뉴(연구소) + 동적 메뉴(API) 병합
- 아이콘 매핑 시스템 구축 (API 메뉴명 → Lucide 아이콘)

### 3단계: API 부착 (2/n) - DND 순서 변경  
- `@dnd-kit/core` 활용하여 사이드바에 드래그 앤 드롭 구현
- `updateBatchMenuOrder()` API로 순서 변경 동기화

### 4단계: API 부착 (3/n) - 관리자 메뉴 CRUD
- 전체 메뉴 vs 현장별 메뉴 비교 UI
- 체크박스로 메뉴 할당/해제
- 여러 현장 일괄 할당 기능

## 투두리스트

### Phase 1: 기반 작업 (1주)
- [ ] `menuData.ts`에서 주차/커뮤니티/공지사항 대분류 삭제
- [ ] temp 대분류 추가 (Construction 아이콘)
- [ ] 아이콘 매핑 파일 생성 (`iconMapping.ts`)
- [ ] 메뉴 병합 유틸리티 함수 작성

### Phase 2: 동적 메뉴 연동 (1주)
- [ ] `getMyMenuList()` API 연동
- [ ] 정적+동적 메뉴 병합 로직 구현
- [ ] `PrimaryBar` 컴포넌트 동적 렌더링 개선
- [ ] `SecondaryPanel` 동적 메뉴 지원
- [ ] 메뉴 로딩 상태 UI 추가

### Phase 3: DND 순서 변경 (1주)
- [ ] `@dnd-kit` 라이브러리 설정
- [ ] `SecondaryPanel`에 DND 기능 추가
- [ ] 드래그 앤 드롭 시각적 피드백 구현
- [ ] `updateBatchMenuOrder()` API 연동
- [ ] 순서 변경 후 즉시 UI 반영

### Phase 4: 관리자 메뉴 CRUD (1주)
- [ ] 메뉴 관리 페이지 생성 (`/system/menu-management`)
- [ ] `getAllMenuList()` / `getParkingLotMenuList()` 연동
- [ ] 전체 메뉴 vs 현장별 메뉴 비교 UI
- [ ] `assignMenuToParkingLot()` / `removeMenuFromParkingLot()` 연동
- [ ] `bulkAssignMenuToParkingLots()` 일괄 할당 기능

### 기술적 고려사항
- [ ] 메뉴 상태 관리 개선 (Jotai atom)
- [ ] 캐시 전략 구현 (`version` 필드 활용)
- [ ] 에러 처리 및 폴백 메뉴
- [ ] 권한별 메뉴 필터링 로직
- [ ] 성능 최적화 (메모이제이션)

### 검증 항목
- [ ] 사용자 권한에 따른 메뉴 차등 표시
- [ ] 현장별 메뉴 구성 차이 반영
- [ ] DND 순서 변경 후 API 동기화
- [ ] 관리자의 현장별 메뉴 할당/해제
- [ ] 메뉴 로딩 시간 1초 이내
- [ ] 기존 사용 패턴 유지 (학습 비용 최소화)

## 운영 시 핵심 고려사항

### 권한 설계 전략
- **계층적 권한 상속 활용**: 부모 메뉴 권한만 관리하면 자식 메뉴는 자동 제어
- **주차장 단위 권한 분리**: 각 주차장별로 독립적인 메뉴 구성으로 보안 강화
- **최소 권한 원칙**: 사용자에게 꼭 필요한 메뉴만 노출하여 UI 복잡성 최소화

### 성능 및 확장성
- **메뉴 변경 빈도 고려**: 자주 변경되지 않는 메뉴 특성을 활용한 적극적 캐싱
- **주차장 수 증가 대비**: 배치 API 활용으로 대량 주차장 관리 시 성능 확보
- **사용자 증가 대응**: 권한+주차장 조합 캐시로 동시 접속자 부하 분산

## 향후 확장 방향

### 기능적 확장
- **A/B 테스트 지원**: 특정 사용자 그룹에 다른 메뉴 구성 제공
- **사용 패턴 분석**: 메뉴별 클릭률 및 사용 빈도 추적
- **개인화**: 사용자별 자주 사용하는 메뉴 우선 표시
- **모바일 최적화**: 디바이스별 메뉴 구성 차별화

### 기술적 확장
- **실시간 동기화**: WebSocket을 통한 메뉴 변경 즉시 반영
- **오프라인 지원**: 캐시된 메뉴로 네트워크 단절 시에도 기본 기능 제공
- **다국어 지원**: 메뉴명의 다국어 버전 관리
- **테마별 메뉴**: 주차장 브랜딩에 맞는 메뉴 스타일 커스터마이징 