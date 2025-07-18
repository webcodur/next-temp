# SectionPanel

헤더와 콘텐츠 영역으로 구성된 섹션 패널 컴포넌트입니다. BarrierManager 기준의 고정 스타일링으로 일관된 디자인 시스템을 제공합니다.

## 특징

- **고정 스타일링**: BarrierManager와 동일한 디자인 적용
- **gradient 헤더**: `bg-gradient-to-r from-primary/80 to-primary/60` 배경
- **중앙 정렬 타이틀**: h-10 고정 높이, text-lg font-bold 스타일
- **통일된 패딩**: px-4 py-3 패딩, rounded-lg border
- **유연한 구조**: 메인 컴포넌트와 독립 컴포넌트 제공

## 고정 스타일링 세부사항

### 헤더 스타일
- **배경**: gradient (primary/80 → primary/60)
- **텍스트**: 흰색 (`text-white`)
- **높이**: h-10 고정 높이
- **정렬**: 타이틀 중앙 배치
- **패딩**: px-4 py-3

### 컨테이너 스타일
- **배경**: neu-flat bg-surface-2
- **테두리**: rounded-lg (8px)
- **레이아웃**: flex flex-col

## 사용법

### 기본 사용

```tsx
import { SectionPanel } from '@/components/ui/ui-layout/section-panel/SectionPanel';

<SectionPanel title="패널 제목">
  <div className="p-6">
    패널 내용
  </div>
</SectionPanel>
```

### 아이콘과 액션 포함

```tsx
import { Car, RefreshCw } from 'lucide-react';

<SectionPanel
  title="차량 목록"
  icon={<Car className="w-5 h-5 text-white" />}
  headerActions={
    <button className="px-3 py-1 text-sm bg-white text-primary rounded-lg">
      <RefreshCw className="w-4 h-4 inline mr-1" />
      새로고침
    </button>
  }
>
  <div className="p-4">
    차량 목록 내용
  </div>
</SectionPanel>
```

### 독립 컴포넌트 사용

```tsx
import { SectionPanelHeader, SectionPanelContent } from '@/components/ui/ui-layout/section-panel/SectionPanel';

<div className="rounded-lg neu-flat bg-surface-2">
  <SectionPanelHeader>
    <h3>커스텀 헤더</h3>
    <button>액션</button>
  </SectionPanelHeader>
  <SectionPanelContent>
    <div className="p-6">
      커스텀 콘텐츠
    </div>
  </SectionPanelContent>
</div>
```

## Props

### SectionPanelProps

| 이름 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| title | `string` | - | 헤더에 표시될 제목 |
| children | `ReactNode` | - | 패널의 콘텐츠 |
| className | `string` | `''` | 컨테이너에 추가할 CSS 클래스 |
| headerClassName | `string` | `''` | 헤더에 추가할 CSS 클래스 |
| contentClassName | `string` | `''` | 콘텐츠 영역에 추가할 CSS 클래스 |
| headerActions | `ReactNode` | - | 헤더 우측에 표시될 액션 요소들 |
| icon | `ReactNode` | - | 헤더 좌측에 표시될 아이콘 |

### SectionPanelHeaderProps

| 이름 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| children | `ReactNode` | - | 헤더 콘텐츠 |
| className | `string` | `''` | 추가할 CSS 클래스 |

### SectionPanelContentProps

| 이름 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| children | `ReactNode` | - | 콘텐츠 |
| className | `string` | `''` | 추가할 CSS 클래스 |

## 디자인 시스템 통일

이 컴포넌트는 BarrierManager의 VehicleTypeCard와 동일한 스타일링을 적용하여 전체 애플리케이션의 일관성을 보장합니다:

- VehicleDetailCard
- VehicleListTable  
- BarrierManager

모든 패널이 동일한 헤더 높이, 타이틀 스타일, border radius를 사용합니다.

## 예제

자세한 사용 예시는 `section-panel.example.tsx` 파일을 참조하세요. 