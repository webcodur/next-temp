/* 
  파일명: /components/layout/sidebar/unit/SecondaryPanel/MidMenu/MidMenu.tsx
  기능: Mid 메뉴 컨테이너 컴포넌트
  책임: Mid 메뉴와 하위 Bot 메뉴들의 Collapsible 기능 제공
*/
'use client';

import { ChevronRight } from 'lucide-react';
import { usePathname } from 'next/navigation';

import { useTranslations } from '@/hooks/useI18n';
import type { MidMenu } from '@/components/layout/sidebar/types';

import { BotMenuItem } from './BotMenuItem/BotMenuItem';

interface MidMenuProps {
  midItem: MidMenu;
  isExpanded: boolean;
  onToggle: () => void;
}

export function MidMenu({ 
  midItem, 
  isExpanded, 
  onToggle
}: MidMenuProps) {
  const t = useTranslations();
  const pathname = usePathname();

  return (
    <div className="group">
      <button 
        onClick={onToggle}
        className="flex gap-2 items-center justify-between p-2 w-full rounded-lg hover:bg-serial-4 neu-raised cursor-pointer"
      >
        <span className="font-semibold text-foreground">{t(midItem.key)}</span>
        <ChevronRight
          className={`w-6 h-6 transition-transform duration-200 ${
            isExpanded ? 'rotate-90' : ''}`}
        />
      </button>
      
      <div 
        className={`
          overflow-hidden transition-all duration-300 ease-in-out
          px-2 py-1 mt-1 rounded-lg bg-serial-2
          ${isExpanded 
            ? 'max-h-96 opacity-100' 
            : 'max-h-0 opacity-0 py-0'
          }
        `}
      >
        <ul className="flex flex-col">
          {midItem.botItems.map((botItem) => {
            const isActive = pathname === botItem.href;
            
            return (
              <BotMenuItem
                key={botItem.key}
                botItem={botItem}
                isActive={isActive}
              />
            );
          })}
        </ul>
      </div>
    </div>
  );
} 