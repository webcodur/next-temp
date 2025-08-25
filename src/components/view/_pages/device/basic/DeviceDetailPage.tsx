/* 메뉴 설명: 차단기 상세 페이지 */
'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { RefreshCw, FileText, History, KeyRound } from 'lucide-react';

import { Button } from '@/components/ui/ui-input/button/Button';
import Modal from '@/components/ui/ui-layout/modal/Modal';
import PageHeader from '@/components/ui/ui-layout/page-header/PageHeader';
import Tabs from '@/components/ui/ui-layout/tabs/Tabs';

import DeviceForm, { DeviceFormData } from './DeviceForm';
import DevicePermissionConfigSection from '../permissions/DevicePermissionConfigSection';
import DeviceCommandLogSection, { DeviceCommandLogSectionRef } from '../logs/DeviceCommandLogSection';
import DeviceHistorySection, { DeviceHistorySectionRef } from '../history/DeviceHistorySection';
import { getParkingDeviceDetail } from '@/services/devices/devices@id_GET';
import { updateParkingDevice } from '@/services/devices/devices@id_PUT';
import { deleteParkingDevice } from '@/services/devices/devices@id_DELETE';
import { ParkingDevice } from '@/types/device';
import { validateField, ValidationRule } from '@/utils/validation';
import { createDeviceTabs } from '../_shared/deviceTabs';

export default function DeviceDetailPage() {  
  const params = useParams();
  const router = useRouter();
  const deviceId = Number(params.id);
  
  // #region 상태 관리
  const [device, setDevice] = useState<ParkingDevice | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 탭 상태 관리
  const [activeTab, setActiveTab] = useState('basic');
  
  // Section 레퍼런스
  const commandLogSectionRef = useRef<DeviceCommandLogSectionRef>(null);
  const historySectionRef = useRef<DeviceHistorySectionRef>(null);
  
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
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  // #endregion

  // #region 탭 설정
  const tabs = createDeviceTabs();
  
  // 새로고침 핸들러들
  const handleRefreshLogs = useCallback(() => {
    commandLogSectionRef.current?.refresh();
  }, []);

  const handleRefreshHistory = useCallback(() => {
    historySectionRef.current?.refresh();
  }, []);
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
        console.error('차단기 조회 실패:', '데이터 조회에 실패했습니다.');
        setModalMessage('차단기 정보를 불러올 수 없습니다.');
        setTimeout(() => {
          router.push('/parking/lot/device');
        }, 2000);
      }
    } catch (error) {
      console.error('차단기 조회 중 오류:', error);
              setModalMessage('차단기 정보를 불러오는 중 오류가 발생했습니다.');
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

    // 유효성 검사 규칙에 따른 검사
    const requiredFields = [
      { value: formData.name, rules: [{ type: 'required' }] },
      { value: formData.ip, rules: [{ type: 'required' }, { type: 'ip' }] },
      { value: formData.port, rules: [{ type: 'required' }, { type: 'port' }] },
      { value: formData.cctvUrl, rules: [{ type: 'required' }] },
    ];

    // 선택적 필드들
    const optionalFields = [
      { value: formData.serverPort, rules: formData.serverPort.trim() ? [{ type: 'port' }] : [] },
      { value: formData.representativePhone, rules: formData.representativePhone.trim() ? [{ type: 'phone' }] : [] },
    ];

    // 모든 필드 검사
    for (const field of [...requiredFields, ...optionalFields]) {
      for (const rule of field.rules) {
        const result = validateField(field.value, rule as ValidationRule);
        if (!result.isValid) {
          return false;
        }
      }
    }

    return true;
  }, [formData, hasChanges]);
  // #endregion

  // #region 핸들러
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
        console.error('차단기 수정 실패:', '대상 작업에 실패했습니다.');
        setModalMessage('차단기 수정에 실패했습니다.');
      }
    } catch (error) {
      console.error('차단기 수정 중 오류:', error);
      setModalMessage('차단기 수정 중 오류가 발생했습니다.');
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
        setModalMessage('차단기 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('차단기 삭제 중 오류:', error);
      setModalMessage('차단기 삭제 중 오류가 발생했습니다.');
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
        hasChanges={hasChanges}
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
          {/* 기본 정보 탭 */}
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

          {/* 출입 권한 탭 */}
          {activeTab === 'permissions' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex gap-3 items-center">
                  <KeyRound className="w-5 h-5 text-primary" />
                  <div>
                    <h3 className="text-lg font-semibold">출입 권한 설정</h3>
                    <p className="text-sm text-muted-foreground">차단기의 차량 유형별 출입 권한을 설정합니다.</p>
                  </div>
                </div>
              </div>
              <DevicePermissionConfigSection
                device={device}
                onDataChange={loadDeviceData}
              />
            </div>
          )}

          {/* 명령 로그 탭 */}
          {activeTab === 'logs' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex gap-3 items-center">
                  <FileText className="w-5 h-5 text-primary" />
                  <div>
                    <h3 className="text-lg font-semibold">명령 로그</h3>
                    <p className="text-sm text-muted-foreground">차단기 명령 실행 내역을 조회합니다.</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefreshLogs}
                  title="로그 새로고침"
                >
                  <RefreshCw className="w-4 h-4" />
                  새로고침
                </Button>
              </div>
              <DeviceCommandLogSection
                ref={commandLogSectionRef}
                device={device}
              />
            </div>
          )}

          {/* 변경 이력 탭 */}
          {activeTab === 'history' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex gap-3 items-center">
                  <History className="w-5 h-5 text-primary" />
                  <div>
                    <h3 className="text-lg font-semibold">변경 이력</h3>
                    <p className="text-sm text-muted-foreground">차단기 설정 변경 이력을 조회합니다.</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefreshHistory}
                  title="이력 새로고침"
                >
                  <RefreshCw className="w-4 h-4" />
                  새로고침
                </Button>
              </div>
              <DeviceHistorySection
                ref={historySectionRef}
                device={device}
              />
            </div>
          )}
        </div>
      </div>

      {/* 삭제 확인 모달 */}
      <Modal
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        title="차단기 삭제 확인"
        size="md"
        onConfirm={handleDeleteConfirm}
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
        onConfirm={() => setSuccessModalOpen(false)}
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

      {/* 오류 모달 제거됨 - 통합 모듈에서 처리 */}
    </div>
  );
}
