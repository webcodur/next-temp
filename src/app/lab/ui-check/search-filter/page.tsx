'use client';

import React, { useState } from 'react';
import { TextInput } from '@/components/ui/text-input/TextInput';
import { Select, Option } from '@/components/ui/select/Select';
import { FilterPanel } from '@/components/ui/filter-panel/FilterPanel';

export default function SearchFilterPage() {
	const [searchValues, setSearchValues] = useState({
		companyName: '',
		partner: '',
		parking: '',
		userId: '',
		email: '',
		phoneNumber: '',
	});

	const [filterValues, setFilterValues] = useState({
		status: 'all',
		partnerType: '',
		region: '',
		category: '',
		sortBy: 'recent',
		sortOrder: 'desc',
	});

	const [isSearchApplied, setIsSearchApplied] = useState(false);

	const handleSearchChange = (field: string, value: string) => {
		setSearchValues((prev) => ({ ...prev, [field]: value }));
	};

	const handleFilterChange = (field: string, value: string) => {
		setFilterValues((prev) => ({ ...prev, [field]: value }));
	};

	const handleSearch = () => {
		setIsSearchApplied(true);
		console.log('검색 실행:', { searchValues, filterValues });
	};

	const handleReset = () => {
		setSearchValues({
			companyName: '',
			partner: '',
			parking: '',
			userId: '',
			email: '',
			phoneNumber: '',
		});
		setFilterValues({
			status: 'all',
			partnerType: '',
			region: '',
			category: '',
			sortBy: 'recent',
			sortOrder: 'desc',
		});
		setIsSearchApplied(false);
	};

	const hasValues =
		Object.values(searchValues).some((value) => value.trim() !== '') ||
		Object.values(filterValues).some((value, index) => {
			const defaults = ['all', '', '', '', 'recent', 'desc'];
			return value !== defaults[index];
		});

	// 옵션 데이터들
	const statusOptions: Option[] = [
		{ value: 'all', label: '전체' },
		{ value: 'active', label: '활성' },
		{ value: 'inactive', label: '비활성' },
		{ value: 'pending', label: '대기중' },
		{ value: 'blocked', label: '차단됨' },
	];

	const partnerTypeOptions: Option[] = [
		{ value: '', label: '전체' },
		{ value: 'premium', label: '프리미엄' },
		{ value: 'standard', label: '스탠다드' },
		{ value: 'basic', label: '베이직' },
		{ value: 'trial', label: '체험판' },
	];

	const regionOptions: Option[] = [
		{ value: '', label: '전체 지역' },
		{ value: 'seoul', label: '서울' },
		{ value: 'busan', label: '부산' },
		{ value: 'daegu', label: '대구' },
		{ value: 'incheon', label: '인천' },
		{ value: 'gwangju', label: '광주' },
		{ value: 'daejeon', label: '대전' },
		{ value: 'ulsan', label: '울산' },
	];

	const categoryOptions: Option[] = [
		{ value: '', label: '전체 카테고리' },
		{ value: 'retail', label: '소매업' },
		{ value: 'food', label: '음식업' },
		{ value: 'service', label: '서비스업' },
		{ value: 'manufacturing', label: '제조업' },
		{ value: 'logistics', label: '물류업' },
	];

	const sortByOptions: Option[] = [
		{ value: 'recent', label: '최신순' },
		{ value: 'name', label: '이름순' },
		{ value: 'status', label: '상태순' },
		{ value: 'partner', label: '파트너순' },
		{ value: 'region', label: '지역순' },
	];

	const sortOrderOptions: Option[] = [
		{ value: 'desc', label: '내림차순' },
		{ value: 'asc', label: '오름차순' },
	];

	const getStatusText = () => {
		if (isSearchApplied) {
			return '검색 결과 출력중';
		}
		return '기본 목록 출력중';
	};

	return (
		<div className="min-h-screen p-8 bg-gray-50">
			<div className="mx-auto max-w-7xl">
				{/* 헤더 */}
				<div className="mb-8 text-center">
					<div className="inline-block px-8 py-6 bg-white neu-raised rounded-2xl">
						<h1 className="mb-2 text-3xl font-bold text-gray-900">
							Advanced Search UI
						</h1>
						<p className="text-gray-600">통합 검색, 필터, 정렬 시스템</p>
					</div>
				</div>

				{/* Advanced Search 통합 섹션 */}
				<FilterPanel
					title="Advanced Search · Filter · Sort"
					onSearch={handleSearch}
					onReset={handleReset}
					statusText={getStatusText()}>
					{/* 첫 번째 행: 검색 필드들 */}
					<TextInput
						label="도른 이름"
						placeholder="도른 이름 검색..."
						value={searchValues.companyName}
						onChange={(value) => handleSearchChange('companyName', value)}
						onEnterPress={handleSearch}
						size="md"
						showSearchIcon
					/>

					<TextInput
						label="파트너사"
						placeholder="파트너사 검색..."
						value={searchValues.partner}
						onChange={(value) => handleSearchChange('partner', value)}
						onEnterPress={handleSearch}
						size="md"
						showSearchIcon
					/>

					<TextInput
						label="주차장"
						placeholder="주차장 검색..."
						value={searchValues.parking}
						onChange={(value) => handleSearchChange('parking', value)}
						onEnterPress={handleSearch}
						size="md"
						showSearchIcon
					/>

					{/* 두 번째 행: 추가 검색 필드들 */}
					<TextInput
						label="사용자 ID"
						placeholder="사용자 ID 검색..."
						value={searchValues.userId}
						onChange={(value) => handleSearchChange('userId', value)}
						onEnterPress={handleSearch}
						size="md"
						showSearchIcon
					/>

					<TextInput
						label="이메일"
						placeholder="이메일 검색..."
						value={searchValues.email}
						onChange={(value) => handleSearchChange('email', value)}
						onEnterPress={handleSearch}
						size="md"
						showSearchIcon
					/>

					<TextInput
						label="전화번호"
						placeholder="전화번호 검색..."
						value={searchValues.phoneNumber}
						onChange={(value) => handleSearchChange('phoneNumber', value)}
						onEnterPress={handleSearch}
						size="md"
						showSearchIcon
					/>

					{/* 세 번째 행: 필터 옵션들 */}
					<Select
						label="상태"
						value={filterValues.status}
						onChange={(value) => handleFilterChange('status', value)}
						options={statusOptions}
						iconType="filter"
					/>

					<Select
						label="파트너 타입"
						value={filterValues.partnerType}
						onChange={(value) => handleFilterChange('partnerType', value)}
						options={partnerTypeOptions}
						iconType="filter"
					/>

					<Select
						label="지역"
						value={filterValues.region}
						onChange={(value) => handleFilterChange('region', value)}
						options={regionOptions}
						iconType="filter"
					/>

					{/* 네 번째 행: 추가 필터 & 정렬 */}
					<Select
						label="카테고리"
						value={filterValues.category}
						onChange={(value) => handleFilterChange('category', value)}
						options={categoryOptions}
						iconType="filter"
					/>

					<Select
						label="정렬 기준"
						value={filterValues.sortBy}
						onChange={(value) => handleFilterChange('sortBy', value)}
						options={sortByOptions}
						iconType="sort"
					/>

					<Select
						label="정렬 순서"
						value={filterValues.sortOrder}
						onChange={(value) => handleFilterChange('sortOrder', value)}
						options={sortOrderOptions}
						iconType="sort"
					/>
				</FilterPanel>

				{/* 검색 결과 및 상태 */}
				{(isSearchApplied || hasValues) && (
					<div className="p-6 mt-6 neu-flat bg-gray-50 rounded-2xl">
						<h3 className="mb-4 text-lg font-semibold text-gray-900">
							검색 결과 및 적용된 조건
						</h3>

						<div className="grid gap-4 md:grid-cols-2">
							{/* 검색 조건 */}
							<div className="p-4 bg-white neu-inset rounded-xl">
								<h4 className="mb-3 text-sm font-semibold text-gray-800">
									검색 조건
								</h4>
								<div className="space-y-2 text-sm text-gray-600">
									<div>
										<span className="font-medium text-gray-700">
											도른 이름:
										</span>{' '}
										{searchValues.companyName || '전체'}
									</div>
									<div>
										<span className="font-medium text-gray-700">파트너사:</span>{' '}
										{searchValues.partner || '전체'}
									</div>
									<div>
										<span className="font-medium text-gray-700">주차장:</span>{' '}
										{searchValues.parking || '전체'}
									</div>
									<div>
										<span className="font-medium text-gray-700">
											사용자 ID:
										</span>{' '}
										{searchValues.userId || '전체'}
									</div>
									<div>
										<span className="font-medium text-gray-700">이메일:</span>{' '}
										{searchValues.email || '전체'}
									</div>
									<div>
										<span className="font-medium text-gray-700">전화번호:</span>{' '}
										{searchValues.phoneNumber || '전체'}
									</div>
								</div>
							</div>

							{/* 필터 & 정렬 조건 */}
							<div className="p-4 bg-white neu-inset rounded-xl">
								<h4 className="mb-3 text-sm font-semibold text-gray-800">
									필터 및 정렬
								</h4>
								<div className="space-y-2 text-sm text-gray-600">
									<div>
										<span className="font-medium text-gray-700">상태:</span>{' '}
										{
											statusOptions.find(
												(opt) => opt.value === filterValues.status
											)?.label
										}
									</div>
									<div>
										<span className="font-medium text-gray-700">
											파트너 타입:
										</span>{' '}
										{partnerTypeOptions.find(
											(opt) => opt.value === filterValues.partnerType
										)?.label || '전체'}
									</div>
									<div>
										<span className="font-medium text-gray-700">지역:</span>{' '}
										{regionOptions.find(
											(opt) => opt.value === filterValues.region
										)?.label || '전체'}
									</div>
									<div>
										<span className="font-medium text-gray-700">카테고리:</span>{' '}
										{categoryOptions.find(
											(opt) => opt.value === filterValues.category
										)?.label || '전체'}
									</div>
									<div>
										<span className="font-medium text-gray-700">정렬:</span>{' '}
										{
											sortByOptions.find(
												(opt) => opt.value === filterValues.sortBy
											)?.label
										}{' '}
										·{' '}
										{
											sortOrderOptions.find(
												(opt) => opt.value === filterValues.sortOrder
											)?.label
										}
									</div>
								</div>
							</div>
						</div>

						<div className="pt-4 mt-4 border-t border-gray-300">
							<span className="text-xs font-medium text-gray-500">
								{isSearchApplied
									? '✓ 검색이 적용되었습니다'
									: '조건 변경됨 - 검색 버튼을 눌러주세요'}
							</span>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
