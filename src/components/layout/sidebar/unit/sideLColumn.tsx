import { menuData } from '@/data/menuData';
import { styles } from '@/data/sidebarConfig';

interface SideLColumnProps {
	topMenu: string;
	onTopClick: (topKey: string) => void;
}

// #region side_Lcol: 사이드바 좌측 컬럼 컴포넌트
export function SideLColumn({ topMenu, onTopClick }: SideLColumnProps) {
	const topKeys = Object.keys(menuData);

	return (
		<div
			className={`${styles.leftColWidth} flex flex-col border-r border-border/60 bg-gradient-to-b from-gray-100/90 to-gray-200/95 flex-shrink-0`}>
			{/* side_Lcol: top 메뉴 버튼들 */}
			<div className="flex flex-col flex-1 w-full px-2 py-3 space-y-2">
				{topKeys.map((topKey) => {
					const topItem = menuData[topKey];
					const isActive = topMenu === topKey;

					return (
						<button
							key={topKey}
							onClick={() => onTopClick(topKey)}
							className={`
								w-full h-11 rounded-xl 
								flex items-center px-3 relative
								border border-white/60
								${
									isActive
										? 'bg-gradient-to-br from-white/95 to-gray-50/95 text-primary shadow-[inset_3px_3px_6px_rgba(0,0,0,0.15),inset_-3px_-3px_6px_rgba(255,255,255,0.9)] scale-[0.98] transition-all duration-300 ease-in-out transform-gpu'
										: 'bg-gradient-to-br from-white/70 to-gray-100/70 shadow-[3px_3px_7px_rgba(0,0,0,0.15),-3px_-3px_7px_rgba(255,255,255,0.9)] text-foreground/90 hover:text-foreground hover:shadow-[inset_-1px_-1px_3px_rgba(255,255,255,1),inset_1px_1px_3px_rgba(0,0,0,0.1),3px_3px_10px_rgba(0,0,0,0.2),-3px_-3px_10px_rgba(255,255,255,1)] hover:bg-gradient-to-br hover:from-white/80 hover:to-gray-50/80 hover:scale-[0.99] active:scale-[0.97] active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.2),inset_-2px_-2px_4px_rgba(255,255,255,0.9)] transition-transform duration-300 ease-in-out transform-gpu'
								}
								before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-br before:from-white/30 before:to-transparent before:opacity-0 hover:before:opacity-100
							`}>
							{/* 좌측 열: 아이콘 */}
							<div className="flex items-center justify-center flex-shrink-0 w-5 mr-2">
								<topItem.icon
									className={`w-5 h-5 relative z-10 ${isActive ? 'drop-shadow-md scale-105 text-primary transition-all duration-300 ease-in-out' : 'text-foreground/80 hover:text-foreground'}`}
								/>
							</div>
							{/* 우측 열: 타이틀 텍스트 */}
							<div className="flex items-center justify-center flex-1">
								<span
									className={`text-sm font-medium relative z-10 truncate ${isActive ? 'font-semibold drop-shadow-md transition-all duration-300 ease-in-out' : ''}`}>
									{topItem.label}
								</span>
							</div>
						</button>
					);
				})}
			</div>

			{/* side_Lcol: 하단 사용자 아바타 */}
			<div className="px-2 py-3 border-t border-border/60">
				<div className="flex items-center gap-3 p-2 rounded-xl bg-gradient-to-br from-white/80 to-gray-50/80 shadow-[3px_3px_7px_rgba(0,0,0,0.15),-3px_-3px_7px_rgba(255,255,255,0.9)] border border-white/40 hover:shadow-[inset_-1px_-1px_2px_rgba(255,255,255,1),inset_1px_1px_2px_rgba(0,0,0,0.1),2px_2px_8px_rgba(0,0,0,0.2),-2px_-2px_8px_rgba(255,255,255,1)] hover:bg-gradient-to-br hover:from-white/90 hover:to-gray-50/90 hover:scale-[1.01] transition-transform duration-300 ease-in-out cursor-pointer">
					<div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-primary/40 to-primary/15 shadow-[inset_2px_2px_3px_rgba(0,0,0,0.15),inset_-2px_-2px_3px_rgba(255,255,255,0.8)] transition-all duration-300 ease-in-out">
						<span className="text-xs font-semibold text-primary drop-shadow-md">
							U
						</span>
					</div>
					<span className="text-sm font-medium truncate text-foreground/90 drop-shadow-sm">
						사용자
					</span>
				</div>
			</div>
		</div>
	);
}
// #endregion
