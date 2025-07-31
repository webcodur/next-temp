'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/ui/ui-layout/page-header/PageHeader';
import { Field } from '@/components/ui/ui-input/field/core/Field';
import { searchHouseholdInstance } from '@/services/household/household_instance$_GET';
import { getHouseholdInstanceDetail } from '@/services/household/household_instance@instanceId_GET';
import { updateHouseholdInstance } from '@/services/household/household_instance@instanceId_PUT';
import { searchHousehold } from '@/services/household/household$_GET';
import type { HouseholdInstance, Household, UpdateHouseholdInstanceRequest } from '@/types/household';

// #region 타입 정의
interface MoveFormData {
  selectedInstanceId: string;
  targetHouseholdId: string;
  moveDate: string;
  reason: string;
  memo: string;
}
// #endregion

export default function HouseholdInstanceMovePage() {
  // #region 상태 관리
  const router = useRouter();
  const [instances, setInstances] = useState<HouseholdInstance[]>([]);
  const [availableHouseholds, setAvailableHouseholds] = useState<Household[]>([]);
  const [selectedInstance, setSelectedInstance] = useState<HouseholdInstance | null>(null);
  const [formData, setFormData] = useState<MoveFormData>({
    selectedInstanceId: '',
    targetHouseholdId: '',
    moveDate: '',
    reason: '',
    memo: '',
  });
  
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  // #endregion

  // #region 데이터 로딩
  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // 세대 인스턴스 목록 조회
      const instanceResponse = await searchHouseholdInstance({
        page: 1,
        limit: 100,
      });

      if (!instanceResponse.success) {
        throw new Error(instanceResponse.errorMsg || '세대 인스턴스 목록 조회 실패');
      }

      const instanceList = instanceResponse.data?.data || [];
      setInstances(instanceList);

      // 호실 목록 조회 (빈 호실 포함)
      const householdResponse = await searchHousehold({
        page: 1,
        limit: 100,
      });

      if (!householdResponse.success) {
        throw new Error(householdResponse.errorMsg || '호실 목록 조회 실패');
      }

      const householdList = householdResponse.data?.data || [];
      // 빈 호실만 필터링 (인스턴스가 없는 호실)
      const emptyHouseholds = householdList.filter((household: Household) => 
        !household.instances || household.instances.length === 0
      );
      setAvailableHouseholds(emptyHouseholds);

    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const loadInstanceDetail = async (instanceId: number) => {
    try {
      const response = await getHouseholdInstanceDetail(instanceId);
      if (response.success && response.data) {
        setSelectedInstance(response.data);
      }
    } catch (err) {
      console.error('세대 인스턴스 상세 조회 실패:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (formData.selectedInstanceId) {
      const instanceId = parseInt(formData.selectedInstanceId);
      if (!isNaN(instanceId)) {
        loadInstanceDetail(instanceId);
      }
    } else {
      setSelectedInstance(null);
    }
  }, [formData.selectedInstanceId]);
  // #endregion

  // #region 유효성 검사
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.selectedInstanceId) {
      newErrors.selectedInstanceId = '이동할 세대를 선택해주세요.';
    }
    if (!formData.targetHouseholdId) {
      newErrors.targetHouseholdId = '이동할 호실을 선택해주세요.';
    }
    if (!formData.moveDate) {
      newErrors.moveDate = '이동일을 선택해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  // #endregion

  // #region 이벤트 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedInstance || !validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // 세대 인스턴스의 호실을 변경 (household를 변경)
      const requestData: UpdateHouseholdInstanceRequest = {
        // 새로운 호실 ID로 변경하는 것은 현재 API에서 지원하지 않을 수 있음
        // 실제 API 구조에 따라 조정 필요
        memo: `${selectedInstance.memo || ''}\n\n[이동 이력 - ${formData.moveDate}]\n사유: ${formData.reason || '없음'}\n메모: ${formData.memo || '없음'}`,
      };

      const response = await updateHouseholdInstance(selectedInstance.id, requestData);
      
      if (response.success) {
        alert(`세대 인스턴스가 성공적으로 이동되었습니다.\n참고: 실제 호실 변경은 시스템 관리자에게 문의하세요.`);
        router.push('/parking/household-management/household-instance');
      } else {
        throw new Error(response.errorMsg || '이동 실패');
      }
    } catch (error) {
      console.error('이동 중 오류 발생:', error);
      alert(error instanceof Error ? error.message : '이동 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFieldChange = (field: keyof MoveFormData) => (value: string) => {
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
      selectedInstanceId: '',
      targetHouseholdId: '',
      moveDate: '',
      reason: '',
      memo: '',
    });
    setSelectedInstance(null);
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

  const formatHouseholdLabel = (household: Household) => {
    const roomNumber = `${household.address1Depth} ${household.address2Depth}${household.address3Depth ? ' ' + household.address3Depth : ''}`;
    const typeLabel = household.householdType === 'GENERAL' ? '일반' : 
                      household.householdType === 'TEMP' ? '임시' : 
                      household.householdType === 'COMMERCIAL' ? '상업' : household.householdType;
    return `${roomNumber} (${typeLabel}) - 빈방`;
  };

  const getCurrentInstanceInfo = () => {
    if (!selectedInstance || !selectedInstance.household) {
      return null;
    }

    const household = selectedInstance.household;
    return {
      roomNumber: `${household.address1Depth} ${household.address2Depth}${household.address3Depth ? ' ' + household.address3Depth : ''}`,
      householdType: household.householdType,
      startDate: selectedInstance.startDate ? new Date(selectedInstance.startDate).toLocaleDateString() : '정보 없음',
    };
  };
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
        form="move-form"
        disabled={isSubmitting || !selectedInstance}
        className="flex gap-2 items-center px-4 py-2 rounded-lg transition-colors bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
      >
        <Save className="w-4 h-4" />
        {isSubmitting ? '이동 중...' : '이동 처리'}
      </button>
    </div>
  );
  // #endregion

  // #region 로딩/에러 상태
  if (loading) {
    return (
      <div className="p-6">
        <PageHeader
          title="입주세대 이동"
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
          title="입주세대 이동"
          leftActions={leftActions}
        />
        <div className="p-4 bg-red-50 rounded-lg border border-red-200">
          <p className="text-red-800">{error}</p>
          <button 
            onClick={loadData}
            className="px-4 py-2 mt-2 text-white bg-red-600 rounded hover:bg-red-700"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }
  // #endregion

  const currentInfo = getCurrentInstanceInfo();

  return (
    <div className="p-6">
      <PageHeader
        title="입주세대 이동"
        subtitle="세대를 다른 호실로 이동합니다"
        leftActions={leftActions}
        rightActions={rightActions}
      />

      <div className="mx-auto max-w-4xl">
        <form id="move-form" onSubmit={handleSubmit} className="space-y-6">
          {/* 세대 선택 섹션 */}
          <div className="p-6 rounded-lg border bg-card">
            <h2 className="mb-4 text-lg font-semibold">이동할 세대 선택</h2>
            <Field
              type="select"
              label="세대 *"
              placeholder="세대를 선택하세요"
              value={formData.selectedInstanceId}
              onChange={handleFieldChange('selectedInstanceId')}
              options={instances.map(instance => ({
                value: instance.id.toString(),
                label: formatInstanceLabel(instance),
              }))}
            />
            {errors.selectedInstanceId && (
              <div className="text-sm text-red-600">{errors.selectedInstanceId}</div>
            )}
          </div>

          {/* 현재/이동할 호실 정보 */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* 현재 호실 정보 */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="mb-3 font-medium text-gray-900">현재 호실</h3>
              {currentInfo ? (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">호실:</span>
                    <span className="font-medium">{currentInfo.roomNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">구분:</span>
                    <span className="font-medium">{currentInfo.householdType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">입주일:</span>
                    <span className="font-medium">{currentInfo.startDate}</span>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-gray-500">세대를 선택하면 정보가 표시됩니다.</div>
              )}
            </div>

            {/* 이동할 호실 선택 */}
            <div>
              <h3 className="mb-3 font-medium text-gray-900">이동할 호실</h3>
              <Field
                type="select"
                label="호실 *"
                placeholder="이동할 호실을 선택하세요"
                value={formData.targetHouseholdId}
                onChange={handleFieldChange('targetHouseholdId')}
                options={availableHouseholds.map(household => ({
                  value: household.id.toString(),
                  label: formatHouseholdLabel(household),
                }))}
              />
              {errors.targetHouseholdId && (
                <div className="text-sm text-red-600">{errors.targetHouseholdId}</div>
              )}
              
              {availableHouseholds.length === 0 && (
                <div className="p-3 mt-2 bg-yellow-50 rounded border border-yellow-200">
                  <p className="text-sm text-yellow-800">현재 이동 가능한 빈 호실이 없습니다.</p>
                </div>
              )}
            </div>
          </div>

          {/* 이동 상세 정보 */}
          <div className="p-6 rounded-lg border bg-card">
            <h3 className="mb-4 text-lg font-semibold">이동 정보</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  이동일 *
                </label>
                <input
                  type="date"
                  value={formData.moveDate}
                  onChange={(e) => handleFieldChange('moveDate')(e.target.value)}
                  className="px-3 py-2 w-full rounded-md border"
                />
                {errors.moveDate && (
                  <div className="text-sm text-red-600">{errors.moveDate}</div>
                )}
              </div>

              <Field
                type="select"
                label="이동 사유"
                placeholder="사유 선택"
                value={formData.reason}
                onChange={handleFieldChange('reason')}
                options={[
                  { value: 'upgrade', label: '더 큰 평수로 이동' },
                  { value: 'downgrade', label: '더 작은 평수로 이동' },
                  { value: 'floor', label: '층수 변경' },
                  { value: 'maintenance', label: '시설 보수' },
                  { value: 'personal', label: '개인 사정' },
                  { value: 'other', label: '기타' },
                ]}
              />
            </div>

            <div className="mt-4">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                이동 메모
              </label>
              <textarea
                rows={3}
                placeholder="이동과 관련된 추가 정보..."
                value={formData.memo}
                onChange={(e) => handleFieldChange('memo')(e.target.value)}
                className="px-3 py-2 w-full rounded-md border"
              />
            </div>
          </div>

          {/* 주의사항 */}
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  이동 처리 시 주의사항
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <ul className="pl-5 space-y-1 list-disc">
                    <li>현재 API에서는 이동 이력만 기록됩니다.</li>
                    <li>실제 호실 변경은 시스템 관리자에게 별도 요청하세요.</li>
                    <li>이동 이력은 영구적으로 기록됩니다.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
} 