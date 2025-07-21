/*
  파일명: src/components/ui/ui-data/pagination/pagination.example.tsx
  기능: `DataTable` 컴포넌트와 통합된 페이지네이션 기능을 테스트하는 예시
  책임: 목업 데이터를 생성하고, 테이블에 표시하며, 페이지 변경, 페이지 크기 조절, 데이터 새로고침 등 페이지네이션 관련 상호작용을 검증한다.
*/

'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { PaginatedTable, BaseTableColumn } from '../paginatedTable/PaginatedTable';
import { useTranslations } from '@/hooks/useI18n';

// #region 타입 정의
interface User extends Record<string, unknown> {
	key: number;
	name: string;
	email: string;
	status: 'active' | 'pending' | 'inactive';
	department: string;
	joinDate: string;
}
// #endregion

export default function PaginationExample() {
	// #region 훅
	const t = useTranslations();
	// #endregion

	// #region 상태 관리
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const [isFetching, setIsFetching] = useState(false);
	const [userData, setUserData] = useState<User[] | null>(null);
	// #endregion

	// #region 상수 및 목업 데이터
	const generateMockUsers = (count: number): User[] => {
		const departments = ['개발', '디자인', '마케팅', '영업', '운영'];
		const statuses: User['status'][] = ['active', 'pending', 'inactive'];

		return Array.from({ length: count }, (_, index) => ({
			key: index + 1,
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

	const columns: BaseTableColumn<User>[] = [
		{
			key: 'id' as keyof User,
			header: t('테이블_ID'),
			width: '10%',
			align: 'center',
		},
		{
			key: 'name',
			header: t('테이블_이름'),
			width: '18%',
			align: 'start',
		},
		{
			key: 'email',
			header: t('테이블_이메일'),
			width: '30%',
			align: 'start',
		},
		{
			key: 'department',
			header: t('페이지네이션_부서'),
			width: '15%',
			align: 'center',
		},
		{
			key: 'status',
			header: t('테이블_상태'),
			width: '15%',
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
						? t('테이블_활성')
						: user.status === 'pending'
							? t('페이지네이션_대기중')
							: t('테이블_비활성')}
				</span>
			),
		},
		{
			key: 'joinDate',
			header: t('페이지네이션_입사일'),
			width: '12%',
			align: 'center',
		},
	];
	// #endregion

	// #region 데이터 로딩
	const loadData = useCallback(async () => {
		setIsFetching(true);
		setUserData(null);

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

	const handleReloadData = () => {
		loadData();
	};
	// #endregion

	// #region 렌더링
	return (
		<div className="container px-4 py-8 mx-auto">
			<h1 className="mb-6 text-3xl font-bold">
				{t('페이지네이션_제목')}
			</h1>

			<div className="mb-8">
				<h2 className="mb-4 text-xl font-semibold">{t('페이지네이션_기본예제')}</h2>
				<div className="p-6 bg-white rounded-lg shadow-md">
					<div className="flex gap-4 items-center mb-4">
						<p className="text-gray-700">
							{t('페이지네이션_현재페이지')}: <span className="font-medium">{currentPage}</span>
						</p>
						<p className="text-gray-700">
							{t('페이지네이션_페이지크기')}: <span className="font-medium">{pageSize}</span>
						</p>
						<p className="text-gray-700">
							{t('페이지네이션_총항목')}:{' '}
							<span className="font-medium">{userData?.length || 0}</span>
						</p>
					</div>

					<div className="flex gap-4 mb-6">
						<button
							onClick={handleReloadData}
							disabled={isFetching}
							className={`px-4 py-2 rounded-md ${
								isFetching
									? 'text-gray-600 bg-gray-300 cursor-not-allowed'
									: 'text-white bg-green-600 hover:bg-green-700'
							}`}>
							{isFetching ? t('페이지네이션_로딩중') : t('페이지네이션_데이터새로고침')}
						</button>
					</div>

					<PaginatedTable
						data={userData}
						columns={columns}
						isFetching={isFetching}
						currentPage={currentPage}
						pageSize={pageSize}
						onPageChange={handlePageChange}
						onPageSizeChange={handlePageSizeChange}
						pageSizeOptions={[5, 10, 20, 50]}
						itemName={t('페이지네이션_사용자')}
					/>
				</div>
			</div>

			<div className="mb-8">
				<h2 className="mb-4 text-xl font-semibold">
					{t('페이지네이션_자동관리')}
				</h2>
				<div className="p-6 bg-white rounded-lg shadow-md">
									<PaginatedTable
					data={userData}
					columns={columns}
					pageSize={15}
					itemName={t('페이지네이션_사용자')}
				/>
				</div>
			</div>
		</div>
	);
	// #endregion
} 