// #region 사이드바 기본 설정값들
export const defaults = {
	topMenu: 'parking',
	midMenu: 'facility',
	sidebarWidth: 300, // botMenu 텍스트 여유 공간 확보를 위해 증가 (286 → 300)
	leftColumnWidth: 80, // 96 → 80으로 줄임
};

export const styles = {
	leftColWidth: 'w-[80px]', // 96px → 80px로 줄임
	buttonSize: 'w-14 h-14',
	avatarSize: 'w-12 h-12',
	headerHeight: 'h-[70px]',
};

export const animations = {
	sidebarDuration: 200, // 사이드바 슬라이드 애니메이션 지속시간 (ms)
	headerToggleDuration: 200, // 헤더 토글 수직 애니메이션 지속시간 (ms)
};
// #endregion
