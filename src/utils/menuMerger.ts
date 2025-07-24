import { menuData } from '@/data/menuData';
import { mapApiIconToComponent } from '@/data/iconMapping';
import type { MenuData, MidMenu, BotMenu } from '@/components/layout/sidebar/types';

/**
 * API 응답에서 받은 메뉴 데이터의 타입 정의
 */
export interface ApiMenuResponse {
  success: boolean;
  data: {
    menus: ApiMenu[];
    userRole?: string;
    parkingLotInfo?: {
      id: number;
      name: string;
      code?: string;
    };
  };
  errorMsg?: string;
}

export interface ApiMenu {
  id: number;
  name: string;
  key?: string;
  icon?: string;
  url?: string; // href 대신 url 사용
  sort: number; // order 대신 sort 사용
  parentId?: number;
  children?: ApiMenu[];
  depth: number; // level 대신 depth 사용
}

/**
 * 실제 API 메뉴를 내부 메뉴 구조로 변환하는 함수 (중첩 구조 처리)
 */
export function convertApiMenuToMenuData(apiMenus: ApiMenu[]): MenuData {
  const convertedMenuData: MenuData = {};
  
  // depth 1 (Top Menu) 처리
  const topMenus = apiMenus.filter(menu => menu.depth === 1);
  
  topMenus.forEach(topMenu => {
    const topKey = topMenu.key || topMenu.name;
    const topIcon = mapApiIconToComponent(topMenu.icon || topMenu.name);
    
    const midItems: { [key: string]: MidMenu } = {};
    
    // children에서 Mid 메뉴들 처리 (depth 2 or children이 있는 것들)
    if (topMenu.children && topMenu.children.length > 0) {
      // children을 Mid 메뉴와 Bot 메뉴로 분류
      const midMenus = topMenu.children.filter(child => 
        child.children && child.children.length > 0 // children이 있으면 Mid 메뉴
      );
      const directBotMenus = topMenu.children.filter(child => 
        !child.children || child.children.length === 0 // children이 없으면 직접 Bot 메뉴
      );
      
      // Mid 메뉴들 처리
      midMenus.forEach(midMenu => {
        const midKey = midMenu.key || midMenu.name;
        
        const botItems: BotMenu[] = midMenu.children!.map(botMenu => ({
          key: botMenu.key || botMenu.name,
          href: botMenu.url || '#',
          icon: botMenu.icon ? mapApiIconToComponent(botMenu.icon) : undefined,
        }));
        
        // sort 순서로 정렬
        botItems.sort((a, b) => {
          const aMenu = midMenu.children!.find(m => (m.key || m.name) === a.key);
          const bMenu = midMenu.children!.find(m => (m.key || m.name) === b.key);
          return (aMenu?.sort || 0) - (bMenu?.sort || 0);
        });
        
        midItems[midKey] = {
          key: midKey,
          botItems: botItems,
        };
      });
      
      // 직접 Bot 메뉴들이 있으면 기본 Mid 그룹 생성
      if (directBotMenus.length > 0) {
        const defaultMidKey = '메뉴'; // 또는 topKey와 같은 이름 사용
        
        const botItems: BotMenu[] = directBotMenus.map(botMenu => ({
          key: botMenu.key || botMenu.name,
          href: botMenu.url || '#',
          icon: botMenu.icon ? mapApiIconToComponent(botMenu.icon) : undefined,
        }));
        
        // sort 순서로 정렬
        botItems.sort((a, b) => {
          const aMenu = directBotMenus.find(m => (m.key || m.name) === a.key);
          const bMenu = directBotMenus.find(m => (m.key || m.name) === b.key);
          return (aMenu?.sort || 0) - (bMenu?.sort || 0);
        });
        
        midItems[defaultMidKey] = {
          key: defaultMidKey,
          botItems: botItems,
        };
      }
    }
    
    convertedMenuData[topKey] = {
      icon: topIcon,
      key: topKey,
      midItems: midItems,
    };
  });
  
  return convertedMenuData;
}

/**
 * 정적 메뉴와 동적 메뉴를 병합하는 함수
 * @param dynamicMenuData API에서 받은 동적 메뉴 데이터
 * @param preserveStaticOrder 정적 메뉴의 순서를 유지할지 여부 (기본값: true)
 * @returns 병합된 메뉴 데이터
 */
export function mergeMenuData(
  dynamicMenuData: MenuData, 
  preserveStaticOrder: boolean = true
): MenuData {
  const mergedMenuData: MenuData = {};
  
  if (preserveStaticOrder) {
    // 정적 메뉴를 먼저 추가
    Object.entries(menuData).forEach(([key, value]) => {
      mergedMenuData[key] = value;
    });
    
    // 동적 메뉴 추가 (겹치는 키는 동적 메뉴로 덮어씀)
    Object.entries(dynamicMenuData).forEach(([key, value]) => {
      mergedMenuData[key] = value;
    });
  } else {
    // 동적 메뉴를 먼저 추가
    Object.entries(dynamicMenuData).forEach(([key, value]) => {
      mergedMenuData[key] = value;
    });
    
    // 정적 메뉴 추가 (겹치는 키는 정적 메뉴로 덮어씀)
    Object.entries(menuData).forEach(([key, value]) => {
      mergedMenuData[key] = value;
    });
  }
  
  return mergedMenuData;
}

/**
 * API 응답을 받아서 최종 메뉴 데이터를 생성하는 헬퍼 함수
 * @param apiResponse API 응답 객체
 * @param preserveStaticOrder 정적 메뉴 순서 유지 여부
 * @returns 최종 메뉴 데이터 또는 null (에러 시)
 */
export function processApiMenuResponse(
  apiResponse: ApiMenuResponse, 
  preserveStaticOrder: boolean = true
): MenuData | null {
  if (!apiResponse.success || !apiResponse.data.menus) {
    console.error('API 메뉴 응답 처리 실패:', apiResponse.errorMsg);
    return null;
  }
  
  try {
    const dynamicMenuData = convertApiMenuToMenuData(apiResponse.data.menus);
    return mergeMenuData(dynamicMenuData, preserveStaticOrder);
  } catch (error) {
    console.error('메뉴 데이터 변환 중 오류:', error);
    return null;
  }
}

/**
 * 메뉴 데이터의 유효성을 검증하는 함수
 * @param menuData 검증할 메뉴 데이터
 * @returns 유효성 검증 결과
 */
export function validateMenuData(menuData: MenuData): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  // 기본 구조 검증
  if (!menuData || typeof menuData !== 'object') {
    errors.push('메뉴 데이터가 유효한 객체가 아닙니다.');
    return { isValid: false, errors };
  }
  
  // Top 메뉴 검증
  Object.entries(menuData).forEach(([topKey, topItem]) => {
    if (!topItem.key || !topItem.icon) {
      errors.push(`Top 메뉴 '${topKey}'에 필수 속성이 누락되었습니다.`);
    }
    
    if (!topItem.midItems || typeof topItem.midItems !== 'object') {
      errors.push(`Top 메뉴 '${topKey}'의 midItems가 유효하지 않습니다.`);
      return;
    }
    
    // Mid 메뉴 검증
    Object.entries(topItem.midItems).forEach(([midKey, midItem]) => {
      if (!midItem.key) {
        errors.push(`Mid 메뉴 '${midKey}'에 key가 누락되었습니다.`);
      }
      
      if (!Array.isArray(midItem.botItems)) {
        errors.push(`Mid 메뉴 '${midKey}'의 botItems가 배열이 아닙니다.`);
        return;
      }
      
      // Bot 메뉴 검증
      midItem.botItems.forEach((botItem, index) => {
        if (!botItem.key || !botItem.href) {
          errors.push(`Bot 메뉴 '${midKey}[${index}]'에 필수 속성이 누락되었습니다.`);
        }
      });
    });
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * 메뉴 데이터를 localStorage에 캐시하는 함수
 * @param menuData 캐시할 메뉴 데이터
 * @param version 메뉴 버전 (선택사항)
 */
export function cacheMenuData(menuData: MenuData, version?: string): void {
  try {
    const cacheData = {
      menuData,
      version: version || Date.now().toString(),
      timestamp: Date.now(),
    };
    localStorage.setItem('cachedMenuData', JSON.stringify(cacheData));
  } catch (error) {
    console.warn('메뉴 데이터 캐시 저장 실패:', error);
  }
}

/**
 * localStorage에서 캐시된 메뉴 데이터를 불러오는 함수
 * @param maxAge 캐시 최대 유지 시간 (밀리초, 기본값: 1시간)
 * @returns 캐시된 메뉴 데이터 또는 null
 */
export function getCachedMenuData(maxAge: number = 60 * 60 * 1000): {
  menuData: MenuData;
  version: string;
} | null {
  try {
    const cached = localStorage.getItem('cachedMenuData');
    if (!cached) return null;
    
    const cacheData = JSON.parse(cached);
    const now = Date.now();
    
    if (now - cacheData.timestamp > maxAge) {
      localStorage.removeItem('cachedMenuData');
      return null;
    }
    
    return {
      menuData: cacheData.menuData,
      version: cacheData.version,
    };
  } catch (error) {
    console.warn('캐시된 메뉴 데이터 로딩 실패:', error);
    localStorage.removeItem('cachedMenuData');
    return null;
  }
}

/**
 * 메뉴 캐시를 클리어하는 함수
 */
export function clearMenuCache(): void {
  try {
    localStorage.removeItem('cachedMenuData');
  } catch (error) {
    console.warn('메뉴 캐시 클리어 실패:', error);
  }
} 