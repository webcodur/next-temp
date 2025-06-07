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
		<div
			className="relative p-6 overflow-hidden bg-gray-100 rounded-2xl"
			style={{
				boxShadow: 'inset 8px 8px 16px #b8b8b8, inset -8px -8px 16px #ffffff',
				background: `
					radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
					radial-gradient(circle at 80% 20%, rgba(184, 184, 184, 0.1) 0%, transparent 50%),
					radial-gradient(circle at 40% 40%, rgba(255, 255, 255, 0.05) 0%, transparent 50%),
					linear-gradient(135deg, #f0f0f0 0%, #e8e8e8 50%, #f0f0f0 100%)
				`,
			}}>
			{/* 미세 텍스처 오버레이 */}
			<div
				className="absolute inset-0 pointer-events-none opacity-30"
				style={{
					background: `
						repeating-linear-gradient(
							45deg,
							transparent,
							transparent 1px,
							rgba(255, 255, 255, 0.03) 1px,
							rgba(255, 255, 255, 0.03) 2px
						),
						repeating-linear-gradient(
							-45deg,
							transparent,
							transparent 1px,
							rgba(184, 184, 184, 0.02) 1px,
							rgba(184, 184, 184, 0.02) 2px
						)
					`,
				}}
			/>

			{/* 탭 헤더 */}
			<div
				className="relative p-2 overflow-hidden bg-gray-100 rounded-xl"
				style={{
					boxShadow: '6px 6px 12px #b8b8b8, -6px -6px 12px #ffffff',
					background: `
						radial-gradient(circle at 30% 70%, rgba(255, 255, 255, 0.15) 0%, transparent 50%),
						radial-gradient(circle at 70% 30%, rgba(184, 184, 184, 0.1) 0%, transparent 50%),
						linear-gradient(145deg, #f2f2f2 0%, #e6e6e6 50%, #f2f2f2 100%)
					`,
				}}>
				{/* 헤더 텍스처 */}
				<div
					className="absolute inset-0 pointer-events-none opacity-20"
					style={{
						background: `
							repeating-conic-gradient(
								from 0deg at 50% 50%,
								transparent 0deg,
								rgba(255, 255, 255, 0.02) 1deg,
								transparent 2deg
							)
						`,
					}}
				/>

				<div className="relative z-10 flex">
					{tabs.map((tab) => (
						<button
							key={tab.id}
							onClick={() => setActiveId(tab.id)}
							className={`
								relative px-6 py-3 mx-1 rounded-lg font-medium text-sm transition-all duration-200 overflow-hidden
								${activeId === tab.id ? 'text-gray-700' : 'text-gray-600 hover:text-gray-800'}
								focus:outline-none
							`}
							style={
								activeId === tab.id
									? {
											boxShadow:
												'inset 4px 4px 8px #b8b8b8, inset -4px -4px 8px #ffffff',
											background: `
												radial-gradient(circle at 40% 60%, rgba(184, 184, 184, 0.1) 0%, transparent 50%),
												linear-gradient(135deg, #e8e8e8 0%, #f0f0f0 50%, #e8e8e8 100%)
											`,
											outline: 'none',
											border: 'none',
										}
									: {
											boxShadow: '3px 3px 6px #b8b8b8, -3px -3px 6px #ffffff',
											background: `
												radial-gradient(circle at 60% 40%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
												linear-gradient(135deg, #f2f2f2 0%, #e8e8e8 50%, #f2f2f2 100%)
											`,
											outline: 'none',
											border: 'none',
										}
							}
							onMouseEnter={(e) => {
								if (activeId !== tab.id) {
									e.currentTarget.style.boxShadow =
										'5px 5px 10px #b8b8b8, -5px -5px 10px #ffffff';
									e.currentTarget.style.background = `
										radial-gradient(circle at 60% 40%, rgba(255, 255, 255, 0.15) 0%, transparent 50%),
										linear-gradient(135deg, #f4f4f4 0%, #ea ea ea 50%, #f4f4f4 100%)
									`;
								}
							}}
							onMouseLeave={(e) => {
								if (activeId !== tab.id) {
									e.currentTarget.style.boxShadow =
										'3px 3px 6px #b8b8b8, -3px -3px 6px #ffffff';
									e.currentTarget.style.background = `
										radial-gradient(circle at 60% 40%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
										linear-gradient(135deg, #f2f2f2 0%, #e8e8e8 50%, #f2f2f2 100%)
									`;
								}
							}}
							onMouseDown={(e) => {
								e.currentTarget.style.boxShadow =
									'inset 2px 2px 4px #b8b8b8, inset -2px -2px 4px #ffffff';
								e.currentTarget.style.background = `
									radial-gradient(circle at 40% 60%, rgba(184, 184, 184, 0.15) 0%, transparent 50%),
									linear-gradient(135deg, #e6e6e6 0%, #f0f0f0 50%, #e6e6e6 100%)
								`;
							}}
							onMouseUp={(e) => {
								if (activeId === tab.id) {
									e.currentTarget.style.boxShadow =
										'inset 4px 4px 8px #b8b8b8, inset -4px -4px 8px #ffffff';
									e.currentTarget.style.background = `
										radial-gradient(circle at 40% 60%, rgba(184, 184, 184, 0.1) 0%, transparent 50%),
										linear-gradient(135deg, #e8e8e8 0%, #f0f0f0 50%, #e8e8e8 100%)
									`;
								} else {
									e.currentTarget.style.boxShadow =
										'3px 3px 6px #b8b8b8, -3px -3px 6px #ffffff';
									e.currentTarget.style.background = `
										radial-gradient(circle at 60% 40%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
										linear-gradient(135deg, #f2f2f2 0%, #e8e8e8 50%, #f2f2f2 100%)
									`;
								}
							}}>
							{/* 버튼 내부 텍스처 */}
							<div
								className="absolute inset-0 pointer-events-none opacity-10"
								style={{
									background: `
										repeating-linear-gradient(
											90deg,
											transparent,
											transparent 2px,
											rgba(255, 255, 255, 0.1) 2px,
											rgba(255, 255, 255, 0.1) 4px
										)
									`,
								}}
							/>
							<span className="relative z-10">{tab.label}</span>
						</button>
					))}
				</div>
			</div>

			{/* 탭 컨텐츠 */}
			<div
				className="relative p-6 mt-6 overflow-hidden bg-gray-100 rounded-xl"
				style={{
					boxShadow: '6px 6px 12px #b8b8b8, -6px -6px 12px #ffffff',
					background: `
						radial-gradient(circle at 25% 75%, rgba(255, 255, 255, 0.12) 0%, transparent 50%),
						radial-gradient(circle at 75% 25%, rgba(184, 184, 184, 0.08) 0%, transparent 50%),
						linear-gradient(145deg, #f1f1f1 0%, #e7e7e7 50%, #f1f1f1 100%)
					`,
				}}>
				{/* 컨텐츠 텍스처 */}
				<div
					className="absolute inset-0 opacity-25 pointer-events-none"
					style={{
						background: `
							repeating-radial-gradient(
								circle at 50% 50%,
								transparent 0px,
								rgba(255, 255, 255, 0.02) 1px,
								transparent 2px
							)
						`,
					}}
				/>

				<div className="relative z-10">
					{tabs.map((tab, idx) =>
						activeId === tab.id ? (
							<div key={tab.id} className="animate-fadeIn">
								{children[idx]}
							</div>
						) : null
					)}
				</div>
			</div>
		</div>
	);
};

export default Tabs;
