# UI 모듈

## 테이블 [BaseTable]

- 페이지네이션이나 무한스크롤 테이블에서도 호출됨
- 각 행 호버 시 primary 색상 즉시적용
- 각 행 줄무늬 패턴 적용 (스트라이핑)
- 셀 별로 컨텐츠 출력을 위한 너비가 부족한 경우 셀 클릭으로 모달 창 열어서 전문 확인 가능
- ID 관련 컬럼도 전부 추가하여 디버깅에 활용할 것
  ㄴ 최고관리자나 ENV에서의 flag 활성화 시만 (OR조건) 컬럼이 보여지게 해뒀기 떄문에 고객이 ID 값을 보지 못한다.
- min-width 기반 컬럼 너비 처리
  ㄴ 컬럼 별 min-width [누적합]이 상위 컴포넌트에서 할당받은 가로폭 [할당값] 과 비교하여
  ㄴ 누적합 < 할당값: 각 컬럼의 가로폭값에 비례하도록 넓혀서 전체 가로폭을 충실히 활용
  ㄴ 누적합 > 할당값: 할당값에 대해 합산값이 부족한만큼 가로스크롤 발생시킴

## 테이블 확장형

### [PaginatedTable] 
- BaseTable + 페이지네이션 기능

### [InfiniteTable]
- BaseTable + 무한스크롤 기능

### [SortableTable]
- BaseTable 로직 기반 + DND(드래그앤드롭) 기능
- @dnd-kit 라이브러리 사용
- 행 순서 변경 가능 (드래그 핸들 컬럼 지정 필요)
- 드래그 시 행 미리보기 오버레이 제공
- 키보드 접근성 지원 

## 폼 [GridFormAuto]

- 기본뷰/상세뷰 단위로 자동 선택 가능하게 되어있음
- 기본뷰는 2열 * 2열 구조 [필드명 - 필드값]
- 상세뷰는 4열 구조 [순번 - 필드명 - 필드값 - 유효성]

## 버튼

### [Button]
- 기본 버튼 컴포넌트 (variant: default, secondary, destructive, outline, ghost, link)
- 사이즈 및 아이콘 지원

### [CrudButton]
- CRUD 작업 전용 버튼 (action: create, read, update, delete, save, cancel)
- 아이콘과 색상이 액션별로 자동 설정

## 입력 컴포넌트 [simple-input]

### [SimpleTextInput]
- 기본 텍스트 입력 필드
- 유효성 검사 및 에러 표시 지원

### [SimpleDropdown]
- 선택 박스 컴포넌트
- 옵션 리스트 및 검색 기능 지원

### [SimpleDatePicker]
- 날짜/시간 선택 컴포넌트  
- UTC 모드 및 다양한 포맷 지원

## 레이아웃 컴포넌트

### [Modal]
- 모달 다이얼로그 (size: sm, md, lg, xl, full)
- 확인/취소 버튼 및 커스텀 액션 지원

### [PageHeader]
- 페이지 상단 헤더 (제목, 부제목, 액션 버튼)
- breadcrumb 네비게이션 지원

### [Tabs]
- 탭 네비게이션 컴포넌트
- 동적 탭 생성 및 활성 상태 관리
- 중첩 탭 기능도 포함되어 있음

### [SectionPanel] 
- 섹션별 패널 래퍼
- 제목, 부제목, 아이콘 지원

## 검색 [AdvancedSearch]

- 검색대: AdvancedSearch + field

## 이펙트

### [Toast]
- 알림 메시지 (success, error, info, warning)
- 자동 사라짐 및 스택형 표시
