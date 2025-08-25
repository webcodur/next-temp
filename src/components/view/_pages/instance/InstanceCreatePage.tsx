/* 메뉴 설명: 인스턴스 생성 페이지 */
'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';

import PageHeader from '@/components/ui/ui-layout/page-header/PageHeader';
import InstanceForm, { InstanceFormData } from './basic/core/InstanceForm';
import { createInstance } from '@/services/instances/instances_POST';
import { ENUM_InstanceType } from '@/types/instance';

export default function InstanceCreatePage() {
  const router = useRouter();
  
  // #region 폼 상태
  const [formData, setFormData] = useState<InstanceFormData>({
    name: '',
    ownerName: '',
    address1Depth: '',
    address2Depth: '',
    address3Depth: '',
    instanceType: '',
    password: '',
    memo: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  // #endregion

  // #region 검증
  const isValid = useMemo(() => {
    return Boolean(
      formData.name.trim() &&
      formData.address1Depth.trim() &&
      formData.address2Depth.trim() &&
      formData.instanceType &&
      formData.password.trim()
    );
  }, [formData]);
  // #endregion

  // #region 이벤트 핸들러
  const handleSubmit = async () => {
    if (!isValid || isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      const createData = {
        name: formData.name,
        ownerName: formData.ownerName || undefined,
        address1Depth: formData.address1Depth,
        address2Depth: formData.address2Depth,
        address3Depth: formData.address3Depth || undefined,
        instanceType: formData.instanceType as ENUM_InstanceType,
        password: formData.password,
        memo: formData.memo || undefined,
      };

      const result = await createInstance(createData);

      if (result.success) {
        // 성공 시 목록 페이지로 이동
        router.push('/parking/occupancy/instance');
      }
    } catch (error) {
      console.error('인스턴스 생성 중 오류:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // const handleCancel = () => {
  //   router.push('/parking/occupancy/instance');
  // };

  const handleFormChange = (data: InstanceFormData) => {
    setFormData(data);
  };
  // #endregion

  return (
    <div className="flex flex-col gap-6">
      {/* 헤더 */}
      <PageHeader 
        title="세대 추가"
        subtitle="새로운 세대를 생성합니다"
      />

      {/* 폼 섹션 */}
      <InstanceForm
        mode="create"
        data={formData}
        onChange={handleFormChange}
        disabled={isSubmitting}
        showActions={true}
        onSubmit={handleSubmit}
        isValid={isValid}
      />
    </div>
  );
}
