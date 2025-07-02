# Button 컴포넌트 기술 문서

## 개요

`Button` 컴포넌트는 프로젝트 전반에서 일관된 스타일과 동작을 제공하는 것을 목표로 한다. `class-variance-authority` (CVA)를 사용하여 다양한 시각적 변형(variant)을 체계적으로 관리하고, Radix UI의 `Slot`을 활용하여 유연성을 극대화했다.

## 핵심 의존성

- `react`: 컴포넌트 구현의 기반.
- `class-variance-authority`: 버튼의 `variant`, `size` 등 다양한 스타일 변형을 손쉽게 관리하기 위한 라이브러리. 이를 통해 코드의 재사용성과 유지보수성을 높인다.
- `@radix-ui/react-slot`: `asChild` prop을 구현하기 위해 사용. 이를 통해 버튼의 스타일은 유지하면서 렌더링되는 실제 엘리먼트를 다른 컴포넌트(예: `<a>` 태그)로 대체할 수 있다.
- `clsx` 및 `tailwind-merge` (`cn` 유틸리티): Tailwind CSS 클래스를 동적으로 조합하고 관리한다.

## 구현 플로우

1.  **스타일 변형 정의 (`buttonVariants`)**:
    - CVA의 `cva` 함수를 호출하여 버튼의 기본 스타일과 변형 스타일을 정의한다.
    - **기본 스타일**: 모든 버튼에 공통적으로 적용되는 스타일 (e.g., `inline-flex`, `items-center`, `font-multilang`, 뉴모피즘 효과 등).
    - **변형 (Variants)**:
        - `variant`: `default`, `destructive`, `outline`, `ghost` 등 버튼의 주된 시각적 스타일을 정의한다. 각 variant는 배경색, 글자색, 뉴모피즘 효과(`neu-raised`, `neu-flat`) 등을 조합하여 만들어진다.
        - `size`: `default`, `sm`, `lg`, `icon` 등 버튼의 크기를 결정하는 스타일을 정의한다.
    - **기본값 (Default Variants)**: `variant`나 `size` prop이 명시되지 않았을 때 적용될 기본값을 설정한다.

2.  **컴포넌트 구현 (`Button`)**:
    - `React.forwardRef`를 사용하여 `ref`를 DOM 엘리먼트로 전달할 수 있도록 한다.
    - **`asChild` Prop 처리**: `asChild` prop이 `true`이면, `Comp`를 `Slot`으로 설정한다. `Slot` 컴포넌트는 자신의 props를 자식 엘리먼트에 병합하여 전달한다. `false`이면 `Comp`는 일반적인 `'button'` 태그가 된다.
    - **클래스 병합**: `cn` 유틸리티를 사용하여 `buttonVariants`로부터 생성된 클래스 문자열과 사용자가 `className`으로 전달한 추가 클래스를 안전하게 병합한다.
    - **Props 전달**: 나머지 모든 props (`...props`)는 `Comp` 엘리먼트에 그대로 전달된다.

## 주요 특징

- **CVA 기반 스타일 관리**: 버튼의 종류가 추가되거나 수정될 때, `buttonVariants` 객체만 수정하면 되므로 관리가 매우 용이하다.
- **`asChild`를 통한 유연성**: 버튼 스타일을 재사용하여 링크(`<a>`)나 다른 인터랙티브 컴포넌트를 렌더링할 수 있다. 예를 들어 Next.js의 `<Link>` 컴포넌트와 결합할 때 유용하다.
- **뉴모피즘 적용**: `neu-raised`, `neu-flat`, `neu-inset` 등 프로젝트의 디자인 시스템에 정의된 뉴모피즘 클래스를 적극 활용하여 디자인 일관성을 유지한다. `hover:scale-[1.02]` 와 같은 미세한 인터랙션도 포함되어 있다. 