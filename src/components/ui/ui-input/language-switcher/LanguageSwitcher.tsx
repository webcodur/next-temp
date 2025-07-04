'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useLocale } from '@/hooks/useI18n';
import { localeMetadata } from '@/lib/i18n';
import { clsx } from 'clsx';

interface LanguageSwitcherProps {
  variant?: 'header' | 'sidebar' | 'inline';
  className?: string;
}

export function LanguageSwitcher({ variant = 'header', className = '' }: LanguageSwitcherProps) {
  const { currentLocale, changeLocale, availableLocales } = useLocale();
  const [isOpen, setIsOpen] = useState(false);

  const currentMeta = localeMetadata[currentLocale];
  
  const baseClasses = 'relative inline-block text-left';
  const variantClasses = {
    header: 'text-sm',
    sidebar: 'w-full text-sm',
    inline: 'text-xs',
  };

  return (
    <div className={clsx(baseClasses, variantClasses[variant])}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          'inline-flex justify-center items-center text-sm font-medium text-foreground',
          className
        )}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Image 
          src={currentMeta.flag} 
          alt={currentMeta.name}
          width={32}
          height={20}
          className="object-cover rounded"
        />
      </button>

      {isOpen && (
        <>
          {/* 오버레이 - 불투명 배경 */}
          <div 
            className="fixed inset-0 z-10 backdrop-blur-sm bg-black/20" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* 드롭다운 메뉴 - 중앙 정렬 */}
          <div 
            className="absolute left-1/2 transform -translate-x-1/2 z-20 mt-2 min-w-[80px] rounded-lg ring-1 ring-black ring-opacity-5 shadow-lg neu-flat focus:outline-hidden"
            role="menu"
            aria-orientation="vertical"
          >
            <div className="py-1" role="none">
              {availableLocales.map((locale) => {
                const meta = localeMetadata[locale];
                const isActive = locale === currentLocale;
                
                return (
                  <button
                    key={locale}
                    onClick={() => {
                      changeLocale(locale);
                      setIsOpen(false);
                    }}
                    className={clsx(
                      'flex justify-center items-center px-4 py-3 w-full text-sm transition-colors duration-150 group',
                      isActive ? 'bg-brand/10' : 'hover:bg-muted'
                    )}
                    role="menuitem"
                    dir={meta.dir}
                  >
                    <div className={clsx(
                      isActive && 'rounded-lg neu-inset'
                    )}>
                      <Image 
                        src={meta.flag} 
                        alt={meta.name}
                        width={48}
                        height={32}
                        className="object-cover rounded"
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
} 