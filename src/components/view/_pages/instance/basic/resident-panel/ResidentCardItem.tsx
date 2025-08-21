/* 
  파일명: /components/view/_pages/instance/basic/resident-panel/ResidentCardItem.tsx
  기능: 개별 주민 카드 아이템 컴포넌트
  책임: 단일 주민의 정보를 카드 형태로 표시하고 관리 기능을 제공한다.
*/ // ------------------------------

'use client';

import React from 'react';
import { User, Phone, Mail, Calendar, UserCheck } from 'lucide-react';
import InstanceItemCard, { InstanceItemCardField, InstanceItemCardBadge } from '../shared/InstanceItemCard';
import ResidentManagementOverlay from './ResidentManagementOverlay';
import type { ResidentInstanceWithResident } from '@/types/instance';
import type { CarResidentWithDetails } from '@/types/car';

// #region 타입 및 인터페이스
interface ResidentCardItemProps {
  residentInstance: ResidentInstanceWithResident;
  residentManagementMode: boolean;
  carResidents: CarResidentWithDetails[];
  loadingCarResidents: boolean;
  
  // 기본 액션 핸들러
  onDetailClick: (residentId: number, residentName: string) => void;
  onExcludeClick: (residentId: number, residentName: string) => void;
  onDeleteClick: (residentId: number, residentName: string) => void;
  
  // 차량-주민 관리 핸들러
  onConnectResident?: (residentId: number) => void;
  onDisconnectResident?: (residentId: number) => void;
  onTogglePrimary?: (residentId: number) => void;
  onToggleAlarm?: (residentId: number) => void;
  
  // 연결 상태 확인 헬퍼
  isResidentConnectedToSelectedCar?: (residentId: number) => boolean;
}
// #endregion

export default function ResidentCardItem({
  residentInstance,
  residentManagementMode,
  carResidents,
  loadingCarResidents,
  onDetailClick,
  onExcludeClick,
  onDeleteClick,
  onConnectResident,
  onDisconnectResident,
  onTogglePrimary,
  onToggleAlarm,
  
  // 연결 상태 확인 헬퍼
  isResidentConnectedToSelectedCar
}: ResidentCardItemProps) {

  // #region 데이터 처리
  // 배지 정보
  const badges: InstanceItemCardBadge[] = [];
  if (residentInstance.status) {
    badges.push({
      text: residentInstance.status === 'ACTIVE' ? '활성' : residentInstance.status,
      variant: residentInstance.status === 'ACTIVE' ? 'success' : 'default'
    });
  }

  // 좌측 열 데이터
  const leftColumn: InstanceItemCardField[] = [
    {
      icon: <Phone />,
      value: residentInstance.resident.phone || '전화번호 없음'
    },
    {
      icon: <Mail />,
      value: residentInstance.resident.email || '',
      show: !!residentInstance.resident.email
    }
  ];

  // 우측 열 데이터
  const rightColumn: InstanceItemCardField[] = [
    {
      icon: <UserCheck />,
      value: residentInstance.resident.gender === 'M' ? '남성' : 
            residentInstance.resident.gender === 'F' ? '여성' : 
            residentInstance.resident.gender || '',
      show: !!residentInstance.resident.gender
    },
    {
      icon: <Calendar />,
      value: residentInstance.resident.birthDate 
        ? new Date(residentInstance.resident.birthDate).toLocaleDateString('ko-KR')
        : '',
      show: !!residentInstance.resident.birthDate
    }
  ];

  // 차량 연결 상태 확인 - 헬퍼 함수 우선 사용, 없으면 기본 로직
  const isConnected = isResidentConnectedToSelectedCar 
    ? isResidentConnectedToSelectedCar(residentInstance.resident.id)
    : carResidents.some(carResident => carResident.id === residentInstance.resident.id);
  const carResident = carResidents.find(cr => cr.id === residentInstance.resident.id);
  // #endregion

  return (
    <div key={residentInstance.id} className="relative">
      <InstanceItemCard
        headerIcon={<User />}
        title={residentInstance.resident.name}
        badges={badges}
        leftColumn={leftColumn}
        rightColumn={rightColumn}
        memo={residentInstance.memo || undefined}
        onDetail={() => onDetailClick(residentInstance.resident.id, residentInstance.resident.name)}
        onExclude={() => onExcludeClick(residentInstance.resident.id, residentInstance.resident.name)}
        onDelete={() => onDeleteClick(residentInstance.resident.id, residentInstance.resident.name)}
      />
      
      {/* 주민 관리 모드 overlay */}
      {residentManagementMode && (
        <ResidentManagementOverlay
          residentId={residentInstance.resident.id}
          isConnected={isConnected}
          carResident={carResident}
          loadingCarResidents={loadingCarResidents}
          onConnectResident={() => onConnectResident && onConnectResident(residentInstance.resident.id)}
          onDisconnectResident={() => onDisconnectResident && onDisconnectResident(residentInstance.resident.id)}
          onTogglePrimary={() => onTogglePrimary && onTogglePrimary(residentInstance.resident.id)}
          onToggleAlarm={() => onToggleAlarm && onToggleAlarm(residentInstance.resident.id)}
        />
      )}
    </div>
  );
}
