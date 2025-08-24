import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export type ENUM_Theme = 'light' | 'dark';

// 테마 상태 (localStorage 저장)
export const themeAtom = atomWithStorage<ENUM_Theme>('theme', 'light');

// 테마 토글
export const toggleThemeAtom = atom(null, (get, set) => {
	const newTheme = get(themeAtom) === 'light' ? 'dark' : 'light';
	set(themeAtom, newTheme);
	setTheme(newTheme);
});

// 테마 초기화
export const initTheme = () => {
  if (typeof window !== 'undefined') {
    const storedTheme = localStorage.getItem('theme');
    const theme: ENUM_Theme = storedTheme === 'dark' ? 'dark' : 'light';
    setTheme(theme);
  }
};

// 테마 적용
const setTheme = (theme: ENUM_Theme) => {
	if (typeof window !== 'undefined') {
		document.documentElement.classList.toggle('dark', theme === 'dark');
		document.documentElement.setAttribute('data-theme', theme);
	}
};