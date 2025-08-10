import { useState } from 'react';
import { useAtom } from 'jotai';
import LanguageSwitcher from '@/components/ui/ui-input/language-switcher/LanguageSwitcher';
import { ThemeToggle } from '@/components/ui/ui-layout/theme-toggle/ThemeToggle';
import { ColorSetSelector } from '@/components/ui/ui-input/color-set-picker/ColorSetSelector';
import { Settings as SettingsIcon } from 'lucide-react';
import clsx from 'clsx';
import Modal from '@/components/ui/ui-layout/modal/Modal';
import { useLocale } from '@/hooks/ui-hooks/useI18n';
import { themeAtom } from '@/store/theme';
import { useColorSet } from '@/hooks/ui-hooks/useColorSet';

// 동적 로딩은 제거 - ColorSetPicker는 클라이언트 컴포넌트로 직접 사용

interface SettingsButtonProps {
  className?: string;
}

export function SettingsButton({ className = '' }: SettingsButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { localeMetadata } = useLocale();
  const [theme] = useAtom(themeAtom);
  const { colorSetName } = useColorSet();

  const toggleOpen = () => setIsOpen(prev => !prev);

  // 현재 상태 데이터 준비
  const currentLanguageName = localeMetadata.name;
  const currentThemeName = theme === 'dark' ? '다크 모드' : '라이트 모드';
  const currentColorSetName = colorSetName;

  return (
    <>
      {/* 설정 버튼 */}
      <button
        onClick={toggleOpen}
        className={clsx('flex justify-center items-center', className)}
        aria-label="설정"
      >
        <SettingsIcon className="w-6 h-6 text-muted-foreground" />
      </button>

      {/* 설정 모달 */}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="인터페이스 설정"
        size="md"
      >
        <div className="space-y-6 min-w-[400px]">
          {/* 언어 스위처 */}
          <div className="grid grid-cols-[1fr_auto_auto] gap-4 items-center justify-items-center">
            <div className="flex flex-col gap-0.5 justify-self-start">
              <span className="text-sm font-medium text-foreground font-multilang">언어</span>
              <span className="text-xs text-muted-foreground font-multilang">표시 언어</span>
            </div>
            <span className="text-sm text-center text-foreground font-multilang">{currentLanguageName}</span>
            <div className="flex justify-center items-center w-12 h-12 neu-flat">
              <LanguageSwitcher variant="inline" hideChevron noBorder className="text-primary" />
            </div>
          </div>

          {/* 색상 테마 */}
          <div className="grid grid-cols-[1fr_auto_auto] gap-4 items-center justify-items-center">
            <div className="flex flex-col gap-0.5 justify-self-start">
              <span className="text-sm font-medium text-foreground font-multilang">색상 테마</span>
              <span className="text-xs text-muted-foreground font-multilang">색상 조합</span>
            </div>
            <span className="text-sm text-center text-foreground font-multilang">{currentColorSetName}</span>
            <div className="flex justify-center items-center w-12 h-12 neu-flat">
              <ColorSetSelector compact />
            </div>
          </div>

          {/* 테마 토글 */}
          <div className="grid grid-cols-[1fr_auto_auto] gap-4 items-center justify-items-center">
            <div className="flex flex-col gap-0.5 justify-self-start">
              <span className="text-sm font-medium text-foreground font-multilang">테마</span>
              <span className="text-xs text-muted-foreground font-multilang">화면 모드</span>
            </div>
            <span className="text-sm text-center text-foreground font-multilang">{currentThemeName}</span>
            <div className="flex justify-center items-center w-12 h-12 neu-flat">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
} 
