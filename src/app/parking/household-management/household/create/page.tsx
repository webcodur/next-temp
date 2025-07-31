'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/ui/ui-layout/page-header/PageHeader';
import HouseholdInfoForm from '@/components/view/parking/household-detail/unit/HouseholdInfoForm';
import { HouseholdFormData } from '@/components/view/parking/household-detail/types';
import { createHousehold } from '@/services/household/household_POST';
import type { CreateHouseholdRequest, HouseholdType } from '@/types/household';

export default function HouseholdCreatePage() {
  // #region 상태 관리
  const router = useRouter();
  const [formData, setFormData] = useState<HouseholdFormData>({
    lv1Address: '',
    lv2Address: '',
    lv3Address: '',
    householdType: '',
    memo: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  // #endregion

  // #region 유효성 검사
  const isValid = useMemo(() => {
    return Boolean(
      formData.lv1Address.trim() && 
      formData.lv2Address.trim() && 
      formData.householdType
    );
  }, [formData]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.lv1Address.trim()) {
      newErrors.lv1Address = '동 정보를 입력해주세요.';
    }
    if (!formData.lv2Address.trim()) {
      newErrors.lv2Address = '호 정보를 입력해주세요.';
    }
    if (!formData.householdType) {
      newErrors.householdType = '세대 타입을 선택해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  // #endregion

  // #region 이벤트 핸들러
  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const requestData: CreateHouseholdRequest = {
        address1Depth: formData.lv1Address,
        address2Depth: formData.lv2Address,
        address3Depth: formData.lv3Address || undefined,
        householdType: formData.householdType as HouseholdType,
        memo: formData.memo || undefined,
      };

      const response = await createHousehold(requestData);
      
      if (response.success) {
        alert('호실이 성공적으로 등록되었습니다.');
        router.push('/parking/household-management/household');
      } else {
        throw new Error(response.errorMsg || '등록 실패');
      }
    } catch (error) {
      console.error('등록 중 오류 발생:', error);
      alert(error instanceof Error ? error.message : '등록 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push('/parking/household-management/household');
  };

  const handleFieldChange = (field: keyof HouseholdFormData) => (value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // 에러 제거
    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  // #endregion

  // #region 페이지 액션
  const leftActions = (
    <Link
      href="/parking/household-management/household"
      className="flex gap-2 items-center px-3 py-2 transition-colors text-muted-foreground hover:text-foreground"
    >
      <ArrowLeft className="w-4 h-4" />
      목록으로
    </Link>
  );
  // #endregion

  return (
    <div className="p-6">
      <PageHeader
        title="호실 등록"
        subtitle="새로운 호실 정보를 등록합니다"
        leftActions={leftActions}
      />

      <div className="mx-auto">
        <HouseholdInfoForm
          mode="create"
          formData={formData}
          errors={errors}
          isSubmitting={isSubmitting}
          isValid={isValid}
          onFieldChange={handleFieldChange}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
} 