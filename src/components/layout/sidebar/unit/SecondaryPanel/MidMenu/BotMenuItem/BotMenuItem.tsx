/* 
  파일명: /components/layout/sidebar/unit/SecondaryPanel/MidMenu/BotMenuItem/BotMenuItem.tsx
  기능: Bot 메뉴 아이템 컴포넌트
  책임: 개별 Bot 메뉴 아이템의 렌더링
*/
'use client';

import Link from 'next/link';

import { useTranslations } from '@/hooks/useI18n';
import type { BotMenu } from '@/components/layout/sidebar/types';

interface BotMenuItemProps {
  botItem: BotMenu;
  isActive: boolean;
}

export function BotMenuItem({ 
  botItem, 
  isActive
}: BotMenuItemProps) {
  const t = useTranslations();

  return (
    <li className="relative">
      <Link
        href={botItem.href}
        className={`block p-2 rounded-md text-sm ${
          isActive
            ? 'text-primary-foreground bg-primary'
            				: 'text-foreground hover:bg-serial-4'
        }`}
      >
        {t(botItem.key)}
      </Link>
    </li>
  );
} 