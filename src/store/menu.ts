import { atom } from 'jotai';
import { menuData as staticMenuData } from '@/data/menuData';
import type { MenuData } from '@/components/layout/sidebar/types';

/**
 * 메뉴 관련 상태 관리 - 정적 데이터만 사용
 */

// 현재 메뉴 데이터
export const menuDataAtom = atom<MenuData>(staticMenuData); 