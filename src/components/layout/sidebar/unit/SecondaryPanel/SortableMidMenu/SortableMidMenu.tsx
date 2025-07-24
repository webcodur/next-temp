/* 
  파일명: /components/layout/sidebar/unit/SecondaryPanel/SortableMidMenu/SortableMidMenu.tsx
  기능: 드래그 가능한 Mid 메뉴 컨테이너 컴포넌트
  책임: Mid 메뉴와 하위 Bot 메뉴들의 Collapsible 기능과 DND 제공
*/
'use client';

import { ChevronRight, GripVertical } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
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
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div 
      ref={setNodeRef}
      style={style}
      className={`group ${isDragging ? 'z-50' : ''}`}
    >
      <Collapsible open={isExpanded} onOpenChange={onToggle}>
        <div className={`flex items-center gap-2 p-2 w-full rounded-lg transition-colors ${
          isDynamic ? 'hover:bg-surface-3' : ''} neu-raised`}>
          {/* 드래그 핸들 (동적 메뉴만) */}
          {isDynamic && (
            <div
              {...attributes}
              {...listeners}
              className="flex flex-shrink-0 justify-center items-center w-4 h-4 opacity-0 transition-opacity cursor-grab active:cursor-grabbing group-hover:opacity-100"
            >
              <GripVertical className="w-3 h-3 transition-colors text-muted-foreground hover:text-foreground" />
            </div>
          )}
          
          <CollapsibleTrigger className="flex flex-1 justify-between items-center">
            <span className="font-semibold text-foreground">{t(midItem.key)}</span>
            <ChevronRight
              className={`w-5 h-5 transition-transform duration-200 ${
                isExpanded ? 'rotate-90' : ''}`}
            />
          </CollapsibleTrigger>
        </div>
        
        <CollapsibleContent className="px-2 py-1 mt-1 rounded-lg bg-surface-1">
          <ul className="flex flex-col">
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
    </div>
  );
} 