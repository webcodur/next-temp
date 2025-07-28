# SectionPanel 개발 가이드

## 변경사항 (최신)

### 2024년 커스텀 스타일링 제거

- **모든 커스텀 스타일링 옵션 제거**: `className`, `contentClassName`, `colorVariant`, `headerContent` 완전 제거
- **고정 스타일링 전용**: 일관된 디자인 시스템을 위해 스타일 변경 불가
- **단순화된 Props**: `title`, `children`, `icon`, `headerActions`만 지원

## 컴포넌트 구조

```
SectionPanel/
├── SectionPanel.tsx          # 메인 컴포넌트 (커스텀 스타일링 제거됨)
├── section-panel.example.tsx # 사용 예제
├── section-panel.md         # 사용자 문서
└── section-panel.dev.md     # 개발자 문서 (이 파일)
```

## 타입 정의

```tsx
interface SectionPanelProps {
	title?: string;
	children: ReactNode;
	headerActions?: ReactNode; // 헤더 우측에 추가 요소
	icon?: ReactNode; // 헤더 좌측 아이콘
	// 제거된 옵션들:
	// className?: string;
	// contentClassName?: string;
	// colorVariant?: 'primary' | 'secondary';
	// headerContent?: ReactNode;
}

interface SectionPanelContentProps {
	children: ReactNode;
	// 제거된 옵션:
	// className?: string;
}
```

## 고정 스타일링 세부사항

### 헤더 스타일 (변경 불가)

```css
/* 헤더 컨테이너 */
.header {
	@apply flex flex-shrink-0 items-center px-4 py-2;
	@apply bg-gradient-to-r from-gray-4 via-gray-5 to-gray-6;
	@apply text-foreground;
}

/* 헤더 타이틀 영역 */
.title-area {
	@apply flex flex-1 justify-center items-center h-8;
}

/* 타이틀 텍스트 */
.title {
	@apply text-base font-bold text-foreground font-multilang;
}
```

### 컨테이너 스타일 (변경 불가)

```css
/* 메인 컨테이너 */
.container {
	@apply flex overflow-hidden flex-col rounded-lg neu-flat;
}

/* 콘텐츠 영역 */
.content {
	@apply flex-1 bg-serial-2;
}
```

## 사용 제한사항

### 금지된 사용 패턴

```tsx
// ❌ 더 이상 지원되지 않음
<SectionPanel
	title="제목"
	className="custom-style" // 제거됨
	contentClassName="custom-content" // 제거됨
	colorVariant="secondary" // 제거됨
	headerContent={<CustomHeader />} // 제거됨
>
	콘텐츠
</SectionPanel>
```

### 권장 사용 패턴

```tsx
// ✅ 올바른 사용법
<SectionPanel
	title="제목"
	icon={<Car className="w-5 h-5 text-white" />}
	headerActions={
		<button className="px-2 py-1 text-sm bg-white text-primary rounded">
			액션
		</button>
	}>
	<div className="p-6">콘텐츠 (여기서 패딩 직접 관리)</div>
</SectionPanel>
```

## 마이그레이션 가이드

### 기존 코드에서 제거해야 할 props

1. `className` → 제거 (고정 스타일 사용)
2. `contentClassName` → 콘텐츠 내부에서 직접 스타일링
3. `colorVariant` → 제거 (primary gradient 고정)
4. `headerContent` → `title`, `icon`, `headerActions` 조합 사용

### 예시 마이그레이션

```tsx
// Before (제거된 기능)
<SectionPanel
  className="custom-container"
  contentClassName="custom-content"
  colorVariant="secondary"
  headerContent={
    <div className="custom-header">
      <h3>커스텀 제목</h3>
      <button>버튼</button>
    </div>
  }
>
  콘텐츠
</SectionPanel>

// After (현재 지원)
<SectionPanel
  title="커스텀 제목"
  headerActions={
    <button className="px-2 py-1 bg-white text-primary rounded">
      버튼
    </button>
  }
>
  <div className="custom-content p-6">
    콘텐츠
  </div>
</SectionPanel>
```

## 테스트 시나리오

### 필수 테스트 케이스

1. **기본 렌더링**: title만 있는 경우
2. **아이콘 포함**: icon + title 조합
3. **액션 포함**: title + headerActions 조합
4. **완전체**: icon + title + headerActions 모든 조합
5. **콘텐츠만**: SectionPanelContent 단독 사용

### 예제 테스트 코드

```tsx
describe('SectionPanel', () => {
	test('커스텀 className이 적용되지 않음', () => {
		render(<SectionPanel title="테스트">콘텐츠</SectionPanel>);
		// className prop이 존재하지 않음을 확인
	});

	test('고정 gradient 배경 적용', () => {
		render(<SectionPanel title="테스트">콘텐츠</SectionPanel>);
		expect(screen.getByRole('heading')).toHaveClass('text-white');
	});
});
```

## 성능 최적화

### 제거된 동적 스타일링으로 인한 이점

1. **조건부 className 연산 제거**: `clsx` 의존성 제거
2. **고정 CSS 클래스**: 런타임 스타일 계산 불필요
3. **번들 크기 감소**: 스타일 옵션 로직 제거

## 향후 계획

### 추가 예정 기능 (스타일링 외)

1. **접근성 향상**: ARIA 라벨 자동 추가
2. **키보드 네비게이션**: 액션 버튼 포커스 관리
3. **애니메이션**: 고정 스타일 내에서 자연스러운 전환 효과

### 금지된 기능 (영구적)

- 커스텀 CSS 클래스
- 동적 색상 변경
- 헤더 레이아웃 변경
- 컨테이너 스타일 오버라이드
