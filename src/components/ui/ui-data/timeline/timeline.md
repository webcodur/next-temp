# Timeline 컴포넌트

`Timeline`은 시간의 흐름에 따른 일련의 이벤트, 과정, 또는 이력을 시각적으로 표현하는 컴포넌트입니다. 세로형 또는 가로형 레이아웃을 선택하여 다양한 시나리오에 적용할 수 있습니다.

## 주요 기능

- **방향 선택**: `orientation` prop을 통해 'vertical'(세로) 또는 'horizontal'(가로) 타임라인을 자유롭게 선택할 수 있습니다.
- **상태 시각화**: 각 이벤트의 `status`('completed', 'current', 'upcoming')에 따라 색상을 다르게 표시하여 진행 상태를 명확하게 전달합니다.
- **커스텀 아이콘**: 각 항목에 React 노드 타입의 `icon`을 전달하여 기본 마커 대신 의미 있는 아이콘을 표시할 수 있습니다.
- **데이터 기반 렌더링**: `items` 배열에 정의된 데이터를 기반으로 전체 타임라인을 동적으로 생성합니다.
- **RTL 지원**: 세로 모드에서 오른쪽에서 왼쪽으로 읽는 언어 환경을 자동으로 지원합니다.

## 데이터 구조

`Timeline` 컴포넌트는 `TimelineItem` 객체의 배열을 `items` prop으로 전달받습니다. 각 객체는 타임라인의 한 단계를 나타냅니다.

```mermaid
graph TD
    subgraph "TimelineProps"
        A[items: TimelineItem[]]
        B[orientation?: 'vertical' | 'horizontal']
    end

    subgraph "TimelineItem"
        C[id: string]
        D[title: string]
        E[content: string]
        F[timestamp: string]
        G[status?: 'completed' | 'current' | 'upcoming']
        H[icon?: React.ReactNode]
    end

    A --> TimelineItem

    style TimelineItem fill:#f9f9f9,stroke:#333,stroke-width:1px
```

## 사용 시나리오

- **세로 타임라인 (기본값)**: 프로젝트 진행 상황, 배송 추적, 활동 로그 등 시간 순서가 중요한 데이터를 수직으로 표시하는 데 적합합니다. 각 이벤트는 시간 순서대로 위에서 아래로 배열됩니다.

- **가로 타임라인**: 회원 가입 절차, 프로세스 단계 등 여러 단계를 간결하게 수평으로 보여줄 때 유용합니다. 이벤트는 왼쪽에서 오른쪽(RTL 환경에서는 오른쪽에서 왼쪽)으로 나열됩니다.
