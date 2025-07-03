# Timeline 컴포넌트

시간순 이벤트를 시각적으로 표시하는 타임라인 컴포넌트입니다.

## 주요 특징

- **유연한 레이아웃**: 세로/가로 배치 지원
- **다양한 아이콘**: 이벤트별 커스텀 아이콘
- **상태 표시**: 완료/진행중/예정 상태
- **반응형**: 모바일 친화적 디자인

## 기본 사용법

```tsx
import { Timeline } from '@/components/ui/ui-data/timeline/Timeline';

function MyComponent() {
  const events = [
    {
      id: '1',
      title: '프로젝트 시작',
      description: '새로운 프로젝트를 시작했습니다.',
      timestamp: '2024-01-01T09:00:00Z',
      status: 'completed'
    },
    {
      id: '2', 
      title: '개발 완료',
      description: '주요 기능 개발이 완료되었습니다.',
      timestamp: '2024-01-15T14:30:00Z',
      status: 'current'
    },
    {
      id: '3',
      title: '배포 예정',
      description: '프로덕션 환경에 배포 예정입니다.',
      timestamp: '2024-01-30T10:00:00Z',
      status: 'upcoming'
    }
  ];

  return <Timeline events={events} />;
}
```

## Props

| 속성 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `events` | `TimelineEvent[]` | - | 타임라인 이벤트 목록 (필수) |
| `orientation` | `'vertical' \| 'horizontal'` | `'vertical'` | 타임라인 방향 |
| `variant` | `'default' \| 'compact' \| 'detailed'` | `'default'` | 타임라인 스타일 |
| `showTime` | `boolean` | `true` | 시간 표시 여부 |
| `className` | `string` | `''` | 추가 CSS 클래스 |

### TimelineEvent 인터페이스

```tsx
interface TimelineEvent {
  id: string;
  title: string;
  description?: string;
  timestamp: string;
  status?: 'completed' | 'current' | 'upcoming';
  icon?: React.ReactNode;
  color?: string;
  metadata?: Record<string, any>;
}
```

## 사용 예시

### 기본 세로 타임라인

```tsx
<Timeline 
  events={events}
  orientation="vertical"
  showTime={true}
/>
```

### 가로 타임라인

```tsx
<Timeline 
  events={events}
  orientation="horizontal"
  variant="compact"
/>
```

### 커스텀 아이콘

```tsx
const eventsWithIcons = [
  {
    id: '1',
    title: '로그인',
    timestamp: '2024-01-01T09:00:00Z',
    icon: <LoginIcon />,
    status: 'completed'
  },
  {
    id: '2',
    title: '파일 업로드',
    timestamp: '2024-01-01T09:15:00Z', 
    icon: <UploadIcon />,
    status: 'current'
  }
];

<Timeline events={eventsWithIcons} />
```

### 상세 정보 포함

```tsx
const detailedEvents = [
  {
    id: '1',
    title: '주문 접수',
    description: '고객이 온라인으로 주문을 완료했습니다.',
    timestamp: '2024-01-01T10:00:00Z',
    status: 'completed',
    metadata: {
      orderId: 'ORD-001',
      amount: 50000,
      customer: '김고객'
    }
  }
];

<Timeline 
  events={detailedEvents} 
  variant="detailed"
/>
``` 