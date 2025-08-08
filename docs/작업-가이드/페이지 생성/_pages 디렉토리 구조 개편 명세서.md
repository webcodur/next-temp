# _pages 디렉토리 구조 개편 명세서

## 개편 배경

### 현재 문제점
- **3단 메뉴 구조를 파일 시스템에서도 그대로 재현**: `parking/lot/info` 같은 깊은 중첩
- **URL 변경 시 연쇄 수정**: 메뉴 URL이 바뀌면 파일 경로도 함께 변경해야 함
- **관리 복잡성**: 비슷한 기능의 페이지들이 여러 곳에 흩어져 있음
- **검색의 어려움**: 깊은 디렉토리 구조로 인한 파일 찾기 어려움

### 개선 목표
- **단순한 파일 구조**: 2단계 깊이로 제한
- **URL 독립성**: 메뉴 URL 변경 시 파일 이동 불필요
- **논리적 그룹핑**: 관련 기능들이 한 곳에 모임
- **검색 용이성**: 기능별로 파일을 쉽게 찾을 수 있음

## 새로운 구조 설계

### 기본 원칙
1. **중위 메뉴 기준 디렉토리 구성**: menuData.ts의 midItems 키를 기준으로 디렉토리 생성
2. **영어 디렉토리명 사용**: 크로스 플랫폼 호환성 확보
3. **불필요한 접미사 제거**: `management`, `info` 등 중복 단어 제거
4. **2단계 깊이 제한**: `_pages/[중위메뉴]/[페이지파일]` 구조

### 디렉토리 매핑 테이블

| 한글 중위 메뉴명 | 영어 디렉토리명 | 설명 |
|---|---|---|
| `__허브 정보` | `hub` | 허브 이용 안내, 공지사항, 업데이트 내역 |
| `__통합 정보` | `integrated` | 전체, 건물, 시설, 호실, 입주세대, 입주민, 차량 |
| `운영 정보` | `operation` | 근무자 관리 |
| `주차장 관리` | `parking` | 주차장 정보, 출입관리, 차단기 관리 |
| `규정 위반` | `violation` | 규정 위반 설정/내역, 블랙리스트 |
| `입주 관리` | `occupancy` | 호실, 입주자, 차량 관리 |
| `IP 차단 관리` | `ip-block` | IP 차단 실시간 내역, 전체 히스토리 |
| `캐시관리` | `cache` | 캐시 통계, 캐시 관리 |
| `시스템 설정` | `system-settings` | 시스템 설정 |
| `UI레이아웃` | `ui-layout` | UI 연구소 - 레이아웃 컴포넌트 |
| `UI효과` | `ui-effects` | UI 연구소 - 효과 컴포넌트 |
| `UI입력` | `ui-input` | UI 연구소 - 입력 컴포넌트 |
| `UI데이터` | `ui-data` | UI 연구소 - 데이터 컴포넌트 |
| `UI_3D` | `ui-3d` | UI 연구소 - 3D 컴포넌트 |

## 새로운 디렉토리 구조

```
src/components/view/
├── _etc/              # 공통 컴포넌트 (유지)
├── _screen/           # 재사용 화면 단위 (유지)
├── _pages/            # 새로운 페이지 디렉토리
│   ├── hub/
│   ├── integrated/
│   ├── operation/
│   ├── parking/
│   ├── violation/
│   ├── occupancy/
│   ├── ip-block/
│   ├── cache/
│   ├── system-settings/
│   ├── ui-layout/
│   ├── ui-effects/
│   ├── ui-input/
│   ├── ui-data/
│   └── ui-3d/
└── NotFound.tsx       # 특수 페이지 (유지)
```

## 파일 이동 매핑

### 기존 → 새 구조 매핑

```typescript
const migrationMapping = {
  // 허브 (hub)
  'global/info/guide' → '_pages/hub/HubGuidePage.tsx',
  'global/info/notice' → '_pages/hub/HubNoticePage.tsx',
  'global/info/update' → '_pages/hub/HubUpdatePage.tsx',

  // 통합 (integrated)
  'global/flowchart/overview' → '_pages/integrated/OverviewPage.tsx',
  'global/flowchart/building' → '_pages/integrated/BuildingPage.tsx',
  'global/flowchart/facility' → '_pages/integrated/FacilityPage.tsx',
  'global/flowchart/household' → '_pages/integrated/HouseholdPage.tsx',
  'global/flowchart/household-instance' → '_pages/integrated/HouseholdInstancePage.tsx',
  'global/flowchart/resident' → '_pages/integrated/ResidentPage.tsx',
  'global/flowchart/vehicle' → '_pages/integrated/VehiclePage.tsx',

  // 운영 (operation)
  'global/operation/admin/*' → '_pages/operation/',

  // 주차 (parking)
  'parking/lot/*' → '_pages/parking/',
  'parking/device/*' → '_pages/parking/',

  // 규정 위반 (violation)
  'parking/violation/*' → '_pages/violation/',

  // 입주 (occupancy)
  'parking/occupancy/*' → '_pages/occupancy/',
  'parking/car/*' → '_pages/occupancy/',
  'parking/instance/*' → '_pages/occupancy/',
  'parking/resident/*' → '_pages/occupancy/',

  // IP 차단 (ip-block)
  'system/ip-block/*' → '_pages/ip-block/',
  'system/ip/*' → '_pages/ip-block/',

  // 캐시 (cache)
  'system/cache/*' → '_pages/cache/',

  // 시스템 설정 (system-settings)
  'system/config/*' → '_pages/system-settings/',

  // UI 연구소 (기존 구조 유지, 경로만 변경)
  // lab/ui-layout/* → _pages/ui-layout/*
  // lab/ui-effects/* → _pages/ui-effects/*
  // lab/ui-input/* → _pages/ui-input/*
  // lab/ui-data/* → _pages/ui-data/*
  // lab/ui-3d/* → _pages/ui-3d/*
};
```

## 파일명 명명 규칙

### 충돌 해결 방안
동일한 디렉토리 내에서 파일명 충돌 시 다음 규칙 적용:

- `[기능]Page.tsx` - 목록/관리 페이지
- `[기능]DetailPage.tsx` - 상세 페이지
- `[기능]CreatePage.tsx` - 생성 페이지
- `[기능]EditPage.tsx` - 편집 페이지

### 예시: violation 디렉토리
```
_pages/violation/
├── ViolationConfigPage.tsx      # 규정 위반 설정 (관리)
├── ViolationHistoryPage.tsx     # 규정 위반 내역
├── BlacklistConfigPage.tsx      # 블랙리스트 설정
├── BlacklistPage.tsx            # 블랙리스트 목록
├── BlacklistDetailPage.tsx      # 블랙리스트 상세
└── BlacklistCreatePage.tsx      # 블랙리스트 생성
```

## 마이그레이션 실행 계획

### 1단계: _pages 디렉토리 생성
```bash
mkdir -p src/components/view/_pages/{hub,integrated,operation,parking,violation,occupancy,ip-block,cache,system-settings,ui-layout,ui-effects,ui-input,ui-data,ui-3d}
```

### 2단계: 점진적 파일 이동
**우선순위별 이동:**
1. **시스템 관리** (cache, ip-block, system-settings): 파일이 적고 단순함
2. **주차 관리** (parking, violation, occupancy): 가장 복잡하지만 핵심 기능
3. **전역 정보** (hub, integrated, operation): 구조가 명확함
4. **UI 연구소** (ui-*): 이미 잘 구성되어 있음

### 3단계: import 경로 업데이트
- 모든 import 경로를 새 구조에 맞게 수정
- app 디렉토리의 라우트 파일들도 새 경로로 업데이트

### 4단계: 기존 디렉토리 정리
- 파일 이동 완료 후 기존 빈 디렉토리 제거
- git에서 파일 이동 히스토리 보존 확인

## 기대 효과

### 장점
1. **단순한 파일 구조**: 2단계 깊이로 제한하여 탐색 용이
2. **URL 독립성**: 메뉴 URL 변경 시 파일 이동 불필요
3. **논리적 그룹핑**: 관련 기능들이 한 곳에 모여 관리 편의성 증대
4. **검색 용이성**: 기능별로 파일을 쉽게 찾을 수 있음
5. **크로스 플랫폼 호환성**: 영어 디렉토리명으로 환경 독립성 확보

### 단점
1. **초기 마이그레이션 작업**: 기존 파일들을 이동하는 작업 필요
2. **파일명 충돌 가능성**: 같은 이름의 페이지가 있을 수 있음 (명명 규칙으로 해결)
3. **학습 비용**: 새로운 구조에 대한 팀원 학습 필요

## 주의사항

1. **점진적 이동**: 한 번에 모든 파일을 이동하지 말고 기능별로 순차적 이동
2. **테스트 실행**: 각 단계마다 빌드 및 테스트 확인
3. **Import 경로 체크**: 절대 경로 사용 시 경로 업데이트 필수
4. **Git 히스토리**: 파일 이동 시 git mv 명령어 사용하여 히스토리 보존

## 완료 체크리스트

- [ ] _pages 디렉토리 구조 생성
- [ ] 시스템 관리 페이지 이동 (cache, ip-block, system-settings)
- [ ] 주차 관리 페이지 이동 (parking, violation, occupancy)
- [ ] 전역 정보 페이지 이동 (hub, integrated, operation)
- [ ] UI 연구소 페이지 이동 (ui-*)
- [ ] app 디렉토리 라우트 파일 경로 업데이트
- [ ] 모든 import 경로 업데이트
- [ ] 기존 빈 디렉토리 정리
- [ ] 빌드 및 테스트 확인
- [ ] 문서 업데이트 (README, 기타 가이드)

---

**작성일**: $(date)  
**작성자**: AI Assistant  
**버전**: 1.0
