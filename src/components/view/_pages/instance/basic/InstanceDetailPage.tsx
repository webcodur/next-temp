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
import { InstanceDetail, InstanceType } from '@/types/instance';
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
          />
          <InstanceCarList 
            carInstances={instance.carInstance}
            loading={loading}
            instanceId={instance.id}
            onDataChange={loadInstanceData}
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
