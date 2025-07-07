import { useState } from 'react';
import dynamic from 'next/dynamic';
import LanguageSwitcher from '@/components/ui/ui-input/language-switcher/LanguageSwitcher';
import { ThemeToggle } from '@/components/ui/ui-layout/theme-toggle/ThemeToggle';
import { Settings as SettingsIcon } from 'lucide-react';
import clsx from 'clsx';
import Modal from '@/components/ui/ui-layout/modal/Modal';

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

  const toggleOpen = () => setIsOpen(prev => !prev);

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
        <div className="space-y-4 min-w-[250px]">
          {/* 언어 스위처 */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-foreground font-multilang">언어</span>
            <LanguageSwitcher variant="inline" hideChevron className="w-12 h-12 neu-flat text-primary" />
          </div>

          {/* 기본 색상 */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-foreground font-multilang">브랜드 컬러</span>
            <PrimaryColorPicker className="w-12 h-12 neu-flat" iconColorClass="text-primary" />
          </div>

          {/* 테마 토글 */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-foreground font-multilang">테마</span>
            <ThemeToggle variant="icon" showLabel={false} className="flex justify-center items-center w-12 h-12 neu-flat" />
          </div>
        </div>
      </Modal>
    </>
  );
} 
