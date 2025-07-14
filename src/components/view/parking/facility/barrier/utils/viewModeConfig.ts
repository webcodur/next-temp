// #region 반응형 그리드 설정
export const getResponsiveGridClass = () => {
	return `grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3`;
};
// #endregion

// #region 로컬 스토리지 관리
const STORAGE_KEY = 'barrier-view-mode-preferences';

export const saveViewModePreferences = (
	preferences: Record<string, unknown>
) => {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
	} catch (error) {
		console.warn('뷰 모드 설정 저장 실패:', error);
	}
};

export const loadViewModePreferences = (): Record<string, unknown> => {
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		return stored ? JSON.parse(stored) : {};
	} catch (error) {
		console.warn('뷰 모드 설정 로드 실패:', error);
		return {};
	}
};
// #endregion
