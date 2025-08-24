import {
	FacilityLayout as OldFacilityLayout,
	GridObject,
} from '@/types/facility/core';
import {
	FacilityLayout as NewFacilityLayout,
	GridCell,
	ENUM_CellType,
} from '@/types/facility-editor';

// #region 타입 변환 함수

// 기존 FacilityLayout을 새로운 FacilityLayout으로 변환
export const convertOldToNew = (
	oldLayout: OldFacilityLayout
): NewFacilityLayout => {
	// 기존 objects를 새로운 cells로 변환
	const cells: GridCell[] = [];

	oldLayout.objects.forEach((obj: GridObject) => {
		const cellType: ENUM_CellType =
			obj.type === 'seat' ? 'seat' : obj.type === 'object' ? 'object' : 'empty';

		// 객체 크기에 따라 여러 셀 생성 (현재는 1x1만 지원)
		cells.push({
			x: obj.position.x,
			y: obj.position.y,
			type: cellType,
			name: obj.type === 'space' ? '' : obj.name,
		});
	});

	return {
		gridSize: oldLayout.gridSize,
		cells,
		cellSize: oldLayout.cellSize,
	};
};

// 새로운 FacilityLayout을 기존 FacilityLayout으로 변환
export const convertNewToOld = (
	newLayout: NewFacilityLayout,
	baseLayout: OldFacilityLayout
): OldFacilityLayout => {
	// 새로운 cells를 기존 objects로 변환
	const objects: GridObject[] = [];

	newLayout.cells.forEach((cell: GridCell) => {
		const id = `${cell.type}-${cell.x}-${cell.y}`;

		if (cell.type === 'seat') {
			objects.push({
				type: 'seat',
				id,
				name: cell.name,
				size: { width: 1, height: 1 },
				status: 'available',
				reservable: true,
				position: { x: cell.x, y: cell.y },
			});
		} else if (cell.type === 'object') {
			objects.push({
				type: 'object',
				id,
				name: cell.name,
				size: { width: 1, height: 1 },
				reservable: false,
				position: { x: cell.x, y: cell.y },
			});
		}
		// empty 타입은 객체를 생성하지 않음
	});

	return {
		...baseLayout,
		gridSize: newLayout.gridSize,
		objects,
		cellSize: newLayout.cellSize,
		updatedAt: new Date(),
	};
};

// #endregion
