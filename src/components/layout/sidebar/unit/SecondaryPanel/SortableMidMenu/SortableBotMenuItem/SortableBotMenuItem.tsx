/* 
  파일명: /components/layout/sidebar/unit/SecondaryPanel/SortableMidMenu/SortableBotMenuItem/SortableBotMenuItem.tsx
  기능: Bot 메뉴 아이템 컴포넌트
  책임: 개별 Bot 메뉴 아이템의 렌더링 제공
*/
'use client';

import Link from 'next/link';

import { useTranslations } from '@/hooks/useI18n';
import type { BotMenu } from '@/components/layout/sidebar/types';

interface SortableBotMenuItemProps {
  botItem: BotMenu;
  isActive: boolean;
}

export function SortableBotMenuItem({ 
  botItem, 
  isActive
}: SortableBotMenuItemProps) {
  const t = useTranslations();

  return (
    <li className="relative group">
      <Link
        href={botItem.href}
        className={`block p-2 rounded-md text-sm transition-colors duration-200 ${
          isActive
            ? 'text-primary-foreground bg-primary'
            : 'text-foreground hover:bg-surface-3'
        }`}
      >
        {t(botItem.key)}
      </Link>
    </li>
  );
} 