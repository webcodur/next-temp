'use client';

import React, { useState, useEffect, useCallback } from 'react';
import PaginatedTable from '@/components/ui/ui-data/pagination/PaginatedTable';
import { SmartTableColumn } from '@/components/ui/ui-data/smartTable/SmartTable';

// 목업 데이터 타입 (인덱스 시그니처 추가)
interface User extends Record<string, unknown> {
	id: number;
	name: string;
	email: string;
	status: 'active' | 'pending' | 'inactive';
	department: string;
	joinDate: string;
}

const PaginationDemo = () => {
	// #region 상태 관리
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const [isDisabled, setIsDisabled] = useState(false);
	const [isFetching, setIsFetching] = useState(false);
	const [userData, setUserData] = useState<User[] | null>(null);
	// #endregion

	// #region 목업 데이터 생성
	const generateMockUsers = (count: number): User[] => {
		const departments = ['개발', '디자인', '마케팅', '영업', '운영'];
		const statuses: User['status'][] = ['active', 'pending', 'inactive'];

		return Array.from({ length: count }, (_, index) => ({
			id: index + 1,
			name: `사용자 ${index + 1}`,
			email: `user${index + 1}@example.com`,
			status: statuses[index % 3],
			department: departments[index % departments.length],
			joinDate: new Date(
				2020 + Math.floor(index / 50),
				index % 12,
				(index % 28) + 1
			).toLocaleDateString('ko-KR'),
		}));
	};

	// 컬럼 정의
	const columns: SmartTableColumn<User>[] = [
		{
			id: 'id',
			header: 'ID',
			accessorKey: 'id',
			width: '80px',
			align: 'center',
		},
		{
			id: 'name',
			header: '이름',
			accessorKey: 'name',
			width: '120px',
			align: 'left',
		},
		{
			id: 'email',
			header: '이메일',
			accessorKey: 'email',
			width: '200px',
			align: 'left',
		},
		{
			id: 'department',
			header: '부서',
			accessorKey: 'department',
			width: '100px',
			align: 'center',
		},
		{
			id: 'status',
			header: '상태',
			width: '100px',
			align: 'center',
			cell: (user: User) => (
				<span
					className={`px-2 py-1 text-xs font-medium rounded-full ${
						user.status === 'active'
							? 'bg-green-100 text-green-800'
							: user.status === 'pending'
								? 'bg-yellow-100 text-yellow-800'
								: 'bg-red-100 text-red-800'
					}`}>
					{user.status === 'active'
						? '활성'
						: user.status === 'pending'
							? '대기중'
							: '비활성'}
				</span>
			),
		},
		{
			id: 'joinDate',
			header: '입사일',
			accessorKey: 'joinDate',
			width: '100px',
			align: 'center',
		},
	];
	// #endregion

	// #region 데이터 로딩 시뮬레이션
	const loadData = useCallback(async () => {
		setIsFetching(true);
		setUserData(null);

		// 2초 로딩 시뮬레이션
		setTimeout(() => {
			setUserData(generateMockUsers(237));
			setIsFetching(false);
		}, 2000);
	}, []);

	useEffect(() => {
		loadData();
	}, [loadData]);
	// #endregion

	// #region 이벤트 핸들러
	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	const handlePageSizeChange = (size: number) => {
		setPageSize(size);
		setCurrentPage(1);
	};

	const handleToggleDisabled = () => {
		setIsDisabled(!isDisabled);
	};

	const handleReloadData = () => {
		loadData();
	};
	// #endregion

	return (
		<div className="container px-4 py-8 mx-auto">
			<h1 className="mb-6 text-3xl font-bold">
				통합 테이블 + 페이지네이션 컴포넌트
			</h1>

			<div className="mb-8">
				<h2 className="mb-4 text-xl font-semibold">기본 예제 (통합 구조)</h2>
				<div className="p-6 bg-white rounded-lg shadow-md">
					<div className="flex gap-4 items-center mb-4">
						<p className="text-gray-700">
							현재 페이지: <span className="font-medium">{currentPage}</span>
						</p>
						<p className="text-gray-700">
							페이지 크기: <span className="font-medium">{pageSize}</span>
						</p>
						<p className="text-gray-700">
							총 항목:{' '}
							<span className="font-medium">{userData?.length || 0}</span>
						</p>
					</div>

					<div className="flex gap-4 mb-6">
						<button
							onClick={handleToggleDisabled}
							className={`px-4 py-2 rounded-md ${
								isDisabled
									? 'text-gray-600 bg-gray-300'
									: 'text-white bg-blue-600 hover:bg-blue-700'
							}`}>
							{isDisabled ? '페이지네이션 활성화' : '페이지네이션 비활성화'}
						</button>

						<button
							onClick={handleReloadData}
							disabled={isFetching}
							className={`px-4 py-2 rounded-md ${
								isFetching
									? 'text-gray-600 bg-gray-300 cursor-not-allowed'
									: 'text-white bg-green-600 hover:bg-green-700'
							}`}>
							{isFetching ? '로딩 중...' : '데이터 새로고침'}
						</button>
					</div>

					{/* 통합 테이블 + 페이지네이션 */}
					<PaginatedTable
						data={userData}
						columns={columns}
						isFetching={isFetching}
						currentPage={currentPage}
						pageSize={pageSize}
						onPageChange={handlePageChange}
						onPageSizeChange={handlePageSizeChange}
						pageSizeOptions={[5, 10, 20, 50]}
						itemName="사용자"
						disabled={isDisabled}
					/>
				</div>
			</div>

			{/* 자동 관리 모드 예시 */}
			<div className="mb-8">
				<h2 className="mb-4 text-xl font-semibold">
					자동 관리 모드 (내부 상태)
				</h2>
				<div className="p-6 bg-white rounded-lg shadow-md">
					<p className="mb-4 text-gray-600">
						페이지네이션 상태를 외부에서 관리하지 않고 컴포넌트 내부에서 자동
						관리하는 예시입니다.
					</p>

					<PaginatedTable
						data={userData}
						columns={columns}
						pageSize={15}
						itemName="사용자"
					/>
				</div>
			</div>

			{/* 페이지네이션 숨김 예시 */}
			<div className="mb-8">
				<h2 className="mb-4 text-xl font-semibold">페이지네이션 숨김 모드</h2>
				<div className="p-6 bg-white rounded-lg shadow-md">
					<p className="mb-4 text-gray-600">
						페이지네이션 UI를 숨기고 테이블만 표시하는 예시입니다.
					</p>

					<PaginatedTable
						data={userData?.slice(0, 5)} // 첫 5개만 표시
						columns={columns}
						showPagination={false}
						itemName="사용자"
					/>
				</div>
			</div>
		</div>
	);
};

export default PaginationDemo;
