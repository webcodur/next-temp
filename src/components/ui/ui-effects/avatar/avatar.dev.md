# Avatar 컴포넌트 기술 문서

## 개요

`Avatar` 컴포넌트는 Radix UI의 `Avatar` 프리미티브를 기반으로 구현되었다. Radix UI가 제공하는 강력한 기능과 접근성을 그대로 활용하면서, 프로젝트의 디자인 시스템에 맞게 스타일을 적용하는 방식으로 제작되었다.

## 핵심 의존성

- `react`: 컴포넌트 구현의 기반 라이브러리.
- `@radix-ui/react-avatar`: 핵심 로직과 접근성을 제공하는 헤드리스 UI 라이브러리.
- `clsx` 및 `tailwind-merge` (프로젝트의 `cn` 유틸리티 함수): Tailwind CSS 클래스를 조건부로 병합하고 중복을 제거하여 동적 스타일링을 용이하게 한다.

## 구현 플로우

1.  **Radix UI 프리미티브 Import**: `@radix-ui/react-avatar`에서 `Root`, `Image`, `Fallback` 컴포넌트를 가져온다. 이들은 각각 아바타의 컨테이너, 이미지, 대체 콘텐츠 역할을 수행한다.

2.  **컴포넌트 래핑 및 스타일링**:
    - `Avatar`, `AvatarImage`, `AvatarFallback` 각 컴포넌트를 `React.forwardRef`로 래핑하여 `ref`를 하위 Radix 컴포넌트로 전달할 수 있도록 구현한다. 이는 컴포넌트의 유연성을 높여준다.
    - `cn` 유틸리티 함수를 사용해 기본 스타일과 사용자가 전달하는 `className`을 병합한다.
        - `Avatar`: `relative`, `flex`, `rounded-full` 등 컨테이너 스타일을 정의한다.
        - `AvatarImage`: `aspect-square`, `h-full`, `w-full`로 컨테이너에 꽉 차는 정사각형 이미지를 보장한다.
        - `AvatarFallback`: `flex`, `items-center`, `justify-center`로 대체 텍스트(예: 이니셜)를 중앙에 위치시킨다.

3.  **Prop 전달**: 각 컴포넌트는 `...props`를 통해 전달받은 모든 추가 속성을 그대로 하위 Radix 컴포넌트에 전달한다. 이로써 Radix `Avatar`가 지원하는 모든 API를 사용할 수 있다.

## 주요 특징

- **헤드리스 UI 활용**: 기능(Logic)은 Radix UI에 위임하고, 표현(View)에만 집중하여 코드 복잡성을 최소화했다.
- **스타일 확장성**: `className` prop을 통해 모든 컴포넌트의 스타일을 쉽게 커스터마이징할 수 있다.
- **접근성 내장**: Radix UI를 사용함으로써 키보드 네비게이션, ARIA 속성 등 웹 접근성 표준을 자동으로 준수한다. 