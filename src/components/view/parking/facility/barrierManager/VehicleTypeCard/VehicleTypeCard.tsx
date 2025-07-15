/* 
  파일명: /components/view/parking/facility/BarrierManagementView/VehicleTypeCard/VehicleTypeCard.tsx
  기능: 차단기별 출입 유형 차량 설정 카드 컴포넌트
  책임: 드래그 앤 드롭, 이름 편집, 정책 설정, 차단기 제어를 통합 관리한다.
*/ // ------------------------------

import React, { useState, useEffect, useRef } from 'react';

import { Lock, Unlock, Settings, GripVertical, Send } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { ParkingBarrier, OperationMode } from '@/types/parking';
import { BorderBeam } from '@/app/lab/system-testing/playground/BorderBeam';
import { toast } from '@/components/ui/ui-effects/toast/Toast';
import Modal from '@/components/ui/ui-layout/modal/Modal';

import VehicleTypeSettings from './VehicleTypeSettings';

// #region 타입 정의
interface VehicleTypeCardProps {
  barrier: ParkingBarrier;
  onToggle: () => void;
  onOperationModeChange: (mode: OperationMode) => void;
  onPolicyUpdate: (policies: Record<string, boolean>) => void;
  isDragOverlay?: boolean;
}
// #endregion

// #region 운영 모드 옵션
const operationModeOptions = [
  { value: 'always-open', label: '항시 열림' },
  { value: 'bypass', label: '바이패스' },
  { value: 'auto-operation', label: '자동 운행' },
] as const;
// #endregion

// #region 상수 정의
const defaultPolicies: Record<string, boolean> = {
  '입주': true,
  '방문': true,
  '업무': true,
  '정기': true,
  '임대': false,
  '상가': false,
  '미등록': false,
  '택시(택배 포함)': true,
};
// #endregion

// #region 메인 컴포넌트
const VehicleTypeCard: React.FC<VehicleTypeCardProps> = ({
  barrier,
  onToggle,
  onOperationModeChange,
  onPolicyUpdate,
  isDragOverlay = false,
}) => {
  // #region 상태
  const [isLocked, setIsLocked] = useState(true);
  const [editingName, setEditingName] = useState(barrier.name);
  const [editingOperationMode, setEditingOperationMode] = useState(barrier.operationMode);
  const [policies, setPolicies] = useState<Record<string, boolean>>(defaultPolicies);
  const [hasChanges, setHasChanges] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  
  // 원본 값 저장용 상태
  const [originalName, setOriginalName] = useState(barrier.name);
  const [originalPolicies, setOriginalPolicies] = useState<Record<string, boolean>>(defaultPolicies);
  
  // 컴포넌트 참조
  const cardRef = useRef<HTMLDivElement>(null);
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

  // barrier prop이 변경될 때마다 상태 업데이트
  useEffect(() => {
    setEditingName(barrier.name);
    setEditingOperationMode(barrier.operationMode);
    setOriginalName(barrier.name);
  }, [barrier.name, barrier.operationMode]);

  // 변경사항 감지 - 실시간으로 체크
  useEffect(() => {
    const nameChanged = editingName !== originalName;
    const policiesChanged = JSON.stringify(policies) !== JSON.stringify(originalPolicies);
    setHasChanges(nameChanged || policiesChanged);
  }, [editingName, originalName, policies, originalPolicies]);

  // 컴포넌트 바깥쪽 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // 잠금 상태이거나 드래그 오버레이면 동작하지 않음
      if (isLocked || isDragOverlay) return;
      
      // 클릭이 컴포넌트 바깥에서 발생했는지 확인
      if (cardRef.current && event.target && !cardRef.current.contains(event.target as Node)) {
        // 변경사항이 있으면 Modal 표시, 없으면 바로 잠금
        if (hasChanges) {
          setShowSaveModal(true);
        } else {
          setIsLocked(true);
        }
      }
    };

    // 잠금 해제 상태일 때만 이벤트 리스너 등록
    if (!isLocked && !isDragOverlay) {
      document.addEventListener('mousedown', handleClickOutside, true);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
    };
  }, [isLocked, isDragOverlay, hasChanges, originalName, originalPolicies, barrier.operationMode]);
  // #endregion

  // #region 핸들러
  const handleSave = () => {
    onOperationModeChange(editingOperationMode);
    onPolicyUpdate(policies);
    
    // 저장 후 원본 값 업데이트
    setOriginalName(editingName);
    setOriginalPolicies({...policies});
    setHasChanges(false);
    setIsLocked(true);
  };

  const handleRestore = () => {
    // 이전 값으로 복구
    setEditingName(originalName);
    setEditingOperationMode(barrier.operationMode);
    setPolicies({...originalPolicies});
    setHasChanges(false);
    setIsLocked(true);
  };

  const handleToggleLock = () => {
    if (isDragOverlay) return;
    
    if (!isLocked) {
      // 잠금 시 변경사항이 있으면 Modal 표시, 없으면 바로 잠금
      if (hasChanges) {
        setShowSaveModal(true);
      } else {
        setIsLocked(true);
      }
    } else {
      // 잠금 해제 시 현재 값을 원본으로 저장
      setOriginalName(editingName);
      setOriginalPolicies({...policies});
      setIsLocked(false);
    }
  };

  const handleApplyChanges = () => {
    handleSave();
    setShowSaveModal(false);
  };

  const handleDiscardChanges = () => {
    handleRestore();
    setShowSaveModal(false);
  };

  const handleNameChange = (name: string) => {
    setEditingName(name);
  };

  const handlePolicyUpdate = (newPolicies: Record<string, boolean>) => {
    if (isDragOverlay || isLocked) return;
    setPolicies(newPolicies);
  };

  const handleOperationModeChange = (mode: OperationMode) => {
    if (isLocked) return;
    setEditingOperationMode(mode);
    onOperationModeChange(mode);
  };

  const handleBarrierOpen = () => {
    if (isLocked || barrier.isOpen) return;
    onToggle();
    toast.success(`"${barrier.name}" 차단기가 열렸습니다.`);
  };

  const handleBarrierClose = () => {
    if (isLocked || !barrier.isOpen) return;
    onToggle();
    toast.success(`"${barrier.name}" 차단기가 닫혔습니다.`);
  };

  // ESC 키 핸들러
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && !isLocked) {
      if (hasChanges) {
        setShowSaveModal(true);
      } else {
        setIsLocked(true);
      }
    }
  };
  // #endregion

  // #region 렌더링
  return (
    <div 
      ref={(node) => {
        // 항상 cardRef를 설정 (드래그 오버레이가 아닐 때)
        if (!isDragOverlay) {
          setNodeRef(node);
        }
        cardRef.current = node;
      }}
      style={isDragOverlay ? {} : style}
      className={`rounded-lg neu-flat bg-surface-2 flex flex-col relative overflow-hidden ${
        isDragging && !isDragOverlay ? 'opacity-50' : ''
      }`}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      {/* BorderBeam - 수정 중일 때만 표시 */}
      {!isLocked && !isDragOverlay && (
        <BorderBeam
          size={60}
          duration={4}
          colorFrom="hsl(var(--primary))"
          colorTo="hsl(var(--primary) / 0.3)"
          borderWidth={2}
        />
      )}

      {/* 카드 헤더 - 윈도우 앱 스타일 */}
      <div className="flex gap-3 items-center px-4 py-3 bg-gradient-to-r from-primary/80 to-primary/60 text-primary-foreground">
        {/* DND 손잡이 */}
        <div 
          {...(isDragOverlay ? {} : { ...attributes, ...listeners })}
          className={`flex items-center justify-center p-1 rounded transition-colors ${
            isDragOverlay ? '':'cursor-grab active:cursor-grabbing hover:bg-white/20'}`}
        >
          <GripVertical className="w-5 h-5 text-white/80" />
        </div>

        {/* 차단기명 */}
        <div className="flex flex-1 justify-center items-center h-10">
          {!isLocked && !isDragOverlay ? (
            <input
              type="text"
              value={editingName}
              onChange={(e) => handleNameChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') handleToggleLock();
              }}
              className="px-3 py-2 w-full max-w-xs h-10 text-lg font-semibold text-center rounded border border-white/30 text-foreground bg-surface-1 font-multilang"
              autoFocus
              spellCheck={false}
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <h3 className="flex items-center px-3 py-2 h-10 text-lg font-bold text-white rounded transition-colors cursor-not-allowed font-multilang">
              {editingName}
            </h3>
          )}
        </div>

        {/* 상태별 버튼 */}
        {!isDragOverlay && (
          <button
            onClick={!isLocked && hasChanges ? handleSave : handleToggleLock}
            className={`p-2 rounded-full transition-all neu-raised hover:neu-flat ${
              isLocked 
                ? 'text-white bg-white/10' 
                : hasChanges
                  ? 'text-white bg-white/20'
                  : 'text-white bg-white/20'
            }`}
            title={
              isLocked 
                ? '잠금 해제' 
                : hasChanges 
                  ? '변경사항 저장' 
                  : '잠금'
            }
          >
            {isLocked ? (
              <Lock className="w-5 h-5" />
            ) : hasChanges ? (
              <Send className="w-5 h-5" />
            ) : (
              <Unlock className="w-5 h-5" />
            )}
          </button>
        )}
      </div>

      {/* 카드 본문 */}
      <div className="flex flex-col p-4">
        {/* 차단기 개폐 설정 + 운영모드 */}
        <div className="mb-4">
          <div className="flex gap-2 items-center mb-3">
            <h4 className="text-sm font-semibold text-foreground">차단기 개폐 설정</h4>
            <div className="flex-1 h-px bg-border"></div>
          </div>
          
          <div className="grid grid-cols-4 gap-3">
            {/* 차단기 열기 */}
            <button
              onClick={handleBarrierOpen}
              disabled={isDragOverlay || isLocked}
              className={`p-3 rounded-lg text-sm font-medium transition-all ${
                isLocked ? 'neu-elevated' : 'neu-raised hover:neu-inset'
              } bg-background text-foreground ${
                isDragOverlay || isLocked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
              }`}
            >
              열기
            </button>
            
            {/* 차단기 닫기 */}
            <button
              onClick={handleBarrierClose}
              disabled={isDragOverlay || isLocked}
              className={`p-3 rounded-lg text-sm font-medium transition-all ${
                isLocked ? 'neu-elevated' : 'neu-raised hover:neu-inset'
              } bg-background text-foreground ${
                isDragOverlay || isLocked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
              }`}
            >
              닫기
            </button>
            
            {/* 운영모드 설정 */}
            <div className="flex col-span-2 gap-2 items-center p-3 rounded-lg bg-background neu-elevated">
              <Settings className="flex-shrink-0 w-4 h-4 text-muted-foreground" />
              <select
                value={barrier.operationMode}
                onChange={(e) => handleOperationModeChange(e.target.value as OperationMode)}
                disabled={isDragOverlay || isLocked}
                className={`flex-1 text-sm text-foreground bg-transparent border-none outline-none font-medium ${
                  isLocked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                {operationModeOptions.map((option) => (
                  <option key={option.value} value={option.value} className='text-foreground bg-background'>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 출입 유형 차량 설정 */}
        <div className="mb-4">
          <div className="flex gap-2 items-center mb-3">
            <h4 className="text-sm font-semibold text-foreground">출입 유형 차량 설정</h4>
            <div className="flex-1 h-px bg-border"></div>
          </div>
          
          <div className={isLocked ? 'cursor-not-allowed' : ''}>
            <VehicleTypeSettings
              policies={policies}
              onPolicyUpdate={handlePolicyUpdate}
              isEditMode={!isLocked && !isDragOverlay}
            />
          </div>
        </div>
      </div>

      {/* 변경사항 저장 확인 Modal */}
      <Modal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        title="변경사항 저장"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-foreground">
            &ldquo;{editingName}&rdquo; 차단기에 변경사항이 있습니다.
          </p>
          <p className="text-sm text-muted-foreground">
            변경사항을 적용하시겠습니까?
          </p>
          
          <div className="flex gap-3 justify-end">
            <button
              onClick={handleDiscardChanges}
              className="px-4 py-2 text-sm rounded-md neu-raised bg-background text-foreground hover:neu-flat"
            >
              취소 (복구)
            </button>
            <button
              onClick={handleApplyChanges}
              className="px-4 py-2 text-sm rounded-md neu-raised bg-primary text-primary-foreground hover:neu-flat"
            >
              적용
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
  // #endregion
};

export default VehicleTypeCard;
// #endregion 