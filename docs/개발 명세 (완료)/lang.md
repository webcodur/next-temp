---
alwaysApply: false
---
# 언어팩 & 폰트 시스템 가이드

## 📦 언어팩 구조

### 키 명명 규칙

카테고리와 설명을 언더스코어로 연결하여 한국어 키를 만든다.

- [화면/페이지_컴포넌트_항목명] 형태의 3단 구조로 네이밍
- 위 규칙을 따르지 못한 항목들은 수정이 필요한 상태인 것임
- UI 모듈의 경우 [UI모듈_컴포넌트_항목명] 형태로 네이밍 ("UI모듈" 자는 고정)
- 가능하면 GREP 명령어로 작업 (서칭 처리 시간이 너무 오래 걸림)

### 파일 구조

각 언어별로 JSON 파일을 분리하고 키 관리 파일을 별도 운영한다.

- `src/locales/ko.json` - 기준 언어팩 (한국어)
- `src/locales/en.json` - 영어 번역
- `src/locales/ar.json` - 아랍어 번역
- `src/locales/keys.json` - 키 관리용 (유지보수)

## 🔧 사용법

### 1. 언어팩 사용

컴포넌트에서 useTranslations 훅을 import하고 t 함수로 키에 접근한다.

```tsx
import { useTranslations } from '@/hooks/useI18n';

const t = useTranslations();
return <h1>{t('주차_시스템제목')}</h1>;
```

### 2. 언어 전환

LanguageSwitcher 컴포넌트는 3가지 variant를 제공하여 UI 위치에 맞게 사용한다.

```tsx
import { LanguageSwitcher } from '@/components/ui/language-switcher';

// 헤더 우상단용 - 컴팩트한 드롭다운
<LanguageSwitcher variant="header" />

// 사이드바용 - 세로 배치 최적화
<LanguageSwitcher variant="sidebar" />

// 본문 인라인용 - 일반적인 드롭다운
<LanguageSwitcher variant="inline" />
```

### 3. 언어 상태 관리

현재 언어 확인과 프로그래밍 방식 언어 변경을 위해 useLocale 훅을 사용한다.

```tsx
import { useLocale } from '@/hooks/useI18n';

const { currentLocale, changeLocale } = useLocale();
// currentLocale: 'ko' | 'en' | 'ar'
// changeLocale('en'): 영어로 변경
```

## 🎨 멀티언어 폰트

### 기본 원칙: font-multilang 하나로 해결

모든 텍스트에는 `font-multilang` 클래스만 적용하면 된다. CSS가 문자별로 자동 폰트 선택한다.

```tsx
// ✅ 권장: 모든 텍스트는 이렇게
<div className="font-multilang">
	안녕하세요 Hello مرحبا // 각 문자에 최적 폰트 자동 적용
</div>
```

### 특수한 경우: 특정 폰트 강제 지정

단일 언어만 사용하는 특별한 영역에서만 직접 폰트 지정한다.

```tsx
// ⚠️ 특수 용도로만 사용
<p className="font-pretendard">한국어만 사용하는 특별한 영역</p>
<p className="font-inter">English-only special area</p>
<p className="font-cairo">منطقة خاصة باللغة العربية فقط</p>
```

### RTL 지원: 아랍어 텍스트 방향 처리

아랍어가 포함된 텍스트는 방향만 조정하면 된다.

```tsx
import { isRTL } from '@/utils/language';

const hasArabic = /[\u0600-\u06FF]/.test(text); // 아랍어 포함 여부만 체크

// ✅ 단순한 RTL 처리
<div
	className="font-multilang"
	dir={hasArabic ? 'rtl' : 'ltr'}
	style={{ textAlign: hasArabic ? 'right' : 'left' }}>
	{text}
</div>;
```

## ⚡ 빠른 추가법

### 새 키 추가

새로운 다국어 메시지를 추가할 때는 4개 파일을 동시에 업데이트한다.

1. `src/locales/ko.json`에 `분류_키이름: "한국어 메시지"` 추가
2. `src/locales/en.json`, `ar.json`에 해당 키의 번역 추가
3. `src/locales/keys.json`에 키 등록 (유지보수용)
4. 컴포넌트에서 `t('분류_키이름')` 사용

### 새 언어 추가

지원 언어를 확장할 때는 설정과 파일을 순서대로 추가한다.

1. `src/lib/i18n.ts`에 언어 코드와 메타데이터 추가
2. `src/locales/[code].json` 파일 생성하고 모든 키 번역
3. `src/styles/design-system.css`에 해당 언어 폰트 추가 (필요시)

## 🚫 주의사항

### 언어팩 관련

- **중첩 구조 금지**: `common.loading` 대신 `공통_로딩중` 사용
- **키는 한국어로**: 가독성과 유지보수성을 위해 한국어 키 필수
- **자동 새로고침**: 언어 변경 시 페이지가 새로고침되어 모든 텍스트 반영
- **평면 구조 유지**: 객체 중첩 없이 단일 레벨 키-값 구조만 사용

### 폰트 관련

- **font-multilang 우선**: 99%는 이 클래스 하나로 해결
- **특정 폰트는 예외적**: 정말 필요한 경우만 언어별 폰트 직접 지정
- **RTL은 방향만**: 아랍어 포함 여부만 체크하고 dir 속성만 조정
- **복잡한 언어 감지 금지**: detectLanguage 같은 함수 사용하지 말 것
