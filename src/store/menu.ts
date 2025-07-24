import { atom } from 'jotai';
import { menuData as staticMenuData } from '@/data/menuData';
import { getParkingLotMenuList } from '@/services/menu/menu_parking_lot@parkinglotId_GET';
import { mapApiIconToComponent } from '@/data/iconMapping';
import type { MenuData, MidMenu, BotMenu } from '@/components/layout/sidebar/types';

/**
 * 메뉴 관련 상태 관리
 */

// 현재 메뉴 데이터
export const menuDataAtom = atom<MenuData>(staticMenuData);

// 메뉴 로딩 상태  
export const menuLoadingAtom = atom<boolean>(false);

/**
 * API 메뉴 구조 타입
 */
interface ApiMenu {
  id: number;
  name: string;
  url?: string;
  sort: number;
  children?: ApiMenu[];
  depth: number;
}

/**
 * 기존 정적 데이터 구조 분석:
 * menuData = {
 *   topKey: {
 *     icon: Icon,
 *     key: 'topKey',
 *     midItems: {
 *       midKey: {
 *         key: 'midKey',
 *         botItems: [
 *           { key: 'botKey', href: '/path' }
 *         ]
 *       }
 *     }
 *   }
 * }
 * 
 * API 데이터 구조:
 * - depth 1: Top 메뉴
 * - depth 2: Mid 메뉴 (children 있을 수도, 없을 수도)
 * - depth 3: Bot 메뉴
 */

/**
 * API 응답을 MenuData 형식으로 변환
 * 정적 메뉴 + 동적 메뉴 합성
 */
function convertApiToMenuData(apiMenus: ApiMenu[]): MenuData {
  // 1. 정적 메뉴로 시작
  const result: MenuData = { ...staticMenuData };
  
  // 2. API에서 Top 메뉴들 추출 (depth: 1)
  const topMenus = apiMenus.filter(menu => menu.depth === 1);
  
  // 3. 각 Top 메뉴 처리
  topMenus.forEach(topMenu => {
    const topKey = topMenu.name;
    const midItems: { [key: string]: MidMenu } = {};
    
    // 4. Mid 메뉴들 처리 (depth: 2)
    if (topMenu.children && topMenu.children.length > 0) {
      const midMenus = topMenu.children.filter(child => child.depth === 2);
      
      midMenus.forEach(midMenu => {
        const midKey = midMenu.name;
        
        // 5. Bot 메뉴들 처리 (depth: 3)
        const botItems: BotMenu[] = [];
        if (midMenu.children && midMenu.children.length > 0) {
          const botMenus = midMenu.children.filter(child => child.depth === 3);
          
          botMenus.forEach(botMenu => {
            botItems.push({
              id: botMenu.id,
              key: botMenu.name,
              href: botMenu.url || '#',
            });
          });
          
          // sort 정렬
          botItems.sort((a, b) => {
            const aBot = botMenus.find(bot => bot.name === a.key);
            const bBot = botMenus.find(bot => bot.name === b.key);
            return (aBot?.sort || 0) - (bBot?.sort || 0);
          });
        }
        
        // 6. Mid 메뉴 생성
        midItems[midKey] = {
          key: midKey,
          botItems: botItems,
        };
      });
    }
    
    // 7. Top 메뉴 생성  
    result[topKey] = {
      icon: mapApiIconToComponent(topKey),
      key: topKey,
      midItems: midItems,
    };
  });
  
  return result;
}

/**
 * 메뉴 로딩 액션
 */
export const loadMenuDataAtom = atom(
  null,
  async (get, set, parkingLotId?: number) => {
    set(menuLoadingAtom, true);
    
    try {
      if (!parkingLotId) {
        set(menuDataAtom, staticMenuData);
        return;
      }

      const result = await getParkingLotMenuList(parkingLotId);
      
      if (result.success && result.data?.menus) {
        const convertedMenuData = convertApiToMenuData(result.data.menus);
        set(menuDataAtom, convertedMenuData);
      } else {
        set(menuDataAtom, staticMenuData);
      }
    } catch (error) {
      console.error('메뉴 로딩 오류:', error);
      set(menuDataAtom, staticMenuData);
    } finally {
      set(menuLoadingAtom, false);
    }
  }
); 