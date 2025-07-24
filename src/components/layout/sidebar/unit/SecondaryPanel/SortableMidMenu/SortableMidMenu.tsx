/* 
  파일명: /components/layout/sidebar/unit/SecondaryPanel/SortableMidMenu/SortableMidMenu.tsx
  기능: 드래그 가능한 Mid 메뉴 컨테이너 컴포넌트
  책임: Mid 메뉴와 하위 Bot 메뉴들의 Collapsible 기능과 DND 제공
*/
'use client';

import { ChevronRight } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { usePathname } from 'next/navigation';

import { useTranslations } from '@/hooks/useI18n';
import { getMidMenuId } from '@/hooks/useDragAndDropMenu';
import type { MidMenu } from '@/components/layout/sidebar/types';

import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '@/components/ui/ui-layout/collapsible/Collapsible';

import { SortableBotMenuItem } from './SortableBotMenuItem/SortableBotMenuItem';

interface SortableMidMenuProps {
  midKey: string;
  midItem: MidMenu;
  isExpanded: boolean;
  onToggle: () => void;
  isDynamic?: boolean;
}

export function SortableMidMenu({ 
  midKey, 
  midItem, 
  isExpanded, 
  onToggle,
  isDynamic = false
}: SortableMidMenuProps) {
  const t = useTranslations();
  const pathname = usePathname();
  const id = getMidMenuId(midKey);
  
  const {
    setNodeRef,
  } = useSortable({ 
    id,
    disabled: !isDynamic // 동적 메뉴가 아니면 드래그 비활성화
  });

  return (
    <Collapsible open={isExpanded} onOpenChange={onToggle}>
      <CollapsibleTrigger 
        ref={setNodeRef}
        className="flex justify-between items-center p-2 w-full rounded-lg transition-colors hover:bg-surface-3 neu-raised"
      >
        <span className="font-semibold text-foreground">{t(midItem.key)}</span>
        <ChevronRight
          className={`w-5 h-5 transition-transform duration-200 ${
            isExpanded ? 'rotate-90' : ''}`}
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="px-2 py-1 mt-1 rounded-lg bg-surface-1">
        <ul className="flex flex-col gap-1">
          {midItem.botItems.map((botItem) => {
            const isActive = pathname === botItem.href;
            
            return (
              <SortableBotMenuItem
                key={botItem.key}
                botItem={botItem}
                midKey={midKey}
                isActive={isActive}
                isDynamic={isDynamic}
              />
            );
          })}
        </ul>
      </CollapsibleContent>
    </Collapsible>
  );
} 