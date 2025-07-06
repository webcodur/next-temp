'use client';

import React, { useState } from 'react';
import {
	SmartTable,
	SmartTableColumn,
} from '@/components/ui/ui-data/smartTable/SmartTable';
import { Button } from '@/components/ui/ui-input/button/Button';
import { Badge } from '@/components/ui/ui-effects/badge/Badge';
import { Pencil, Trash2 } from 'lucide-react';
import { useTranslations } from '@/hooks/useI18n';

// 예제용 사용자 데이터 타입
interface User {
	id: number;
	name: string;
	email: string;
	role: string;
	status: 'active' | 'inactive' | 'pending';
	joinDate: Date;
}

export default function TablePage() {
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
		},
		{
			id: 2,
			name: '이서준',
			email: 'seojun@example.com',
			role: '사용자',
			status: 'inactive',
			joinDate: new Date('2023-03-22'),
		},
		{
			id: 3,
			name: '박민지',
			email: 'minji@example.com',
			role: '편집자',
			status: 'active',
			joinDate: new Date('2023-02-10'),
		},
		{
			id: 4,
			name: '최준호',
			email: 'junho@example.com',
			role: '사용자',
			status: 'pending',
			joinDate: new Date('2023-04-05'),
		},
		{
			id: 5,
			name: '정소율',
			email: 'soyul@example.com',
			role: '편집자',
			status: 'active',
			joinDate: new Date('2023-01-30'),
		},
	];

	// 상태 배지 렌더링 함수
	const StatusBadge = ({ status }: { status: User['status'] }) => {
		const styles = {
			active: 'bg-green-100 text-green-700',
			inactive: 'bg-gray-100 text-gray-700',
			pending: 'bg-yellow-100 text-yellow-700',
		};

		const labels = {
			active: t('테이블_활성'),
			inactive: t('테이블_비활성'),
			pending: t('테이블_대기'),
		};

		return (
			<Badge className={`neu-flat ${styles[status]}`}>{labels[status]}</Badge>
		);
	};

	const [data, setData] = useState<User[] | null>(users); // null로 설정하면 로딩 상태

	// 테이블 컬럼 정의
	const columns: SmartTableColumn<User>[] = [
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
			cell: (user) => <StatusBadge status={user.status} />,
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
			key: 'actions',
			header: t('테이블_작업'),
			align: 'center',
			width: '140px',
			cell: (user) => (
				<div className="flex justify-center items-center space-x-2">
					<Button
						size="icon"
						variant="ghost"
						className="p-0 w-8 h-8 neu-raised"
						onClick={() => handleEdit(user.id)}>
						<Pencil className="w-4 h-4" />
					</Button>
					<Button
						size="icon"
						variant="ghost"
						className="p-0 w-8 h-8 text-red-500 neu-raised"
						onClick={() => handleDelete(user.id)}>
						<Trash2 className="w-4 h-4" />
					</Button>
				</div>
			),
		},
	];

	// 편집 핸들러
	const handleEdit = (id: number) => {
		alert(`사용자 ${id} ${t('테이블_편집')}`);
	};

	// 삭제 핸들러
	const handleDelete = (id: number) => {
		alert(`사용자 ${id} ${t('테이블_삭제')}`);
	};

	// 행 클릭 핸들러 (상세 페이지 이동 시뮬레이션)
	const handleRowClick = (user: User) => {
		const statusText = user.status === 'active' ? t('테이블_활성') : user.status === 'inactive' ? t('테이블_비활성') : t('테이블_대기');
		alert(
			`${user.name}의 상세 정보 페이지로 이동\n이메일: ${user.email}\n상태: ${statusText}`
		);
	};

	// 로딩 시뮬레이션 (data를 null로 설정)
	const simulateLoading = () => {
		setData(null);
		setTimeout(() => setData(users), 1500);
	};

	// 빈 데이터 시뮬레이션
	const simulateEmpty = () => {
		setData([]);
	};

	// 데이터 복원
	const restoreData = () => {
		setData(users);
	};

	return (
		<div className="p-6 mx-auto max-w-6xl">
			<h1 className="mb-6 text-2xl font-bold">{t('테이블_제목')}</h1>

			<div className="flex flex-wrap gap-4 mb-6">
				<Button onClick={simulateLoading} className="neu-raised" variant="outline">
					{t('테이블_로딩시뮬레이션')}
				</Button>
				<Button
					onClick={simulateEmpty}
					className="neu-raised"
					variant="outline">
					{t('테이블_빈데이터')}
				</Button>
				<Button onClick={restoreData} className="neu-raised" variant="outline">
					{t('테이블_데이터복원')}
				</Button>
			</div>

			<div className="mb-10">
				<h2 className="mb-4 text-xl font-semibold">{t('테이블_자동처리')}</h2>
				<SmartTable
					data={data || []} // null이면 빈 배열로 처리
					columns={columns}
					pageSize={5} // 5행으로 제한하여 페이지네이션 효과 확인
				/>
			</div>

			<div className="mb-10">
				<h2 className="mb-4 text-xl font-semibold">{t('테이블_행클릭')}</h2>
				<SmartTable
					data={users}
					columns={columns}
					pageSize={5}
					clickableRows={true}
					onRowClick={handleRowClick}
				/>
			</div>

			<div className="grid grid-cols-1 gap-8 md:grid-cols-2">
				<div>
					<h2 className="mb-4 text-xl font-semibold">{t('테이블_조건부스타일')}</h2>
					<SmartTable
						data={users}
						columns={columns}
						pageSize={3}
						rowClassName={(user) =>
							user.status === 'inactive' ? 'opacity-50' : ''
						}
					/>
				</div>

				<div>
					<h2 className="mb-4 text-xl font-semibold">{t('테이블_기본페이지크기')}</h2>
					<SmartTable data={users} columns={columns} />
				</div>
			</div>
		</div>
	);
}
