# 디자인 시스템 가이드

## 📁 참고 파일

- **통합 스타일**: [src/styles/design-system.css](design-system.css)
- **전역 스타일**: [src/styles/globals.css](globals.css)
- **Tailwind 설정**: [tailwind.config.js](../../tailwind.config.js)
- **스타일 가이드**: [src/styles/README.md](README.md)

## 🎨 핵심 원칙

이 프로젝트는 **Tailwind 4.0 + 화이트 테마 뉴모피즘** 디자인 시스템을 사용한다.
모든 스타일이 `design-system.css` 하나에 통합되어 있다.

### 🏗️ 아키텍처 특징

- **Tailwind 4.0**: @import 'tailwindcss' 방식
- **폰트 시스템**: MultiLang(다국어) + Pretendard(한국어)
- **CSS 변수**: HSL 기반 색상 시스템
- **뉴모피즘**: 사전 정의된 핵심 클래스들

## 📐 뉴모피즘 시스템

### 기본 3종 패턴

```css
.neu-flat       /* 평면 - 기본 컨테이너, 패널 */
.neu-raised     /* 양각 - 기본 버튼, 클릭 가능한 요소 */
.neu-inset      /* 음각 - 활성/선택된 상태 */
```

### 아이콘 상태 (2종)

```css
.neu-icon-inactive /* 비활성 아이콘 (회색) */
.neu-icon-active   /* 활성 아이콘 (primary + drop-shadow) */
```

### 보조 클래스

```css
.neu-hover          /* 호버 시 inset 효과 */
.neu-flat-focus     /* 드롭다운 열릴 때 포커스 유지 */
.sidebar-container  /* 사이드바 전용 (hover 효과 없는 컨테이너) */
```

## 🎨 색상 시스템

### CSS 변수 (HSL 기반)

```css
/* 핵심 색상 */
--background: 0 0% 100%;
--foreground: 0 0% 3.9%;
--primary: 0 0% 9%;
--primary-rgb: 23, 23, 23;

/* 뉴모피즘 전용 */
--neu-light: 255, 255, 255, 0.9;
--neu-dark: 0, 0, 0, 0.08;
--neu-offset: 3px;
--neu-blur: 6px;
```

### 사용 원칙

1. **HSL 함수 사용**: `hsl(var(--primary))`
2. **투명도 슬래시 표기**: `hsl(var(--background) / 0.9)`
3. **RGBA 직접 사용**: `rgba(var(--primary-rgb), 0.1)`

## 🎭 애니메이션 시스템

### 기본 애니메이션

```css
.animate-fadeIn      /* 페이드인 + 슬라이드업 */
.animate-slide-down  /* Radix Collapsible용 */
.animate-slide-up    /* Radix Collapsible용 */
```

### 트랜지션 원칙

- **모든 상태 변화**: `transition: all 0.15s ease-in-out`
- **호버 효과**: 즉각적인 변화 (사용자 규칙)
- **GPU 가속**: transform 속성 우선 사용

## 🔧 사용법 (엄격한 규칙)

### 1. 일반 컨테이너는 `neu-flat`

```jsx
<div className="neu-flat p-6 rounded-lg">모든 컨테이너, 패널, 카드</div>
```

### 2. 사이드바 등 특수 컨테이너는 전용 클래스

```jsx
<aside className="sidebar-container">
	/* hover 효과가 없는 안정적인 컨테이너 */
</aside>
```

### 3. 버튼은 상태에 따라 양각/음각

```jsx
<button className={isActive ? 'neu-inset' : 'neu-raised'}>상태별 버튼</button>
```

### 4. 아이콘은 2가지 상태만

```jsx
<Icon className={isActive ? 'neu-icon-active' : 'neu-icon-inactive'} />
```

### 5. 특수 효과는 보조 클래스

```jsx
<button className="neu-flat neu-hover">호버 시 inset 효과</button>
```

### 6. 조건부 스타일링 패턴

```jsx
const containerClass = `neu-flat ${isOpen ? 'neu-flat-focus' : ''}`;
const buttonClass = isSelected
	? 'neu-inset text-primary'
	: 'neu-raised hover:scale-[1.01]';
```

## 📦 활용 가능한 라이브러리

### 🎭 애니메이션 & 인터랙션

- **framer-motion**: 고급 애니메이션, 제스처, 레이아웃 애니메이션
- **@dnd-kit/core, @dnd-kit/sortable**: 드래그 앤 드롭, 정렬 기능

### 🧩 UI 컴포넌트

- **@radix-ui/react-\***: 접근성 기반 무뇌 UI 컴포넌트 (Avatar, Collapsible, Slot, Tooltip)
- **lucide-react**: 일관된 아이콘 시스템
- **sonner**: 토스트 알림

### 📊 데이터 시각화

- **@tanstack/react-table**: 테이블, 데이터 그리드
- **recharts**: 차트, 그래프
- **three**: 3D 그래픽, WebGL

### 📝 에디터 & 폼

- **@tinymce/tinymce-react**: 리치 텍스트 에디터
- **react-hook-form**: 폼 상태 관리
- **react-datepicker, react-day-picker**: 날짜 선택
- **zod**: 스키마 검증

### 🔧 상태 & 유틸리티

- **jotai**: 원자적 상태 관리
- **@tanstack/react-query**: 서버 상태 관리
- **clsx, tailwind-merge**: CSS 클래스 조합
- **class-variance-authority**: 컴포넌트 변형 관리
- **date-fns**: 날짜 유틸리티

## 🎯 스타일링 통합 팁

### Radix UI + 뉴모피즘

```jsx
<RadixDialog.Content className="neu-flat p-6">
  <RadixDialog.Title className="neu-icon-active">
```

### Framer Motion + 상태 전환

```jsx
<motion.button
  className={isPressed ? 'neu-inset' : 'neu-raised'}
  whileTap={{ scale: 0.98 }}
>
```

### 조건부 애니메이션

```jsx
<div className={`neu-flat ${isVisible ? 'animate-fadeIn' : ''}`}>
```

## ⚠️ 금지 사항

1. **커스텀 box-shadow 작성 금지** - 뉴모피즘 클래스만 사용
2. **하드코딩 색상 금지** - CSS 변수 우선
3. **커스텀 transition 금지** - 기본 제공 사용
4. **neu-\* 클래스 조합 금지** - 각각 독립적 사용
5. **Tailwind 3.x 문법 사용 금지** - 4.0 문법 준수
6. **컨테이너에 hover 효과 적용 금지** - 필요시 전용 클래스 사용

## 📝 마이그레이션 체크리스트

기존 코드에서 새 패턴으로 변경:

```jsx
// ❌ 기존 방식
<div className="neumorphic shadow-neumorphism bg-gray-100" />
<button className="neumorphic-button hover:scale-105" />
<aside className="neu-flat"> /* hover 효과가 있는 사이드바 */

// ✅ 새로운 방식
<div className="neu-flat" />
<button className="neu-raised" />
<aside className="sidebar-container"> /* hover 효과 없는 안정적인 사이드바 */
```

## 🎯 성능 최적화

- CSS 파일 **통합** (design-system.css 하나로 관리)
- 클래스 선택 복잡도 **최소화** (핵심 클래스만 사용)
- 애니메이션 성능 **자동 최적화** (GPU 가속 활용)
- **hover 효과 최적화** (필요한 요소에만 적용)

프로젝트에 문서 추가 시 `/docs` 디렉토리에 배치한다.
