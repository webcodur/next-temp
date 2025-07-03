# Accordion 컴포넌트

접히고 펼쳐지는 콘텐츠 표시 컴포넌트입니다.

## 주요 특징

- **애니메이션**: 부드러운 펼침/접힘 효과
- **접근성**: 키보드 네비게이션 지원  
- **유연성**: 단일/다중 열기 모드
- **커스터마이징**: 아이콘 및 스타일 변경 가능

## 기본 사용법

```tsx
import { Accordion } from '@/components/ui/ui-layout/accordion/Accordion';

function MyComponent() {
  const items = [
    {
      id: '1',
      trigger: '첫 번째 질문',
      content: '첫 번째 답변 내용입니다.'
    },
    {
      id: '2', 
      trigger: '두 번째 질문',
      content: '두 번째 답변 내용입니다.'
    }
  ];

  return <Accordion items={items} />;
}
```

## Props

| 속성 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `items` | `AccordionItem[]` | - | 아코디언 항목 목록 (필수) |
| `type` | `'single' \| 'multiple'` | `'single'` | 단일/다중 열기 모드 |
| `collapsible` | `boolean` | `true` | 열린 항목 다시 닫기 가능 |
| `defaultValue` | `string \| string[]` | - | 기본 열린 항목 |
| `className` | `string` | `''` | 추가 CSS 클래스 |

### AccordionItem 인터페이스

```tsx
interface AccordionItem {
  id: string;
  trigger: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
}
```

## 사용 예시

### 단일 열기 모드

```tsx
<Accordion 
  items={items}
  type="single"
  defaultValue="1"
/>
```

### 다중 열기 모드

```tsx
<Accordion 
  items={items}
  type="multiple"
  defaultValue={["1", "2"]}
/>
```

### 비활성화 항목

```tsx
const itemsWithDisabled = [
  { id: '1', trigger: '활성 항목', content: '내용' },
  { id: '2', trigger: '비활성 항목', content: '내용', disabled: true }
];

<Accordion items={itemsWithDisabled} />
``` 