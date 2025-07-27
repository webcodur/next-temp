/* 메뉴 설명: 페이지 기능 설명 */
'use client';

import React, { useState, useMemo } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';


import { Button } from '@/components/ui/ui-input/button/Button';
import AdminForm, { AdminFormData } from './AdminForm';
import { createAdmin } from '@/services/admin/admin_POST';
import { ROLE_ID_MAP } from '@/types/admin';

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
        router.push('/parking/facility/admin');
      } else {
        // 에러 처리
        console.error('관리자 생성 실패:', result.errorMsg);
        alert(`관리자 생성에 실패했습니다: ${result.errorMsg}`);
      }
    } catch (error) {
      console.error('관리자 생성 중 오류:', error);
      alert('관리자 생성 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push('/parking/facility/admin');
  };

  const handleFormChange = (data: AdminFormData) => {
    setFormData(data);
  };
  // #endregion

  return (
    <div className="flex flex-col gap-6">
      {/* 헤더 */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCancel}
          className="flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          목록으로
        </Button>
        <h1 className="text-2xl font-semibold text-foreground">
          관리자 추가
        </h1>
      </div>

      {/* 폼 섹션 */}
      <div className="bg-card rounded-lg border border-border p-6">
        <AdminForm
          mode="create"
          data={formData}
          onChange={handleFormChange}
          disabled={isSubmitting}
        />
        
        {/* 액션 버튼 */}
        <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-border">
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
            className="flex items-center gap-2"
          >
            <Save size={16} />
            {isSubmitting ? '생성 중...' : '생성'}
          </Button>
        </div>
      </div>
    </div>
  );
} 