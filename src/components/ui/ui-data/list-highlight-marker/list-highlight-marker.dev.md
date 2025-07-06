# ListHighlightMarker 기술 명세

이 문서는 `ListHighlightMarker` 컴포넌트의 내부 로직과 상태에 따른 동적 스타일링 방식을 다이어그램 중심으로 설명합니다.

## 1. 활성 상태(`isActive`) 결정 로직

컴포넌트의 `isActive` 상태는 `isSelected` 또는 `isHighlighted` prop 중 하나라도 `true`이면 `true`로 결정됩니다. 이 상태는 대부분의 조건부 스타일링에 사용됩니다.

```mermaid
flowchart TD
    Start --> A{isSelected?};
    A -- "Yes" --> B[isActive = true];
    A -- "No" --> C{isHighlighted?};
    C -- "Yes" --> B;
    C -- "No" --> D[isActive = false];
    B --> End;
    D --> End;
```

## 2. 테두리 스타일(`getBorderClass`) 결정 플로우

호버 및 활성 상태에 적용되는 왼쪽/오른쪽 테두리 스타일은 `isActive` 상태와 `isRTL` 상태를 조합하여 결정됩니다.

```mermaid
flowchart TD
    subgraph "입력"
        A[isActive]
        B[isRTL]
    end

    subgraph "로직"
        C{isActive?}
        C -- "Yes" --> D{isRTL?}
        D -- "Yes" --> E["활성 RTL 스타일<br/>(border-r-primary)"]
        D -- "No" --> F["활성 LTR 스타일<br/>(border-l-primary)"]

        C -- "No" --> G["비활성 호버 스타일<br/>(hover:border-...)"]
    end

    subgraph "출력"
        H[적용될 CSS 클래스]
    end

    E & F & G --> H
```

## 3. 동적 아이콘 렌더링 로직

컴포넌트 우측의 아이콘은 `isActive` 상태와 CSS의 `group-hover`를 이용하여 두 아이콘(`Plus`, `Check`)의 투명도(opacity)와 크기(scale)를 조절하는 방식으로 전환됩니다.

```mermaid
graph TD
    subgraph "상태"
        A[isActive]
        B[group-hover]
    end

    subgraph "아이콘"
        C(Check 아이콘)
        D(Plus 아이콘)
    end

    A -- "true일 때 opacity:1, scale:1" --> C
    A -- "false일 때 opacity:0, scale:0.75" --> C

    A -- "false이고" --> E{ }
    B -- "hover 중일 때 opacity:1, scale:1" --> F[ ]
    E & F --> D

    style C fill:#eafaf1
    style D fill:#fef9e7
```
