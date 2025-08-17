'use client';

import React, { useState } from 'react';
import { Car, CarFront, Calendar, Fuel, Tag, Plus, Link } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { CarInstanceWithCar } from '@/types/instance';
import InstanceItemCard, { InstanceItemCardField, InstanceItemCardBadge } from '@/components/ui/ui-layout/info-card/InstanceItemCard';
import { SectionPanel } from '@/components/ui/ui-layout/section-panel/SectionPanel';
import Modal from '@/components/ui/ui-layout/modal/Modal';

interface InstanceCarListProps {
  carInstances?: CarInstanceWithCar[];
  loading?: boolean;
  instanceId?: number;
  onDataChange?: () => void;
}

export default function InstanceCarList({ 
  carInstances = [], 
  loading = false,
  instanceId,
  onDataChange
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

  const [actionModal, setActionModal] = useState<{
    isOpen: boolean;
    type: 'create' | 'connect';
  }>({
    isOpen: false,
    type: 'create'
  });

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

  const handleConfirm = () => {
    switch (confirmModal.type) {
      case 'detail':
        handleCarClick(confirmModal.carId);
        break;
      case 'exclude':
        // TODO: 세대과의 연결 해지 로직
        console.log('제외 처리:', confirmModal.carId);
        break;
      case 'delete':
        // TODO: 차량 정보 삭제 로직
        console.log('삭제 처리:', confirmModal.carId);
        break;
    }
    setConfirmModal(prev => ({ ...prev, isOpen: false }));
  };

  const handleCreateClick = () => {
    setActionModal({
      isOpen: true,
      type: 'create'
    });
  };

  const handleConnectClick = () => {
    setActionModal({
      isOpen: true,
      type: 'connect'
    });
  };

  const handleActionConfirm = () => {
    switch (actionModal.type) {
      case 'create':
        // TODO: 새 차량 생성 로직
        console.log('새 차량 생성:', instanceId);
        break;
      case 'connect':
        // TODO: 기존 차량 연결 로직
        console.log('차량 연결:', instanceId);
        break;
    }
    setActionModal(prev => ({ ...prev, isOpen: false }));
    // 데이터 새로고침
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
          message: `${confirmModal.carNumber} 차량 정보를 서비스에서 완전히 삭제하시겠습니까?`
        };
      default:
        return { title: '', message: '' };
    }
  };

  const getActionModalContent = () => {
    switch (actionModal.type) {
      case 'create':
        return {
          title: '새 차량 생성',
          message: '새로운 차량을 생성하고 세대에 바로 등록합니까?'
        };
      case 'connect':
        return {
          title: '차량 연결',
          message: '다른 차량을 이 세대에 연결하시겠습니까?'
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
            <button
              onClick={handleCreateClick}
              className="flex justify-center items-center w-8 h-8 rounded-full transition-colors hover:bg-green-100 text-muted-foreground hover:text-green-600"
              title="새 차량 생성"
            >
              <Plus size={16} />
            </button>
            <button
              onClick={handleConnectClick}
              className="flex justify-center items-center w-8 h-8 rounded-full transition-colors hover:bg-blue-100 text-muted-foreground hover:text-blue-600"
              title="차량 연결"
            >
              <Link size={16} />
            </button>
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
        <div className="flex gap-1 items-center">
          <button
            onClick={handleCreateClick}
            className="flex justify-center items-center w-8 h-8 rounded-full transition-colors hover:bg-green-100 text-muted-foreground hover:text-green-600"
            title="새 차량 생성"
          >
            <Plus size={16} />
          </button>
          <button
            onClick={handleConnectClick}
            className="flex justify-center items-center w-8 h-8 rounded-full transition-colors hover:bg-blue-100 text-muted-foreground hover:text-blue-600"
            title="차량 연결"
          >
            <Link size={16} />
          </button>
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
            {carInstances.map((carInstance) => {
              // 배지 정보
              const badges: InstanceItemCardBadge[] = [];
              if (carInstance.carShareOnoff) {
                badges.push({
                  text: '공유차량',
                  variant: 'info'
                });
              }

              // 좌측 열 데이터
              const leftColumn: InstanceItemCardField[] = [
                {
                  icon: <Fuel />,
                  value: carInstance.car.fuel || '',
                  show: !!carInstance.car.fuel
                },
                {
                  icon: <Calendar />,
                  value: carInstance.car.year ? `${carInstance.car.year}년` : '',
                  show: !!carInstance.car.year
                }
              ];

              // 우측 열 데이터
              const rightColumn: InstanceItemCardField[] = [];

              // 외부 스티커가 있으면 우측 열에 추가
              if (carInstance.car.externalSticker) {
                rightColumn.push({
                  icon: <Tag />,
                  value: carInstance.car.externalSticker,
                  show: true
                });
              }

              // 커스텀 제목 (번호판 + 브랜드/모델/차종)
              const customTitle = (
                <div className="flex flex-1 gap-2 items-center min-w-0">
                  <span 
                    className="text-lg font-bold tracking-wider text-foreground"
                    style={{ fontFamily: 'HY헤드라인M, monospace' }}
                  >
                    {carInstance.car.carNumber || '번호판 없음'}
                  </span>
                  {(carInstance.car.brand || carInstance.car.model || carInstance.car.type) && (
                    <span className="text-sm truncate text-muted-foreground">
                      {[carInstance.car.brand, carInstance.car.model, carInstance.car.type]
                        .filter(Boolean)
                        .join(' ')}
                    </span>
                  )}
                </div>
              );

              return (
                <InstanceItemCard
                  key={carInstance.id}
                  headerIcon={<CarFront />}
                  title="" // customTitle을 사용하므로 빈 문자열
                  customTitle={customTitle}
                  badges={badges}
                  leftColumn={leftColumn}
                  rightColumn={rightColumn}
                  memo={carInstance.car.outerText || undefined}
                  onDetail={() => handleDetailClick(carInstance.car.id, carInstance.car.carNumber || '번호판 없음')}
                  onExclude={() => handleExcludeClick(carInstance.car.id, carInstance.car.carNumber || '번호판 없음')}
                  onDelete={() => handleDeleteClick(carInstance.car.id, carInstance.car.carNumber || '번호판 없음')}
                />
              );
            })}
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

      {/* 액션 모달 */}
      <Modal
        isOpen={actionModal.isOpen}
        onClose={() => setActionModal(prev => ({ ...prev, isOpen: false }))}
        title={getActionModalContent().title}
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-center text-foreground">
            {getActionModalContent().message}
          </p>
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => setActionModal(prev => ({ ...prev, isOpen: false }))}
              className="px-4 py-2 text-sm rounded-md border border-border text-muted-foreground hover:bg-muted"
            >
              취소
            </button>
            <button
              onClick={handleActionConfirm}
              className="px-4 py-2 text-sm text-white rounded-md bg-primary hover:bg-primary/90"
            >
              확인
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
