/* 메뉴 설명: 차단기 생성 페이지 */
'use client';

import React, { useState, useMemo } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/ui-input/button/Button';
import PageHeader from '@/components/ui/ui-layout/page-header/PageHeader';
import Modal from '@/components/ui/ui-layout/modal/Modal';
import DeviceForm, { DeviceFormData } from './DeviceForm';
import { createParkingDevice } from '@/services/devices/devices_POST';

export default function DeviceCreatePage() {
  const router = useRouter();
  
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
      };

      const result = await createParkingDevice(createData);

      if (result.success) {
        // 성공 시 목록 페이지로 이동
        router.push('/parking/lot-management/device-management');
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

  const handleCancel = () => {
    router.push('/parking/lot-management/device-management');
  };

  const handleFormChange = (data: DeviceFormData) => {
    setFormData(data);
  };
  // #endregion

  return (
    <div className="flex flex-col gap-6">
      {/* 헤더 */}
      <PageHeader 
        title="차단기 추가"
        subtitle="새로운 차단기를 등록합니다"
        leftActions={
          <Button
            variant="secondary"
            size="default"
            onClick={handleCancel}
            title="목록으로"
          >
            <ArrowLeft size={16} />
            목록
          </Button>
        }
      />

      {/* 폼 섹션 */}
      <div className="bg-card rounded-lg border border-border p-6">
        <DeviceForm
          mode="create"
          data={formData}
          onChange={handleFormChange}
          disabled={isSubmitting}
        />
      </div>

      {/* 저장 버튼 - 우하단 고정 */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button 
          variant="primary"
          size="lg"
          onClick={handleSubmit} 
          disabled={!isValid || isSubmitting}
          title={isSubmitting ? '생성 중...' : '생성'}
          className="shadow-lg"
        >
          <Save size={20} />
          {isSubmitting ? '생성 중...' : '생성'}
        </Button>
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
            <h3 className="text-lg font-semibold text-red-600 mb-2">오류</h3>
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
