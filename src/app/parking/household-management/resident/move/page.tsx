'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/ui/ui-layout/page-header/PageHeader';
import { Field } from '@/components/ui/ui-input/field/core/Field';
import { searchResident } from '@/services/resident/resident$_GET';
import { getResidentDetail } from '@/services/resident/resident@id_GET';
import { searchHouseholdInstance } from '@/services/household/household_instance$_GET';
import { moveResident } from '@/services/resident/resident_move_POST';
import type { ResidentDto } from '@/services/resident/resident$_GET';
import type { ResidentDetailResponse } from '@/services/resident/resident@id_GET';
import type { MoveResidentRequest } from '@/services/resident/resident_move_POST';
import type { HouseholdInstance } from '@/types/household';

// #region 타입 정의
interface MoveFormData {
  selectedResidentId: string;
  targetInstanceId: string;
  relationship: 'HEAD' | 'SPOUSE' | 'CHILD' | 'PARENT' | 'OTHER' | '';
  moveDate: string;
  reason: string;
  memo: string;
}
// #endregion

export default function ResidentMovePage() {
  // #region 상태 관리
  const router = useRouter();
  const [residents, setResidents] = useState<ResidentDto[]>([]);
  const [householdInstances, setHouseholdInstances] = useState<HouseholdInstance[]>([]);
  const [selectedResident, setSelectedResident] = useState<ResidentDetailResponse | null>(null);
  const [formData, setFormData] = useState<MoveFormData>({
    selectedResidentId: '',
    targetInstanceId: '',
    relationship: '',
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
      // 거주자 목록 조회
      const residentResponse = await searchResident({
        page: 1,
        limit: 100,
      });

      if (!residentResponse.success) {
        throw new Error(residentResponse.errorMsg || '거주자 목록 조회 실패');
      }

      const residentList = residentResponse.data?.data || [];
      // 현재 세대에 속한 거주자만 필터링 (deletedAt이 null인 것)
      const activeResidents = residentList.filter((resident: ResidentDto) => !resident.deletedAt);
      setResidents(activeResidents);

      // 세대 인스턴스 목록 조회
      const instanceResponse = await searchHouseholdInstance({
        page: 1,
        limit: 100,
      });

      if (!instanceResponse.success) {
        throw new Error(instanceResponse.errorMsg || '세대 목록 조회 실패');
      }

      const instanceList = instanceResponse.data?.householdInstances || [];
      setHouseholdInstances(instanceList);

    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const loadResidentDetail = async (residentId: number) => {
    try {
      const response = await getResidentDetail(residentId);
      if (response.success && response.data) {
        setSelectedResident(response.data);
      }
    } catch (err) {
      console.error('거주자 상세 조회 실패:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (formData.selectedResidentId) {
      const residentId = parseInt(formData.selectedResidentId);
      if (!isNaN(residentId)) {
        loadResidentDetail(residentId);
      }
    } else {
      setSelectedResident(null);
    }
  }, [formData.selectedResidentId]);
  // #endregion

  // #region 유효성 검사
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.selectedResidentId) {
      newErrors.selectedResidentId = '이동할 거주자를 선택해주세요.';
    }
    if (!formData.targetInstanceId) {
      newErrors.targetInstanceId = '이동할 세대를 선택해주세요.';
    }
    if (!formData.relationship) {
      newErrors.relationship = '이동 후 관계를 선택해주세요.';
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
    
    if (!selectedResident || !validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const requestData: MoveResidentRequest = {
        residentId: selectedResident.id,
        targetHouseholdInstanceId: parseInt(formData.targetInstanceId),
        relationship: formData.relationship as 'HEAD' | 'SPOUSE' | 'CHILD' | 'PARENT' | 'OTHER',
        memo: `[이동 - ${formData.moveDate}] 사유: ${formData.reason || '없음'}\n${formData.memo || ''}`,
      };

      const response = await moveResident(requestData);
      
      if (response.success) {
        alert('거주자가 성공적으로 이동되었습니다.');
        router.push('/parking/household-management/resident');
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
      selectedResidentId: '',
      targetInstanceId: '',
      relationship: '',
      moveDate: '',
      reason: '',
      memo: '',
    });
    setSelectedResident(null);
    setErrors({});
  };
  // #endregion

  // #region 유틸리티 함수
  const formatResidentLabel = (resident: ResidentDto) => {
    const residentHouseholds = resident.residentHouseholds as unknown[] | undefined;
    const currentHousehold = residentHouseholds?.find((rh: unknown) => {
      const household = rh as Record<string, unknown>;
      return !household.deletedAt;
    }) as Record<string, unknown> | undefined;

    const roomNumber = currentHousehold?.householdInstance ? 
      (() => {
        const instance = currentHousehold.householdInstance as Record<string, unknown>;
        const hh = instance.household as Record<string, unknown>;
        return hh ? `${hh.address1Depth} ${hh.address2Depth}${hh.address3Depth ? ' ' + hh.address3Depth : ''}` : '정보 없음';
      })() : '정보 없음';
    
    const relationship = currentHousehold?.relationship as string || '관계 없음';
    return `${resident.name} (${relationship}, ${roomNumber})`;
  };

  const formatInstanceLabel = (instance: HouseholdInstance) => {
    const roomNumber = instance.household ? 
      `${instance.household.address1Depth} ${instance.household.address2Depth}${instance.household.address3Depth ? ' ' + instance.household.address3Depth : ''}` : 
      '정보 없음';
    const instanceName = instance.instanceName || '세대명 없음';
    return `${instanceName} (${roomNumber})`;
  };

  const getCurrentResidentInfo = () => {
    if (!selectedResident) {
      return null;
    }

    const residentHouseholds = selectedResident.residentHouseholds as unknown[] | undefined;
    const currentHousehold = residentHouseholds?.find((rh: unknown) => {
      const household = rh as Record<string, unknown>;
      return !household.deletedAt;
    }) as Record<string, unknown> | undefined;

    if (!currentHousehold) {
      return {
        instanceName: '세대 없음',
        roomNumber: '정보 없음',
        relationship: '관계 없음',
        startDate: '정보 없음',
      };
    }

    const instance = currentHousehold.householdInstance as Record<string, unknown> | undefined;
    const household = instance?.household as Record<string, unknown> | undefined;
    
    return {
      instanceName: (instance?.instanceName as string) || '세대명 없음',
      roomNumber: household ? 
        `${household.address1Depth} ${household.address2Depth}${household.address3Depth ? ' ' + household.address3Depth : ''}` : 
        '정보 없음',
      relationship: (currentHousehold.relationship as string) || '관계 없음',
      startDate: currentHousehold.createdAt ? 
        new Date(currentHousehold.createdAt as string).toLocaleDateString() : 
        '정보 없음',
    };
  };

  // 현재 거주자의 세대를 제외한 세대 목록
  const getAvailableInstances = () => {
    if (!selectedResident) return householdInstances;
    
    const residentHouseholds = selectedResident.residentHouseholds as unknown[] | undefined;
    const currentHousehold = residentHouseholds?.find((rh: unknown) => {
      const household = rh as Record<string, unknown>;
      return !household.deletedAt;
    }) as Record<string, unknown> | undefined;

    const currentInstanceId = currentHousehold?.householdInstance ? 
      (currentHousehold.householdInstance as Record<string, unknown>).id as number :
      null;

    return householdInstances.filter(instance => instance.id !== currentInstanceId);
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
        form="move-form"
        disabled={isSubmitting || !selectedResident}
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
          title="거주자 이동"
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
          title="거주자 이동"
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

  const currentInfo = getCurrentResidentInfo();
  const availableInstances = getAvailableInstances();

  return (
    <div className="p-6">
      <PageHeader
        title="거주자 이동"
        subtitle="거주자를 다른 세대로 이동합니다"
        leftActions={leftActions}
        rightActions={rightActions}
      />

      <div className="mx-auto max-w-4xl">
        <form id="move-form" onSubmit={handleSubmit} className="space-y-6">
          {/* 거주자 선택 섹션 */}
          <div className="p-6 rounded-lg border bg-card">
            <h2 className="mb-4 text-lg font-semibold">이동할 거주자 선택</h2>
            <Field
              type="select"
              label="거주자 *"
              placeholder="거주자를 선택하세요"
              value={formData.selectedResidentId}
              onChange={handleFieldChange('selectedResidentId')}
              options={residents.map(resident => ({
                value: resident.id.toString(),
                label: formatResidentLabel(resident),
              }))}
            />
            {errors.selectedResidentId && (
              <div className="text-sm text-red-600">{errors.selectedResidentId}</div>
            )}
          </div>

          {/* 현재/이동할 세대 정보 */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* 현재 세대 정보 */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="mb-3 font-medium text-gray-900">현재 세대</h3>
              {currentInfo ? (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">세대:</span>
                    <span className="font-medium">{currentInfo.instanceName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">호실:</span>
                    <span className="font-medium">{currentInfo.roomNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">관계:</span>
                    <span className="font-medium">{currentInfo.relationship}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">입주일:</span>
                    <span className="font-medium">{currentInfo.startDate}</span>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-gray-500">거주자를 선택하면 정보가 표시됩니다.</div>
              )}
            </div>

            {/* 이동할 세대 선택 */}
            <div>
              <h3 className="mb-3 font-medium text-gray-900">이동할 세대</h3>
              <Field
                type="select"
                label="세대 *"
                placeholder="이동할 세대를 선택하세요"
                value={formData.targetInstanceId}
                onChange={handleFieldChange('targetInstanceId')}
                options={availableInstances.map(instance => ({
                  value: instance.id.toString(),
                  label: formatInstanceLabel(instance),
                }))}
              />
              {errors.targetInstanceId && (
                <div className="text-sm text-red-600">{errors.targetInstanceId}</div>
              )}
              
              <div className="mt-3">
                <Field
                  type="select"
                  label="이동 후 관계 *"
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
                  <div className="text-sm text-red-600">{errors.relationship}</div>
                )}
              </div>

              {availableInstances.length === 0 && (
                <div className="p-3 mt-2 bg-yellow-50 rounded border border-yellow-200">
                  <p className="text-sm text-yellow-800">현재 이동 가능한 세대가 없습니다.</p>
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
                  { value: 'marriage', label: '결혼' },
                  { value: 'divorce', label: '이혼' },
                  { value: 'work', label: '직장 사정' },
                  { value: 'study', label: '학업' },
                  { value: 'family', label: '가족 사정' },
                  { value: 'health', label: '건강 상태' },
                  { value: 'financial', label: '경제적 사정' },
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
                    <li>이동 처리 후에는 되돌릴 수 없습니다.</li>
                    <li>모든 관련 데이터가 자동으로 업데이트됩니다.</li>
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