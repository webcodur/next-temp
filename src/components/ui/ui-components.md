# UI 컴포넌트 라이브러리

이 문서는 프로젝트에서 사용되는 모든 UI 컴포넌트의 목록과 각 컴포넌트의 상세 명세서로 연결되는 링크를 제공하는 중앙 인덱스 페이지입니다.

## 경로 안내

• 컴포넌트 구현 소스 : `src/components/ui/**`
• 컴포넌트 개별 문서 : 위 디렉터리 내부 `*.md`
• 데모 · 테스트 페이지 : `src/app/lab/**` (폴더 이름 규칙 = `ui-카테고리/컴포넌트`)

예) `Accordion` → 구현 `src/components/ui/ui-layout/accordion/`, 데모 `/app/lab/ui-layout/accordion/page.tsx`

## 컴포넌트 목록

컴포넌트 이름을 클릭하면 상세한 기능 명세서로 이동합니다.

### 레이아웃 (`ui-layout`)

| 컴포넌트                                                                                    | 설명                                                                       |
| :------------------------------------------------------------------------------------------ | :------------------------------------------------------------------------- |
| [Accordion](./ui-layout/accordion/accordion.md)                                             | 여러 섹션을 접고 펼칠 수 있는 콘텐츠 컨테이너입니다.                       |
| [Collapsible](./ui-layout/collapsible/collapsible.md)                                       | 단일 섹션을 접고 펼치는 기능의 컴포넌트입니다.                             |
| [Dialog](./ui-layout/dialog/dialog.md)                                                      | 사용자에게 작업이나 정보를 요청하는 팝업 창입니다.                         |
| [Modal](./ui-layout/modal/modal.md)                                                         | Dialog보다 간소화된 형태의 기본 모달 창입니다.                             |
| [Nested Tabs](./ui-layout/nested-tabs/nested-tabs.md)                                       | 탭 내부에 또 다른 탭을 중첩하여 사용할 수 있습니다.                        |
| [Stepper](./ui-layout/stepper/stepper.md)                                                   | 여러 단계로 구성된 프로세스의 진행 상태를 표시합니다.                      |
| [Tabs](./ui-layout/tabs/tabs.md)                                                            | 콘텐츠를 여러 패널로 나누어 보여주는 탭 인터페이스입니다.                  |
| [SeatMap](./ui-layout/seat-map/seat-map.md)                                                 | 시설별 좌석 예약 시스템의 좌석 맵 컴포넌트입니다.                          |
| [FacilityEditor](./ui-layout/facility-editor/facility-editor.md)                            | 관리자용 시설 레이아웃 편집 도구입니다.                                    |
| [SeatReservation](./ui-layout/seat-reservation/seat-reservation.md)                         | 사용자 좌석 예약 인터페이스입니다.                                         |
| [FacilityReservation](./ui-layout/facility-reservation/facility-reservation.md)             | 시설 예약 관리 인터페이스입니다.                                           |
| [GridForm](./ui-layout/grid-form/grid-form.md)                                              | CSS Grid와 Flexbox를 계층적으로 조합한 폼 레이아웃 컴포넌트입니다.         |
| [SectionPanel](./ui-layout/section-panel/section-panel.md)                                  | 헤더와 콘텐츠 영역으로 구성된 섹션 패널 컨테이너입니다.                    |
| [SectionDivider](./ui-layout/section-divider/section-divider.md)                            | 중앙에 제목이 있고 양쪽에 라인과 정사각형 장식이 있는 섹션 구분선입니다.   |
| [NeumorphicContainer](./ui-layout/neumorphicContainer/neumorphic-container.md)               | 뉴모피즘 디자인 스타일의 다양한 컨테이너들입니다.                          |
| [ThemeToggle](./ui-layout/theme-toggle/theme-toggle.md)                                     | 라이트/다크 모드 전환 토글 컴포넌트입니다.                                 |
| [Portal](./ui-layout/portal/portal.md)                                                      | React Portal을 활용한 DOM 렌더링 컴포넌트입니다.                          |
| [PageHeader](./ui-layout/page-header/page-header.md)                                        | 페이지 상단에 표시되는 헤더 컴포넌트입니다.                                |

### 입력 (`ui-input`)

| 컴포넌트                                                         | 설명                                                              |
| :--------------------------------------------------------------- | :---------------------------------------------------------------- |
| [Advanced Search](./ui-input/advanced-search/advanced-search.md) | 다양한 필터를 포함하는 접고 펼칠 수 있는 고급 검색 패널입니다.    |
| [Button](./ui-input/button/button.md)                            | 사용자의 액션을 유발하는 기본적인 버튼입니다.                     |
| [ColorSetPicker](./ui-input/color-set-picker/color-set-picker.md) | 미리 정의된 색상 세트에서 색상을 선택하는 컴포넌트입니다.         |
| [Datepicker](./ui-input/datepicker/datepicker.md)                | 날짜 또는 날짜 범위를 선택하는 캘린더 인터페이스입니다.           |
| [Editor](./ui-input/editor/editor.md)                            | 서식 있는 텍스트(Rich Text)를 작성하는 WYSIWYG 에디터입니다.      |
| [Field](./ui-input/field/field.md)                               | 텍스트, 숫자, 비밀번호 등 다양한 타입의 입력을 받는 필드입니다.   |
| [LanguageSwitcher](./ui-input/language-switcher/language-switcher.md) | 언어 선택을 위한 드롭다운 컴포넌트입니다.                         |
| [Simple Input](./ui-input/simple-input/simple-input.md)          | 체크박스, 라디오 버튼 등 간단한 선택을 위한 입력 요소 그룹입니다. |

### 데이터 표시 (`ui-data`)

| 컴포넌트                                                                          | 설명                                                                                                      |
| :-------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------- |
| [Table System](./ui-data/tables.md)                                               | BaseTable, InfiniteTable, PaginatedTable로 구성된 통합 테이블 시스템입니다.                              |
| [BaseTable](./ui-data/baseTable/baseTable.md)                                    | 가장 기본적인 순수 테이블 컴포넌트입니다.                                                                 |
| [InfiniteTable](./ui-data/infiniteTable/infiniteTable.md)                        | 무한 스크롤 기능이 추가된 테이블 컴포넌트입니다.                                                          |
| [PaginatedTable](./ui-data/paginatedTable/paginatedTable.md)                      | 페이지네이션 기능이 추가된 테이블 컴포넌트입니다.                                                         |
| [Pagination](./ui-data/pagination/pagination.md)                                  | 페이지 네비게이션을 위한 독립적인 페이지네이션 컴포넌트입니다.                                            |
| [Infinite Scroll](./ui-data/infinite-scroll/infinite-scroll.md)                   | 사용자가 스크롤을 내리면 새로운 데이터를 계속 불러오는 목록입니다.                                        |
| [List Highlight Marker](./ui-data/list-highlight-marker/list-highlight-marker.md) | 목록에서 현재 선택되거나 호버된 항목을 시각적으로 강조합니다.                                             |
| [Timeline](./ui-data/timeline/timeline.md)                                        | 시간 순서에 따라 이벤트나 기록을 시각적으로 보여줍니다.                                                   |

### 효과 및 장식 (`ui-effects`)

| 컴포넌트                                                     | 설명                                                                    |
| :----------------------------------------------------------- | :---------------------------------------------------------------------- |
| [Animation](./ui-effects/animation/animation.md)             | 다양한 애니메이션 효과들을 제공하는 컴포넌트들입니다.                   |
| [Avatar](./ui-effects/avatar/avatar.md)                      | 사용자 프로필 이미지를 표시하며, 로딩 실패 시 대체 콘텐츠를 보여줍니다. |
| [Badge](./ui-effects/badge/badge.md)                         | 상태, 카테고리, 알림 등을 간결하게 표시하는 작은 태그입니다.            |
| [Card](./ui-effects/card/card.md)                            | 정보를 그룹화하여 표시하는 카드형 컨테이너입니다.                       |
| [Carousel](./ui-effects/carousel/carousel.md)                | 여러 항목을 슬라이드 형태로 보여주는 캐러셀 컴포넌트입니다.             |
| [Chip](./ui-effects/chip/chip.md)                            | 선택 가능한 옵션을 칩 형태로 표시하는 토글형 UI 컴포넌트입니다.         |
| [Drag and Drop](./ui-effects/dnd/dnd.md)                     | 목록의 항목을 마우스나 터치로 끌어서 순서를 변경하는 기능입니다.        |
| [Flip Text](./ui-effects/flip-text/flip-text.md)             | 텍스트의 각 문자가 3D 공간에서 회전하며 나타나는 애니메이션입니다.      |
| [Loading](./ui-effects/loading/loading.md)                   | 다양한 로딩 애니메이션 효과를 제공하는 컴포넌트들입니다.                |
| [Morphing Text](./ui-effects/morphing-text/morphing-text.md) | 하나의 텍스트가 다른 텍스트로 부드럽게 변형되는 애니메이션입니다.       |
| [Toast](./ui-effects/toast/toast.md)                         | 작업 결과나 간단한 정보를 잠시 보여주는 팝업 알림입니다.                |
| [Tooltip](./ui-effects/tooltip/tooltip.md)                   | 특정 요소에 대한 추가 정보를 제공하는 작은 말풍선입니다.                |

### 3D (`ui-3d`)

| 컴포넌트                                  | 설명                                                         |
| :---------------------------------------- | :----------------------------------------------------------- |
| [Barrier3D](./ui-3d/barrier/barrier3d.md) | 3D 주차장 차단기를 시뮬레이션하는 인터랙티브 컴포넌트입니다. |

## 주요 변경사항

### 테이블 시스템 개편
기존의 복잡한 테이블 컴포넌트들을 **컴포짓 패턴**으로 재구성했다:
- `BaseTable` (A): 순수 테이블 기능
- `InfiniteTable` (A+x): BaseTable + 무한스크롤  
- `PaginatedTable` (A+y): BaseTable + 페이지네이션

자세한 내용은 [Table System 문서](./ui-data/tables.md)를 참조하라.

### 새로 추가된 컴포넌트
- **NeumorphicContainer**: 뉴모피즘 디자인 스타일의 컨테이너들
- **ThemeToggle**: 라이트/다크 모드 전환 토글  
- **Portal**: React Portal 기반 DOM 렌더링
- **PageHeader**: 페이지 상단 헤더
- **ColorSetPicker**: 색상 세트 선택 컴포넌트
- **LanguageSwitcher**: 언어 선택 드롭다운
- **Chip**: 토글형 칩 컴포넌트
- **Pagination**: 독립적인 페이지네이션 컴포넌트