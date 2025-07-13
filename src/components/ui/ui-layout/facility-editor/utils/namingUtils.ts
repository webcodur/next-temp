// 이름 생성 관련 유틸리티 함수

import {
	FacilityLayout,
	SeatData,
	GridObject,
	BatchNamingConfig,
} from '@/types/facility';

export const getDefaultName = (type: string, index: number): string => {
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

export const applyBatchNamingToLayout = (
	layout: FacilityLayout,
	config: BatchNamingConfig,
	selectedCells: Array<{ x: number; y: number }>
): FacilityLayout => {
	const seatObjects = layout.objects.filter((obj) => obj.type === 'seat');
	let targetSeats: typeof seatObjects = [];

	if (config.applyToSelected && selectedCells.length > 0) {
		// 선택된 셀의 좌석만 대상
		targetSeats = seatObjects.filter((seat) =>
			selectedCells.some(
				(cell) => cell.x === seat.position.x && cell.y === seat.position.y
			)
		);
	} else {
		// 모든 좌석이 대상
		targetSeats = seatObjects;
	}

	// 좌석을 좌표 순으로 정렬
	targetSeats.sort((a, b) => {
		if (a.position.y !== b.position.y) return a.position.y - b.position.y;
		return a.position.x - b.position.x;
	});

	// 새로운 이름 적용
	const newObjects = [...layout.objects];
	targetSeats.forEach((seat, index) => {
		const objIndex = newObjects.findIndex((obj) => obj.id === seat.id);
		if (objIndex !== -1 && newObjects[objIndex].type === 'seat') {
			const newName = config.option.generate(
				index,
				seat.position.y,
				seat.position.x,
				config.customPattern
			);
			(newObjects[objIndex] as SeatData).name = newName;
		}
	});

	return { ...layout, objects: newObjects };
};

export const getNameableObjects = (layout: FacilityLayout): GridObject[] => {
	return layout.objects.filter(
		(obj) => obj.type === 'seat' || obj.type === 'object'
	);
};

export const getNextNamingObject = (
	layout: FacilityLayout,
	currentPosition: { x: number; y: number },
	reverse: boolean = false
): GridObject | null => {
	const nameableObjects = getNameableObjects(layout).sort((a, b) => {
		if (a.position.y !== b.position.y) return a.position.y - b.position.y;
		return a.position.x - b.position.x;
	});

	if (nameableObjects.length === 0) return null;

	const currentIndex = nameableObjects.findIndex(
		(obj) =>
			obj.position.x === currentPosition.x &&
			obj.position.y === currentPosition.y
	);

	let nextIndex;
	if (reverse) {
		nextIndex =
			currentIndex <= 0 ? nameableObjects.length - 1 : currentIndex - 1;
	} else {
		nextIndex =
			currentIndex >= nameableObjects.length - 1 ? 0 : currentIndex + 1;
	}

	return nameableObjects[nextIndex];
};
