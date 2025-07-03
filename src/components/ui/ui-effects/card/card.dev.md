# Card 컴포넌트 기술 문서

## 개요

`Card` 컴포넌트는 모듈화된 설계를 통해 유연하고 재사용 가능한 카드 UI를 제공한다. 기본 컴포넌트와 확장 컴포넌트로 구분하여 필요에 따라 선택적으로 사용할 수 있으며, 조건부 스타일링을 통해 다양한 시각적 변형을 지원한다.

## 핵심 의존성

- `react`: 컴포넌트 구현의 기반 라이브러리
- `clsx` 및 `tailwind-merge` (`cn` 유틸리티): 조건부 클래스 조합과 뉴모피즘 스타일 적용

## 구현 플로우

### 1. 기본 컴포넌트 구조

**Card (메인 컨테이너)**:
- `React.forwardRef`를 사용하여 ref 전달을 지원한다.
- `variant` prop에 따라 다른 뉴모피즘 스타일을 적용한다:
  - `default`: `neu-flat` (기본 평면 스타일)
  - `outline-solid`: `neu-flat border-2` (테두리 강조)
  - `elevated`: `neu-raised` (높은 그림자)
- `hoverEffect` prop이 true일 때 `neu-raised` 클래스를 추가하여 호버 효과를 제공한다.

**CardHeader, CardContent, CardFooter**:
- 각각 독립적인 영역을 담당하며, 일관된 패딩과 간격을 제공한다.
- `CardHeader`는 `space-y-1.5`로 제목과 설명 간의 수직 간격을 관리한다.
- `CardContent`와 `CardFooter`는 `pt-0`을 사용하여 상단 패딩을 제거해 영역 간 연결성을 유지한다.

**CardTitle, CardDescription**:
- 의미론적 HTML 요소(`h3`, `p`)를 사용하여 접근성을 향상시킨다.
- 타이포그래피 스타일을 일관되게 적용한다.

### 2. 확장 컴포넌트 구조

**CardActions, CardAction**:
- `absolute` 포지셔닝을 사용하여 카드 우상단에 액션 버튼을 배치한다.
- `CardAction`은 원형 버튼 스타일로 `neu-raised`와 `backdrop-blur-xs`를 적용한다.
- 버튼 크기는 `h-8 w-8`로 고정하여 일관된 크기를 유지한다.

**CardBadge**:
- `variant` prop을 통해 6가지 색상 변형을 제공한다.
- 각 variant는 배경색과 텍스트 색상을 조합하여 명확한 시각적 구분을 제공한다.
- `success`, `warning`, `danger` variant는 투명도(`/10`)를 사용하여 부드러운 색상 표현을 구현한다.

## 주요 특징

- **모듈화된 구조**: 각 컴포넌트가 독립적으로 작동하여 필요한 부분만 선택적으로 사용 가능하다.
- **조건부 스타일링**: `cn` 유틸리티와 조건부 표현식을 통해 동적 스타일 적용이 효율적으로 관리된다.
- **뉴모피즘 통합**: 프로젝트 디자인 시스템의 뉴모피즘 클래스를 적극 활용하여 일관된 시각적 경험을 제공한다.
- **접근성 고려**: 의미론적 HTML 요소와 `forwardRef`를 통해 스크린 리더와 키보드 네비게이션을 지원한다.
- **확장성**: 새로운 카드 요소나 variant를 쉽게 추가할 수 있는 구조로 설계되었다. 