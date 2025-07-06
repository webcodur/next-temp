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

			<div className="mt-16">
				<h2 className="mb-6 text-2xl font-bold text-center">브랜드 칼라 테스트</h2>
				<p className="mb-8 text-center text-muted-foreground">
					오른쪽 상단 칼라 피커로 브랜드 칼라를 변경하면 아래 테이블들의 색상이 실시간으로 반영됩니다.
				</p>
				
				{/* 브랜드 변수 테스트 */}
				<div className="p-4 mb-8 rounded-lg neu-flat">
					<div className="flex justify-between items-center mb-4">
						<h3 className="font-semibold">브랜드 변수 테스트</h3>
						<div className="text-sm text-muted-foreground">
							현재: <span className="font-medium text-blue-600 dark:text-blue-400">
								{typeof window !== 'undefined' && document.documentElement.classList.contains('dark') ? '다크모드' : '라이트모드'}
							</span>
						</div>
					</div>
					<div className="grid grid-cols-10 gap-2 mb-4">
						{Array.from({ length: 10 }, (_, i) => (
							<div
								key={i}
								className="flex justify-center items-center h-12 text-xs font-bold rounded"
								style={{ 
									backgroundColor: `hsl(var(--brand-${i}))`,
									color: i < 5 ? 'white' : 'black'
								}}
							>
								{i}
							</div>
						))}
					</div>
					<div className="grid grid-cols-2 gap-4 mb-4">
						<div 
							className="p-4 rounded border cursor-pointer"
							style={{ 
								borderColor: 'hsl(var(--border))'
							}}
							onMouseEnter={(e) => {
								e.currentTarget.style.backgroundColor = 'hsl(var(--muted) / 0.5)';
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.backgroundColor = '';
							}}
						>
							기본 호버 테스트 (마우스 올려보세요)
						</div>
						<div 
							className="p-4 rounded border cursor-pointer"
							style={{ 
								borderColor: 'hsl(var(--border))'
							}}
							onMouseEnter={(e) => {
								e.currentTarget.style.backgroundColor = 'hsl(var(--brand-2) / 0.6)';
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.backgroundColor = '';
							}}
						>
							브랜드 호버 테스트 (마우스 올려보세요)
						</div>
					</div>
					<div className="text-xs text-muted-foreground">
						💡 브랜드 변수는 테마별로 자동 조정됩니다. 다크모드에서는 낮은 번호가 어두운 색상입니다.
					</div>
				</div>
				
				<div className="grid grid-cols-1 gap-8">
					{/* 기본 테이블 vs 브랜드 헤더 */}
					<div className="grid grid-cols-1 gap-8 md:grid-cols-2">
						<div>
							<h3 className="mb-4 text-lg font-semibold">기본 테이블</h3>
							<SmartTable
								data={users}
								columns={columns}
								pageSize={3}
							/>
						</div>

						<div>
							<h3 className="mb-4 text-lg font-semibold">브랜드 헤더</h3>
							<SmartTable
								data={users}
								columns={columns}
								pageSize={3}
								brandHeader={true}
							/>
						</div>
					</div>

					{/* 브랜드 액센트 vs 브랜드 호버 */}
					<div className="grid grid-cols-1 gap-8 md:grid-cols-2">
						<div>
							<h3 className="mb-4 text-lg font-semibold">브랜드 액센트 (테두리 강조)</h3>
							<SmartTable
								data={users}
								columns={columns}
								pageSize={3}
								brandAccent={true}
							/>
						</div>

						<div>
							<h3 className="mb-4 text-lg font-semibold">브랜드 호버 (행 위에 마우스 올려보세요)</h3>
							<SmartTable
								data={users}
								columns={columns}
								pageSize={3}
								brandHover={true}
							/>
						</div>
					</div>

					{/* 조합 테스트 */}
					<div className="grid grid-cols-1 gap-8 md:grid-cols-2">
						<div>
							<h3 className="mb-4 text-lg font-semibold">헤더 + 호버</h3>
							<SmartTable
								data={users}
								columns={columns}
								pageSize={3}
								brandHeader={true}
								brandHover={true}
							/>
						</div>

						<div>
							<h3 className="mb-4 text-lg font-semibold">모든 브랜드 옵션</h3>
							<SmartTable
								data={users}
								columns={columns}
								pageSize={3}
								brandAccent={true}
								brandHeader={true}
								brandHover={true}
							/>
						</div>
					</div>

					{/* 로딩 상태 브랜드 테이블 */}
					<div className="grid grid-cols-1 gap-8 md:grid-cols-2">
						<div>
							<h3 className="mb-4 text-lg font-semibold">로딩 상태 (브랜드 액센트)</h3>
							<SmartTable
								data={null}
								columns={columns}
								pageSize={3}
								brandAccent={true}
								loadingRows={3}
							/>
						</div>

						<div>
							<h3 className="mb-4 text-lg font-semibold">빈 데이터 (브랜드 헤더)</h3>
							<SmartTable
								data={[]}
								columns={columns}
								pageSize={3}
								brandHeader={true}
								emptyMessage="브랜드 테이블에 데이터가 없습니다."
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
