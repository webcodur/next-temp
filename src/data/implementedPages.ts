/**
 * 실제 구현된 페이지들의 목록
 * 이 페이지들은 동적 라우트 생성에서 제외되고, 정적 라우트로 처리됩니다.
 */
export const implementedPages = [
	// UI-표시
	'/lab/ui-display/card',
	'/lab/ui-display/toast',
	'/lab/ui-display/modal',
	'/lab/ui-display/search-filter',
	'/lab/ui-display/tooltip',
	'/lab/ui-display/barrier-3d',

	// UI-입력
	'/lab/ui-input/datepicker',
	'/lab/ui-input/editor',

	// UI-탐색
	'/lab/ui-navigation/tabs',
	'/lab/ui-navigation/pagination',
	'/lab/ui-navigation/stepper',
	'/lab/ui-navigation/infinite-scroll',

	// UI-데이터
	'/lab/ui-data/timeline',

	// UI-레이아웃
	'/lab/ui-layout/carousel',
	'/lab/ui-layout/drag-and-drop',
] as const;

/**
 * 페이지가 실제로 구현되었는지 확인
 */
export function isImplementedPage(href: string): boolean {
	return implementedPages.includes(href as any);
}

/**
 * 구현된 페이지들의 href 목록 반환
 */
export function getImplementedPageHrefs(): readonly string[] {
	return implementedPages;
}
