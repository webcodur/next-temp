/* 
  파일명: BarrierCard.tsx
  기능: 개별 차단기 제어 카드 컴포넌트
  책임: 차단기 제어, 운영모드 설정, 세부 정책 설정을 통합 관리한다.
*/

import React, { useState, useRef, useEffect } from 'react';
import { Settings as SettingsIcon, GripVertical, ChevronDown, Sliders } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { ParkingBarrier, OperationMode, VehicleAccessPolicy } from '@/types/parking';
import { createEmptyAccessPolicy } from '@/data/vehiclePolicyData';
import { toast } from '@/components/ui/ui-effects/toast/Toast';
import Modal from '@/components/ui/ui-layout/modal/Modal';
import { SectionPanel } from '@/components/ui/ui-layout/section-panel/SectionPanel';
import { SimpleToggleSwitch } from '@/components/ui/ui-input/simple-input/SimpleToggleSwitch';
import VehicleConfig from './VehicleConfig';

// #region 타입 정의
interface BarrierPolicy {
  workHour: boolean;
  blacklist: boolean;
}

interface BarrierCardProps {
  barrier: ParkingBarrier;
  policy: BarrierPolicy;
  onToggle: () => void;
  onOperationModeChange: (mode: OperationMode) => void;
  onPolicyUpdate: (barrierId: string, policy: BarrierPolicy) => void;
  isDragOverlay?: boolean;
  globalReturnHourEnabled?: boolean;
  isLocked?: boolean;
}
// #endregion

// #region 운영 모드 옵션
const operationModeOptions = [
  { value: 'always-open', label: '항시 열림' },
  { value: 'bypass', label: '바이패스' },
  { value: 'auto-operation', label: '자동 운행' },
] as const;
// #endregion

// #region 메인 컴포넌트
const BarrierCard: React.FC<BarrierCardProps> = ({
  barrier,
  policy,
  onToggle,
  onOperationModeChange,
  onPolicyUpdate,
  isDragOverlay = false,
  globalReturnHourEnabled = false,
  isLocked = false,
}) => {
  // #region 상태
  const [editedName, setEditedName] = useState(barrier.name);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showNameChangeConfirmModal, setShowNameChangeConfirmModal] = useState(false);
  const [showVehicleConfigModal, setShowVehicleConfigModal] = useState(false);
  const [vehiclePolicies, setVehiclePolicies] = useState<VehicleAccessPolicy>(createEmptyAccessPolicy);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const nameEditRef = useRef<HTMLInputElement>(null);
  // #endregion

  // #region 훅
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: barrier.id,
    disabled: isDragOverlay
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // 드롭다운 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  // 이름 편집 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (nameEditRef.current && !nameEditRef.current.contains(event.target as Node)) {
        const hasChanges = editedName !== barrier.name;
        if (hasChanges) {
          setShowNameChangeConfirmModal(true);
        } else {
          setIsEditingName(false);
        }
      }
    };

    if (isEditingName) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isEditingName, editedName, barrier.name]);

  // 편집 모드 포커스
  useEffect(() => {
    if (isEditingName && nameEditRef.current) {
      nameEditRef.current.focus();
      nameEditRef.current.select();
    }
  }, [isEditingName]);
  // #endregion

  // #region 핸들러
  const handleBarrierOpen = () => {
    if (barrier.isOpen) return;
    onToggle();
    toast.success(`"${barrier.name}" 차단기가 열렸습니다.`);
  };

  const handleBarrierClose = () => {
    if (!barrier.isOpen) return;
    onToggle();
    toast.success(`"${barrier.name}" 차단기가 닫혔습니다.`);
  };

  const handleStartEditName = () => {
    if (isLocked || isDragOverlay) return;
    setIsEditingName(true);
    setEditedName(barrier.name);
  };

  const handleNameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const hasChanges = editedName.trim() !== barrier.name;
      if (hasChanges && editedName.trim()) {
        setShowNameChangeConfirmModal(true);
      } else {
        setIsEditingName(false);
        setEditedName(barrier.name);
      }
    } else if (e.key === 'Escape') {
      setIsEditingName(false);
      setEditedName(barrier.name);
    }
  };



  const handleSaveName = () => {
    // TODO: 실제 이름 변경 API 호출
    console.log('차단기 이름 변경:', editedName);
    toast.success(`차단기 이름이 "${editedName}"(으)로 변경되었습니다.`);
    setIsEditingName(false);
    setShowNameChangeConfirmModal(false);
  };

  const handleCancelNameEdit = () => {
    setIsEditingName(false);
    setEditedName(barrier.name);
    setShowNameChangeConfirmModal(false);
  };

  const handleOperationModeSelect = (mode: OperationMode) => {
    if (isDragOverlay) return;
    onOperationModeChange(mode);
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    if (!isDragOverlay) {
      setIsDropdownOpen(!isDropdownOpen);
    }
  };

  const getCurrentModeLabel = () => {
    return operationModeOptions.find(option => option.value === barrier.operationMode)?.label || '알 수 없음';
  };

  const handleWorkHourChange = (value: boolean) => {
    if (isDragOverlay) return;
    onPolicyUpdate(barrier.id, { ...policy, workHour: value });
  };

  const handleBlacklistChange = (value: boolean) => {
    if (isDragOverlay) return;
    onPolicyUpdate(barrier.id, { ...policy, blacklist: value });
  };

  const handleVehiclePolicyUpdate = (newPolicies: VehicleAccessPolicy) => {
    setVehiclePolicies(newPolicies);
  };

  const handleOpenVehicleConfig = () => {
    if (isDragOverlay) return;
    setShowVehicleConfigModal(true);
  };
  // #endregion

  // #region 렌더링
  return (
    <div 
      ref={isDragOverlay ? undefined : setNodeRef}
      style={isDragOverlay ? {} : style}
      className={`h-full ${isDragging && !isDragOverlay ? 'opacity-50' : ''}`}
    >
      <SectionPanel
        title={
          isEditingName ? (
            <input
              ref={nameEditRef}
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              onKeyDown={handleNameKeyDown}
              className="w-full h-8 px-2 text-center text-base font-bold text-white bg-transparent border border-white/30 rounded focus:outline-none focus:border-white/50 focus:bg-white/10"
              placeholder="차단기 이름"
            />
          ) : (
            <div
              onClick={handleStartEditName}
              className={`w-full h-8 px-2 flex items-center justify-center text-center text-base font-bold text-white rounded transition-colors ${
                !isLocked && !isDragOverlay 
                  ? 'cursor-pointer hover:bg-white/10' 
                  : ''
              }`}
              title={!isLocked && !isDragOverlay ? '클릭하여 이름 수정' : ''}
            >
              <span className="truncate">{barrier.name}</span>
            </div>
          )
        }
        icon={
          <div 
            {...(isDragOverlay ? {} : { ...attributes, ...listeners })}
            className={`flex items-center justify-center transition-colors ${
              isDragOverlay ? '':'cursor-grab active:cursor-grabbing hover:bg-white/20 p-1 rounded'}`}
          >
            <GripVertical className="w-4 h-4 text-white/80" />
          </div>
        }
        headerActions={undefined}
      >
          <div className="p-4 space-y-4">
            {/* 차단기 개폐 설정 + 운영모드 */}
            <div>
              <div className="flex gap-2 items-center mb-3">
                <h4 className="text-sm font-semibold text-foreground">차단기 제어</h4>
                <div className="flex-1 h-px bg-border"></div>
                <span className={`text-sm font-bold ${barrier.isOpen ? 'text-green-600' : 'text-red-600'}`}>
                  {barrier.isOpen ? '열림' : '닫힘'}
                </span>
              </div>
              
              <div className="grid grid-cols-4 gap-3">
                {/* 차단기 열기 */}
                <button
                  onClick={handleBarrierOpen}
                  disabled={isDragOverlay || barrier.isOpen || isLocked}
                  className={`p-3 rounded-lg text-sm font-medium transition-all neu-raised hover:neu-inset bg-background text-foreground ${
                    isDragOverlay || barrier.isOpen || isLocked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                  }`}
                >
                  열기
                </button>
                
                {/* 차단기 닫기 */}
                <button
                  onClick={handleBarrierClose}
                  disabled={isDragOverlay || !barrier.isOpen || isLocked}
                  className={`p-3 rounded-lg text-sm font-medium transition-all neu-raised hover:neu-inset bg-background text-foreground ${
                    isDragOverlay || !barrier.isOpen || isLocked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                  }`}
                >
                  닫기
                </button>
                
                {/* 운영모드 설정 */}
                <div className="relative col-span-2" ref={dropdownRef}>
                  <button
                    onClick={toggleDropdown}
                    disabled={isDragOverlay || isLocked}
                    className={`w-full flex gap-2 items-center p-3 rounded-lg bg-background neu-elevated text-left transition-all ${
                      isDragOverlay || isLocked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:neu-inset'
                    } ${isDropdownOpen ? 'neu-inset' : ''}`}
                  >
                    <SettingsIcon className="flex-shrink-0 w-4 h-4 text-muted-foreground" />
                    <span className="flex-1 text-sm font-medium truncate text-foreground">
                      {getCurrentModeLabel()}
                    </span>
                    <ChevronDown className={`flex-shrink-0 w-4 h-4 text-muted-foreground transition-transform ${
                      isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* 드롭다운 옵션들 */}
                  {isDropdownOpen && !isDragOverlay && (
                    <div className="absolute right-0 left-0 top-full z-10 py-1 mt-1 rounded-lg border shadow-lg bg-background border-border neu-elevated">
                      {operationModeOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => handleOperationModeSelect(option.value as OperationMode)}
                          className={`w-full px-3 py-2 text-left text-sm font-medium transition-colors hover:bg-muted/50 first:rounded-t-md last:rounded-b-md ${
                            barrier.operationMode === option.value 
                              ? 'bg-primary/10 text-primary' 
                              : 'text-foreground'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 회차 정책 설정 - 전역 설정이 활성화된 경우에만 표시 */}
            {globalReturnHourEnabled && (
              <div>
                <div className="flex gap-2 items-center mb-3">
                  <h4 className="text-sm font-semibold text-foreground">회차 정책 설정</h4>
                  <div className="flex-1 h-px bg-border"></div>
                </div>
                
                <div className="pl-4 space-y-3">
                  {/* 회차시간 토글 */}
                  <SimpleToggleSwitch
                    label="회차시간"
                    checked={policy.workHour}
                    onChange={handleWorkHourChange}
                    size="sm"
                    disabled={isDragOverlay || isLocked}
                  />

                  {/* 블랙리스트 토글 */}
                  <SimpleToggleSwitch
                    label="블랙리스트"
                    checked={policy.blacklist}
                    onChange={handleBlacklistChange}
                    size="sm"
                    disabled={isDragOverlay || isLocked}
                  />
                </div>
              </div>
            )}

            {/* 출입 유형 설정 */}
            <div>
              <div className="flex gap-2 items-center mb-3">
                <h4 className="text-sm font-semibold text-foreground">출입 유형 설정</h4>
                <div className="flex-1 h-px bg-border"></div>
              </div>
              
              <button
                onClick={handleOpenVehicleConfig}
                disabled={isDragOverlay || isLocked}
                className={`w-full p-3 rounded-lg text-sm font-medium transition-all neu-raised hover:neu-inset bg-background text-foreground flex items-center justify-center gap-2 ${
                  isDragOverlay || isLocked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                }`}
              >
                <Sliders className="w-4 h-4" />
                출입 유형 설정
              </button>
            </div>
          </div>
      </SectionPanel>

      {/* 이름 변경 확인 모달 */}
      <Modal
        isOpen={showNameChangeConfirmModal}
        onClose={() => setShowNameChangeConfirmModal(false)}
        title="이름 변경 확인"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-foreground">
            차단기 이름에 변경사항이 있습니다.
          </p>
          <p className="text-sm text-muted-foreground">
            변경사항을 저장하시겠습니까?
          </p>
          
          <div className="flex gap-3 justify-end">
            <button
              onClick={handleCancelNameEdit}
              className="px-4 py-2 text-sm rounded-md neu-raised bg-background text-foreground hover:neu-flat"
            >
              취소 (복구)
            </button>
            <button
              onClick={handleSaveName}
              className="px-4 py-2 text-sm rounded-md neu-raised bg-primary text-primary-foreground hover:neu-flat"
            >
              저장
            </button>
          </div>
        </div>
      </Modal>

      {/* 차량 유형 설정 모달 */}
      <Modal
        isOpen={showVehicleConfigModal}
        onClose={() => setShowVehicleConfigModal(false)}
        title={`${barrier.name} - 출입 유형 설정`}
        size="md"
      >
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            이 차단기를 통과할 수 있는 차량 유형을 설정하세요.
          </p>
          
          <VehicleConfig
            policies={vehiclePolicies}
            onPolicyUpdate={handleVehiclePolicyUpdate}
            isLocked={isLocked}
          />
          
          <div className="flex gap-3 justify-end pt-4 border-t border-border">
            <button
              onClick={() => setShowVehicleConfigModal(false)}
              className="px-4 py-2 text-sm rounded-md neu-raised bg-background text-foreground hover:neu-flat"
            >
              닫기
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
  // #endregion
};

export default BarrierCard;
// #endregion 