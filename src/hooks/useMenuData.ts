/* 
  파일명: /hooks/useMenuData.ts
  기능: 메뉴 데이터 관리 훅
  책임: 메뉴 로딩, 상태 조회, 디버깅 기능
  
  주요 기능:
  - 메뉴 데이터 상태 조회
  - 로딩 상태 확인
  - 메뉴 데이터 다시 로드
  - 디버깅용 상태 출력
*/ // ------------------------------

import { useAtom } from 'jotai';
import { menuDataAtom, menuLoadingAtom, loadMenuDataAtom } from '@/store/menu';

// 간단하고 확실한 메뉴 데이터 훅
export function useMenuData() {
  const [menuData] = useAtom(menuDataAtom);
  const [loading] = useAtom(menuLoadingAtom);
  const [, loadMenuData] = useAtom(loadMenuDataAtom);

  return {
    menuData,
    loading,
    error: null, // 에러 처리 단순화
    
    // 액션
    loadMenuData, // 메뉴 로딩
    
    // 디버깅용 메뉴 상태 출력
    debug: () => {
      console.log('🔍 메뉴 상태:', {
        keys: Object.keys(menuData),
        count: Object.keys(menuData).length,
        data: menuData
      });
    }
  };
} 