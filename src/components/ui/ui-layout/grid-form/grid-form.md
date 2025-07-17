# GridForm 기능 명세서

`GridForm`은 CSS Grid와 Flexbox를 계층적으로 조합하여 일관된 폼 레이아웃을 제공하는 Compound Component입니다. 라벨-컨텐츠 구조의 폼에서 각 레이어의 책임을 명확히 분리하여 재사용성과 접근성을 높입니다.

## 1. 아키텍처 개요

GridForm은 4개의 하위 컴포넌트로 구성된 계층적 구조를 가집니다.

```mermaid
graph TD
    subgraph "GridForm Component"
        A[GridForm<br>(Grid Container)] --> B[GridForm.Row<br>(Row Wrapper)]
        B --> C[GridForm.Label<br>(Label Column)]
        B --> D[GridForm.Content<br>(Content Column)]
        D --> E[내부 요소들<br>(Flexbox Layout)]
    end

    style A fill:#e3f2fd,stroke:#333
    style B fill:#f3e5f5,stroke:#333
    style C fill:#e8f5e9,stroke:#333
    style D fill:#fffde7,stroke:#333
    style E fill:#fce4ec,stroke:#333
```

## 2. 컴포넌트 구성

### GridForm (루트 컨테이너)
전체 폼의 CSS Grid 레이아웃을 담당하며, 라벨과 컨텐츠 컬럼의 비율과 간격을 제어합니다.

### GridForm.Row
각 필드를 하나의 행으로 묶어 라벨과 컨텐츠의 정렬 방식을 관리합니다.

### GridForm.Label  
필드의 라벨을 표시하며, 필수 표시(`*`)와 접근성 속성을 지원합니다.

### GridForm.Content
실제 입력 요소들을 포함하는 컨테이너로, 내부 요소들을 Flexbox로 배치합니다.

## 3. Props 설명

### GridForm Props

| Props       | 타입     | 기본값   | 설명                           |
|-------------|----------|----------|--------------------------------|
| labelWidth  | string   | '150px'  | 라벨 컬럼의 너비               |
| gap         | string   | '20px'   | 그리드 셀 간의 간격            |
| maxWidth    | string   | '800px'  | 폼의 최대 너비                 |
| className   | string   | -        | 추가 CSS 클래스                |

### GridForm.Row Props

| Props     | 타입                      | 기본값    | 설명                    |
|-----------|---------------------------|-----------|-------------------------|
| align     | 'start' \| 'center' \| 'end' | 'center'  | 라벨과 컨텐츠의 수직 정렬 |
| className | string                    | -         | 추가 CSS 클래스         |

### GridForm.Label Props

| Props     | 타입    | 기본값  | 설명                         |
|-----------|---------|---------|------------------------------|
| required  | boolean | false   | 필수 표시(*) 여부            |
| htmlFor   | string  | -       | 연결할 input 요소의 id       |
| className | string  | -       | 추가 CSS 클래스              |

### GridForm.Content Props

| Props     | 타입                    | 기본값    | 설명                      |
|-----------|-------------------------|-----------|---------------------------|
| direction | 'column' \| 'row'       | 'column'  | 내부 요소들의 flex 방향   |
| gap       | string                  | '12px'    | 내부 요소들 간의 간격     |
| className | string                  | -         | 추가 CSS 클래스           |

## 4. 사용 예시

### 기본 사용법

```tsx
<GridForm>
  <GridForm.Row>
    <GridForm.Label required htmlFor="title">
      제목
    </GridForm.Label>
    <GridForm.Content>
      <input 
        id="title" 
        type="text" 
        className="w-full p-2 border rounded" 
      />
    </GridForm.Content>
  </GridForm.Row>
</GridForm>
```

### 복잡한 폼 예시

```tsx
<GridForm labelWidth="120px" gap="16px">
  <GridForm.Row>
    <GridForm.Label required htmlFor="vote-title">
      투표제목
    </GridForm.Label>
    <GridForm.Content>
      <input id="vote-title" type="text" />
    </GridForm.Content>
  </GridForm.Row>
  
  <GridForm.Row align="start">
    <GridForm.Label>투표유형</GridForm.Label>
    <GridForm.Content direction="column" gap="8px">
      <div className="flex gap-4">
        <label>
          <input type="radio" name="type" value="single" />
          단일 선택
        </label>
        <label>
          <input type="radio" name="type" value="multiple" />
          복수 선택
        </label>
      </div>
      <p className="text-sm text-muted-foreground">
        투표 유형을 선택해주세요.
      </p>
    </GridForm.Content>
  </GridForm.Row>
  
  <GridForm.Row>
    <GridForm.Label htmlFor="description">
      설명
    </GridForm.Label>
    <GridForm.Content>
      <textarea 
        id="description" 
        rows={4}
        className="w-full p-2 border rounded resize-none"
      />
    </GridForm.Content>
  </GridForm.Row>
</GridForm>
```

## 5. 반응형 지원

GridForm은 작은 화면에서 스택 레이아웃으로 자동 전환됩니다:

```css
@media (max-width: 640px) {
  .grid-form-container {
    grid-template-columns: 1fr;
    gap: 8px;
  }
}
```

## 6. 접근성 기능

- **의미적 HTML**: `<label>` 요소 사용으로 스크린 리더 지원
- **키보드 네비게이션**: 논리적인 탭 순서 유지
- **ARIA 속성**: `htmlFor` 속성으로 라벨-입력 요소 연결
- **필수 표시**: 시각적 `*` 표시와 `aria-label` 제공

## 7. 장점

1. **명확한 책임 분리**: Grid는 라벨-컨텐츠 배치, Flex는 내부 요소 배치
2. **높은 재사용성**: Compound Component 패턴으로 유연한 조합 가능
3. **접근성 향상**: 의미적으로 올바른 HTML 구조
4. **반응형 대응**: 각 레이어에서 독립적인 반응형 처리
5. **개발 효율성**: 일관된 API로 빠른 폼 구현 