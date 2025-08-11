/* 메뉴 설명: 차단기 상세 페이지 */
'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';

import { Button } from '@/components/ui/ui-input/button/Button';
import PageHeader from '@/components/ui/ui-layout/page-header/PageHeader';
import Modal from '@/components/ui/ui-layout/modal/Modal';
import Tabs from '@/components/ui/ui-layout/tabs/Tabs';
import DeviceForm, { DeviceFormData } from './DeviceForm';
import DeviceNetworkConfigSection from './DeviceNetworkConfigSection';
import DevicePermissionConfigSection from './DevicePermissionConfigSection';
import DeviceOperationConfigSection from './DeviceOperationConfigSection';
import DeviceCommandLogSection from './DeviceCommandLogSection';
import DeviceHistorySection from './DeviceHistorySection';
import { getParkingDeviceDetail } from '@/services/devices/devices@id_GET';
import { updateParkingDevice } from '@/services/devices/devices@id_PUT';
import { deleteParkingDevice } from '@/services/devices/devices@id_DELETE';
import { ParkingDevice } from '@/types/device';
import { validateIP, validatePort } from '@/utils/ipValidation';

export default function DeviceDetailPage() {  
  const router = useRouter();
  const params = useParams();
  const deviceId = Number(params.id);
  
  // #region 상태 관리
  const [device, setDevice] = useState<ParkingDevice | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  
  const [formData, setFormData] = useState<DeviceFormData>({
    name: '',
    ip: '',
    port: '',
    serverPort: '',
    cctvUrl: '',
    status: '',
    deviceType: '',
    isTicketing: '',
    isReceipting: '',
    representativePhone: '',
    sequence: '',
  });
  const [originalData, setOriginalData] = useState<DeviceFormData>({
    name: '',
    ip: '',
    port: '',
    serverPort: '',
    cctvUrl: '',
    status: '',
    deviceType: '',
    isTicketing: '',
    isReceipting: '',
    representativePhone: '',
    sequence: '',
  });
  
  // 모달 상태
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  // #endregion

  // #region 탭 설정
  const tabs = [
    {
      id: 'basic',
      label: '기본 정보',
    },
    {
      id: 'network',
      label: '네트워크',
    },
    {
      id: 'permissions',
      label: '출입 권한',
    },
    {
      id: 'operation',
      label: '운영 설정',
    },
    {
      id: 'logs',
      label: '명령 로그',
    },
    {
      id: 'history',
      label: '변경 이력',
    },
  ];
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
        
        const initialData = {
          name: result.data.name,
          ip: result.data.ip,
          port: result.data.port,
          serverPort: result.data.serverPort || '',
          cctvUrl: result.data.cctvUrl,
          status: result.data.status.toString(),
          deviceType: result.data.deviceType.toString(),
          isTicketing: result.data.isTicketing || '',
          isReceipting: result.data.isReceipting || '',
          representativePhone: result.data.representativePhone || '',
          sequence: result.data.sequence.toString(),
        };
        setFormData(initialData);
        setOriginalData(initialData);
      } else {
        console.error('차단기 조회 실패:', result.errorMsg);
        setModalMessage(`차단기 정보를 불러올 수 없습니다: ${result.errorMsg}`);
        setErrorModalOpen(true);
        setTimeout(() => {
          router.push('/parking/lot/device');
        }, 2000);
      }
    } catch (error) {
      console.error('차단기 조회 중 오류:', error);
      setModalMessage('차단기 정보를 불러오는 중 오류가 발생했습니다.');
      setErrorModalOpen(true);
      setTimeout(() => {
        router.push('/parking/lot/device');
      }, 2000);
    } finally {
      setLoading(false);
    }
  }, [deviceId, router]);

  useEffect(() => {
    loadDeviceData();
  }, [loadDeviceData]);
  // #endregion

  // #region 변경 감지
  const hasChanges = useMemo(() => {
    return (
      formData.name !== originalData.name ||
      formData.ip !== originalData.ip ||
      formData.port !== originalData.port ||
      formData.serverPort !== originalData.serverPort ||
      formData.cctvUrl !== originalData.cctvUrl ||
      formData.status !== originalData.status ||
      formData.deviceType !== originalData.deviceType ||
      formData.isTicketing !== originalData.isTicketing ||
      formData.isReceipting !== originalData.isReceipting ||
      formData.representativePhone !== originalData.representativePhone ||
      formData.sequence !== originalData.sequence
    );
  }, [formData, originalData]);

  const isValid = useMemo(() => {
    if (!hasChanges) return false;
    
    // 기본 필수 필드 체크
    if (!formData.name.trim() || 
        !formData.ip.trim() || 
        !formData.port.trim() || 
        !formData.cctvUrl.trim() ||
        !formData.status ||
        !formData.deviceType) {
      return false;
    }

    // IP 주소 유효성 검사
    const ipValidation = validateIP(formData.ip);
    if (!ipValidation.isValid) {
      return false;
    }

    // 포트 번호 유효성 검사
    const portValidation = validatePort(formData.port);
    if (!portValidation.isValid) {
      return false;
    }

    // 서버 포트가 있는 경우 유효성 검사
    if (formData.serverPort.trim()) {
      const serverPortValidation = validatePort(formData.serverPort);
      if (!serverPortValidation.isValid) {
        return false;
      }
    }

    return true;
  }, [formData, hasChanges]);
  // #endregion

  // #region 핸들러
  const handleBack = () => {
    if (hasChanges) {
      const confirmMessage = '수정된 내용이 있습니다. 정말로 나가시겠습니까?';
      if (!confirm(confirmMessage)) return;
    }
    router.push('/parking/lot/device');
  };

  const handleFormChange = useCallback((data: DeviceFormData) => {
    setFormData(data);
  }, []);

  const handleReset = useCallback(() => {
    if (!hasChanges) return;
    
    setFormData(originalData);
  }, [hasChanges, originalData]);

  const handleSubmit = useCallback(async () => {
    if (!device || !isValid || isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      const updateData: {
        name?: string;
        ip?: string;
        port?: string;
        serverPort?: string;
        cctvUrl?: string;
        status?: number;
        deviceType?: number;
        isTicketing?: string;
        isReceipting?: string;
        representativePhone?: string;
        sequence?: number;
      } = {};
      
      // 변경된 필드만 포함
      if (formData.name !== originalData.name) updateData.name = formData.name;
      if (formData.ip !== originalData.ip) updateData.ip = formData.ip;
      if (formData.port !== originalData.port) updateData.port = formData.port;
      if (formData.serverPort !== originalData.serverPort) updateData.serverPort = formData.serverPort;
      if (formData.cctvUrl !== originalData.cctvUrl) updateData.cctvUrl = formData.cctvUrl;
      if (formData.status !== originalData.status) updateData.status = parseInt(formData.status);
      if (formData.deviceType !== originalData.deviceType) updateData.deviceType = parseInt(formData.deviceType);
      if (formData.isTicketing !== originalData.isTicketing) updateData.isTicketing = formData.isTicketing;
      if (formData.isReceipting !== originalData.isReceipting) updateData.isReceipting = formData.isReceipting;
      if (formData.representativePhone !== originalData.representativePhone) updateData.representativePhone = formData.representativePhone;
      if (formData.sequence !== originalData.sequence) updateData.sequence = parseInt(formData.sequence);

      const result = await updateParkingDevice(device.id, updateData);

      if (result.success) {
        // 성공 시 원본 데이터 업데이트
        const newData = { ...formData };
        setOriginalData(newData);
        setFormData(newData);
        
        // 데이터 다시 로드
        await loadDeviceData();
        
        setModalMessage('차단기 정보가 성공적으로 수정되었습니다.');
        setSuccessModalOpen(true);
      } else {
        console.error('차단기 수정 실패:', result.errorMsg);
        setModalMessage(`차단기 수정에 실패했습니다: ${result.errorMsg}`);
        setErrorModalOpen(true);
      }
    } catch (error) {
      console.error('차단기 수정 중 오류:', error);
      setModalMessage('차단기 수정 중 오류가 발생했습니다.');
      setErrorModalOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  }, [device, isValid, isSubmitting, formData, originalData, loadDeviceData]);

  const handleDelete = useCallback(() => {
    setDeleteConfirmOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!device) return;

    try {
      const result = await deleteParkingDevice(device.id);
      
      if (result.success) {
        setModalMessage('차단기가 성공적으로 삭제되었습니다.');
        setSuccessModalOpen(true);
        setTimeout(() => {
          router.push('/parking/lot/device');
        }, 2000);
      } else {
        setModalMessage(`차단기 삭제에 실패했습니다: ${result.errorMsg}`);
        setErrorModalOpen(true);
      }
    } catch (error) {
      console.error('차단기 삭제 중 오류:', error);
      setModalMessage('차단기 삭제 중 오류가 발생했습니다.');
      setErrorModalOpen(true);
    } finally {
      setDeleteConfirmOpen(false);
    }
  }, [device, router]);
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
    <div className="flex flex-col gap-6">
      {/* 헤더 */}
      <PageHeader 
        title="차단기 상세 정보"
        subtitle={`${device.name} (${device.ip}:${device.port})`}
        leftActions={
          <Button
            variant="secondary"
            size="default"
            onClick={handleBack}
            title="목록으로"
          >
            <ArrowLeft size={16} />
            목록
          </Button>
        }
      />

      {/* 탭과 콘텐츠 */}
      <div className="flex flex-col">
        <Tabs
          tabs={tabs}
          activeId={activeTab}
          onTabChange={setActiveTab}
        />

        {/* 콘텐츠 영역 */}
        <div className="p-6 rounded-b-lg border-b-2 border-s-2 border-e-2 border-border bg-background">
          {activeTab === 'basic' && (
            <DeviceForm
              mode="edit"
              device={device}
              data={formData}
              onChange={handleFormChange}
              disabled={isSubmitting}
              showActions={true}
              onReset={handleReset}
              onSubmit={handleSubmit}
              onDelete={handleDelete}
              hasChanges={hasChanges}
              isValid={isValid}
            />
          )}
          
          {activeTab === 'network' && (
            <DeviceNetworkConfigSection 
              device={device}
              onDataChange={loadDeviceData}
            />
          )}
          
          {activeTab === 'permissions' && (
            <DevicePermissionConfigSection 
              device={device}
              onDataChange={loadDeviceData}
            />
          )}
          
          {activeTab === 'operation' && (
            <DeviceOperationConfigSection 
              device={device}
              onDataChange={loadDeviceData}
            />
          )}
          
          {activeTab === 'logs' && (
            <DeviceCommandLogSection 
              device={device}
            />
          )}
          
          {activeTab === 'history' && (
            <DeviceHistorySection 
              device={device}
            />
          )}
        </div>
      </div>

      {/* 삭제 확인 모달 */}
      <Modal
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        title="차단기 삭제 확인"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <h3 className="mb-2 text-lg font-semibold">정말로 삭제하시겠습니까?</h3>
            <p className="text-muted-foreground">
              이 작업은 되돌릴 수 없습니다. 차단기 정보가 영구적으로 삭제됩니다.
            </p>
          </div>
          
          <div className="flex gap-3 justify-end pt-4">
            <Button 
              variant="ghost" 
              onClick={() => setDeleteConfirmOpen(false)}
            >
              취소
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteConfirm}
            >
              삭제
            </Button>
          </div>
        </div>
      </Modal>

      {/* 성공 모달 */}
      <Modal
        isOpen={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        title="작업 완료"
        size="sm"
      >
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="mb-2 text-lg font-semibold text-green-600">성공</h3>
            <p className="text-muted-foreground">{modalMessage}</p>
          </div>
          
          <div className="flex justify-center pt-4">
            <Button onClick={() => setSuccessModalOpen(false)}>
              확인
            </Button>
          </div>
        </div>
      </Modal>

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
            <p className="text-muted-foreground">{modalMessage}</p>
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
