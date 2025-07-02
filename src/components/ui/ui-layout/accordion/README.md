# Accordion 컴포넌트

접기/펼치기 기능을 제공하는 아코디언 컴포넌트입니다.

## 📁 파일 구조

```
accordion/
├── Accordion.tsx    # 메인 컴포넌트 
├── index.ts         # 익스포트 
└── README.md        # 문서
```

## 🎯 주요 기능

- **뉴모피즘 디자인**: neu-flat, neu-raised, neu-inset 클래스 활용
- **부드러운 애니메이션**: CSS transition으로 자연스러운 열기/닫기
- **상태 텍스트 지원**: 헤더에 추가 정보 표시
- **비활성화 상태**: disabled prop으로 인터랙션 차단
- **토글 콜백**: onToggle 함수로 상태 변화 감지
- **커스텀 스타일링**: className props로 스타일 오버라이드
- **아코디언 그룹**: AccordionGroup으로 다중 아코디언 관리

## 🔧 Props

### Accordion

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| title | string | 'Accordion' | 헤더 제목 |
| children | ReactNode | - | 아코디언 콘텐츠 |
| defaultOpen | boolean | false | 초기 열림 상태 |
| statusText | string | - | 헤더 상태 텍스트 |
| onToggle | (isOpen: boolean) => void | - | 토글 시 콜백 |
| className | string | '' | 컨테이너 클래스 |
| headerClassName | string | '' | 헤더 클래스 |
| contentClassName | string | '' | 콘텐츠 클래스 |
| disabled | boolean | false | 비활성화 상태 |

### AccordionGroup

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | ReactNode | - | 아코디언들 |
| className | string | '' | 그룹 컨테이너 클래스 |

## 💡 사용 예시

### 기본 사용법

```tsx
import { Accordion } from '@/components/ui/accordion';

<Accordion title="기본 아코디언" defaultOpen={true}>
  <div>아코디언 콘텐츠</div>
</Accordion>
```

### 상태 텍스트 및 콜백

```tsx
<Accordion 
  title="설정" 
  statusText="3개 항목"
  onToggle={(isOpen) => console.log('토글됨:', isOpen)}
>
  <div>설정 콘텐츠</div>
</Accordion>
```

### 비활성화

```tsx
<Accordion title="접근 불가" disabled={true}>
  <div>비활성화된 콘텐츠</div>
</Accordion>
```

### 아코디언 그룹

```tsx
import { Accordion, AccordionGroup } from '@/components/ui/accordion';

<AccordionGroup>
  <Accordion title="첫 번째">콘텐츠 1</Accordion>
  <Accordion title="두 번째">콘텐츠 2</Accordion>
  <Accordion title="세 번째">콘텐츠 3</Accordion>
</AccordionGroup>
```

## 🎨 스타일링

뉴모피즘 디자인 클래스들이 자동으로 적용되며, 추가 커스터마이징이 필요한 경우 className props를 활용할 수 있습니다.

```tsx
<Accordion 
  className="custom-accordion"
  headerClassName="custom-header" 
  contentClassName="custom-content"
>
  콘텐츠
</Accordion>
```

## 🔄 AdvancedSearch와의 연관성

AdvancedSearch 컴포넌트는 내부적으로 Accordion을 사용하여 검색 패널의 접기/펼치기 기능을 구현합니다. 