// 그리드 관련 유틸리티 함수

import { GridObject, FacilityLayout, ObjectType } from '@/types/facility';

export const getObjectAt = (
	layout: FacilityLayout,
	x: number,
	y: number
): GridObject | undefined => {
	return layout.objects.find(
		(obj) => obj.position.x === x && obj.position.y === y
	);
};

export const isPositionValid = (
	layout: FacilityLayout,
	x: number,
	y: number
): boolean => {
	return (
		x >= 0 && x < layout.gridSize.width && y >= 0 && y < layout.gridSize.height
	);
};

export const getObjectsOfType = (
	layout: FacilityLayout,
	type: ObjectType
): GridObject[] => {
	return layout.objects.filter((obj) => obj.type === type);
};

export const getAllSeatObjects = (layout: FacilityLayout) => {
	return layout.objects.filter((obj) => obj.type === 'seat');
};

export const getDefaultObjectName = (
	type: ObjectType,
	index: number
): string => {
	switch (type) {
		case 'seat':
			return `A-${String(index + 1).padStart(2, '0')}`;
		case 'object':
			return '사물';
		case 'space':
			return '';
		default:
			return '';
	}
};

export const sortObjectsByPosition = (objects: GridObject[]): GridObject[] => {
	return objects.sort((a, b) => {
		if (a.position.y !== b.position.y) return a.position.y - b.position.y;
		return a.position.x - b.position.x;
	});
};
