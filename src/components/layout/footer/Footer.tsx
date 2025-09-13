'use client';

import { useTranslations, useLocale } from '@/hooks/ui-hooks/useI18n';

export default function Footer() {
  const t = useTranslations();
  const { isRTL } = useLocale();
  return (
    <footer className="border-t border-border text-muted-foreground py-[92px] mt-[172px]" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container px-[28px] mx-auto max-w-2xl">
        {/* 로고 및 소개 - 중앙 정렬 */}
        <div className="mb-6 text-center">
          <div className="flex justify-center items-center mb-2">
            <h2 className="text-2xl font-bold text-foreground">{t('푸터_로고')}</h2>
          </div>
          <p className="mb-2 text-base">{t('푸터_부제')}</p>
        </div>
        
        {/* 구분선 */}
        <div className="mx-auto my-5 w-28 border-t border-border"></div>
        
        {/* 연락처 및 바로가기 표 형식 */}
        <div className="mx-auto mb-6 max-w-md">
          <div className={`grid grid-cols-2 gap-2 text-center ${isRTL ? 'rtl' : 'ltr'}`}>
            {/* 번호 */}
            <div className="text-base">
              <p className="text-foreground">{t('푸터_전화번호')}</p>
            </div>
            
            {/* 홈페이지 */}
            <div className="text-base">
              <a 
                href="https://meerkat.day/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="transition-colors text-foreground hover:text-primary"
              >
                {t('푸터_홈페이지')}
              </a>
            </div>
            
            {/* 메일 */}
            <div className="text-base">
              <p className="text-foreground">{t('푸터_이메일')}</p>
            </div>
            
            {/* 블로그 */}
            <div className="text-base">
              <a 
                href="https://blog.naver.com/7meerkat" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="transition-colors text-foreground hover:text-primary"
              >
                {t('푸터_블로그')}
              </a>
            </div>
          </div>
        </div>
        
        <div className="mb-6 text-center">
          <div className={`mx-auto space-y-1 max-w-lg text-base ${isRTL ? 'text-end' : 'text-start'} sm:text-center`}>
            <p><span>{t('푸터_본사')}: </span>
            <span className="text-foreground">{t('푸터_본사주소')}</span></p>
            <p><span>{t('푸터_제조')}: </span>
            <span className="text-foreground">{t('푸터_제조주소')}</span></p>
          </div>
        </div>
        
        {/* 구분선 */}
        <div className="mx-auto my-5 w-28 border-t border-border"></div>
        
        {/* 회사 정보 및 저작권 */}
        <div className="text-sm text-center">
          <p>{t('푸터_회사정보')}</p>
          <p className="mt-1">{t('푸터_저작권', { year: new Date().getFullYear().toString() })}</p>
          <p className="mt-1 text-gray-6">{t('푸터_PC최적화')}</p>
        </div>
      </div>
    </footer>
  );
} 