'use client';

import React, { useState, useMemo, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Save, RotateCcw } from 'lucide-react';

import { Button } from '@/components/ui/ui-input/button/Button';
import { GridFormAuto } from '@/components/ui/ui-layout/grid-form';
import TitleRow from '@/components/ui/ui-layout/title-row/TitleRow';
import Modal from '@/components/ui/ui-layout/modal/Modal';
import { updateParkingDevicePermissions } from '@/services/devices/devices@id_permissions_PUT';
import { ParkingDevice } from '@/types/device';

interface PermissionConfigData {
  residentPermission: boolean;
  regularPermission: boolean;
  visitorPermission: boolean;
  tempPermission: boolean;
  businessPermission: boolean;
  commercialPermission: boolean;
  taxiPermission: boolean;
  ticketMachinePermission: boolean;
  unregisteredPermission: boolean;
}

interface DevicePermissionConfigSectionProps {
  mode?: 'create' | 'edit';
  device?: ParkingDevice;
  onDataChange?: () => void;
  onPermissionChange?: (permissions: PermissionConfigData) => void;
}

export interface DevicePermissionConfigSectionRef {
  resetToDefaults: () => void;
}

const PERMISSION_LABELS = {
  residentPermission: '주민 출입',
  regularPermission: '정기 출입',
  visitorPermission: '방문 출입',
  tempPermission: '임시 출입',
  businessPermission: '업무 출입',
  commercialPermission: '상업 출입',
  taxiPermission: '택시 출입',
  ticketMachinePermission: '발권기 출입',
  unregisteredPermission: '미등록 출입',
};

const DevicePermissionConfigSection = forwardRef<DevicePermissionConfigSectionRef, DevicePermissionConfigSectionProps>(({ 
  mode = 'edit',
  device, 
  onDataChange,
  onPermissionChange 
}, ref) => {
  // #region 상태 관리
  const defaultPermissions: PermissionConfigData = useMemo(() => ({
    residentPermission: true,
    regularPermission: true,
    visitorPermission: false,
    tempPermission: false,
    businessPermission: false,
    commercialPermission: false,
    taxiPermission: false,
    ticketMachinePermission: false,
    unregisteredPermission: false,
  }), []);

  const initialData = mode === 'create' 
    ? defaultPermissions
    : {
        residentPermission: device?.residentPermission === 1,
        regularPermission: device?.regularPermission === 1,
        visitorPermission: device?.visitorPermission === 1,
        tempPermission: device?.tempPermission === 1,
        businessPermission: device?.businessPermission === 1,
        commercialPermission: device?.commercialPermission === 1,
        taxiPermission: device?.taxiPermission === 1,
        ticketMachinePermission: device?.ticketMachinePermission === 1,
        unregisteredPermission: device?.unregisteredPermission === 1,
      };

  const [formData, setFormData] = useState<PermissionConfigData>(initialData);
  const [originalData] = useState<PermissionConfigData>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 모달 상태
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  // #endregion

  // #region 변경 감지
  const hasChanges = useMemo(() => {
    return Object.keys(formData).some((key) => {
      const k = key as keyof PermissionConfigData;
      return formData[k] !== originalData[k];
    });
  }, [formData, originalData]);

  const isValid = useMemo(() => {
    return hasChanges;
  }, [hasChanges]);
  // #endregion

  // #region 초기 데이터 전달 (create 모드)
  useEffect(() => {
    if (mode === 'create' && onPermissionChange) {
      onPermissionChange(formData);
    }
  }, [mode, onPermissionChange, formData]);

  // ref 메소드 노출
  useImperativeHandle(ref, () => ({
    resetToDefaults: () => {
      setFormData(defaultPermissions);
      if (mode === 'create' && onPermissionChange) {
        onPermissionChange(defaultPermissions);
      }
    }
  }), [mode, onPermissionChange, defaultPermissions]);
  // #endregion

  // #region 핸들러
  const handleTogglePermission = (field: keyof PermissionConfigData) => {
    if (isSubmitting) return;
    
    const newData = {
      ...formData,
      [field]: !formData[field],
    };
    
    setFormData(newData);
    
    // create 모드일 때 상위 컴포넌트에 데이터 전달
    if (mode === 'create' && onPermissionChange) {
      onPermissionChange(newData);
    }
  };

  const handleSubmit = async () => {
    if (!isValid || isSubmitting || mode === 'create') return;

    setIsSubmitting(true);

    try {
      const updateData = {
        residentPermission: formData.residentPermission ? 1 : 0,
        regularPermission: formData.regularPermission ? 1 : 0,
        visitorPermission: formData.visitorPermission ? 1 : 0,
        tempPermission: formData.tempPermission ? 1 : 0,
        businessPermission: formData.businessPermission ? 1 : 0,
        commercialPermission: formData.commercialPermission ? 1 : 0,
        taxiPermission: formData.taxiPermission ? 1 : 0,
        ticketMachinePermission: formData.ticketMachinePermission ? 1 : 0,
        unregisteredPermission: formData.unregisteredPermission ? 1 : 0,
      };

      const result = await updateParkingDevicePermissions(device!.id, updateData);

      if (result.success) {
        setModalMessage('출입 권한 설정이 성공적으로 저장되었습니다.');
        setSuccessModalOpen(true);
        // 상위 컴포넌트에 데이터 변경 알림
        onDataChange?.();
      } else {
        console.error('출입 권한 설정 저장 실패:', result.errorMsg);
        setModalMessage(`출입 권한 설정 저장에 실패했습니다: ${result.errorMsg}`);
        setErrorModalOpen(true);
      }
    } catch (error) {
      console.error('출입 권한 설정 저장 중 오류:', error);
      setModalMessage('출입 권한 설정 저장 중 오류가 발생했습니다.');
      setErrorModalOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    if (!hasChanges) return;
    
    setFormData(originalData);
    
    // create 모드일 때 상위 컴포넌트에 초기값 전달
    if (mode === 'create' && onPermissionChange) {
      onPermissionChange(originalData);
    }
  };

  const handleBulkPermission = (permission: boolean) => {
    const newData = Object.keys(formData).reduce((acc, key) => {
      acc[key as keyof PermissionConfigData] = permission;
      return acc;
    }, {} as PermissionConfigData);
    
    setFormData(newData);
    
    // create 모드일 때 상위 컴포넌트에 데이터 전달
    if (mode === 'create' && onPermissionChange) {
      onPermissionChange(newData);
    }
  };
  // #endregion

  return (
    <div className="space-y-6">
      <div className='flex gap-3 justify-between items-center'>
        <TitleRow title="차량 유형별 출입 권한" subtitle="차량 유형별 출입 허가 설정을 관리합니다." />
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => handleBulkPermission(true)}
            disabled={isSubmitting}
          >
            전체 허용
          </Button>
          <Button
            variant="outline"
            onClick={() => handleBulkPermission(false)}
            disabled={isSubmitting}
          >
            전체 거부
          </Button>
        </div>
      </div>

      {/* 권한 목록 */}
      <div className="grid grid-cols-2 gap-3">
        {Object.entries(PERMISSION_LABELS).map(([key, label]) => {
          const isAllowed = formData[key as keyof PermissionConfigData];
          
          return (
            <label
              key={key}
              className={`flex items-center gap-3 p-3 rounded-md transition-all cursor-pointer hover:neu-inset ${
                isAllowed
                  ? 'neu-inset text-primary bg-primary/10'
                  : 'neu-flat'
              } ${isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              <input
                type="checkbox"
                checked={isAllowed}
                onChange={() => handleTogglePermission(key as keyof PermissionConfigData)}
                disabled={isSubmitting}
                className="w-4 h-4 rounded border border-border"
              />
              <span className="font-medium font-multilang">
                {label}
              </span>
            </label>
          );
        })}
      </div>

      {/* 액션 버튼 - edit 모드에서만 표시 */}
      {mode === 'edit' && (
        <GridFormAuto
          fields={[]} // 빈 필드 배열
          gap="0px"
          bottomLeftActions={(
            <Button 
              variant="secondary" 
              onClick={handleReset}
              disabled={!hasChanges || isSubmitting}
              title={!hasChanges ? '변경사항이 없습니다' : '변경사항 되돌리기'}
            >
              <RotateCcw size={16} />
              복구
            </Button>
          )}
          bottomRightActions={(
            <Button 
              variant="primary" 
              onClick={handleSubmit} 
              disabled={!isValid || isSubmitting}
              title={isSubmitting ? '저장 중...' : !isValid ? '변경사항이 없습니다' : '설정 저장'}
            >
              <Save size={16} />
              {isSubmitting ? '저장 중...' : '저장'}
            </Button>
          )}
        />
      )}

      {/* 모달 - edit 모드에서만 표시 */}
      {mode === 'edit' && (
        <>
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
        </>
      )}
    </div>
  );
});

DevicePermissionConfigSection.displayName = 'DevicePermissionConfigSection';

export default DevicePermissionConfigSection;