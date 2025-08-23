# ColorSetPicker 컴포넌트

## 개요

사용자가 애플리케이션의 색상 테마를 선택할 수 있는 컴포넌트입니다. Primary + Secondary 듀얼 색상 시스템을 지원하며, 실시간 미리보기와 즉시 적용 기능을 제공합니다.

## 기능

- **6개 색상 세트 지원**: 로맨틱 핑크, 에너제틱 코랄, 프로페셔널 인디고, 모던 틸, 프레시 라임, 패셔너블 로즈
- **그라데이션 미리보기**: Primary → Secondary 대각선 그라데이션 박스
- **실시간 적용**: 선택 시 전체 UI 즉시 반영
- **감성적 별칭**: 직관적인 한국어 색상 세트 이름
- **상태 저장**: localStorage를 통한 사용자 선택 기억

## 사용법

### 기본 사용

```tsx
import { ColorSetPicker } from '@/components/ui/ui-input/color-set-picker/ColorSetPicker';

function SettingsPage() {
	return (
		<div>
			<h2>테마 설정</h2>
			<ColorSetPicker />
		</div>
	);
}
```

### 콜백과 함께 사용

```tsx
import { ColorSetPicker } from '@/components/ui/ui-input/color-set-picker/ColorSetPicker';

function ThemeSelector() {
	const handleColorSetChange = (colorSet) => {
		// 색상 테마 변경됨
		// 추가 로직 수행
	};

	return (
		<ColorSetPicker
			onSetChange={handleColorSetChange}
			showLabels={true}
			className="max-w-md"
		/>
	);
}
```

## Props

| Prop          | Type                              | Default | Description            |
| ------------- | --------------------------------- | ------- | ---------------------- |
| `className`   | `string`                          | `''`    | 추가 CSS 클래스        |
| `onSetChange` | `(colorSet: ColorSetKey) => void` | -       | 색상 세트 변경 시 콜백 |
| `showLabels`  | `boolean`                         | `true`  | 레이블 표시 여부       |

## 색상 세트 목록

1. **로맨틱 핑크** (`pink-purple`)

   - Primary: `320 85% 65%` (핑크)
   - Secondary: `280 80% 70%` (퍼플)

2. **에너제틱 코랄** (`coral-orange`)

   - Primary: `15 85% 65%` (코랄)
   - Secondary: `55 80% 70%` (오렌지)

3. **프로페셔널 인디고** (`indigo-violet`)

   - Primary: `220 85% 65%` (인디고)
   - Secondary: `260 80% 70%` (바이올렛)

4. **모던 틸** (`teal-cyan`)

   - Primary: `180 85% 65%` (틸)
   - Secondary: `220 80% 70%` (시안)

5. **프레시 라임** (`lime-green`)

   - Primary: `90 85% 65%` (라임)
   - Secondary: `130 80% 70%` (그린)

6. **패셔너블 로즈** (`rose-red`)
   - Primary: `350 85% 65%` (로즈)
   - Secondary: `30 80% 70%` (레드)

## 상태 관리

컴포넌트는 Jotai를 사용하여 전역 상태를 관리합니다:

```tsx
import { useAtom } from 'jotai';
import { colorSetAtom } from '@/store/colorSet';

// 현재 선택된 색상 세트 확인
const [currentColorSet] = useAtom(colorSetAtom);
```

## 기술적 특징

- **즉시 반영**: 색상 선택 시 CSS 변수가 실시간으로 업데이트됨
- **뉴모피즘 스타일**: 선택/비선택 상태에 따른 깊이감 표현
- **접근성**: 키보드 네비게이션 및 포커스 상태 지원
- **반응형**: 2열 그리드 레이아웃으로 모바일 친화적

## 연관 컴포넌트

- `Button` - secondary variant 지원
- `Badge` - outline-secondary variant 지원
- `SimpleTextInput` - colorVariant prop 지원
- `SimpleCheckbox` - colorVariant prop 지원
- `SimpleToggleButton` - colorVariant prop 지원

## 예시 스크린샷

```
┌─────────────────┬─────────────────┐
│ 🌸 로맨틱 핑크    │ 🔥 에너제틱 코랄  │
│ P: 320 85% 65%  │ P: 15 85% 65%   │
│ S: 280 80% 70%  │ S: 55 80% 70%   │
├─────────────────┼─────────────────┤
│ 💼 프로페셔널     │ 🌊 모던 틸      │
│ 인디고          │ P: 180 85% 65%   │
│ P: 220 85% 65%  │ S: 220 80% 70%   │
│ S: 260 80% 70%  │                 │
├─────────────────┼─────────────────┤
│ 🍃 프레시 라임    │ 🌹 패셔너블 로즈  │
│ P: 90 85% 65%   │ P: 350 85% 65%  │
│ S: 130 80% 70%  │ S: 30 80% 70%   │
└─────────────────┴─────────────────┘
```
