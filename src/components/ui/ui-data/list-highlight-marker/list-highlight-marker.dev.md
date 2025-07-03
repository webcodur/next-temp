# ListHighlightMarker 컴포넌트 기술 문서

## 개요

`ListHighlightMarker` 컴포넌트는 상태 기반 시각적 피드백 시스템을 구현하여 리스트 항목의 사용자 상호작용을 향상시킨다. 다중 상태 관리와 조건부 스타일링을 통해 호버, 선택, 하이라이트 상태를 명확하게 구분하며, CSS transition과 transform을 활용한 부드러운 애니메이션을 제공한다.

## 핵심 의존성

- `lucide-react`: 시각적 피드백을 위한 아이콘 시스템 (`Check`, `Plus`)
- `clsx` 및 `tailwind-merge` (`cn` 유틸리티): 복잡한 조건부 클래스 조합 관리
- `react`: 컴포넌트 상태 관리와 이벤트 처리

## 구현 플로우

### 1. 상태 관리 시스템

**상태 우선순위**:
- `isActive = isSelected || isHighlighted`: 선택됨 또는 하이라이트됨 상태를 통합 관리한다.
- `disabled`: 모든 상호작용을 차단하는 최우선 상태이다.
- 상태 간 명확한 우선순위로 충돌을 방지한다.

**조건부 스타일링**:
- `!isActive && hover:*`: 비활성 상태에서만 호버 효과를 적용한다.
- `isActive && *`: 활성 상태에서는 지속적인 시각적 강조를 유지한다.
- `disabled && *`: 비활성화 상태에서는 모든 상호작용을 차단한다.

### 2. 애니메이션 시스템

**Transform 기반 이동**:
- `hover:translate-x-1`과 `translate-x-1`을 통해 4px 우측 이동 효과를 구현한다.
- `transition-all duration-150 ease-in-out`으로 부드러운 전환을 제공한다.

**아이콘 전환 애니메이션**:
- `Plus` 아이콘: `opacity-0 scale-75` → `opacity-100 scale-100` (호버 시)
- `Check` 아이콘: `opacity-0 scale-75 rotate-45` → `opacity-100 scale-100 rotate-0` (활성 시)
- 절대 위치(`absolute inset-0`)를 사용하여 아이콘 간 겹침 없이 전환한다.

**색상 전환**:
- 텍스트 색상: `text-muted-foreground` → `text-foreground` (활성 시)
- 테두리 색상: `border-l-primary` (호버/활성 시)
- 배경 색상: `bg-muted/50` (호버) → `bg-primary/5` (활성)

### 3. 레이아웃 구조

**Flexbox 기반 구조**:
- 순번 영역: `shrink-0 min-w-[40px]`로 고정 너비 유지
- 콘텐츠 영역: `flex-1 min-w-0`으로 유연한 크기 조정과 텍스트 오버플로우 처리
- 아이콘 영역: `w-4 h-4 shrink-0`으로 고정 크기 유지

**상대/절대 위치 조합**:
- 컨테이너: `relative`로 기준점 설정
- 아이콘들: `absolute inset-0`으로 동일한 위치에 겹쳐 배치
- 이를 통해 아이콘 전환 시 레이아웃 변화 없이 부드러운 애니메이션 구현

## 주요 특징

- **상태 기반 설계**: 명확한 상태 우선순위와 조건부 렌더링으로 예측 가능한 동작을 보장한다.
- **성능 최적화**: CSS transition과 transform만 사용하여 GPU 가속을 활용하고 리플로우를 최소화한다.
- **접근성 고려**: `pointer-events-none`과 `cursor-not-allowed`를 통해 비활성화 상태를 명확히 표시한다.
- **확장성**: props 기반 설계로 다양한 사용 사례에 쉽게 적용할 수 있다.
- **일관성**: 디자인 시스템의 색상 변수와 간격 체계를 일관되게 사용한다. 