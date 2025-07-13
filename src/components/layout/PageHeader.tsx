import { useAtomValue } from 'jotai';
import { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { currentBotMenuAtom } from '@/store/sidebar';
import { pageTitleAtom, pageDescriptionAtom } from '@/store/page';
import { menuData } from '@/data/menuData';
// i18n
import { useTranslations } from '@/hooks/useI18n';

/* -------------------------------------------------------------------------- */
/* utils                                                                      */
/* -------------------------------------------------------------------------- */

// menuData를 한 번만 순회해 href → key 매핑 생성
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

/* -------------------------------------------------------------------------- */
/* component                                                                  */
/* -------------------------------------------------------------------------- */

// 페이지 상단 중앙 헤더 (타이틀 + 설명)
export default function PageHeader() {
  const pageTitleFromAtom = useAtomValue(pageTitleAtom);
  const currentBotMenu = useAtomValue(currentBotMenuAtom);
  const description = useAtomValue(pageDescriptionAtom);
  const pathname = usePathname();

  // 다국어 메시지 훅
  const t = useTranslations();

  // 타이틀 계산: 1) Atom 2) 메뉴 매핑 3) URL 세그먼트
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
} 