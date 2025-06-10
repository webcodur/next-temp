# UI 컴포넌트 구현 아이디어 문서

## 개요

- 이 문서는 프로젝트에서 구현할 20개의 UI 컴포넌트에 대한 상세 설명과 구현 계획을 담고 있다.
- 각 UI 모듈을 하나씩 요청받고 작업하게 될 거야. 작업을 마친 항목 옆에는 체크표시 이모지를 부착한다
- 그리고 각각의 페이지 경로에 해당 UI모듈을 활용한 실제 페이지 예시까지 만들도록
- 뉴모피즘 디자인 반영할 것.

## 카테고리별 컴포넌트

### 1. Card

- **컴포넌트 경로**: `src/components/ui/card/card.tsx`
- **페이지 경로**: `src/app/lab/ui-check/card/page.tsx`
- **기능**: 다양한 레이아웃, 호버 효과, 액션 버튼
- **구현 방식**: 자체 구현 + Tailwind
- **활용 라이브러리**: Tailwind, React
- **예상 사용 사례**: 대시보드, 목록 표시, 상품 정보 표시

### 2. Tooltip

- **컴포넌트 경로**: `src/components/ui/tooltip/tooltip.tsx`
- **페이지 경로**: `src/app/lab/ui-check/tooltip/page.tsx`
- **기능**: 위치 자동 조정, 지연 표시
- **구현 방식**: `@radix-ui/react-tooltip` 활용
- **활용 라이브러리**: Radix UI, Framer Motion
- **예상 사용 사례**: 추가 정보 제공, 기능 힌트

### 3. Toast

- **컴포넌트 경로**: `src/components/ui/toast/toast-provider.tsx`
- **페이지 경로**: `src/app/lab/ui-check/toast/page.tsx`
- **기능**: 성공, 에러, 경고 메시지 알림
- **구현 방식**: `sonner` 라이브러리 활용
- **활용 라이브러리**: Sonner, React
- **예상 사용 사례**: 작업 완료 알림, 오류 메시지

### 4. Modal

- **컴포넌트 경로**: `src/components/ui/modal/modal.tsx`
- **페이지 경로**: `src/app/lab/ui-check/modal/page.tsx`
- **기능**: 확인창, 커스텀 폼 지원, 애니메이션
- **구현 방식**: 자체 구현 + `framer-motion`으로 애니메이션
- **활용 라이브러리**: Framer Motion, React
- **예상 사용 사례**: 확인 대화상자, 상세 정보 표시, 입력 폼

### 6. Select ✅

- **컴포넌트 경로**: `src/components/ui/select/select.tsx`
- **페이지 경로**: `src/app/lab/ui-check/select/page.tsx`
- **기능**: 다중 선택, 검색 필터링, 가상화, 미리보기에 하나만 뜰 경우 enter 시 바로 선택되도록
- **구현 방식**: 자체 구현 + Tailwind
- **활용 라이브러리**: Tailwind, React
- **예상 사용 사례**: 옵션 선택, 필터링, 분류 선택

### 7. Datepicker

- **컴포넌트 경로**: `src/components/ui/datepicker/datepicker.tsx`
- **페이지 경로**: `src/app/lab/ui-check/datepicker/page.tsx`
- **기능**: 날짜/기간 선택, 달력 표시, 날짜 범위 선택
- **구현 방식**: 자체 구현 + date-fns
- **활용 라이브러리**: date-fns, React
- **예상 사용 사례**: 날짜 입력, 일정 설정, 기간 선택

### 11. Editor

- **컴포넌트 경로**: `src/components/ui/editor/markdown-editor.tsx`
- **페이지 경로**: `src/app/lab/ui-check/editor/page.tsx`
- **기능**: 기본 서식, 미리보기, 이미지 삽입
- **구현 방식**: 간단한 마크다운 에디터 구현
- **활용 라이브러리**: React, Tailwind
- **예상 사용 사례**: 게시물 작성, 문서 편집

### 12. Tabs

- **컴포넌트 경로**: `src/components/ui/tabs/tabs.tsx`
- **페이지 경로**: `src/app/lab/ui-check/tabs/page.tsx`
- **기능**: 접근성 고려, 반응형 디자인
- **구현 방식**: Radix UI 스타일로 자체 구현
- **활용 라이브러리**: React, Tailwind
- **예상 사용 사례**: 콘텐츠 분리, 페이지 분할

### 13. Pagination

- **컴포넌트 경로**: `src/components/ui/pagination/pagination.tsx`
- **페이지 경로**: `src/app/lab/ui-check/pagination/page.tsx`
- **기능**: 페이지 이동, 크기 조절, 경계 처리
- **구현 방식**: 자체 구현
- **활용 라이브러리**: React, Tailwind
- **예상 사용 사례**: 목록 페이지 이동, 테이블 페이징

### 14. 스탭퍼

- **컴포넌트 경로**: `src/components/ui/stepper/stepper.tsx`
- **페이지 경로**: `src/app/lab/ui-check/stepper/page.tsx`
- **기능**: 진행 상태 표시, 단계 이동 제어
- **구현 방식**: 자체 구현
- **활용 라이브러리**: React, Tailwind
- **예상 사용 사례**: 가입 절차, 주문 과정, 설정 마법사

### 15. InfiniteScroll

- **컴포넌트 경로**: `src/components/ui/infinite-scroll/infinite-scroll.tsx`
- **페이지 경로**: `src/app/lab/ui-check/infinite-scroll/page.tsx`
- **기능**: 데이터 증분 로딩, 로딩 표시기
- **구현 방식**: Intersection Observer API + React Hook
- **활용 라이브러리**: React, Tailwind
- **예상 사용 사례**: 피드 스크롤, 대용량 데이터 표시

### 16. Table

- **컴포넌트 경로**: `src/components/ui/table/table.tsx`
- **페이지 경로**: `src/app/lab/ui-check/table/page.tsx`
- **기능**: 데이터 테이블 표시, 컬럼 정렬, 커스텀 셀 렌더링
- **구현 방식**: 자체 구현 + Tailwind
- **활용 라이브러리**: React, Tailwind
- **예상 사용 사례**: 데이터 목록 표시, 현황 조회, 관리 인터페이스

### 18. Timeline

- **컴포넌트 경로**: `src/components/ui/timeline/timeline.tsx`
- **페이지 경로**: `src/app/lab/ui-check/timeline/page.tsx`
- **기능**: 수직/수평 레이아웃, 반응형
- **구현 방식**: 자체 구현 + Tailwind
- **활용 라이브러리**: React, Tailwind
- **예상 사용 사례**: 이벤트 표시, 작업 이력, 프로세스 표시

### 21. Carousel

- **컴포넌트 경로**: `src/components/ui/carousel/carousel.tsx`
- **페이지 경로**: `src/app/lab/ui-check/carousel/page.tsx`
- **기능**: 무한 스크롤, 자동 슬라이드, 썸네일
- **구현 방식**: `framer-motion` 활용
- **활용 라이브러리**: Framer Motion, React
- **예상 사용 사례**: 이미지 갤러리, 상품 회전 보기

### 22. DragAndDrop

- **컴포넌트 경로**: `src/components/ui/dnd/sortable-list.tsx`
- **페이지 경로**: `src/app/lab/ui-check/drag-and-drop/page.tsx`
- **기능**: 목록 정렬, 파일 업로드 지원
- **구현 방식**: 전용 라이브러리 설치하여 작업
- **활용 라이브러리**: Framer Motion, React
- **예상 사용 사례**: 목록 재정렬, 구성 요소 배치

### 23. SearchFilter

- **컴포넌트 경로**: `외부UI/SearchFilterComponents.tsx`
- **페이지 경로**: `src/app/lab/ui-check/search-filter/page.tsx`
- **기능**: 텍스트 검색 입력, HTTP 메서드 선택, 검색/초기화 버튼
- **구현 방식**: 자체 구현 + Tailwind + lucide-react
- **활용 라이브러리**: React, Tailwind, lucide-react
- **예상 사용 사례**: API 검색 필터 UI

### 24. Barrier3D

- **컴포넌트 경로**: `src/components/ui/barrier/barrier-3d.tsx`
- **페이지 경로**: `src/app/lab/ui-check/barrier-3d/page.tsx`
- **기능**: 3D 주차장 차단기 시각화, 애니메이션, 토글 기능
- **구현 방식**: Three.js를 활용한 3D 렌더링
- **활용 라이브러리**: React, Three.js, Tailwind
- **예상 사용 사례**: 고급 주차장 차단기 인터페이스, 시각적 표현

### 25. Tooltip

- **컴포넌트 경로**: `src/components/ui/tooltip/tooltip.tsx`
- **페이지 경로**: `src/app/lab/ui-check/tooltip/page.tsx`
- **기능**: 위치 자동 조정, 지연 표시
- **구현 방식**: `@radix-ui/react-tooltip` 활용
- **활용 라이브러리**: Radix UI, Framer Motion
- **예상 사용 사례**: 추가 정보 제공, 기능 힌트

## 구현 전략

모든 컴포넌트는 다음과 같은 구조로 설계한다:

1. **코어 컴포넌트 구현**

   - 기본 기능 구현
   - 스타일링 (Tailwind 활용)
   - 접근성 고려

2. **상태 관리와 로직 분리**

   - 복잡한 상태는 Jotai 활용
   - 재사용 가능한 Hook 분리

3. **테스트 작성**

   - 기본 기능 테스트
   - 에지 케이스 테스트
   - 접근성 테스트

4. **문서화**
   - 사용 예제
   - Props API 문서화
   - 예시 코드
