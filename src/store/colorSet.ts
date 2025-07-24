import { atom } from 'jotai';

// 6개 색상 세트 정의 (라이트/다크 모드별 최적화)
export const COLOR_SETS = {
  'pink-purple': { 
    primary: { light: '320 85% 55%', dark: '320 80% 75%' },
    secondary: { light: '280 80% 60%', dark: '280 75% 80%' },
    name: '로맨틱 핑크'
  },
  'coral-orange': { 
    primary: { light: '15 85% 55%', dark: '15 80% 75%' },
    secondary: { light: '55 80% 60%', dark: '55 75% 80%' },
    name: '에너제틱 코랄'
  },
  'indigo-violet': { 
    primary: { light: '220 85% 55%', dark: '220 80% 75%' },
    secondary: { light: '260 80% 60%', dark: '260 75% 80%' },
    name: '프로페셔널 인디고'
  },
  'teal-cyan': { 
    primary: { light: '180 85% 40%', dark: '180 80% 65%' },
    secondary: { light: '220 80% 45%', dark: '220 75% 70%' },
    name: '모던 틸'
  },
  'lime-green': { 
    primary: { light: '90 85% 40%', dark: '90 80% 65%' },
    secondary: { light: '130 80% 45%', dark: '130 75% 70%' },
    name: '프레시 라임'
  },
  'rose-red': { 
    primary: { light: '350 85% 55%', dark: '350 80% 75%' },
    secondary: { light: '30 80% 60%', dark: '30 75% 80%' },
    name: '패셔너블 로즈'
  }
} as const;

export type ColorSetKey = keyof typeof COLOR_SETS;

// 단순한 atom (기본값만)
export const colorSetAtom = atom<ColorSetKey>('pink-purple'); 