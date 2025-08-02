'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/ui/ui-layout/page-header/PageHeader';
import HouseholdInfoForm from './components/HouseholdInfoForm';
import HouseholdInstancesList from './components/HouseholdInstancesList';
import { HouseholdFormData } from './types';
import { getHouseholdDetail } from '@/services/household/household@id_GET';
import { getHouseholdInstanceList } from '@/services/household/household@id_instance_GET';
import { updateHousehold } from '@/services/household/household@id_PUT';
import { deleteHousehold } from '@/services/household/household@id_DELETE';
import type { Household, HouseholdInstance, HouseholdType, UpdateHouseholdRequest } from '@/types/household';

interface HouseholdDetailViewProps {
  householdId: string;
}

export default function HouseholdDetailView({ householdId }: HouseholdDetailViewProps) {
  // #region 상태 관리
  const router = useRouter();
  const [household, setHousehold] = useState<Household | null>(null);
  const [instances, setInstances] = useState<HouseholdInstance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<HouseholdFormData>({
    lv1Address: '',
    lv2Address: '',
    lv3Address: '',
    householdType: '',
    memo: '',
  });
  const [originalData, setOriginalData] = useState<HouseholdFormData>({
    lv1Address: '',
    lv2Address: '',
    lv3Address: '',
    householdType: '',
    memo: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  // #endregion

  // #region 데이터 로딩
  const loadHouseholdDetail = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const id = parseInt(householdId);
      if (isNaN(id)) {
        throw new Error('잘못된 호실 ID입니다.');
      }

      // 호실 상세 정보 조회
      const householdResponse = await getHouseholdDetail(id);
      if (!householdResponse.success) {
        throw new Error(householdResponse.errorMsg || '호실 정보 조회 실패');
      }

      // 호실의 인스턴스 목록 조회
      const instancesResponse = await getHouseholdInstanceList(id);
      if (!instancesResponse.success) {
        console.warn('인스턴스 목록 조회 실패:', instancesResponse.errorMsg);
        setInstances([]);
      } else {
        setInstances(instancesResponse.data?.data || []);
      }

      const householdData = householdResponse.data;
      setHousehold(householdData || null);

      // 폼 데이터 초기화
      if (householdData) {
        const initialData = {
          lv1Address: householdData.address1Depth,
          lv2Address: householdData.address2Depth,
          lv3Address: householdData.address3Depth || '',
          householdType: householdData.householdType,
          memo: householdData.memo || '',
        };
        setFormData(initialData);
        setOriginalData(initialData);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, [householdId]);

  useEffect(() => {
    loadHouseholdDetail();
  }, [loadHouseholdDetail]);
  // #endregion

  // #region 유효성 검사
  const isValid = useMemo(() => {
    return Boolean(
      formData.lv1Address.trim() && 
      formData.lv2Address.trim() && 
      formData.householdType
    );
  }, [formData]);
  // #endregion

  // #region 폼 검증
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.lv1Address.trim()) {
      newErrors.lv1Address = '1레벨 주소를 입력해주세요.';
    }
    if (!formData.lv2Address.trim()) {
      newErrors.lv2Address = '2레벨 주소를 입력해주세요.';
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
    if (!household || !validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const requestData: UpdateHouseholdRequest = {
        address1Depth: formData.lv1Address,
        address2Depth: formData.lv2Address,
        address3Depth: formData.lv3Address || undefined,
        householdType: formData.householdType as HouseholdType,
        memo: formData.memo || undefined,
      };

      const response = await updateHousehold(household.id, requestData);
      
      if (response.success) {
        alert('호실 정보가 성공적으로 수정되었습니다.');
        // 데이터 새로고침
        await loadHouseholdDetail();
      } else {
        throw new Error(response.errorMsg || '수정 실패');
      }
    } catch (error) {
      console.error('수정 중 오류 발생:', error);
      alert(error instanceof Error ? error.message : '수정 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!household || !confirm('정말로 이 호실을 삭제하시겠습니까?')) return;
    
    try {
      const response = await deleteHousehold(household.id);
      if (response.success) {
        alert('호실이 삭제되었습니다.');
        router.push('/parking/household-management/household');
      } else {
        throw new Error(response.errorMsg || '삭제 실패');
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : '삭제 중 오류가 발생했습니다.');
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
    setFormData(originalData);
    setErrors({});
  };
  // #endregion

  // #region 유틸리티 함수
  const formatRoomNumber = (household: Household) => {
    return `${household.address1Depth} ${household.address2Depth}${household.address3Depth ? ' ' + household.address3Depth : ''}`;
  };
  // #endregion

  // #region 액션 버튼
  const leftActions = (
    <Link
      href="/parking/household-management/household"
      className="flex gap-2 items-center px-3 py-2 transition-colors text-muted-foreground hover:text-foreground"
    >
      <ArrowLeft className="w-4 h-4" />
      목록으로
    </Link>
  );

  const rightActions = household ? (
    <div className="flex gap-2">
      {/* 삭제 버튼 */}
      <button
        onClick={handleDelete}
        disabled={isSubmitting}
        className="flex gap-2 items-center px-4 py-2 rounded-lg transition-colors bg-destructive text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50"
        title="호실 삭제"
      >
        <Trash2 className="w-4 h-4" />
        삭제
      </button>
    </div>
  ) : null;
  // #endregion

  // #region 로딩/에러 상태
  if (loading) {
    return (
      <div className="p-6">
        <PageHeader
          title="호실 상세"
          subtitle="상세 호실 정보를 조회합니다"
          leftActions={leftActions}
        />
        <div className="p-8 text-center">
          <div className="text-muted-foreground">로딩 중...</div>
        </div>
      </div>
    );
  }

  if (error || !household) {
    return (
      <div className="p-6">
        <PageHeader
          title="호실 상세"
          subtitle="상세 호실 정보를 조회합니다"
          leftActions={leftActions}
        />
        <div className="p-4 bg-red-50 rounded-lg border border-red-200">
          <p className="text-red-800">{error || '호실 정보를 찾을 수 없습니다.'}</p>
          <button 
            onClick={loadHouseholdDetail}
            className="px-4 py-2 mt-2 text-white bg-red-600 rounded hover:bg-red-700"
            title="데이터 다시 로드"
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
        title={household ? `호실 상세 - ${formatRoomNumber(household)}` : "호실 상세"}
        subtitle="호실 정보를 조회하고 수정할 수 있습니다"
        leftActions={leftActions}
        rightActions={rightActions}
      />

      <div className="flex flex-col gap-6">
        <HouseholdInfoForm
          mode="update"
          household={household}
          formData={formData}
          errors={errors}
          isSubmitting={isSubmitting}
          isValid={isValid}
          onFieldChange={handleFieldChange}
          onReset={handleReset}
          onSave={handleSave}
        />

        <HouseholdInstancesList
          householdId={household?.id}
          instances={instances}
        />
      </div>
    </div>
  );
}