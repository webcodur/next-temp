'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import PageHeader from '@/components/ui/ui-layout/page-header/PageHeader';
import { Field } from '@/components/ui/ui-input/field/core/Field';
import { searchHousehold } from '@/services/household/household$_GET';
import { createHouseholdInstance } from '@/services/household/household@id_instance_POST';
import type { Household, CreateHouseholdInstanceRequest } from '@/types/household';

// #region 타입 정의
interface HouseholdInstanceFormData {
  householdId: string;
  instanceName: string;
  password: string;
  startDate: string;
  endDate: string;
  memo: string;
}
// #endregion

export default function HouseholdInstanceCreatePage() {
  // #region 상태 관리
  const router = useRouter();
  const searchParams = useSearchParams();
  const preSelectedHouseholdId = searchParams.get('householdId');
  
  const [households, setHouseholds] = useState<Household[]>([]);
  const [formData, setFormData] = useState<HouseholdInstanceFormData>({
    householdId: preSelectedHouseholdId || '',
    instanceName: '',
    password: '',
    startDate: '',
    endDate: '',
    memo: '',
  });
  
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  // #endregion

  // #region 데이터 로딩
  const loadHouseholds = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await searchHousehold({
        page: 1,
        limit: 100, // 충분히 많은 수를 가져와서 모든 호실을 표시
      });

      if (response.success && response.data) {
        setHouseholds(response.data.households || []);
      } else {
        throw new Error(response.errorMsg || '호실 목록 조회 실패');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
      setHouseholds([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHouseholds();
  }, []);
  // #endregion

  // #region 유효성 검사
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.householdId) {
      newErrors.householdId = '호실을 선택해주세요.';
    }
    if (!formData.instanceName.trim()) {
      newErrors.instanceName = '세대명을 입력해주세요.';
    }
    if (!formData.password.trim()) {
      newErrors.password = '비밀번호를 입력해주세요.';
    }
    if (!formData.startDate) {
      newErrors.startDate = '입주일을 선택해주세요.';
    }
    if (formData.endDate && formData.startDate && new Date(formData.endDate) <= new Date(formData.startDate)) {
      newErrors.endDate = '퇴거 예정일은 입주일보다 이후여야 합니다.';
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
      const householdId = parseInt(formData.householdId);
      if (isNaN(householdId)) {
        throw new Error('잘못된 호실 ID입니다.');
      }

      const requestData: CreateHouseholdInstanceRequest = {
        instanceName: formData.instanceName || undefined,
        password: formData.password,
        startDate: formData.startDate || undefined,
        endDate: formData.endDate || undefined,
        memo: formData.memo || undefined,
      };

      const response = await createHouseholdInstance(householdId, requestData);
      
      if (response.success) {
        alert('입주세대가 성공적으로 등록되었습니다.');
        router.push('/parking/household-management/household-instance');
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

  const handleFieldChange = (field: keyof HouseholdInstanceFormData) => (value: string) => {
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
      householdId: preSelectedHouseholdId || '',
      instanceName: '',
      password: '',
      startDate: '',
      endDate: '',
      memo: '',
    });
    setErrors({});
  };
  // #endregion

  // #region 유틸리티 함수
  const formatRoomNumber = (household: Household) => {
    return `${household.address1Depth} ${household.address2Depth}${household.address3Depth ? ' ' + household.address3Depth : ''}`;
  };

  const getHouseholdTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      GENERAL: '일반',
      TEMP: '임시',
      COMMERCIAL: '상업',
    };
    return typeMap[type] || type;
  };

  // 빈 호실 필터링 (인스턴스가 없는 호실)
  const availableHouseholds = households.filter(household => 
    !household.instances || household.instances.length === 0
  );
  // #endregion

  // #region 페이지 액션
  const leftActions = (
    <Link
      href="/parking/household-management/household-instance"
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
        form="instance-create-form"
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
          title="입주세대 등록"
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
          title="입주세대 등록"
          leftActions={leftActions}
        />
        <div className="p-4 bg-red-50 rounded-lg border border-red-200">
          <p className="text-red-800">{error}</p>
          <button 
            onClick={loadHouseholds}
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
        title="입주세대 등록"
        subtitle="새로운 입주세대를 등록합니다"
        leftActions={leftActions}
        rightActions={rightActions}
      />

      <div className="mx-auto max-w-2xl">
        <form id="instance-create-form" onSubmit={handleSubmit} className="space-y-6">
          {/* 호실 선택 섹션 */}
          <div className="p-6 rounded-lg border bg-card">
            <h3 className="mb-4 text-lg font-semibold">호실 선택</h3>
            <Field
              type="select"
              label="호실 *"
              placeholder="호실을 선택하세요"
              value={formData.householdId}
              onChange={handleFieldChange('householdId')}
              options={availableHouseholds.map(household => ({
                value: household.id.toString(),
                label: `${formatRoomNumber(household)} (${getHouseholdTypeLabel(household.householdType)})`,
              }))}
            />
            {errors.householdId && (
              <div className="text-sm text-red-600">{errors.householdId}</div>
            )}
            
            {availableHouseholds.length === 0 && (
              <div className="p-4 mt-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-yellow-800">현재 입주 가능한 호실이 없습니다.</p>
              </div>
            )}
          </div>

          {/* 기본 정보 섹션 */}
          <div className="p-6 rounded-lg border bg-card">
            <h3 className="mb-4 text-lg font-semibold">기본 정보</h3>
            <div className="grid grid-cols-1 gap-4">
              <Field
                type="text"
                label="세대명 *"
                placeholder="세대명을 입력하세요"
                value={formData.instanceName}
                onChange={handleFieldChange('instanceName')}
              />
              {errors.instanceName && (
                <div className="text-sm text-red-600">{errors.instanceName}</div>
              )}
              
              <Field
                type="password"
                label="비밀번호 *"
                placeholder="비밀번호를 입력하세요"
                value={formData.password}
                onChange={handleFieldChange('password')}
              />
              {errors.password && (
                <div className="text-sm text-red-600">{errors.password}</div>
              )}
            </div>
          </div>

          {/* 거주 기간 섹션 */}
          <div className="p-6 rounded-lg border bg-card">
            <h3 className="mb-4 text-lg font-semibold">거주 기간</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  입주일 *
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleFieldChange('startDate')(e.target.value)}
                  className="px-3 py-2 w-full rounded-md border"
                />
              </div>
              {errors.startDate && (
                <div className="col-span-full text-sm text-red-600">{errors.startDate}</div>
              )}
              
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  퇴거 예정일
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleFieldChange('endDate')(e.target.value)}
                  className="px-3 py-2 w-full rounded-md border"
                />
              </div>
              {errors.endDate && (
                <div className="col-span-full text-sm text-red-600">{errors.endDate}</div>
              )}
            </div>
          </div>

          {/* 추가 정보 섹션 */}
          <div className="p-6 rounded-lg border bg-card">
            <h3 className="mb-4 text-lg font-semibold">추가 정보</h3>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                메모
              </label>
              <textarea
                placeholder="특이사항이나 추가 정보를 입력하세요"
                value={formData.memo}
                onChange={(e) => handleFieldChange('memo')(e.target.value)}
                rows={3}
                className="px-3 py-2 w-full rounded-md border"
              />
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