'use client';

import React, { useState } from 'react';
import { PaginatedTable, BaseTableColumn } from './PaginatedTable';
import { useTranslations } from '@/hooks/useI18n';

// 예제용 사용자 데이터 타입
interface User extends Record<string, unknown> {
	id: number;
	name: string;
	email: string;
	role: string;
	status: 'active' | 'inactive' | 'pending';
	joinDate: Date;
}

export default function PaginatedTableExample() {
	const t = useTranslations();

	// 대용량 데이터 생성 (237개)
	const generateUsers = (count: number): User[] => {
		const roles = ['관리자', '편집자', '사용자'];
		const statuses: User['status'][] = ['active', 'inactive', 'pending'];
		
		return Array.from({ length: count }, (_, index) => ({
			id: index + 1,
			name: `사용자 ${index + 1}`,
			email: `user${index + 1}@example.com`,
			role: roles[index % roles.length],
			status: statuses[index % statuses.length],
			joinDate: new Date(Date.now() - index * 86400000), // 날짜 역순
		}));
	};

	// #region 상태 관리
	const [users] = useState<User[]>(() => generateUsers(237));
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	// #endregion

	// #region 컬럼 정의
	const columns: BaseTableColumn<User>[] = [
		{
			key: 'id',
			header: t('테이블_ID'),
			sortable: true,
			align: 'center',
			width: '80px',
		},
		{
			key: 'name',
			header: t('테이블_이름'),
			sortable: true,
			align: 'start',
			width: '120px',
		},
		{
			key: 'email',
			header: t('테이블_이메일'),
			sortable: true,
			align: 'start',
			width: '200px',
		},
		{
			key: 'role',
			header: t('테이블_역할'),
			sortable: true,
			align: 'center',
			width: '100px',
		},
		{
			key: 'status',
			header: t('테이블_상태'),
			sortable: true,
			align: 'center',
			width: '100px',
			cell: (user) => {
				const statusMap = {
					active: { label: t('테이블_활성'), color: 'text-green-600' },
					inactive: { label: t('테이블_비활성'), color: 'text-gray-500' },
					pending: { label: t('테이블_대기'), color: 'text-yellow-600' },
				};
				const statusInfo = statusMap[user.status];
				return <span className={statusInfo.color}>{statusInfo.label}</span>;
			},
		},
		{
			key: 'joinDate',
			header: t('테이블_가입일'),
			sortable: true,
			align: 'center',
			width: '120px',
			cell: (user) => user.joinDate.toLocaleDateString('ko-KR'),
		},
	];
	// #endregion

	// #region 핸들러
	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	const handlePageSizeChange = (size: number) => {
		setPageSize(size);
		setCurrentPage(1); // 페이지 크기 변경 시 첫 페이지로
	};

	const handleRowClick = (user: User, index: number) => {
		console.log(`행 클릭됨:`, user, index);
	};
	// #endregion

	return (
		<div className="p-6 mx-auto max-w-6xl">
			<h1 className="mb-6 text-2xl font-bold">PaginatedTable (A+y) 예시</h1>
			<p className="mb-4 text-muted-foreground">
				BaseTable + 페이지네이션: 총 {users.length}개 아이템 (현재 {currentPage}페이지, {pageSize}개씩)
			</p>
			<PaginatedTable
				data={users}
				columns={columns}
				currentPage={currentPage}
				pageSize={pageSize}
				onPageChange={handlePageChange}
				onPageSizeChange={handlePageSizeChange}
				pageSizeOptions={[5, 10, 20, 50]}
				itemName="사용자"
				onRowClick={handleRowClick}
			/>
		</div>
	);
} 