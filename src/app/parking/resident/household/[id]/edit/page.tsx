'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Save, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import FieldText from '@/components/ui/ui-input/field/text/FieldText';
import FieldSelect from '@/components/ui/ui-input/field/select/FieldSelect';
import { getHouseholdDetail } from '@/services/household/household@id_GET';
import { updateHousehold } from '@/services/household/household@id_PUT';
import type { Household, UpdateHouseholdRequest, HouseholdType } from '@/types/household';

// #region Types
interface EditHouseholdForm {
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
function validateForm(formData: EditHouseholdForm): FormErrors {
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
export default function EditHouseholdPage() {
  const router = useRouter();
  const params = useParams();
  const householdId = parseInt(params.id as string);
  
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [household, setHousehold] = useState<Household | null>(null);
  const [formData, setFormData] = useState<EditHouseholdForm>({
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

  useEffect(() => {
    const fetchHousehold = async () => {
      try {
        const result = await getHouseholdDetail(householdId);
        
        if (result.success && result.data) {
          const householdData = result.data as Household;
          setHousehold(householdData);
          setFormData({
            address1Depth: householdData.address1Depth,
            address2Depth: householdData.address2Depth,
            address3Depth: householdData.address3Depth || '',
            householdType: householdData.householdType,
            memo: householdData.memo || ''
          });
        } else {
          console.error('세대 정보 조회 실패:', result.errorMsg);
          setHousehold(null);
        }
      } catch (error) {
        console.error('세대 정보 조회 중 오류:', error);
        setHousehold(null);
      } finally {
        setLoading(false);
      }
    };

    fetchHousehold();
  }, [householdId]);

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
      const requestData: UpdateHouseholdRequest = {
        address1Depth: formData.address1Depth,
        address2Depth: formData.address2Depth,
        address3Depth: formData.address3Depth || undefined,
        householdType: formData.householdType as HouseholdType,
        memo: formData.memo || undefined
      };

      const result = await updateHousehold(householdId, requestData);
      
      if (result.success) {
        alert('세대 정보가 성공적으로 수정되었습니다.');
        router.push(`/parking/household/${householdId}`);
      } else {
        alert(`세대 수정 실패: ${result.errorMsg}`);
      }
    } catch (error) {
      console.error('세대 수정 중 오류:', error);
      alert('세대 수정 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (confirm('작성중인 내용이 사라집니다. 정말로 취소하시겠습니까?')) {
      router.push(`/parking/household/${householdId}`);
    }
  };

  const updateFormData = (field: keyof EditHouseholdForm) => (value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // 해당 필드의 에러 제거
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-muted-foreground">로딩 중...</div>
      </div>
    );
  }

  if (!household) {
    return (
      <div className="p-6 space-y-6 font-multilang animate-fadeIn">
        <div className="p-6 rounded-xl neu-flat">
          <div className="flex gap-4 items-center">
            <button
              onClick={() => router.push('/parking/household')}
              className="p-3 rounded-xl transition-all duration-200 neu-raised hover:animate-click-feedback"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">세대를 찾을 수 없습니다</h1>
              <p className="mt-1 text-sm text-muted-foreground">요청하신 세대 정보가 존재하지 않습니다</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 font-multilang animate-fadeIn">
      {/* 페이지 헤더 */}
      <div className="p-6 rounded-xl neu-flat">
        <div className="flex gap-4 items-center">
          <button
            onClick={() => router.push(`/parking/household/${householdId}`)}
            className="p-3 rounded-xl transition-all duration-200 neu-raised hover:animate-click-feedback"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">세대 정보 수정</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {household.address1Depth} {household.address2Depth} 정보를 수정합니다
            </p>
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
            <h3 className="mb-2 text-sm font-medium text-gray-700">수정 정보 미리보기</h3>
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

          {/* 변경사항 표시 */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="mb-2 text-sm font-medium text-blue-700">변경사항</h3>
            <div className="space-y-1 text-sm text-blue-600">
              {formData.address1Depth !== household.address1Depth && (
                <p>• 동: {household.address1Depth} → {formData.address1Depth}</p>
              )}
              {formData.address2Depth !== household.address2Depth && (
                <p>• 호수: {household.address2Depth} → {formData.address2Depth}</p>
              )}
              {formData.address3Depth !== (household.address3Depth || '') && (
                <p>• 기타: {household.address3Depth || '(없음)'} → {formData.address3Depth || '(없음)'}</p>
              )}
              {formData.householdType !== household.householdType && (
                <p>• 세대 유형: {householdTypeOptions.find(opt => opt.value === household.householdType)?.label} → {householdTypeOptions.find(opt => opt.value === formData.householdType)?.label}</p>
              )}
              {formData.memo !== (household.memo || '') && (
                <p>• 메모: {household.memo || '(없음)'} → {formData.memo || '(없음)'}</p>
              )}
            </div>
            {JSON.stringify(formData) === JSON.stringify({
              address1Depth: household.address1Depth,
              address2Depth: household.address2Depth,
              address3Depth: household.address3Depth || '',
              householdType: household.householdType,
              memo: household.memo || ''
            }) && (
              <p className="text-sm text-blue-600">변경사항이 없습니다.</p>
            )}
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
            {isSubmitting ? '저장 중...' : '변경사항 저장'}
          </button>
        </div>
      </form>
    </div>
  );
}
// #endregion 