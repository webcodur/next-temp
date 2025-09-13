import { useState } from 'react';
import { useAtom } from 'jotai';
import LanguageSwitcher from '@/components/ui/ui-input/language-switcher/LanguageSwitcher';
import { ThemeToggle } from '@/components/ui/ui-layout/theme-toggle/ThemeToggle';
import { ColorSetSelector } from '@/components/ui/ui-input/color-set-picker/ColorSetSelector';
import { Settings as SettingsIcon, Globe, Palette, Sun } from 'lucide-react';
import Modal from '@/components/ui/ui-layout/modal/Modal';
import { useLocale, useTranslations } from '@/hooks/ui-hooks/useI18n';
import { themeAtom } from '@/store/theme';
import { useColorSet } from '@/hooks/ui-hooks/useColorSet';

// 동적 로딩은 제거 - ColorSetPicker는 클라이언트 컴포넌트로 직접 사용

interface SettingsButtonProps {
  className?: string;
}

export function SettingsButton({ className = '' }: SettingsButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { localeMetadata, isRTL } = useLocale();
  const t = useTranslations();
  const [theme] = useAtom(themeAtom);
  const { colorSetName } = useColorSet();

  const toggleOpen = () => setIsOpen(prev => !prev);

  // 현재 상태 데이터 준비
  const currentLanguageName = localeMetadata.name;
  const currentThemeName = theme === 'dark' ? t('테마_다크모드') : t('테마_라이트모드');
  const currentColorSetName = t(colorSetName);

  return (
    <>
      {/* 설정 버튼 */}
      <button
        onClick={toggleOpen}
        className={`flex justify-center items-center ${className}`}
        aria-label={t('설정_버튼')}
      >
        <SettingsIcon className="w-6 h-6 text-muted-foreground neu-icon-inactive" />
      </button>

      {/* 설정 모달 */}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={t('설정_인터페이스설정')}
        size="md"
      >
        <div className="space-y-6 min-w-[400px]" dir={isRTL ? 'rtl' : 'ltr'}>
          {/* 언어 스위처 */}
          <div className="grid grid-cols-[1fr_auto_auto] gap-4 items-center">
            <div className="flex items-center gap-3 justify-self-start">
              <div className="flex justify-center items-center w-8 h-8 text-muted-foreground">
                <Globe className="w-5 h-5 neu-icon-inactive" />
              </div>
              <span className="text-sm font-medium text-foreground font-multilang">{t('설정_언어')}</span>
            </div>
            <span className="text-sm text-foreground font-multilang text-end">{currentLanguageName}</span>
            <div className="flex justify-center items-center w-12 h-12 neu-flat justify-self-end">
              <LanguageSwitcher variant="inline" hideChevron noBorder className="text-primary" />
            </div>
          </div>

          {/* 색상 테마 */}
          <div className="grid grid-cols-[1fr_auto_auto] gap-4 items-center">
            <div className="flex items-center gap-3 justify-self-start">
              <div className="flex justify-center items-center w-8 h-8 text-muted-foreground">
                <Palette className="w-5 h-5 neu-icon-inactive" />
              </div>
              <span className="text-sm font-medium text-foreground font-multilang">{t('설정_색상테마')}</span>
            </div>
            <span className="text-sm text-foreground font-multilang text-end">{currentColorSetName}</span>
            <div className="flex justify-center items-center w-12 h-12 neu-flat justify-self-end">
              <ColorSetSelector compact />
            </div>
          </div>

          {/* 테마 토글 */}
          <div className="grid grid-cols-[1fr_auto_auto] gap-4 items-center">
            <div className="flex items-center gap-3 justify-self-start">
              <div className="flex justify-center items-center w-8 h-8 text-muted-foreground">
                <Sun className="w-5 h-5 neu-icon-inactive" />
              </div>
              <span className="text-sm font-medium text-foreground font-multilang">{t('설정_테마')}</span>
            </div>
            <span className="text-sm text-foreground font-multilang text-end">{currentThemeName}</span>
            <div className="flex justify-center items-center w-12 h-12 neu-flat justify-self-end">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
} 
