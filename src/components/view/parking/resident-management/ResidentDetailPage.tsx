/* 메뉴 설명: 거주자 상세 페이지 */
'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';

import { Button } from '@/components/ui/ui-input/button/Button';
import PageHeader from '@/components/ui/ui-layout/page-header/PageHeader';
import Modal from '@/components/ui/ui-layout/modal/Modal';
import Tabs from '@/components/ui/ui-layout/tabs/Tabs';
import ResidentForm, { ResidentFormData } from './ResidentForm';
import ResidentInstanceSection from './ResidentInstanceSection';
import ResidentHistorySection from './ResidentHistorySection';
import { getResidentDetail } from '@/services/residents/residents@id_GET';
import { updateResident } from '@/services/residents/residents@id_PATCH';
import { ResidentDetail } from '@/types/resident';

export default function ResidentDetailPage() {  
  const router = useRouter();
  const params = useParams();
  const residentId = Number(params.id);
  
  // #region 상태 관리
  const [resident, setResident] = useState<ResidentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  
  const [formData, setFormData] = useState<ResidentFormData>({
    name: '',
    phone: '',
    email: '',
    birthDate: '',
    gender: '',
    emergencyContact: '',
    memo: '',
  });
  const [originalData, setOriginalData] = useState<ResidentFormData>({
    name: '',
    phone: '',
    email: '',
    birthDate: '',
    gender: '',
    emergencyContact: '',
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
      title: '거주자 기본 정보',
      subtitle: '거주자의 개인 정보를 관리합니다.',
    },
    {
      id: 'instance',
      label: '거주 정보',
      title: '거주 정보 관리',
      subtitle: '거주자의 호실 관계를 관리합니다.',
    },
    {
      id: 'history',
      label: '이동 이력',
      title: '호실 이동 이력',
      subtitle: '거주자의 호실 이동 이력을 확인합니다.',
    },
  ];
  // #endregion

  // #region 데이터 로드
  const loadResidentData = useCallback(async () => {
    if (!residentId || isNaN(residentId)) {
      return;
    }
    
    setLoading(true);
    try {
      const result = await getResidentDetail(residentId);
      
      if (result.success && result.data) {
        setResident(result.data);
        
        const initialData = {
          name: result.data.name,
          phone: result.data.phone || '',
          email: result.data.email || '',
          birthDate: result.data.birthDate || '',
          gender: result.data.gender || '',
          emergencyContact: result.data.emergencyContact || '',
          memo: result.data.memo || '',
        };
        setFormData(initialData);
        setOriginalData(initialData);
      } else {
        console.error('거주자 조회 실패:', result.errorMsg);
        setModalMessage(`거주자 정보를 불러올 수 없습니다: ${result.errorMsg}`);
        setErrorModalOpen(true);
        setTimeout(() => {
          router.push('/parking/occupancy/resident');
        }, 2000);
      }
    } catch (error) {
      console.error('거주자 조회 중 오류:', error);
      setModalMessage('거주자 정보를 불러오는 중 오류가 발생했습니다.');
      setErrorModalOpen(true);
      setTimeout(() => {
        router.push('/parking/occupancy/resident');
      }, 2000);
    } finally {
      setLoading(false);
    }
  }, [residentId, router]);

  useEffect(() => {
    loadResidentData();
  }, [loadResidentData]);
  // #endregion

  // #region 변경 감지
  const hasChanges = useMemo(() => {
    return (
      formData.name !== originalData.name ||
      formData.phone !== originalData.phone ||
      formData.email !== originalData.email ||
      formData.birthDate !== originalData.birthDate ||
      formData.gender !== originalData.gender ||
      formData.emergencyContact !== originalData.emergencyContact ||
      formData.memo !== originalData.memo
    );
  }, [formData, originalData]);

  const isValid = useMemo(() => {
    if (!hasChanges) return false;
    
    return Boolean(formData.name.trim());
  }, [formData, hasChanges]);
  // #endregion

  // #region 핸들러
  const handleBack = () => {
    if (hasChanges) {
      const confirmMessage = '수정된 내용이 있습니다. 정말로 나가시겠습니까?';
      if (!confirm(confirmMessage)) return;
    }
    router.push('/parking/occupancy/resident');
  };

  const handleFormChange = useCallback((data: ResidentFormData) => {
    setFormData(data);
  }, []);

  const handleReset = useCallback(() => {
    if (!hasChanges) return;
    
    const confirmMessage = '수정된 내용을 모두 되돌리시겠습니까?';
    if (!confirm(confirmMessage)) return;
    
    setFormData(originalData);
  }, [hasChanges, originalData]);

  const handleSubmit = useCallback(async () => {
    if (!resident || !isValid || isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      const updateData: {
        name?: string;
        phone?: string;
        email?: string;
        birthDate?: string;
        gender?: 'M' | 'F';
        emergencyContact?: string;
        memo?: string;
      } = {};
      
      // 변경된 필드만 포함
      if (formData.name !== originalData.name) updateData.name = formData.name;
      if (formData.phone !== originalData.phone) updateData.phone = formData.phone;
      if (formData.email !== originalData.email) updateData.email = formData.email;
      if (formData.birthDate !== originalData.birthDate) updateData.birthDate = formData.birthDate;
      if (formData.gender !== originalData.gender) updateData.gender = formData.gender as 'M' | 'F';
      if (formData.emergencyContact !== originalData.emergencyContact) updateData.emergencyContact = formData.emergencyContact;
      if (formData.memo !== originalData.memo) updateData.memo = formData.memo;

      const result = await updateResident(resident.id, updateData);

      if (result.success) {
        // 성공 시 원본 데이터 업데이트
        const newData = { ...formData };
        setOriginalData(newData);
        setFormData(newData);
        
        // 데이터 다시 로드
        await loadResidentData();
        
        setModalMessage('거주자 정보가 성공적으로 수정되었습니다.');
        setSuccessModalOpen(true);
      } else {
        console.error('거주자 수정 실패:', result.errorMsg);
        setModalMessage(`거주자 수정에 실패했습니다: ${result.errorMsg}`);
        setErrorModalOpen(true);
      }
    } catch (error) {
      console.error('거주자 수정 중 오류:', error);
      setModalMessage('거주자 수정 중 오류가 발생했습니다.');
      setErrorModalOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  }, [resident, isValid, isSubmitting, formData, originalData, loadResidentData]);
  // #endregion

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-muted-foreground">로딩 중...</div>
      </div>
    );
  }

  if (!resident) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-muted-foreground">거주자 정보를 찾을 수 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* 헤더 */}
      <PageHeader 
        title="거주자 상세 정보"
        subtitle={`${resident.name} - ${resident.phone || '전화번호 없음'}`}
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
            <ResidentForm
              mode="edit"
              resident={resident}
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
          
          {activeTab === 'instance' && (
            <ResidentInstanceSection 
              resident={resident}
              onDataChange={loadResidentData}
            />
          )}
          
          {activeTab === 'history' && (
            <ResidentHistorySection 
              resident={resident}
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
            <h3 className="text-lg font-semibold text-green-600 mb-2">성공</h3>
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
            <h3 className="text-lg font-semibold text-red-600 mb-2">오류</h3>
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
