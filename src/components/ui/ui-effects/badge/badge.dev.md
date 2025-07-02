# Badge 컴포넌트 기술 문서

## 개요

`Badge` 컴포넌트는 `class-variance-authority` (CVA)를 핵심 기술로 사용하여, 다양한 시각적 스타일 변형을 효율적으로 관리한다. 이를 통해 코드의 중복을 최소화하고 유지보수성을 높였다.

## 핵심 의존성

- `class-variance-authority`: 배지의 `variant`에 따른 스타일 조합을 관리하는 데 사용된다.
- `clsx` 및 `tailwind-merge` (`cn` 유틸리티): CVA가 생성한 클래스와 사용자가 제공하는 추가 클래스를 안전하게 병합한다.

## 구현 플로우

1.  **스타일 변형 정의 (`badgeVariants`)**:
    - `cva` 함수를 사용하여 배지의 공통 기본 스타일과 변형 스타일을 정의한다.
    - **기본 스타일**: `inline-flex`, `items-center`, `rounded-full`, `border`, `px-2.5`, `py-0.5`, `text-xs`, `font-semibold` 등 모든 배지에 일관되게 적용되는 스타일이다.
    - **변형 (Variants)**: `variant` prop에 따라 달라지는 스타일을 정의한다.
        - `default`: 기본 스타일로, `primary` 색상을 사용한다.
        - `secondary`: `secondary` 색상을 사용한다.
        - `destructive`: `destructive` 색상을 사용한다.
        - `outline`: 배경색 없이 테두리만 있는 스타일이다.
    - `neu-flat` 클래스를 기본적으로 적용하여 뉴모피즘 디자인 통일성을 유지한다.

2.  **컴포넌트 구현 (`Badge`)**:
    - `Badge` 함수형 컴포넌트는 `className`, `variant`, 그리고 나머지 `div` 엘리먼트 속성들을 `props`로 받는다.
    - `cn` 유틸리티를 호출하여 `badgeVariants`로부터 계산된 클래스 문자열과 `className` prop으로 받은 추가 클래스를 병합한다.
    - 최종적으로 계산된 클래스를 가진 `div` 엘리먼트를 렌더링하고, 나머지 `props`를 그대로 전달한다.

## 주요 특징

- **CVA 기반의 높은 유지보수성**: 새로운 variant를 추가하거나 기존 스타일을 수정할 때, `badgeVariants` 객체만 변경하면 되므로 관리가 매우 용이하다.
- **타입 안정성**: `VariantProps`를 사용하여 `variant` prop에 허용되는 값들을 타입스크립트로 강제하여 잘못된 사용을 방지한다.
- **스타일 확장성**: 사용자가 `className` prop을 통해 Tailwind CSS 유틸리티를 추가하여 쉽게 커스터마이징할 수 있다. 