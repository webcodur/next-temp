/* 메뉴 설명: 인스턴스 상세 페이지 */
'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';

import { Button } from '@/components/ui/ui-input/button/Button';
import PageHeader from '@/components/ui/ui-layout/page-header/PageHeader';
import Modal from '@/components/ui/ui-layout/modal/Modal';
import Tabs from '@/components/ui/ui-layout/tabs/Tabs';
import InstanceForm, { InstanceFormData } from './InstanceForm';
import InstanceServiceConfigSection from './InstanceServiceConfigSection';
import InstanceVisitConfigSection from './InstanceVisitConfigSection';
import { getInstanceDetail } from '@/services/instances/instances@id_GET';
import { updateInstance } from '@/services/instances/instances@id_PUT';
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
    address1Depth: '',
    address2Depth: '',
    address3Depth: '',
    instanceType: '',
    password: '',
    memo: '',
  });
  const [originalData, setOriginalData] = useState<InstanceFormData>({
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
  // #endregion

  // #region 탭 설정
  const tabs = [
    {
      id: 'basic',
      label: '기본 정보',
      title: '호실 기본 정보',
      subtitle: '호실의 기본 설정을 관리합니다.',
    },
    {
      id: 'service',
      label: '서비스 설정',
      title: '서비스 설정',
      subtitle: '호실의 서비스 관련 설정을 관리합니다.',
    },
    {
      id: 'visit',
      label: '방문 설정',
      title: '방문 설정',
      subtitle: '호실의 방문 관련 설정을 관리합니다.',
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
      formData.address1Depth.trim() && 
      formData.address2Depth.trim() && 
      formData.instanceType && 
      formData.password.trim()
    );
  }, [formData, hasChanges]);
  // #endregion

  // #region 핸들러
  const handleBack = () => {
    if (hasChanges) {
      const confirmMessage = '수정된 내용이 있습니다. 정말로 나가시겠습니까?';
      if (!confirm(confirmMessage)) return;
    }
    router.push('/parking/occupancy/instance');
  };

  const handleFormChange = useCallback((data: InstanceFormData) => {
    setFormData(data);
  }, []);

  const handleReset = useCallback(() => {
    if (!hasChanges) return;
    
    const confirmMessage = '수정된 내용을 모두 되돌리시겠습니까?';
    if (!confirm(confirmMessage)) return;
    
    setFormData(originalData);
  }, [hasChanges, originalData]);

  const handleSubmit = useCallback(async () => {
    if (!instance || !isValid || isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      const updateData: {
        address1Depth?: string;
        address2Depth?: string;
        address3Depth?: string;
        instanceType?: InstanceType;
        password?: string;
        memo?: string;
      } = {};
      
      // 변경된 필드만 포함
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
            title="목록으로"
          >
            <ArrowLeft size={16} />
            목록
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
            <InstanceForm
              mode="edit"
              instance={instance}
              data={formData}
              onChange={handleFormChange}
              disabled={isSubmitting}
              showActions={true}
              onReset={handleReset}
              onSubmit={handleSubmit}
              hasChanges={hasChanges}
              isValid={isValid}
            />
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
