# Badge 기술 명세서

이 문서는 `class-variance-authority` (CVA) 라이브러리를 활용하여 구현된 `Badge` 컴포넌트의 내부 스타일링 아키텍처를 설명합니다.

## 1. 핵심 아키텍처: CVA (Class Variance Authority)

`Badge` 컴포넌트는 CVA를 사용하여 `variant` prop 값에 따라 동적으로 CSS 클래스를 조합합니다. 이 방식은 코드 중복을 최소화하고 스타일 관리를 매우 효율적으로 만듭니다.

```mermaid
flowchart TD
    subgraph "1. 정의 (badgeVariants.ts)"
        A[<b>cva() 함수</b><br/>- 기본 스타일 정의<br/>- Variant별 스타일 정의]
    end

    subgraph "2. 사용 (Badge.tsx)"
        B[Badge 컴포넌트에<br/>variant='destructive' 전달] --> C{badgeVariants({ variant: 'destructive' }) 호출};
        C --> D["기본 스타일 + destructive 스타일<br/>클래스 문자열 생성"];
    end

    subgraph "3. 최종 결과"
        E[<div class="기본클래스... destructive클래스...">]
    end

    A --> C
    D --> E
```

## 2. `badgeVariants` 객체 구조

`badgeVariants`는 `cva` 함수를 통해 생성되며, 세 부분으로 구성됩니다.

```mermaid
graph TD
    subgraph "badgeVariants"
        Base["<b>base</b><br/>'inline-flex items-center rounded-full...'<br/>(모든 배지에 공통으로 적용되는 클래스)"]
        Variants["<b>variants</b><br/>(variant 값에 따라 선택적으로 적용되는 클래스 맵)"]
        Default["<b>defaultVariants</b><br/>{ variant: 'default' }<br/>(variant prop이 없을 때 기본으로 사용될 값)"]
    end

    subgraph "variants 상세"
        V_Def["<b>default:</b> 'bg-primary text-primary-foreground...'"]
        V_Sec["<b>secondary:</b> 'bg-secondary text-secondary-foreground...'"]
        V_Des["<b>destructive:</b> 'bg-destructive text-destructive-foreground...'"]
        V_Out["<b>outline:</b> 'text-foreground'"]
    end

    Variants --> V_Def & V_Sec & V_Des & V_Out
```

## 3. `cn` 유틸리티를 이용한 클래스 병합

`Badge` 컴포넌트는 `cn` 유틸리티 함수를 사용하여 CVA가 생성한 클래스와 사용자가 직접 전달한 `className` prop을 안전하게 병합합니다.

```mermaid
graph TD
    A["CVA 생성 클래스<br/>'... bg-primary ...'"]
    B["사용자 전달 className<br/>'bg-blue-500 m-2'"]

    subgraph "cn(A, B)"
        C["<b>clsx:</b> 클래스들을 단순 결합<br/>'... bg-primary bg-blue-500 m-2'"]
        C --> D["<b>tailwind-merge:</b> 충돌하는 클래스 해결<br/>(뒤에 오는 bg-blue-500이 우선)"]
    end

    E["<b>최종 결과</b><br/>'... m-2 bg-blue-500'"]

    A & B --> C
    D --> E
```

`tailwind-merge` 덕분에 사용자가 `bg-primary`와 충돌하는 `bg-blue-500`을 전달해도, 뒤에 온 `bg-blue-500`이 우선 적용되어 예상대로 동작합니다. 이로 인해 스타일 확장이 매우 유연하고 안전해집니다.
