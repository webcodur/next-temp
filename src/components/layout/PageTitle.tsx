import { useAtomValue } from 'jotai';
import { currentBotMenuAtom } from '@/store/sidebar';
import { usePathname } from 'next/navigation';
import { menuData } from '@/data/menuData';

// 페이지 상단 중앙 타이틀 컴포넌트
export default function PageTitle() {
  const currentBotMenu = useAtomValue(currentBotMenuAtom);
  const pathname = usePathname();

  // 기본 타이틀: currentBotMenuAtom 값
  let title = currentBotMenu;

  // Fallback: menuData 전체에서 href 매칭 검색
  if (!title) {
    outer: for (const topItem of Object.values(menuData)) {
      for (const midItem of Object.values(topItem.midItems)) {
        const found = midItem.botItems.find(b => b.href === pathname);
        if (found) {
          title = found.key;
          break outer;
        }
      }
    }
  }

  // 최종 Fallback: pathname 마지막 세그먼트
  if (!title) {
    title = pathname.split('/').filter(Boolean).pop()?.replace(/-/g, ' ') ?? '';
  }

  // 타이틀이 없으면 렌더링 생략
  if (!title) return null;

  return (
    <h1 className="mb-10 text-3xl font-bold text-center font-multilang">
      {title}
    </h1>
  );
} 