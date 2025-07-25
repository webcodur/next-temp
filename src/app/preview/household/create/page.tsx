'use client';

import { useState } from 'react';
import { ArrowLeft, Save, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import FieldText from '@/components/ui/ui-input/field/text/FieldText';
import FieldSelect from '@/components/ui/ui-input/field/select/FieldSelect';
import { createHousehold } from '@/services/household/household_POST';
import type { CreateHouseholdRequest, HouseholdType } from '@/types/household';

// #region Types
interface CreateHouseholdForm {
  address1Depth: string;
  address2Depth: string;
  address3Depth: string;
  householdType: HouseholdType | '';
  memo: string;
}

interface FormErrors {
  address1Depth?: string;
  address2Depth?: string;
  householdType?: string;
}
// #endregion

// #region Form Validation
function validateForm(formData: CreateHouseholdForm): FormErrors {
  const errors: FormErrors = {};

  if (!formData.address1Depth.trim()) {
    errors.address1Depth = '동은 필수 입력 항목입니다.';
  }

  if (!formData.address2Depth.trim()) {
    errors.address2Depth = '호수는 필수 입력 항목입니다.';
  }

  if (!formData.householdType) {
    errors.householdType = '세대 유형을 선택해주세요.';
  }

  return errors;
}
// #endregion

// #region Main Component
export default function CreateHouseholdPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CreateHouseholdForm>({
    address1Depth: '',
    address2Depth: '',
    address3Depth: '',
    householdType: '',
    memo: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const householdTypeOptions = [
    { value: 'GENERAL', label: '일반세대' },
    { value: 'TEMP', label: '임시세대' },
    { value: 'COMMERCIAL', label: '상업세대' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateForm(formData);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const requestData: CreateHouseholdRequest = {
        address1Depth: formData.address1Depth,
        address2Depth: formData.address2Depth,
        address3Depth: formData.address3Depth || undefined,
        householdType: formData.householdType as HouseholdType,
        memo: formData.memo || undefined
      };

      const result = await createHousehold(requestData);
      
      if (result.success) {
        alert('세대가 성공적으로 등록되었습니다.');
        router.push('/preview/household');
      } else {
        alert(`세대 등록 실패: ${result.errorMsg}`);
      }
    } catch (error) {
      console.error('세대 등록 중 오류:', error);
      alert('세대 등록 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (confirm('작성중인 내용이 사라집니다. 정말로 취소하시겠습니까?')) {
      router.push('/preview/household');
    }
  };

  const updateFormData = (field: keyof CreateHouseholdForm) => (value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // 해당 필드의 에러 제거
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="p-6 space-y-6 font-multilang animate-fadeIn">
      {/* 페이지 헤더 */}
      <div className="p-6 rounded-xl neu-flat">
        <div className="flex gap-4 items-center">
          <button
            onClick={() => router.push('/preview/household')}
            className="p-3 rounded-xl transition-all duration-200 neu-raised hover:animate-click-feedback"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">새 세대 등록</h1>
            <p className="mt-1 text-sm text-muted-foreground">세대 기본 정보를 입력하여 새로운 세대를 등록합니다</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 rounded-xl neu-elevated">
        <div className="space-y-6">
          {/* 기본 정보 섹션 */}
          <div>
            <h2 className="mb-4 text-lg font-semibold text-foreground">기본 정보</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FieldText
                id="address1Depth"
                label="주소 1단계 (동)"
                placeholder="예: 101동"
                value={formData.address1Depth}
                onChange={updateFormData('address1Depth')}
              />

              <FieldText
                id="address2Depth"
                label="주소 2단계 (호수)"
                placeholder="예: 1104호"
                value={formData.address2Depth}
                onChange={updateFormData('address2Depth')}
              />

              <FieldText
                id="address3Depth"
                label="주소 3단계 (기타)"
                placeholder="예: 방 1 (선택사항)"
                value={formData.address3Depth}
                onChange={updateFormData('address3Depth')}
              />

              <FieldSelect
                id="householdType"
                label="세대 유형"
                placeholder="세대 유형을 선택하세요"
                options={householdTypeOptions}
                value={formData.householdType}
                onChange={updateFormData('householdType')}
              />
            </div>
          </div>

          {/* 추가 정보 섹션 */}
          <div>
            <h2 className="mb-4 text-lg font-semibold text-foreground">추가 정보</h2>
            <FieldText
              id="memo"
              label="메모"
              placeholder="특이사항이나 추가 정보를 입력하세요 (선택사항)"
              value={formData.memo}
              onChange={updateFormData('memo')}
            />
          </div>

          {/* 미리보기 */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="mb-2 text-sm font-medium text-gray-700">입력 정보 미리보기</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <p><span className="font-medium">주소:</span> {formData.address1Depth || '(미입력)'} {formData.address2Depth || '(미입력)'} {formData.address3Depth}</p>
              <p><span className="font-medium">세대 유형:</span> {
                formData.householdType ? 
                householdTypeOptions.find(opt => opt.value === formData.householdType)?.label : 
                '(미선택)'
              }</p>
              {formData.memo && <p><span className="font-medium">메모:</span> {formData.memo}</p>}
            </div>
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="flex gap-3 justify-end pt-6 mt-8 border-t border-border">
          <button
            type="button"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="flex gap-2 items-center px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 neu-raised hover:animate-click-feedback disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="w-4 h-4" />
            취소
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex gap-2 items-center px-6 py-2 text-sm font-medium rounded-xl transition-all duration-200 text-primary-foreground bg-primary neu-raised-primary hover:animate-click-feedback disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            {isSubmitting ? '등록 중...' : '세대 등록'}
          </button>
        </div>
      </form>
    </div>
  );
}
// #endregion 