import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export type Theme = 'light' | 'dark';

export const themeAtom = atomWithStorage<Theme>('theme', 'light');

export const toggleThemeAtom = atom(null, (get, set) => {
	const newTheme = get(themeAtom) === 'light' ? 'dark' : 'light';
	set(themeAtom, newTheme);
	setTheme(newTheme);
});

export const initTheme = () => {
  if (typeof window !== 'undefined') {
    const storedTheme = localStorage.getItem('theme');
    let theme: 'light' | 'dark' = 'light';
    if (storedTheme) {
      try {
        const parsed = JSON.parse(storedTheme);
        theme = parsed === 'dark' || parsed === 'light' ? parsed : 'light';
      } catch {
        theme = 'light';
      }
    }
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.setAttribute('data-theme', theme);
  }
}

const setTheme = (theme: Theme) => {
  console.log('setTheme:', theme)
	if (typeof window !== 'undefined') {
		document.documentElement.classList.toggle('dark', theme === 'dark');
		document.documentElement.setAttribute('data-theme', theme);
	}
};