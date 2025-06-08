'use client';

import React, { useState } from 'react';
import {
	FieldText,
	FieldFilterSelect,
	FieldMultiSelect,
	FieldSortSelect,
	Option,
} from '@/components/ui/field/Field';
import { FilterPanel } from '@/components/ui/filter-panel/FilterPanel';

export default function SearchFilterPage() {
	const [textValue, setTextValue] = useState('');
	const [singleSelectValue, setSingleSelectValue] = useState('');
	const [multiSelectValue, setMultiSelectValue] = useState<string[]>([]);
	const [sortValue, setSortValue] = useState('');

	const handleSearch = () => {
		console.log('검색 실행:', {
			textValue,
			singleSelectValue,
			multiSelectValue,
			sortValue,
		});
	};

	const handleReset = () => {
		setTextValue('');
		setSingleSelectValue('');
		setMultiSelectValue([]);
		setSortValue('');
	};

	const hasValues =
		textValue !== '' ||
		singleSelectValue !== '' ||
		multiSelectValue.length > 0 ||
		sortValue !== '';

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

	const sortOptions: Option[] = [
		{ value: 'name_asc', label: '이름 오름차순' },
		{ value: 'name_desc', label: '이름 내림차순' },
		{ value: 'date_asc', label: '날짜 오름차순' },
		{ value: 'date_desc', label: '날짜 내림차순' },
		{ value: 'price_asc', label: '가격 낮은순' },
		{ value: 'price_desc', label: '가격 높은순' },
	];

	return (
		<div className="min-h-screen p-8 bg-gray-50">
			<div className="max-w-4xl mx-auto">
				{/* 헤더 */}
				<div className="mb-8 text-center">
					<div className="inline-block px-8 py-6 bg-white neu-raised rounded-2xl">
						<h1 className="mb-2 text-3xl font-bold text-gray-900">
							Field Component Demo
						</h1>
						<p className="text-gray-600">
							통합 필드 컴포넌트 (텍스트, 필터, 다중선택, 정렬)
						</p>
					</div>
				</div>

				{/* Field 컴포넌트 테스트 */}
				<FilterPanel
					title="Field Component Test"
					onSearch={handleSearch}
					onReset={handleReset}
					statusText="통합 필드 컴포넌트 테스트">
					{/* 텍스트 입력 */}
					<FieldText
						label="검색어 입력"
						placeholder="검색어를 입력하세요"
						value={textValue}
						onChange={setTextValue}
						showSearchIcon={true}
					/>

					{/* 필터 선택 */}
					<FieldFilterSelect
						label="필터 선택"
						placeholder="하나의 옵션을 선택하세요"
						value={singleSelectValue}
						onChange={setSingleSelectValue}
						options={singleSelectOptions}
					/>

					{/* 다중 선택 */}
					<FieldMultiSelect
						label="다중 선택"
						placeholder="여러 옵션을 선택하세요"
						value={multiSelectValue}
						onChange={setMultiSelectValue}
						options={multiSelectOptions}
					/>

					{/* 정렬 선택 */}
					<FieldSortSelect
						label="정렬 기준"
						placeholder="정렬 방식을 선택하세요"
						value={sortValue}
						onChange={setSortValue}
						options={sortOptions}
					/>
				</FilterPanel>

				{/* 선택된 값 표시 */}
				{hasValues && (
					<div className="p-6 mt-6 neu-flat bg-gray-50 rounded-2xl">
						<h3 className="mb-4 text-lg font-semibold text-gray-900">
							선택된 값
						</h3>

						<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
							{/* 텍스트 입력 결과 */}
							<div className="p-4 bg-white neu-inset rounded-xl">
								<h4 className="mb-3 text-sm font-semibold text-gray-800">
									텍스트 입력
								</h4>
								<div className="text-sm text-gray-600">
									<div>
										<span className="font-medium text-gray-700">입력값:</span>{' '}
										{textValue || '없음'}
									</div>
								</div>
							</div>

							{/* 필터 선택 결과 */}
							<div className="p-4 bg-white neu-inset rounded-xl">
								<h4 className="mb-3 text-sm font-semibold text-gray-800">
									필터 선택
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
									다중 선택
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

							{/* 정렬 선택 결과 */}
							<div className="p-4 bg-white neu-inset rounded-xl">
								<h4 className="mb-3 text-sm font-semibold text-gray-800">
									정렬 기준
								</h4>
								<div className="text-sm text-gray-600">
									<div>
										<span className="font-medium text-gray-700">
											선택된 정렬:
										</span>{' '}
										{sortValue
											? sortOptions.find((opt) => opt.value === sortValue)
													?.label
											: '없음'}
									</div>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
