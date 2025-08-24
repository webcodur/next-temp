// 객체 배치 관련 커스텀 훅

import { FacilityLayout, ENUM_ObjectType, GridObject } from '@/types/facility';
import { getDefaultObjectName } from '../utils/gridUtils';

export const useObjectPlacement = (
	layout: FacilityLayout,
	onLayoutChange: (layout: FacilityLayout) => void,
	addToHistory: (layout: FacilityLayout) => void,
	selectedCells: Array<{ x: number; y: number }>,
	currentPosition: { x: number; y: number }
) => {
	const placeObject = (type: ENUM_ObjectType) => {
		const newObjects = [...layout.objects];
		const cellsToPlace =
			selectedCells.length > 0
				? selectedCells
				: [{ x: currentPosition.x, y: currentPosition.y }];

		cellsToPlace.forEach((cell) => {
			// 기존 객체 제거
			const existingIndex = newObjects.findIndex(
				(obj) => obj.position.x === cell.x && obj.position.y === cell.y
			);
			if (existingIndex !== -1) {
				newObjects.splice(existingIndex, 1);
			}

			// 새 객체 추가 (타입에 따라 다른 구조)
			let newObject: GridObject;
			const baseId = `${type}-${Date.now()}-${cell.x}-${cell.y}`;

			if (type === 'seat') {
				newObject = {
					id: baseId,
					type: 'seat',
					name: getDefaultObjectName(type, newObjects.length),
					size: { width: 1, height: 1 },
					position: { x: cell.x, y: cell.y },
					status: 'available' as const,
					reservable: true,
				};
			} else if (type === 'space') {
				newObject = {
					id: baseId,
					type: 'space',
					size: { width: 1, height: 1 },
					position: { x: cell.x, y: cell.y },
					reservable: false,
				};
			} else {
				// type === 'object'
				newObject = {
					id: baseId,
					type: 'object',
					name: getDefaultObjectName(type, newObjects.length),
					size: { width: 1, height: 1 },
					position: { x: cell.x, y: cell.y },
					reservable: false,
				};
			}

			newObjects.push(newObject);
		});

		const newLayout = { ...layout, objects: newObjects };
		addToHistory(newLayout);
		onLayoutChange(newLayout);
	};

	const deleteObject = () => {
		const newObjects = layout.objects.filter((obj) => {
			const cellsToDelete =
				selectedCells.length > 0 ? selectedCells : [currentPosition];

			return !cellsToDelete.some(
				(cell) => obj.position.x === cell.x && obj.position.y === cell.y
			);
		});

		const newLayout = { ...layout, objects: newObjects };
		addToHistory(newLayout);
		onLayoutChange(newLayout);
	};

	const updateObjectName = (objectId: string, newName: string) => {
		const newObjects = layout.objects.map((obj) =>
			obj.id === objectId ? { ...obj, name: newName } : obj
		);

		const newLayout = { ...layout, objects: newObjects };
		addToHistory(newLayout);
		onLayoutChange(newLayout);
	};

	return {
		placeObject,
		deleteObject,
		updateObjectName,
	};
};
