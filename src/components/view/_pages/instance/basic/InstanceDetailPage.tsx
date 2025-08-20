/* 메뉴 설명: 인스턴스 상세 페이지 */
'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/ui-input/button/Button';
import Modal from '@/components/ui/ui-layout/modal/Modal';
import PageHeader from '@/components/ui/ui-layout/page-header/PageHeader';
import Tabs from '@/components/ui/ui-layout/tabs/Tabs';
import InstanceForm, { InstanceFormData } from './InstanceForm';
import InstanceResidentList from './InstanceResidentList';
import InstanceCarList from './InstanceCarList';
import InstanceServiceConfigSection from '../service/InstanceServiceConfigSection';
import InstanceVisitConfigSection from '../visit/InstanceVisitConfigSection';
import { getInstanceDetail } from '@/services/instances/instances@id_GET';
import { updateInstance } from '@/services/instances/instances@id_PUT';
import { deleteInstance } from '@/services/instances/instances@id_DELETE';
import { getCarResidents } from '@/services/cars/cars@carId_residents_GET';
import { getCarInstanceResidentDetail } from '@/services/cars/cars_residents@id_GET';
import { createCarInstanceResident } from '@/services/cars/cars_residents_POST';
import { deleteCarInstanceResident } from '@/services/cars/cars_residents@id_DELETE';
import { updateCarInstanceResident } from '@/services/cars/cars_residents@id_PATCH';
import { InstanceDetail, InstanceType } from '@/types/instance';
import { CarResidentWithDetails } from '@/types/car';
import { createInstanceTabs } from '../_shared/instanceTabs';

export default function InstanceDetailPage() {  
  const router = useRouter();
  const params = useParams();
  const instanceId = Number(params.id);
  
  // #region 상태 관리
  const [instance, setInstance] = useState<InstanceDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 탭 상태 관리
  const [activeTab, setActiveTab] = useState('basic');
  
  const [formData, setFormData] = useState<InstanceFormData>({
    name: '',
    ownerName: '',
    address1Depth: '',
    address2Depth: '',
    address3Depth: '',
    instanceType: '',
    password: '',
    memo: '',
  });
  const [originalData, setOriginalData] = useState<InstanceFormData>({
    name: '',
    ownerName: '',
    address1Depth: '',
    address2Depth: '',
    address3Depth: '',
    instanceType: '',
    password: '',
    memo: '',
  });
  
  // 모달 상태
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  
  // 차량 소유자 전환 확인 Modal 상태
  const [primaryCarTransferModal, setPrimaryCarTransferModal] = useState<{
    isOpen: boolean;
    currentPrimaryResident: CarResidentWithDetails | null;
    newPrimaryResidentId: number | null;
    newPrimaryResidentName: string;
  }>({
    isOpen: false,
    currentPrimaryResident: null,
    newPrimaryResidentId: null,
    newPrimaryResidentName: ''
  });

  // 주민 관리 상태
  const [residentManagementMode, setResidentManagementMode] = useState(false);
  const [selectedCarInstanceId, setSelectedCarInstanceId] = useState<number | null>(null);

  const [carResidents, setCarResidents] = useState<CarResidentWithDetails[]>([]);
  const [loadingCarResidents, setLoadingCarResidents] = useState(false);
  // #endregion

  // #region 탭 설정
  const tabs = createInstanceTabs();
  // #endregion

  // #region 데이터 로드
  const loadInstanceData = useCallback(async () => {
    if (!instanceId || isNaN(instanceId)) {
      return;
    }
    
    setLoading(true);
    try {
      const result = await getInstanceDetail(instanceId);
      
      if (result.success && result.data) {
        setInstance(result.data);
        
        const initialData = {
          name: result.data.name,
          ownerName: result.data.ownerName || '',
          address1Depth: result.data.address1Depth,
          address2Depth: result.data.address2Depth,
          address3Depth: result.data.address3Depth || '',
          instanceType: result.data.instanceType,
          password: result.data.password,
          memo: result.data.memo || '',
        };
        setFormData(initialData);
        setOriginalData(initialData);
      } else {
        console.error('인스턴스 조회 실패:', result.errorMsg);
        setModalMessage(`세대 정보를 불러올 수 없습니다: ${result.errorMsg}`);
        setErrorModalOpen(true);
        setTimeout(() => {
          router.push('/parking/occupancy/instance');
        }, 2000);
      }
    } catch (error) {
      console.error('인스턴스 조회 중 오류:', error);
      setModalMessage('세대 정보를 불러오는 중 오류가 발생했습니다.');
      setErrorModalOpen(true);
      setTimeout(() => {
        router.push('/parking/occupancy/instance');
      }, 2000);
    } finally {
      setLoading(false);
    }
  }, [instanceId, router]);

  useEffect(() => {
    loadInstanceData();
  }, [loadInstanceData]);

  // 차량-주민 데이터 로딩 (실제 설정값 포함)
  const loadCarResidentsWithDetails = useCallback(async (carId: number) => {
    try {
      // 1단계: 기본 주민 목록 조회
      const basicResult = await getCarResidents(carId);
      if (!basicResult.success || !basicResult.data) {
        return [];
      }

      // 2단계: 각 주민의 실제 설정값 조회
      const detailedResidents = await Promise.all(
        basicResult.data.map(async (resident) => {
          try {
            const detailResult = await getCarInstanceResidentDetail(resident.carInstanceResidentId);
            if (detailResult.success && detailResult.data) {
              return {
                ...resident,
                isPrimary: detailResult.data.isPrimary,
                carAlarm: detailResult.data.carAlarm
              };
            }
          } catch (error) {
            console.error(`주민 ${resident.name} 상세 정보 조회 중 오류:`, error);
          }
          return resident; // 실패시 기본값 유지
        })
      );

      return detailedResidents;
    } catch (error) {
      console.error('차량-주민 데이터 로딩 중 오류:', error);
      return [];
    }
  }, []);

  // 주민 관리 모드용 차량-주민 데이터 새로고침
  const refreshCarResidentsForManagement = useCallback(async () => {
    if (!residentManagementMode || !selectedCarInstanceId) return;
    
    try {
      const currentInstance = await getInstanceDetail(instanceId);
      if (currentInstance.success && currentInstance.data) {
        const carInstance = currentInstance.data.carInstance?.find(ci => ci.id === selectedCarInstanceId);
        if (carInstance) {
          const detailedResidents = await loadCarResidentsWithDetails(carInstance.carId);
          setCarResidents(detailedResidents);
        }
      }
    } catch (error) {
      console.error('차량-주민 데이터 새로고침 중 오류:', error);
    }
  }, [instanceId, residentManagementMode, selectedCarInstanceId, loadCarResidentsWithDetails]);
  // #endregion

  // #region 변경 감지
  const hasChanges = useMemo(() => {
    return (
      formData.name !== originalData.name ||
      formData.ownerName !== originalData.ownerName ||
      formData.address1Depth !== originalData.address1Depth ||
      formData.address2Depth !== originalData.address2Depth ||
      formData.address3Depth !== originalData.address3Depth ||
      formData.instanceType !== originalData.instanceType ||
      formData.password !== originalData.password ||
      formData.memo !== originalData.memo
    );
  }, [formData, originalData]);

  const isValid = useMemo(() => {
    if (!hasChanges) return false;
    
    return Boolean(
      formData.name.trim() &&
      formData.address1Depth.trim() && 
      formData.address2Depth.trim() && 
      formData.instanceType && 
      formData.password.trim()
    );
  }, [formData, hasChanges]);
  // #endregion

  // #region 핸들러
  const handleFormChange = useCallback((data: InstanceFormData) => {
    setFormData(data);
  }, []);

  const handleReset = useCallback(() => {
    if (!hasChanges) return;
    
    setFormData(originalData);
  }, [hasChanges, originalData]);

  const handleSubmit = useCallback(async () => {
    if (!instance || !isValid || isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      const updateData: {
        name?: string;
        ownerName?: string;
        address1Depth?: string;
        address2Depth?: string;
        address3Depth?: string;
        instanceType?: InstanceType;
        password?: string;
        memo?: string;
      } = {};
      
      // 변경된 필드만 포함
      if (formData.name !== originalData.name) updateData.name = formData.name;
      if (formData.ownerName !== originalData.ownerName) updateData.ownerName = formData.ownerName;
      if (formData.address1Depth !== originalData.address1Depth) updateData.address1Depth = formData.address1Depth;
      if (formData.address2Depth !== originalData.address2Depth) updateData.address2Depth = formData.address2Depth;
      if (formData.address3Depth !== originalData.address3Depth) updateData.address3Depth = formData.address3Depth;
      if (formData.instanceType !== originalData.instanceType) updateData.instanceType = formData.instanceType as InstanceType;
      if (formData.password !== originalData.password) updateData.password = formData.password;
      if (formData.memo !== originalData.memo) updateData.memo = formData.memo;

      const result = await updateInstance(instance.id, updateData);

      if (result.success) {
        // 성공 시 원본 데이터 업데이트
        const newData = { ...formData };
        setOriginalData(newData);
        setFormData(newData);
        
        // 데이터 다시 로드
        await loadInstanceData();
        
        setModalMessage('세대 정보가 성공적으로 수정되었습니다.');
        setSuccessModalOpen(true);
      } else {
        console.error('인스턴스 수정 실패:', result.errorMsg);
        setModalMessage(`세대 수정에 실패했습니다: ${result.errorMsg}`);
        setErrorModalOpen(true);
      }
    } catch (error) {
      console.error('인스턴스 수정 중 오류:', error);
      setModalMessage('세대 수정 중 오류가 발생했습니다.');
      setErrorModalOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  }, [instance, isValid, isSubmitting, formData, originalData, loadInstanceData]);

  const handleDelete = useCallback(() => {
    setDeleteConfirmOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!instance) return;
    try {
      const result = await deleteInstance(instance.id);
      if (result.success) {
        setModalMessage('세대이 성공적으로 삭제되었습니다.');
        setSuccessModalOpen(true);
        setTimeout(() => {
          router.push('/parking/occupancy/instance');
        }, 1500);
      } else {
        setModalMessage(`세대 삭제에 실패했습니다: ${result.errorMsg}`);
        setErrorModalOpen(true);
      }
    } catch (error) {
      console.error('세대 삭제 중 오류:', error);
      setModalMessage('세대 삭제 중 오류가 발생했습니다.');
      setErrorModalOpen(true);
    } finally {
      setDeleteConfirmOpen(false);
    }
  }, [instance, router]);

  // 주민 관리 핸들러들
  const handleManageResidents = useCallback(async (carInstanceId: number) => {
    if (!instance) return;
    
    // 이미 같은 차량의 관리 모드가 활성화된 경우 종료
    if (residentManagementMode && selectedCarInstanceId === carInstanceId) {
      setResidentManagementMode(false);
      setSelectedCarInstanceId(null);
      setCarResidents([]);
      return;
    }
    
    setSelectedCarInstanceId(carInstanceId);
    setResidentManagementMode(true);
    
    // 해당 차량에 연결된 주민들을 가져오기
    setLoadingCarResidents(true);
    try {
      const carInstance = instance.carInstance?.find(ci => ci.id === carInstanceId);
      if (carInstance) {
        const detailedResidents = await loadCarResidentsWithDetails(carInstance.carId);
        setCarResidents(detailedResidents);
      }
    } catch (error) {
      console.error('차량 주민 조회 중 오류:', error);
    } finally {
      setLoadingCarResidents(false);
    }
  }, [instance, loadCarResidentsWithDetails, residentManagementMode, selectedCarInstanceId]);

  // 주민 연결 추가
  const handleConnectResident = useCallback(async (residentId: number) => {
    if (!selectedCarInstanceId) return;
    
    try {
      const result = await createCarInstanceResident({
        carInstanceId: selectedCarInstanceId,
        residentId,
        carAlarm: false, // 기본값
        isPrimary: false // 기본값
      });
      
      if (result.success) {
        setModalMessage('주민이 차량에 성공적으로 연결되었습니다.');
        setSuccessModalOpen(true);
        
        // 연결 작업 후 데이터 새로고침
        await loadInstanceData();
        
        // 연결 작업 후 차량-주민 데이터 새로고침
        await refreshCarResidentsForManagement();
      } else {
        setModalMessage(`주민 연결에 실패했습니다: ${result.errorMsg}`);
        setErrorModalOpen(true);
      }
    } catch (error) {
      console.error('주민 연결 중 오류:', error);
      setModalMessage('주민 연결 중 오류가 발생했습니다.');
      setErrorModalOpen(true);
    }
  }, [selectedCarInstanceId, loadInstanceData, refreshCarResidentsForManagement]);

  // 주민 연결 해지
  const handleDisconnectResident = useCallback(async (residentId: number) => {
    try {
      // carResidents에서 해당 주민의 carInstanceResidentId 찾기
      const carResident = carResidents.find(cr => cr.id === residentId);
      if (!carResident) {
        setModalMessage('해당 주민의 연결 정보를 찾을 수 없습니다.');
        setErrorModalOpen(true);
        return;
      }

      const result = await deleteCarInstanceResident(carResident.carInstanceResidentId);
      
      if (result.success) {
        setModalMessage('주민과 차량의 연결이 성공적으로 해지되었습니다.');
        setSuccessModalOpen(true);
        
        // 연결 해지 작업 후 데이터 새로고침
        await loadInstanceData();
        
        // 해지 작업 후 차량-주민 데이터 새로고침
        await refreshCarResidentsForManagement();
      } else {
        setModalMessage(`연결 해지에 실패했습니다: ${result.errorMsg}`);
        setErrorModalOpen(true);
      }
    } catch (error) {
      console.error('연결 해지 중 오류:', error);
      setModalMessage('연결 해지 중 오류가 발생했습니다.');
      setErrorModalOpen(true);
    }
  }, [carResidents, loadInstanceData, refreshCarResidentsForManagement]);

  // 실제 차량 소유자 설정 변경을 수행하는 함수
  const performPrimaryCarToggle = useCallback(async (
    residentId: number, 
    carResident: CarResidentWithDetails, 
    newPrimaryState: boolean
  ) => {
    const updateResult = await updateCarInstanceResident(carResident.carInstanceResidentId, {
      carAlarm: carResident.carAlarm || false,
      isPrimary: newPrimaryState
    });
    
    if (updateResult.success) {
      setModalMessage(`차량 소유자 설정이 ${newPrimaryState ? '활성화' : '비활성화'}되었습니다.`);
      setSuccessModalOpen(true);
      
      // 즉시 로컬 상태 업데이트 (낙관적 UI)
      if (updateResult.data) {
        const updatedCarResidents = carResidents.map(cr => {
          if (cr.id === residentId) {
            return {
              ...cr,
              isPrimary: updateResult.data.isPrimary,
              carAlarm: updateResult.data.carAlarm
            };
          }
          return cr;
        });
        setCarResidents(updatedCarResidents);
      }
    } else {
      setModalMessage(`차량 소유자 설정 변경에 실패했습니다: ${updateResult.errorMsg}`);
      setErrorModalOpen(true);
    }
  }, [carResidents]);

  // 차량 소유자 설정 토글
  const handleTogglePrimary = useCallback(async (residentId: number) => {
    try {
      const carResident = carResidents.find(cr => cr.id === residentId);
      
      if (!carResident) {
        setModalMessage('해당 주민의 연결 정보를 찾을 수 없습니다.');
        setErrorModalOpen(true);
        return;
      }

      const currentPrimaryState = Boolean(carResident.isPrimary);
      const newPrimaryState = !currentPrimaryState;
      
      // 차량 소유자 활성화를 시도하는 경우, 기존 차량 소유자 사용자가 있는지 확인
      if (newPrimaryState) {
        const existingPrimaryResident = carResidents.find(cr => 
          cr.id !== residentId && Boolean(cr.isPrimary)
        );
        
        if (existingPrimaryResident) {
          // 기존 차량 소유자 사용자가 있으면 전환 확인 Modal 표시
          setPrimaryCarTransferModal({
            isOpen: true,
            currentPrimaryResident: existingPrimaryResident,
            newPrimaryResidentId: residentId,
            newPrimaryResidentName: carResident.name || '알 수 없는 주민'
          });
          return;
        }
      }
      
      // 기존 차량 소유자 사용자가 없거나 비활성화하는 경우 바로 진행
      await performPrimaryCarToggle(residentId, carResident, newPrimaryState);
    } catch (error) {
      console.error('차량 소유자 설정 변경 중 오류:', error);
      setModalMessage('차량 소유자 설정 변경 중 오류가 발생했습니다.');
      setErrorModalOpen(true);
    }
  }, [carResidents, performPrimaryCarToggle]);

  // 차량 소유자 전환 확인 처리
  const handleConfirmPrimaryCarTransfer = useCallback(async () => {
    try {
      const { currentPrimaryResident, newPrimaryResidentId } = primaryCarTransferModal;
      
      if (!currentPrimaryResident || !newPrimaryResidentId) {
        setModalMessage('전환할 주민 정보를 찾을 수 없습니다.');
        setErrorModalOpen(true);
        return;
      }

      const newPrimaryResident = carResidents.find(cr => cr.id === newPrimaryResidentId);
      if (!newPrimaryResident) {
        setModalMessage('새로운 차량 소유자 사용자 정보를 찾을 수 없습니다.');
        setErrorModalOpen(true);
        return;
      }

      // 1단계: 기존 차량 소유자 사용자 비활성화
      const deactivateResult = await updateCarInstanceResident(
        currentPrimaryResident.carInstanceResidentId, 
        {
          carAlarm: currentPrimaryResident.carAlarm || false,
          isPrimary: false
        }
      );

      if (!deactivateResult.success) {
        setModalMessage(`기존 차량 소유자 해제에 실패했습니다: ${deactivateResult.errorMsg}`);
        setErrorModalOpen(true);
        return;
      }

      // 2단계: 새로운 차량 소유자 사용자 활성화
      const activateResult = await updateCarInstanceResident(
        newPrimaryResident.carInstanceResidentId, 
        {
          carAlarm: newPrimaryResident.carAlarm || false,
          isPrimary: true
        }
      );

      if (!activateResult.success) {
        setModalMessage(`새로운 차량 소유자 설정에 실패했습니다: ${activateResult.errorMsg}`);
        setErrorModalOpen(true);
        return;
      }

      // 성공적으로 전환 완료
      setModalMessage(`차량 소유자이 ${newPrimaryResident.name}님으로 전환되었습니다.`);
      setSuccessModalOpen(true);

      // 로컬 상태 업데이트
      const updatedCarResidents = carResidents.map(cr => {
        if (cr.id === currentPrimaryResident.id) {
          return { ...cr, isPrimary: false };
        } else if (cr.id === newPrimaryResidentId) {
          return { ...cr, isPrimary: true };
        }
        return cr;
      });
      setCarResidents(updatedCarResidents);

      // Modal 닫기
      setPrimaryCarTransferModal({
        isOpen: false,
        currentPrimaryResident: null,
        newPrimaryResidentId: null,
        newPrimaryResidentName: ''
      });

    } catch (error) {
      console.error('차량 소유자 전환 중 오류:', error);
      setModalMessage('차량 소유자 전환 중 오류가 발생했습니다.');
      setErrorModalOpen(true);
    }
  }, [primaryCarTransferModal, carResidents]);

  // 차량 소유자 전환 취소
  const handleCancelPrimaryCarTransfer = useCallback(() => {
    setPrimaryCarTransferModal({
      isOpen: false,
      currentPrimaryResident: null,
      newPrimaryResidentId: null,
      newPrimaryResidentName: ''
    });
  }, []);

  // 알람 설정 토글
  const handleToggleAlarm = useCallback(async (residentId: number) => {
    try {
      const carResident = carResidents.find(cr => cr.id === residentId);
      
      if (!carResident) {
        setModalMessage('해당 주민의 연결 정보를 찾을 수 없습니다.');
        setErrorModalOpen(true);
        return;
      }

      // 현재 상태와 새로운 상태 계산
      const currentAlarmState = Boolean(carResident.carAlarm);
      const newAlarmState = !currentAlarmState;
      
      // 알람 설정 토글
      const updateResult = await updateCarInstanceResident(carResident.carInstanceResidentId, {
        carAlarm: newAlarmState,
        isPrimary: carResident.isPrimary || false // 기존 차량 소유자 설정 유지 (기본값 false)
      });
      
      if (updateResult.success) {
        setModalMessage(`알람 설정이 ${newAlarmState ? '활성화' : '비활성화'}되었습니다.`);
        setSuccessModalOpen(true);
        
        // 즉시 로컬 상태 업데이트 (낙관적 UI)
        if (updateResult.data) {
          const updatedCarResidents = carResidents.map(cr => {
            if (cr.id === residentId) {
              return {
                ...cr,
                isPrimary: updateResult.data.isPrimary,
                carAlarm: updateResult.data.carAlarm
              };
            }
            return cr;
          });
          setCarResidents(updatedCarResidents);
        }
      } else {
        setModalMessage(`알람 설정 변경에 실패했습니다: ${updateResult.errorMsg}`);
        setErrorModalOpen(true);
      }
    } catch (error) {
      console.error('알람 설정 변경 중 오류:', error);
      setModalMessage('알람 설정 변경 중 오류가 발생했습니다.');
      setErrorModalOpen(true);
    }
  }, [carResidents]);

  const handleCloseResidentManagement = useCallback(() => {
    setResidentManagementMode(false);
    setSelectedCarInstanceId(null);
    setCarResidents([]);
  }, []);
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
            <div className="space-y-6">
              {/* 세대 기본 정보 */}
              <InstanceForm
                mode="edit"
                instance={instance}
                data={formData}
                onChange={handleFormChange}
                disabled={isSubmitting}
                showActions={true}
                onReset={handleReset}
                onSubmit={handleSubmit}
                onDelete={handleDelete}
                hasChanges={hasChanges}
                isValid={isValid}
              />
              
              {/* 연결된 주민 | 차량 목록 */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <InstanceResidentList 
                  residentInstances={instance.residentInstance}
                  loading={loading}
                  instanceId={instance.id}
                  onDataChange={residentManagementMode ? undefined : loadInstanceData} // 주민 관리 모드에서는 자동 새로고침 방지
                  residentManagementMode={residentManagementMode}

                  carResidents={carResidents}
                  loadingCarResidents={loadingCarResidents}
                  onCloseResidentManagement={handleCloseResidentManagement}
                  onConnectResident={handleConnectResident}
                  onDisconnectResident={handleDisconnectResident}
                  onTogglePrimary={handleTogglePrimary}
                  onToggleAlarm={handleToggleAlarm}
                />
                <InstanceCarList 
                  carInstances={instance.carInstance}
                  loading={loading}
                  instanceId={instance.id}
                  onDataChange={loadInstanceData}
                  onManageResidents={handleManageResidents}
                  residentManagementMode={residentManagementMode}
                  managedCarInstanceId={selectedCarInstanceId}
                />
              </div>
            </div>
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

      {/* 성공 모달 */}
      <Modal
        isOpen={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        title="작업 완료"
        size="sm"
      >
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="mb-2 text-lg font-semibold text-green-600">성공</h3>
            <p className="text-muted-foreground">{modalMessage}</p>
          </div>
          
          <div className="flex justify-center pt-4">
            <Button onClick={() => setSuccessModalOpen(false)}>
              확인
            </Button>
          </div>
        </div>
      </Modal>

      {/* 오류 모달 */}
      {/* 삭제 확인 모달 */}
      <Modal
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        title="세대 삭제 확인"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <h3 className="mb-2 text-lg font-semibold">정말로 삭제하시겠습니까?</h3>
            <p className="text-muted-foreground">이 작업은 되돌릴 수 없습니다. 세대 정보가 영구적으로 삭제됩니다.</p>
          </div>
          <div className="flex gap-3 justify-end pt-4">
            <Button variant="ghost" onClick={() => setDeleteConfirmOpen(false)}>취소</Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>삭제</Button>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={errorModalOpen}
        onClose={() => setErrorModalOpen(false)}
        title="오류 발생"
        size="sm"
      >
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="mb-2 text-lg font-semibold text-red-600">오류</h3>
            <p className="text-muted-foreground">{modalMessage}</p>
          </div>
          
          <div className="flex justify-center pt-4">
            <Button onClick={() => setErrorModalOpen(false)}>
              확인
            </Button>
          </div>
        </div>
      </Modal>

      {/* 차량 소유자 전환 확인 Modal */}
      <Modal
        isOpen={primaryCarTransferModal.isOpen}
        onClose={handleCancelPrimaryCarTransfer}
        title="차량 소유자 전환 확인"
        size="md"
      >
        <div className="space-y-4">
          <div className="text-center">
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>현재 <strong className="text-foreground">{primaryCarTransferModal.currentPrimaryResident?.name}님</strong>이 차량 소유자입니다.</p>
              <p><strong className="text-foreground">{primaryCarTransferModal.newPrimaryResidentName}님</strong>으로 차량 소유자을 전환하시겠습니까?</p>
              <div className="p-2 mt-3 text-sm text-orange-800 bg-orange-50 rounded-md border border-orange-200">
                <p>⚠️ 기존 차량 소유자 설정이 해제되고, 새로운 주민에게 적용됩니다.</p>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3 justify-center pt-4">
            <Button 
              variant="outline" 
              onClick={handleCancelPrimaryCarTransfer}
              className="border-gray-300"
            >
              취소
            </Button>
            <Button 
              onClick={handleConfirmPrimaryCarTransfer}
              className="bg-orange-600 hover:bg-orange-700"
            >
              전환하기
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
