/* 메뉴 설명: 페이지 기능 설명 */
'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { useAtom } from 'jotai';

import { Button } from '@/components/ui/ui-input/button/Button';
import PageHeader from '@/components/ui/ui-layout/page-header/PageHeader';
import GridForm from '@/components/ui/ui-layout/grid-form/GridForm';
import { SimpleTextInput } from '@/components/ui/ui-input/simple-input/SimpleTextInput';

import { getAdminDetail } from '@/services/admin/admin@id_GET';
import { updateAdmin } from '@/services/admin/admin@id_PUT';

import { currentPageLabelAtom } from '@/store/ui';

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
  const [, setCurrentPageLabel] = useAtom(currentPageLabelAtom);

  // #region 페이지 라벨 설정
  useEffect(() => {
    setCurrentPageLabel({
      label: '비밀번호 변경',
      href: window.location.pathname,
    });
  }, [setCurrentPageLabel]);
  // #endregion

  // #region 상태 관리
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<PasswordChangeData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
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
        alert(`관리자 정보를 불러올 수 없습니다: ${result.errorMsg}`);
        router.push('/parking/lot-management/admin');
      }
    } catch (error) {
      console.error('관리자 조회 중 오류:', error);
      alert('관리자 정보를 불러오는 중 오류가 발생했습니다.');
              router.push('/parking/lot-management/admin');
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
    router.push(`/parking/lot-management/admin/${adminId}`);
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
        alert('비밀번호가 성공적으로 변경되었습니다.');
        router.push(`/parking/lot-management/admin/${adminId}`);
      } else {
        console.error('비밀번호 변경 실패:', result.errorMsg);
        alert(`비밀번호 변경에 실패했습니다: ${result.errorMsg}`);
      }
    } catch (error) {
      console.error('비밀번호 변경 중 오류:', error);
      alert('비밀번호 변경 중 오류가 발생했습니다.');
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
            variant="ghost"
            size="sm"
            onClick={handleBack}
            title="뒤로가기"
          >
            <ArrowLeft size={16} />
          </Button>
        }
      />

      {/* 폼 섹션 */}
      <div className="p-6 rounded-lg border bg-card border-border">
        <GridForm labelWidth="140px" gap="20px">
          <GridForm.Row>
            <GridForm.Label required>
              현재 비밀번호
            </GridForm.Label>
            <GridForm.Content>
              <SimpleTextInput
                type="password"
                value={formData.currentPassword}
                onChange={(value) => handleFieldChange('currentPassword', value)}
                placeholder="현재 비밀번호를 입력해주세요"
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
                placeholder="새 비밀번호를 입력해주세요 (최소 6자리)"
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
                placeholder="새 비밀번호를 다시 입력해주세요"
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
          variant="accent"
          size="lg"
          onClick={handleSubmit} 
          disabled={!isValid || isSubmitting}
          title={isSubmitting ? '변경 중...' : '변경'}
          className="shadow-lg"
        >
          <Save size={20} />
        </Button>
      </div>
    </div>
  );
} 