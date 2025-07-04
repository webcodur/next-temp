# NestedTabs 컴포넌트

2단계 중첩 탭 구조를 위한 컴포넌트입니다. 1단계 탭을 선택하면 하위 2단계 탭 목록이 나타납니다.

## 주요 특징

- **2단계 구조**: 뎁스를 가지는 컨텐츠를 효과적으로 구성
- **상태 관리**: 각 탭 레벨의 활성 상태를 독립적으로 관리
- **유연한 컨텐츠**: 각 서브탭에 React 노드를 직접 연결
- **커스터마이징**: 기존 `Tabs`와 일관된 스타일링 옵션 제공

## 기본 사용법

```tsx
import NestedTabs, { TopTab } from '@/components/ui/ui-layout/nested-tabs/NestedTabs';

function MyComponent() {
  const nestedTabsData: TopTab[] = [
    {
      id: 'group1',
      label: '설정',
      subTabs: [
        { id: 'g1-profile', label: '프로필', content: <div>프로필 설정 영역</div> },
        { id: 'g1-account', label: '계정', content: <div>계정 설정 영역</div> },
      ],
    },
    {
      id: 'group2',
      label: '데이터',
      subTabs: [
        { id: 'g2-analytics', label: '분석', content: <div>데이터 분석 보드</div> },
        { id: 'g2-export', label: '내보내기', content: <div>데이터 내보내기 옵션</div> },
      ],
    },
  ];

  return <NestedTabs tabs={nestedTabsData} />;
}
```

## Props

| 속성 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `tabs` | `TopTab[]` | - | 중첩 탭 데이터 (필수) |
| `variant` | `'default' \| 'filled'` | `'default'` | 탭 컨테이너 스타일 |
| `align` | `'start' \| 'center' \| 'end'` | `'start'` | 탭 정렬 |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | 1단계 탭 크기 (2단계는 'sm' 고정) |
| `className` | `string` | `''` | 추가 CSS 클래스 |

### TopTab 인터페이스

```tsx
interface TopTab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  subTabs: SubTab[];
}
```

### SubTab 인터페이스

```tsx
interface SubTab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
}
```

## 사용 예시

### 기본 중첩 탭

```tsx
import NestedTabs, { TopTab } from '@/components/ui/ui-layout/nested-tabs/NestedTabs';
import { Settings, Monitor } from 'lucide-react';

const tabsData: TopTab[] = [
  {
    id: 'config',
    label: '환경설정',
    icon: <Settings className="w-4 h-4" />,
    subTabs: [
      { id: 'user', label: '사용자', content: <UserConfig /> },
      { id: 'system', label: '시스템', content: <SystemConfig /> },
    ],
  },
  {
    id: 'monitoring',
    label: '모니터링',
    icon: <Monitor className="w-4 h-4" />,
    subTabs: [
      { id: 'realtime', label: '실시간', content: <RealtimeDashboard /> },
      { id: 'logs', label: '로그', content: <LogViewer /> },
    ],
  },
];

<NestedTabs tabs={tabsData} />
```

### Filled & Center 정렬

```tsx
<NestedTabs 
  tabs={tabsData}
  variant="filled"
  align="center"
  size="lg"
/>
``` 