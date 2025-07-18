/* 
  파일명: /components/layout/PageWrapper.tsx
  기능: 페이지 상단 헤더 컴포넌트
  책임: 페이지 제목과 설명을 동적으로 표시하는 헤더
*/ // ------------------------------
import { ReactNode, useMemo } from 'react';

import { useAtomValue } from 'jotai';
import { usePathname } from 'next/navigation';

import { useTranslations } from '@/hooks/useI18n';
import { currentBotMenuAtom } from '@/store/sidebar';
import { pageTitleAtom, pageDescriptionAtom } from '@/store/page';

import { menuData } from '@/data/menuData';
import Footer from '@/components/layout/footer/Footer';

// #region 상수
const hrefToKeyMap: Record<string, string> = (() => {
  const map: Record<string, string> = {};
  Object.values(menuData).forEach(top => {
    Object.values(top.midItems).forEach(mid => {
      mid.botItems.forEach(item => {
        map[item.href] = item.key;
      });
    });
  });
  return map;
})();
// #endregion

// #region 타입
interface PageWrapperProps {
  children: ReactNode;
}
// #endregion

// #region 메인 컴포넌트
export default function PageWrapper({ children }: PageWrapperProps) {
  // #region 상태
  const pageTitleFromAtom = useAtomValue(pageTitleAtom);
  const currentBotMenu = useAtomValue(currentBotMenuAtom);
  const description = useAtomValue(pageDescriptionAtom);
  const pathname = usePathname();
  // #endregion

  // #region 훅
  const t = useTranslations();
  // #endregion

  // #region 계산된 값
  const title = useMemo(() => {
    // 1) Atom 값 우선 사용
    if (pageTitleFromAtom) return pageTitleFromAtom;

    let key = '';

    // 2) Atom 값
    if (currentBotMenu) key = currentBotMenu;
    // 3) 메뉴 매핑
    else if (hrefToKeyMap[pathname]) key = hrefToKeyMap[pathname];
    // 4) URL 세그먼트
    else {
      const last = pathname.split('/').filter(Boolean).pop();
      key = last ? last.replace(/-/g, ' ') : '';
    }

    if (!key) return '';

    // 언어팩 키는 "메뉴_{key}" 형식
    return t(`메뉴_${key}`);
  }, [pageTitleFromAtom, currentBotMenu, pathname, t]);
  // #endregion

  // #region 렌더링
  return (
    <>
      {/* 페이지 헤더 */}
      {(title || description) && (
        <div className="flex flex-col gap-1 items-center mb-8 text-center">
          {title && <h1 className="text-2xl font-bold">{title}</h1>}
          {description?.trim() && (
            <p> {description} </p>
          )}
        </div>
      )}

      {/* 페이지 콘텐츠 */}
      <div className="flex-1 pb-16">
        {children}
      </div>

      {/* 구분선 */}
      <div className="h-px bg-gradient-to-r from-transparent to-transparent border-t border-border/30 via-border/20"></div>

      {/* 푸터 */}
      <Footer />
    </>
  );
  // #endregion
}
// #endregion 