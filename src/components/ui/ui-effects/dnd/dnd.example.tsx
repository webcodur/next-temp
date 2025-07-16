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

// #region SortableItem 컴포넌트
interface Item {
	id: string;
	name: string;
}

const SortableItem: React.FC<Item> = ({ id, name }) => {
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id });
	const style: React.CSSProperties = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	return (
		<li
			ref={setNodeRef}
			style={style}
			className="p-2 border border-border rounded bg-background mb-2 cursor-grab hover:border-primary hover:bg-primary/10"
			{...attributes}
			{...listeners}>
			{name}
		</li>
	);
};
// #endregion

export default function DndExample() {
	const [items, setItems] = useState<Item[]>([
		{ id: '1', name: 'Item 1' },
		{ id: '2', name: 'Item 2' },
		{ id: '3', name: 'Item 3' },
		{ id: '4', name: 'Item 4' },
	]);
	const sensors = useSensors(useSensor(PointerSensor));

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;
		if (!over || active.id === over.id) return;
		setItems((items) => {
			const oldIndex = items.findIndex((item) => item.id === active.id);
			const newIndex = items.findIndex((item) => item.id === over.id);
			return arrayMove(items, oldIndex, newIndex);
		});
	};

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
							<SortableItem key={item.id} id={item.id} name={item.name} />
						))}
					</ul>
				</SortableContext>
			</DndContext>
		</div>
	);
} 