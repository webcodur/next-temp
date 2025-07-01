'use client';

import { useState } from 'react';
import { ChevronDown, Globe } from 'lucide-react';
import { useLocale } from '@/hooks/useI18n';
import { localeMetadata } from '@/lib/i18n';

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
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex gap-2 items-center text-sm font-medium text-foreground rounded-lg transition-all duration-200 neu-raised hover:neu-inset ${
          variant === 'header' ? 'p-2' : 'px-3 py-2'
        }`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {variant === 'header' ? (
          <span className="text-lg">{currentMeta.flag}</span>
        ) : (
          <Globe size={16} />
        )}
        {variant !== 'header' && (
          <>
            <span className="hidden sm:inline">{currentMeta.name}</span>
            <span className="sm:hidden">{currentMeta.flag}</span>
          </>
        )}
        <ChevronDown 
          size={14} 
          className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <>
          {/* 오버레이 */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* 드롭다운 메뉴 */}
          <div 
            className="absolute right-0 z-20 mt-2 w-48 rounded-lg ring-1 ring-black ring-opacity-5 shadow-lg neu-flat focus:outline-hidden"
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
                    className={`
                      group flex items-center gap-3 w-full px-4 py-2 text-sm text-left
                      ${isActive 
                        ? 'font-medium text-primary bg-primary/10' 
                        : 'text-foreground hover:bg-muted'
                      }
                      transition-colors duration-150
                    `}
                    role="menuitem"
                    dir={meta.dir}
                  >
                    <span className="text-lg">{meta.flag}</span>
                    <span className="flex-1">{meta.name}</span>
                    {isActive && (
                      <div className="w-2 h-2 bg-primary rounded-full" />
                    )}
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