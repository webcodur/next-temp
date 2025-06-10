'use client';

import React, { useState } from 'react';
import { Table, TableColumn } from '@/components/ui/table/table';
import { Button } from '@/components/ui/Button';
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
    <Badge className={`neu-flat ${styles[status]}`}>
      {labels[status]}
    </Badge>
  );
};

export default function TablePage() {
  const [loading, setLoading] = useState(false);

  // 테이블 컬럼 정의
  const columns: TableColumn<User>[] = [
    {
      id: 'id',
      header: 'ID',
      accessorKey: 'id',
      sortable: true,
    },
    {
      id: 'name',
      header: '이름',
      accessorKey: 'name',
      sortable: true,
    },
    {
      id: 'email',
      header: '이메일',
      accessorKey: 'email',
      sortable: true,
    },
    {
      id: 'role',
      header: '역할',
      accessorKey: 'role',
      sortable: true,
    },
    {
      id: 'status',
      header: '상태',
      accessorKey: 'status',
      sortable: true,
      cell: (user) => <StatusBadge status={user.status} />,
    },
    {
      id: 'joinDate',
      header: '가입일',
      accessorKey: 'joinDate',
      sortable: true,
      cell: (user) => user.joinDate.toLocaleDateString('ko-KR'),
    },
    {
      id: 'actions',
      header: '작업',
      cell: (user) => (
        <div className="flex items-center space-x-2 justify-center">
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 p-0 neu-raised"
            onClick={() => handleEdit(user.id)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 p-0 text-red-500 neu-raised"
            onClick={() => handleDelete(user.id)}
          >
            <Trash2 className="h-4 w-4" />
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

  // 로딩 시뮬레이션
  const simulateLoading = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">테이블 컴포넌트</h1>
      
      <div className="mb-6 flex flex-wrap gap-4">
        <Button onClick={simulateLoading} className="neu-raised">
          로딩 시뮬레이션
        </Button>
      </div>

      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4">기본 테이블</h2>
        <Table
          data={users}
          columns={columns}
          isLoading={loading}
          compact={true}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">빈 테이블</h2>
          <Table
            data={[]}
            columns={columns}
            emptyMessage="사용자가 없습니다."
            compact={true}
          />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">일부 데이터</h2>
          <Table
            data={users.slice(0, 3)}
            columns={columns}
            compact={true}
          />
        </div>
      </div>
    </div>
  );
} 