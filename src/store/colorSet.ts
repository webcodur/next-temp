import { atomWithStorage } from 'jotai/utils';

// 6개 색상 세트 정의 (라이트/다크 모드별 최적화)
export const COLOR_SETS = {
  'pink-purple': { 
    primary: { light: '320 85% 55%', dark: '320 80% 75%' },
    secondary: { light: '310 80% 60%', dark: '310 75% 80%' },
    name: '로맨틱 핑크'
  },
  'coral-orange': { 
    primary: { light: '15 85% 55%', dark: '15 80% 75%' },
    secondary: { light: '25 80% 60%', dark: '25 75% 80%' },
    name: '에너제틱 코랄'
  },
  'indigo-violet': { 
    primary: { light: '220 85% 55%', dark: '220 80% 75%' },
    secondary: { light: '235 80% 60%', dark: '235 75% 80%' },
    name: '프로페셔널 인디고'
  },
  'teal-cyan': { 
    primary: { light: '180 85% 40%', dark: '180 80% 65%' },
    secondary: { light: '190 80% 45%', dark: '190 75% 70%' },
    name: '모던 틸'
  },
  'lime-green': { 
    primary: { light: '90 85% 40%', dark: '90 80% 65%' },
    secondary: { light: '105 80% 45%', dark: '105 75% 70%' },
    name: '프레시 라임'
  },
  'rose-red': { 
    primary: { light: '350 85% 55%', dark: '350 80% 75%' },
    secondary: { light: '340 80% 60%', dark: '340 75% 80%' },
    name: '패셔너블 로즈'
  }
} as const;

export type ColorSetKey = keyof typeof COLOR_SETS;

// localStorage와 자동 동기화되는 atom
export const colorSetAtom = atomWithStorage<ColorSetKey>('color-set', 'pink-purple'); 