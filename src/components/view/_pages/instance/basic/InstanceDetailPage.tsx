/* 메뉴 설명: 인스턴스 상세 페이지 */
'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { Button } from '@/components/ui/ui-input/button/Button';
import Modal from '@/components/ui/ui-layout/modal/Modal';
import DetailPageLayout from '@/components/ui/ui-layout/detail-page-layout/DetailPageLayout';
import InstanceForm, { InstanceFormData } from './InstanceForm';
import InstanceResidentList from './InstanceResidentList';
import InstanceCarList from './InstanceCarList';
import { getInstanceDetail } from '@/services/instances/instances@id_GET';
import { updateInstance } from '@/services/instances/instances@id_PUT';
import { deleteInstance } from '@/services/instances/instances@id_DELETE';
import { getCarResidents } from '@/services/cars/cars@carId_residents_GET';
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

  // 거주민 관리 상태
  const [residentManagementMode, setResidentManagementMode] = useState(false);
  const [selectedCarInstanceId, setSelectedCarInstanceId] = useState<number | null>(null);
  const [selectedCarNumber, setSelectedCarNumber] = useState<string>('');
  const [carResidents, setCarResidents] = useState<CarResidentWithDetails[]>([]);
  const [loadingCarResidents, setLoadingCarResidents] = useState(false);
  // #endregion

  // #region 탭 설정
  const tabs = createInstanceTabs(instanceId);
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

  // 거주민 관리 핸들러들
  const handleManageResidents = useCallback(async (carInstanceId: number, carNumber: string) => {
    if (!instance) return;
    
    setSelectedCarInstanceId(carInstanceId);
    setSelectedCarNumber(carNumber);
    setResidentManagementMode(true);
    
    // 해당 차량에 연결된 거주민들을 가져오기
    setLoadingCarResidents(true);
    try {
      // carInstance에서 carId 찾기
      const carInstance = instance.carInstance?.find(ci => ci.id === carInstanceId);
      if (carInstance) {
        const result = await getCarResidents(carInstance.carId);
        if (result.success && result.data) {
          setCarResidents(result.data);
        }
      }
    } catch (error) {
      console.error('차량 거주민 조회 중 오류:', error);
    } finally {
      setLoadingCarResidents(false);
    }
  }, [instance]);

  // 거주민 연결 추가
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
        setModalMessage('거주민이 차량에 성공적으로 연결되었습니다.');
        setSuccessModalOpen(true);
        
        // 데이터 새로고침
        await loadInstanceData();
        
        // 차량 거주민 목록도 새로고침
        if (instance) {
          const carInstance = instance.carInstance?.find(ci => ci.id === selectedCarInstanceId);
          if (carInstance) {
            const refreshResult = await getCarResidents(carInstance.carId);
            if (refreshResult.success && refreshResult.data) {
              setCarResidents(refreshResult.data);
            }
          }
        }
      } else {
        setModalMessage(`거주민 연결에 실패했습니다: ${result.errorMsg}`);
        setErrorModalOpen(true);
      }
    } catch (error) {
      console.error('거주민 연결 중 오류:', error);
      setModalMessage('거주민 연결 중 오류가 발생했습니다.');
      setErrorModalOpen(true);
    }
  }, [selectedCarInstanceId, instance, loadInstanceData]);

  // 거주민 연결 해지
  const handleDisconnectResident = useCallback(async (residentId: number) => {
    try {
      // carResidents에서 해당 거주민의 carInstanceResidentId 찾기
      const carResident = carResidents.find(cr => cr.resident.id === residentId);
      if (!carResident) {
        setModalMessage('해당 거주민의 연결 정보를 찾을 수 없습니다.');
        setErrorModalOpen(true);
        return;
      }

      const result = await deleteCarInstanceResident(carResident.id);
      
      if (result.success) {
        setModalMessage('거주민과 차량의 연결이 성공적으로 해지되었습니다.');
        setSuccessModalOpen(true);
        
        // 데이터 새로고침
        await loadInstanceData();
        
        // 차량 거주민 목록도 새로고침
        if (instance && selectedCarInstanceId) {
          const carInstance = instance.carInstance?.find(ci => ci.id === selectedCarInstanceId);
          if (carInstance) {
            const refreshResult = await getCarResidents(carInstance.carId);
            if (refreshResult.success && refreshResult.data) {
              setCarResidents(refreshResult.data);
            }
          }
        }
      } else {
        setModalMessage(`연결 해지에 실패했습니다: ${result.errorMsg}`);
        setErrorModalOpen(true);
      }
    } catch (error) {
      console.error('연결 해지 중 오류:', error);
      setModalMessage('연결 해지 중 오류가 발생했습니다.');
      setErrorModalOpen(true);
    }
  }, [carResidents, instance, selectedCarInstanceId, loadInstanceData]);

  // 주차량 설정 토글
  const handleTogglePrimary = useCallback(async (residentId: number) => {
    try {
      // carResidents에서 해당 거주민의 carInstanceResidentId와 현재 설정 찾기
      const carResident = carResidents.find(cr => cr.resident.id === residentId);
      if (!carResident) {
        setModalMessage('해당 거주민의 연결 정보를 찾을 수 없습니다.');
        setErrorModalOpen(true);
        return;
      }

      // 주차량 설정 토글
      const updateResult = await updateCarInstanceResident(carResident.id, {
        carAlarm: carResident.carAlarm, // 기존 알람 설정 유지
        isPrimary: !carResident.isPrimary // 주차량 설정 토글
      });
      
      if (updateResult.success) {
        setModalMessage(`주차량 설정이 ${!carResident.isPrimary ? '활성화' : '비활성화'}되었습니다.`);
        setSuccessModalOpen(true);
        
        // 데이터 새로고침
        await loadInstanceData();
        
        // 차량 거주민 목록도 새로고침
        if (instance && selectedCarInstanceId) {
          const carInstance = instance.carInstance?.find(ci => ci.id === selectedCarInstanceId);
          if (carInstance) {
            const refreshResult = await getCarResidents(carInstance.carId);
            if (refreshResult.success && refreshResult.data) {
              setCarResidents(refreshResult.data);
            }
          }
        }
      } else {
        setModalMessage(`주차량 설정 변경에 실패했습니다: ${updateResult.errorMsg}`);
        setErrorModalOpen(true);
      }
    } catch (error) {
      console.error('주차량 설정 변경 중 오류:', error);
      setModalMessage('주차량 설정 변경 중 오류가 발생했습니다.');
      setErrorModalOpen(true);
    }
  }, [carResidents, instance, selectedCarInstanceId, loadInstanceData]);

  // 알람 설정 토글
  const handleToggleAlarm = useCallback(async (residentId: number) => {
    try {
      // carResidents에서 해당 거주민의 carInstanceResidentId와 현재 설정 찾기
      const carResident = carResidents.find(cr => cr.resident.id === residentId);
      if (!carResident) {
        setModalMessage('해당 거주민의 연결 정보를 찾을 수 없습니다.');
        setErrorModalOpen(true);
        return;
      }

      // 알람 설정 토글
      const updateResult = await updateCarInstanceResident(carResident.id, {
        carAlarm: !carResident.carAlarm, // 알람 설정 토글
        isPrimary: carResident.isPrimary // 기존 주차량 설정 유지
      });
      
      if (updateResult.success) {
        setModalMessage(`알람 설정이 ${!carResident.carAlarm ? '활성화' : '비활성화'}되었습니다.`);
        setSuccessModalOpen(true);
        
        // 데이터 새로고침
        await loadInstanceData();
        
        // 차량 거주민 목록도 새로고침
        if (instance && selectedCarInstanceId) {
          const carInstance = instance.carInstance?.find(ci => ci.id === selectedCarInstanceId);
          if (carInstance) {
            const refreshResult = await getCarResidents(carInstance.carId);
            if (refreshResult.success && refreshResult.data) {
              setCarResidents(refreshResult.data);
            }
          }
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
  }, [carResidents, instance, selectedCarInstanceId, loadInstanceData]);

  const handleCloseResidentManagement = useCallback(() => {
    setResidentManagementMode(false);
    setSelectedCarInstanceId(null);
    setSelectedCarNumber('');
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
    <DetailPageLayout
      title="세대 상세 정보"
      subtitle={`${instance.name} - ${instance.address1Depth} ${instance.address2Depth} ${instance.address3Depth || ''}`}
      tabs={tabs}
      activeTabId="basic"
      fallbackPath="/parking/occupancy/instance"
      hasChanges={hasChanges}
    >
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
        
        {/* 연결된 거주민 | 차량 목록 */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <InstanceResidentList 
            residentInstances={instance.residentInstance}
            loading={loading}
            instanceId={instance.id}
            onDataChange={loadInstanceData}
            residentManagementMode={residentManagementMode}
            selectedCarNumber={selectedCarNumber}
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
          />
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
    </DetailPageLayout>
  );
}
