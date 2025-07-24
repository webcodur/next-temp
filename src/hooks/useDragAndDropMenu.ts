/* 
  파일명: /hooks/useDragAndDropMenu.ts
  기능: 메뉴 드래그 앤 드롭 관리 훅
  책임: 사이드바 메뉴의 순서 변경 및 API 동기화
  
  주요 기능:
  - 같은 카테고리 내 하위 메뉴 순서 변경
  - Mid 메뉴와 Bot 메뉴 모두 드래그 지원
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

// ID에서 메뉴 타입 추출
function getMenuType(id: string): 'mid' | 'bot' | null {
  if (id.startsWith('mid-')) return 'mid';
  if (id.startsWith('bot-')) return 'bot';
  return null;
}
// #endregion

// #region 메인 훅
// 메뉴 드래그 앤 드롭 기능을 위한 커스텀 훅
export function useDragAndDropMenu() {
  const [isOrderUpdating, setIsOrderUpdating] = useState(false);

  // API와 메뉴 순서 동기화 (Bot 메뉴용)
  const syncBotMenuOrderWithAPI = useCallback(async (botItems: BotMenu[]) => {
    try {
      setIsOrderUpdating(true);
      
      // ID가 있는 동적 메뉴만 필터링
      const menuItems = botItems.filter(item => item.id && typeof item.id === 'number');
      
      if (menuItems.length === 0) {
        console.log('순서 변경할 동적 Bot 메뉴가 없음');
        return;
      }
      
      console.log(`🔄 Bot 메뉴 순서 변경 API 호출: ${menuItems.length}개`);
      
      // 각 메뉴의 순서를 개별적으로 업데이트 (병렬 처리)
      const promises = menuItems.map((item, index) => {
        console.log(`  └ Bot 메뉴 ${item.key}(id: ${item.id}) → ${index + 1}번째`);
        return updateMenuOrder(item.id!, index + 1);
      });
      
      const responses = await Promise.all(promises);
      const failedResponses = responses.filter(r => !r.success);
      const failedCount = failedResponses.length;
      
      if (failedCount === 0) {
        console.log('✅ Bot 메뉴 순서 저장 완료');
      } else {
        console.error(`❌ Bot 메뉴 순서 저장 실패: ${failedCount}개`);
        failedResponses.forEach((response, index) => {
          console.error(`  └ 실패한 응답 ${index + 1}:`, response.errorMsg);
        });
      }
    } catch (error) {
      console.error('❌ Bot 메뉴 순서 저장 중 오류:', error);
    } finally {
      setIsOrderUpdating(false);
    }
  }, []);

  // API와 메뉴 순서 동기화 (Mid 메뉴용)
  const syncMidMenuOrderWithAPI = useCallback(async (midKeys: string[], allMidItems: { [key: string]: MidMenu }) => {
    try {
      setIsOrderUpdating(true);
      
      // ID가 있는 동적 Mid 메뉴만 필터링
      const menuItems = midKeys
        .map(key => allMidItems[key])
        .filter(item => item.id && typeof item.id === 'number');
      
      if (menuItems.length === 0) {
        console.log('순서 변경할 동적 Mid 메뉴가 없음');
        return;
      }
      
      console.log(`🔄 Mid 메뉴 순서 변경 API 호출: ${menuItems.length}개`);
      
      // 각 메뉴의 순서를 개별적으로 업데이트 (병렬 처리)
      const promises = menuItems.map((item, index) => {
        console.log(`  └ Mid 메뉴 ${item.key}(id: ${item.id}) → ${index + 1}번째`);
        return updateMenuOrder(item.id!, index + 1);
      });
      
      const responses = await Promise.all(promises);
      const failedResponses = responses.filter(r => !r.success);
      const failedCount = failedResponses.length;
      
      if (failedCount === 0) {
        console.log('✅ Mid 메뉴 순서 저장 완료');
      } else {
        console.error(`❌ Mid 메뉴 순서 저장 실패: ${failedCount}개`);
        failedResponses.forEach((response, index) => {
          console.error(`  └ 실패한 응답 ${index + 1}:`, response.errorMsg);
        });
      }
    } catch (error) {
      console.error('❌ Mid 메뉴 순서 저장 중 오류:', error);
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

    const activeType = getMenuType(active.id as string);
    const overType = getMenuType(over.id as string);
    
    // 타입이 다르면 무시
    if (activeType !== overType) {
      console.log('다른 타입 간 이동은 지원되지 않습니다');
      return;
    }

    if (activeType === 'bot') {
      // Bot 메뉴 드래그 처리
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
      await syncBotMenuOrderWithAPI(newBotItems);
      
    } else if (activeType === 'mid') {
      // Mid 메뉴 드래그 처리
      const midKeys = Object.keys(midItems);
      const activeIndex = midKeys.findIndex(key => getMidMenuId(key) === active.id);
      const overIndex = midKeys.findIndex(key => getMidMenuId(key) === over.id);
      
      if (activeIndex === -1 || overIndex === -1) return;
      
      // 순서 변경
      const newMidKeys = arrayMove(midKeys, activeIndex, overIndex);
      const newMidItems: { [key: string]: MidMenu } = {};
      
      newMidKeys.forEach(key => {
        newMidItems[key] = midItems[key];
      });
      
      onReorder(newMidItems);
      
      // 서버와 비동기 동기화
      await syncMidMenuOrderWithAPI(newMidKeys, midItems);
    }
  }, [syncBotMenuOrderWithAPI, syncMidMenuOrderWithAPI]);

  return {
    isOrderUpdating,
    handleDragEnd,
  };
}
// #endregion 