import { menuData } from '@/data/menuData';
import { styles } from '@/data/sidebarConfig';

interface SideLPanelProps {
	topMenu: string;
	onTopClick: (topKey: string) => void;
}

// #region side_Lpanel: 사이드바 좌측 패널 컴포넌트
export function SideLPanel({ topMenu, onTopClick }: SideLPanelProps) {
	const topKeys = Object.keys(menuData);

	return (
		<div
			className={`${styles.leftColWidth} flex flex-col border-r border-border/70 bg-gradient-to-b from-muted/90 to-secondary/95 flex-shrink-0`}>
			{/* side_Lpanel: top 메뉴 버튼들 */}
			<div className="flex flex-col flex-1 w-full px-2 py-2 space-y-2">
				{topKeys.map((topKey) => {
					const topItem = menuData[topKey];
					const isActive = topMenu === topKey;

					return (
						<button
							key={topKey}
							onClick={() => onTopClick(topKey)}
							className={`
								w-full h-11 rounded-xl flex items-center justify-center px-3 relative
								${isActive ? 'neumorphic-active' : 'neumorphic-button'}
							`}>
							{/* 아이콘만 표시 */}
							<topItem.icon
								className={`w-5 h-5 relative z-10 ${isActive ? 'drop-shadow-md scale-105 text-primary transition-all duration-300 ease-in-out' : 'text-foreground/80 hover:text-foreground'}`}
							/>
						</button>
					);
				})}
			</div>
		</div>
	);
}
// #endregion
