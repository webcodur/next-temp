/* 
  파일명: /components/view/_pages/instance/basic/core/InstanceBasicTab.tsx
  기능: 인스턴스 상세 페이지의 기본 정보 탭 컴포넌트
  책임: 세대 기본 정보, 연결된 주민, 연결된 차량을 관리한다.
*/ // ------------------------------

'use client';

import React from 'react';
import InstanceForm from './InstanceForm';
import InstanceResidentList from '../resident-panel/InstanceResidentList';
import InstanceCarList from '../car-panel/InstanceCarList';
import type { InstanceDetail } from '@/types/instance';
import type { CarResidentWithDetails } from '@/types/car';
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
  
  // 차량-주민 관리 관련
  residentManagementMode: boolean;
  selectedCarInstanceId: number | null;
  carResidents: CarResidentWithDetails[];
  loadingCarResidents: boolean;
  onCloseResidentManagement: () => void;
  onConnectResident: (residentId: number) => void;
  onDisconnectResident: (residentId: number) => void;
  onTogglePrimary: (residentId: number) => void;
  onToggleAlarm: (residentId: number) => void;
  
  // 데이터 새로고침
  onDataChange: () => void;
  onManageResidents: (carInstanceId: number) => void;
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
  
  // 차량-주민 관리 관련
  residentManagementMode,
  selectedCarInstanceId,
  carResidents,
  loadingCarResidents,
  onCloseResidentManagement,
  onConnectResident,
  onDisconnectResident,
  onTogglePrimary,
  onToggleAlarm,
  
  // 데이터 새로고침
  onDataChange,
  onManageResidents
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
        <InstanceResidentList 
          residentInstances={instance.residentInstance}
          loading={loading}
          instanceId={instance.id}
          onDataChange={residentManagementMode ? undefined : onDataChange} // 주민 관리 모드에서는 자동 새로고침 방지
          residentManagementMode={residentManagementMode}
          carResidents={carResidents}
          loadingCarResidents={loadingCarResidents}
          onCloseResidentManagement={onCloseResidentManagement}
          onConnectResident={onConnectResident}
          onDisconnectResident={onDisconnectResident}
          onTogglePrimary={onTogglePrimary}
          onToggleAlarm={onToggleAlarm}
        />
        <InstanceCarList 
          carInstances={instance.carInstance}
          loading={loading}
          instanceId={instance.id}
          onDataChange={onDataChange}
          onManageResidents={onManageResidents}
          residentManagementMode={residentManagementMode}
          managedCarInstanceId={selectedCarInstanceId}
        />
      </div>
    </div>
  );
}
