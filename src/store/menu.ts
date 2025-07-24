import { atom } from 'jotai';
import { menuData as staticMenuData } from '@/data/menuData';
import { getMyMenuList } from '@/services/menu/menu_my_menu$_GET';
import { mapApiIconToComponent } from '@/data/iconMapping';
import type { MenuData, MidMenu, BotMenu } from '@/components/layout/sidebar/types';

/**
 * 메뉴 관련 상태 관리 - 간단하고 확실한 버전
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
 * API 응답을 MenuData로 변환 - 단순하고 확실한 버전
 */
function convertApiToMenuData(apiMenus: ApiMenu[]): MenuData {
  const result: MenuData = {};
  
  // 정적 메뉴 먼저 추가
  Object.entries(staticMenuData).forEach(([key, value]) => {
    result[key] = value;
  });
  
  // API 메뉴 추가 (depth 1만)
  apiMenus.filter(menu => menu.depth === 1).forEach(topMenu => {
    const topKey = topMenu.name;
    const topIcon = mapApiIconToComponent(topMenu.name);
    const midItems: { [key: string]: MidMenu } = {};
    
    if (topMenu.children && topMenu.children.length > 0) {
      // children이 있는 경우 - Mid 메뉴로 분류
      const hasGrandChildren = topMenu.children.some(child => child.children && child.children.length > 0);
      
      if (hasGrandChildren) {
        // 3단계 구조: Top > Mid > Bot
        topMenu.children.forEach(midMenu => {
          if (midMenu.children && midMenu.children.length > 0) {
            const botItems: BotMenu[] = midMenu.children.map(botMenu => ({
              id: botMenu.id, // API ID 보존
              key: botMenu.name,
              href: botMenu.url || '#',
            }));
            
            midItems[midMenu.name] = {
              key: midMenu.name,
              botItems: botItems.sort((a, b) => {
                const aMenu = midMenu.children!.find(m => m.name === a.key);
                const bMenu = midMenu.children!.find(m => m.name === b.key);
                return (aMenu?.sort || 0) - (bMenu?.sort || 0);
              }),
            };
          }
        });
      } else {
        // 2단계 구조: Top > Bot (Mid 생략)
        const botItems: BotMenu[] = topMenu.children.map(botMenu => ({
          id: botMenu.id, // API ID 보존
          key: botMenu.name,
          href: botMenu.url || '#',
        }));
        
        midItems[topKey] = {
          key: topKey,
          botItems: botItems.sort((a, b) => {
            const aMenu = topMenu.children!.find(m => m.name === a.key);
            const bMenu = topMenu.children!.find(m => m.name === b.key);
            return (aMenu?.sort || 0) - (bMenu?.sort || 0);
          }),
        };
      }
    }
    
    result[topKey] = {
      icon: topIcon,
      key: topKey,
      midItems: midItems,
    };
  });
  
  return result;
}

/**
 * 메뉴 로딩 액션 - 간단하고 확실한 버전
 */
export const loadMenuDataAtom = atom(
  null,
  async (get, set, parkingLotId?: number) => {
    try {
      set(menuLoadingAtom, true);
      
      // API 호출
      const response = await getMyMenuList(parkingLotId);
      
      if (response.success && response.data?.menus) {
        const convertedMenuData = convertApiToMenuData(response.data.menus);
        set(menuDataAtom, convertedMenuData);
      } else {
        set(menuDataAtom, staticMenuData);
      }
    } catch (error) {
      console.error('❌ 메뉴 로딩 에러:', error);
      set(menuDataAtom, staticMenuData);
    } finally {
      set(menuLoadingAtom, false);
    }
  }
); 