'use client';

import React, { useState } from 'react';
import { Car, CarFront, Calendar, Fuel, Tag, Plus, Link, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { CarInstanceWithCar } from '@/types/instance';
import InstanceItemCard, { InstanceItemCardField, InstanceItemCardBadge, CustomAction } from '@/components/ui/ui-layout/info-card/InstanceItemCard';
import { SectionPanel } from '@/components/ui/ui-layout/section-panel/SectionPanel';
import Modal from '@/components/ui/ui-layout/modal/Modal';
import { Button } from '@/components/ui/ui-input/button/Button';
import CarCreateModal from './CarCreateModal';
import CarSearchModal from './CarSearchModal';
import { deleteCarInstance } from '@/services/cars/cars_instances@id_DELETE';
import { deleteCar } from '@/services/cars/cars@id_DELETE';

interface InstanceCarListProps {
  carInstances?: CarInstanceWithCar[];
  loading?: boolean;
  instanceId?: number;
  onDataChange?: () => void;
  onManageResidents?: (carInstanceId: number, carNumber: string) => void;
}

export default function InstanceCarList({ 
  carInstances = [], 
  loading = false,
  instanceId,
  onDataChange,
  onManageResidents
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
          // 차량-인스턴스 연결 해지
          const carInstance = carInstances?.find(ci => ci.car.id === confirmModal.carId);
          if (carInstance && instanceId) {
            const result = await deleteCarInstance(carInstance.id);
            if (result.success) {
              // 데이터 새로고침
              if (onDataChange) {
                onDataChange();
              }
            } else {
              console.error('연결 해지 실패:', result.errorMsg);
            }
          }
          break;
        case 'delete':
          // 차량 완전 삭제
          const deleteResult = await deleteCar(confirmModal.carId);
          if (deleteResult.success) {
            // 데이터 새로고침
            if (onDataChange) {
              onDataChange();
            }
          } else {
            console.error('차량 삭제 실패:', deleteResult.errorMsg);
          }
          break;
      }
    } catch (error) {
      console.error('작업 중 오류 발생:', error);
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
    // 데이터 새로고침
    if (onDataChange) {
      onDataChange();
    }
  };

  const handleManageResidentsClick = (carInstanceId: number, carNumber: string) => {
    if (onManageResidents) {
      onManageResidents(carInstanceId, carNumber);
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

              // 커스텀 액션 - 거주민 관리 버튼
              const customActions: CustomAction[] = onManageResidents ? [{
                icon: <Users />,
                onClick: () => handleManageResidentsClick(carInstance.id, carInstance.car.carNumber || '번호판 없음'),
                title: '거주민 연결 관리',
                hoverClass: 'hover:bg-purple-100 hover:text-purple-600'
              }] : [];

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
                  customActions={customActions}
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
