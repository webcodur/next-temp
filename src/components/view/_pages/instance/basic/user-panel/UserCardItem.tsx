/* 
  파일명: /components/view/_pages/instance/basic/user-panel/UserCardItem.tsx
  기능: 개별 사용자 카드 아이템 컴포넌트
  책임: 단일 사용자의 정보를 카드 형태로 표시하고 관리 기능을 제공한다.
*/ // ------------------------------

'use client';

import React from 'react';
import { User, Phone, Mail, Calendar, UserCheck } from 'lucide-react';
import InstanceItemCard, { InstanceItemCardField, InstanceItemCardBadge } from '../shared/InstanceItemCard';
import UserManagementOverlay from './UserManagementOverlay';
import type { UserInstanceWithUser } from '@/types/instance';
import type { CarUserWithDetails } from '@/types/car';

// #region 타입 및 인터페이스
interface UserCardItemProps {
  userInstance: UserInstanceWithUser;
  userManagementMode: boolean;
  carUsers: CarUserWithDetails[];
  loadingCarUsers: boolean;
  
  // 기본 액션 핸들러
  onDetailClick: (userId: number, userName: string) => void;
  onExcludeClick: (userId: number, userName: string) => void;
  onDeleteClick: (userId: number, userName: string) => void;
  
  // 차량-사용자 관리 핸들러
  onConnectUser?: (userId: number) => void;
  onDisconnectUser?: (userId: number) => void;
  onTogglePrimary?: (userId: number) => void;
  onToggleAlarm?: (userId: number) => void;
  
  // 연결 상태 확인 헬퍼
  isUserConnectedToSelectedCar?: (userId: number) => boolean;
}
// #endregion

export default function UserCardItem({
  userInstance,
  userManagementMode,
  carUsers,
  loadingCarUsers,
  onDetailClick,
  onExcludeClick,
  onDeleteClick,
  onConnectUser,
  onDisconnectUser,
  onTogglePrimary,
  onToggleAlarm,
  
  // 연결 상태 확인 헬퍼
  isUserConnectedToSelectedCar
}: UserCardItemProps) {

  // #region 데이터 처리
  // 배지 정보
  const badges: InstanceItemCardBadge[] = [];
  if (userInstance.status) {
    badges.push({
      text: userInstance.status === 'ACTIVE' ? '활성' : userInstance.status,
      variant: userInstance.status === 'ACTIVE' ? 'success' : 'default'
    });
  }

  // 좌측 열 데이터
  const leftColumn: InstanceItemCardField[] = [
    {
      icon: <Phone />,
      value: userInstance.user.phone || '전화번호 없음'
    },
    {
      icon: <Mail />,
      value: userInstance.user.email || '',
      show: !!userInstance.user.email
    }
  ];

  // 우측 열 데이터
  const rightColumn: InstanceItemCardField[] = [
    {
      icon: <UserCheck />,
      value: userInstance.user.gender === 'M' ? '남성' : 
            userInstance.user.gender === 'F' ? '여성' : 
            userInstance.user.gender || '',
      show: !!userInstance.user.gender
    },
    {
      icon: <Calendar />,
      value: userInstance.user.birthDate 
        ? new Date(userInstance.user.birthDate).toLocaleDateString('ko-KR')
        : '',
      show: !!userInstance.user.birthDate
    }
  ];

  // 차량 연결 상태 확인 - 헬퍼 함수 우선 사용, 없으면 기본 로직
  const isConnected = isUserConnectedToSelectedCar 
    ? isUserConnectedToSelectedCar(userInstance.user.id)
    : carUsers.some(carUser => carUser.id === userInstance.user.id);
  const carUser = carUsers.find(cr => cr.id === userInstance.user.id);
  // #endregion

  return (
    <div key={userInstance.id} className="relative">
      <InstanceItemCard
        headerIcon={<User />}
        title={userInstance.user.name}
        badges={badges}
        leftColumn={leftColumn}
        rightColumn={rightColumn}
        memo={userInstance.memo || undefined}
        onDetail={() => onDetailClick(userInstance.user.id, userInstance.user.name)}
        onExclude={() => onExcludeClick(userInstance.user.id, userInstance.user.name)}
        onDelete={() => onDeleteClick(userInstance.user.id, userInstance.user.name)}
      />
      
      {/* 사용자 관리 모드 overlay */}
      {userManagementMode && (
        <UserManagementOverlay
          userId={userInstance.user.id}
          isConnected={isConnected}
          carUser={carUser}
          loadingCarUsers={loadingCarUsers}
          onConnectUser={() => onConnectUser && onConnectUser(userInstance.user.id)}
          onDisconnectUser={() => onDisconnectUser && onDisconnectUser(userInstance.user.id)}
          onTogglePrimary={() => onTogglePrimary && onTogglePrimary(userInstance.user.id)}
          onToggleAlarm={() => onToggleAlarm && onToggleAlarm(userInstance.user.id)}
        />
      )}
    </div>
  );
}