/**
 * 텍스트에 아랍어가 포함되어 있는지 확인한다
 * RTL 텍스트 방향 처리용
 */
export const isRTL = (text: string): boolean => {
  // 아랍어 문자 범위 체크
  return /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(text);
};

/**
 * 폰트 웨이트별 클래스명을 반환한다
 * Pretendard 서브셋 폰트의 다양한 웨이트 지원용
 */
export const getFontWeightClass = (weight: number): string => {
  const weightMap: Record<number, string> = {
    100: 'font-thin',
    200: 'font-extralight', 
    300: 'font-light',
    400: 'font-normal',
    500: 'font-medium',
    600: 'font-semibold',
    700: 'font-bold',
    800: 'font-extrabold',
    900: 'font-black',
  };
  
  return weightMap[weight] || 'font-normal';
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