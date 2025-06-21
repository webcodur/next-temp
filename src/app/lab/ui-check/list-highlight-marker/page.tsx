'use client';

import React, { useState } from 'react';
import { ListHighlightMarker } from '@/components/ui/list-highlight-marker';
import { Check, Star, User, Settings } from 'lucide-react';

const sampleItems = [
	{ id: '1', label: '첫 번째 항목', icon: User },
	{ id: '2', label: '두 번째 항목', icon: Star },
	{ id: '3', label: '세 번째 항목', icon: Settings },
	{ id: '4', label: '네 번째 항목', icon: Check },
	{ id: '5', label: '다섯 번째 항목', icon: User },
	{ id: '6', label: '여섯 번째 항목', icon: Star },
	{ id: '7', label: '일곱 번째 항목', icon: Settings },
	{ id: '8', label: '여덟 번째 항목', icon: Check },
];

export default function ListHighlightMarkerPage() {
	const [selectedIds, setSelectedIds] = useState<string[]>(['2', '5']);
	const [hoveredIndex, setHoveredIndex] = useState(-1);
	const [highlightedIndex, setHighlightedIndex] = useState(-1);

	const handleSelect = (id: string) => {
		setSelectedIds(prev => 
			prev.includes(id) 
				? prev.filter(selectedId => selectedId !== id)
				: [...prev, id]
		);
	};

	const handleKeyDown = (event: React.KeyboardEvent) => {
		if (event.key === 'ArrowDown') {
			event.preventDefault();
			setHighlightedIndex(prev => Math.min(prev + 1, sampleItems.length - 1));
		} else if (event.key === 'ArrowUp') {
			event.preventDefault();
			setHighlightedIndex(prev => Math.max(prev - 1, 0));
		} else if (event.key === 'Enter' && highlightedIndex >= 0) {
			event.preventDefault();
			handleSelect(sampleItems[highlightedIndex].id);
		}
	};

	return (
		<div className="min-h-screen bg-gray-50 p-8">
			<div className="max-w-4xl mx-auto">
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900 mb-4">List Highlight Marker</h1>
					<p className="text-gray-600">리스트나 드롭다운에서 항목 선택 시 왼쪽 가장자리에 표시되는 얇은 색상 바와 배경 강조 효과</p>
				</div>

				<div className="space-y-8">
				{/* 기본 리스트 예제 */}
				<section className="neu-flat p-6 rounded-lg">
					<h3 className="text-lg font-semibold mb-4 text-gray-800">기본 리스트</h3>
					<p className="text-sm text-gray-600 mb-4">
						클릭으로 선택/해제, 마우스 호버로 강조 표시. 현재 선택된 항목: {selectedIds.length}개
					</p>
					
					<div 
						className="bg-gray-50 rounded-lg max-h-64 overflow-y-auto"
						tabIndex={0}
						onKeyDown={handleKeyDown}>
						{sampleItems.map((item, index) => {
							const Icon = item.icon;
							const isSelected = selectedIds.includes(item.id);
							return (
								<ListHighlightMarker
									key={item.id}
									index={index}
									totalCount={sampleItems.length}
									isSelected={isSelected}
									isHighlighted={highlightedIndex === index}
									isHovered={hoveredIndex === index}
									onClick={() => handleSelect(item.id)}
									onMouseEnter={() => setHoveredIndex(index)}
									onMouseLeave={() => setHoveredIndex(-1)}>
									<div className="flex items-center gap-2">
										<Icon className="w-4 h-4 text-gray-500" />
										<span>{item.label}</span>
										{isSelected && (
											<Check className="w-4 h-4 text-green-600 ml-auto" />
										)}
									</div>
								</ListHighlightMarker>
							);
						})}
					</div>
					
					<div className="mt-4 text-xs text-gray-500">
						💡 키보드 조작: ↑↓ 방향키로 이동, Enter로 선택
					</div>
				</section>

				{/* 비활성화 항목 예제 */}
				<section className="neu-flat p-6 rounded-lg">
					<h3 className="text-lg font-semibold mb-4 text-gray-800">비활성화 항목 포함</h3>
					<p className="text-sm text-gray-600 mb-4">
						일부 항목이 비활성화된 상태. 클릭 불가 및 시각적 구분.
					</p>
					
					<div className="bg-gray-50 rounded-lg max-h-64 overflow-y-auto">
						{sampleItems.slice(0, 5).map((item, index) => {
							const Icon = item.icon;
							const isDisabled = index === 1 || index === 3; // 2번째, 4번째 비활성화
							const isSelected = selectedIds.includes(item.id);
							return (
								<ListHighlightMarker
									key={item.id}
									index={index}
									totalCount={5}
									isSelected={isSelected}
									isHovered={!isDisabled && hoveredIndex === index}
									disabled={isDisabled}
									onClick={!isDisabled ? () => handleSelect(item.id) : undefined}
									onMouseEnter={!isDisabled ? () => setHoveredIndex(index) : undefined}
									onMouseLeave={!isDisabled ? () => setHoveredIndex(-1) : undefined}>
									<div className="flex items-center gap-2">
										<Icon className={`w-4 h-4 ${isDisabled ? 'text-gray-300' : 'text-gray-500'}`} />
										<span>{item.label}</span>
										{isDisabled && (
											<span className="text-xs text-gray-400 ml-auto">비활성화</span>
										)}
										{!isDisabled && isSelected && (
											<Check className="w-4 h-4 text-green-600 ml-auto" />
										)}
									</div>
								</ListHighlightMarker>
							);
						})}
					</div>
				</section>

				{/* 단순 텍스트 리스트 */}
				<section className="neu-flat p-6 rounded-lg">
					<h3 className="text-lg font-semibold mb-4 text-gray-800">단순 텍스트 리스트</h3>
					<p className="text-sm text-gray-600 mb-4">
						아이콘 없는 단순한 텍스트 목록. 얼룩무늬 패턴과 강조 효과 확인.
					</p>
					
					<div className="bg-gray-50 rounded-lg max-h-40 overflow-y-auto">
						{['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry', 'Fig', 'Grape'].map((fruit, index) => (
							<ListHighlightMarker
								key={fruit}
								index={index}
								totalCount={7}
								isHovered={hoveredIndex === index}
								onClick={() => console.log(`Selected: ${fruit}`)}
								onMouseEnter={() => setHoveredIndex(index)}
								onMouseLeave={() => setHoveredIndex(-1)}>
								{fruit}
							</ListHighlightMarker>
						))}
					</div>
				</section>

				{/* 상태 설명 */}
				<section className="neu-flat p-6 rounded-lg">
					<h3 className="text-lg font-semibold mb-4 text-gray-800">상태별 스타일</h3>
					
					<div className="grid gap-4 md:grid-cols-2">
						<div>
							<h4 className="text-sm font-medium mb-2 text-gray-700">기본 상태</h4>
							<div className="bg-gray-50 rounded-lg">
								<ListHighlightMarker index={0} totalCount={1}>
									짝수 줄 (흰색 배경)
								</ListHighlightMarker>
								<ListHighlightMarker index={1} totalCount={2}>
									홀수 줄 (연한 회색 배경)
								</ListHighlightMarker>
							</div>
						</div>
						
						<div>
							<h4 className="text-sm font-medium mb-2 text-gray-700">활성 상태</h4>
							<div className="bg-gray-50 rounded-lg">
								<ListHighlightMarker index={0} totalCount={2} isSelected>
									선택된 항목
								</ListHighlightMarker>
								<ListHighlightMarker index={1} totalCount={2} isHighlighted>
									하이라이트된 항목
								</ListHighlightMarker>
							</div>
						</div>
					</div>
				</section>

				{/* 사용법 안내 */}
				<section className="neu-flat p-6 rounded-lg">
					<h3 className="text-lg font-semibold mb-4 text-gray-800">사용법</h3>
					<div className="bg-gray-800 rounded-lg p-4 text-green-400 text-sm font-mono overflow-x-auto">
						<pre>{`import { ListHighlightMarker } from '@/components/ui/list-highlight-marker';

<ListHighlightMarker
  index={0}
  totalCount={items.length}
  isSelected={selectedIds.includes(item.id)}
  isHovered={hoveredIndex === 0}
  onClick={() => handleSelect(item.id)}
  onMouseEnter={() => setHoveredIndex(0)}
  onMouseLeave={() => setHoveredIndex(-1)}>
  {item.label}
</ListHighlightMarker>`}</pre>
					</div>
				</section>
				</div>
			</div>
		</div>
	);
} 