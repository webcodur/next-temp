# Tabs 컴포넌트

탭 기반 네비게이션과 콘텐츠 표시를 위한 컴포넌트입니다.

## 주요 특징

- **유연한 구조**: 탭 헤더와 콘텐츠 영역 분리
- **키보드 지원**: 화살표 키 네비게이션
- **접근성**: ARIA 속성 지원
- **커스터마이징**: 스타일링 옵션 제공

## 기본 사용법

```tsx
import { Tabs } from '@/components/ui/ui-layout/tabs/Tabs';

function MyComponent() {
  const tabs = [
    { id: 'tab1', label: '첫 번째', content: <div>첫 번째 내용</div> },
    { id: 'tab2', label: '두 번째', content: <div>두 번째 내용</div> },
    { id: 'tab3', label: '세 번째', content: <div>세 번째 내용</div> }
  ];

  return <Tabs tabs={tabs} defaultTab="tab1" />;
}
```

## Props

| 속성 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `tabs` | `TabItem[]` | - | 탭 목록 (필수) |
| `defaultTab` | `string` | 첫 번째 탭 | 기본 선택 탭 |
| `onTabChange` | `(tabId: string) => void` | - | 탭 변경 콜백 |
| `variant` | `'default' \| 'pills' \| 'underline'` | `'default'` | 탭 스타일 |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | 탭 크기 |
| `className` | `string` | `''` | 추가 CSS 클래스 |

### TabItem 인터페이스

```tsx
interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
  disabled?: boolean;
  badge?: string | number;
}
```

## 사용 예시

### 기본 탭

```tsx
const basicTabs = [
  { id: 'overview', label: '개요', content: <OverviewContent /> },
  { id: 'details', label: '상세정보', content: <DetailsContent /> },
  { id: 'settings', label: '설정', content: <SettingsContent /> }
];

<Tabs tabs={basicTabs} />
```

### Pills 스타일

```tsx
<Tabs 
  tabs={tabs} 
  variant="pills"
  defaultTab="overview"
  onTabChange={(tabId) => console.log('Tab changed:', tabId)}
/>
```

### 언더라인 스타일

```tsx
<Tabs 
  tabs={tabs} 
  variant="underline"
  size="lg"
/>
```

### 뱃지가 있는 탭

```tsx
const tabsWithBadges = [
  { id: 'inbox', label: '받은편지함', content: <InboxContent />, badge: 5 },
  { id: 'sent', label: '보낸편지함', content: <SentContent /> },
  { id: 'draft', label: '임시보관함', content: <DraftContent />, badge: '새' }
];

<Tabs tabs={tabsWithBadges} />
```

### 비활성화된 탭

```tsx
const tabsWithDisabled = [
  { id: 'public', label: '공개', content: <PublicContent /> },
  { id: 'private', label: '비공개', content: <PrivateContent />, disabled: true },
  { id: 'shared', label: '공유', content: <SharedContent /> }
];

<Tabs tabs={tabsWithDisabled} />
``` 