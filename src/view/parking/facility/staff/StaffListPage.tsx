'use client';
import React, { useState, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { usePageDescription } from '@/hooks/usePageDescription';

// UI 라이브러리 컴포넌트
import { Button } from '@/components/ui/ui-input/button/Button';
import DataTable from '@/components/ui/ui-data/data-table/DataTable';
import { SmartTableColumn } from '@/components/ui/ui-data/smartTable/SmartTable';
import AddStaffModal, { StaffInput } from '@/view/parking/facility/staff/AddStaffModal';

// #region 타입 정의
interface Staff {
  seq: number; // 순번
  id: string; // 아이디
  name: string; // 이름
  phone: string; // 연락처
  role: string; // 권한
  createdAt: string; // 등록일자
  [key: string]: unknown; // 🔧 인덱스 시그니처 추가 (SmartTable 호환)
}
// #endregion

// #region 목업 데이터 생성
const initialStaffList: Staff[] = [
  {
    seq: 5,
    id: 'patrol06',
    name: 'URA KOJI',
    phone: '010-3463-8805',
    role: '근무자',
    createdAt: '2025-06-05 15:32:47',
  },
  {
    seq: 4,
    id: 'goldwing2',
    name: '김빛나래',
    phone: '012-6375-6470',
    role: '근무자',
    createdAt: '2025-04-08 18:36:46',
  },
  {
    seq: 3,
    id: 'admin622',
    name: '근무자',
    phone: '010-7894-4815',
    role: '근무자',
    createdAt: '2025-04-07 19:18:26',
  },
  {
    seq: 2,
    id: 'test0120',
    name: '정순식',
    phone: '010-7979-2550',
    role: '근무자',
    createdAt: '2025-01-20 19:06:29',
  },
  {
    seq: 1,
    id: 'test0001',
    name: '미어켓테스터',
    phone: '010-5555-7777',
    role: '근무자',
    createdAt: '2024-12-27 09:25:22',
  },
];
// #endregion

export default function StaffListPage() {
  usePageDescription('근무자 계정 정보를 관리합니다.');
  // #region 상태 관리
  const [staffList, setStaffList] = useState<Staff[]>(initialStaffList);
  const [isAddOpen, setIsAddOpen] = useState(false);
  // #endregion

  // #region 이벤트 핸들러
  const handleDelete = useCallback((seq: number) => {
    setStaffList((prev) => prev.filter((staff) => staff.seq !== seq));
  }, []);

  const handleAdd = useCallback((input: StaffInput) => {
    setStaffList((prev) => [
      {
        seq: prev.length ? Math.max(...prev.map((s) => s.seq)) + 1 : 1,
        id: input.id,
        name: input.name,
        phone: input.phone,
        role: input.role,
        createdAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
      },
      ...prev,
    ]);
  }, []);
  // #endregion

  // #region 컬럼 정의
  const columns: SmartTableColumn<Staff>[] = [
    {
      key: 'seq',
      header: '순번',
      width: '70px',
      align: 'center',
    },
    {
      key: 'id',
      header: 'ID',
      align: 'start',
      width: '120px',
    },
    {
      key: 'name',
      header: '이름',
      align: 'start',
      width: '140px',
    },
    {
      key: 'phone',
      header: '연락처',
      align: 'center',
      width: '160px',
    },
    {
      key: 'role',
      header: '권한',
      align: 'center',
      width: '100px',
    },
    {
      key: 'createdAt',
      header: '등록일자',
      align: 'center',
      width: '180px',
    },
    {
      header: '관리',
      align: 'center',
      width: '90px',
      sortable: false,
      cell: (item: Staff) => (
        <Button
          variant="destructive"
          size="sm"
          onClick={() => handleDelete(item.seq)}
        >
          삭제
        </Button>
      ),
    },
  ];
  // #endregion

  // #region 렌더링
  return (
    <main className="flex flex-col gap-6">
      {/* 추가 버튼 */}
      <div className="flex justify-end items-center">
        <Button
          variant="accent"
          size="sm"
          className="flex gap-1 items-center bg-primary-4"
          onClick={() => setIsAddOpen(true)}
        >
          <Plus size={16} />
        </Button>
      </div>

      {/* 테이블 */}
      <DataTable<Staff>
        data={staffList}
        columns={columns}
        pageSize={10}
        itemName="근무자"
      />

      {/* 추가 모달 */}
      <AddStaffModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onAdd={handleAdd}
      />
    </main>
  );
  // #endregion
} 