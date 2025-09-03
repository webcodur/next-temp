/* 
  파일명: /components/view/_pages/instance/basic/core/InstanceBasicTab.tsx
  기능: 인스턴스 상세 페이지의 기본 정보 탭 컴포넌트
  책임: 세대 기본 정보, 연결된 주민, 연결된 차량을 관리한다.
*/ // ------------------------------

'use client';

import React from 'react';
import InstanceForm from './InstanceForm';
import InstanceUserList from '../user-panel/InstanceUserList';
import InstanceCarList from '../car-panel/InstanceCarList';
import type { InstanceDetail } from '@/types/instance';
import type { CarUserWithDetails } from '@/types/car';
import type { InstanceFormData } from '@/hooks/ui-hooks/useInstanceForm';

// #region 타입 및 인터페이스
interface InstanceBasicTabProps {
  instance: InstanceDetail;
  loading: boolean;
  isSubmitting: boolean;
  
  // 폼 관련
  formData: InstanceFormData;
  hasChanges: boolean;
  isValid: boolean;
  onFormChange: (data: InstanceFormData) => void;
  onReset: () => void;
  onSubmit: () => Promise<void>;
  onDelete: () => void;
  
  // 차량-사용자 관리 관련
  userManagementMode: boolean;
  selectedCarInstanceId: number | null;
  carUsers: CarUserWithDetails[];
  loadingCarUsers: boolean;
  onConnectUser: (userId: number) => void;
  onDisconnectUser: (userId: number) => void;
  onTogglePrimary: (userId: number) => void;
  onToggleAlarm: (userId: number) => void;
  
  // 데이터 새로고침
  onDataChange: () => void;
  onManageUsers: (carInstanceId: number) => void;
  
  // 연결 상태 확인 헬퍼
  isUserConnectedToSelectedCar: (userId: number) => boolean;
}
// #endregion

export default function InstanceBasicTab({
  instance,
  loading,
  isSubmitting,
  
  // 폼 관련
  formData,
  hasChanges,
  isValid,
  onFormChange,
  onReset,
  onSubmit,
  onDelete,
  
  // 차량-사용자 관리 관련
  userManagementMode,
  selectedCarInstanceId,
  carUsers,
  loadingCarUsers,
  onConnectUser,
  onDisconnectUser,
  onTogglePrimary,
  onToggleAlarm,
  
  // 데이터 새로고침
  onDataChange,
  onManageUsers,
  
  // 연결 상태 확인 헬퍼
  isUserConnectedToSelectedCar
}: InstanceBasicTabProps) {

  return (
    <div className="space-y-6">
      {/* 세대 기본 정보 */}
      <InstanceForm
        mode="edit"
        instance={instance}
        data={formData}
        onChange={onFormChange}
        disabled={isSubmitting}
        showActions={true}
        onReset={onReset}
        onSubmit={onSubmit}
        onDelete={onDelete}
        hasChanges={hasChanges}
        isValid={isValid}
      />
      
      {/* 연결된 주민 | 차량 목록 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <InstanceUserList 
          userInstances={instance.userInstance}
          loading={loading}
          instanceId={instance.id}
          onDataChange={onDataChange} // 주민-세대 연결 해지를 위해 항상 활성화
          userManagementMode={userManagementMode}
          carUsers={carUsers}
          loadingCarUsers={loadingCarUsers}
          onConnectUser={onConnectUser}
          onDisconnectUser={onDisconnectUser}
          onTogglePrimary={onTogglePrimary}
          onToggleAlarm={onToggleAlarm}
          isUserConnectedToSelectedCar={isUserConnectedToSelectedCar}
        />
        <InstanceCarList 
          carInstances={instance.carInstance}
          loading={loading}
          instanceId={instance.id}
          onDataChange={onDataChange}
          onManageUsers={onManageUsers}
          userManagementMode={userManagementMode}
          managedCarInstanceId={selectedCarInstanceId}
        />
      </div>
    </div>
  );
}
