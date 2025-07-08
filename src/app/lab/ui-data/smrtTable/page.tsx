/*
  파일명: src/app/lab/ui-data/smrtTable/page.tsx
  기능: SmartTable 컴포넌트를 테스트하는 페이지 (경로 정비: smrtTable)
  책임: SmartTable의 컬럼, 정렬, 페이징 등 기본 기능을 실험한다.
*/

'use client';

import React, { useMemo, useState } from 'react';

import { SmartTable, SmartTableColumn } from '@/components/ui/ui-data/smartTable/SmartTable';
import { useTranslations } from '@/hooks/useI18n';

interface User {
	id: number;
	name: string;
	email: string;
	role: string;
	status: 'active' | 'inactive' | 'pending';
	joinDate: Date;
}

export default function SmartTableDemoPage() {
	// #region 훅
	const t = useTranslations();
	// #endregion

	// #region 상태
	const [users] = useState<User[]>(() => {
		const names = ['Kim', 'Lee', 'Park', 'Choi', 'Jung'];
		return Array.from({ length: 57 }, (_, i) => ({
			id: i + 1,
			name: `${names[i % names.length]} ${i + 1}`,
			email: `user${i + 1}@example.com`,
			role: i % 2 === 0 ? 'Admin' : 'User',
			status: i % 3 === 0 ? 'pending' : i % 2 === 0 ? 'active' : 'inactive',
			joinDate: new Date(Date.now() - i * 86400000),
		}));
	});
	// #endregion

	// #region 상수
	const columns: SmartTableColumn<User>[] = useMemo(
		() => [
			{ key: 'id', header: 'ID', width: '60px', align: 'center' },
			{ key: 'name', header: t('공통_이름') },
			{ key: 'email', header: 'E-mail', align: 'start' },
			{ key: 'role', header: t('공통_역할'), width: '120px' },
			{
				key: 'status',
				header: t('공통_상태'),
				width: '120px',
				render: (val) => {
					const value = val as User['status'];
					const colorMap: Record<User['status'], string> = {
						active: 'text-green-600',
						inactive: 'text-gray-500',
						pending: 'text-yellow-600',
					};
					return <span className={colorMap[value]}>{value}</span>;
				},
			},
			{
				key: 'joinDate',
				header: t('공통_가입일'),
				width: '140px',
				render: (val) => (val as Date).toLocaleDateString(),
			},
		],
		[t],
	);
	// #endregion

	// #region 렌더링
	return (
		<div className="container mx-auto p-6 space-y-6">
			<h1 className="text-2xl font-bold">Smart Table Demo</h1>
			<SmartTable data={users} columns={columns} pageSize={10} />
		</div>
	);
	// #endregion
} 