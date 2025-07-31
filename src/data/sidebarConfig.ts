// #region 사이드바 기본 설정값들
export const defaults = {
	topMenu: 'parking',
	midMenu: 'facility',
	startColumnWidth: 92, // 시작 패널 너비 (80 * 1.15)
	collapsedWidth: 0, // 접혔을 때 끝 패널 너비
	expandedWidth: 253, // 펼쳐졌을 때 끝 패널 너비 (220 * 1.15)
	// 리사이즈 관련 설정
	minResizeWidth: 207, // 최소 리사이즈 너비 (180 * 1.15)
	maxResizeWidth: 517, // 최대 리사이즈 너비 (450 * 1.15)
};

export const styles = {
	startColWidth: 'w-[80px]', // 96px → 80px로 줄임
	buttonSize: 'w-14 h-14',
	avatarSize: 'w-12 h-12',
	headerHeight: 'h-[70px]',
};

export const animations = {
	sidebarDuration: 200, // 사이드바 슬라이드 애니메이션 지속시간 (ms)
	headerToggleDuration: 200, // 헤더 토글 수직 애니메이션 지속시간 (ms)
	resizeTransition: 100, // 리사이즈 핸들 트랜지션 지속시간 (ms)
};
// #endregion
