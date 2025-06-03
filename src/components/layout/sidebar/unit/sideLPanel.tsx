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
			className={`${styles.leftColWidth} h-full bg-gradient-to-b from-muted/90 to-secondary/95 border-r border-border/70 flex-shrink-0`}>
			<div className="w-[80px] px-2 py-3 space-y-2.5">
				{topKeys.map((topKey) => {
					const topItem = menuData[topKey];
					const isActive = topMenu === topKey;

					return (
						<button
							key={topKey}
							onClick={() => onTopClick(topKey)}
							className={`w-full h-14 rounded-xl flex items-center justify-center px-2 ${
								isActive ? 'neumorphic-active' : 'neumorphic-button'
							}`}>
							<topItem.icon
								className={`w-7 h-7 ${
									isActive
										? 'text-primary scale-105'
										: 'text-foreground/80 hover:text-foreground'
								}`}
							/>
						</button>
					);
				})}
			</div>
		</div>
	);
}
// #endregion
