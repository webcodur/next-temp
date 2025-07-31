'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import PageHeader from '@/components/ui/ui-layout/page-header/PageHeader';
import { Field } from '@/components/ui/ui-input/field/core/Field';
import { createResident } from '@/services/resident/resident_POST';
import { createResidentHousehold } from '@/services/resident/resident_household_POST';
import { searchHouseholdInstance } from '@/services/household/household_instance$_GET';
import type { CreateResidentRequest } from '@/services/resident/resident_POST';
import type { CreateResidentHouseholdRequest } from '@/services/resident/resident_household_POST';
import type { HouseholdInstance } from '@/types/household';

// #region 타입 정의
interface ResidentFormData {
  name: string;
  phone: string;
  email: string;
  birthDate: string;
  gender: 'M' | 'F' | '';
  emergencyContact: string;
  memo: string;
  // 세대 관계 정보
  householdInstanceId: string;
  relationship: 'HEAD' | 'SPOUSE' | 'CHILD' | 'PARENT' | 'OTHER' | '';
  householdMemo: string;
}
// #endregion

export default function ResidentCreatePage() {
  // #region 상태 관리
  const router = useRouter();
  const searchParams = useSearchParams();
  const preSelectedInstanceId = searchParams.get('instanceId');
  
  const [householdInstances, setHouseholdInstances] = useState<HouseholdInstance[]>([]);
  const [formData, setFormData] = useState<ResidentFormData>({
    name: '',
    phone: '',
    email: '',
    birthDate: '',
    gender: '',
    emergencyContact: '',
    memo: '',
    householdInstanceId: preSelectedInstanceId || '',
    relationship: '',
    householdMemo: '',
  });
  
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  // #endregion

  // #region 데이터 로딩
  const loadHouseholdInstances = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await searchHouseholdInstance({
        page: 1,
        limit: 100, // 충분히 많은 수를 가져와서 모든 세대 표시
      });

      if (response.success && response.data) {
        setHouseholdInstances(response.data.data || []);
      } else {
        throw new Error(response.errorMsg || '세대 목록 조회 실패');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
      setHouseholdInstances([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHouseholdInstances();
  }, []);
  // #endregion

  // #region 유효성 검사
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = '이름을 입력해주세요.';
    }
    if (formData.phone && !/^010-\d{4}-\d{4}$/.test(formData.phone)) {
      newErrors.phone = '연락처는 010-0000-0000 형식으로 입력해주세요.';
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식으로 입력해주세요.';
    }
    if (!formData.householdInstanceId) {
      newErrors.householdInstanceId = '세대를 선택해주세요.';
    }
    if (!formData.relationship) {
      newErrors.relationship = '관계를 선택해주세요.';
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
      // 1. 먼저 거주자를 생성
      const residentData: CreateResidentRequest = {
        name: formData.name,
        phone: formData.phone || undefined,
        email: formData.email || undefined,
        birthDate: formData.birthDate || undefined,
        gender: formData.gender || undefined,
        emergencyContact: formData.emergencyContact || undefined,
        memo: formData.memo || undefined,
      };

      const residentResponse = await createResident(residentData);
      
      if (!residentResponse.success) {
        throw new Error(residentResponse.errorMsg || '거주자 생성 실패');
      }

      const residentId = residentResponse.data!.id;

      // 2. 거주자-세대 관계 생성
      const householdData: CreateResidentHouseholdRequest = {
        residentId: residentId,
        householdInstanceId: parseInt(formData.householdInstanceId),
        relationship: formData.relationship as 'HEAD' | 'SPOUSE' | 'CHILD' | 'PARENT' | 'OTHER',
        memo: formData.householdMemo || undefined,
      };

      const householdResponse = await createResidentHousehold(householdData);
      
      if (!householdResponse.success) {
        throw new Error(householdResponse.errorMsg || '세대 관계 생성 실패');
      }

      alert('거주자가 성공적으로 등록되었습니다.');
      router.push('/parking/household-management/resident');
    } catch (error) {
      console.error('등록 중 오류 발생:', error);
      alert(error instanceof Error ? error.message : '등록 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFieldChange = (field: keyof ResidentFormData) => (value: string) => {
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
      name: '',
      phone: '',
      email: '',
      birthDate: '',
      gender: '',
      emergencyContact: '',
      memo: '',
      householdInstanceId: preSelectedInstanceId || '',
      relationship: '',
      householdMemo: '',
    });
    setErrors({});
  };
  // #endregion

  // #region 유틸리티 함수
  const formatInstanceLabel = (instance: HouseholdInstance) => {
    const roomNumber = instance.household ? 
      `${instance.household.address1Depth} ${instance.household.address2Depth}${instance.household.address3Depth ? ' ' + instance.household.address3Depth : ''}` : 
      '정보 없음';
    const instanceName = instance.instanceName || '세대명 없음';
    return `${instanceName} (${roomNumber})`;
  };
  // #endregion

  // #region 페이지 액션
  const leftActions = (
    <Link
      href="/parking/household-management/resident"
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
        form="resident-create-form"
        disabled={isSubmitting}
        className="flex gap-2 items-center px-4 py-2 rounded-lg transition-colors bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
      >
        <Save className="w-4 h-4" />
        {isSubmitting ? '등록 중...' : '등록'}
      </button>
    </div>
  );
  // #endregion

  // #region 로딩/에러 상태
  if (loading) {
    return (
      <div className="p-6">
        <PageHeader
          title="거주자 등록"
          leftActions={leftActions}
        />
        <div className="p-8 text-center">
          <div className="text-muted-foreground">로딩 중...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <PageHeader
          title="거주자 등록"
          leftActions={leftActions}
        />
        <div className="p-4 bg-red-50 rounded-lg border border-red-200">
          <p className="text-red-800">{error}</p>
          <button 
            onClick={loadHouseholdInstances}
            className="px-4 py-2 mt-2 text-white bg-red-600 rounded hover:bg-red-700"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }
  // #endregion

  return (
    <div className="p-6">
      <PageHeader
        title="거주자 등록"
        subtitle="새로운 거주자를 등록합니다"
        leftActions={leftActions}
        rightActions={rightActions}
      />

      <div className="mx-auto max-w-2xl">
        <form id="resident-create-form" onSubmit={handleSubmit} className="space-y-6">
          {/* 세대 선택 섹션 */}
          <div className="p-6 rounded-lg border bg-card">
            <h3 className="mb-4 text-lg font-semibold">세대 선택</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field
                type="select"
                label="세대 *"
                placeholder="세대를 선택하세요"
                value={formData.householdInstanceId}
                onChange={handleFieldChange('householdInstanceId')}
                options={householdInstances.map(instance => ({
                  value: instance.id.toString(),
                  label: formatInstanceLabel(instance),
                }))}
              />
              {errors.householdInstanceId && (
                <div className="col-span-full text-sm text-red-600">{errors.householdInstanceId}</div>
              )}
              
              <Field
                type="select"
                label="관계 *"
                placeholder="관계 선택"
                value={formData.relationship}
                onChange={handleFieldChange('relationship')}
                options={[
                  { value: 'HEAD', label: '세대주' },
                  { value: 'SPOUSE', label: '배우자' },
                  { value: 'CHILD', label: '자녀' },
                  { value: 'PARENT', label: '부모' },
                  { value: 'OTHER', label: '기타' },
                ]}
              />
              {errors.relationship && (
                <div className="col-span-full text-sm text-red-600">{errors.relationship}</div>
              )}
            </div>
          </div>

          {/* 기본 정보 섹션 */}
          <div className="p-6 rounded-lg border bg-card">
            <h3 className="mb-4 text-lg font-semibold">기본 정보</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field
                type="text"
                label="이름 *"
                placeholder="이름을 입력하세요"
                value={formData.name}
                onChange={handleFieldChange('name')}
              />
              {errors.name && (
                <div className="col-span-full text-sm text-red-600">{errors.name}</div>
              )}
              
              <Field
                type="select"
                label="성별"
                placeholder="성별 선택"
                value={formData.gender}
                onChange={handleFieldChange('gender')}
                options={[
                  { value: 'M', label: '남성' },
                  { value: 'F', label: '여성' },
                ]}
              />
              
              <Field
                type="text"
                label="연락처"
                placeholder="010-0000-0000"
                value={formData.phone}
                onChange={handleFieldChange('phone')}
              />
              {errors.phone && (
                <div className="col-span-full text-sm text-red-600">{errors.phone}</div>
              )}
              
              <Field
                type="email"
                label="이메일"
                placeholder="example@email.com"
                value={formData.email}
                onChange={handleFieldChange('email')}
              />
              {errors.email && (
                <div className="col-span-full text-sm text-red-600">{errors.email}</div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  생년월일
                </label>
                <input
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => handleFieldChange('birthDate')(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              
              <Field
                type="text"
                label="비상연락처"
                placeholder="010-0000-0000"
                value={formData.emergencyContact}
                onChange={handleFieldChange('emergencyContact')}
              />
            </div>
          </div>

          {/* 추가 정보 섹션 */}
          <div className="p-6 rounded-lg border bg-card">
            <h3 className="mb-4 text-lg font-semibold">추가 정보</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  개인 메모
                </label>
                <textarea
                  placeholder="거주자 개인 특이사항이나 추가 정보를 입력하세요"
                  value={formData.memo}
                  onChange={(e) => handleFieldChange('memo')(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  세대 관계 메모
                </label>
                <textarea
                  placeholder="세대 내 관계에 대한 특이사항이나 추가 정보를 입력하세요"
                  value={formData.householdMemo}
                  onChange={(e) => handleFieldChange('householdMemo')(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
            </div>
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