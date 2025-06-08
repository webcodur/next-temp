'use client';

import React, { useState } from 'react';
import { Select, Option } from '@/components/ui/select/Select';
import { FilterPanel } from '@/components/ui/filter-panel/FilterPanel';

export default function SearchFilterPage() {
	const [singleSelectValue, setSingleSelectValue] = useState('');
	const [multiSelectValue, setMultiSelectValue] = useState<string[]>([]);

	const handleSearch = () => {
		console.log('검색 실행:', { singleSelectValue, multiSelectValue });
	};

	const handleReset = () => {
		setSingleSelectValue('');
		setMultiSelectValue([]);
	};

	const hasValues = singleSelectValue !== '' || multiSelectValue.length > 0;

	// 옵션 데이터들
	const singleSelectOptions: Option[] = [
		{ value: 'option1', label: '옵션 1' },
		{ value: 'option2', label: '옵션 2' },
		{ value: 'option3', label: '옵션 3' },
		{ value: 'option4', label: '옵션 4' },
		{ value: 'option5', label: '옵션 5' },
	];

	const multiSelectOptions: Option[] = [
		{ value: 'feature1', label: '기능 A' },
		{ value: 'feature2', label: '기능 B' },
		{ value: 'feature3', label: '기능 C' },
		{ value: 'feature4', label: '기능 D' },
		{ value: 'feature5', label: '기능 E' },
		{ value: 'feature6', label: '기능 F' },
	];

	return (
		<div className="min-h-screen p-8 bg-gray-50">
			<div className="max-w-4xl mx-auto">
				{/* 헤더 */}
				<div className="mb-8 text-center">
					<div className="inline-block px-8 py-6 bg-white neu-raised rounded-2xl">
						<h1 className="mb-2 text-3xl font-bold text-gray-900">
							Select Component Demo
						</h1>
						<p className="text-gray-600">단일 선택 및 다중 선택 컴포넌트</p>
					</div>
				</div>

				{/* Select 컴포넌트 테스트 */}
				<FilterPanel
					title="Select Component Test"
					onSearch={handleSearch}
					onReset={handleReset}
					statusText="컴포넌트 테스트">
					{/* 단일 선택 */}
					<Select
						label="단일 선택"
						placeholder="하나의 옵션을 선택하세요"
						value={singleSelectValue}
						onChange={setSingleSelectValue}
						options={singleSelectOptions}
						iconType="filter"
					/>

					{/* 다중 선택 */}
					<Select
						label="다중 선택"
						placeholder="여러 옵션을 선택하세요"
						multiple
						value={multiSelectValue}
						onChange={setMultiSelectValue}
						options={multiSelectOptions}
						iconType="filter"
					/>
				</FilterPanel>

				{/* 선택된 값 표시 */}
				{hasValues && (
					<div className="p-6 mt-6 neu-flat bg-gray-50 rounded-2xl">
						<h3 className="mb-4 text-lg font-semibold text-gray-900">
							선택된 값
						</h3>

						<div className="grid gap-4 md:grid-cols-2">
							{/* 단일 선택 결과 */}
							<div className="p-4 bg-white neu-inset rounded-xl">
								<h4 className="mb-3 text-sm font-semibold text-gray-800">
									단일 선택 결과
								</h4>
								<div className="text-sm text-gray-600">
									<div>
										<span className="font-medium text-gray-700">
											선택된 값:
										</span>{' '}
										{singleSelectValue
											? singleSelectOptions.find(
													(opt) => opt.value === singleSelectValue
												)?.label
											: '없음'}
									</div>
								</div>
							</div>

							{/* 다중 선택 결과 */}
							<div className="p-4 bg-white neu-inset rounded-xl">
								<h4 className="mb-3 text-sm font-semibold text-gray-800">
									다중 선택 결과
								</h4>
								<div className="text-sm text-gray-600">
									<div>
										<span className="font-medium text-gray-700">
											선택된 개수:
										</span>{' '}
										{multiSelectValue.length}개
									</div>
									{multiSelectValue.length > 0 && (
										<div className="mt-2">
											<span className="font-medium text-gray-700">
												선택된 항목:
											</span>
											<div className="mt-1 space-y-1">
												{multiSelectValue.map((value) => (
													<div key={value} className="text-xs">
														•{' '}
														{
															multiSelectOptions.find(
																(opt) => opt.value === value
															)?.label
														}
													</div>
												))}
											</div>
										</div>
									)}
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
