import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export type Theme = 'light' | 'dark';

// 테마 상태 (로컬스토리지 동기화)
export const themeAtom = atomWithStorage<Theme>('theme', 'light');

// 테마 토글 액션 (브랜드 스케일 업데이트 포함)
export const toggleThemeAtom = atom(null, (get, set) => {
	const newTheme = get(themeAtom) === 'light' ? 'dark' : 'light';
	set(themeAtom, newTheme);

	// DOM에 테마 클래스 적용
	if (typeof window !== 'undefined') {
		document.documentElement.classList.toggle('dark', newTheme === 'dark');
		document.documentElement.setAttribute('data-theme', newTheme);
		
		// 테마 변경 시 브랜드 스케일 재계산
		// 브랜드 색상을 다시 읽어서 새로운 테마에 맞게 스케일 업데이트
		const brandColor = getComputedStyle(document.documentElement)
			.getPropertyValue('--brand').trim();
		if (brandColor) {
			// 브랜드 업데이트 함수가 있다면 호출
			const event = new CustomEvent('themeChanged', { detail: { theme: newTheme, brandColor } });
			window.dispatchEvent(event);
		}
	}
});

// 테마 초기화 액션 (클라이언트 사이드에서만 실행)
export const initThemeAtom = atom(null, (get) => {
	if (typeof window !== 'undefined') {
		const theme = get(themeAtom);
		document.documentElement.classList.toggle('dark', theme === 'dark');
		document.documentElement.setAttribute('data-theme', theme);
	}
});
