'use client';

import React, { useState, useMemo } from 'react';
import { Lock, Save, RotateCcw } from 'lucide-react';

import { Button } from '@/components/ui/ui-input/button/Button';
import { GridFormAuto, type GridFormFieldSchema } from '@/components/ui/ui-layout/grid-form';
import Modal from '@/components/ui/ui-layout/modal/Modal';
import { SimpleTextInput } from '@/components/ui/ui-input/simple-input/SimpleTextInput';
import { updateAdmin } from '@/services/admin/admin@id_PUT';
import { resetAdminPassword } from '@/services/admin/admin@id_reset_password_PATCH';
import { Admin, canManagePassword, canResetPassword } from '@/types/admin';
import { getRoleIdFromToken } from '@/utils/tokenUtils';
import { getNetworkErrorMessage } from '@/utils/apiErrorMessages';

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
  
  // 모달 상태
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
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
  
  // AdminPasswordSection 권한 검증 완료
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
        setModalMessage('비밀번호가 성공적으로 변경되었습니다.');
        setSuccessModalOpen(true);
        // 폼 초기화
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      } else {
        console.error('비밀번호 변경 실패:', '대상 작업에 실패했습니다.');
        setModalMessage('비밀번호 변경에 실패했습니다.');
      }
    } catch {
      setModalMessage(getNetworkErrorMessage());
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

    const confirmMessage = `정말로 ${admin.name || admin.account}의 비밀번호를 초기화하시겠습니까?`;
    if (!confirm(confirmMessage)) return;

    setIsResetting(true);

    try {
      const result = await resetAdminPassword({ id: admin.id });
      
      if (result.success && result.data) {
        const resetInfo = `비밀번호가 성공적으로 초기화되었습니다.\n\n임시 비밀번호: ${result.data.temporaryPassword}\n초기화 시간: ${new Date(result.data.resetAt).toLocaleString()}\n\n해당 관리자에게 임시 비밀번호를 전달해주세요.`;
        setModalMessage(resetInfo);
        setSuccessModalOpen(true);
      } else {
        console.error('비밀번호 초기화 실패:', result.errorMsg || '대상 작업에 실패했습니다.');
        setModalMessage(result.errorMsg || '비밀번호 초기화에 실패했습니다.');
        setInfoModalOpen(true);
      }
    } catch {
      setModalMessage(getNetworkErrorMessage());
      setInfoModalOpen(true);
    } finally {
      setIsResetting(false);
    }
  };
  // #endregion

  return (
    <div className="space-y-6">
      {!canManage && !canReset && (
        <div className="p-6 rounded-lg border bg-card border-border">
          <div className="flex gap-2 items-center mb-4">
            <Lock size={20} />
            <h2 className="text-lg font-semibold text-foreground">
              비밀번호 변경
              </h2>
          </div>
          <div className="mb-4 text-md text-muted-foreground">
            비밀번호 변경/초기화가 불가능합니다.
          </div>
        </div>
      )}

      {/* 비밀번호 재설정 섹션 */}
      {canManage && (
        <div className="p-6">
          <div className="flex gap-2 items-center mb-4">
            <Lock size={20} />
            <h2 className="text-lg font-semibold text-foreground">
              {isSelfManagement ? '내 비밀번호 변경' : '비밀번호 재설정'}
            </h2>
          </div>

          {(() => {
            const fields: GridFormFieldSchema[] = [
              {
                id: 'currentPassword',
                label: '현재 비밀번호',
                required: true,
                component: (
                  <SimpleTextInput
                    type="password"
                    value={formData.currentPassword}
                    onChange={(value) => handleFieldChange('currentPassword', value)}
                    placeholder="현재 비밀번호"
                    disabled={isSubmitting || isResetting}
                    autocomplete="current-password"
                  />
                )
              },
              {
                id: 'newPassword',
                label: '새 비밀번호',
                required: true,
                component: (
                  <SimpleTextInput
                    type="password"
                    value={formData.newPassword}
                    onChange={(value) => handleFieldChange('newPassword', value)}
                    placeholder="새 비밀번호 (최소 6자)"
                    disabled={isSubmitting || isResetting}
                    autocomplete="new-password"
                  />
                )
              },
              {
                id: 'confirmPassword',
                label: '비밀번호 확인',
                required: true,
                component: (
                  <div>
                    <SimpleTextInput
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(value) => handleFieldChange('confirmPassword', value)}
                      placeholder="비밀번호 확인"
                      disabled={isSubmitting || isResetting}
                      autocomplete="new-password"
                    />
                    {showPasswordError && (
                      <p className="mt-1 text-sm text-destructive">
                        비밀번호가 일치하지 않습니다.
                      </p>
                    )}
                  </div>
                )
              }
            ];

            return <GridFormAuto fields={fields} 
            // title="비밀번호 변경" 
            // subtitle="관리자 계정의 비밀번호를 안전하게 변경합니다." 
            gap="20px" />;
          })()}

          {/* 액션 버튼 */}
          <div className="flex gap-3 justify-end pt-6 mt-6 border-t border-border">
            <Button 
              variant="secondary" 
              onClick={handleReset}
              disabled={isSubmitting || isResetting}
              title="초기화"
            >
              <RotateCcw size={16} />
              초기화
            </Button>
            <Button 
              variant="primary" 
              onClick={handleSubmit} 
              disabled={!isValid || isSubmitting || isResetting}
              title={isSubmitting ? '변경 중...' : '비밀번호 변경'}
            >
              <Save size={16} />
              {isSubmitting ? '변경 중...' : '변경'}
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
            {admin.name || admin.account}의 비밀번호를 임시 비밀번호로 초기화합니다.
          </div>

          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={handlePasswordReset}
              disabled={isResetting || isSubmitting}
              title={isResetting ? '초기화 중...' : '비밀번호 초기화'}
            >
              <RotateCcw size={16} />
              {isResetting ? '초기화 중...' : '초기화'}
            </Button>
          </div>
        </div>
      )}

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
            <div className="whitespace-pre-line text-muted-foreground">{modalMessage}</div>
          </div>
          
          <div className="flex justify-center pt-4">
            <Button onClick={() => setSuccessModalOpen(false)}>
              확인
            </Button>
          </div>
        </div>
      </Modal>

      {/* 오류 모달 제거됨 - 통합 모듈에서 처리 */}

      {/* 정보 모달 */}
      <Modal
        isOpen={infoModalOpen}
        onClose={() => setInfoModalOpen(false)}
        title="알림"
        size="sm"
        onConfirm={() => setInfoModalOpen(false)}
      >
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="mb-2 text-lg font-semibold text-blue-600">알림</h3>
            <p className="text-muted-foreground">{modalMessage}</p>
          </div>
          
          <div className="flex justify-center pt-4">
            <Button onClick={() => setInfoModalOpen(false)}>
              확인
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}