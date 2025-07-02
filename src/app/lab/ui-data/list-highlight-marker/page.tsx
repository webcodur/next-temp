'use client';

import React, { useState } from 'react';
import { ListHighlightMarker } from '@/components/ui/ui-data/list-highlight-marker';
import {
	Star,
	User,
	Settings,
	Heart,
	FileText,
	Home,
	Mail,
	Phone,
} from 'lucide-react';

const sampleItems = [
	{
		id: '1',
		label: '첫 번째 항목',
		icon: User,
		description: '사용자 관련 메뉴',
	},
	{ id: '2', label: '두 번째 항목', icon: Star, description: '즐겨찾기 항목' },
	{
		id: '3',
		label: '세 번째 항목',
		icon: Settings,
		description: '설정 관련 메뉴',
	},
	{ id: '4', label: '네 번째 항목', icon: Heart, description: '좋아요 기능' },
	{
		id: '5',
		label: '다섯 번째 항목',
		icon: FileText,
		description: '문서 관리',
	},
	{ id: '6', label: '여섯 번째 항목', icon: Home, description: '홈 페이지' },
	{ id: '7', label: '일곱 번째 항목', icon: Mail, description: '메일 기능' },
	{ id: '8', label: '여덟 번째 항목', icon: Phone, description: '연락처 관리' },
];

export default function ListHighlightMarkerPage() {
	const [selectedIds, setSelectedIds] = useState<string[]>(['2', '5']);
	const [highlightedIndex, setHighlightedIndex] = useState(-1);

	const handleSelect = (id: string) => {
		setSelectedIds((prev) =>
			prev.includes(id)
				? prev.filter((selectedId) => selectedId !== id)
				: [...prev, id]
		);
	};

	const handleKeyDown = (event: React.KeyboardEvent) => {
		if (event.key === 'ArrowDown') {
			event.preventDefault();
			setHighlightedIndex((prev) => Math.min(prev + 1, sampleItems.length - 1));
		} else if (event.key === 'ArrowUp') {
			event.preventDefault();
			setHighlightedIndex((prev) => Math.max(prev - 1, 0));
		} else if (event.key === 'Enter' && highlightedIndex >= 0) {
			event.preventDefault();
			handleSelect(sampleItems[highlightedIndex].id);
		}
	};

	return (
		<div className="p-8 min-h-screen bg-gray-50">
			<div className="mx-auto max-w-4xl">
				<div className="mb-8">
					<h1 className="mb-4 text-3xl font-bold text-gray-900">
						List Highlight Marker
					</h1>
					<p className="text-gray-600">
						리스트 항목에 시각적 강화 효과를 제공합니다. 호버 시 왼쪽 색상 바와
						transform 효과, 활성 시 배경색과 체크마크가 표시됩니다.
					</p>
				</div>

				<div className="space-y-8">
					{/* 기본 리스트 예제 */}
					<section className="p-6 rounded-lg neu-flat">
						<h3 className="mb-4 text-lg font-semibold text-gray-800">
							기본 리스트 (호버 및 선택 효과)
						</h3>
						<p className="mb-4 text-sm text-gray-600">
							클릭으로 선택/해제, 마우스 호버로 강조 표시. 현재 선택된 항목:{' '}
							{selectedIds.length}개
						</p>

						<div
							className="bg-white rounded-lg border border-gray-200"
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
										onClick={() => handleSelect(item.id)}>
										<div className="flex gap-3 items-center">
											<Icon className="w-5 h-5 text-gray-600" />
											<div className="flex-1 min-w-0">
												<div className="font-medium text-gray-900">
													{item.label}
												</div>
												<div className="text-sm text-gray-500">
													{item.description}
												</div>
											</div>
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
					<section className="p-6 rounded-lg neu-flat">
						<h3 className="mb-4 text-lg font-semibold text-gray-800">
							비활성화 항목 포함
						</h3>
						<p className="mb-4 text-sm text-gray-600">
							일부 항목이 비활성화된 상태. 클릭 불가 및 시각적 구분.
						</p>

						<div className="bg-white rounded-lg border border-gray-200">
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
										disabled={isDisabled}
										onClick={
											!isDisabled ? () => handleSelect(item.id) : undefined
										}>
										<div className="flex gap-3 items-center">
											<Icon
												className={`w-5 h-5 ${isDisabled ? 'text-gray-300' : 'text-gray-600'}`}
											/>
											<div className="flex-1 min-w-0">
												<div
													className={`font-medium ${isDisabled ? 'text-gray-400' : 'text-gray-900'}`}>
													{item.label}
													{isDisabled && ' (비활성화)'}
												</div>
												<div className="text-sm text-gray-400">
													{item.description}
												</div>
											</div>
										</div>
									</ListHighlightMarker>
								);
							})}
						</div>
					</section>

					{/* 단순 텍스트 리스트 */}
					<section className="p-6 rounded-lg neu-flat">
						<h3 className="mb-4 text-lg font-semibold text-gray-800">
							단순 텍스트 리스트
						</h3>
						<p className="mb-4 text-sm text-gray-600">
							아이콘 없는 단순한 텍스트 목록. 마우스 호버로 색상 바와 transform
							효과 확인.
						</p>

						<div className="bg-white rounded-lg border border-gray-200">
							{[
								'Apple - 사과',
								'Banana - 바나나',
								'Cherry - 체리',
								'Date - 대추',
								'Elderberry - 엘더베리',
								'Fig - 무화과',
								'Grape - 포도',
							].map((fruit, index) => (
								<ListHighlightMarker
									key={fruit}
									index={index}
									totalCount={7}
									onClick={() => console.log(`Selected: ${fruit}`)}>
									{fruit}
								</ListHighlightMarker>
							))}
						</div>
					</section>

					{/* 상태 설명 */}
					<section className="p-6 rounded-lg neu-flat">
						<h3 className="mb-4 text-lg font-semibold text-gray-800">
							상태별 스타일 데모
						</h3>

						<div className="grid gap-6 md:grid-cols-2">
							<div>
								<h4 className="mb-3 text-sm font-medium text-gray-700">
									기본 상태
								</h4>
								<div className="bg-white rounded-lg border border-gray-200">
									<ListHighlightMarker index={0} totalCount={2}>
										<span className="font-medium">일반 항목 1</span>
									</ListHighlightMarker>
									<ListHighlightMarker index={1} totalCount={2}>
										<span className="font-medium">일반 항목 2</span>
									</ListHighlightMarker>
								</div>
								<p className="mt-2 text-xs text-gray-500">
									마우스를 올려 호버 효과를 확인해보세요
								</p>
							</div>

							<div>
								<h4 className="mb-3 text-sm font-medium text-gray-700">
									활성 상태
								</h4>
								<div className="bg-white rounded-lg border border-gray-200">
									<ListHighlightMarker index={0} totalCount={2} isSelected>
										<span className="font-medium">선택된 항목</span>
									</ListHighlightMarker>
									<ListHighlightMarker index={1} totalCount={2} isHighlighted>
										<span className="font-medium">하이라이트된 항목</span>
									</ListHighlightMarker>
								</div>
								<p className="mt-2 text-xs text-gray-500">
									배경색과 체크마크가 표시됩니다
								</p>
							</div>
						</div>
					</section>

					{/* 사용법 안내 */}
					<section className="p-6 rounded-lg neu-flat">
						<h3 className="mb-4 text-lg font-semibold text-gray-800">사용법</h3>
						<div className="overflow-x-auto p-4 font-mono text-sm text-green-400 bg-gray-800 rounded-lg">
							<pre>{`import { ListHighlightMarker } from '@/components/ui/ui-data/list-highlight-marker';

// 기본 사용
<ListHighlightMarker
  index={0}
  totalCount={items.length}
  isSelected={selectedIds.includes(item.id)}
  onClick={() => handleSelect(item.id)}>
  {item.label}
</ListHighlightMarker>

// 키보드 네비게이션 지원
<ListHighlightMarker
  index={index}
  totalCount={items.length}
  isSelected={selectedIds.includes(item.id)}
  isHighlighted={highlightedIndex === index}
  onClick={() => handleSelect(item.id)}>
  {item.label}
</ListHighlightMarker>`}</pre>
						</div>
					</section>

					{/* 주요 특징 */}
					<section className="p-6 rounded-lg neu-flat">
						<h3 className="mb-4 text-lg font-semibold text-gray-800">
							주요 특징
						</h3>
						<div className="grid gap-4 md:grid-cols-2">
							<div className="space-y-3">
								<div className="flex gap-3 items-start">
									<div className="mt-2 w-2 h-2 rounded-full bg-primary"></div>
									<div>
										<h4 className="font-medium text-gray-900">호버 효과</h4>
										<p className="text-sm text-gray-600">
											왼쪽 가장자리 색상 바 + 우측으로 4px 이동
										</p>
									</div>
								</div>
								<div className="flex gap-3 items-start">
									<div className="mt-2 w-2 h-2 rounded-full bg-primary"></div>
									<div>
										<h4 className="font-medium text-gray-900">활성 효과</h4>
										<p className="text-sm text-gray-600">
											배경색 적용 + 우측 체크마크 표시
										</p>
									</div>
								</div>
							</div>
							<div className="space-y-3">
								<div className="flex gap-3 items-start">
									<div className="mt-2 w-2 h-2 rounded-full bg-primary"></div>
									<div>
										<h4 className="font-medium text-gray-900">
											부드러운 애니메이션
										</h4>
										<p className="text-sm text-gray-600">
											150ms ease-in-out 트랜지션
										</p>
									</div>
								</div>
								<div className="flex gap-3 items-start">
									<div className="mt-2 w-2 h-2 rounded-full bg-primary"></div>
									<div>
										<h4 className="font-medium text-gray-900">접근성 지원</h4>
										<p className="text-sm text-gray-600">
											키보드 네비게이션 및 비활성화 상태
										</p>
									</div>
								</div>
							</div>
						</div>
					</section>
				</div>
			</div>
		</div>
	);
}
