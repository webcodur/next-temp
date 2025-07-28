/* 
  파일명: /app/parking/household/instances/HouseholdInstancesManager/InstanceTable/columns.tsx
  기능: 거주 이력 테이블의 컬럼 정의
  책임: 테이블 구조와 셀 렌더링 로직을 관리한다.
*/ // ------------------------------

import { BaseTableColumn } from '@/components/ui/ui-data/paginatedTable/PaginatedTable';
import type { HouseholdInstance } from '@/types/household';

import { InstanceActions } from './InstanceActions';

// #region 타입
interface HouseholdInstanceTableRow extends HouseholdInstance, Record<string, unknown> {}

interface ColumnsConfig {
  onView: (id: number) => void;
  onSettings: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}
// #endregion

// #region 컬럼 정의
export function createColumns(config: ColumnsConfig): BaseTableColumn<HouseholdInstanceTableRow>[] {
  const { onView, onSettings, onEdit, onDelete } = config;
  
  return [
    {
      key: 'id',
      header: 'ID',
      sortable: true,
      align: 'center',
      width: '80px',
      cell: (instance) => `#${instance.id}`,
    },
    {
      key: 'instanceName',
      header: '인스턴스명',
      sortable: true,
      align: 'start',
      width: '120px',
      cell: (instance) => instance.instanceName || '이름 없음',
    },
    {
      key: 'householdId',
      header: '세대 ID',
      sortable: true,
      align: 'center',
      width: '100px',
      cell: (instance) => `#${instance.householdId}`,
    },
    {
      key: 'startDate',
      header: '시작일',
      sortable: true,
      align: 'center',
      width: '100px',
      cell: (instance) => instance.startDate ? new Date(instance.startDate).toLocaleDateString('ko-KR') : '-',
    },
    {
      key: 'endDate',
      header: '종료일',
      sortable: true,
      align: 'center',
      width: '100px',
      cell: (instance) => instance.endDate ? new Date(instance.endDate).toLocaleDateString('ko-KR') : '진행중',
    },
    {
      key: 'duration',
      header: '기간',
      sortable: false,
      align: 'center',
      width: '120px',
      cell: (instance) => {
        if (!instance.startDate) return '-';
        
        const start = new Date(instance.startDate);
        const end = instance.endDate ? new Date(instance.endDate) : new Date();
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const months = Math.floor(diffDays / 30);
        const days = diffDays % 30;
        return months > 0 ? `${months}개월 ${days}일` : `${days}일`;
      },
    },
    {
      key: 'password',
      header: '비밀번호',
      sortable: false,
      align: 'center',
      width: '100px',
      cell: (instance) => instance.password || '-',
    },
    {
      key: 'actions',
      header: '액션',
      sortable: false,
      align: 'center',
      width: '140px',
      cell: (instance) => (
        <InstanceActions
          instance={instance}
          onView={onView}
          onSettings={onSettings}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ),
    },
  ];
}
// #endregion 