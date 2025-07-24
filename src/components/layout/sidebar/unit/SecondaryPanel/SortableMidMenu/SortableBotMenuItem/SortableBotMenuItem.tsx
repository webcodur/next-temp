/* 
  파일명: /components/layout/sidebar/unit/SecondaryPanel/SortableMidMenu/SortableBotMenuItem/SortableBotMenuItem.tsx
  기능: 드래그 가능한 Bot 메뉴 아이템 컴포넌트
  책임: 개별 Bot 메뉴 아이템의 렌더링과 DND 기능 제공
*/
'use client';

import Link from 'next/link';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

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
    disabled: !isDynamic // 동적 메뉴가 아니면 드래그 비활성화
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? 'none' : transition, // 드래그 중일 때는 transition 제거
    opacity: isDragging ? 0.3 : 1, // 드래그 중일 때 더 투명하게
    zIndex: isDragging ? 1000 : 1, // 드래그 중일 때 위에 표시
  };

  return (
    <li 
      ref={setNodeRef} 
      style={style} 
      className="group relative"
    >
      {isDynamic ? (
        // 동적 메뉴: 드래그와 클릭 분리
        <div className="relative">
          {/* 드래그 핸들 영역 (투명한 오버레이) */}
          <div
            className="absolute inset-0 z-10 cursor-grab active:cursor-grabbing"
            {...attributes}
            {...listeners}
          />
          {/* 클릭 가능한 링크 */}
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
        </div>
      ) : (
        // 정적 메뉴: 클릭만
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