/* 
  파일명: /components/view/_pages/instance/basic/car-panel/CarCardItem.tsx
  기능: 개별 차량 카드 아이템 컴포넌트
  책임: 단일 차량의 정보를 카드 형태로 표시하고 관리 기능을 제공한다.
*/ // ------------------------------

'use client';

import React from 'react';
import { CarFront, Calendar, Fuel, Tag, Users } from 'lucide-react';
import InstanceItemCard, { InstanceItemCardField, InstanceItemCardBadge, CustomAction } from '../shared/InstanceItemCard';
import type { CarInstanceWithCar } from '@/types/instance';

// #region 타입 및 인터페이스
interface CarCardItemProps {
  carInstance: CarInstanceWithCar;
  residentManagementMode: boolean;
  managedCarInstanceId: number | null;
  
  // 기본 액션 핸들러
  onDetailClick: (carId: number, carNumber: string) => void;
  onExcludeClick: (carId: number, carNumber: string) => void;
  onDeleteClick: (carId: number, carNumber: string) => void;
  
  // 관리 모드 핸들러
  onManageResidents?: (carInstanceId: number) => void;
}
// #endregion

export default function CarCardItem({
  carInstance,
  residentManagementMode,
  managedCarInstanceId,
  onDetailClick,
  onExcludeClick,
  onDeleteClick,
  onManageResidents
}: CarCardItemProps) {

  // #region 내부 핸들러
  const handleManageResidentsClick = (carInstanceId: number) => {
    if (onManageResidents) {
      onManageResidents(carInstanceId);
    }
  };
  // #endregion

  // #region 데이터 처리
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
      value: carInstance.car?.fuel || '',
      show: !!carInstance.car?.fuel
    },
    {
      icon: <Calendar />,
      value: carInstance.car?.year ? `${carInstance.car.year}년` : '',
      show: !!carInstance.car?.year
    }
  ];

  // 우측 열 데이터
  const rightColumn: InstanceItemCardField[] = [];

  // 외부 스티커가 있으면 우측 열에 추가
  if (carInstance.car?.externalSticker) {
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
        {carInstance.car?.carNumber || '번호판 없음'}
      </span>
      {(carInstance.car?.brand || carInstance.car?.model || carInstance.car?.type) && (
        <span className="text-sm truncate text-muted-foreground">
          {[carInstance.car?.brand, carInstance.car?.model, carInstance.car?.type]
            .filter(Boolean)
            .join(' ')}
        </span>
      )}
    </div>
  );

  // 커스텀 액션 - 관리 모드 버튼
  const isCurrentlyManaged = residentManagementMode && managedCarInstanceId === carInstance.id;
  const customActions: CustomAction[] = onManageResidents ? [{
    icon: isCurrentlyManaged 
      ? <Users className="text-white" />
      : <Users className="text-gray-700" />,
    onClick: () => handleManageResidentsClick(carInstance.id),
    title: isCurrentlyManaged ? '관리 모드 종료' : '관리 모드',
    hoverClass: isCurrentlyManaged 
      ? 'bg-red-500 text-white shadow-lg ring-2 ring-red-200 hover:bg-red-600'
      : 'bg-gray-100 text-gray-700 hover:bg-purple-100 hover:text-purple-600'
  }] : [];
  // #endregion

  return (
    <InstanceItemCard
      key={carInstance.id}
      headerIcon={<CarFront />}
      title="" // customTitle을 사용하므로 빈 문자열
      customTitle={customTitle}
      badges={badges}
      leftColumn={leftColumn}
      rightColumn={rightColumn}
      memo={carInstance.car?.outerText || undefined}
      customActions={customActions}
      onDetail={() => onDetailClick(carInstance.car?.id || 0, carInstance.car?.carNumber || '번호판 없음')}
      onExclude={() => onExcludeClick(carInstance.car?.id || 0, carInstance.car?.carNumber || '번호판 없음')}
      onDelete={() => onDeleteClick(carInstance.car?.id || 0, carInstance.car?.carNumber || '번호판 없음')}
    />
  );
}
