/* 
  파일명: /components/layout/PageHeader.tsx
  기능: 페이지 상단 헤더 컴포넌트
  책임: 페이지 제목과 설명을 동적으로 표시하는 헤더
*/ // ------------------------------
import { useMemo } from 'react';

import { useAtomValue } from 'jotai';
import { usePathname } from 'next/navigation';

import { useTranslations } from '@/hooks/useI18n';
import { currentBotMenuAtom } from '@/store/sidebar';
import { pageTitleAtom, pageDescriptionAtom } from '@/store/page';

import { menuData } from '@/data/menuData';

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

// #region 메인 컴포넌트
export default function PageHeader() {
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
  // 타이틀과 설명이 모두 없으면 렌더 스킵
  if (!title && !description) return null;

  return (
    <div className="flex flex-col gap-1 items-center text-center">
      {title && <h1 className="text-2xl font-bold">{title}</h1>}
      {description?.trim() && (
        <p> {description} </p>
      )}
    </div>
  );
  // #endregion
}
// #endregion 