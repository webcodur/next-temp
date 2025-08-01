import { usePathname } from 'next/navigation';
import { getPageHeaderData, getPageTitle } from '@/utils/pageTitle';

/**
 * 현재 경로에 따른 페이지 헤더 정보를 반환하는 훅
 */
export function usePageHeader() {
  const pathname = usePathname();
  return getPageHeaderData(pathname);
}

/**
 * 현재 경로에 따른 페이지 타이틀을 반환하는 훅
 */
export function usePageTitle(pageType?: 'list' | 'detail' | 'create' | 'edit') {
  const pathname = usePathname();
  return getPageTitle(pathname, pageType);
}