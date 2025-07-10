// #region 사이드바 기본 설정값들
export const defaults = {
	topMenu: 'parking',
	midMenu: 'facility',
	startColumnWidth: 80, // 시작 패널 너비
	collapsedWidth: 0, // 접혔을 때 끝 패널 너비
	expandedWidth: 220, // 펼쳐졌을 때 끝 패널 너비
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
};
// #endregion
