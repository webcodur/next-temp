'use client';

import { LanguageSwitcher } from '@/components/ui/ui-input/language-switcher';
import { useLocale, useTranslations } from '@/hooks/useI18n';

export default function I18nTestPage() {
  const { currentLocale, supportedLocales } = useLocale();
  const t = useTranslations();

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* #region 헤더 */}
      <div className="text-center">
        <h1 className="mb-4 text-3xl font-bold">다국어 시스템 테스트</h1>
        <p className="text-muted-foreground">
          언어팩 시스템과 언어 전환 기능을 테스트합니다.
        </p>
        <div className="flex justify-center mt-4">
          <LanguageSwitcher variant="inline" />
        </div>
      </div>
      {/* #endregion */}

      {/* #region 현재 언어 정보 */}
      <div className="p-6 rounded-lg neu-flat">
        <h3 className="mb-4 text-lg font-semibold">현재 언어 정보</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="font-medium">현재 언어:</span>
            <span className="text-primary">{currentLocale}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">지원 언어:</span>
            <span className="text-muted-foreground">{supportedLocales.join(', ')}</span>
          </div>
        </div>
      </div>
      {/* #endregion */}

      {/* #region 공통 메시지 테스트 */}
      <div className="p-6 rounded-lg neu-flat">
        <h3 className="mb-4 text-lg font-semibold">공통 메시지</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-3 neu-raised text-sm">{t('공통_로딩중')}</button>
          <button className="p-3 neu-raised text-sm">{t('공통_확인')}</button>
          <button className="p-3 neu-raised text-sm">{t('공통_취소')}</button>
          <button className="p-3 neu-raised text-sm">{t('공통_저장')}</button>
          <button className="p-3 neu-raised text-sm">{t('공통_삭제')}</button>
          <button className="p-3 neu-raised text-sm">{t('공통_편집')}</button>
          <button className="p-3 neu-raised text-sm">{t('공통_검색')}</button>
          <button className="p-3 neu-raised text-sm">{t('공통_닫기')}</button>
        </div>
      </div>
      {/* #endregion */}

      {/* #region 메뉴 메시지 테스트 */}
      <div className="p-6 rounded-lg neu-flat">
        <h3 className="mb-4 text-lg font-semibold">메뉴 메시지</h3>
        <div className="flex flex-wrap gap-3">
          <span className="px-3 py-2 bg-primary/10 text-primary rounded-full text-sm">{t('메뉴_주차')}</span>
          <span className="px-3 py-2 bg-green-500/10 text-green-600 rounded-full text-sm">{t('메뉴_커뮤니티')}</span>
          <span className="px-3 py-2 bg-purple-500/10 text-purple-600 rounded-full text-sm">{t('메뉴_공지사항')}</span>
          <span className="px-3 py-2 bg-orange-500/10 text-orange-600 rounded-full text-sm">{t('메뉴_계정')}</span>
          <span className="px-3 py-2 bg-red-500/10 text-red-600 rounded-full text-sm">{t('메뉴_설정')}</span>
          <span className="px-3 py-2 bg-indigo-500/10 text-indigo-600 rounded-full text-sm">{t('메뉴_연구소')}</span>
        </div>
      </div>
      {/* #endregion */}

      {/* #region 폼 메시지 테스트 */}
      <div className="p-6 rounded-lg neu-flat">
        <h3 className="mb-4 text-lg font-semibold">폼 메시지</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              {t('폼_이메일')}
            </label>
            <input 
              type="email" 
              className="w-full p-3 border border-border rounded-lg focus:outline-hidden focus:ring-2 focus:ring-primary"
              placeholder={t('폼_이메일')}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              {t('폼_비밀번호')}
            </label>
            <input 
              type="password" 
              className="w-full p-3 border border-border rounded-lg focus:outline-hidden focus:ring-2 focus:ring-primary"
              placeholder={t('폼_비밀번호')}
            />
          </div>
          <div className="space-y-1 text-sm text-red-600">
            <p>{t('폼_필수항목')}</p>
            <p>{t('폼_잘못된형식')}</p>
            <p>{t('폼_너무짧음')}</p>
          </div>
        </div>
      </div>
      {/* #endregion */}

      {/* #region 폰트 테스트 메시지 */}
      <div className="p-6 rounded-lg neu-flat">
        <h3 className="mb-4 text-lg font-semibold">폰트 테스트 메시지</h3>
        <div className="space-y-3">
          <p className="text-lg font-semibold">{t('폰트테스트_제목')}</p>
          <p className="text-muted-foreground">{t('폰트테스트_설명')}</p>
          <div className="flex gap-2 text-sm">
            <span className="px-2 py-1 bg-muted rounded">{t('폰트테스트_언어_한국어')}</span>
            <span className="px-2 py-1 bg-muted rounded">{t('폰트테스트_언어_영어')}</span>
            <span className="px-2 py-1 bg-muted rounded">{t('폰트테스트_언어_아랍어')}</span>
          </div>
        </div>
      </div>
      {/* #endregion */}

      {/* #region 혼합 언어 텍스트 예시 */}
      <div className="p-6 rounded-lg neu-inset">
        <h3 className="mb-4 text-lg font-semibold">혼합 언어 텍스트 예시</h3>
        <div className="text-lg font-multilang leading-relaxed">
          {t('폰트테스트_샘플_혼합')}
        </div>
        <div className="mt-4 text-sm text-muted-foreground">
          위 텍스트는 한국어, 영어, 아랍어가 혼합된 예시로, 각 언어에 맞는 폰트가 자동으로 적용됩니다.
        </div>
      </div>
      {/* #endregion */}

      {/* #region 인터랙티브 요소 테스트 */}
      <div className="p-6 rounded-lg neu-flat">
        <h3 className="mb-4 text-lg font-semibold">인터랙티브 요소</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <button className="w-full p-3 neu-raised hover:neu-inset transition-all">
              {t('공통_제출')}
            </button>
            <button className="w-full p-3 neu-raised hover:neu-inset transition-all">
              {t('공통_뒤로')}
            </button>
          </div>
          <div className="space-y-3">
            <select className="w-full p-3 border border-border rounded-lg">
              <option>{t('공통_선택')}</option>
              <option>{t('페이지_홈')}</option>
              <option>{t('페이지_프로필')}</option>
            </select>
            <input 
              type="text" 
              placeholder={t('공통_검색')}
              className="w-full p-3 border border-border rounded-lg"
            />
          </div>
        </div>
      </div>
      {/* #endregion */}
    </div>
  );
} 