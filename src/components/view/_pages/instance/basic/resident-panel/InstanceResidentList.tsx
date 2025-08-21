/* 
  파일명: /components/view/_pages/instance/basic/resident-panel/InstanceResidentList.tsx
  기능: 세대에 연결된 주민 목록 및 관리 컴포넌트
  책임: 주민 연결/해제, 차량 연결 관리, 상세보기 및 삭제 기능을 제공한다.
*/ // ------------------------------

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Users, User, Link } from 'lucide-react';

import { Button } from '@/components/ui/ui-input/button/Button';
import Modal from '@/components/ui/ui-layout/modal/Modal';
import { SectionPanel } from '@/components/ui/ui-layout/section-panel/SectionPanel';
import { toast } from '@/components/ui/ui-effects/toast/Toast';
import { deleteResident } from '@/services/residents/residents@id_DELETE';
import { deleteResidentInstance } from '@/services/residents/residents_instances@id_DELETE';

import ResidentSearchModal from './ResidentSearchModal';
import ResidentCardItem from './ResidentCardItem';

import type { CarResidentWithDetails } from '@/types/car';
import type { ResidentInstanceWithResident } from '@/types/instance';

// #region 타입 및 인터페이스
interface InstanceResidentListProps {
  residentInstances?: ResidentInstanceWithResident[];
  loading?: boolean;
  instanceId?: number;
  onDataChange?: () => void;
  residentManagementMode?: boolean;

  carResidents?: CarResidentWithDetails[];
  loadingCarResidents?: boolean;
  onConnectResident?: (residentId: number) => void;
  onDisconnectResident?: (residentId: number) => void;
  onTogglePrimary?: (residentId: number) => void;
  onToggleAlarm?: (residentId: number) => void;
  
  // 연결 상태 확인 헬퍼
  isResidentConnectedToSelectedCar?: (residentId: number) => boolean;
}
// #endregion

export default function InstanceResidentList({ 
  residentInstances = [], 
  loading = false,
  instanceId,
  onDataChange,
  residentManagementMode = false,

  carResidents = [],
  loadingCarResidents = false,
  onConnectResident,
  onDisconnectResident,
  onTogglePrimary,
  onToggleAlarm,
  
  // 연결 상태 확인 헬퍼
  isResidentConnectedToSelectedCar
}: InstanceResidentListProps) {
  // #region 상태
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: 'detail' | 'exclude' | 'delete';
    residentId: number;
    residentName: string;
  }>({
    isOpen: false,
    type: 'detail',
    residentId: 0,
    residentName: ''
  });

  const [connectModalOpen, setConnectModalOpen] = useState(false);
  // #endregion

  // #region 훅
  const router = useRouter();
  // #endregion

  // #region 핸들러
  const handleResidentClick = (residentId: number) => {
    router.push(`/parking/occupancy/resident/${residentId}`);
  };

  const handleDetailClick = (residentId: number, residentName: string) => {
    setConfirmModal({
      isOpen: true,
      type: 'detail',
      residentId,
      residentName
    });
  };

  const handleExcludeClick = (residentId: number, residentName: string) => {
    setConfirmModal({
      isOpen: true,
      type: 'exclude',
      residentId,
      residentName
    });
  };

  const handleDeleteClick = (residentId: number, residentName: string) => {
    setConfirmModal({
      isOpen: true,
      type: 'delete',
      residentId,
      residentName
    });
  };

  const handleConfirm = async () => {
    try {
      switch (confirmModal.type) {
        case 'detail':
          handleResidentClick(confirmModal.residentId);
          break;
        case 'exclude':
          // 주민-세대 연결 해지 (서버에서 관련 차량-주민 연결도 함께 정리됨)
          const residentInstance = residentInstances?.find(ri => ri.resident.id === confirmModal.residentId);
          if (residentInstance) {
            const result = await deleteResidentInstance(residentInstance.id);
            if (result.success) {
              toast.success('주민-세대 연결이 성공적으로 해지되었습니다.');
              // 데이터 새로고침
              if (onDataChange) {
                onDataChange();
              }
            } else {
              console.error('주민-세대 연결 해지 실패:', result.errorMsg);
              toast.error(`주민-세대 연결 해지에 실패했습니다: ${result.errorMsg}`);
            }
          }
          break;
        case 'delete':
          // 주민 완전 삭제
          const deleteResult = await deleteResident(confirmModal.residentId);
          if (deleteResult.success) {
            toast.success('주민이 성공적으로 삭제되었습니다.');
            // 데이터 새로고침
            if (onDataChange) {
              onDataChange();
            }
          } else {
            console.error('주민 삭제 실패:', deleteResult.errorMsg);
            toast.error(`주민 삭제에 실패했습니다: ${deleteResult.errorMsg}`);
          }
          break;
      }
    } catch (error) {
      console.error('작업 중 오류 발생:', error);
      toast.error('작업 중 오류가 발생했습니다.');
    } finally {
      setConfirmModal(prev => ({ ...prev, isOpen: false }));
    }
  };



  const handleConnectClick = () => {
    setConnectModalOpen(true);
  };

  const handleModalSuccess = () => {
    // 주민 연결 성공 시 데이터 새로고침
    toast.success('주민 연결이 완료되었습니다.');
    if (onDataChange) {
      onDataChange();
    }
  };

  const getModalContent = () => {
    switch (confirmModal.type) {
      case 'detail':
        return {
          title: '상세 화면 이동',
          message: `${confirmModal.residentName} 주민의 상세 화면으로 이동하시겠습니까?`
        };
      case 'exclude':
        return {
          title: '세대 연결 해지',
          message: `${confirmModal.residentName} 주민과 세대의 연결을 해지하시겠습니까?`
        };
      case 'delete':
        return {
          title: '주민 정보 삭제',
          message: `${confirmModal.residentName} 주민 정보를 전체 서비스에서 완전히 삭제하시겠습니까?`
        };
      default:
        return { title: '', message: '' };
    }
  };

  if (loading) {
    return (
      <SectionPanel 
        title="연결된 주민" 
        subtitle="세대에 등록된 주민을 관리합니다."
        icon={<Users size={18} />}
        headerActions={(
          <div className="flex gap-1 items-center">
            <Button
              variant="outline"
              size="sm"
              onClick={handleConnectClick}
              title="주민 연결"
              icon={Link}
            />
          </div>
        )}
      >
        <div className="flex justify-center items-center py-8">
          <div className="text-muted-foreground">로딩 중...</div>
        </div>
      </SectionPanel>
    );
  }

  // #endregion

  // #region 렌더링
  return (
    <div className="relative">
      <SectionPanel 
      title={
        <span className="flex gap-2 items-center">
          연결된 주민
          <span className="text-sm text-muted-foreground">({residentInstances.length}명)</span>
        </span>
      }
      icon={<Users size={18} />}
      headerActions={(
        <div className="flex gap-1 items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={handleConnectClick}
            title="주민 연결"
            icon={Link}
          />
        </div>
      )}
    >

        {residentInstances.length === 0 ? (
          <div className="flex flex-col justify-center items-center py-8 text-center">
            <User size={32} className="mb-3 text-muted-foreground" />
            <h4 className="mb-1 text-sm font-medium text-foreground">
              등록된 주민이 없습니다
            </h4>
            <p className="text-xs text-muted-foreground">
              이 세대에 주민을 추가해보세요
            </p>
          </div>
        ) : (
          <div className="p-4 space-y-2">
            {residentInstances.map((residentInstance) => (
              <ResidentCardItem
                key={residentInstance.id}
                residentInstance={residentInstance}
                residentManagementMode={residentManagementMode}
                carResidents={carResidents}
                loadingCarResidents={loadingCarResidents}
                onDetailClick={handleDetailClick}
                onExcludeClick={handleExcludeClick}
                onDeleteClick={handleDeleteClick}
                onConnectResident={onConnectResident}
                onDisconnectResident={onDisconnectResident}
                onTogglePrimary={onTogglePrimary}
                onToggleAlarm={onToggleAlarm}
                isResidentConnectedToSelectedCar={isResidentConnectedToSelectedCar}
              />
            ))}
          </div>
        )}
      </SectionPanel>

      {/* 확인 모달 */}
      <Modal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
        title={getModalContent().title}
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-center text-foreground">
            {getModalContent().message}
          </p>
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
              className="px-4 py-2 text-sm rounded-md border border-border text-muted-foreground hover:bg-muted"
            >
              취소
            </button>
            <button
              onClick={handleConfirm}
              className="px-4 py-2 text-sm text-white rounded-md bg-primary hover:bg-primary/90"
            >
              확인
            </button>
          </div>
        </div>
      </Modal>

      {/* 주민 검색 및 연결 모달 */}
      {instanceId && (
        <ResidentSearchModal
          isOpen={connectModalOpen}
          onClose={() => setConnectModalOpen(false)}
          instanceId={instanceId}
          onSuccess={handleModalSuccess}
        />
      )}
    </div>
  );
  // #endregion
}
