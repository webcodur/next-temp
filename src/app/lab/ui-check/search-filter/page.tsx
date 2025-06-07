'use client';

import React, { useState } from 'react';
import { TextInput } from '@/components/ui/text-input/TextInput';
import { Select, Option } from '@/components/ui/select/Select';
import { FilterPanel } from '@/components/ui/filter-panel/FilterPanel';

export default function SearchFilterPage() {
	const [searchValue, setSearchValue] = useState('');
	const [method, setMethod] = useState('all');
	const [isSearchApplied, setIsSearchApplied] = useState(false);

	const handleSearch = () => setIsSearchApplied(true);
	const handleReset = () => {
		setSearchValue('');
		setMethod('all');
		setIsSearchApplied(false);
	};

	const options: Option[] = [
		{ value: 'all', label: '전체' },
		{ value: 'GET', label: 'GET' },
		{ value: 'POST', label: 'POST' },
		{ value: 'PUT', label: 'PUT' },
		{ value: 'DELETE', label: 'DELETE' },
		{ value: 'PATCH', label: 'PATCH' },
	];

	return (
		<div className="p-4">
			<FilterPanel
				title="검색 필터"
				footer={
					<>
						<button
							onClick={handleReset}
							disabled={!searchValue && method === 'all'}
							className="bg-gray-200 text-gray-700 px-4 py-2 rounded disabled:opacity-50">
							전체 초기화
						</button>
						<button
							onClick={handleSearch}
							className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded">
							검색
						</button>
					</>
				}>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 bg-gray-50 p-4 rounded-lg">
					<TextInput
						label="검색어"
						placeholder="검색어를 입력하세요"
						value={searchValue}
						onChange={setSearchValue}
						onEnterPress={handleSearch}
					/>
					<Select
						label="HTTP 메서드"
						value={method}
						onChange={setMethod}
						options={options}
					/>
				</div>
			</FilterPanel>
			{isSearchApplied && (
				<div className="mt-4 text-gray-700">
					검색어: {searchValue}, 메서드: {method}
				</div>
			)}
		</div>
	);
}
