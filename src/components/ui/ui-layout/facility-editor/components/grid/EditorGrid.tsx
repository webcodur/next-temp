// 에디터 그리드 컴포넌트

import { FacilityLayout, EditorState, CELL_SIZE } from '@/types/facility';
import { getCellColor, getTextColor, isCurrentPosition, isSelected } from '../../utils/colorUtils';
import { clsx } from 'clsx';

interface EditorGridProps {
	layout: FacilityLayout;
	editorState: EditorState;
	onCellClick: (x: number, y: number) => void;
	onCellDoubleClick: (x: number, y: number) => void;
}

export const EditorGrid = ({
	layout,
	editorState,
	onCellClick,
	onCellDoubleClick,
}: EditorGridProps) => {
	return (
		<div className="overflow-auto p-4 rounded-lg neu-inset bg-serial-0">
			<div 
				className="relative"
				style={{
					width: layout.gridSize.width * CELL_SIZE,
					height: layout.gridSize.height * CELL_SIZE,
				}}
			>
				{/* 격자 배경 */}
				<div 
					className="absolute inset-0 opacity-20"
					style={{
						backgroundImage: `
							linear-gradient(to right, #ccc 1px, transparent 1px),
							linear-gradient(to bottom, #ccc 1px, transparent 1px)
						`,
						backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`,
					}}
				/>
				
				{/* 셀 렌더링 */}
				{Array.from({ length: layout.gridSize.height }, (_, y) =>
					Array.from({ length: layout.gridSize.width }, (_, x) => {
						const obj = layout.objects.find(o => o.position.x === x && o.position.y === y);
						const currentPos = isCurrentPosition(editorState, x, y);
						const selected = isSelected(editorState, x, y);
						
						return (
							<div
								key={`${x}-${y}`}
								className={clsx(
									'absolute border border-gray-400 flex items-center justify-center text-xs font-medium',
									'transition-all duration-150 cursor-pointer',
									currentPos && 'ring-2 ring-red-500 ring-offset-1',
									selected && 'ring-2 ring-orange-400 ring-offset-1'
								)}
								style={{
									left: x * CELL_SIZE,
									top: y * CELL_SIZE,
									width: CELL_SIZE,
									height: CELL_SIZE,
									backgroundColor: getCellColor(layout, editorState, x, y),
									color: getTextColor(obj),
								}}
								onClick={() => onCellClick(x, y)}
								onDoubleClick={() => onCellDoubleClick(x, y)}
							>
								{obj && (obj.type === 'seat' || obj.type === 'object') && (
									<span className="px-1 truncate font-multilang">
										{obj.name}
									</span>
								)}
							</div>
						);
					})
				)}
			</div>
		</div>
	);
}; 