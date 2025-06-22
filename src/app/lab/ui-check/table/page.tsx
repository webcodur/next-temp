'use client';

import React, { useState } from 'react';
import {
	SmartTable,
	SmartTableColumn,
} from '@/components/ui/smartTable/SmartTable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge/index';
import { Pencil, Trash2 } from 'lucide-react';

// 예제용 사용자 데이터 타입
interface User {
	id: number;
	name: string;
	email: string;
	role: string;
	status: 'active' | 'inactive' | 'pending';
	joinDate: Date;
}

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
		active: '활성',
		inactive: '비활성',
		pending: '대기',
	};

	return (
		<Badge className={`neu-flat ${styles[status]}`}>{labels[status]}</Badge>
	);
};

export default function TablePage() {
	const [data, setData] = useState<User[] | null>(users); // null로 설정하면 로딩 상태

	// 테이블 컬럼 정의
	const columns: SmartTableColumn<User>[] = [
		{
			id: 'id',
			header: 'ID',
			accessorKey: 'id',
			sortable: true,
			align: 'center',
			width: '80px',
		},
		{
			id: 'name',
			header: '이름',
			accessorKey: 'name',
			sortable: true,
			align: 'left',
			width: '120px',
		},
		{
			id: 'email',
			header: '이메일',
			accessorKey: 'email',
			sortable: true,
			align: 'left',
			width: '200px',
		},
		{
			id: 'role',
			header: '역할',
			accessorKey: 'role',
			sortable: true,
			align: 'center',
			width: '100px',
		},
		{
			id: 'status',
			header: '상태',
			accessorKey: 'status',
			sortable: true,
			align: 'center',
			width: '100px',
			cell: (user) => <StatusBadge status={user.status} />,
		},
		{
			id: 'joinDate',
			header: '가입일',
			accessorKey: 'joinDate',
			sortable: true,
			align: 'center',
			width: '120px',
			cell: (user) => user.joinDate.toLocaleDateString('ko-KR'),
		},
		{
			id: 'actions',
			header: '작업',
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
		alert(`사용자 ${id} 편집`);
	};

	// 삭제 핸들러
	const handleDelete = (id: number) => {
		alert(`사용자 ${id} 삭제`);
	};

	// 행 클릭 핸들러 (상세 페이지 이동 시뮬레이션)
	const handleRowClick = (user: User) => {
		alert(
			`${user.name}의 상세 정보 페이지로 이동\n이메일: ${user.email}\n상태: ${user.status === 'active' ? '활성' : user.status === 'inactive' ? '비활성' : '대기'}`
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
			<h1 className="mb-6 text-2xl font-bold">간소화된 테이블 컴포넌트</h1>

			<div className="flex flex-wrap gap-4 mb-6">
				<Button onClick={simulateLoading} className="neu-raised">
					로딩 시뮬레이션
				</Button>
				<Button
					onClick={simulateEmpty}
					className="neu-raised"
					variant="outline">
					빈 데이터
				</Button>
				<Button onClick={restoreData} className="neu-raised" variant="outline">
					데이터 복원
				</Button>
			</div>

			<div className="mb-10">
				<h2 className="mb-4 text-xl font-semibold">자동 처리 테이블</h2>
				<div className="p-4 mb-4 bg-blue-50 rounded-lg neu-flat">
					<h3 className="mb-2 font-semibold text-blue-800">🚀 간소화된 기능</h3>
					<ul className="space-y-1 text-sm text-blue-700">
						<li>
							• <strong>자동 로딩 감지</strong>: data가 null/undefined이면
							자동으로 &quot;로딩 중...&quot; 표시
						</li>
						<li>
							• <strong>자동 빈 메시지</strong>: 데이터가 빈 배열이면 자동으로
							&quot;데이터가 없습니다.&quot; 표시
						</li>
						<li>
							• <strong>컴팩트 모드 고정</strong>: 항상 작은 패딩으로 공간
							효율적
						</li>
						<li>
							• <strong>세로선 항상 표시</strong>: 명확한 컬럼 구분
						</li>
						<li>
							• <strong>둥근 모서리 고정</strong>: 일관된 디자인
						</li>
						<li>
							• <strong>페이지네이션</strong>: pageSize로 표시할 행 수 제어
							(기본 10행)
						</li>
						<li>
							• <strong>고정 높이</strong>: 로딩/빈 상태에서도 지정된 행 수만큼
							높이 유지
						</li>
						<li>
							• <strong>Props 대폭 축소</strong>: 15개 → 5개로 간소화
						</li>
					</ul>
				</div>
				<SmartTable
					data={data || []} // null이면 빈 배열로 처리
					columns={columns}
					pageSize={5} // 5행으로 제한하여 페이지네이션 효과 확인
				/>
			</div>

			<div className="mb-10">
				<h2 className="mb-4 text-xl font-semibold">행 클릭 인터랙션 테이블</h2>
				<div className="p-4 mb-4 bg-green-50 rounded-lg neu-flat">
					<h3 className="mb-2 font-semibold text-green-800">✨ 행 클릭 기능</h3>
					<ul className="space-y-1 text-sm text-green-700">
						<li>
							• <strong>clickableRows</strong>: 행 클릭 활성화 여부
						</li>
						<li>
							• <strong>onRowClick</strong>: 행 클릭 시 실행할 함수
						</li>
						<li>
							• <strong>간단한 hover 효과</strong>: 그림자와 테두리만 적용
						</li>
						<li>
							• <strong>커서 포인터</strong>: 클릭 가능함을 시각적으로 표시
						</li>
						<li>
							• <strong>선택적 적용</strong>: 상세 페이지 이동이 필요한 경우에만
							사용
						</li>
					</ul>
				</div>
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
					<h2 className="mb-4 text-xl font-semibold">조건부 스타일링</h2>
					<p className="mb-4 text-sm text-gray-600">
						rowClassName으로 비활성 사용자를 흐리게 표시 (3행 고정)
					</p>
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
					<h2 className="mb-4 text-xl font-semibold">기본 페이지 크기</h2>
					<p className="mb-4 text-sm text-gray-600">
						pageSize 미지정 시 기본 10행으로 표시
					</p>
					<SmartTable data={users} columns={columns} />
				</div>
			</div>

			<div className="mt-10">
				<h2 className="mb-4 text-xl font-semibold">
					다양한 페이지 크기 테스트
				</h2>
				<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
					<div>
						<h3 className="mb-2 font-semibold">2행 고정</h3>
						<p className="mb-4 text-sm text-gray-600">
							데이터가 많아도 2행만 표시, 로딩/빈 상태도 2행 높이 유지
						</p>
						<SmartTable data={users} columns={columns} pageSize={2} />
					</div>

					<div>
						<h3 className="mb-2 font-semibold">빈 데이터 (3행 높이)</h3>
						<p className="mb-4 text-sm text-gray-600">
							데이터가 없어도 3행 높이로 고정
						</p>
						<SmartTable data={[]} columns={columns} pageSize={3} />
					</div>

					<div>
						<h3 className="mb-2 font-semibold">로딩 상태 (4행 높이)</h3>
						<p className="mb-4 text-sm text-gray-600">
							로딩 중에도 4행 높이로 고정
						</p>
						<SmartTable data={null} columns={columns} pageSize={4} />
					</div>
				</div>
			</div>

			<div className="mt-10">
				<h2 className="mb-4 text-xl font-semibold">API 비교</h2>
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
					<div className="p-4 bg-red-50 rounded-lg neu-flat">
						<h3 className="mb-2 font-semibold text-red-800">
							❌ 이전 (15개 Props)
						</h3>
						<pre className="overflow-x-auto text-xs text-red-700">
							{`<Table
  data={users}
  columns={columns}
  className='custom'
  tableClassName='table'
  headerClassName='header'
  bodyClassName='body'
  rowClassName='row'
  cellClassName='cell'
  emptyMessage='없음'
  isLoading={loading}
  compact={true}
  rounded={true}
  minRows={5}
  showVerticalLines={true}
/>`}
						</pre>
					</div>

					<div className="p-4 bg-green-50 rounded-lg neu-flat">
						<h3 className="mb-2 font-semibold text-green-800">
							✅ 현재 (5개 Props)
						</h3>
						<pre className="overflow-x-auto text-xs text-green-700">
							{`<SmartTable
  data={users}
  columns={columns}
  className='custom'
  rowClassName='row'
  pageSize={10}
/>`}
						</pre>
					</div>
				</div>
			</div>
		</div>
	);
}
