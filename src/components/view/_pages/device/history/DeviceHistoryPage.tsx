/* 메뉴 설명: 차단기 변경 이력 페이지 */
'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'next/navigation';
import { RefreshCw } from 'lucide-react';

import DetailPageLayout from '@/components/ui/ui-layout/detail-page-layout/DetailPageLayout';
import { Button } from '@/components/ui/ui-input/button/Button';
import { SectionPanel } from '@/components/ui/ui-layout/section-panel/SectionPanel';
import DeviceHistorySection, { DeviceHistorySectionRef } from './DeviceHistorySection';
import { getParkingDeviceDetail } from '@/services/devices/devices@id_GET';
import { ParkingDevice } from '@/types/device';
import { createDeviceTabs } from '../_shared/deviceTabs';

export default function DeviceHistoryPage() {
  const params = useParams();
  const deviceId = Number(params.id);
  
  // #region 상태 관리
  const [device, setDevice] = useState<ParkingDevice | null>(null);
  const [loading, setLoading] = useState(true);
  const historySectionRef = useRef<DeviceHistorySectionRef>(null);
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

  // #region 핸들러
  const handleHistoryRefresh = useCallback(() => {
    historySectionRef.current?.refresh();
  }, []);
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
      activeTabId="history"
      fallbackPath="/parking/lot/device"
    >
      <SectionPanel 
        title="변경 이력"
        subtitle="차단기 설정 변경 이력을 조회합니다"
        headerActions={
          <Button
            variant="outline"
            size="sm"
            onClick={handleHistoryRefresh}
            title="새로고침"
          >
            <RefreshCw size={16} />
            새로고침
          </Button>
        }
      >
        <DeviceHistorySection 
          ref={historySectionRef}
          device={device}
        />
      </SectionPanel>
    </DetailPageLayout>
  );
}
