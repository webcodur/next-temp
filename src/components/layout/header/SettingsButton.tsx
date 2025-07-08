import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useAtom } from 'jotai';
import LanguageSwitcher from '@/components/ui/ui-input/language-switcher/LanguageSwitcher';
import { ThemeToggle } from '@/components/ui/ui-layout/theme-toggle/ThemeToggle';
import { Settings as SettingsIcon } from 'lucide-react';
import clsx from 'clsx';
import Modal from '@/components/ui/ui-layout/modal/Modal';
import { useLocale } from '@/hooks/useI18n';
import { themeAtom } from '@/store/theme';
import { primaryColorAtom } from '@/store/primary';

// 색상 피커는 브라우저 환경에서만 동작하므로 다이내믹 로딩
const PrimaryColorPicker = dynamic(
  () => import('@/components/layout/header/PrimaryColorPicker').then(mod => ({ default: mod.PrimaryColorPicker })),
  {
    ssr: false,
    loading: () => <div className="w-8 h-8" />
  }
);

interface SettingsButtonProps {
  className?: string;
}

export function SettingsButton({ className = '' }: SettingsButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { localeMetadata } = useLocale();
  const [theme] = useAtom(themeAtom);
  const [primaryColor] = useAtom(primaryColorAtom);

  const toggleOpen = () => setIsOpen(prev => !prev);

  // 현재 상태 데이터 준비
  const currentLanguageName = localeMetadata.name;
  const currentThemeName = theme === 'dark' ? '다크 모드' : '라이트 모드';
  const currentColorDisplay = primaryColor.split(' ')[0] + '°'; // 색상 값에서 hue 값만 표시

  return (
    <>
      {/* 설정 버튼 */}
      <button
        onClick={toggleOpen}
        className={clsx('flex justify-center items-center', className)}
        aria-label="설정"
      >
        <SettingsIcon className="w-5 h-5 text-muted-foreground" />
      </button>

      {/* 설정 모달 */}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="설정"
        size="sm"
      >
        <div className="space-y-6 min-w-[280px]">
          {/* 언어 스위처 */}
          <div className="grid grid-cols-[1fr_auto_auto] gap-4 items-center justify-items-center">
            <div className="flex flex-col gap-0.5 justify-self-start">
              <span className="text-sm font-medium text-foreground font-multilang">언어</span>
              <span className="text-xs text-muted-foreground font-multilang">표시 언어</span>
            </div>
            <span className="text-sm text-center text-foreground font-multilang">{currentLanguageName}</span>
            <LanguageSwitcher variant="inline" hideChevron className="w-12 h-12 neu-flat text-primary" />
          </div>

          {/* 기본 색상 */}
          <div className="grid grid-cols-[1fr_auto_auto] gap-4 items-center justify-items-center">
            <div className="flex flex-col gap-0.5 justify-self-start">
              <span className="text-sm font-medium text-foreground font-multilang">브랜드 컬러</span>
              <span className="text-xs text-muted-foreground font-multilang">Hue 값</span>
            </div>
            <span className="text-sm text-center text-foreground font-multilang">{currentColorDisplay}</span>
            <PrimaryColorPicker className="w-12 h-12 neu-flat" iconColorClass="text-primary" />
          </div>

          {/* 테마 토글 */}
          <div className="grid grid-cols-[1fr_auto_auto] gap-4 items-center justify-items-center">
            <div className="flex flex-col gap-0.5 justify-self-start">
              <span className="text-sm font-medium text-foreground font-multilang">테마</span>
              <span className="text-xs text-muted-foreground font-multilang">화면 모드</span>
            </div>
            <span className="text-sm text-center text-foreground font-multilang">{currentThemeName}</span>
            <ThemeToggle variant="icon" showLabel={false} className="flex justify-center items-center w-12 h-12 neu-flat" />
          </div>
        </div>
      </Modal>
    </>
  );
} 
