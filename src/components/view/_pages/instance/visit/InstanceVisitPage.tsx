/* 메뉴 설명: 세대 방문 설정 페이지 */
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';

import DetailPageLayout from '@/components/ui/ui-layout/detail-page-layout/DetailPageLayout';
import InstanceVisitConfigSection from './InstanceVisitConfigSection';
import { getInstanceDetail } from '@/services/instances/instances@id_GET';
import { InstanceDetail } from '@/types/instance';
import { createInstanceTabs } from '../_shared/instanceTabs';

export default function InstanceVisitPage() {
  const params = useParams();
  const instanceId = Number(params.id);
  
  // #region 상태 관리
  const [instance, setInstance] = useState<InstanceDetail | null>(null);
  const [loading, setLoading] = useState(true);
  // #endregion

  // #region 데이터 로드
  const loadInstanceData = useCallback(async () => {
    if (!instanceId || isNaN(instanceId)) {
      return;
    }
    
    setLoading(true);
    try {
      const result = await getInstanceDetail(instanceId);
      
      if (result.success && result.data) {
        setInstance(result.data);
      } else {
        console.error('세대 조회 실패:', result.errorMsg);
      }
    } catch (error) {
      console.error('세대 조회 중 오류:', error);
    } finally {
      setLoading(false);
    }
  }, [instanceId]);

  useEffect(() => {
    loadInstanceData();
  }, [loadInstanceData]);
  // #endregion

  // #region 탭 설정
  const tabs = createInstanceTabs(instanceId);
  // #endregion

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-muted-foreground">로딩 중...</div>
      </div>
    );
  }

  if (!instance) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-muted-foreground">세대 정보를 찾을 수 없습니다.</div>
      </div>
    );
  }

  return (
    <DetailPageLayout
      title="세대 상세 정보"
      subtitle={`${instance.name} - ${instance.address1Depth} ${instance.address2Depth} ${instance.address3Depth || ''}`}
      tabs={tabs}
      activeTabId="visit"
      fallbackPath="/parking/occupancy/instance"
    >
      <InstanceVisitConfigSection 
        instance={instance}
        onDataChange={loadInstanceData}
      />
    </DetailPageLayout>
  );
}
