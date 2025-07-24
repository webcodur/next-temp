import { useState, useCallback } from 'react';
import { DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { updateBatchMenuOrder } from '@/services/menu/menu_batch_order_PUT';
import type { BotMenu, MidMenu } from '@/components/layout/sidebar/types';

/**
 * 메뉴 드래그 앤 드롭 기능을 위한 커스텀 훅 (단순화)
 */
export function useDragAndDropMenu() {
  const [isOrderUpdating, setIsOrderUpdating] = useState(false);

  /**
   * 드래그 끝 핸들러 (단순화)
   */
  const handleDragEnd = useCallback(async (
    event: DragEndEvent,
    midItems: { [key: string]: MidMenu },
    onReorder: (newMidItems: { [key: string]: MidMenu }) => void
  ) => {
    const { active, over } = event;
    
    if (!over || active.id === over.id) return;

    // 같은 카테고리 내 Bot 메뉴 순서 변경만 처리
    const activeMidKey = extractMidKeyFromBotId(active.id as string);
    const overMidKey = extractMidKeyFromBotId(over.id as string);
    
    if (activeMidKey !== overMidKey) {
      console.log('카테고리 간 이동은 지원되지 않습니다');
      return;
    }
    
    const midMenu = midItems[activeMidKey];
    if (!midMenu) return;
    
    const activeIndex = midMenu.botItems.findIndex(item => 
      getBotMenuId(activeMidKey, item.key) === active.id
    );
    const overIndex = midMenu.botItems.findIndex(item => 
      getBotMenuId(overMidKey, item.key) === over.id
    );
    
    if (activeIndex === -1 || overIndex === -1) return;
    
    // 로컬 상태 업데이트
    const newBotItems = arrayMove(midMenu.botItems, activeIndex, overIndex);
    const newMidItems = {
      ...midItems,
      [activeMidKey]: {
        ...midMenu,
        botItems: newBotItems
      }
    };
    
    onReorder(newMidItems);
    
    // API 호출로 서버 순서 동기화
    await syncMenuOrderWithAPI(newBotItems);
  }, []);

  /**
   * API와 메뉴 순서 동기화 (단순화)
   */
  const syncMenuOrderWithAPI = useCallback(async (botItems: BotMenu[]) => {
    try {
      setIsOrderUpdating(true);
      
      const orderItems = botItems
        .filter(item => item.id)
        .map((item, index) => ({
          menuId: item.id!,
          order: index + 1
        }));
      
      if (orderItems.length === 0) {
        console.log('순서 변경할 동적 메뉴가 없음');
        return;
      }
      
      const response = await updateBatchMenuOrder(orderItems);
      
      if (response.success) {
        console.log('✅ 메뉴 순서 저장 완료');
      } else {
        console.error('❌ 메뉴 순서 저장 실패:', response.errorMsg);
      }
    } catch (error) {
      console.error('❌ 메뉴 순서 저장 중 오류:', error);
    } finally {
      setIsOrderUpdating(false);
    }
  }, []);

  return {
    isOrderUpdating,
    handleDragEnd,
  };
}

/**
 * Bot 메뉴 ID에서 Mid 키 추출
 */
function extractMidKeyFromBotId(botId: string): string {
  // bot-{midKey}-{botKey} 형태에서 midKey 추출
  const parts = botId.split('-');
  return parts.length >= 3 ? parts[1] : '';
}

/**
 * Bot 메뉴 ID 생성
 */
export function getBotMenuId(midKey: string, botKey: string): string {
  return `bot-${midKey}-${botKey}`;
}

/**
 * Mid 메뉴 ID 생성
 */
export function getMidMenuId(midKey: string): string {
  return `mid-${midKey}`;
} 