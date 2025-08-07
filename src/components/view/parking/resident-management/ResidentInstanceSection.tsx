'use client';

import React, { useState, useCallback } from 'react';
import { Home, Plus, Trash2, Edit, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/ui-input/button/Button';
import { BaseTable, BaseTableColumn } from '@/components/ui/ui-data/baseTable/BaseTable';
import Modal from '@/components/ui/ui-layout/modal/Modal';
import { deleteResidentInstance } from '@/services/residents/residents_instances@id_DELETE';
import { ResidentDetail, ResidentInstanceWithInstance } from '@/types/resident';

interface ResidentInstanceSectionProps {
  resident: ResidentDetail;
  onDataChange: () => void;
}

export default function ResidentInstanceSection({ 
  resident, 
  onDataChange 
}: ResidentInstanceSectionProps) {
  const router = useRouter();
  
  // #region 상태 관리
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  // #endregion

  // #region 핸들러
  const handleMoveClick = useCallback(() => {
    router.push(`/parking/occupancy/resident/${resident.id}/move`);
  }, [resident.id, router]);

  const handleCreateInstanceRelation = useCallback(() => {
    // TODO: 호실 관계 생성 모달 또는 페이지로 이동
    console.log('호실 관계 생성');
  }, []);

  const handleDeleteInstanceRelation = useCallback((relationId: number) => {
    setDeleteTargetId(relationId);
    setDeleteConfirmOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteTargetId) return;

    try {
      const result = await deleteResidentInstance(deleteTargetId);
      
      if (result.success) {
        setModalMessage('거주자-호실 관계가 성공적으로 삭제되었습니다.');
        setSuccessModalOpen(true);
        // 상위 컴포넌트에 데이터 변경 알림
        onDataChange();
      } else {
        setModalMessage(`관계 삭제에 실패했습니다: ${result.errorMsg}`);
        setErrorModalOpen(true);
      }
    } catch (error) {
      console.error('관계 삭제 중 오류:', error);
      setModalMessage('관계 삭제 중 오류가 발생했습니다.');
      setErrorModalOpen(true);
    } finally {
      setDeleteConfirmOpen(false);
      setDeleteTargetId(null);
    }
  }, [deleteTargetId, onDataChange]);
  // #endregion

  // #region 현재 거주지 정보
  const currentResidence = resident.residentInstance?.find(ri => ri.instance);
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
      cell: (item: ResidentInstanceWithInstance) => {
        const date = new Date(item.createdAt);
        return date.toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        });
      },
    },
    {
      header: '관리',
      align: 'center',
      width: '10%',
      cell: (item: ResidentInstanceWithInstance) => (
        <div className="flex gap-1 justify-center">
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleDeleteInstanceRelation(item.id)}
            title="관계 삭제"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      ),
    },
  ];
  // #endregion

  return (
    <div className="space-y-6">
      {/* 현재 거주지 정보 */}
      <div className="p-6 rounded-lg border bg-card border-border">
        <div className="flex gap-2 items-center mb-4">
          <Home size={20} />
          <h2 className="text-lg font-semibold text-foreground">
            현재 거주지 정보
          </h2>
        </div>

        {currentResidence?.instance ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">주소</label>
                <div className="flex gap-2 items-center mt-1">
                  <MapPin size={16} className="text-muted-foreground" />
                  <span className="text-foreground">
                    {`${currentResidence.instance.address1Depth} ${currentResidence.instance.address2Depth} ${currentResidence.instance.address3Depth || ''}`.trim()}
                  </span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">호실 타입</label>
                <div className="mt-1 text-foreground">
                  {(() => {
                    const typeMap = {
                      GENERAL: '일반',
                      TEMP: '임시',
                      COMMERCIAL: '상업',
                    };
                    return typeMap[currentResidence.instance.instanceType as keyof typeof typeMap] || currentResidence.instance.instanceType;
                  })()}
                </div>
              </div>
            </div>
            
            {currentResidence.memo && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">메모</label>
                <div className="mt-1 text-foreground">{currentResidence.memo}</div>
              </div>
            )}

            <div className="flex gap-3 pt-4 border-t border-border">
              <Button 
                variant="primary" 
                size="default"
                onClick={handleMoveClick}
                title="다른 호실로 이동"
              >
                <Edit size={16} />
                호실 이동
              </Button>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center">
            <p className="mb-4 text-muted-foreground">현재 연결된 거주지가 없습니다.</p>
            <Button 
              variant="primary" 
              size="default"
              onClick={handleCreateInstanceRelation}
              title="호실 관계 생성"
            >
              <Plus size={16} />
              거주지 연결
            </Button>
          </div>
        )}
      </div>

      {/* 전체 호실 관계 목록 */}
      <div className="p-6 rounded-lg border bg-card border-border">
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2 items-center">
            <Home size={20} />
            <h2 className="text-lg font-semibold text-foreground">
              호실 관계 목록
            </h2>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleCreateInstanceRelation}
            title="새 호실 관계 추가"
          >
            <Plus size={16} />
            관계 추가
          </Button>
        </div>

        {resident.residentInstance && resident.residentInstance.length > 0 ? (
          <BaseTable
            data={resident.residentInstance as unknown as Record<string, unknown>[]}
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

      {/* 성공 모달 */}
      <Modal
        isOpen={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        title="작업 완료"
        size="sm"
      >
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="mb-2 text-lg font-semibold text-green-600">성공</h3>
            <p className="text-muted-foreground">{modalMessage}</p>
          </div>
          
          <div className="flex justify-center pt-4">
            <Button onClick={() => setSuccessModalOpen(false)}>
              확인
            </Button>
          </div>
        </div>
      </Modal>

      {/* 오류 모달 */}
      <Modal
        isOpen={errorModalOpen}
        onClose={() => setErrorModalOpen(false)}
        title="오류 발생"
        size="sm"
      >
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="mb-2 text-lg font-semibold text-red-600">오류</h3>
            <p className="text-muted-foreground">{modalMessage}</p>
          </div>
          
          <div className="flex justify-center pt-4">
            <Button onClick={() => setErrorModalOpen(false)}>
              확인
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
