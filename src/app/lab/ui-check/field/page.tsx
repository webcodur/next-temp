'use client';

import { useState } from 'react';
import {
	FieldText,
	FieldSelect,
	FieldSortSelect,
	Option,
	SortDirection,
} from '@/components/ui/field/Field';

export default function FieldPage() {
	const [textValue, setTextValue] = useState('');
	const [searchValue, setSearchValue] = useState('');
	const [selectValue, setSelectValue] = useState('');
	const [sortValue, setSortValue] = useState('name');

	// 정렬 방향 상태 추가
	const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

	const tagOptions: Option[] = [
		{ value: 'design', label: '디자인' },
		{ value: 'development', label: '개발' },
		{ value: 'marketing', label: '마케팅' },
		{ value: 'planning', label: '기획' },
		{ value: 'hr', label: '인사' },
		{ value: 'finance', label: '재무' },
		{ value: 'operations', label: '운영' },
	];

	const sortOptions: Option[] = [
		{ value: 'latest', label: '등록일' },
		{ value: 'name', label: '이름' },
		{ value: 'price', label: '가격' },
		{ value: 'status', label: '상태' },
	];

	return (
		<div className="container p-6 mx-auto">
			<h1 className="mb-8 text-2xl font-bold">
				Field 컴포넌트 - 기본 셀렉트박스
			</h1>

			<div className="p-6 mx-auto max-w-2xl rounded-xl neu-flat">
				<div className="space-y-6">
					<FieldText
						label="텍스트 필드"
						placeholder="텍스트를 입력하세요"
						value={textValue}
						onChange={setTextValue}
					/>

					<FieldText
						label="검색 필드"
						placeholder="검색어를 입력하세요"
						value={searchValue}
						onChange={setSearchValue}
						showSearchIcon={true}
						onEnterPress={() => alert(`검색어: ${searchValue}`)}
					/>

					<FieldSelect
						label="기본 선택 필드"
						placeholder="태그 선택"
						options={tagOptions}
						value={selectValue}
						onChange={setSelectValue}
					/>

					<FieldSortSelect
						label="정렬 선택 필드"
						options={sortOptions}
						value={sortValue}
						onChange={setSortValue}
						sortDirection={sortDirection}
						onSortDirectionChange={setSortDirection}
					/>
				</div>

				{/* 현재 상태 표시 */}
				<div className="p-4 mt-6 bg-gray-100 rounded-lg">
					<h3 className="mb-2 text-sm font-semibold">현재 값</h3>
					<div className="text-sm space-y-1">
						<div>
							<span className="font-medium">텍스트:</span> {textValue || '없음'}
						</div>
						<div>
							<span className="font-medium">검색:</span> {searchValue || '없음'}
						</div>
						<div>
							<span className="font-medium">선택:</span> {selectValue || '없음'}
						</div>
						<div>
							<span className="font-medium">정렬:</span> {sortValue} (
							{sortDirection})
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
