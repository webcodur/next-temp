import { menuData } from '@/data/menuData';
import { styles } from '@/data/sidebarConfig';

/**
 * 사이드바 시작 패널 Props 타입
 */
interface SideStartPanelProps {
	topMenu: string; // 현재 선택된 Top 메뉴 키
	onTopClick: (topKey: string) => void; // Top 메뉴 클릭 핸들러
}

/**
 * 사이드바 시작 패널 컴포넌트
 * - Top 메뉴들을 세로로 나열하여 표시
 * - 아이콘 형태의 버튼으로 구성
 * - 선택된 메뉴는 활성화 스타일 적용
 */

// #region side_start_panel: 사이드바 시작 패널 컴포넌트
export function SideStartPanel({ topMenu, onTopClick }: SideStartPanelProps) {
	// 전체 Top 메뉴 키 목록 추출
	const topKeys = Object.keys(menuData);

	return (
		<div
			className={`${styles.startColWidth} h-full border-e border-border/20 shrink-0`}>
			<div className="flex flex-col items-center px-3 py-3 space-y-3 w-full">
				{topKeys.map((topKey) => {
					const topItem = menuData[topKey];
					const isActive = topMenu === topKey;

					return (
						<button
							key={topKey}
							type="button"
							onClick={(e) => {
								e.preventDefault();
								e.stopPropagation();
								onTopClick(topKey);
							}}
							className={`w-full h-12 rounded-xl flex items-center justify-center px-2 transition-all duration-200 group ${isActive ? 'neu-inset' : 'neu-raised'}`}>
							{/* Top 메뉴 아이콘 */}
							<topItem.icon
								className={`w-6 h-6 transition-all duration-200 ${
									isActive ? 'neu-icon-active' : 'neu-icon-inactive'
								} `}
							/>
						</button>
					);
				})}
			</div>
		</div>
	);
}
// #endregion 