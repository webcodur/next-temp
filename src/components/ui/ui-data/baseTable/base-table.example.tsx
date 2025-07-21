'use client';

import React from 'react';
import { BaseTable, BaseTableColumn } from './BaseTable';
import { useTranslations } from '@/hooks/useI18n';

// 예제용 사용자 데이터 타입
interface User extends Record<string, unknown> {
	id: number;
	name: string;
	email: string;
	role: string;
	status: 'active' | 'inactive' | 'pending';
	joinDate: Date;
	description?: string;
}

export default function BaseTableExample() {
	const t = useTranslations();

	// 예제 데이터
	const users: User[] = [
		{
			id: 1,
			name: '김지민',
			email: 'jimin@example.com',
			role: '관리자',
			status: 'active',
			joinDate: new Date('2023-01-15'),
			description: '시스템 관리자로서 서버 관리, 사용자 계정 관리, 보안 정책 수립 등의 업무를 담당하고 있습니다. 10년 이상의 경력을 보유하고 있으며, 다양한 시스템 운영 경험이 있습니다.',
		},
		{
			id: 2,
			name: '이서준',
			email: 'seojun@example.com',
			role: '사용자',
			status: 'inactive',
			joinDate: new Date('2023-03-22'),
			description: '일반 사용자',
		},
		{
			id: 3,
			name: '박민지',
			email: 'minji@example.com',
			role: '편집자',
			status: 'active',
			joinDate: new Date('2023-02-10'),
			description: '콘텐츠 편집 및 검토를 담당하는 편집자입니다. 다양한 분야의 콘텐츠 편집 경험을 바탕으로 고품질의 콘텐츠를 제작하고 있습니다.',
		},
		{
			id: 4,
			name: '최준호',
			email: 'junho@example.com',
			role: '사용자',
			status: 'pending',
			joinDate: new Date('2023-04-05'),
			description: '신규 가입자로 계정 승인 대기 중입니다.',
		},
		{
			id: 5,
			name: '정소율',
			email: 'soyul@example.com',
			role: '편집자',
			status: 'active',
			joinDate: new Date('2023-01-30'),
			description: '마케팅 콘텐츠 전문 편집자로, 브랜드 스토리텔링과 사용자 경험 개선에 중점을 두고 작업하고 있습니다. 창의적이고 효과적인 콘텐츠 제작에 열정을 가지고 있습니다.',
		},
	];

	// 테이블 컬럼 정의
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
		{
			key: 'description',
			header: t('테이블_설명'),
			sortable: false,
			align: 'start',
			width: '200px',
		},
	];

	const handleRowClick = (user: User, index: number) => {
		console.log(`행 클릭됨:`, user, index);
	};

	return (
		<div className="p-6 mx-auto max-w-6xl">
			<h1 className="mb-6 text-2xl font-bold">BaseTable (A) 예시</h1>
			<p className="mb-4 text-muted-foreground">
				순수 테이블 기능: 정렬, tooltip 지원 (긴 텍스트에 마우스 호버 시 전체 내용 표시)
			</p>
			<BaseTable 
				data={users} 
				columns={columns} 
				onRowClick={handleRowClick}
			/>
		</div>
	);
} 