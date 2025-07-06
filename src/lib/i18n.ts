// 지원하는 언어 목록
export const locales = ['ko', 'en', 'ar'] as const;
export type Locale = (typeof locales)[number];

// 기본 언어
export const defaultLocale: Locale = 'ko';

// 언어별 메타데이터
export const localeMetadata = {
	ko: {
		name: '한국어',
		flag: '/icons/flags/KR.svg',
		dir: 'ltr' as const,
	},
	en: {
		name: 'English',
		flag: '/icons/flags/UK.svg',
		dir: 'ltr' as const,
	},
	ar: {
		name: 'العربية (GCC)',
		flag: '/icons/flags/GCC.svg',
		dir: 'rtl' as const,
	},
} as const;
