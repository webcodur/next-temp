# Sidebar 아키텍처 문서

## 개요

3단계 계층 구조를 가진 사이드바 시스템이다. Top → Mid → Bot 메뉴 구조로 구성되어 있으며, 콜랩스 기능과 상태 관리를 포함한다.

## 디렉토리 구조

```
sidebar/
├── sidebar.tsx         # 메인 사이드바 컴포넌트
├── config.ts          # 기본 설정값과 스타일
├── hooks.ts           # 상태 관리 훅
├── types.ts           # 타입 정의
├── data.ts            # 메뉴 데이터
├── unit/              # UI 컴포넌트 단위들
│   ├── SidebarHeader.tsx        # 헤더 영역
│   ├── SidebarLeftColumn.tsx    # 좌측 컬럼 (Top 메뉴)
│   └── SidebarRightColumn.tsx   # 우측 컬럼 (Mid/Bot 메뉴)
└── sidebar.md         # 이 문서
```

## 아키텍처 구조

### 메뉴 계층 구조

```
┌─────────────────────────────────────┐
│                Header               │ ← 브랜드/타이틀 영역
├─────────────┬───────────────────────┤
│             │                       │
│  Top Menu   │    Mid Menu           │ ← 주요 카테고리
│             │                       │
│  [Dashboard]│  ┌─ Overview          │
│  [Analytics]│  ├─ Reports           │
│  [Users]    │  └─ ...               │
│  [Content]  │                       │
│  [Settings] │    Bot Menu           │ ← 세부 링크들
│             │  ┌─ 메인 대시보드       │
│             │  ├─ 실시간 모니터링     │
│  [User]     │  └─ 알림 센터         │
└─────────────┴───────────────────────┘
```

### 상태 관리 구조

```typescript
// 핵심 상태
{
  topMenu: string,          // 선택된 top 메뉴
  midMenu: string,          // 선택된 mid 메뉴
  midExpanded: Set<string>, // 확장된 mid 메뉴들
  isCollapsed: boolean      // 사이드바 숨김 여부
}
```

## 핵심 컴포넌트

### 1. Sidebar (메인 컴포넌트)

- 전체 사이드바 레이아웃 관리
- 토글 버튼 제공
- 하위 컴포넌트들 조합

### 2. SidebarHeader

- 브랜드명과 설명 표시
- 토글 버튼 공간 확보

### 3. SidebarLeftColumn (Top 메뉴)

- 아이콘 기반 top 메뉴 버튼들
- 하단 사용자 아바타
- 활성 상태 시각적 표시

### 4. SidebarRightColumn (Mid/Bot 메뉴)

- 선택된 top 메뉴의 하위 항목들
- 아코디언 형태 확장/축소
- 실제 네비게이션 링크

## 데이터 구조

### MenuData 타입

```typescript
interface MenuData {
	[topKey: string]: {
		icon: LucideIcon;
		label: string;
		color: string;
		midItems: {
			[midKey: string]: {
				label: string;
				botItems: {
					label: string;
					href: string;
				}[];
			};
		};
	};
}
```

### 메뉴 항목 예시

- **dashboard**: 대시보드 (개요, 리포트)
- **analytics**: 분석 (트래픽, 성능)
- **users**: 사용자 (관리, 활동)
- **content**: 콘텐츠 (문서, 발행)
- **settings**: 설정 (시스템, 연동)

## 상호작용 플로우

### Top 메뉴 클릭 시

1. `handleTopClick(topKey)` 실행
2. `topMenu` 상태 업데이트
3. 해당 top의 첫 번째 mid 메뉴 자동 선택
4. `midExpanded` 상태 초기화

### Mid 메뉴 클릭 시

1. `handleMidClick(midKey)` 실행
2. 아코디언 토글 (확장/축소)
3. `midMenu` 상태 업데이트
4. Bot 메뉴 항목들 표시/숨김

### 사이드바 토글 시

1. `setIsCollapsed(!isCollapsed)` 실행
2. Transform 애니메이션으로 슬라이드
3. 토글 버튼 아이콘 변경

## 스타일링 구성

### 디자인 토큰 (config.ts)

- `sidebarWidth`: 300px
- `leftColumnWidth`: 64px (16 Tailwind units)
- `buttonSize`: 48px × 48px
- `headerHeight`: 73px

### 색상 시스템

- 배경: `bg-muted/70`
- 활성 상태: 각 메뉴별 색상 (blue, green, purple 등)
- 호버: `hover:bg-accent`
- 경계선: `border-border`

## 반응형 동작

### 데스크톱

- 고정 너비 300px
- 항상 visible (토글로 숨김 가능)

### 모바일 (추후 확장 시)

- 오버레이 모드
- 스와이프 제스처 지원 고려
- 터치 친화적 버튼 크기

## 확장 가능성

### 추가 기능 고려사항

- 북마크/즐겨찾기 기능
- 검색 기능
- 메뉴 커스터마이징
- 다국어 지원
- 테마 변경

### 성능 최적화

- 메뉴 데이터 lazy loading
- 아이콘 번들 최적화
- 메모이제이션 적용 가능

## 사용법

```tsx
import { Sidebar } from './components/layout/sidebar/sidebar';

// 메인 레이아웃에서 사용
<MainLayout>
	<Sidebar />
	<main>...</main>
</MainLayout>;
```

## 의존성

- **lucide-react**: 아이콘 라이브러리
- **React hooks**: useState 상태 관리
- **Tailwind CSS**: 스타일링
- **TypeScript**: 타입 안정성
