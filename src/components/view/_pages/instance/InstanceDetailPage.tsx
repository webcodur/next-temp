/* 메뉴 설명: 인스턴스 상세 페이지 */
'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { useBackNavigation } from '@/hooks/useBackNavigation';

import { Button } from '@/components/ui/ui-input/button/Button';
import PageHeader from '@/components/ui/ui-layout/page-header/PageHeader';
import Modal from '@/components/ui/ui-layout/modal/Modal';
import Tabs from '@/components/ui/ui-layout/tabs/Tabs';
import InstanceForm, { InstanceFormData } from './InstanceForm';
import InstanceServiceConfigSection from './InstanceServiceConfigSection';
import InstanceVisitConfigSection from './InstanceVisitConfigSection';
import InstanceResidentList from './InstanceResidentList';
import InstanceCarList from './InstanceCarList';
import { getInstanceDetail } from '@/services/instances/instances@id_GET';
import { updateInstance } from '@/services/instances/instances@id_PUT';
import { deleteInstance } from '@/services/instances/instances@id_DELETE';
import { InstanceDetail, InstanceType } from '@/types/instance';

export default function InstanceDetailPage() {  
  const router = useRouter();
  const params = useParams();
  const instanceId = Number(params.id);
  
  // #region 상태 관리
  const [instance, setInstance] = useState<InstanceDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  
  const [formData, setFormData] = useState<InstanceFormData>({
    name: '',
    ownerName: '',
    phone: '',
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
    phone: '',
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
  const tabs = [
    {
      id: 'basic',
      label: '기본 정보',
    },
    {
      id: 'service',
      label: '서비스 설정',
    },
    {
      id: 'visit',
      label: '방문 설정',
    },
  ];
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
          phone: result.data.phone,
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
        setModalMessage(`호실 정보를 불러올 수 없습니다: ${result.errorMsg}`);
        setErrorModalOpen(true);
        setTimeout(() => {
          router.push('/parking/occupancy/instance');
        }, 2000);
      }
    } catch (error) {
      console.error('인스턴스 조회 중 오류:', error);
      setModalMessage('호실 정보를 불러오는 중 오류가 발생했습니다.');
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
      formData.phone !== originalData.phone ||
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
      formData.phone.trim() &&
      formData.address1Depth.trim() && 
      formData.address2Depth.trim() && 
      formData.instanceType && 
      formData.password.trim()
    );
  }, [formData, hasChanges]);
  // #endregion

  // #region 핸들러
  const { handleBack } = useBackNavigation({
    fallbackPath: '/parking/occupancy/instance',
    hasChanges
  });

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
        phone?: string;
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
      if (formData.phone !== originalData.phone) updateData.phone = formData.phone;
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
        
        setModalMessage('호실 정보가 성공적으로 수정되었습니다.');
        setSuccessModalOpen(true);
      } else {
        console.error('인스턴스 수정 실패:', result.errorMsg);
        setModalMessage(`호실 수정에 실패했습니다: ${result.errorMsg}`);
        setErrorModalOpen(true);
      }
    } catch (error) {
      console.error('인스턴스 수정 중 오류:', error);
      setModalMessage('호실 수정 중 오류가 발생했습니다.');
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
        setModalMessage('호실이 성공적으로 삭제되었습니다.');
        setSuccessModalOpen(true);
        setTimeout(() => {
          router.push('/parking/occupancy/instance');
        }, 1500);
      } else {
        setModalMessage(`호실 삭제에 실패했습니다: ${result.errorMsg}`);
        setErrorModalOpen(true);
      }
    } catch (error) {
      console.error('호실 삭제 중 오류:', error);
      setModalMessage('호실 삭제 중 오류가 발생했습니다.');
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
        <div className="text-muted-foreground">호실 정보를 찾을 수 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* 헤더 */}
      <PageHeader 
        title="호실 상세 정보"
        subtitle={`${instance.address1Depth} ${instance.address2Depth} ${instance.address3Depth || ''}`}
        leftActions={
          <Button
            variant="secondary"
            size="default"
            onClick={handleBack}
            title="뒤로가기"
          >
            <ArrowLeft size={16} />
            뒤로가기
          </Button>
        }
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
          {activeTab === 'basic' && (
            <div className="space-y-6">
              {/* 호실 기본 정보 */}
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
              
              {/* 거주민 목록 | 차량 목록 */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <InstanceResidentList 
                  residentInstances={instance.residentInstance}
                  loading={loading}
                />
                <InstanceCarList 
                  carInstances={instance.carInstance}
                  loading={loading}
                />
              </div>
              
              {/* 디버깅 정보 - 개발용 */}
              {process.env.NODE_ENV === 'development' && (
                <div className="p-4 mt-6 bg-gray-100 rounded-lg">
                  <h4 className="mb-2 font-semibold">디버깅 정보:</h4>
                  <p>거주민 수: {instance.residentInstance?.length || 0}</p>
                  <p>차량 수: {instance.carInstance?.length || 0}</p>
                  <details className="mt-2">
                    <summary>원본 데이터</summary>
                    <pre className="overflow-auto p-2 mt-2 max-h-40 text-xs bg-white rounded">
                      {JSON.stringify(instance, null, 2)}
                    </pre>
                  </details>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'service' && (
            <InstanceServiceConfigSection 
              instance={instance}
              onDataChange={loadInstanceData}
            />
          )}
          
          {activeTab === 'visit' && (
            <InstanceVisitConfigSection 
              instance={instance}
              onDataChange={loadInstanceData}
            />
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
        title="호실 삭제 확인"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <h3 className="mb-2 text-lg font-semibold">정말로 삭제하시겠습니까?</h3>
            <p className="text-muted-foreground">이 작업은 되돌릴 수 없습니다. 호실 정보가 영구적으로 삭제됩니다.</p>
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
    </div>
  );
}
