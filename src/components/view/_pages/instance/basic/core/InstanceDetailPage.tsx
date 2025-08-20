/* 메뉴 설명: 인스턴스 상세 페이지 */
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import PageHeader from '@/components/ui/ui-layout/page-header/PageHeader';
import Tabs from '@/components/ui/ui-layout/tabs/Tabs';
import InstanceBasicTab from './InstanceBasicTab';
import InstanceServiceConfigSection from '../../service/InstanceServiceConfigSection';
import InstanceVisitConfigSection from '../../visit/InstanceVisitConfigSection';
import InstanceModals from '../shared/InstanceModals';
import { updateInstance } from '@/services/instances/instances@id_PUT';
import { deleteInstance } from '@/services/instances/instances@id_DELETE';

import { InstanceType } from '@/types/instance';
import { createInstanceTabs } from '../../_shared/instanceTabs';
import { useInstanceModals } from '@/hooks/ui-hooks/useInstanceModals';
import { useInstanceForm } from '@/hooks/ui-hooks/useInstanceForm';
import { useCarResidentManagement } from '@/hooks/domain/useCarResidentManagement';
import { useInstanceData } from '@/hooks/domain/useInstanceData';

export default function InstanceDetailPage() {  
  const router = useRouter();
  const params = useParams();
  const instanceId = Number(params.id);
  
  // #region 상태 관리
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 탭 상태 관리
  const [activeTab, setActiveTab] = useState('basic');
  
  // 폼 상태 관리 훅
  const {
    formData,
    hasChanges,
    isValid,
    handleFormChange,
    handleReset,
    initializeForm,
    updateOriginalData,
    getChangedFields
  } = useInstanceForm();
  
  // 모달 상태 관리 훅
  const {
    successModalOpen,
    errorModalOpen,
    modalMessage,
    deleteConfirmOpen,
    primaryCarTransferModal,
    showSuccessModal,
    showErrorModal,
    closeSuccessModal,
    closeErrorModal,
    showDeleteConfirm,
    closeDeleteConfirm,
    showPrimaryCarTransferModal,
    closePrimaryCarTransferModal
  } = useInstanceModals();

  // 차량-주민 관리 훅
  const {
    residentManagementMode,
    selectedCarInstanceId,
    carResidents,
    loadingCarResidents,
    loadCarResidentsWithDetails,
    refreshCarResidents,
    handleManageResidents,
    closeResidentManagement,
    connectResident,
    disconnectResident,
    togglePrimary,
    confirmPrimaryCarTransfer,
    toggleAlarm
  } = useCarResidentManagement();

  // 인스턴스 데이터 관리 훅
  const {
    instance,
    loading,
    loadInstanceData,
    createRefreshCarResidentsFunction
  } = useInstanceData(instanceId, showErrorModal, initializeForm);
  // #endregion

  // #region 탭 설정
  const tabs = createInstanceTabs();
  // #endregion

  // #region 데이터 로드
  useEffect(() => {
    loadInstanceData();
  }, [loadInstanceData]);



  // 주민 관리 모드용 차량-주민 데이터 새로고침
  const refreshCarResidentsForManagement = useCallback(async () => {
    const refreshFn = createRefreshCarResidentsFunction(selectedCarInstanceId, refreshCarResidents, loadCarResidentsWithDetails);
    await refreshFn();
  }, [createRefreshCarResidentsFunction, selectedCarInstanceId, refreshCarResidents, loadCarResidentsWithDetails]);
  // #endregion



  // #region 핸들러

  const handleSubmit = useCallback(async () => {
    if (!instance || !isValid || isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      const updateData = getChangedFields() as {
        name?: string;
        ownerName?: string;
        address1Depth?: string;
        address2Depth?: string;
        address3Depth?: string;
        instanceType?: InstanceType;
        password?: string;
        memo?: string;
      };

      const result = await updateInstance(instance.id, updateData);

      if (result.success) {
        // 성공 시 원본 데이터 업데이트
        updateOriginalData(formData);
        
        // 데이터 다시 로드
        await loadInstanceData();
        
        showSuccessModal('세대 정보가 성공적으로 수정되었습니다.');
      } else {
        console.error('인스턴스 수정 실패:', result.errorMsg);
        showErrorModal(`세대 수정에 실패했습니다: ${result.errorMsg}`);
      }
    } catch (error) {
      console.error('인스턴스 수정 중 오류:', error);
      showErrorModal('세대 수정 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  }, [instance, isValid, isSubmitting, formData, loadInstanceData, showSuccessModal, showErrorModal, getChangedFields, updateOriginalData]);

  const handleDelete = useCallback(() => {
    showDeleteConfirm();
  }, [showDeleteConfirm]);

  const handleDeleteConfirm = useCallback(async () => {
    if (!instance) return;
    try {
      const result = await deleteInstance(instance.id);
      if (result.success) {
        showSuccessModal('세대이 성공적으로 삭제되었습니다.');
        setTimeout(() => {
          router.push('/parking/occupancy/instance');
        }, 1500);
      } else {
        showErrorModal(`세대 삭제에 실패했습니다: ${result.errorMsg}`);
      }
    } catch (error) {
      console.error('세대 삭제 중 오류:', error);
      showErrorModal('세대 삭제 중 오류가 발생했습니다.');
    } finally {
      closeDeleteConfirm();
    }
  }, [instance, router, showSuccessModal, showErrorModal, closeDeleteConfirm]);

  // 주민 관리 핸들러들 (훅에서 제공하는 함수를 래핑)
  const handleManageResidentsClick = useCallback(async (carInstanceId: number) => {
    if (!instance) return;
    
    const carInstances = instance.carInstance || [];
    await handleManageResidents(carInstanceId, carInstances, async () => {
      const carInstance = carInstances.find(ci => ci.id === carInstanceId);
      if (carInstance) {
        return await loadCarResidentsWithDetails(carInstance.carId);
      }
      return [];
    });
  }, [instance, handleManageResidents, loadCarResidentsWithDetails]);

  // 주민 연결 추가
  const handleConnectResident = useCallback(async (residentId: number) => {
    if (!selectedCarInstanceId) return;
    
    try {
      const result = await connectResident(selectedCarInstanceId, residentId);
      
      if (result.success) {
        showSuccessModal('주민이 차량에 성공적으로 연결되었습니다.');
        
        // 연결 작업 후 데이터 새로고침
        await loadInstanceData();
        
        // 연결 작업 후 차량-주민 데이터 새로고침
        await refreshCarResidentsForManagement();
      } else {
        showErrorModal(`주민 연결에 실패했습니다: ${result.errorMsg}`);
      }
    } catch (error) {
      console.error('주민 연결 중 오류:', error);
      showErrorModal('주민 연결 중 오류가 발생했습니다.');
    }
  }, [selectedCarInstanceId, connectResident, loadInstanceData, refreshCarResidentsForManagement, showSuccessModal, showErrorModal]);

  // 주민 연결 해지
  const handleDisconnectResident = useCallback(async (residentId: number) => {
    try {
      const result = await disconnectResident(residentId);
      
      if (result.success) {
        showSuccessModal('주민과 차량의 연결이 성공적으로 해지되었습니다.');
        
        // 연결 해지 작업 후 데이터 새로고침
        await loadInstanceData();
        
        // 해지 작업 후 차량-주민 데이터 새로고침
        await refreshCarResidentsForManagement();
      } else {
        showErrorModal(`연결 해지에 실패했습니다: ${result.errorMsg}`);
      }
    } catch (error) {
      console.error('연결 해지 중 오류:', error);
      if (error instanceof Error) {
        showErrorModal(error.message);
      } else {
        showErrorModal('연결 해지 중 오류가 발생했습니다.');
      }
    }
  }, [disconnectResident, loadInstanceData, refreshCarResidentsForManagement, showSuccessModal, showErrorModal]);



  // 차량 소유자 설정 토글
  const handleTogglePrimary = useCallback(async (residentId: number) => {
    try {
      const result = await togglePrimary(residentId);
      
      if (result.success) {
        const newPrimaryState = !Boolean(carResidents.find(cr => cr.id === residentId)?.isPrimary);
        showSuccessModal(`차량 소유자 설정이 ${newPrimaryState ? '활성화' : '비활성화'}되었습니다.`);
      } else if (result.needsTransfer && result.existingPrimaryResident) {
        // 기존 차량 소유자 사용자가 있으면 전환 확인 Modal 표시
        showPrimaryCarTransferModal(
          result.existingPrimaryResident,
          result.newPrimaryResidentId,
          result.newPrimaryResidentName
        );
      } else {
        showErrorModal(`차량 소유자 설정 변경에 실패했습니다: ${'errorMsg' in result ? result.errorMsg : '알 수 없는 오류'}`);
      }
    } catch (error) {
      console.error('차량 소유자 설정 변경 중 오류:', error);
      if (error instanceof Error) {
        showErrorModal(error.message);
      } else {
        showErrorModal('차량 소유자 설정 변경 중 오류가 발생했습니다.');
      }
    }
  }, [togglePrimary, carResidents, showSuccessModal, showErrorModal, showPrimaryCarTransferModal]);

  // 차량 소유자 전환 확인 처리
  const handleConfirmPrimaryCarTransfer = useCallback(async () => {
    try {
      const { currentPrimaryResident, newPrimaryResidentId } = primaryCarTransferModal;
      
      if (!currentPrimaryResident || !newPrimaryResidentId) {
        showErrorModal('전환할 주민 정보를 찾을 수 없습니다.');
        return;
      }

      const result = await confirmPrimaryCarTransfer(currentPrimaryResident, newPrimaryResidentId);
      
      if (result.success) {
        showSuccessModal(`차량 소유자이 ${result.newPrimaryResidentName}님으로 전환되었습니다.`);
        // Modal 닫기
        closePrimaryCarTransferModal();
      } else {
        showErrorModal('차량 소유자 전환에 실패했습니다.');
      }
    } catch (error) {
      console.error('차량 소유자 전환 중 오류:', error);
      if (error instanceof Error) {
        showErrorModal(error.message);
      } else {
        showErrorModal('차량 소유자 전환 중 오류가 발생했습니다.');
      }
    }
  }, [primaryCarTransferModal, confirmPrimaryCarTransfer, showErrorModal, showSuccessModal, closePrimaryCarTransferModal]);

  // 차량 소유자 전환 취소
  const handleCancelPrimaryCarTransfer = useCallback(() => {
    closePrimaryCarTransferModal();
  }, [closePrimaryCarTransferModal]);

  // 알람 설정 토글
  const handleToggleAlarm = useCallback(async (residentId: number) => {
    try {
      const currentAlarmState = Boolean(carResidents.find(cr => cr.id === residentId)?.carAlarm);
      const newAlarmState = !currentAlarmState;
      
      const result = await toggleAlarm(residentId);
      
      if (result.success) {
        showSuccessModal(`알람 설정이 ${newAlarmState ? '활성화' : '비활성화'}되었습니다.`);
      } else {
        showErrorModal(`알람 설정 변경에 실패했습니다: ${result.errorMsg}`);
      }
    } catch (error) {
      console.error('알람 설정 변경 중 오류:', error);
      if (error instanceof Error) {
        showErrorModal(error.message);
      } else {
        showErrorModal('알람 설정 변경 중 오류가 발생했습니다.');
      }
    }
  }, [carResidents, toggleAlarm, showSuccessModal, showErrorModal]);

  const handleCloseResidentManagement = useCallback(() => {
    closeResidentManagement();
  }, [closeResidentManagement]);
  // #endregion

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-muted-foreground">로딩 중...</div>
      </div>
    );
  }

  if (!instance) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-muted-foreground">세대 정보를 찾을 수 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* 헤더 */}
      <PageHeader 
        title="세대 상세 정보"
        subtitle={`${instance.name} - ${instance.address1Depth} ${instance.address2Depth} ${instance.address3Depth || ''}`}
        hasChanges={hasChanges}
      />

      {/* 탭과 콘텐츠 */}
      <div className="flex flex-col">
        <Tabs
          tabs={tabs}
          activeId={activeTab}
          onTabChange={setActiveTab}
        />

        {/* 콘텐츠 영역 */}
        <div className="p-6 rounded-b-lg border-b-2 border-s-2 border-e-2 border-border bg-background">
          {/* 기본 정보 탭 */}
          {activeTab === 'basic' && (
            <InstanceBasicTab
              instance={instance}
              loading={loading}
              isSubmitting={isSubmitting}
              formData={formData}
              hasChanges={hasChanges}
              isValid={isValid}
              onFormChange={handleFormChange}
              onReset={handleReset}
              onSubmit={handleSubmit}
              onDelete={handleDelete}
              residentManagementMode={residentManagementMode}
              selectedCarInstanceId={selectedCarInstanceId}
              carResidents={carResidents}
              loadingCarResidents={loadingCarResidents}
              onCloseResidentManagement={handleCloseResidentManagement}
              onConnectResident={handleConnectResident}
              onDisconnectResident={handleDisconnectResident}
              onTogglePrimary={handleTogglePrimary}
              onToggleAlarm={handleToggleAlarm}
              onDataChange={loadInstanceData}
              onManageResidents={handleManageResidentsClick}
            />
          )}

          {/* 서비스 설정 탭 */}
          {activeTab === 'service' && (
            <div className="space-y-6">
              <InstanceServiceConfigSection 
                instance={instance}
                onDataChange={loadInstanceData}
              />
            </div>
          )}

          {/* 방문 설정 탭 */}
          {activeTab === 'visit' && (
            <div className="space-y-6">
              <InstanceVisitConfigSection 
                instance={instance}
                onDataChange={loadInstanceData}
              />
            </div>
          )}
        </div>
      </div>

      <InstanceModals
        successModalOpen={successModalOpen}
        onCloseSuccessModal={closeSuccessModal}
        errorModalOpen={errorModalOpen}
        onCloseErrorModal={closeErrorModal}
        modalMessage={modalMessage}
        deleteConfirmOpen={deleteConfirmOpen}
        onCloseDeleteConfirm={closeDeleteConfirm}
        onConfirmDelete={handleDeleteConfirm}
        primaryCarTransferModal={primaryCarTransferModal}
        onConfirmPrimaryCarTransfer={handleConfirmPrimaryCarTransfer}
        onCancelPrimaryCarTransfer={handleCancelPrimaryCarTransfer}
      />
    </div>
  );
}

