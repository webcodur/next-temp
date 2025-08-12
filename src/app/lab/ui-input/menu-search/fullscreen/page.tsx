/**
 * 메뉴 검색 컴포넌트 전체화면 데모 페이지
 * - 전체화면 모드로 MenuSearch 컴포넌트를 보여주는 데모
 */

'use client';

import { useRouter } from 'next/navigation';
import MenuSearch from '@/components/view/_etc/menu-search/MenuSearch';

export default function MenuSearchFullscreenDemo() {
  const router = useRouter();

  const handleSelectionComplete = () => {
    // 전체화면 모드에서는 선택 완료 시 이전 페이지로 돌아갈 수 있음
    console.log('메뉴 선택 완료');
  };

  return (
    <MenuSearch
      isModal={false}
      onSelectionComplete={handleSelectionComplete}
      defaultQuery=""
    />
  );
}
