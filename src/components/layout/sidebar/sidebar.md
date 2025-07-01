# Sidebar 아키텍처 문서

## 개요

3단계 계층 구조를 가진 사이드바 시스템이다. Top → Mid → Bot 메뉴 구조로 구성되어 있으며, 접힘/펼침 기능, 검색 기능, 최근 메뉴 기록을 포함한다.

## 디렉토리 구조

```text
sidebar/
├── Sidebar.tsx            # 메인 사이드바 컴포넌트
├── hooks.ts               # 상태 관리 및 검색 훅들
├── types.ts               # 타입 정의
├── sidebar.md             # 이 문서
└── unit/                  # UI 컴포넌트 단위들
    ├── SideHeader.tsx          # 헤더 영역 (브랜드, 토글)
    ├── SideLPanel.tsx          # 좌측 패널 (Top 메뉴)
    ├── SideRPanel.tsx          # 우측 패널 (Mid/Bot 메뉴)
    ├── SearchBar.tsx           # 사이트 검색
    ├── MenuSearchBar.tsx       # 메뉴 검색
    ├── SideToggleHead.tsx      # 헤더 토글 버튼
    └── SideToggleMain.tsx      # 메인 토글 버튼
```

## 아키텍처 구조

### 메뉴 계층 구조

```text
┌─────────────────────────────────────┐
│              SideHeader             │ ← 브랜드/타이틀, 토글 버튼
├─────────────┬───────────────────────┤
│ SideLPanel  │      SideRPanel       │
│             │                       │
│  Top Menu   │    타이틀 및 제어     │ ← 단일/다중 모드, 전체 열기/닫기
│             │                       │
│ [커뮤니티]  │  ┌─ 사용자상태등록    │
│ [시설서비스]│  ├─ 예약관리          │
│ [출입관리]  │  └─ 출입관리          │
│ [방문차량]  │                       │
│ [소통관리]  │    Bot Menu           │ ← 실제 네비게이션 링크
│             │  ┌─ 메인 대시보드     │
│  [마이]     │  ├─ 사용자 목록       │
└─────────────┴───────────────────────┘
```

### 상태 관리 구조

```typescript
// 핵심 상태 (hooks.ts)
{
  topMenu: string,          // 선택된 top 메뉴
  midMenu: string,          // 선택된 mid 메뉴
  midExpanded: Set<string>, // 확장된 mid 메뉴들
  singleOpenMode: boolean,  // 단일/다중 열기 모드
  isCollapsed: boolean      // 사이드바 숨김 여부 (전역)
}

// 검색 상태
{
  menuSearchQuery: string,     // 메뉴 검색어
  menuSearchResults: [],       // 메뉴 검색 결과
  siteSearchQuery: string,     // 사이트 검색어
  siteSearchResults: [],       // 사이트 검색 결과
  recentMenus: [],            // 최근 접속 메뉴
  recentSites: []             // 최근 접속 사이트
}
```

## 핵심 컴포넌트

### 1. Sidebar.tsx (메인 컴포넌트)

- 전체 사이드바 레이아웃 관리 (`sidebar-container` 클래스 사용)
- 하위 컴포넌트들 조합 및 상태 전달
- 접힘/펼침 애니메이션 처리

### 2. SideHeader.tsx

- 브랜드명 표시 ("Meerkat Hub")
- 헤더 토글 버튼 (SideToggleHead 포함)
- 상단 고정 영역

### 3. SideLPanel.tsx (좌측 패널)

- Top 메뉴 버튼들 (아이콘 + 라벨)
- 사용자 프로필 영역 (하단)
- 활성 상태 시각적 표시

### 4. SideRPanel.tsx (우측 패널)

- 타이틀 및 제어 버튼 영역
  - 단일/다중 모드 토글
  - 전체 열기/닫기 버튼
- Mid/Bot 메뉴 계층 표시
- Collapsible 기반 확장/축소
- 트리 형태 시각적 연결선

### 5. 검색 컴포넌트들

- **SearchBar.tsx**: 사이트 검색 (전체 사이트 목록)
- **MenuSearchBar.tsx**: 메뉴 검색 (현재 메뉴 내)

## 데이터 구조

### MenuData 타입 (types.ts)

```typescript
interface BotMenu {
  key: string;
  'kor-name': string;
  'eng-name': string;
  href: string;
  description?: string;
  icon?: LucideIcon;
}

interface MidMenu {
  key: string;
  'kor-name': string;
  'eng-name': string;
  icon?: LucideIcon;
  botItems: BotMenu[];
}

interface TopItem {
  icon: LucideIcon;
  key: string;
  'kor-name': string;
  'eng-name': string;
  color: string;
  midItems: Record<string, MidMenu>;
}

interface MenuData {
  [key: string]: TopItem;
}
```

### 실제 메뉴 항목들

- **community**: 커뮤니티 (사용자상태등록, 예약관리, 주민소통)
- **facilities**: 시설/서비스 (커뮤니티, 시설서비스, 출입관리)
- **access**: 출입관리 (출입관리)
- **vehicle**: 방문차량 관리
- **communication**: 소통관리
- **my**: 마이페이지

## 상호작용 플로우

### Top 메뉴 클릭 시 (handleTopClick)

1. `setTopMenu(topKey)` 실행
2. 모든 Mid 메뉴 접기 (`setMidExpanded(new Set())`)
3. `setMidMenu('')` 초기화
4. 새로운 Top 메뉴의 우측 패널 표시

### Mid 메뉴 클릭 시 (handleMidClick)

1. 단일 모드: 하나만 열고 나머지 닫기
2. 다중 모드: 토글 방식 (개별 제어)
3. `setMidMenu(midKey)` 업데이트
4. Bot 메뉴들 표시/숨김

### 모드 전환 (handleSingleOpenToggle)

1. `setSingleOpenMode(!singleOpenMode)`
2. useEffect에서 자동으로 midExpanded 상태 조정
3. 단일 모드 → 현재 선택된 것만 유지
4. 다중 모드 → 기존 상태 유지

### URL 기반 자동 선택

1. `usePathname()` 변경 감지
2. 현재 URL과 매칭되는 메뉴 탐색
3. 해당 Top/Mid 메뉴 자동 선택 및 확장
4. 최근 메뉴에 자동 기록

## 기능별 훅 (hooks.ts)

### 1. useSidebarMenu()

- 메뉴 상태 관리 및 이벤트 핸들러
- URL 기반 자동 메뉴 선택
- 단일/다중 모드 처리

### 2. useSidebarSearch()

- 사이트 검색 기능
- 최근 접속 사이트 관리
- 검색 결과 드롭다운

### 3. useMenuSearch()

- 메뉴 검색 기능
- 최근 접속 메뉴 관리
- 실시간 검색 결과

### 4. useSidebarKeyboard()

- 키보드 단축키 (Cmd/Ctrl + /)
- 사이드바 토글 기능

## 스타일링 구성

### 뉴모피즘 클래스 사용

- **Sidebar**: `sidebar-container` (hover 효과 없는 컨테이너)
- **Mid 메뉴**: `neu-flat` → `neu-inset` (활성 시)
- **Bot 메뉴**: `neu-flat` → `neu-inset` (활성 시)
- **아이콘**: `neu-icon-inactive` → `neu-icon-active`

### 레이아웃 설정

- 전체 너비: sidebarConfig의 `sidebarWidth`
- 좌측 패널: 고정 비율
- 우측 패널: 가변 비율
- 접힘/펼침: transform 애니메이션

## 확장 기능

### 검색 시스템

- 실시간 검색 결과
- 최근 검색 기록
- 키보드 네비게이션 지원

### 최근 접속 기록

- localStorage 기반 영구 저장
- 최대 10개 항목 유지
- 자동 중복 제거

### 애니메이션

- Collapsible 기반 확장/축소
- 순차적 Bot 메뉴 등장 애니메이션
- GPU 가속 transform 사용

## 사용법

```tsx
import { Sidebar } from '@/components/layout/sidebar/Sidebar';

// 메인 레이아웃에서 사용
<MainLayout>
  <Sidebar />
  <main>...</main>
</MainLayout>;
```

## 의존성

- **jotai**: 전역 상태 관리
- **lucide-react**: 아이콘 라이브러리
- **@radix-ui/react-collapsible**: 확장/축소 UI
- **@radix-ui/react-tooltip**: 툴팁
- **next/navigation**: 라우팅 및 pathname 추적
- **design-system.css**: 뉴모피즘 스타일링

## 성능 최적화

### 메모이제이션

- 검색 결과 캐싱
- 컴포넌트 렌더링 최적화

### 상태 관리

- jotai를 통한 효율적인 전역 상태
- 필요한 컴포넌트만 리렌더링

### 애니메이션 구성방식

- GPU 가속 transform 사용
- 순차적 애니메이션으로 부드러운 UX
- 순차적 애니메이션으로 부드러운 UX
