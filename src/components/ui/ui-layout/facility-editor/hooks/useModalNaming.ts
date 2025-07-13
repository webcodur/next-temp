// 모달 이름 편집 관련 커스텀 훅

import { useState } from 'react';
import { FacilityLayout } from '@/types/facility';
import { getObjectAt } from '../utils/gridUtils';

export const useModalNaming = (
	layout: FacilityLayout,
	onLayoutChange: (layout: FacilityLayout) => void,
	addToHistory: (layout: FacilityLayout) => void,
	currentPosition: { x: number; y: number }
) => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [currentNameInput, setCurrentNameInput] = useState('');
	const [namingObjectId, setNamingObjectId] = useState<string | null>(null);

	const startEditing = () => {
		const currentObject = getObjectAt(
			layout,
			currentPosition.x,
			currentPosition.y
		);

		if (
			currentObject &&
			(currentObject.type === 'seat' || currentObject.type === 'object')
		) {
			setNamingObjectId(currentObject.id);
			setCurrentNameInput(currentObject.name);
			setIsModalOpen(true);
		}
	};

	const saveEdit = () => {
		if (namingObjectId && currentNameInput.trim()) {
			const newObjects = layout.objects.map((obj) =>
				obj.id === namingObjectId &&
				(obj.type === 'seat' || obj.type === 'object')
					? { ...obj, name: currentNameInput.trim() }
					: obj
			);

			const newLayout = { ...layout, objects: newObjects };
			addToHistory(newLayout);
			onLayoutChange(newLayout);
		}

		setIsModalOpen(false);
		setNamingObjectId(null);
		setCurrentNameInput('');
	};

	const cancelEdit = () => {
		setIsModalOpen(false);
		setNamingObjectId(null);
		setCurrentNameInput('');
	};

	const getCurrentObjectName = () => {
		if (!namingObjectId) return '';
		const obj = layout.objects.find((o) => o.id === namingObjectId);
		return obj && (obj.type === 'seat' || obj.type === 'object')
			? obj.name
			: '';
	};

	return {
		isModalOpen,
		currentNameInput,
		namingObjectId,
		startEditing,
		saveEdit,
		cancelEdit,
		setCurrentNameInput,
		getCurrentObjectName,
	};
};
