// 지원하는 언어 목록
export const locales = ['ko', 'en', 'ar'] as const;
export type Locale = (typeof locales)[number];

// 기본 언어
export const defaultLocale: Locale = 'ko';

// 언어별 메타데이터
export const localeMetadata = {
  ko: {
    name: '한국어',
    flag: '한',
    dir: 'ltr' as const,
  },
  en: {
    name: 'English',
    flag: 'A',
    dir: 'ltr' as const,
  },
  ar: {
    name: 'العربية',
    flag: 'ع',
    dir: 'rtl' as const,
  },
} as const; 