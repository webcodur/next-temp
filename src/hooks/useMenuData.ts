import { useAtom } from 'jotai';
import { menuDataAtom, menuLoadingAtom, loadMenuDataAtom } from '@/store/menu';

/**
 * 간단하고 확실한 메뉴 데이터 훅
 */
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
    
    // 디버깅
    debug: () => {
      console.log('🔍 메뉴 상태:', {
        keys: Object.keys(menuData),
        count: Object.keys(menuData).length,
        data: menuData
      });
    }
  };
} 