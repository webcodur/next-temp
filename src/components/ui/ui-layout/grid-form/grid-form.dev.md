# GridForm 기술 명세

이 문서는 `GridForm` 컴포넌트의 내부 구현과 Compound Component 패턴의 작동 방식을 다이어그램 중심으로 설명합니다.

## 1. Compound Component 구조

`GridForm`은 `Object.assign`을 사용하여 하위 컴포넌트들을 메인 컴포넌트에 연결하는 Compound Component 패턴을 사용합니다.

```mermaid
graph TD
    subgraph "Compound Component 구조"
        A[GridForm 메인 컴포넌트] --> B[Object.assign]
        B --> C[GridForm.Row]
        B --> D[GridForm.Label] 
        B --> E[GridForm.Content]
    end

    subgraph "export"
        F[CompoundGridForm]
    end

    B --> F

    style A fill:#e3f2fd,stroke:#333
    style C fill:#f3e5f5,stroke:#333
    style D fill:#e8f5e9,stroke:#333
    style E fill:#fffde7,stroke:#333
    style F fill:#ffebee,stroke:#333
```

## 2. CSS Grid 레이아웃 생성 과정

GridForm 컴포넌트는 props를 기반으로 동적 CSS Grid 스타일을 생성합니다.

```mermaid
flowchart TD
    Start[GridForm 렌더링] --> A{props 수집}
    A --> B[labelWidth: '150px']
    A --> C[gap: '20px']
    A --> D[maxWidth: '800px']
    
    B --> E[gridTemplateColumns: 'labelWidth 1fr']
    C --> F[gap: 'gap']
    D --> G[maxWidth: 'maxWidth']
    
    E --> H[CSS Grid 스타일 적용]
    F --> H
    G --> H
    
    H --> I[2컬럼 그리드 레이아웃 생성]
    
    style A fill:#e3f2fd
    style H fill:#fffde7
    style I fill:#e8f5e9
```

## 3. Row 컴포넌트의 자식 처리 로직

`GridForm.Row`는 `React.Children.map`을 사용하여 자식 컴포넌트의 타입에 따라 다른 클래스를 적용합니다.

```mermaid
flowchart TD
    Start[Row 컴포넌트 렌더링] --> A[React.Children.map 실행]
    A --> B{자식 컴포넌트 타입 확인}
    
    B --> C[GridFormLabel 타입]
    B --> D[GridFormContent 타입]
    B --> E[기타 타입]
    
    C --> F[justify-self-start + align 클래스 적용]
    D --> G[justify-self-stretch + align 클래스 적용]
    E --> H[원본 그대로 반환]
    
    F --> I[수정된 컴포넌트 반환]
    G --> I
    H --> I
    
    I --> End[최종 렌더링]
    
    style B fill:#fff3e0
    style F fill:#e8f5e9
    style G fill:#fffde7
    style H fill:#f3e5f5
```

## 4. 스타일 계층 구조

GridForm의 스타일링은 3단계 레이어로 구성됩니다.

```mermaid
graph TD
    subgraph "레이어 1: Grid Container"
        A[GridForm 컨테이너]
        A1[max-width 제한]
        A2[grid-template-columns 설정]
        A3[gap 설정]
    end
    
    subgraph "레이어 2: Grid Items"
        B[GridForm.Label]
        B1[justify-self-start]
        B2[align-items 설정]
        
        C[GridForm.Content]
        C1[justify-self-stretch]
        C2[align-items 설정]
    end
    
    subgraph "레이어 3: Flex Container"
        D[Content 내부]
        D1[flex-direction 설정]
        D2[gap 설정]
        D3[flex-wrap 적용]
    end
    
    A --> B
    A --> C
    C --> D
    
    style A fill:#e3f2fd,stroke:#333
    style B fill:#e8f5e9,stroke:#333
    style C fill:#fffde7,stroke:#333
    style D fill:#fce4ec,stroke:#333
```

## 5. Props 처리 및 기본값 적용

각 컴포넌트는 destructuring과 기본값을 사용하여 props를 처리합니다.

```mermaid
sequenceDiagram
    participant User
    participant GridForm
    participant Row
    participant Label
    participant Content
    
    User->>GridForm: Props 전달
    activate GridForm
    GridForm->>GridForm: 기본값 적용<br/>(labelWidth: '150px', gap: '20px', maxWidth: '800px')
    GridForm->>GridForm: CSS Grid 스타일 생성
    GridForm-->>Row: children 전달
    deactivate GridForm
    
    activate Row
    Row->>Row: align 기본값 적용 ('center')
    Row->>Label: 클래스 확장 (justify-self-start + align)
    Row->>Content: 클래스 확장 (justify-self-stretch + align)
    deactivate Row
    
    activate Label
    Label->>Label: required 기본값 적용 (false)
    Label->>Label: 필수 표시 (*) 조건부 렌더링
    deactivate Label
    
    activate Content
    Content->>Content: direction 기본값 적용 ('column')
    Content->>Content: gap 기본값 적용 ('12px')
    Content->>Content: Flexbox 스타일 생성
    deactivate Content
```

## 6. 타입 안전성

TypeScript 인터페이스를 통해 각 컴포넌트의 props 타입을 엄격하게 정의합니다.

```typescript
// 계층적 인터페이스 구조
interface GridFormProps {
  labelWidth?: string;    // CSS 값
  gap?: string;          // CSS 값  
  maxWidth?: string;     // CSS 값
  className?: string;    // CSS 클래스
  children: React.ReactNode;  // 필수
}

interface GridFormRowProps {
  align?: 'start' | 'center' | 'end';  // 제한된 값
  className?: string;
  children: React.ReactNode;  // 필수
}
```

이 구조는 컴파일 시점에 타입 오류를 방지하고 IDE에서 자동완성을 지원합니다. 