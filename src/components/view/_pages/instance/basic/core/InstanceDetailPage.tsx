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

import { ENUM_InstanceType } from '@/types/instance';
import { createInstanceTabs } from '../../_shared/instanceTabs';
import { useInstanceForm } from '@/hooks/ui-hooks/useInstanceForm';
import { useCarUserManager } from '@/hooks/domain/useCarUserManager';
import { useInstanceData } from '@/hooks/domain/useInstanceData';

export default function InstanceDetailPage() {  
  const router = useRouter();
  const params = useParams();
  const instanceId = Number(params?.id);

  // #region 모달 상태
  const [modalMessage, setModalMessage] = useState('');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [primaryCarTransferModal, setPrimaryCarTransferModal] = useState({
    isOpen: false,
    currentPrimaryUser: null,
    newPrimaryUserId: null as number | null,
    newPrimaryUserName: ''
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
  };

  const { instance, loading, loadInstanceData } = useInstanceData(
    instanceId,
    showErrorModal,
    initializeForm
  );
  // #endregion

  // #region 차량-사용자 관리 훅
  const {
    userManagementMode,
    selectedCarInstanceId,
    carUsers,
    loadingCarUsers,
    loadCarUsersWithDetails,
    refreshCarUsers,
    handleManageUsers,
    connectUser,
    disconnectUser,
    togglePrimary,
    toggleAlarm,
    closeUserManagement
  } = useCarUserManager();
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

  // #region 차량-세대 연결 해제 감지 및 관리모드 자동 해제
  useEffect(() => {
    // 관리모드가 활성화되어 있고 선택된 차량이 있는 경우에만 체크
    if (userManagementMode && selectedCarInstanceId && instance?.carInstance) {
      // 현재 선택된 차량이 세대의 차량 목록에 여전히 존재하는지 확인
      const selectedCarExists = instance.carInstance.some(
        carInstance => carInstance.id === selectedCarInstanceId
      );

      // 선택된 차량이 더 이상 존재하지 않으면 관리모드 해제
      if (!selectedCarExists) {

        closeUserManagement();
        toast.info('관리 중이던 차량이 세대에서 제거되어 관리모드가 해제되었습니다.');
      }
    }
  }, [instance?.carInstance, userManagementMode, selectedCarInstanceId, closeUserManagement]);
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
        instanceType: formData.instanceType as ENUM_InstanceType,
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
        console.error('세대 정보 수정 실패:', '대상 작업에 실패했습니다.');
        setModalMessage('세대 정보 수정에 실패했습니다.');
      }
    } catch (error) {
      console.error('세대 정보 수정 중 오류:', error);
      setModalMessage('세대 정보 수정 중 오류가 발생했습니다.');
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
        console.error('세대 삭제 실패:', '대상 작업에 실패했습니다.');
        setModalMessage('세대 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('세대 삭제 중 오류:', error);
      setModalMessage('세대 삭제 중 오류가 발생했습니다.');
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
  const handleManageUsersClick = async (carInstanceId: number) => {
    if (!instance || !instance.carInstance) return;

    // 선택된 차량의 ID를 찾기
    const carInstance = instance.carInstance.find(ci => ci.id === carInstanceId);
    if (!carInstance?.car) return;

    await handleManageUsers(
      carInstanceId,
      instance.carInstance,
      () => loadCarUsersWithDetails(carInstance.car!.id, instance.id)
    );
  };

  // 사용자 연결 관련 핸들러
  const handleConnectUser = async (userId: number) => {
    if (!selectedCarInstanceId || !instance) return;
    
    try {
      const result = await connectUser(selectedCarInstanceId, userId);
      if (result.success) {
        toast.success('사용자가 성공적으로 연결되었습니다.');
        
        // 연결모드 유지하면서 차량-사용자 데이터만 새로고침
        const carInstance = instance.carInstance?.find(ci => ci.id === selectedCarInstanceId);
        if (carInstance?.car) {
          await refreshCarUsers(
            () => loadCarUsersWithDetails(carInstance.car!.id, instance.id)
          );
        }
      } else {
        setModalMessage('사용자 연결에 실패했습니다.');
      }
    } catch (error) {
      console.error('사용자 연결 중 오류:', error);
      setModalMessage('사용자 연결 중 오류가 발생했습니다.');
    }
  };

  const handleDisconnectUser = async (userId: number) => {
    try {
      const result = await disconnectUser(userId);
      if (result.success) {
        toast.success('사용자 연결이 성공적으로 해제되었습니다.');
        
        // 연결모드 유지하면서 차량-사용자 데이터만 새로고침
        if (selectedCarInstanceId && instance) {
          const carInstance = instance.carInstance?.find(ci => ci.id === selectedCarInstanceId);
          if (carInstance?.car) {
            await refreshCarUsers(
              () => loadCarUsersWithDetails(carInstance.car!.id, instance.id)
            );
          }
        }
      } else {
        setModalMessage('사용자 연결 해제에 실패했습니다.');
      }
    } catch (error) {
      console.error('사용자 연결 해제 중 오류:', error);
      setModalMessage('사용자 연결 해제 중 오류가 발생했습니다.');
    }
  };

  const handleTogglePrimary = async (userId: number) => {
    try {
      const result = await togglePrimary(userId);
      if (result.success) {
        toast.success('차량 소유자 설정이 성공적으로 변경되었습니다.');
        // 소유자 설정은 이미 useCarUserManager에서 로컬 상태 업데이트됨
      } else {
        setModalMessage('차량 소유자 설정 변경에 실패했습니다.');
      }
    } catch (error) {
      console.error('차량 소유자 설정 변경 중 오류:', error);
      setModalMessage('차량 소유자 설정 변경 중 오류가 발생했습니다.');
    }
  };

  const handleToggleAlarm = async (userId: number) => {
    try {
      const result = await toggleAlarm(userId);
      if (result.success) {
        toast.success('알람 설정이 성공적으로 변경되었습니다.');
        // 알람 설정은 이미 useCarUserManager에서 로컬 상태 업데이트됨
      } else {
        setModalMessage('알람 설정 변경에 실패했습니다.');
      }
    } catch (error) {
      console.error('알람 설정 변경 중 오류:', error);
      setModalMessage('알람 설정 변경 중 오류가 발생했습니다.');
    }
  };

  // 연결 상태 확인 헬퍼
  const isUserConnectedToSelectedCar = (userId: number) => {
    return carUsers.some(cr => cr.id === userId);
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
              
              // 차량-사용자 관리 관련
              userManagementMode={userManagementMode}
              selectedCarInstanceId={selectedCarInstanceId}
              carUsers={carUsers}
              loadingCarUsers={loadingCarUsers}
              onConnectUser={handleConnectUser}
              onDisconnectUser={handleDisconnectUser}
              onTogglePrimary={handleTogglePrimary}
              onToggleAlarm={handleToggleAlarm}
              
              // 데이터 새로고침
              onDataChange={handleDataChange}
              onManageUsers={handleManageUsersClick}
              
              // 연결 상태 확인 헬퍼
              isUserConnectedToSelectedCar={isUserConnectedToSelectedCar}
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