'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Unplug, ArrowRightLeft, ExternalLink, Edit } from 'lucide-react';

import { Button } from '@/components/ui/ui-input/button/Button';
import { BaseTable, BaseTableColumn } from '@/components/ui/ui-data/baseTable/BaseTable';
import Modal from '@/components/ui/ui-layout/modal/Modal';
import { deleteUserInstance } from '@/services/users/users_instances@id_DELETE';
import { UserInstanceWithInstance } from '@/types/user';

interface UserInstanceTableProps {
  userInstances: UserInstanceWithInstance[];
  onCreateRelation: () => void;
  onDeleteComplete: (success: boolean, message: string) => void;
  onMoveFromHere?: (userInstance: UserInstanceWithInstance) => void;
  onEditConnection?: (userInstance: UserInstanceWithInstance) => void;
}

export default function UserInstanceTable({ 
  userInstances, 
  onDeleteComplete,
  onMoveFromHere,
  onEditConnection
}: UserInstanceTableProps) {

  // #region 상태 관리
  const router = useRouter();
  const [disconnectConfirmOpen, setDisconnectConfirmOpen] = useState(false);
  const [disconnectTargetId, setDisconnectTargetId] = useState<number | null>(null);
  // #endregion

  // #region 핸들러
  const handleInstanceDetailClick = useCallback((item: UserInstanceWithInstance) => {
    if (item.instanceId) {
      router.push(`/parking/occupancy/instance/${item.instanceId}`);
    }
  }, [router]);

  const handleDisconnectInstanceRelation = useCallback((relationId: number) => {
    setDisconnectTargetId(relationId);
    setDisconnectConfirmOpen(true);
  }, []);

  const handleDisconnectConfirm = useCallback(async () => {
    if (!disconnectTargetId) return;

    try {
      const result = await deleteUserInstance(disconnectTargetId);
      
      if (result.success) {
        const successMessage = '사용자-세대 관계가 성공적으로 해제되었습니다.';
        onDeleteComplete(true, successMessage);
      } else {
        const errorMessage = '관계 해제에 실패했습니다.';
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
  const columns: BaseTableColumn<UserInstanceWithInstance>[] = [
    {
      key: 'address',
      header: '주소',
      minWidth: '300px',
      align: 'start',
      cell: (item: UserInstanceWithInstance) => {
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
      minWidth: '140px',
      align: 'center',
      cell: (item: UserInstanceWithInstance) => {
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
      minWidth: '240px',
      align: 'start',
      cell: (item: UserInstanceWithInstance) => item.memo || '-',
    },
    {
      key: 'createdAt',
      header: '관계 생성일',
      minWidth: '160px',
      align: 'center',
      type: 'datetime',
    },
    {
      header: '관리',
      align: 'center',
      minWidth: '480px',
      cell: (item: UserInstanceWithInstance) => (
        <div className="flex gap-2 justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleInstanceDetailClick(item);
            }}
            title="세대 정보 보기"
            className="flex gap-1 items-center px-2 py-1 text-xs"
          >
            <ExternalLink size={12} />
            세대정보
          </Button>
          {onEditConnection && (
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onEditConnection(item);
              }}
              title="연결 정보 수정"
              className="flex gap-1 items-center px-2 py-1 text-xs"
            >
              <Edit size={12} />
              관계정보
            </Button>
          )}
          {onMoveFromHere && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onMoveFromHere(item)}
              title="이 세대에서 이사가기"
              className="flex gap-1 items-center px-2 py-1 text-xs"
            >
              <ArrowRightLeft size={12} />
              이사
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDisconnectInstanceRelation(item.id)}
            title="관계 해제"
            className="flex gap-1 items-center px-2 py-1 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Unplug size={12} />
            연결해제
          </Button>
        </div>
      ),
    },
  ];
  // #endregion

  return (
    <>
        {userInstances && Array.isArray(userInstances) && userInstances.length > 0 ? (
          <BaseTable
            data={userInstances.filter(item => item && typeof item === 'object') as unknown as Record<string, unknown>[]}
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
              이 작업은 되돌릴 수 없습니다. 사용자-세대 관계가 영구적으로 해제됩니다.
              <br />
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