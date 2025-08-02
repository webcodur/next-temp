'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/ui-input/button/Button';
import PageHeader from '@/components/ui/ui-layout/page-header/PageHeader';
import VehicleForm from '@/components/view/global/basic/vehicle/VehicleForm';
import { createCar } from '@/services/car';
import type { CreateCarRequest, UpdateCarRequest } from '@/types/car';

export default function VehicleCreatePage() {
  // #region 상태 관리
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  // #endregion

  // #region 핸들러
  const handleSubmit = useCallback(async (data: CreateCarRequest | UpdateCarRequest) => {
    setLoading(true);
    
    try {
      // create mode에서는 항상 CreateCarRequest로 받을 것이므로 타입 단언
      const response = await createCar(data as CreateCarRequest);
      
      if (response.success) {
        alert('차량이 성공적으로 생성되었습니다.');
        router.push('/global/basic/vehicle');
      } else {
        alert(response.errorMsg || '차량 생성에 실패했습니다.');
      }
    } catch (err) {
      console.error('차량 생성 실패:', err);
      alert('차량 생성 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, [router]);

  const handleCancel = useCallback(() => {
    if (window.confirm('작성 중인 내용이 모두 사라집니다. 정말 취소하시겠습니까?')) {
      router.push('/global/basic/vehicle');
    }
  }, [router]);
  // #endregion

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="차량 추가"
        subtitle="새로운 차량 정보를 등록합니다"
        leftActions={
          <Link href="/global/basic/vehicle">
            <Button variant="ghost">
              <ArrowLeft className="mr-2 w-4 h-4" />
              목록으로
            </Button>
          </Link>
        }
      />

      <VehicleForm
        mode="create"
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={loading}
      />
    </div>
  );
}