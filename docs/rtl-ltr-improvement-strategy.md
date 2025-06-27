# RTL/LTR 처리 개선 전략 보고서

## 🔍 현황 분석

### 현재 RTL 처리 방식

#### 문제점 진단
1. **방향성 속성 남용**: `left-`, `right-`, `margin-left`, `margin-right` 등 RTL에서 의미가 바뀌는 속성들 대량 사용
2. **수동 RTL 처리**: 아랍어 텍스트마다 매번 개발자가 `dir` + `text-align` 수동 설정
3. **호환성 부족**: 논리 속성 대신 물리 속성 사용으로 RTL 레이아웃 깨짐
4. **유지보수 부담**: 새 컴포넌트마다 RTL 고려사항을 일일이 체크해야 함

#### 현재 문제 사례
```css
/* 🔴 문제: RTL에서 의미가 바뀌는 물리 속성들 */
.field-icon { 
  left: 12px;           /* RTL에서는 right: 12px가 되어야 함 */
  margin-left: 8px;     /* RTL에서는 margin-right: 8px가 되어야 함 */
  border-left: 1px;     /* RTL에서는 border-right: 1px가 되어야 함 */
}
```

### 영향 범위 조사
- **방향성 속성 사용**: 50+ 파일에서 `left-`, `right-` 관련 속성 대량 사용
- **Field 컴포넌트**: 아이콘 위치, 패딩, 보더 등에 물리 속성 집중 사용
- **레이아웃**: 사이드바, 드롭다운, 모달 등 위치 관련 속성들

## 🎯 개선 전략: CSS 논리 속성 중심

### 1단계: CSS 논리 속성 시스템 구축

#### 핵심 논리 속성 매핑
```css
/* src/styles/design-system.css 추가 */

/* #region RTL 안전 논리 속성 시스템 */
:root {
  /* 기존 CSS 변수에 추가 */
  --spacing-inline-start: 12px;
  --spacing-inline-end: 12px;
  --border-inline-width: 1px;
}

/* 논리 속성 유틸리티 클래스 */
.ms-3 { margin-inline-start: 0.75rem; }     /* margin-left in LTR, margin-right in RTL */
.me-3 { margin-inline-end: 0.75rem; }       /* margin-right in LTR, margin-left in RTL */
.ps-3 { padding-inline-start: 0.75rem; }    /* padding-left in LTR, padding-right in RTL */
.pe-3 { padding-inline-end: 0.75rem; }      /* padding-right in LTR, padding-left in RTL */

.start-3 { inset-inline-start: 0.75rem; }   /* left in LTR, right in RTL */
.end-3 { inset-inline-end: 0.75rem; }       /* right in LTR, left in RTL */

.border-s { border-inline-start: 1px solid; }  /* border-left in LTR, border-right in RTL */
.border-e { border-inline-end: 1px solid; }    /* border-right in LTR, border-left in RTL */

.text-start { text-align: start; }          /* left in LTR, right in RTL */
.text-end { text-align: end; }              /* right in LTR, left in RTL */
/* #endregion */
```

#### Tailwind Config 확장
```js
// tailwind.config.js 수정
module.exports = {
  theme: {
    extend: {
      // 논리 속성 유틸리티 추가
      spacing: {
        'inline-sm': '0.5rem',
        'inline-md': '1rem', 
        'inline-lg': '1.5rem',
      }
    }
  },
  plugins: [
    // RTL 논리 속성 플러그인 추가
    function({ addUtilities }) {
      addUtilities({
        '.ms-auto': { 'margin-inline-start': 'auto' },
        '.me-auto': { 'margin-inline-end': 'auto' },
        '.start-auto': { 'inset-inline-start': 'auto' },
        '.end-auto': { 'inset-inline-end': 'auto' },
      });
    }
  ]
}
```

### 2단계: 전역 RTL 감지 및 자동 적용

#### HTML 레벨 RTL 관리
```tsx
// src/app/layout.tsx - 전역 RTL 감지
'use client';

import { useEffect } from 'react';

function RTLDetector({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // 페이지 콘텐츠에서 아랍어 감지
    const detectRTL = () => {
      const textContent = document.body.innerText || '';
      const hasArabic = /[\u0600-\u06FF\u0750-\u077F]/.test(textContent);
      
      // HTML 태그에 dir 속성 자동 설정
      document.documentElement.dir = hasArabic ? 'rtl' : 'ltr';
      document.documentElement.classList.toggle('rtl-mode', hasArabic);
    };

    // 초기 감지
    detectRTL();
    
    // 동적 콘텐츠 변화 감지
    const observer = new MutationObserver(detectRTL);
    observer.observe(document.body, { 
      childList: true, 
      subtree: true, 
      characterData: true 
    });
    
    return () => observer.disconnect();
  }, []);

  return <>{children}</>;
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className="font-multilang" suppressHydrationWarning>
      <body className="min-h-screen bg-gray-50">
        <Providers>
          <RTLDetector>
            <MainLayout>{children}</MainLayout>
          </RTLDetector>
        </Providers>
      </body>
    </html>
  );
}
```

#### CSS에서 RTL 모드 자동 처리
```css
/* src/styles/design-system.css 추가 */

/* RTL 모드에서 자동 레이아웃 조정 */
[dir="rtl"] {
  /* 기본 텍스트 정렬 */
  text-align: start; /* 자동으로 right가 됨 */
}

[dir="rtl"] .field-icon-start {
  /* LTR: left, RTL: right로 자동 변환 */
  inset-inline-start: 12px;
}

[dir="rtl"] .dropdown-menu {
  /* LTR: right: 0, RTL: left: 0으로 자동 변환 */
  inset-inline-end: 0;
}

/* RTL 모드에서 특별 처리가 필요한 요소들 */
[dir="rtl"] .sidebar {
  border-inline-end: 1px solid hsl(var(--border));
  border-inline-start: none;
}
```

### 3단계: 기존 코드 논리 속성으로 마이그레이션

#### Field 컴포넌트 시스템 개선
```tsx
// src/components/ui/field/core/config.ts 수정
export const FIELD_STYLES = {
  // ❌ 물리 속성 (기존)
  // leftIcon: 'absolute left-3 top-1/2 w-4 h-4 text-gray-700 transform -translate-y-1/2',
  // rightIcon: 'absolute right-3 top-1/2 w-4 h-4 text-gray-700 transform -translate-y-1/2',
  
  // ✅ 논리 속성 (개선)
  startIcon: 'absolute start-3 top-1/2 w-4 h-4 text-gray-700 transform -translate-y-1/2',
  endIcon: 'absolute end-3 top-1/2 w-4 h-4 text-gray-700 transform -translate-y-1/2',
  
  // 패딩도 논리 속성으로
  padding: 'ps-3 pe-3 py-2', // padding-inline-start, padding-inline-end
  
  // 텍스트 정렬도 논리적으로
  textAlign: 'text-start', // LTR: left, RTL: right 자동
} as const;
```

#### 레이아웃 컴포넌트 개선
```tsx
// 사이드바, 드롭다운 등 위치 관련 개선
// ❌ 기존
className="absolute right-0 mt-2 w-48"

// ✅ 개선  
className="absolute end-0 mt-2 w-48"
```

### 4단계: 자동 텍스트 방향 유틸리티

#### 간단한 텍스트 방향 유틸리티
```tsx
// src/utils/rtl.ts
export const withAutoDirection = (text: string) => {
  const hasArabic = /[\u0600-\u06FF]/.test(text);
  return {
    dir: hasArabic ? 'rtl' : 'ltr',
    className: hasArabic ? 'text-end' : 'text-start'
  };
};

// 사용법
const textProps = withAutoDirection(content);
<div {...textProps}>{content}</div>
```

## 📋 구현 우선순위

### Phase 1: CSS 논리 속성 시스템 (2일)
1. **design-system.css 확장**
   - 논리 속성 유틸리티 클래스 추가
   - RTL 모드 자동 처리 CSS 규칙

2. **Tailwind 설정 업데이트**
   - 논리 속성 플러그인 추가
   - 기존 물리 속성 유틸리티와 호환

### Phase 2: 핵심 컴포넌트 마이그레이션 (3일)
1. **Field 컴포넌트 시스템**
   - config.ts의 left/right → start/end 변경
   - 아이콘 위치, 패딩, 보더 모두 논리 속성으로

2. **레이아웃 컴포넌트**
   - 사이드바, 드롭다운, 모달 위치 속성 변경
   - 절대 위치 요소들 논리 속성 적용

### Phase 3: 전역 자동화 (2일)
1. **RTL 자동 감지 시스템**
   - layout.tsx에 RTLDetector 컴포넌트 추가
   - 동적 콘텐츠 변화 감지

2. **자동 방향 적용**
   - HTML dir 속성 자동 관리
   - CSS RTL 모드 클래스 자동 토글

## 🎯 최종 목표

### 개발자 경험
```tsx
// 🔴 현재: 물리 속성으로 RTL 깨짐
<div className="absolute left-3 ml-2 border-left">

// 🟢 목표: 논리 속성으로 RTL 자동 대응  
<div className="absolute start-3 ms-2 border-s">
```

### 자동 RTL 처리
```tsx
// 아랍어 콘텐츠 감지 시 자동으로:
// - <html dir="rtl">
// - 모든 start/end 속성이 자동으로 뒤바뀜
// - text-start가 자동으로 right 정렬
```

## 📊 예상 효과

### 호환성
- **완전 자동**: 아랍어 감지 시 모든 레이아웃이 자동으로 RTL 적용
- **브라우저 호환**: 논리 속성은 모든 모던 브라우저에서 지원
- **점진적 적용**: 기존 코드와 혼재 가능, 단계적 마이그레이션

### 개발 생산성  
- **실수 방지**: left/right 잘못 사용으로 인한 RTL 레이아웃 깨짐 방지
- **자동화**: 개발자가 RTL 고려할 필요 없이 자동 처리
- **표준 준수**: CSS 논리 속성은 W3C 표준, 미래 지향적

이 방식이 `<RTLText>` 같은 별도 컴포넌트보다 훨씬 자연스럽고 호환성 높은 접근법입니다. 