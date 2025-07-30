'use client';

import React, { useState, useMemo } from 'react';
import { Lock, Save, RotateCcw } from 'lucide-react';

import { Button } from '@/components/ui/ui-input/button/Button';
import GridForm from '@/components/ui/ui-layout/grid-form/GridForm';
import { SimpleTextInput } from '@/components/ui/ui-input/simple-input/SimpleTextInput';
import { updateAdmin } from '@/services/admin/admin@id_PUT';
import { Admin, canManagePassword, canResetPassword } from '@/types/admin';
import { getRoleIdFromToken } from '@/utils/tokenUtils';

interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface AdminPasswordSectionProps {
  admin: Admin;
  adminId: number;
}

export default function AdminPasswordSection({ admin }: AdminPasswordSectionProps) {
  // #region 상태 관리
  const [formData, setFormData] = useState<PasswordChangeData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  // #endregion

  // #region 권한 검증
  // 현재 사용자의 roleId 추출 (토큰 기반)
  const getCurrentUserRoleId = (): number => {
    // JWT 토큰에서 직접 추출
    const roleFromToken = getRoleIdFromToken();
    if (roleFromToken) {
      return roleFromToken;
    }

    console.warn('사용자 role 정보를 찾을 수 없습니다.');
    return 0; // 기본값 (권한 없음)
  };

  const currentUserRoleId = getCurrentUserRoleId();
  const targetUserRoleId = admin.roleId;
  
  const canManage = canManagePassword(currentUserRoleId, targetUserRoleId);
  const canReset = canResetPassword(currentUserRoleId, targetUserRoleId);
  const isSelfManagement = currentUserRoleId === targetUserRoleId;
  
  console.log('AdminPasswordSection 권한 검증:', {
    currentUserRoleId,
    targetUserRoleId,
    canManage,
    canReset,
    isSelfManagement,
    adminAccount: admin.account
  });
  // #endregion

  // #region 검증
  const isValid = useMemo(() => {
    return (
      formData.currentPassword.trim() &&
      formData.newPassword.trim() &&
      formData.confirmPassword.trim() &&
      formData.newPassword === formData.confirmPassword &&
      formData.newPassword.length >= 6
    );
  }, [formData]);

  const passwordsMatch = formData.newPassword === formData.confirmPassword || formData.confirmPassword === '';
  const showPasswordError = formData.newPassword.trim() && formData.confirmPassword.trim() && !passwordsMatch;
  // #endregion

  // #region 핸들러
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
        // 폼 초기화
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
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

  const handleReset = () => {
    setFormData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  const handlePasswordReset = async () => {
    if (!admin || !canReset || isResetting) return;

    const confirmMessage = `정말로 ${admin.name || admin.account}의 비밀번호를 초기화(0000)하시겠습니까?`;
    if (!confirm(confirmMessage)) return;

    setIsResetting(true);

    try {
      // TODO: API 구현 전까지 임시 처리
      alert('비밀번호 초기화 기능은 아직 구현되지 않았습니다.');
      
      // 추후 실제 API 연동 시 사용할 코드
      // const result = await resetAdminPassword({ id: admin.id });
      // if (result.success) {
      //   alert('비밀번호가 0000으로 초기화되었습니다.');
      // } else {
      //   console.error('비밀번호 초기화 실패:', result.errorMsg);
      //   alert(`비밀번호 초기화에 실패했습니다: ${result.errorMsg}`);
      // }
    } catch (error) {
      console.error('비밀번호 초기화 중 오류:', error);
      alert('비밀번호 초기화 중 오류가 발생했습니다.');
    } finally {
      setIsResetting(false);
    }
  };
  // #endregion

  // 권한이 없으면 렌더링하지 않음
  if (!canManage && !canReset) {
    console.log('비밀번호 섹션 권한 없음:', { canManage, canReset });
    return null;
  }

  return (
    <div className="space-y-6">
      {/* 비밀번호 재설정 섹션 */}
      {canManage && (
        <div className="p-6 rounded-lg border bg-card border-border">
          <div className="flex gap-2 items-center mb-4">
            <Lock size={20} />
            <h2 className="text-lg font-semibold text-foreground">
              {isSelfManagement ? '내 비밀번호 변경' : '비밀번호 재설정'}
            </h2>
          </div>

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
                  disabled={isSubmitting || isResetting}
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
                  disabled={isSubmitting || isResetting}
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
                  disabled={isSubmitting || isResetting}
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
              onClick={handleReset}
              disabled={isSubmitting || isResetting}
              title="초기화"
            >
              <RotateCcw size={16} />
            </Button>
            <Button 
              variant="accent" 
              onClick={handleSubmit} 
              disabled={!isValid || isSubmitting || isResetting}
              title={isSubmitting ? '변경 중...' : '비밀번호 변경'}
            >
              <Save size={16} />
            </Button>
          </div>
        </div>
      )}

      {/* 비밀번호 초기화 섹션 */}
      {canReset && (
        <div className="p-6 rounded-lg border bg-card border-border">
          <div className="flex gap-2 items-center mb-4">
            <RotateCcw size={20} />
            <h2 className="text-lg font-semibold text-foreground">
              비밀번호 초기화
            </h2>
          </div>

          <div className="mb-4 text-sm text-muted-foreground">
            {admin.name || admin.account}의 비밀번호를 0000으로 초기화합니다.
          </div>

          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={handlePasswordReset}
              disabled={isResetting || isSubmitting}
              title={isResetting ? '초기화 중...' : '비밀번호 초기화 (0000)'}
              className="text-orange-600 border-orange-200 hover:bg-orange-50"
            >
              <RotateCcw size={16} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}