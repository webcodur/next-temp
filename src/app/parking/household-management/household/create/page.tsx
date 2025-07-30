'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/ui/ui-layout/page-header/PageHeader';
import { Field } from '@/components/ui/ui-input/field/core/Field';
import { createHousehold } from '@/services/household/household_POST';
import type { CreateHouseholdRequest, HouseholdType } from '@/types/household';

// #region 타입 정의
interface HouseholdFormData {
  address1Depth: string;
  address2Depth: string;
  address3Depth: string;
  householdType: HouseholdType | '';
  memo: string;
}
// #endregion

export default function HouseholdCreatePage() {
  // #region 상태 관리
  const router = useRouter();
  const [formData, setFormData] = useState<HouseholdFormData>({
    address1Depth: '',
    address2Depth: '',
    address3Depth: '',
    householdType: '',
    memo: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  // #endregion

  // #region 유효성 검사
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.address1Depth.trim()) {
      newErrors.address1Depth = '동을 입력해주세요.';
    }
    if (!formData.address2Depth.trim()) {
      newErrors.address2Depth = '호수를 입력해주세요.';
    }
    if (!formData.householdType) {
      newErrors.householdType = '세대 타입을 선택해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  // #endregion

  // #region 이벤트 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const requestData: CreateHouseholdRequest = {
        address1Depth: formData.address1Depth,
        address2Depth: formData.address2Depth,
        address3Depth: formData.address3Depth || undefined,
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

  const handleReset = () => {
    setFormData({
      address1Depth: '',
      address2Depth: '',
      address3Depth: '',
      householdType: '',
      memo: '',
    });
    setErrors({});
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

  const rightActions = (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={handleReset}
        disabled={isSubmitting}
        className="flex gap-2 items-center px-4 py-2 rounded-lg border transition-colors border-border hover:bg-muted disabled:opacity-50"
      >
        <X className="w-4 h-4" />
        초기화
      </button>
      <button
        type="submit"
        form="household-form"
        disabled={isSubmitting}
        className="flex gap-2 items-center px-4 py-2 rounded-lg transition-colors bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
      >
        <Save className="w-4 h-4" />
        {isSubmitting ? '등록 중...' : '등록'}
      </button>
    </div>
  );
  // #endregion

  return (
    <div className="p-6">
      <PageHeader
        title="호실 등록"
        subtitle="새로운 호실 정보를 등록합니다"
        leftActions={leftActions}
        rightActions={rightActions}
      />

      <div className="mx-auto max-w-2xl">
        <form id="household-form" onSubmit={handleSubmit} className="space-y-6">
          {/* 기본 정보 섹션 */}
          <div className="p-6 rounded-lg border bg-card">
            <h3 className="mb-4 text-lg font-semibold">기본 정보</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field
                type="select"
                label="동 *"
                placeholder="동 선택"
                value={formData.address1Depth}
                onChange={handleFieldChange('address1Depth')}
                options={[
                  { value: '101동', label: '101동' },
                  { value: '102동', label: '102동' },
                  { value: '103동', label: '103동' },
                  { value: '104동', label: '104동' },
                  { value: '105동', label: '105동' },
                ]}
              />
              {errors.address1Depth && (
                <div className="col-span-full text-sm text-red-600">{errors.address1Depth}</div>
              )}
              
              <Field
                type="text"
                label="호수 *"
                placeholder="예: 1001호"
                value={formData.address2Depth}
                onChange={handleFieldChange('address2Depth')}
              />
              {errors.address2Depth && (
                <div className="col-span-full text-sm text-red-600">{errors.address2Depth}</div>
              )}
              
              <Field
                type="text"
                label="세부 주소"
                placeholder="예: A동"
                value={formData.address3Depth}
                onChange={handleFieldChange('address3Depth')}
              />
              
              <Field
                type="select"
                label="세대 타입 *"
                placeholder="타입 선택"
                value={formData.householdType}
                onChange={handleFieldChange('householdType')}
                options={[
                  { value: 'GENERAL', label: '일반 세대' },
                  { value: 'TEMP', label: '임시 세대' },
                  { value: 'COMMERCIAL', label: '상업 세대' },
                ]}
              />
              {errors.householdType && (
                <div className="col-span-full text-sm text-red-600">{errors.householdType}</div>
              )}
            </div>
          </div>

          {/* 추가 정보 섹션 */}
          <div className="p-6 rounded-lg border bg-card">
            <h3 className="mb-4 text-lg font-semibold">추가 정보</h3>
            <Field
              type="text"
              label="메모"
              placeholder="특이사항이나 추가 정보를 입력하세요"
              value={formData.memo}
              onChange={handleFieldChange('memo')}
            />
          </div>

          {/* 폼 하단 안내 */}
          <div className="p-4 rounded-lg bg-muted/50">
            <p className="text-sm text-muted-foreground">
              * 필수 입력 항목입니다. 모든 필수 정보를 입력한 후 등록 버튼을 클릭하세요.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
} 