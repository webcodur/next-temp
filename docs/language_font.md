# 폰트 시스템 가이드

## 🎯 기본 사용법

99% 상황에서는 `font-multilang` 클래스 하나만 사용한다.

```jsx
<div className="font-multilang">
  Mixed 텍스트 مختلط - Hello 안녕하세요 مرحبا 123
</div>
```

브라우저가 자동으로 한글은 Pretendard, 영어는 Inter, 아랍어는 Cairo 폰트를 적용한다.

## 🔧 웨이트 변경

Pretendard는 100~900 웨이트를 지원한다.

```jsx
<h1 className="font-multilang font-bold">굵은 제목</h1>
<p className="font-multilang font-normal">일반 텍스트</p>
<span className="font-multilang font-light">얇은 텍스트</span>
```

## 🌍 아랍어 RTL 처리

아랍어가 포함된 경우에만 RTL을 적용한다.

```jsx
import { isRTL } from '@/utils/language';

const text = "Hello مرحبا";
const hasArabic = isRTL(text);

<div 
  className="font-multilang"
  dir={hasArabic ? 'rtl' : 'ltr'}
>
  {text}
</div>
```

## 📦 특수 사용 (1% 경우)

특정 폰트를 강제로 사용해야 하는 경우에만 개별 클래스를 사용한다.

```jsx
<div className="font-pretendard">한국어만</div>
<div className="font-inter">영어만</div>
<div className="font-cairo">아랍어만</div>
```

## 🚫 금지사항

### 언어 감지 로직 사용 금지

```jsx
// ❌ 복잡한 감지 로직
const lang = detectLanguage(text);
const fontClass = getFontClass(lang);

// ✅ 단순하게 해결
<div className="font-multilang">{text}</div>
```

### 언어별 조건부 처리 금지

```jsx
// ❌ 조건부 처리
{lang === 'ko' && <div className="font-pretendard">{text}</div>}

// ✅ 한 번에 해결
<div className="font-multilang">{text}</div>
```

## 🔍 테스트 페이지

`/lab/ui-check/font-test` 에서 폰트 적용 결과를 확인할 수 있다.

## 📋 요약

| 상황 | 해결책 |
|------|--------|
| 일반 텍스트 | `font-multilang` |
| RTL 필요시 | `font-multilang` + `dir="rtl"` |
| 웨이트 변경 | `font-multilang font-bold` |
| 특수 요구사항 | `font-pretendard` 등 개별 폰트 |

**원칙: 99%는 `font-multilang` 하나로 해결**
