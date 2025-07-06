# SmartTable 컴포넌트

`SmartTable`은 데이터를 유연하고 명확하게 표시하는 데 중점을 둔 순수 프레젠테이셔널 테이블 컴포넌트입니다. 정렬, 필터링, 페이지네이션과 같은 복잡한 상태 관리 기능은 포함하지 않으며, 오직 전달받은 데이터를 UI로 렌더링하는 역할만 수행합니다.

## 주요 기능

- **커스텀 렌더링**: `render` 또는 `cell` 콜백 함수를 통해 각 셀의 내용을 자유롭게 구성할 수 있습니다.
- **상태 시각화**: `isFetching` prop을 통해 데이터 로딩 상태를 스켈레톤 UI로 표시하며, 데이터가 없을 경우 메시지를 보여줍니다.
- **유연한 스타일링**: `className` 관련 props를 통해 테이블의 각 부분(헤더, 행, 셀)에 커스텀 클래스를 적용할 수 있습니다.
- **테마 연동**: `primaryAccent`, `primaryHeader`, `primaryHover` 등의 boolean props를 통해 디자인 시스템의 주 색상(Primary Color) 테마를 손쉽게 적용할 수 있습니다.
- **RTL 지원**: `useLocale` 훅을 통해 오른쪽에서 왼쪽으로 읽는 언어 환경을 자동으로 지원하여 텍스트 정렬을 올바르게 처리합니다.

## 데이터 및 컬럼 구조

`SmartTable`은 `data` 배열과 `columns` 배열이라는 두 가지 핵심 props를 전달받습니다.

```mermaid
graph TD
    subgraph "SmartTable Props"
        A[data: T[]]
        B[columns: SmartTableColumn<T>[]]
    end

    subgraph "SmartTableColumn<T> (컬럼 정의)"
        C[key: keyof T]
        D[header: string]
        E[width?: string]
        F[align?: 'start' | 'center' | 'end']
        G[render?: (...)]
        H[cell?: (...)]
    end

    A -- "각 행의 데이터" --> G & H
    B -- "테이블 구조 정의" --> SmartTable

    style C fill:#f0f8ff,stroke:#333
    style G fill:#e6f3ff,stroke:#333
    style H fill:#e6f3ff,stroke:#333
```

- **`data`**: 테이블에 표시될 실제 데이터 객체의 배열입니다.
- **`columns`**: 테이블의 각 컬럼을 어떻게 렌더링할지 정의하는 설정 객체의 배열입니다.
  - `key`: `data` 객체에서 어떤 값을 가져올지 지정합니다.
  - `header`: 컬럼 헤더에 표시될 텍스트입니다.
  - `render` / `cell`: 해당 셀의 내용을 커스텀 JSX로 렌더링하기 위한 함수입니다. `cell`이 `render`보다 우선 순위가 높습니다.

## 사용 시나리오

`SmartTable`은 `DataTable`과 같은 상위 컴포넌트 내부에서 데이터의 시각적 표현을 담당하거나, 페이지네이션이나 정렬이 필요 없는 간단한 데이터 목록을 표시하는 데 직접 사용될 수 있습니다. 복잡한 상태 관리는 상위 컴포넌트나 커스텀 훅에 위임하여 역할과 책임을 명확히 분리하는 것을 권장합니다.
