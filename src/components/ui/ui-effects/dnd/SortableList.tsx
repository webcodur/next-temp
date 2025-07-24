'use client';

import React, { useState } from 'react';
import {
	DndContext,
	closestCenter,
	PointerSensor,
	useSensor,
	useSensors,
	DragEndEvent,
} from '@dnd-kit/core';
import {
	arrayMove,
	SortableContext,
	rectSortingStrategy,
	useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// #region 타입
interface Item {
	id: string;
	name: string;
}
// #endregion

// #region SortableItem 컴포넌트

interface SortableItemProps extends Item {
	colorVariant?: 'primary' | 'secondary';
}

const SortableItem: React.FC<SortableItemProps> = ({ id, name, colorVariant = 'primary' }) => {
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id });
	const style: React.CSSProperties = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	// 색상 variant에 따른 스타일
	const hoverStyles = colorVariant === 'primary' 
		? 'hover:border-primary hover:bg-primary/10'
		: 'hover:border-secondary hover:bg-secondary/10';

	return (
		<li
			ref={setNodeRef}
			style={style}
			className={`p-2 border border-border rounded bg-background mb-2 cursor-grab ${hoverStyles}`}
			{...attributes}
			{...listeners}>
			{name}
		</li>
	);
};
// #endregion

interface DragAndDropProps {
	colorVariant?: 'primary' | 'secondary';
}

const DragAndDrop: React.FC<DragAndDropProps> = ({ colorVariant = 'primary' }) => {
	// #region 상태
	const [items, setItems] = useState<Item[]>([
		{ id: '1', name: 'Item 1' },
		{ id: '2', name: 'Item 2' },
		{ id: '3', name: 'Item 3' },
		{ id: '4', name: 'Item 4' },
	]);
	// #endregion

	// #region 훅
	const sensors = useSensors(useSensor(PointerSensor));
	// #endregion

	// #region 핸들러
	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;
		if (!over || active.id === over.id) return;
		setItems((items) => {
			const oldIndex = items.findIndex((item) => item.id === active.id);
			const newIndex = items.findIndex((item) => item.id === over.id);
			return arrayMove(items, oldIndex, newIndex);
		});
	};
	// #endregion

	// #region 렌더링
	return (
		<div className="p-4">
			<h2 className="text-lg font-bold mb-2">Drag And Drop</h2>
			<DndContext
				sensors={sensors}
				collisionDetection={closestCenter}
				onDragEnd={handleDragEnd}>
				<SortableContext
					items={items.map((item) => item.id)}
					strategy={rectSortingStrategy}>
					<ul>
						{items.map((item) => (
							<SortableItem key={item.id} id={item.id} name={item.name} colorVariant={colorVariant} />
						))}
					</ul>
				</SortableContext>
			</DndContext>
		</div>
	);
	// #endregion
};

export default DragAndDrop;
