# ThemeToggle 컴포넌트

라이트/다크 테마를 전환할 수 있는 토글 버튼 컴포넌트입니다.

## 기본 사용법

```tsx
import { ThemeToggle } from '@/components/ui/ui-layout/theme-toggle/ThemeToggle';

// 기본 버튼 형태
<ThemeToggle />

// 아이콘만 표시
<ThemeToggle variant="icon" showLabel={false} />

// 미니멀 스타일
<ThemeToggle variant="minimal" />
```

## Props

- `variant`: 'button' | 'icon' | 'minimal' (기본값: 'button')
- `showLabel`: boolean (기본값: true) - 레이블 표시 여부
- `className`: string - 커스텀 CSS 클래스

## 주요 기능

- **3가지 스타일**: button, icon, minimal 스타일 지원
- **다국어 지원**: useTranslations 훅으로 레이블 다국어 처리
- **뉴모피즘 디자인**: neu-raised, neu-flat 스타일 적용
- **접근성 지원**: aria-label과 title 속성 제공
- **상태 관리**: Jotai를 사용한 전역 테마 상태 관리

## 사용 예시

### 헤더에서 사용
```tsx
<header className="flex justify-between items-center p-4">
  <h1>앱 제목</h1>
  <ThemeToggle variant="icon" showLabel={false} />
</header>
```

### 설정 페이지에서 사용
```tsx
<div className="setting-item">
  <span>테마 설정</span>
  <ThemeToggle variant="button" />
</div>
```
