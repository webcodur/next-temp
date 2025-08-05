/* 
  파일명: BarrierPolicyCard.tsx
  기능: 개별 차단기 운영설정 카드 컴포넌트
  책임: 출입유형, 회차정책 설정을 담당한다.
*/

import React, { useState, useRef } from 'react';
import { GripVertical } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { ParkingBarrier, VehicleAccessPolicy } from '@/types/parking';
import { createEmptyAccessPolicy } from '@/data/vehiclePolicyData';
import { toast } from '@/components/ui/ui-effects/toast/Toast';
import Modal from '@/components/ui/ui-layout/modal/Modal';
import { SectionPanel } from '@/components/ui/ui-layout/section-panel/SectionPanel';
import { SimpleToggleSwitch } from '@/components/ui/ui-input/simple-input/SimpleToggleSwitch';
import { Button } from '@/components/ui/ui-input/button/Button';
import VehicleConfig from '../barrierCard/VehicleConfig';

// #region 타입 정의
interface BarrierPolicy {
  workHour: boolean;
  blacklist: boolean;
}

interface BarrierPolicyCardProps {
  barrier: ParkingBarrier;
  policy: BarrierPolicy;
  onPolicyUpdate: (barrierId: string, policy: BarrierPolicy) => void;
  isDragOverlay?: boolean;
  globalReturnHourEnabled?: boolean;
  isLocked?: boolean;
}
// #endregion

// #region 메인 컴포넌트
const BarrierPolicyCard: React.FC<BarrierPolicyCardProps> = ({
  barrier,
  policy,
  onPolicyUpdate,
  isDragOverlay = false,
  globalReturnHourEnabled = false,
  isLocked = false,
}) => {
  // #region 상태
  const [editedName, setEditedName] = useState(barrier.name);
  const [isEditingName, setIsEditingName] = useState(false);
  const [showNameChangeConfirmModal, setShowNameChangeConfirmModal] = useState(false);
  const [vehiclePolicies, setVehiclePolicies] = useState<VehicleAccessPolicy>(createEmptyAccessPolicy);
  
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
    disabled: isDragOverlay,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? 'none' : (transition || 'transform 200ms cubic-bezier(0.25, 1, 0.5, 1)'),
  };
  // #endregion

  // #region 핸들러
  const handleStartEditName = () => {
    if (isLocked || isDragOverlay) return;
    setIsEditingName(true);
    setTimeout(() => nameEditRef.current?.focus(), 0);
  };

  const handleNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (editedName.trim() !== barrier.name) {
        setShowNameChangeConfirmModal(true);
      } else {
        setIsEditingName(false);
      }
    } else if (e.key === 'Escape') {
      setEditedName(barrier.name);
      setIsEditingName(false);
    }
  };

  const handleSaveName = () => {
    // 실제 저장 로직은 여기에 구현
    toast.success(`차단기 이름이 "${editedName}"으로 변경되었습니다.`);
    setIsEditingName(false);
    setShowNameChangeConfirmModal(false);
  };

  const handleCancelNameEdit = () => {
    setEditedName(barrier.name);
    setIsEditingName(false);
    setShowNameChangeConfirmModal(false);
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
  // #endregion

  // #region 렌더링
  return (
    <div 
      ref={isDragOverlay ? undefined : setNodeRef}
      style={isDragOverlay ? {} : style}
      className={`h-full ${isDragging && !isDragOverlay ? 'opacity-0' : ''}`}
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
              className="px-2 w-full h-8 text-base font-bold text-center bg-transparent rounded border text-foreground border-foreground/30 focus:outline-none focus:border-foreground/50 focus:bg-foreground/10"
              placeholder="차단기 이름"
            />
          ) : (
            <div
              onClick={handleStartEditName}
              className={`w-full h-8 px-2 flex items-center justify-center text-center text-base font-bold text-foreground rounded transition-colors ${
                !isLocked && !isDragOverlay 
                  ? 'cursor-pointer hover:bg-foreground/10' 
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
              isDragOverlay ? '':'cursor-grab active:cursor-grabbing hover:bg-foreground/20 p-1 rounded'}`}
          >
            <GripVertical className="w-4 h-4 text-foreground/80" />
          </div>
        }
        headerActions={undefined}
      >
        <div className="p-4 space-y-4">
          {/* 출입 유형 설정 */}
          <div>
            <div className="flex gap-2 items-center mb-3">
              <h4 className="text-sm font-semibold text-foreground">출입 유형 설정</h4>
              <div className="flex-1 h-px bg-border"></div>
            </div>
            
            <VehicleConfig
              policies={vehiclePolicies}
              onPolicyUpdate={handleVehiclePolicyUpdate}
              isLocked={isDragOverlay || isLocked}
            />
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
            <Button
              onClick={handleCancelNameEdit}
              variant="outline"
              size="sm"
            >
              취소 (복구)
            </Button>
            <Button
              onClick={handleSaveName}
              variant="primary"
              size="sm"
            >
              저장
            </Button>
          </div>
        </div>
      </Modal>


    </div>
  );
  // #endregion
};

export default BarrierPolicyCard;
// #endregion