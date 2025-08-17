/* 메뉴 설명: 차단기 생성 페이지 */
'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Save, RotateCcw } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/ui-input/button/Button';
import PageHeader from '@/components/ui/ui-layout/page-header/PageHeader';
import Modal from '@/components/ui/ui-layout/modal/Modal';
import { GridForm } from '@/components/ui/ui-layout/grid-form';
import DeviceForm, { DeviceFormData } from './basic/DeviceForm';
import DevicePermissionConfigSection, { DevicePermissionConfigSectionRef } from './permissions/DevicePermissionConfigSection';
import { createParkingDevice } from '@/services/devices/devices_POST';

export default function DeviceCreatePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const permissionRef = useRef<DevicePermissionConfigSectionRef>(null);
  
  // #region 폼 상태
  const [formData, setFormData] = useState<DeviceFormData>({
    name: '',
    ip: '',
    port: '',
    serverPort: '',
    cctvUrl: '',
    status: '1', // 기본값: 자동운행
    deviceType: '1', // 기본값: 라즈베리파이
    isTicketing: 'N',
    isReceipting: 'N',
    representativePhone: '',
    sequence: '1',
  });

  // URL에서 sequence 값을 받아서 formData에 설정
  useEffect(() => {
    const sequenceParam = searchParams.get('sequence');
    if (sequenceParam) {
      setFormData(prev => ({
        ...prev,
        sequence: sequenceParam,
      }));
    }
  }, [searchParams]);
  
  // 권한 설정 상태
  const [permissionData, setPermissionData] = useState({
    residentPermission: true,
    regularPermission: true,
    visitorPermission: false,
    tempPermission: false,
    businessPermission: false,
    commercialPermission: false,
    taxiPermission: false,
    ticketMachinePermission: false,
    unregisteredPermission: false,
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 모달 상태
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  // #endregion

  // #region 검증
  const isValid = useMemo(() => {
    return (
      formData.name.trim() &&
      formData.ip.trim() &&
      formData.port.trim() &&
      formData.cctvUrl.trim() &&
      formData.status &&
      formData.deviceType
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
        ip: formData.ip,
        port: formData.port,
        serverPort: formData.serverPort || undefined,
        cctvUrl: formData.cctvUrl,
        status: parseInt(formData.status),
        deviceType: parseInt(formData.deviceType),
        isTicketing: formData.isTicketing || undefined,
        isReceipting: formData.isReceipting || undefined,
        representativePhone: formData.representativePhone || undefined,
        sequence: parseInt(formData.sequence) || undefined,
        // 권한 데이터 추가
        residentPermission: permissionData.residentPermission ? 1 : 0,
        regularPermission: permissionData.regularPermission ? 1 : 0,
        visitorPermission: permissionData.visitorPermission ? 1 : 0,
        tempPermission: permissionData.tempPermission ? 1 : 0,
        businessPermission: permissionData.businessPermission ? 1 : 0,
        commercialPermission: permissionData.commercialPermission ? 1 : 0,
        taxiPermission: permissionData.taxiPermission ? 1 : 0,
        ticketMachinePermission: permissionData.ticketMachinePermission ? 1 : 0,
        unregisteredPermission: permissionData.unregisteredPermission ? 1 : 0,
      };

      const result = await createParkingDevice(createData);

      if (result.success) {
        // 성공 시 목록 페이지로 이동
        router.push('/parking/lot/device');
      } else {
        // 에러 처리
        console.error('차단기 생성 실패:', result.errorMsg);
        setErrorMessage(`차단기 생성에 실패했습니다: ${result.errorMsg}`);
        setErrorModalOpen(true);
      }
    } catch (error) {
      console.error('차단기 생성 중 오류:', error);
      setErrorMessage('차단기 생성 중 오류가 발생했습니다.');
      setErrorModalOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormChange = (data: DeviceFormData) => {
    setFormData(data);
  };

  const handlePermissionChange = (permissions: typeof permissionData) => {
    setPermissionData(permissions);
  };

  const handleReset = () => {
    // 기본 정보 초기화
    setFormData({
      name: '',
      ip: '',
      port: '',
      serverPort: '',
      cctvUrl: '',
      status: '1',
      deviceType: '1',
      isTicketing: 'N',
      isReceipting: 'N',
      representativePhone: '',
      sequence: '1',
    });

    // 권한 초기화 (ref를 통해 호출)
    permissionRef.current?.resetToDefaults();
  };
  // #endregion

  return (
    <div className="flex flex-col gap-6">
      {/* 헤더 */}
      <PageHeader 
        title="차단기 추가"
        subtitle="새로운 차단기를 등록합니다"
      />

      {/* 통합 폼 컨테이너 */}
      <div className="overflow-hidden rounded-lg border bg-card border-border">
        {/* 기본 정보 폼 섹션 */}
        <div className="p-6 border-b border-border">
          <DeviceForm
            mode="create"
            data={formData}
            onChange={handleFormChange}
            disabled={isSubmitting}
          />
        </div>

        {/* 권한 설정 섹션 */}
        <div className="p-6">
          <DevicePermissionConfigSection
            ref={permissionRef}
            mode="create"
            onPermissionChange={handlePermissionChange}
          />
        </div>

        {/* 폼 하단 버튼 영역 */}
        <div className="p-6 pt-0">
          <GridForm
            
            gap="0px"
            bottomLeftActions={(
              <Button 
                variant="secondary" 
                onClick={handleReset}
                disabled={isSubmitting}
                title="모든 필드 초기화"
              >
                <RotateCcw size={16} />
                초기화
              </Button>
            )}
            bottomRightActions={(
              <Button 
                variant="primary" 
                onClick={handleSubmit} 
                disabled={!isValid || isSubmitting}
                title={isSubmitting ? '생성 중...' : '차단기 생성'}
              >
                <Save size={16} />
                {isSubmitting ? '생성 중...' : '생성'}
              </Button>
            )}
          >
            {/* 빈 콘텐츠 - 단순 액션바 레이아웃 용도 */}
            <div className="hidden" />
          </GridForm>
        </div>
      </div>

      {/* 오류 모달 */}
      <Modal
        isOpen={errorModalOpen}
        onClose={() => setErrorModalOpen(false)}
        title="오류 발생"
        size="sm"
      >
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="mb-2 text-lg font-semibold text-red-600">오류</h3>
            <p className="text-muted-foreground">{errorMessage}</p>
          </div>
          
          <div className="flex justify-center pt-4">
            <Button onClick={() => setErrorModalOpen(false)}>
              확인
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
