/* 메뉴 설명: 주민 상세 페이지 */
'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { Button } from '@/components/ui/ui-input/button/Button';
import Modal from '@/components/ui/ui-layout/modal/Modal';
import PageHeader from '@/components/ui/ui-layout/page-header/PageHeader';
import Tabs from '@/components/ui/ui-layout/tabs/Tabs';
import ResidentForm, { ResidentFormData } from './ResidentBasic';
import ResidentConnection from '../connection/ResidentConnection';
import ResidentHistoryPage from '../history/ResidentHistoryPage';
import { createResidentTabs } from '../_shared/residentTabs';
import { getResidentDetail } from '@/services/residents/residents@id_GET';
import { updateResident } from '@/services/residents/residents@id_PATCH';
import { deleteResident } from '@/services/residents/residents@id_DELETE';
import { ResidentDetail } from '@/types/resident';

export default function ResidentDetailPage() {  
  const router = useRouter();
  const params = useParams();
  const residentId = Number(params.id);
  
  // #region 상태 관리
  const [resident, setResident] = useState<ResidentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 탭 상태 관리
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
  const [modalMessage, setModalMessage] = useState('');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  // #endregion

  // #region 탭 설정
  const tabs = createResidentTabs();
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
        
        const initialData: ResidentFormData = {
          name: result.data.name,
          phone: result.data.phone || '',
          email: result.data.email || '',
          birthDate: result.data.birthDate || '',
          gender: (result.data.gender as 'M' | 'F') || '',
          emergencyContact: result.data.emergencyContact || '',
          memo: result.data.memo || '',
        };
        setFormData(initialData);
        setOriginalData(initialData);
      } else {
        console.error('주민 조회 실패:', '데이터 조회에 실패했습니다.');
        setModalMessage('주민 정보를 불러올 수 없습니다.');
        setTimeout(() => {
          router.push('/parking/occupancy/resident');
        }, 2000);
      }
    } catch (error) {
      console.error('주민 조회 중 오류:', error);
      setModalMessage('주민 정보를 불러오는 중 오류가 발생했습니다.');
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
  const handleFormChange = useCallback((data: ResidentFormData) => {
    setFormData(data);
  }, []);

  const handleReset = useCallback(() => {
    if (!hasChanges) return;
    
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
        
        setModalMessage('주민 정보가 성공적으로 수정되었습니다.');
        setSuccessModalOpen(true);
      } else {
        console.error('주민 수정 실패:', '대상 작업에 실패했습니다.');
        setModalMessage('주민 수정에 실패했습니다.');
      }
    } catch (error) {
      console.error('주민 수정 중 오류:', error);
      setModalMessage('주민 수정 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  }, [resident, isValid, isSubmitting, formData, originalData, loadResidentData]);

  const handleDelete = useCallback(() => {
    setDeleteConfirmOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!resident) return;
    try {
      const result = await deleteResident(resident.id);
      if (result.success) {
        setModalMessage('주민이 성공적으로 삭제되었습니다.');
        setSuccessModalOpen(true);
        setTimeout(() => {
          router.push('/parking/occupancy/resident');
        }, 1500);
      } else {
        setModalMessage('주민 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('주민 삭제 중 오류:', error);
      setModalMessage('주민 삭제 중 오류가 발생했습니다.');
    } finally {
      setDeleteConfirmOpen(false);
    }
  }, [resident, router]);


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
        <div className="text-muted-foreground">주민 정보를 찾을 수 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* 헤더 */}
      <PageHeader 
        title="주민 상세 정보"
        subtitle={`${resident.name} - ${resident.phone || '전화번호 없음'}`}
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
            <ResidentForm
              mode="edit"
              resident={resident}
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
          )}

          {/* 세대 연결 탭 */}
          {activeTab === 'connection' && (
            <div className="space-y-6">
              <ResidentConnection
                resident={resident}
                onDataChange={loadResidentData}
                onOperationComplete={(success, message) => {
                  setModalMessage(message);
                  if (success) {
                    setSuccessModalOpen(true);
                  }
                }}
              />
            </div>
          )}

          {/* 거주 히스토리 탭 */}
          {activeTab === 'history' && (
            <div className="space-y-6">
              <ResidentHistoryPage
                resident={resident}
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
        onConfirm={() => setSuccessModalOpen(false)}
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

      
      {/* 삭제 확인 모달 */}
      <Modal
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        title="주민 삭제 확인"
        size="md"
        onConfirm={handleDeleteConfirm}
      >
        <div className="space-y-4">
          <div>
            <h3 className="mb-2 text-lg font-semibold">정말로 삭제하시겠습니까?</h3>
            <p className="text-muted-foreground">이 작업은 되돌릴 수 없습니다. 주민 정보가 영구적으로 삭제됩니다.</p>
          </div>
          <div className="flex gap-3 justify-end pt-4">
            <Button variant="ghost" onClick={() => setDeleteConfirmOpen(false)}>취소</Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>삭제</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
