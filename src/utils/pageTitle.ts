import { menuData } from '@/data/menuData';
import type { MenuData, MidMenu, BotMenu } from '@/components/layout/sidebar/types';

/**
 * 현재 경로를 기반으로 메뉴 데이터에서 페이지 타이틀을 찾는다
 */
export function getPageTitleFromPath(pathname: string): string | null {
  // 메뉴 데이터를 재귀적으로 탐색하여 href와 일치하는 항목 찾기
  function findMenuItemByPath(data: MenuData): BotMenu | null {
    for (const topKey in data) {
      const topItem = data[topKey];
      if (topItem?.midItems) {
        for (const midKey in topItem.midItems) {
          const midItem = topItem.midItems[midKey];
          if (midItem?.botItems) {
            for (const botItem of midItem.botItems) {
              if (botItem.href === pathname) {
                return botItem;
              }
            }
          }
        }
      }
    }
    return null;
  }

  const menuItem = findMenuItemByPath(menuData);
  return menuItem?.key || null;
}

/**
 * 경로와 페이지 타입에 따라 완전한 페이지 타이틀을 생성한다
 */
export function getPageTitle(pathname: string, pageType?: 'list' | 'detail' | 'create' | 'edit'): string {
  const baseTitle = getPageTitleFromPath(pathname);
  
  if (!baseTitle) {
    // 메뉴에서 찾지 못한 경우 경로 기반으로 추정
    const segments = pathname.split('/').filter(Boolean);
    const lastSegment = segments[segments.length - 1];
    
    // 일반적인 페이지 타입별 처리
    switch (lastSegment) {
      case 'create':
        return `${segments[segments.length - 2]} 등록`;
      case 'edit':
        return `${segments[segments.length - 2]} 수정`;
      default:
        if (lastSegment && !isNaN(Number(lastSegment))) {
          // 숫자로 끝나면 상세 페이지
          return `${segments[segments.length - 2]} 상세`;
        }
        return lastSegment || '페이지';
    }
  }

  // 메뉴에서 찾은 경우 페이지 타입에 따라 접미사 추가
  switch (pageType) {
    case 'detail':
      return `${baseTitle} 상세`;
    case 'create':
      return `${baseTitle} 등록`;
    case 'edit':
      return `${baseTitle} 수정`;
    case 'list':
    default:
      return baseTitle;
  }
}

/**
 * 특정 경로 패턴에 대한 페이지 타이틀과 서브타이틀을 반환한다
 */
export function getPageHeaderData(pathname: string): { title: string; subtitle?: string } {
  // 상세 페이지 패턴 감지 (숫자로 끝나는 경우)
  const segments = pathname.split('/').filter(Boolean);
  const lastSegment = segments[segments.length - 1];
  
  if (!isNaN(Number(lastSegment))) {
    // 상세 페이지
    const listPath = segments.slice(0, -1).join('/');
    const baseTitle = getPageTitleFromPath(`/${listPath}`);
    
    return {
      title: `${baseTitle || '상세'} 상세`,
      subtitle: `${baseTitle || '항목'}의 상세 정보를 조회하고 관리합니다.`
    };
  }
  
  if (lastSegment === 'create') {
    // 등록 페이지
    const listPath = segments.slice(0, -1).join('/');
    const baseTitle = getPageTitleFromPath(`/${listPath}`);
    
    return {
      title: `${baseTitle || '항목'} 등록`,
      subtitle: `새로운 ${baseTitle || '항목'}을 등록합니다.`
    };
  }
  
  // 목록 페이지
  const baseTitle = getPageTitleFromPath(pathname);
  
  if (baseTitle) {
    return {
      title: baseTitle,
      subtitle: getDefaultSubtitle(baseTitle)
    };
  }
  
  return {
    title: '페이지',
    subtitle: '페이지 정보를 관리합니다.'
  };
}

/**
 * 기본 서브타이틀을 생성한다
 */
function getDefaultSubtitle(title: string): string {
  // 특정 페이지에 대한 맞춤 서브타이틀
  const subtitleMap: Record<string, string> = {
    '위반 차량': '주차장 내 차량 위반 기록을 조회하고 관리합니다.',
    '근무자관리 (R)': '시스템 관리자 계정 등록, 수정, 삭제 및 권한 관리',
    '호실관리': '주차장 내 호실 정보를 관리합니다.',
    '입주세대관리': '주차장 내 입주세대 정보를 관리합니다.',
    '입주민관리': '주차장 내 입주민 정보를 관리합니다.',
    // 필요에 따라 추가...
  };
  
  return subtitleMap[title] || `${title} 정보를 관리합니다.`;
}