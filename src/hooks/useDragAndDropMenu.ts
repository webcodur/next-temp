/* 
  파일명: /hooks/useDragAndDropMenu.ts
  기능: 메뉴 드래그 앤 드롭 관리 훅
  책임: 사이드바 메뉴의 순서 변경 및 API 동기화
  
  주요 기능:
  - 같은 카테고리 내 하위 메뉴 순서 변경
  - 변경된 순서를 API로 서버에 동기화
  - 로딩 상태 관리
  - 카테고리 간 이동 차단
*/ // ------------------------------

import { useState, useCallback } from 'react';
import { DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { updateMenuOrder } from '@/services/menu/menu@menuId_order_PUT';
import type { BotMenu, MidMenu } from '@/components/layout/sidebar/types';

// #region 헬퍼 함수
// Bot 메뉴 ID에서 Mid 키 추출
function extractMidKeyFromBotId(botId: string): string {
  const parts = botId.split('-');
  return parts.length >= 3 ? parts[1] : '';
}

// Bot 메뉴 고유 ID 생성
export function getBotMenuId(midKey: string, botKey: string): string {
  return `bot-${midKey}-${botKey}`;
}

// Mid 메뉴 고유 ID 생성
export function getMidMenuId(midKey: string): string {
  return `mid-${midKey}`;
}
// #endregion

// #region 메인 훅
// 메뉴 드래그 앤 드롭 기능을 위한 커스텀 훅
export function useDragAndDropMenu() {
  const [isOrderUpdating, setIsOrderUpdating] = useState(false);

  // API와 메뉴 순서 동기화
  const syncMenuOrderWithAPI = useCallback(async (botItems: BotMenu[]) => {
    try {
      setIsOrderUpdating(true);
      
      // ID가 있는 동적 메뉴만 필터링
      const menuItems = botItems.filter(item => item.id);
      
      if (menuItems.length === 0) {
        console.log('순서 변경할 동적 메뉴가 없음');
        return;
      }
      
      // 각 메뉴의 순서를 개별적으로 업데이트 (병렬 처리)
      const promises = menuItems.map((item, index) => 
        updateMenuOrder(item.id!, index + 1)
      );
      
      const responses = await Promise.all(promises);
      const failedCount = responses.filter(r => !r.success).length;
      
      if (failedCount === 0) {
        console.log('✅ 메뉴 순서 저장 완료');
      } else {
        console.error(`❌ 메뉴 순서 저장 실패: ${failedCount}개`);
      }
    } catch (error) {
      console.error('❌ 메뉴 순서 저장 중 오류:', error);
    } finally {
      setIsOrderUpdating(false);
    }
  }, []);

  // 드래그 종료 이벤트 핸들러
  const handleDragEnd = useCallback(async (
    event: DragEndEvent,
    midItems: { [key: string]: MidMenu },
    onReorder: (newMidItems: { [key: string]: MidMenu }) => void
  ) => {
    const { active, over } = event;
    
    // 드롭 대상이 없거나 같은 위치면 무시
    if (!over || active.id === over.id) return;

    // 드래그한 요소와 드롭 대상의 카테고리 확인
    const activeMidKey = extractMidKeyFromBotId(active.id as string);
    const overMidKey = extractMidKeyFromBotId(over.id as string);
    
    // 카테고리 간 이동 차단
    if (activeMidKey !== overMidKey) {
      console.log('카테고리 간 이동은 지원되지 않습니다');
      return;
    }
    
    const midMenu = midItems[activeMidKey];
    if (!midMenu) return;
    
    // 드래그한 요소와 드롭 대상의 인덱스 찾기
    const activeIndex = midMenu.botItems.findIndex(item => 
      getBotMenuId(activeMidKey, item.key) === active.id
    );
    const overIndex = midMenu.botItems.findIndex(item => 
      getBotMenuId(overMidKey, item.key) === over.id
    );
    
    if (activeIndex === -1 || overIndex === -1) return;
    
    // 로컬 상태 즉시 업데이트 (UI 반응성 보장)
    const newBotItems = arrayMove(midMenu.botItems, activeIndex, overIndex);
    const newMidItems = {
      ...midItems,
      [activeMidKey]: {
        ...midMenu,
        botItems: newBotItems
      }
    };
    
    onReorder(newMidItems);
    
    // 서버와 비동기 동기화
    await syncMenuOrderWithAPI(newBotItems);
  }, [syncMenuOrderWithAPI]);

  return {
    isOrderUpdating,
    handleDragEnd,
  };
}
// #endregion 