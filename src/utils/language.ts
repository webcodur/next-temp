// 언어별 문자 범위 정의
const UNICODE_RANGES = {
  korean: /[\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F]/,
  arabic: /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/,
  latin: /[\u0000-\u007F\u0080-\u00FF\u0100-\u017F\u0180-\u024F]/,
} as const;

// RTL 언어 목록
const RTL_LANGUAGES = ['ar', 'he', 'fa', 'ur'];

/**
 * 텍스트에서 주요 언어를 감지한다
 */
export const detectLanguage = (text: string): 'ko' | 'ar' | 'en' | 'mixed' => {
  const koreanChars = (text.match(UNICODE_RANGES.korean) || []).length;
  const arabicChars = (text.match(UNICODE_RANGES.arabic) || []).length;
  const latinChars = (text.match(UNICODE_RANGES.latin) || []).length;

  const total = koreanChars + arabicChars + latinChars;
  
  if (total === 0) return 'en';
  
  const koreanRatio = koreanChars / total;
  const arabicRatio = arabicChars / total;
  
  if (koreanRatio > 0.3) return 'ko';
  if (arabicRatio > 0.3) return 'ar';
  if (koreanRatio > 0.1 || arabicRatio > 0.1) return 'mixed';
  
  return 'en';
};

/**
 * 언어 코드가 RTL인지 확인한다
 */
export const isRTL = (lang: string): boolean => {
  return RTL_LANGUAGES.includes(lang);
};

/**
 * 언어에 따른 적절한 폰트 클래스를 반환한다
 */
export const getFontClass = (lang: 'ko' | 'ar' | 'en' | 'mixed'): string => {
  const fontMap = {
    ko: 'font-pretendard',
    ar: 'font-cairo text-rtl',
    en: 'font-inter',
    mixed: 'font-multilang',
  };
  
  return fontMap[lang];
};

/**
 * 브라우저 언어 설정에서 주 언어를 추출한다
 */
export const getBrowserLanguage = (): string => {
  const language = typeof window !== 'undefined' 
    ? navigator.language 
    : 'ko-KR';
    
  return language.split('-')[0];
};

/**
 * 언어에 따른 텍스트 정렬을 반환한다
 */
export const getTextAlign = (lang: string): 'left' | 'right' | 'center' => {
  return isRTL(lang) ? 'right' : 'left';
};

/**
 * 언어별 기본 로케일을 반환한다
 */
export const getLocale = (lang: string): string => {
  const localeMap: Record<string, string> = {
    ko: 'ko-KR',
    ar: 'ar-SA',
    en: 'en-US',
    ja: 'ja-JP',
    zh: 'zh-CN',
  };
  
  return localeMap[lang] || 'en-US';
}; 