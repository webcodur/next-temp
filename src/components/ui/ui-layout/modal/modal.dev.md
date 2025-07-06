# Modal 기술 명세

이 문서는 `Modal` 컴포넌트의 내부 동작 원리, 특히 부수 효과(Side Effect) 관리와 렌더링 방식을 다이어그램 중심으로 설명합니다.

## 1. 부수 효과(Side Effect) 관리

`Modal` 컴포넌트는 `useEffect` 훅을 사용하여 `isOpen` 상태에 따라 다음과 같은 부수 효과를 관리합니다.

```mermaid
graph TD
    A[isOpen 상태 변경] --> B{isOpen === true?};

    subgraph "True일 때 (모달 열림)"
        C[ESC 키 이벤트 리스너 추가]
        D[body 스크롤 비활성화 (overflow: hidden)]
    end

    subgraph "False일 때 (모달 닫힘) / 언마운트 시"
        E[ESC 키 이벤트 리스너 제거]
        F[body 스크롤 활성화 (overflow: unset)]
    end

    B -- "Yes" --> C & D;
    B -- "No" --> E & F;

    C -- "Cleanup 함수" --> E;
    D -- "Cleanup 함수" --> F;
```

- **ESC 키 핸들러**: `isOpen`이 `true`일 때 `document`에 키다운 이벤트 리스너를 추가하고, `false`가 되거나 컴포넌트가 언마운트될 때(cleanup 함수) 해당 리스너를 제거하여 메모리 누수를 방지합니다.
- **Body 스크롤 제어**: `isOpen` 상태에 따라 `document.body.style.overflow` 속성을 직접 조작합니다. 컴포넌트가 사라질 때 항상 `overflow`를 `unset`으로 되돌려놓는 것을 보장합니다.

## 2. 렌더링 로직 (React Portal)

`Modal`은 `React Portal`을 사용하여 컴포넌트가 실제 선언된 위치와 상관없이 DOM 트리의 최상위(`document.body`)에 렌더링됩니다. 이는 z-index와 같은 스타일링 충돌을 원천적으로 방지합니다.

```mermaid
flowchart TD
    Start --> A{isOpen === false?};
    A -- "Yes" --> B[null 반환 (아무것도 렌더링하지 않음)];
    A -- "No" --> C{typeof window === 'undefined'? (서버사이드?)};
    C -- "Yes" --> B;
    C -- "No" --> D[createPortal(모달_콘텐츠, document.body)];
    D --> End[모달 UI 렌더링];
    B --> End;
```

- 컴포넌트는 클라이언트 사이드에서만 포털을 생성하여 서버사이드 렌더링(SSR) 환경에서의 오류를 방지합니다.

## 3. 배경(Backdrop) 클릭 핸들러

`closeOnBackdropClick` prop이 `true`일 때, 사용자가 배경 영역을 클릭하면 모달이 닫힙니다. 이는 이벤트 버블링을 이용한 간단한 트릭으로 구현됩니다.

```mermaid
graph LR
    subgraph "클릭 이벤트 발생"
        A[모달 콘텐츠 영역 클릭]
        B[배경(Backdrop) 영역 클릭]
    end

    subgraph "handleBackdropClick 함수"
        C{e.target === e.currentTarget?}
    end

    D[onClose() 호출]
    E[아무것도 하지 않음]

    A -- "버블링으로 이벤트 전파" --> C
    B -- "이벤트 직접 발생" --> C

    C -- "Yes (배경 클릭)" --> D
    C -- "No (콘텐츠 클릭)" --> E

    style D fill:#fef9e7
```

- `onClick` 이벤트는 가장 안쪽 엘리먼트(`e.target`)에서 시작하여 상위로 전파됩니다.
- 배경(Backdrop) div에 걸린 `onClick` 핸들러에서 `e.target`(최초 클릭 대상)과 `e.currentTarget`(이벤트 핸들러가 걸린 대상)이 동일한 경우에만 `onClose`를 호출합니다.
- 만약 사용자가 모달 콘텐츠 내부를 클릭하면, `e.target`은 콘텐츠 내부의 엘리먼트가 되므로 `e.target !== e.currentTarget`이 되어 `onClose`가 호출되지 않습니다.
