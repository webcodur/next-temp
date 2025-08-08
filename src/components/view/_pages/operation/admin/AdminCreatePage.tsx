/* 메뉴 설명: 페이지 기능 설명 */
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAtom } from 'jotai';

import { Button } from '@/components/ui/ui-input/button/Button';
import PageHeader from '@/components/ui/ui-layout/page-header/PageHeader';
import Modal from '@/components/ui/ui-layout/modal/Modal';
import AdminForm, { AdminFormData } from './AdminForm';
import { createAdmin } from '@/services/admin/admin_POST';
import { ROLE_ID_MAP } from '@/types/admin';
import { currentPageLabelAtom } from '@/store/ui';

// Admin 타입: 생성 시 필요한 필드만 명시
export interface AdminInput {
  account: string;
  password: string;
  name: string;
  email?: string;
  phone?: string;
  roleId: number;
}

export default function AdminCreatePage() {
  const router = useRouter();
  const [, setCurrentPageLabel] = useAtom(currentPageLabelAtom);
  
  // #region 페이지 라벨 설정
  useEffect(() => {
    setCurrentPageLabel({
      label: '관리자 추가',
      href: window.location.pathname,
    });
  }, [setCurrentPageLabel]);
  // #endregion

  // #region 폼 상태
  const [formData, setFormData] = useState<AdminFormData>({
    account: '',
    name: '',
    email: '',
    phone: '',
    role: '',
    password: '',
    confirm: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 모달 상태
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  // #endregion

  // #region 검증
  const isValid = useMemo(() => {
    return (
      formData.account.trim() &&
      formData.password.trim() &&
      formData.confirm.trim() &&
      formData.name.trim() &&
      formData.role.trim() &&
      formData.password === formData.confirm
    );
  }, [formData]);
  // #endregion

  // #region 이벤트 핸들러
  const handleSubmit = async () => {
    if (!isValid || isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      const createData = {
        account: formData.account,
        password: formData.password,
        name: formData.name,
        email: formData.email.trim() || undefined,
        phone: formData.phone.trim() || undefined,
        roleId: ROLE_ID_MAP[formData.role],
      };

      const result = await createAdmin(createData);

      if (result.success) {
        // 성공 시 목록 페이지로 이동
        router.push('/parking/lot/admin');
      } else {
        // 에러 처리
        console.error('관리자 생성 실패:', result.errorMsg);
        setErrorMessage(`관리자 생성에 실패했습니다: ${result.errorMsg}`);
        setErrorModalOpen(true);
      }
    } catch (error) {
      console.error('관리자 생성 중 오류:', error);
      setErrorMessage('관리자 생성 중 오류가 발생했습니다.');
      setErrorModalOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push('/parking/lot/admin');
  };

  const handleFormChange = (data: AdminFormData) => {
    setFormData(data);
  };
  // #endregion

  return (
    <div className="flex flex-col gap-6">
      {/* 헤더 */}
      <PageHeader 
        title="관리자 추가"
        subtitle="새로운 관리자 계정을 생성합니다"
        leftActions={
          <Button
            variant="secondary"
            size="default"
            onClick={handleCancel}
            title="목록으로"
          >
            <ArrowLeft size={16} />
            목록
          </Button>
        }
      />

      {/* 폼 섹션 */}
      <div className="bg-card rounded-lg border border-border p-6">
        <AdminForm
          mode="create"
          data={formData}
          onChange={handleFormChange}
          disabled={isSubmitting}
        />
      </div>

      {/* 저장 버튼 - 우하단 고정 */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button 
          variant="primary"
          size="lg"
          onClick={handleSubmit} 
          disabled={!isValid || isSubmitting}
          title={isSubmitting ? '생성 중...' : '생성'}
          className="shadow-lg"
        >
          <Save size={20} />
          {isSubmitting ? '생성 중...' : '생성'}
        </Button>
      </div>

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
            <p className="text-muted-foreground">{errorMessage}</p>
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