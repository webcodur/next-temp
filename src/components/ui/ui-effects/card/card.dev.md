# Card 기술 명세서

이 문서는 여러 개의 하위 컴포넌트를 조합하여 만드는 `Card` 컴포넌트의 내부 아키텍처와 동적 스타일링 메커니즘을 설명합니다.

## 1. 아키텍처: 컴포넌트 컴포지션과 스타일 주입

`Card`와 그 하위 컴포넌트들은 각각 의미에 맞는 HTML 태그(`div`, `h3`, `p` 등)를 기반으로, `React.forwardRef`와 `cn` 유틸리티를 통해 스타일과 유연성을 더하는 방식으로 구현됩니다.

```mermaid
graph TD
    subgraph "기본 HTML 태그"
        A[div]
        B[h3]
        C[p]
    end

    subgraph "React.forwardRef (ref 전달 기능 추가)"
        D[forwardRef(div)]
        E[forwardRef(h3)]
        F[forwardRef(p)]
    end

    subgraph "cn() (스타일 클래스 주입)"
        G["cn('neu-flat rounded-lg...', props.className)"]
        H["cn('font-semibold...', props.className)"]
        I["cn('text-sm text-muted-foreground', props.className)"]
    end

    subgraph "최종 컴포넌트"
        J[Card]
        K[CardTitle]
        L[CardDescription]
    end

    A --> D --> G --> J
    B --> E --> H --> K
    C --> F --> I --> L
```

이러한 구조는 각 컴포넌트가 명확한 단일 책임(시맨틱 마크업, 스타일링, `ref` 전달)을 갖게 하여 코드의 가독성과 유지보수성을 높입니다.

## 2. 조건부 스타일링 로직 (`Card` 컴포넌트)

`Card` 컴포넌트는 `variant`와 `hoverEffect` prop의 값에 따라 `cn` 함수 내부에서 조건부로 클래스를 추가하여 최종 스타일을 결정합니다.

```mermaid
flowchart TD
    A[variant, hoverEffect Props] --> B{cn() 함수 호출};
    B --> C["기본 클래스 적용<br/>'neu-flat', 'rounded-lg'..."];
    B --> D{variant === 'elevated' ?};
    D -- Yes --> E["'neu-raised' 클래스 추가"];
    B --> F{variant === 'outline-solid' ?};
    F -- Yes --> G["'border-2' 클래스 추가"];
    B --> H{hoverEffect === true ?};
    H -- Yes --> I["'neu-hover' 클래스 추가"];

    subgraph "최종 결과"
        J[조합된 클래스가 적용된 div 렌더링]
    end

    C & E & G & I --> J
```

## 3. `CardActions`의 절대 위치 지정

`CardActions` 컴포넌트는 부모인 `Card` 컴포넌트에 `relative` 클래스가 적용되어 있다는 전제 하에, `absolute` 포지셔닝을 사용하여 우상단에 배치됩니다.

```mermaid
graph TD
    subgraph "Card (position: relative)"
        A["CardActions<br/>(position: absolute, top-4, right-4)"]
    end

    style A fill:#e3f2fd, stroke:#333
    note right of A
        <b>Card</b> 컴포넌트에
        <b>relative</b> 클래스를
        반드시 추가해야 합니다.
    end note
```

이 방식은 `CardActions`의 위치를 카드 내용의 길이에 상관없이 항상 일관된 위치에 고정시켜 줍니다.

## 4. `forwardRef`의 역할

모든 `Card` 관련 컴포넌트는 `React.forwardRef`를 사용하여 구현되었습니다. 이는 `Card` 컴포넌트 자체 또는 그 하위 요소들에 직접 `ref`를 연결할 수 있게 하여, 다음과 같은 상황에서 높은 유연성을 제공합니다.

- 특정 카드 영역으로 스크롤을 이동시킬 때
- 카드에 애니메이션 효과(`Framer Motion`)를 적용할 때
- 카드에 툴팁(`Tippy.js`)을 붙일 때
