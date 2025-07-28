# SectionPanel

헤더와 콘텐츠 영역으로 구성된 섹션 패널 컴포넌트입니다. **커스텀 스타일링이 불가능한** 고정 스타일링으로 일관된 디자인 시스템을 제공합니다.

## 특징

- **고정 스타일링 전용**: 커스텀 className, colorVariant, headerContent 등 불가
- **일관된 중립 헤더**: `bg-gradient-to-r from-gray-4 via-gray-5 to-gray-6` 고정
- **중앙 정렬 타이틀**: h-8 고정 높이, text-base font-bold 스타일
- **통일된 패딩**: px-4 py-2 패딩, rounded-lg
- **단순한 구조**: title, icon, headerActions만 지원

## 고정 스타일링 세부사항

### 헤더 스타일

- **배경**: 중립 그라데이션 (gray-4 via gray-5 → gray-6) - 변경 불가
- **텍스트**: 기본 텍스트 (`text-foreground`) - 변경 불가
- **높이**: h-8 고정 높이 - 변경 불가
- **정렬**: 타이틀 중앙 배치 - 변경 불가
- **패딩**: px-4 py-2 - 변경 불가

### 컨테이너 스타일

- **배경**: neu-flat + bg-serial-2 - 변경 불가
- **테두리**: rounded-lg (8px) - 변경 불가
- **레이아웃**: flex flex-col - 변경 불가

## 제거된 커스텀 옵션들

다음 옵션들은 **더 이상 지원되지 않습니다**:

- `className` - 컨테이너 스타일 커스터마이징 불가
- `contentClassName` - 콘텐츠 영역 스타일 커스터마이징 불가
- `colorVariant` - 색상 변형 불가
- `headerContent` - 완전 커스텀 헤더 불가

## 사용법

### 기본 사용

```tsx
import { SectionPanel } from '@/components/ui/ui-layout/section-panel/SectionPanel';

<SectionPanel title="패널 제목">
	<div className="p-6">패널 내용</div>
</SectionPanel>;
```

### 아이콘과 액션 포함

```tsx
import { Car, RefreshCw } from 'lucide-react';

<SectionPanel
	title="차량 목록"
	icon={<Car className="w-5 h-5 text-foreground" />}
	headerActions={
		<button className="px-3 py-1 text-sm bg-white text-primary rounded-lg">
			<RefreshCw className="w-4 h-4 inline mr-1" />
			새로고침
		</button>
	}>
	<div className="p-4">차량 목록 내용</div>
</SectionPanel>;
```

### 독립 컴포넌트 사용

```tsx
import { SectionPanelContent } from '@/components/ui/ui-layout/section-panel/SectionPanel';

// 헤더 없이 콘텐츠만 사용
<SectionPanelContent>
	<div className="p-4">콘텐츠만 표시</div>
</SectionPanelContent>;
```

## Props 인터페이스

```tsx
interface SectionPanelProps {
	title?: string;
	children: ReactNode;
	headerActions?: ReactNode; // 헤더 우측에 추가 요소
	icon?: ReactNode; // 헤더 좌측 아이콘
}

interface SectionPanelContentProps {
	children: ReactNode;
}
```

## 사용 가이드라인

1. **스타일 수정 금지**: 모든 스타일은 고정되어 있으며 변경할 수 없습니다
2. **콘텐츠 패딩**: 내부 콘텐츠에는 적절한 패딩(p-4, p-6 등)을 직접 추가하세요
3. **아이콘 크기**: 헤더 아이콘은 w-5 h-5 권장, 색상은 text-foreground 사용
4. **액션 버튼**: headerActions는 작고 간단한 버튼 요소만 권장
