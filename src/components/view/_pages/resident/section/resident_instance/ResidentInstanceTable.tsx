'use client';

import React, { useState, useCallback } from 'react';
import { Home } from 'lucide-react';

import { Button } from '@/components/ui/ui-input/button/Button';
import { CrudButton } from '@/components/ui/ui-input/crud-button/CrudButton';
import { BaseTable, BaseTableColumn } from '@/components/ui/ui-data/baseTable/BaseTable';
import Modal from '@/components/ui/ui-layout/modal/Modal';
import { deleteResidentInstance } from '@/services/residents/residents_instances@id_DELETE';
import { ResidentInstanceWithInstance } from '@/types/resident';

interface ResidentInstanceTableProps {
  residentInstances: ResidentInstanceWithInstance[];
  onCreateRelation: () => void;
  onDeleteComplete: (success: boolean, message: string) => void;
}

export default function ResidentInstanceTable({ 
  residentInstances, 
  onCreateRelation, 
  onDeleteComplete 
}: ResidentInstanceTableProps) {
  // #region 상태 관리
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  // #endregion

  // #region 핸들러
  const handleDeleteInstanceRelation = useCallback((relationId: number) => {
    setDeleteTargetId(relationId);
    setDeleteConfirmOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteTargetId) return;

    try {
      const result = await deleteResidentInstance(deleteTargetId);
      
      if (result.success) {
        const successMessage = '거주자-호실 관계가 성공적으로 삭제되었습니다.';
        onDeleteComplete(true, successMessage);
      } else {
        const errorMessage = `관계 삭제에 실패했습니다: ${result.errorMsg}`;
        onDeleteComplete(false, errorMessage);
      }
    } catch (error) {
      console.error('관계 삭제 중 오류:', error);
      const errorMessage = '관계 삭제 중 오류가 발생했습니다.';
      onDeleteComplete(false, errorMessage);
    } finally {
      setDeleteConfirmOpen(false);
      setDeleteTargetId(null);
    }
  }, [deleteTargetId, onDeleteComplete]);
  // #endregion

  // #region 컬럼 정의
  const columns: BaseTableColumn<ResidentInstanceWithInstance>[] = [
    {
      key: 'id',
      header: '관계 ID',
      width: '10%',
      align: 'center',
    },
    {
      key: 'instanceId',
      header: '호실 ID',
      width: '10%',
      align: 'center',
    },
    {
      key: 'address',
      header: '주소',
      width: '25%',
      align: 'start',
      cell: (item: ResidentInstanceWithInstance) => {
        if (item.instance) {
          const { address1Depth, address2Depth, address3Depth } = item.instance;
          return `${address1Depth} ${address2Depth} ${address3Depth || ''}`.trim();
        }
        return '정보 없음';
      },
    },
    {
      key: 'instanceType',
      header: '호실 타입',
      width: '12%',
      align: 'center',
      cell: (item: ResidentInstanceWithInstance) => {
        if (item.instance) {
          const typeMap = {
            GENERAL: '일반',
            TEMP: '임시',
            COMMERCIAL: '상업',
          };
          return typeMap[item.instance.instanceType as keyof typeof typeMap] || item.instance.instanceType;
        }
        return '-';
      },
    },
    {
      key: 'memo',
      header: '메모',
      width: '20%',
      align: 'start',
      cell: (item: ResidentInstanceWithInstance) => item.memo || '-',
    },
    {
      key: 'createdAt',
      header: '관계 생성일',
      width: '13%',
      align: 'center',
      type: 'datetime',
    },
    {
      header: '관리',
      align: 'center',
      width: '10%',
      cell: (item: ResidentInstanceWithInstance) => (
        <div className="flex gap-1 justify-center">
          <CrudButton
            action="delete"
            iconOnly
            size="sm"
            onClick={() => handleDeleteInstanceRelation(item.id)}
            title="관계 삭제"
          />
        </div>
      ),
    },
  ];
  // #endregion

  return (
    <>
      <div className="p-6 rounded-lg border bg-card border-border">
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2 items-center">
            <Home size={20} />
            <h2 className="text-lg font-semibold text-foreground">
              호실 관계 목록
            </h2>
          </div>
          <CrudButton 
            action="create"
            size="sm"
            onClick={onCreateRelation}
            title="새 호실 관계 추가"
          >
            관계 추가
          </CrudButton>
        </div>

        {residentInstances && residentInstances.length > 0 ? (
          <BaseTable
            data={residentInstances as unknown as Record<string, unknown>[]}
            columns={columns as unknown as BaseTableColumn<Record<string, unknown>>[]}
            pageSize={10}
          />
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            연결된 호실이 없습니다.
          </div>
        )}
      </div>

      {/* 삭제 확인 모달 */}
      <Modal
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        title="관계 삭제 확인"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <h3 className="mb-2 text-lg font-semibold">정말로 삭제하시겠습니까?</h3>
            <p className="text-muted-foreground">
              이 작업은 되돌릴 수 없습니다. 거주자-호실 관계가 영구적으로 삭제됩니다.
              <br />
              <span className="font-medium text-orange-600">
                주의: 이사의 경우 삭제보다는 &ldquo;호실 이동&rdquo; 기능을 사용하시기 바랍니다.
              </span>
            </p>
          </div>
          
          <div className="flex gap-3 justify-end pt-4">
            <Button 
              variant="ghost" 
              onClick={() => setDeleteConfirmOpen(false)}
            >
              취소
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteConfirm}
            >
              삭제
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
