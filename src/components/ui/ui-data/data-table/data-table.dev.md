# DataTable 기술 명세

이 문서는 `DataTable` 컴포넌트의 내부 아키텍처와 핵심 로직을 설명하여 개발자가 컴포넌트를 깊이 이해하고 확장할 수 있도록 돕습니다.

## 1. 컴포넌트 아키텍처

`DataTable`은 **Container-Presentational 패턴**과 **커스텀 훅**을 활용하여 관심사를 분리합니다.

- **Container (`DataTable.tsx`)**: 데이터와 상태 로직을 조합하여 하위 컴포넌트에 전달하는 역할을 합니다.
- **Hooks (`usePaginationState`, `usePaginationData`)**: 상태 관리와 데이터 계산 로직을 캡슐화합니다.
- **Presentational (`SmartTable`, `Pagination`)**: 전달받은 데이터를 순수하게 UI로 렌더링하는 데 집중합니다.

```mermaid
graph TD
    subgraph "Container"
        A(DataTable.tsx)
    end

    subgraph "Hooks"
        B(usePaginationState)
        C(usePaginationData)
    end

    subgraph "Presentational Components"
        D(SmartTable.tsx)
        E(Pagination.tsx)
    end

    A -- "페이지 상태 관리" --> B
    A -- "페이지 데이터 계산" --> C

    B -- "페이지 상태/핸들러" --> A
    C -- "분할된 데이터/페이지 정보" --> A

    A -- "최종 데이터/Props" --> D
    A -- "최종 데이터/Props" --> E

    style B fill:#e6f3ff,stroke:#333,stroke-width:2px
    style C fill:#e6f3ff,stroke:#333,stroke-width:2px
```

## 2. 페이지 변경 시퀀스 다이어그램 (외부 제어 모드)

사용자가 페이지 번호를 클릭했을 때, 서버사이드 페이지네이션을 사용하는 경우의 내부 동작 순서는 다음과 같습니다.

```mermaid
sequenceDiagram
    actor User
    participant P as Pagination
    participant DT as DataTable
    participant App as 외부 애플리케이션
    participant Server

    User->>P: 페이지 3번 클릭
    P->>DT: onPageChange(3) 호출
    DT->>App: onPageChange(3) 실행 (props로 받은 핸들러)
    App->>App: currentPage 상태를 3으로 업데이트
    App->>Server: 3페이지 데이터 요청
    Server-->>App: 3페이지 데이터 응답
    App->>App: data 상태 업데이트, isFetching=false
    App->>DT: 새 props 전달 (data, currentPage, isFetching)
    DT->>DT: 리렌더링 발생
    DT-->>User: 3페이지 데이터 테이블과 UI 표시
```

## 3. 핵심 훅 로직 플로우차트

### 3.1. `usePaginationState` 로직

페이지 상태(현재 페이지, 페이지 크기)와 핸들러를 결정합니다. 외부에서 제어할 수 있는 '제어 컴포넌트' 패턴을 따릅니다.

```mermaid
flowchart TD
    subgraph "Hook 입력"
        A[외부 Props: currentPage, pageSize, onPageChange 등]
        B[내부 State: internalCurrentPage, internalPageSize]
    end

    subgraph "로직"
        C{"externalCurrentPage 존재?"}
        D{"externalPageSize 존재?"}
        E{"externalOnPageChange 존재?"}
    end

    subgraph "Hook 출력"
        F[최종 currentPage]
        G[최종 pageSize]
        H[최종 onPageChange]
    end

    A --> C & D & E

    C -- "Yes" --> C1[currentPage = externalCurrentPage] --> F
    C -- "No" --> C2[currentPage = internalCurrentPage] --> F

    D -- "Yes" --> D1[pageSize = externalPageSize] --> G
    D -- "No" --> D2[pageSize = internalPageSize] --> G

    E -- "Yes" --> E1[onPageChange = externalOnPageChange] --> H
    E -- "No" --> E2[onPageChange = setInternalCurrentPage] --> H
```

### 3.2. `usePaginationData` 로직

전체 데이터 배열을 받아 현재 페이지에 해당하는 부분만 잘라내고, 총 페이지 수를 계산합니다.

```mermaid
flowchart TD
    subgraph "Hook 입력"
        I[전체 데이터 배열]
        J[현재 페이지, 페이지 크기]
        K[isFetching 플래그]
    end

    subgraph "로직"
        L{"isFetching 또는 데이터가 null/undefined 인가?"}
        M[총 아이템 수 계산]
        N[총 페이지 수 계산]
        O[현재 페이지 데이터 슬라이싱]
    end

    subgraph "Hook 출력"
        P[분할된 데이터]
        Q[총 페이지 수]
        R[로딩 상태]
    end

    I & K --> L
    L -- "Yes" --> L1[실제 데이터 = 빈 배열] --> M
    L -- "No" --> L2[실제 데이터 = 전체 데이터] --> M
    M & J --> N --> Q
    M & J --> O --> P
    L --> R
```
