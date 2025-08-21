/* 
  파일명: /components/view/_pages/instance/basic/core/InstanceDetailPage.tsx
  기능: 세대 상세 정보 페이지 메인 컴포넌트
  책임: 세대 정보, 차량, 주민 관리의 통합 UI를 제공한다.
*/ // ------------------------------

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';

import PageHeader from '@/components/ui/ui-layout/page-header/PageHeader';
import Tabs from '@/components/ui/ui-layout/tabs/Tabs';
import InstanceBasicTab from './InstanceBasicTab';
import InstanceServiceConfigSection from '../../service/InstanceServiceConfigSection';
import InstanceVisitConfigSection from '../../visit/InstanceVisitConfigSection';
import InstanceModals from '../shared/InstanceModals';
import { toast } from '@/components/ui/ui-effects/toast/Toast';
import { updateInstance } from '@/services/instances/instances@id_PUT';
import { deleteInstance } from '@/services/instances/instances@id_DELETE';

import { InstanceType } from '@/types/instance';
import { createInstanceTabs } from '../../_shared/instanceTabs';
import { useInstanceForm } from '@/hooks/ui-hooks/useInstanceForm';
import { useCarResidentManager } from '@/hooks/domain/useCarResidentManager';
import { useInstanceData } from '@/hooks/domain/useInstanceData';

export default function InstanceDetailPage() {  
  const router = useRouter();
  const params = useParams();
  const instanceId = Number(params?.id);

  // #region 모달 상태
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [primaryCarTransferModal, setPrimaryCarTransferModal] = useState({
    isOpen: false,
    currentPrimaryResident: null,
    newPrimaryResidentId: null as number | null,
    newPrimaryResidentName: ''
  });
  // #endregion

  // #region 폼 관리 훅
  const {
    formData,
    hasChanges,
    isValid,
    handleFormChange,
    handleReset,
    initializeForm
  } = useInstanceForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  // #endregion

  // #region 인스턴스 데이터 훅
  const showErrorModal = (message: string) => {
    setModalMessage(message);
    setErrorModalOpen(true);
  };

  const { instance, loading, loadInstanceData } = useInstanceData(
    instanceId,
    showErrorModal,
    initializeForm
  );
  // #endregion

  // #region 차량-주민 관리 훅
  const {
    residentManagementMode,
    selectedCarInstanceId,
    carResidents,
    loadingCarResidents,
    loadCarResidentsWithDetails,
    handleManageResidents,
    connectResident,
    disconnectResident,
    togglePrimary,
    toggleAlarm
  } = useCarResidentManager();
  // #endregion

  // #region 탭 관리
  const tabs = useMemo(() => createInstanceTabs(), []);
  const [activeTab, setActiveTab] = useState('basic');
  // #endregion

  // #region 초기 로드
  useEffect(() => {
    if (instanceId && !isNaN(instanceId)) {
      loadInstanceData();
    }
  }, [instanceId, loadInstanceData]);
  // #endregion

  // #region 이벤트 핸들러
  const handleSubmit = async () => {
    if (!isValid || !instance || isSubmitting) return;

    setIsSubmitting(true);
    
    try {
      const updateData = {
        name: formData.name,
        ownerName: formData.ownerName || undefined,
        address1Depth: formData.address1Depth,
        address2Depth: formData.address2Depth,
        address3Depth: formData.address3Depth || undefined,
        instanceType: formData.instanceType as InstanceType,
        password: formData.password,
        memo: formData.memo || undefined,
      };

      const result = await updateInstance(instance.id, updateData);

      if (result.success) {
        toast.success('세대 정보가 성공적으로 수정되었습니다.');
        handleReset();
        // 데이터 새로고침
        await loadInstanceData();
      } else {
        console.error('세대 정보 수정 실패:', result.errorMsg);
        setModalMessage(`세대 정보 수정에 실패했습니다: ${result.errorMsg}`);
        setErrorModalOpen(true);
      }
    } catch (error) {
      console.error('세대 정보 수정 중 오류:', error);
      setModalMessage('세대 정보 수정 중 오류가 발생했습니다.');
      setErrorModalOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = () => {
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!instance || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const result = await deleteInstance(instance.id);

      if (result.success) {
        toast.success('세대가 성공적으로 삭제되었습니다.');
        setTimeout(() => {
          router.push('/parking/occupancy/instance');
        }, 1500);
      } else {
        console.error('세대 삭제 실패:', result.errorMsg);
        setModalMessage(`세대 삭제에 실패했습니다: ${result.errorMsg}`);
        setErrorModalOpen(true);
      }
    } catch (error) {
      console.error('세대 삭제 중 오류:', error);
      setModalMessage('세대 삭제 중 오류가 발생했습니다.');
      setErrorModalOpen(true);
    } finally {
      setDeleteConfirmOpen(false);
      setIsSubmitting(false);
    }
  };

  const handleDataChange = () => {
    // 세대 데이터 새로고침
    loadInstanceData();
  };

  // 차량 관리 핸들러
  const handleManageResidentsClick = async (carInstanceId: number) => {
    if (!instance || !instance.carInstance) return;

    // 선택된 차량의 ID를 찾기
    const carInstance = instance.carInstance.find(ci => ci.id === carInstanceId);
    if (!carInstance?.car) return;

    await handleManageResidents(
      carInstanceId,
      instance.carInstance,
      () => loadCarResidentsWithDetails(carInstance.car!.id, instance.id)
    );
  };

  // 주민 연결 관련 핸들러
  const handleConnectResident = async (residentId: number) => {
    if (!selectedCarInstanceId) return;
    
    try {
      const result = await connectResident(selectedCarInstanceId, residentId);
      if (result.success) {
        toast.success('주민이 성공적으로 연결되었습니다.');
        await handleDataChange();
      } else {
        setModalMessage(`주민 연결에 실패했습니다: ${result.errorMsg}`);
        setErrorModalOpen(true);
      }
    } catch (error) {
      console.error('주민 연결 중 오류:', error);
      setModalMessage('주민 연결 중 오류가 발생했습니다.');
      setErrorModalOpen(true);
    }
  };

  const handleDisconnectResident = async (residentId: number) => {
    try {
      const result = await disconnectResident(residentId);
      if (result.success) {
        toast.success('주민 연결이 성공적으로 해제되었습니다.');
        await handleDataChange();
      } else {
        setModalMessage(`주민 연결 해제에 실패했습니다: ${result.errorMsg}`);
        setErrorModalOpen(true);
      }
    } catch (error) {
      console.error('주민 연결 해제 중 오류:', error);
      setModalMessage('주민 연결 해제 중 오류가 발생했습니다.');
      setErrorModalOpen(true);
    }
  };

  const handleTogglePrimary = async (residentId: number) => {
    try {
      const result = await togglePrimary(residentId);
      if (result.success) {
        toast.success('차량 소유자 설정이 성공적으로 변경되었습니다.');
        await handleDataChange();
      } else {
        setModalMessage(`차량 소유자 설정 변경에 실패했습니다: ${result.errorMsg}`);
        setErrorModalOpen(true);
      }
    } catch (error) {
      console.error('차량 소유자 설정 변경 중 오류:', error);
      setModalMessage('차량 소유자 설정 변경 중 오류가 발생했습니다.');
      setErrorModalOpen(true);
    }
  };

  const handleToggleAlarm = async (residentId: number) => {
    try {
      const result = await toggleAlarm(residentId);
      if (result.success) {
        toast.success('알람 설정이 성공적으로 변경되었습니다.');
        await handleDataChange();
      } else {
        setModalMessage(`알람 설정 변경에 실패했습니다: ${result.errorMsg}`);
        setErrorModalOpen(true);
      }
    } catch (error) {
      console.error('알람 설정 변경 중 오류:', error);
      setModalMessage('알람 설정 변경 중 오류가 발생했습니다.');
      setErrorModalOpen(true);
    }
  };

  // 연결 상태 확인 헬퍼
  const isResidentConnectedToSelectedCar = (residentId: number) => {
    return carResidents.some(cr => cr.id === residentId);
  };

  // 모달 핸들러
  const onConfirmPrimaryCarTransfer = () => {
    // 차량 소유자 전환 확인 로직 (필요시 구현)
    setPrimaryCarTransferModal(prev => ({ ...prev, isOpen: false }));
  };

  const onCancelPrimaryCarTransfer = () => {
    setPrimaryCarTransferModal(prev => ({ ...prev, isOpen: false }));
  };
  // #endregion

  // #region 렌더링
  if (!instanceId || isNaN(instanceId)) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-muted-foreground">잘못된 세대 ID입니다.</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* 헤더 */}
      <PageHeader 
        title={instance ? `세대 정보: ${instance.address1Depth} ${instance.address2Depth}` : '세대 정보'}
        subtitle="세대의 상세 정보를 조회하고 관리합니다."
      />

      {/* 탭 */}
      <div className="flex flex-col">
        <Tabs
          tabs={tabs}
          activeId={activeTab}
          onTabChange={setActiveTab}
        />

        {/* 콘텐츠 영역 */}
        <div className="p-6 rounded-b-lg border-b-2 border-s-2 border-e-2 border-border bg-background">
          {activeTab === 'basic' && instance && (
            <InstanceBasicTab
              instance={instance}
              loading={loading}
              isSubmitting={isSubmitting}
              
              // 폼 관련
              formData={formData}
              hasChanges={hasChanges}
              isValid={isValid}
              onFormChange={handleFormChange}
              onReset={handleReset}
              onSubmit={handleSubmit}
              onDelete={handleDelete}
              
              // 차량-주민 관리 관련
              residentManagementMode={residentManagementMode}
              selectedCarInstanceId={selectedCarInstanceId}
              carResidents={carResidents}
              loadingCarResidents={loadingCarResidents}
              onConnectResident={handleConnectResident}
              onDisconnectResident={handleDisconnectResident}
              onTogglePrimary={handleTogglePrimary}
              onToggleAlarm={handleToggleAlarm}
              
              // 데이터 새로고침
              onDataChange={handleDataChange}
              onManageResidents={handleManageResidentsClick}
              
              // 연결 상태 확인 헬퍼
              isResidentConnectedToSelectedCar={isResidentConnectedToSelectedCar}
            />
          )}
          {activeTab === 'service' && instance && (
            <InstanceServiceConfigSection
              instance={instance}
              onDataChange={handleDataChange}
            />
          )}
          {activeTab === 'visit' && instance && (
            <InstanceVisitConfigSection
              instance={instance}
              onDataChange={handleDataChange}
            />
          )}
        </div>
      </div>

      {/* 모달들 */}
      <InstanceModals
        errorModalOpen={errorModalOpen}
        onCloseErrorModal={() => setErrorModalOpen(false)}
        modalMessage={modalMessage}
        deleteConfirmOpen={deleteConfirmOpen}
        onCloseDeleteConfirm={() => setDeleteConfirmOpen(false)}
        onConfirmDelete={handleConfirmDelete}
        primaryCarTransferModal={primaryCarTransferModal}
        onConfirmPrimaryCarTransfer={onConfirmPrimaryCarTransfer}
        onCancelPrimaryCarTransfer={onCancelPrimaryCarTransfer}
      />
    </div>
  );
  // #endregion
}