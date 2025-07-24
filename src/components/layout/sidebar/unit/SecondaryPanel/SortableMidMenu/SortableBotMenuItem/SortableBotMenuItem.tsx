/* 
  파일명: /components/layout/sidebar/unit/SecondaryPanel/SortableMidMenu/SortableBotMenuItem/SortableBotMenuItem.tsx
  기능: 드래그 가능한 Bot 메뉴 아이템 컴포넌트
  책임: 개별 Bot 메뉴 아이템의 렌더링과 DND 기능 제공
*/
'use client';

import Link from 'next/link';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

import { useTranslations } from '@/hooks/useI18n';
import { getBotMenuId } from '@/hooks/useDragAndDropMenu';
import type { BotMenu } from '@/components/layout/sidebar/types';

interface SortableBotMenuItemProps {
  botItem: BotMenu;
  midKey: string;
  isActive: boolean;
  isDynamic?: boolean;
}

export function SortableBotMenuItem({ 
  botItem, 
  midKey, 
  isActive, 
  isDynamic = false
}: SortableBotMenuItemProps) {
  const t = useTranslations();
  const id = getBotMenuId(midKey, botItem.key);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id,
    disabled: !isDynamic
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? 'none' : transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 1,
  };

  return (
    <li 
      ref={setNodeRef} 
      style={style} 
      className="group relative"
    >
      {isDynamic ? (
        <div className={`flex items-center gap-2 p-2 rounded-md text-sm transition-colors ${
          isActive
            ? 'text-primary-foreground bg-primary'
            : 'text-foreground hover:bg-surface-3'
        }`}>
          {/* 드래그 핸들 */}
          <div
            {...attributes}
            {...listeners}
            className="flex flex-shrink-0 justify-center items-center w-4 h-4 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <GripVertical className="w-3 h-3 text-muted-foreground hover:text-foreground transition-colors" />
          </div>
          
          {/* 클릭 가능한 링크 */}
          <Link
            href={botItem.href}
            className="flex-1"
          >
            {t(botItem.key)}
          </Link>
        </div>
      ) : (
        <Link
          href={botItem.href}
          className={`block p-2 rounded-md text-sm transition-colors ${
            isActive
              ? 'text-primary-foreground bg-primary'
              : 'text-foreground hover:bg-surface-3'
          }`}
        >
          {t(botItem.key)}
        </Link>
      )}
    </li>
  );
} 