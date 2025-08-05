# AdvancedSearch 기능 명세서

`AdvancedSearch`는 다양한 검색 조건을 담을 수 있는 아코디언 형태의 컨테이너 컴포넌트이다. 복잡한 검색 인터페이스를 깔끔하게 정리하고, 필요할 때만 펼쳐볼 수 있어 화면 공간을 효율적으로 사용할 수 있다.

## 1. 컴포넌트 구조

`AdvancedSearch`는 제목과 열기/닫기 상태를 표시하는 `Header`, 사용자가 직접 구성하는 검색 필드들이 들어가는 `Content`, 그리고 검색/리셋 버튼이 위치하는 `Footer`로 구성된다.

```mermaid
graph TD
    subgraph "AdvancedSearch 컴포넌트"
        direction TB
        Header["<b>Header</b><br/>- 제목(Title)<br/>- 열고 닫기 아이콘<br/>- 상태 텍스트(Status)"]
        Content["<b>Content (Children/Fields)</b><br/>사용자가 정의한<br/>다양한 검색 필드들<br/>(e.g., Input, Datepicker, Select)"]
        Footer["<b>Footer</b><br/>- 검색 버튼<br/>- 리셋 버튼"]
    end
    Header --> Content --> Footer

    style Header fill:#e3f2fd
    style Content fill:#fffde7
    style Footer fill:#e8f5e9
```

## 2. 핵심 기능

`AdvancedSearch`는 사용자 편의를 위한 여러 핵심 기능을 내장하고 있다.

```mermaid
graph LR
    subgraph "주요 기능"
        F1["<B>아코디언 UI</B><br/>클릭으로 검색 영역<br/>열고 닫기"]
        F2["<B>반응형 그리드</B><br/>화면 크기에 맞춰<br/>검색 필드 자동 정렬"]
        F3["<B>버튼 통합</B><br/>검색/리셋 버튼 기본 제공"]
        F4["<B>상태 표시</B><br/>'총 150개 결과' 등<br/>상태 텍스트 표시 가능"]
    end
```

## 3. 상호작용 흐름

사용자가 검색 필드를 채우고 버튼을 클릭하면, `AdvancedSearch`는 외부로 정의된 `onSearch` 또는 `onReset` 함수를 호출한다. 컴포넌트 자체는 상태를 관리하지 않는다.

```mermaid
sequenceDiagram
    participant User
    participant AdvSearch as AdvancedSearch
    participant Parent as 상위 컴포넌트

    User->>AdvSearch: 검색 필드 입력 (e.g., 이름, 날짜)
    User->>AdvSearch: '검색' 버튼 클릭
    AdvSearch->>Parent: onSearch() 호출
    activate Parent
    Parent->>Parent: API 호출 등 검색 로직 수행
    Parent-->>AdvSearch: statusText prop 업데이트 (e.g., "검색 완료")
    deactivate Parent

    User->>AdvSearch: '리셋' 버튼 클릭
    AdvSearch->>Parent: onReset() 호출
    activate Parent
    Parent->>Parent: 검색 필드 상태 초기화
    deactivate Parent
```

## 4. 필드 구성

AdvancedSearch는 `fields` prop으로 필드 구성을 전달받아 동작한다.

```mermaid
graph TD
    subgraph "FieldConfig 구조"
        A[key: string<br/>필드 고유 식별자]
        B[label: string<br/>필드 이름]
        C[element: ReactElement<br/>실제 입력 컴포넌트]
    end

    A & B & C --> E(AdvancedSearch 컴포넌트)

    style E fill:#f1f5f9, stroke:#333
```

## 5. 사용 시나리오

- **사용자 관리 페이지**: 이름, 이메일, 역할, 가입일 등 여러 조건으로 사용자를 필터링하여 검색한다.
- **전자상거래 사이트**: 상품 카테고리, 가격 범위, 브랜드, 재고 유무 등 상세 조건으로 상품을 검색한다.
- **로그 분석 시스템**: 특정 기간, 로그 레벨(Error, Info), 출처(Source) 등으로 방대한 로그 데이터를 필터링한다.
- **예약 관리 시스템**: 예약자 이름, 예약 날짜, 객실 타입, 상태(확정, 취소) 등 다양한 조건으로 예약을 조회한다.

## 6. Props 인터페이스

### AdvancedSearchProps
```typescript
interface AdvancedSearchProps {
  title?: string;                    // 제목 (기본: 'Advanced Search')
  fields: FieldConfig[];             // 필드 구성 (필수)
  onSearch?: () => void;             // 검색 버튼 클릭 핸들러
  onReset?: () => void;              // 리셋 버튼 클릭 핸들러
  defaultOpen?: boolean;             // 기본 열림 상태 (기본: true)
  showButtons?: boolean;             // 버튼 표시 여부 (기본: true)
  statusText?: string;               // 헤더 상태 텍스트
}

interface FieldConfig {
  key: string;                       // 필드 고유 식별자
  label: string;                     // 필드 이름
  element: ReactElement;             // 입력 컴포넌트
}
```
