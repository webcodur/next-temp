# Accordion 컴포넌트

접히고 펼쳐지는 콘텐츠 표시 컴포넌트입니다.

## 주요 특징

- **부드러운 애니메이션**: 펼침/접힘 효과
- **접근성**: 키보드 네비게이션 지원  
- **뉴모피즘 디자인**: primary 색상 시스템 적용
- **다국어 폰트**: MultiLang 폰트 시스템 지원

## 기본 사용법

```tsx
import { Accordion } from '@/components/ui/ui-layout/accordion/Accordion';

function MyComponent() {
  return (
    <Accordion title="제목" defaultOpen={false}>
      <p>콘텐츠 내용</p>
    </Accordion>
  );
}
```

## Props

| 속성 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `title` | `string` | `'Accordion'` | 헤더 제목 |
| `children` | `ReactNode` | - | 콘텐츠 내용 (필수) |
| `defaultOpen` | `boolean` | `false` | 기본 열림 상태 |
| `statusText` | `string` | - | 상태 텍스트 (오른쪽 표시) |
| `onToggle` | `(isOpen: boolean) => void` | - | 상태 변경 콜백 |
| `className` | `string` | `''` | 컨테이너 CSS 클래스 |
| `headerClassName` | `string` | `''` | 헤더 CSS 클래스 |
| `contentClassName` | `string` | `''` | 콘텐츠 CSS 클래스 |
| `disabled` | `boolean` | `false` | 비활성화 상태 |

## 색상 시스템

- **닫힌 상태**: `bg-serial-1` (부드러운 회색)
- **열린 상태**: `bg-primary-1` (연한 블루)  
- **호버 상태**: `bg-primary-2` (중간 블루)
- **상태 텍스트**: `text-primary-6` (진한 블루)

## 사용 예시

### 기본 사용

```tsx
<Accordion title="설정">
  <p>설정 내용이 여기에 표시됩니다.</p>
</Accordion>
```

### 상태 텍스트 포함

```tsx
<Accordion 
  title="옵션" 
  statusText="3개 항목"
  defaultOpen={true}
>
  <div>옵션 목록...</div>
</Accordion>
```

### 비활성화 상태

```tsx
<Accordion 
  title="잠긴 섹션"
  statusText="접근 불가"
  disabled={true}
>
  <p>접근할 수 없는 콘텐츠</p>
</Accordion>
```

### 그룹 사용

```tsx
<AccordionGroup>
  <Accordion title="첫 번째">콘텐츠 1</Accordion>
  <Accordion title="두 번째">콘텐츠 2</Accordion>
  <Accordion title="세 번째">콘텐츠 3</Accordion>
</AccordionGroup>
```

### 콜백 함수

```tsx
<Accordion 
  title="추적 가능한 아코디언"
  onToggle={(isOpen) => {
    console.log('아코디언 상태:', isOpen ? '열림' : '닫힘');
  }}
>
  <p>상태 변경이 추적되는 콘텐츠</p>
</Accordion>
``` 