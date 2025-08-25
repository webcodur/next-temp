'use client';

import React, { useState } from 'react';
import { Car, CarFront, Plus, Link } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { CarInstanceWithCar } from '@/types/instance';

import { SectionPanel } from '@/components/ui/ui-layout/section-panel/SectionPanel';
import Modal from '@/components/ui/ui-layout/modal/Modal';
import { Button } from '@/components/ui/ui-input/button/Button';
import { toast } from '@/components/ui/ui-effects/toast/Toast';
import CarCreateModal from './CarCreateModal';
import CarSearchModal from './CarSearchModal';
import CarCardItem from './CarCardItem';
import { deleteCarInstance } from '@/services/cars/cars_instances@id_DELETE';
import { deleteCar } from '@/services/cars/cars@id_DELETE';

interface InstanceCarListProps {
  carInstances?: CarInstanceWithCar[];
  loading?: boolean;
  instanceId?: number;
  onDataChange?: () => void;
  onManageResidents?: (carInstanceId: number) => void;
  residentManagementMode?: boolean;
  managedCarInstanceId?: number | null;
}

export default function InstanceCarList({ 
  carInstances = [], 
  loading = false,
  instanceId,
  onDataChange,
  onManageResidents,
  residentManagementMode = false,
  managedCarInstanceId = null
}: InstanceCarListProps) {
  const router = useRouter();
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: 'detail' | 'exclude' | 'delete';
    carId: number;
    carNumber: string;
  }>({
    isOpen: false,
    type: 'detail',
    carId: 0,
    carNumber: ''
  });

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [connectModalOpen, setConnectModalOpen] = useState(false);

  const handleCarClick = (carId: number) => {
    router.push(`/parking/occupancy/car/${carId}`);
  };

  const handleDetailClick = (carId: number, carNumber: string) => {
    setConfirmModal({
      isOpen: true,
      type: 'detail',
      carId,
      carNumber
    });
  };

  const handleExcludeClick = (carId: number, carNumber: string) => {
    setConfirmModal({
      isOpen: true,
      type: 'exclude',
      carId,
      carNumber
    });
  };

  const handleDeleteClick = (carId: number, carNumber: string) => {
    setConfirmModal({
      isOpen: true,
      type: 'delete',
      carId,
      carNumber
    });
  };

  const handleConfirm = async () => {
    try {
      switch (confirmModal.type) {
        case 'detail':
          handleCarClick(confirmModal.carId);
          break;
        case 'exclude':
          // 차량-인스턴스 연결 해지 전 관련 차량-주민 연결 정리
          const carInstance = carInstances?.find(ci => ci.car?.id === confirmModal.carId);
          if (carInstance && instanceId) {
            try {
              // 1단계: 해당 차량에 연결된 모든 주민 연결 정보 조회
              const { getCarResidents } = await import('@/services/cars/cars@carId_residents_GET');
              const carResidentsResult = await getCarResidents(confirmModal.carId, instanceId);
              
              if (carResidentsResult.success && carResidentsResult.data) {
                // 2단계: 모든 차량-주민 연결 제거
                const { deleteCarInstanceResident } = await import('@/services/cars/cars_residents@id_DELETE');
                const deletePromises = carResidentsResult.data.map(resident => 
                  deleteCarInstanceResident(resident.carInstanceResidentId)
                );
                
                // 모든 차량-주민 연결 삭제 (실패해도 계속 진행)
                await Promise.allSettled(deletePromises);
              }
              
              // 3단계: 차량-세대 연결 해지
              const result = await deleteCarInstance(carInstance.id);
              if (result.success) {
                toast.success('차량-세대 연결이 성공적으로 해지되었습니다.');
                // 데이터 새로고침
                if (onDataChange) {
                  onDataChange();
                }
              } else {
                console.error('차량-세대 연결 해지 실패:', '대상 작업에 실패했습니다.');
                toast.error('차량-세대 연결 해지에 실패했습니다.');
              }
            } catch (error) {
              console.error('차량-세대 연결 해지 과정에서 오류:', error);
              toast.error('차량-세대 연결 해지 중 오류가 발생했습니다.');
              // 에러가 발생해도 차량-세대 연결 해지는 시도
              const result = await deleteCarInstance(carInstance.id);
              if (result.success) {
                toast.success('차량-세대 연결이 해지되었습니다.');
                if (onDataChange) {
                  onDataChange();
                }
              }
            }
          }
          break;
        case 'delete':
          // 차량 완전 삭제
          const deleteResult = await deleteCar(confirmModal.carId);
          if (deleteResult.success) {
            toast.success('차량이 성공적으로 삭제되었습니다.');
            // 데이터 새로고침
            if (onDataChange) {
              onDataChange();
            }
          } else {
            console.error('차량 삭제 실패:', deleteResult.errorMsg);
            toast.error(`차량 삭제에 실패했습니다: ${deleteResult.errorMsg}`);
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

  const handleCreateClick = () => {
    setCreateModalOpen(true);
  };

  const handleConnectClick = () => {
    setConnectModalOpen(true);
  };

  const handleModalSuccess = () => {
    // 차량 생성/연결 성공 시 데이터 새로고침
    toast.success('차량 연결이 완료되었습니다.');
    if (onDataChange) {
      onDataChange();
    }
  };



  const getModalContent = () => {
    switch (confirmModal.type) {
      case 'detail':
        return {
          title: '상세 화면 이동',
          message: `${confirmModal.carNumber} 차량의 상세 화면으로 이동하시겠습니까?`
        };
      case 'exclude':
        return {
          title: '세대 연결 해지',
          message: `${confirmModal.carNumber} 차량과 세대의 연결을 해지하시겠습니까?`
        };
      case 'delete':
        return {
          title: '차량 정보 삭제',
          message: `${confirmModal.carNumber} 차량 정보를 \n 전체 서비스에서 완전히 삭제하시겠습니까?`
        };
      default:
        return { title: '', message: '' };
    }
  };



  if (loading) {
    return (
      <SectionPanel 
        title="차량 목록" 
        subtitle="세대에 등록된 차량을 관리합니다."
        icon={<Car size={18} />}
        headerActions={(
          <div className="flex gap-1 items-center">
            <Button
              variant="outline"
              size="icon"
              onClick={handleCreateClick}
              title="새 차량 생성"
              icon={Plus}
            />
            <Button
              variant="outline"
              size="icon"
              onClick={handleConnectClick}
              title="차량 연결"
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

  return (
    <div>
      <SectionPanel 
      title={
        <span className="flex gap-2 items-center">
          연결된 차량
          <span className="text-sm text-muted-foreground">({carInstances.length}대)</span>
        </span>
      }
      icon={<Car size={18} />}
      headerActions={(
        <div className="flex gap-2 items-center">
          <Button
            variant="outline"
            size="icon"
            onClick={handleCreateClick}
            title="새 차량 생성"
            icon={Plus}
          />
          <Button
            variant="outline"
            size="icon"
            onClick={handleConnectClick}
            title="차량 연결"
            icon={Link}
          />
        </div>
      )}
    >

        {carInstances.length === 0 ? (
          <div className="flex flex-col justify-center items-center py-8 text-center">
            <CarFront size={32} className="mb-3 text-muted-foreground" />
            <h4 className="mb-1 text-sm font-medium text-foreground">
              등록된 차량이 없습니다
            </h4>
            <p className="text-xs text-muted-foreground">
              이 세대에 차량을 추가해보세요
            </p>
          </div>
        ) : (
          <div className="p-4 space-y-2">
            {carInstances.map((carInstance) => (
              <CarCardItem
                key={carInstance.id}
                carInstance={carInstance}
                residentManagementMode={residentManagementMode}
                managedCarInstanceId={managedCarInstanceId}
                onDetailClick={() => handleDetailClick(carInstance.car?.id || 0, carInstance.car?.carNumber || '')}
                onExcludeClick={() => handleExcludeClick(carInstance.car?.id || 0, carInstance.car?.carNumber || '')}
                onDeleteClick={() => handleDeleteClick(carInstance.car?.id || 0, carInstance.car?.carNumber || '')}
                onManageResidents={onManageResidents}
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

      {/* 새 차량 생성 모달 */}
      {instanceId && (
        <CarCreateModal
          isOpen={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          instanceId={instanceId}
          onSuccess={handleModalSuccess}
        />
      )}

      {/* 기존 차량 연결 모달 */}
      {instanceId && (
        <CarSearchModal
          isOpen={connectModalOpen}
          onClose={() => setConnectModalOpen(false)}
          instanceId={instanceId}
          onSuccess={handleModalSuccess}
        />
      )}
    </div>
  );
}
