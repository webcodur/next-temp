// 시설별 좌석 예약 시스템 유틸리티 함수

import { FacilityLayout, GridObject } from './core';
import { CELL_SIZE } from './constants';

// 고유 ID 생성 헬퍼 함수
export const generateUniqueId = (prefix: string = ''): string => {
	const timestamp = Date.now();
	const random = Math.random().toString(36).substring(2, 9);
	return `${prefix}${timestamp}-${random}`;
};

// 빈 레이아웃 생성 헬퍼 함수
export const createEmptyLayout = (
	name: string,
	category: string,
	gridSize: { width: number; height: number }
): FacilityLayout => ({
	id: generateUniqueId('layout-'),
	name,
	category,
	gridSize,
	objects: [],
	cellSize: CELL_SIZE,
	createdAt: new Date(),
	updatedAt: new Date(),
});

// 빈 셀 없이 전부 빈공간으로 채워진 레이아웃 생성
export const createFilledLayout = (
	name: string,
	category: string,
	gridSize: { width: number; height: number }
): FacilityLayout => {
	const objects: GridObject[] = [];

	// 모든 셀을 'space' 타입으로 채움
	for (let y = 0; y < gridSize.height; y++) {
		for (let x = 0; x < gridSize.width; x++) {
			objects.push({
				id: generateUniqueId(`space-${x}-${y}-`),
				type: 'space',
				size: { width: 1, height: 1 },
				reservable: false,
				position: { x, y },
			});
		}
	}

	return {
		id: generateUniqueId('layout-'),
		name,
		category,
		gridSize,
		objects,
		cellSize: CELL_SIZE,
		createdAt: new Date(),
		updatedAt: new Date(),
	};
};
