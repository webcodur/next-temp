'use client';

import React, { useState, useCallback } from 'react';
import {  Unplug } from 'lucide-react';

import { Button } from '@/components/ui/ui-input/button/Button';
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
  onDeleteComplete 
}: ResidentInstanceTableProps) {
  // #region 상태 관리
  const [disconnectConfirmOpen, setDisconnectConfirmOpen] = useState(false);
  const [disconnectTargetId, setDisconnectTargetId] = useState<number | null>(null);
  // #endregion

  // #region 핸들러
  const handleDisconnectInstanceRelation = useCallback((relationId: number) => {
    setDisconnectTargetId(relationId);
    setDisconnectConfirmOpen(true);
  }, []);

  const handleDisconnectConfirm = useCallback(async () => {
    if (!disconnectTargetId) return;

    try {
      const result = await deleteResidentInstance(disconnectTargetId);
      
      if (result.success) {
        const successMessage = '거주자-세대 관계가 성공적으로 해제되었습니다.';
        onDeleteComplete(true, successMessage);
      } else {
        const errorMessage = `관계 해제에 실패했습니다: ${result.errorMsg}`;
        onDeleteComplete(false, errorMessage);
      }
    } catch (error) {
      console.error('관계 해제 중 오류:', error);
      const errorMessage = '관계 해제 중 오류가 발생했습니다.';
      onDeleteComplete(false, errorMessage);
    } finally {
      setDisconnectConfirmOpen(false);
      setDisconnectTargetId(null);
    }
  }, [disconnectTargetId, onDeleteComplete]);
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
      header: '세대 ID',
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
      header: '세대 타입',
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
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDisconnectInstanceRelation(item.id)}
            title="관계 해제"
            className="p-2 w-8 h-8 hover:bg-orange-50 hover:text-orange-600"
          >
            <Unplug size={16} />
          </Button>
        </div>
      ),
    },
  ];
  // #endregion

  return (
    <>
        {residentInstances && Array.isArray(residentInstances) && residentInstances.length > 0 ? (
          <BaseTable
            data={residentInstances.filter(item => item && typeof item === 'object') as unknown as Record<string, unknown>[]}
            columns={columns as unknown as BaseTableColumn<Record<string, unknown>>[]}
            pageSize={10}
          />
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            연결된 세대가 없습니다.
          </div>
        )}

      {/* 연결 해제 확인 모달 */}
      <Modal
        isOpen={disconnectConfirmOpen}
        onClose={() => setDisconnectConfirmOpen(false)}
        title="관계 해제 확인"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <h3 className="mb-2 text-lg font-semibold">정말로 해제하시겠습니까?</h3>
            <p className="text-muted-foreground">
              이 작업은 되돌릴 수 없습니다. 거주자-세대 관계가 영구적으로 해제됩니다.
              <br />
              <span className="font-medium text-orange-600">
                주의: 이사의 경우 해제보다는 &ldquo;세대 이전&rdquo; 기능을 사용하시기 바랍니다.
              </span>
            </p>
          </div>
          
          <div className="flex gap-3 justify-end pt-4">
            <Button 
              variant="ghost" 
              onClick={() => setDisconnectConfirmOpen(false)}
            >
              취소
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDisconnectConfirm}
            >
              해제
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
