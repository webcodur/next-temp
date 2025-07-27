/* 메뉴 설명: 페이지 기능 설명 */
'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { ArrowLeft, Lock, Save } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';


import { Button } from '@/components/ui/ui-input/button/Button';
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
        router.push('/parking/facility/admin');
      }
    } catch (error) {
      console.error('관리자 조회 중 오류:', error);
      alert('관리자 정보를 불러오는 중 오류가 발생했습니다.');
      router.push('/parking/facility/admin');
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
    router.push(`/parking/facility/admin/${adminId}`);
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
        router.push(`/parking/facility/admin/${adminId}`);
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

  const handleCancel = () => {
    router.push(`/parking/facility/admin/${adminId}`);
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
      <div className="flex gap-4 items-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          className="flex gap-2 items-center"
        >
          <ArrowLeft size={16} />
          뒤로가기
        </Button>
        <h1 className="flex gap-2 items-center text-2xl font-semibold text-foreground">
          <Lock size={24} />
          비밀번호 변경
        </h1>
      </div>

      {/* 관리자 정보 */}
      <div className="p-4 rounded-lg border bg-muted/30 border-border">
        <div className="text-sm text-muted-foreground">대상 관리자</div>
        <div className="text-lg font-medium">
          {admin.name || admin.account} ({admin.account})
        </div>
      </div>

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

        {/* 액션 버튼 */}
        <div className="flex gap-3 justify-end pt-6 mt-6 border-t border-border">
          <Button 
            variant="ghost" 
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            취소
          </Button>
          <Button 
            variant="accent" 
            onClick={handleSubmit} 
            disabled={!isValid || isSubmitting}
            className="flex gap-2 items-center"
          >
            <Save size={16} />
            {isSubmitting ? '변경 중...' : '변경'}
          </Button>
        </div>
      </div>
    </div>
  );
} 