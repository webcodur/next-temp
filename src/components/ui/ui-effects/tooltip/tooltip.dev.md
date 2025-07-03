# Tooltip 컴포넌트 기술 문서

## 개요

`Tooltip` 컴포넌트는 Radix UI의 Tooltip 프리미티브를 기반으로 구현되었으며, Framer Motion을 활용한 애니메이션과 Portal 렌더링을 통해 강력한 사용자 경험을 제공한다. 레이아웃 제약 없이 화면 어디든 표시할 수 있으며, 다양한 시각적 변형을 지원한다.

## 핵심 의존성

- `@radix-ui/react-tooltip`: 툴팁의 핵심 로직, 접근성, 위치 계산을 담당하는 헤드리스 UI 라이브러리
- `framer-motion`: 부드러운 등장/사라짐 애니메이션을 제공하는 애니메이션 라이브러리
- `clsx` 및 `tailwind-merge` (`cn` 유틸리티): 동적 클래스 조합과 variant 스타일링 관리

## 구현 플로우

1. **Radix UI 프리미티브 활용**:
   - `TooltipProvider`, `Tooltip`, `TooltipTrigger`, `TooltipPortal`, `TooltipContent`를 Radix UI에서 가져와 기본 구조를 구성한다.
   - 각 프리미티브는 특정 역할을 담당하여 모듈화된 구조를 제공한다.

2. **Portal 기반 렌더링**:
   - `TooltipPortal`을 사용하여 툴팁을 DOM 트리의 최상위 또는 지정된 컨테이너에 렌더링한다.
   - 이를 통해 `overflow: hidden`, `z-index` 제약, 스크롤 영역 등의 레이아웃 문제를 해결한다.

3. **Framer Motion 애니메이션**:
   - `TooltipContent` 내부에서 `motion.div`를 사용하여 애니메이션을 구현한다.
   - `initial`, `animate`, `exit` 상태를 정의하여 opacity와 scale 변화로 부드러운 전환 효과를 제공한다.
   - `asChild` prop을 통해 Radix Content와 Motion div를 연결한다.

4. **Variant 시스템**:
   - `variantClasses` 객체를 통해 `default`, `info`, `warning`, `error` 네 가지 스타일 변형을 정의한다.
   - 각 variant는 배경색과 텍스트 색상을 다르게 설정하여 용도에 맞는 시각적 구분을 제공한다.

5. **화살표 렌더링**:
   - `noArrow` prop이 false일 때 `TooltipPrimitive.Arrow`를 렌더링한다.
   - variant에 따라 화살표 색상을 동적으로 변경하여 일관된 디자인을 유지한다.

## 주요 특징

- **레이아웃 독립성**: Portal 렌더링으로 부모 컨테이너의 CSS 제약에서 자유롭다.
- **접근성 내장**: Radix UI 기반으로 ARIA 속성, 키보드 네비게이션, 화면 리더 지원이 자동으로 제공된다.
- **성능 최적화**: `React.forwardRef`를 사용하여 ref 전달을 효율적으로 처리하고, 불필요한 리렌더링을 방지한다.
- **커스터마이징**: `className`, `container`, `sideOffset` 등의 props를 통해 유연한 커스터마이징이 가능하다.
- **뉴모피즘 통합**: `neu-raised` 클래스를 적용하여 프로젝트 디자인 시스템과 일관성을 유지한다. 