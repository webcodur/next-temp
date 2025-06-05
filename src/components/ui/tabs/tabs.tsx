'use client';

import React, { useState } from 'react';

export interface Tab {
	id: string;
	label: string;
}

export interface TabsProps {
	tabs: Tab[];
	children: React.ReactNode[];
}

const Tabs: React.FC<TabsProps> = ({ tabs, children }) => {
	const [activeId, setActiveId] = useState<string>(tabs[0]?.id);

	return (
		<div>
			<div className="flex border-b border-gray-200">
				{tabs.map((tab) => (
					<button
						key={tab.id}
						onClick={() => setActiveId(tab.id)}
						className={`px-4 py-2 -mb-px whitespace-nowrap focus:outline-none ${
							activeId === tab.id
								? 'border-b-2 border-blue-500 text-blue-600 font-medium'
								: 'text-gray-600'
						}`}>
						{tab.label}
					</button>
				))}
			</div>
			<div className="p-4">
				{tabs.map((tab, idx) =>
					activeId === tab.id ? <div key={tab.id}>{children[idx]}</div> : null
				)}
			</div>
		</div>
	);
};

export default Tabs;
