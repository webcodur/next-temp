/* 메뉴 설명: 차단기 출입 권한 설정 페이지 */
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';

import DetailPageLayout from '@/components/ui/ui-layout/detail-page-layout/DetailPageLayout';
import { SectionPanel } from '@/components/ui/ui-layout/section-panel/SectionPanel';
import DevicePermissionConfigSection from './DevicePermissionConfigSection';
import { getParkingDeviceDetail } from '@/services/devices/devices@id_GET';
import { ParkingDevice } from '@/types/device';
import { createDeviceTabs } from '../_shared/deviceTabs';

export default function DevicePermissionsPage() {
  const params = useParams();
  const deviceId = Number(params.id);
  
  // #region 상태 관리
  const [device, setDevice] = useState<ParkingDevice | null>(null);
  const [loading, setLoading] = useState(true);
  // #endregion

  // #region 데이터 로드
  const loadDeviceData = useCallback(async () => {
    if (!deviceId || isNaN(deviceId)) {
      return;
    }
    
    setLoading(true);
    try {
      const result = await getParkingDeviceDetail(deviceId);
      
      if (result.success && result.data) {
        setDevice(result.data);
      } else {
        console.error('차단기 조회 실패:', result.errorMsg);
      }
    } catch (error) {
      console.error('차단기 조회 중 오류:', error);
    } finally {
      setLoading(false);
    }
  }, [deviceId]);

  useEffect(() => {
    loadDeviceData();
  }, [loadDeviceData]);
  // #endregion

  // #region 탭 설정
  const tabs = createDeviceTabs(deviceId);
  // #endregion

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-muted-foreground">로딩 중...</div>
      </div>
    );
  }

  if (!device) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-muted-foreground">차단기 정보를 찾을 수 없습니다.</div>
      </div>
    );
  }

  return (
    <DetailPageLayout
      title="차단기 상세 정보"
      subtitle={`${device.name} (${device.ip}:${device.port})`}
      tabs={tabs}
      activeTabId="permissions"
      fallbackPath="/parking/lot/device"
    >
      <SectionPanel 
        title="출입 권한 설정"
        subtitle="차량 유형별 출입 권한을 설정합니다"
      >
        <DevicePermissionConfigSection 
          device={device}
          onDataChange={loadDeviceData}
        />
      </SectionPanel>
    </DetailPageLayout>
  );
}
