# UI 컴포넌트 구현 문서

## 1. 개요

이 문서는 프로젝트에서 구현된 UI 컴포넌트들의 상세 설명과 구현 현황을 담고 있다.

모든 컴포넌트는 뉴모피즘 디자인을 기반으로 구현되었으며, 각 컴포넌트는 독립적인 폴더 구조로 관리된다. README.md와 index.ts를 포함하여 일관된 구조를 유지한다.

## 2. 컴포넌트 분류 체계

컴포넌트는 menuData.ts의 lab 섹션 구조에 따라 분류된다.

- basicElements: 기본 요소
- inputFeedback: 입력 및 피드백
- layoutNavigation: 레이아웃 및 네비게이션
- advancedData: 고급 및 데이터
- etc: 기타

### 2.1 기본 요소 (Basic Elements)

#### 2.1.1 Container

#### Container 경로 정보

- 컴포넌트: `src/components/ui/neumorphic/CircleContainer.tsx`
- 페이지: `src/app/lab/ui-check/container/page.tsx`

#### Container 구현 세부사항

- 기능: 뉴모피즘 디자인의 양각/음각 컨테이너
- 구현 방식: 자체 구현 + Tailwind
- 활용 라이브러리: Tailwind, React

#### 2.1.2 Button

#### Button 경로 정보

- 컴포넌트: `src/components/ui/button/Button.tsx`
- 페이지: `src/app/lab/ui-check/button/page.tsx`

#### Button 구현 세부사항

- 기능: 뉴모피즘 스타일 기본 버튼
- 구현 방식: 자체 구현 + 뉴모피즘
- 활용 라이브러리: React, Tailwind

#### 2.1.3 Badge

#### Badge 경로 정보

- 컴포넌트: `src/components/ui/badge/index.tsx`
- 페이지: `src/app/lab/ui-check/badge/page.tsx`

#### Badge 구현 세부사항

- 기능: 상태 표시 배지 (default, secondary, destructive, outline)
- 구현 방식: CVA(Class Variance Authority) 활용
- 활용 라이브러리: React, Tailwind, CVA

#### 2.1.4 Avatar

#### Avatar 경로 정보

- 컴포넌트: `src/components/ui/avatar/Avatar.tsx`
- 페이지: `src/app/lab/ui-check/avatar/page.tsx`

#### Avatar 구현 세부사항

- 기능: 사용자 아바타 표시 (이미지, 폴백 지원)
- 구현 방식: Radix UI Avatar 기반
- 활용 라이브러리: Radix UI, React

#### 2.1.5 Tooltip

#### Tooltip 경로 정보

- 컴포넌트: `src/components/ui/tooltip/Tooltip.tsx`
- 페이지: `src/app/lab/ui-check/tooltip/page.tsx`

#### Tooltip 구현 세부사항

- 기능: 위치 자동 조정, 지연 표시
- 구현 방식: Radix UI Tooltip 기반
- 활용 라이브러리: Radix UI, Framer Motion

#### 2.1.6 Card

#### Card 경로 정보

- 컴포넌트: `src/components/ui/card/Card.tsx`
- 페이지: `src/app/lab/ui-check/card/page.tsx`

#### Card 구현 세부사항

- 기능: 정보 그룹화 컨테이너 (호버 효과, 액션 버튼)
- 구현 방식: 자체 구현 + Tailwind
- 활용 라이브러리: Tailwind, React

#### 2.1.7 List Highlight Marker

#### List Highlight Marker 경로 정보

- 컴포넌트: `src/components/ui/list-highlight-marker/ListHighlightMarker.tsx`
- 페이지: `src/app/lab/ui-check/list-highlight-marker/page.tsx`

#### List Highlight Marker 구현 세부사항

- 기능: 드롭다운/리스트/테이블 row의 왼쪽 가장자리에 표시하는 얇은 색상 바와 배경 강조 효과
- 구현 방식: 자체 구현 + 얼룩무늬 패턴 시스템
- 활용 라이브러리: React, Tailwind

#### List Highlight Marker 주요 특징

- **왼쪽 테두리 강조**: 호버/활성 상태에서 왼쪽에 4px 색상 바 표시
- **얼룩무늬 패턴**: 홀수/짝수 항목별로 다른 배경색 적용
- **상태별 스타일링**: 선택, 하이라이트, 호버, 비활성화 상태 지원
- **순번 표시**: 자동으로 "현재위치/총개수" 표시
- **접근성 지원**: 키보드 네비게이션과 화면 리더 고려

### 2.2 입력 및 피드백 (Input & Feedback)

#### 2.2.1 Field

#### Field 경로 정보

- 컴포넌트: `src/components/ui/field/Field.tsx`
- 페이지: `src/app/lab/ui-check/field/page.tsx`

#### Field 구현 세부사항

- 기능: 텍스트 입력, 기본 셀렉트박스, 정렬 선택 (간소화된 단일 선택 구조)
- 구현 방식: 자체 구현 + 기본 Select 로직
- 활용 라이브러리: React, Tailwind

#### Field 제공 컴포넌트

- `FieldText`: 텍스트 입력 필드 (검색 아이콘 지원)
- `FieldSelect`: 기본 드롭다운 셀렉트 (단일 선택)
- `FieldSortSelect`: 정렬 방향 토글 지원 셀렉트

#### Field 주요 특징

- 콤보박스 및 멀티셀렉트 기능 제거로 단순화
- 뉴모피즘 디자인 기반 스타일링
- 일관된 필드 레이블 및 에러 상태 지원

#### 2.2.2 Datepicker

#### Datepicker 경로 정보

- 컴포넌트: `src/components/ui/datepicker/Datepicker.tsx`
- 페이지: `src/app/lab/ui-check/datepicker/page.tsx`

#### Datepicker 구현 세부사항

- 기능: 날짜/기간 선택, 달력 표시, 날짜 범위 선택
- 구현 방식: 자체 구현 + date-fns
- 활용 라이브러리: date-fns, React

#### 2.2.3 Editor

#### Editor 경로 정보

- 컴포넌트: `src/components/ui/editor/markdown-editor.tsx`
- 페이지: `src/app/lab/ui-check/editor/page.tsx`

#### Editor 구현 세부사항

- 기능: 마크다운 에디터 (기본 서식, 미리보기, 이미지 삽입)
- 구현 방식: 간단한 마크다운 에디터 구현
- 활용 라이브러리: React, Tailwind

#### 2.2.4 Toast

#### Toast 경로 정보

- 컴포넌트: `src/components/ui/toast/ToastProvider.tsx`
- 페이지: `src/app/lab/ui-check/toast/page.tsx`

#### Toast 구현 세부사항

- 기능: 상태 알림 메시지 (성공, 에러, 경고)
- 구현 방식: Sonner 라이브러리 활용
- 활용 라이브러리: Sonner, React

#### 2.2.5 Modal

#### Modal 경로 정보

- 컴포넌트: `src/components/ui/modal/Modal.tsx`
- 페이지: `src/app/lab/ui-check/modal/page.tsx`

#### Modal 구현 세부사항

- 기능: 기본 모달 (단순 확인창, 애니메이션)
- 구현 방식: 자체 구현 + Framer Motion
- 활용 라이브러리: Framer Motion, React

#### 2.2.6 Dialog

#### Dialog 경로 정보

- 컴포넌트: `src/components/ui/dialog/Dialog.tsx`
- 페이지: `src/app/lab/ui-check/dialog/page.tsx`

#### Dialog 구현 세부사항

- 기능: 고급 다이얼로그 (복잡한 폼/인터랙션, 다양한 variant, 사이즈)
- 구현 방식: Modal 기반 확장 + 고급 기능
- 활용 라이브러리: Framer Motion, Lucide React

### 2.3 레이아웃 및 네비게이션 (Layout & Navigation)

#### 2.3.1 Tabs

#### Tabs 경로 정보

- 컴포넌트: `src/components/ui/tabs/Tabs.tsx`
- 페이지: `src/app/lab/ui-check/tabs/page.tsx`

#### Tabs 구현 세부사항

- 기능: 콘텐츠 분할/전환 (접근성 고려, 반응형)
- 구현 방식: Radix UI 스타일로 자체 구현
- 활용 라이브러리: React, Tailwind

#### 2.3.2 Stepper

#### Stepper 경로 정보

- 컴포넌트: `src/components/ui/stepper/Stepper.tsx`
- 페이지: `src/app/lab/ui-check/stepper/page.tsx`

#### Stepper 구현 세부사항

- 기능: 단계별 진행 표시 (진행 상태, 단계 이동 제어)
- 구현 방식: 자체 구현
- 활용 라이브러리: React, Tailwind

#### 2.3.3 Timeline

#### Timeline 경로 정보

- 컴포넌트: `src/components/ui/timeline/Timeline.tsx`
- 페이지: `src/app/lab/ui-check/timeline/page.tsx`

#### Timeline 구현 세부사항

- 기능: 시간순 이벤트 표시 (수직/수평 레이아웃, 반응형)
- 구현 방식: 자체 구현 + Tailwind
- 활용 라이브러리: React, Tailwind

#### 2.3.4 Accordion

#### Accordion 경로 정보

- 컴포넌트: `src/components/ui/accordion/Accordion.tsx`
- 페이지: `src/app/lab/ui-check/accordion/page.tsx`

#### Accordion 구현 세부사항

- 기능: 접기/펼치기 아코디언 (상태 텍스트, 비활성화 지원, 토글 콜백)
- 구현 방식: 자체 구현 + 뉴모피즘 디자인
- 활용 라이브러리: React, Tailwind, Lucide React

### 2.4 고급 및 데이터 (Advanced & Data)

#### 2.4.1 Pagination

#### Pagination 경로 정보

- 컴포넌트: `src/components/ui/pagination/Pagination.tsx`
- 페이지: `src/app/lab/ui-check/pagination/page.tsx`

#### Pagination 구현 세부사항

- 기능: 페이지 이동 (크기 조절, 경계 처리, 고도화된 모듈화)
- 구현 방식: 자체 구현 + 다중 컴포넌트 분리
- 활용 라이브러리: React, Tailwind

#### Pagination 포함 컴포넌트

- PaginationControls: 페이지 네비게이션 컨트롤
- PageSizeSelector: 페이지 크기 선택
- PaginatedTable: 페이지네이션이 적용된 테이블

#### 2.4.2 Table

#### Table 경로 정보

- 컴포넌트: `src/components/ui/table/table.tsx`
- 페이지: `src/app/lab/ui-check/table/page.tsx`

#### Table 구현 세부사항

- 기능: 구조화된 데이터 표시 (컬럼 정렬, 커스텀 셀 렌더링)
- 구현 방식: 자체 구현 + Tailwind
- 활용 라이브러리: React, Tailwind

#### 2.4.3 Carousel

#### Carousel 경로 정보

- 컴포넌트: `src/components/ui/carousel/Carousel.tsx`
- 페이지: `src/app/lab/ui-check/carousel/page.tsx`

#### Carousel 구현 세부사항

- 기능: 슬라이더/회전 표시 (무한 스크롤, 자동 슬라이드, 썸네일)
- 구현 방식: Framer Motion 활용
- 활용 라이브러리: Framer Motion, React

#### 2.4.4 DragAndDrop

#### DragAndDrop 경로 정보

- 컴포넌트: `src/components/ui/dnd/SortableList.tsx`
- 페이지: `src/app/lab/ui-check/drag-and-drop/page.tsx`

#### DragAndDrop 구현 세부사항

- 기능: 드래그 앤 드롭 정렬 (목록 정렬, 파일 업로드 지원)
- 구현 방식: 전용 라이브러리 활용
- 활용 라이브러리: Framer Motion, React

#### 2.4.5 InfiniteScroll

#### InfiniteScroll 경로 정보

- 컴포넌트: `src/components/ui/infinite-scroll/InfiniteScroll.tsx`
- 페이지: `src/app/lab/ui-check/infinite-scroll/page.tsx`

#### InfiniteScroll 구현 세부사항

- 기능: 무한 스크롤 로딩 (데이터 증분 로딩, 로딩 표시기)
- 구현 방식: Intersection Observer API + React Hook
- 활용 라이브러리: React, Tailwind

#### 2.4.6 AdvancedSearch

#### AdvancedSearch 경로 정보

- 컴포넌트: `src/components/ui/advanced-search/AdvancedSearch.tsx`
- 페이지: `src/app/lab/ui-check/advanced-search/page.tsx`

#### AdvancedSearch 구현 세부사항

- 기능: 고급 검색 패널 (접기/펼치기, 동적 필드 지원)
- 구현 방식: 자체 구현 + 고급 상태 관리
- 활용 라이브러리: React, Tailwind, Lucide React

### 2.5 기타 (Etc)

#### 2.5.1 Barrier3D

#### Barrier3D 경로 정보

- 컴포넌트: `src/components/ui/barrier/Barrier3d.tsx`
- 페이지: `src/app/lab/ui-check/barrier-3d/page.tsx`

#### Barrier3D 구현 세부사항

- 기능: 3D 차단기 시각화 (애니메이션, 토글 기능)
- 구현 방식: Three.js 활용한 3D 렌더링
- 활용 라이브러리: React, Three.js, Tailwind

#### Barrier3D 포함 파일

- scene.ts: 3D 씬 구성
- animation.ts: 애니메이션 로직
- constants.ts: 상수 정의
- icons.tsx: 아이콘 컴포넌트

## 3. 추가 컴포넌트

menuData.ts에 포함되지 않은 기반 컴포넌트가 있다.

### 3.1 Collapsible

#### Collapsible 경로 정보

- 컴포넌트: `src/components/ui/collapsible/Collapsible.tsx`

#### Collapsible 구현 세부사항

- 기능: 접기/펼치기 콘텐츠 영역
- 구현 방식: Radix UI Collapsible 기반
- 활용 라이브러리: Radix UI, React
- 참고: 아코디언 등의 기반 컴포넌트로 활용

## 4. 구현 현황 요약

### 4.1 완료된 작업

총 22개의 컴포넌트가 완료되었으며, 모든 계획된 기능이 구현되었다.

#### 수량 현황

- 메뉴 연결: menuData.ts의 lab 섹션과 완전히 매칭 (21개)
- 추가 컴포넌트: Collapsible (1개) - 기반 컴포넌트로 활용
- 총 컴포넌트 수: 22개

#### 품질 현황

- 폴더 구조 통일: 모든 컴포넌트가 독립적인 폴더로 관리
- 문서화: 각 컴포넌트별 README.md 파일 제공
- 테스트 페이지: 모든 컴포넌트의 실제 동작 확인 가능

### 4.2 아키텍처 특징

#### 구조적 특징

- 모듈화: 각 컴포넌트가 독립적인 폴더 구조
- 일관성: 모든 컴포넌트에 index.ts와 README.md 포함
- 확장성: 컴포넌트별 추가 기능 구현 용이
- 재사용성: 명확한 Props 인터페이스와 TypeScript 지원

#### 디자인 시스템

- 뉴모피즘 기반: `neu-flat`, `neu-raised`, `neu-inset` 클래스 활용
- 일관된 애니메이션: Framer Motion 기반 부드러운 전환 효과
- 접근성 고려: Radix UI 기반 컴포넌트들의 ARIA 지원
- 반응형 디자인: Tailwind CSS 기반 모바일 친화적 구현

## 5. 향후 개선 방향

### 5.1 성능 최적화

- 컴포넌트별 번들 크기 최적화
- 레이지 로딩 적용

### 5.2 테스트 강화

- 단위 테스트 및 통합 테스트 추가
- 테스트 커버리지 확대

### 5.3 개발 경험 개선

- 스토리북 연동으로 컴포넌트 카탈로그 구축
- 개발 도구 확장

### 5.4 사용자 경험 향상

- 접근성 강화: WCAG 2.1 AA 수준 준수
- 다크 모드: 테마 시스템 도입
