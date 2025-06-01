# 스타일 코드 관리 가이드

## 개요

이 프로젝트는 **Tailwind CSS 기반**의 스타일 시스템을 사용하며, CSS 변수를 활용한 테마 시스템과 컴포넌트 기반 스타일 구성을 특징으로 한다.

## 핵심 파일 구조

```plaintext
프로젝트/
├── tailwind.config.js          # Tailwind 설정
├── postcss.config.js           # PostCSS 설정  
├── components.json             # shadcn/ui 설정
├── src/app/globals.css         # 글로벌 스타일
└── src/lib/utils.ts            # 스타일 유틸리티
```

## 주요 설정 파일

### `tailwind.config.js`

- CSS 변수 기반 컬러 시스템 (`hsl(var(--primary))`)
- 컨텐츠 스캔 경로 정의
- 테마 확장 설정

### `src/app/globals.css`

- Pretendard 폰트 설정 (100~900 weight)
- CSS 변수 테마 시스템 (라이트/다크)
- 즉각적 hover 반응 규칙

```css
@layer utilities {
  button:hover, a:hover, [role="button"]:hover {
    transition: none !important;
  }
}
```

### `src/lib/utils.ts`

```typescript
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

## 스타일 규칙

### 컬러 시스템

- **시맨틱 컬러**: `bg-card`, `text-foreground`, `border-border`
- **CSS 변수 기반**: 자동 다크모드 지원

### 클래스명 작성

```typescript
// ✅ 권장
const className = cn(
  "base-classes",
  condition && "conditional-classes"
)

// ❌ 비권장
const className = `base-classes ${condition ? 'class' : ''}`
```

### 반응형 디자인

```typescript
// 모바일 우선 접근
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
```

### 간격 시스템

- **일관된 간격**: `space-y-8`, `gap-4`, `p-6`
- **Tailwind 기본 스케일** 사용

## 패키지 의존성

### 스타일 & 디자인 라이브러리

```json
{
  "tailwindcss": "^3.4.0",
  "tailwind-merge": "^3.3.0",
  "@tailwindcss/postcss": "^4",
  "autoprefixer": "^10.4.21",
  "clsx": "^2.1.1",
  "class-variance-authority": "^0.7.1",
  "framer-motion": "^12.15.0",
  "lucide-react": "^0.511.0",
  "sonner": "^2.0.4"
}
```

### 역할별 분류

- **CSS 프레임워크**: `tailwindcss`, `@tailwindcss/postcss`, `autoprefixer`
- **클래스 유틸리티**: `clsx`, `tailwind-merge`, `class-variance-authority`
- **애니메이션**: `framer-motion`
- **아이콘**: `lucide-react`
- **토스트**: `sonner`

## 개발 가이드라인

1. **컬러**: 시맨틱 컬러 사용 (`bg-card` vs `bg-white`)
2. **유틸리티**: `cn()` 함수로 조건부 스타일 적용
3. **반응형**: 모바일 우선 접근법
4. **애니메이션**: Framer Motion + Tailwind 트랜지션 활용
5. **아이콘**: Lucide React 아이콘 시스템 사용
6. **변형**: `class-variance-authority`로 컴포넌트 변형 관리

## 확장 방법

### 새로운 컬러 추가

1. `tailwind.config.js`에서 컬러 정의
2. `globals.css`에서 CSS 변수 추가 (라이트/다크 모두)

### 새로운 컴포넌트

1. 기존 시맨틱 컬러 활용
2. `cn()` 함수로 조건부 스타일
3. `class-variance-authority`로 변형 관리
4. Framer Motion으로 애니메이션 추가
5. 반응형 디자인 고려
