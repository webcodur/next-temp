/* 메뉴 설명: 페이지 기능 설명 */
'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';

import { Button } from '@/components/ui/ui-input/button/Button';
import PageHeader from '@/components/ui/ui-layout/page-header/PageHeader';
import Modal from '@/components/ui/ui-layout/modal/Modal';
import GridForm from '@/components/ui/ui-layout/grid-form/GridForm';
import { SimpleTextInput } from '@/components/ui/ui-input/simple-input/SimpleTextInput';

import { getAdminDetail } from '@/services/admin/admin@id_GET';
import { updateAdmin } from '@/services/admin/admin@id_PUT';



// Admin 타입 정의
interface Admin {
  id: number;
  account: string;
  name?: string;
}

interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function AdminPasswordChangePage() {
  const router = useRouter();
  const params = useParams();
  const adminId = Number(params.id);




  // #region 상태 관리
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<PasswordChangeData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 모달 상태
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  // #endregion

  // #region 데이터 로드
  const loadAdminData = useCallback(async () => {
    if (!adminId) return;
    
    setLoading(true);
    try {
      const result = await getAdminDetail({ id: adminId });
      
      if (result.success && result.data) {
        setAdmin({
          id: result.data.id,
          account: result.data.account,
          name: result.data.name,
        });
      } else {
        console.error('관리자 조회 실패:', result.errorMsg);
        setModalMessage(`관리자 정보를 불러올 수 없습니다: ${result.errorMsg}`);
        setErrorModalOpen(true);
        setTimeout(() => {
          router.push('/parking/lot/admin');
        }, 2000);
      }
    } catch (error) {
      console.error('관리자 조회 중 오류:', error);
      setModalMessage('관리자 정보를 불러오는 중 오류가 발생했습니다.');
      setErrorModalOpen(true);
      setTimeout(() => {
        router.push('/parking/lot/admin');
      }, 2000);
    } finally {
      setLoading(false);
    }
  }, [adminId, router]);

  useEffect(() => {
    loadAdminData();
  }, [loadAdminData]);
  // #endregion

  // #region 검증
  const isValid = useMemo(() => {
    return (
      formData.currentPassword.trim() &&
      formData.newPassword.trim() &&
      formData.confirmPassword.trim() &&
      formData.newPassword === formData.confirmPassword &&
      formData.newPassword.length >= 6 // 최소 6자리
    );
  }, [formData]);

  const passwordsMatch = formData.newPassword === formData.confirmPassword || formData.confirmPassword === '';
  const showPasswordError = formData.newPassword.trim() && formData.confirmPassword.trim() && !passwordsMatch;
  // #endregion

  // #region 핸들러
  const handleBack = () => {
    router.push(`/parking/lot/admin/${adminId}`);
  };

  const handleFieldChange = (field: keyof PasswordChangeData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!admin || !isValid || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const result = await updateAdmin({
        id: admin.id,
        password: formData.newPassword,
      });

      if (result.success) {
        setModalMessage('비밀번호가 성공적으로 변경되었습니다.');
        setSuccessModalOpen(true);
        setTimeout(() => {
          router.push(`/parking/lot/admin/${adminId}`);
        }, 2000);
      } else {
        console.error('비밀번호 변경 실패:', result.errorMsg);
        setModalMessage(`비밀번호 변경에 실패했습니다: ${result.errorMsg}`);
        setErrorModalOpen(true);
      }
    } catch (error) {
      console.error('비밀번호 변경 중 오류:', error);
      setModalMessage('비밀번호 변경 중 오류가 발생했습니다.');
      setErrorModalOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };


  // #endregion

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-muted-foreground">로딩 중...</div>
      </div>
    );
  }

  if (!admin) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-muted-foreground">관리자 정보를 찾을 수 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* 헤더 */}
      <PageHeader 
        title="비밀번호 변경"
        subtitle={`${admin.name || admin.account} (${admin.account})`}
        leftActions={
          <Button
            variant="secondary"
            size="default"
            onClick={handleBack}
            title="뒤로가기"
          >
            <ArrowLeft size={16} />
            뒤로
          </Button>
        }
      />

      {/* 폼 섹션 */}
      <div className="p-6 rounded-lg border bg-card border-border">
        <GridForm gap="20px">
          <GridForm.Row>
            <GridForm.Label required>
              현재 비밀번호
            </GridForm.Label>
            <GridForm.Content>
              <SimpleTextInput
                type="password"
                value={formData.currentPassword}
                onChange={(value) => handleFieldChange('currentPassword', value)}
                placeholder="현재 비밀번호"
                disabled={isSubmitting}
              />
            </GridForm.Content>
          </GridForm.Row>

          <GridForm.Row>
            <GridForm.Label required>
              새 비밀번호
            </GridForm.Label>
            <GridForm.Content>
              <SimpleTextInput
                type="password"
                value={formData.newPassword}
                onChange={(value) => handleFieldChange('newPassword', value)}
                placeholder="새 비밀번호 (최소 6자)"
                disabled={isSubmitting}
              />
            </GridForm.Content>
          </GridForm.Row>

          <GridForm.Row>
            <GridForm.Label required>
              비밀번호 확인
            </GridForm.Label>
            <GridForm.Content>
              <SimpleTextInput
                type="password"
                value={formData.confirmPassword}
                onChange={(value) => handleFieldChange('confirmPassword', value)}
                placeholder="비밀번호 확인"
                disabled={isSubmitting}
              />
              {showPasswordError && (
                <p className="mt-1 text-sm text-destructive">
                  비밀번호가 일치하지 않습니다.
                </p>
              )}
            </GridForm.Content>
          </GridForm.Row>
        </GridForm>
      </div>

      {/* 저장 버튼 - 우하단 고정 */}
      <div className="fixed right-6 bottom-6 z-50">
        <Button 
          variant="primary"
          size="lg"
          onClick={handleSubmit} 
          disabled={!isValid || isSubmitting}
          title={isSubmitting ? '변경 중...' : '변경'}
          className="shadow-lg"
        >
          <Save size={20} />
          {isSubmitting ? '변경 중...' : '변경'}
        </Button>
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