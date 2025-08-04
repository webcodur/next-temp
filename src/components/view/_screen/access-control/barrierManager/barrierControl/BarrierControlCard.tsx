/* 
  파일명: BarrierControlCard.tsx
  기능: 개별 차단기 개폐 제어 카드 컴포넌트
  책임: 차단기 열기/닫기 및 운영모드 설정을 담당한다.
*/

import React, { useState, useRef, useEffect } from 'react';
import { GripVertical, ArrowUpFromLine, ArrowDownFromLine } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { ParkingBarrier, OperationMode } from '@/types/parking';
import { toast } from '@/components/ui/ui-effects/toast/Toast';
import Modal from '@/components/ui/ui-layout/modal/Modal';
import { SectionPanel } from '@/components/ui/ui-layout/section-panel/SectionPanel';

// #region 타입 정의
interface BarrierControlCardProps {
  barrier: ParkingBarrier;
  onToggle: () => void;
  onOperationModeChange: (mode: OperationMode) => void;
  isDragOverlay?: boolean;
  isLocked?: boolean;
}

// #region 운영 모드 옵션
const operationModeOptions = [
  { value: 'always-open', label: '항시 열림' },
  { value: 'bypass', label: '바이패스' },
  { value: 'auto-operation', label: '자동 운행' },
] as const;
// #endregion
// #endregion

// #region 메인 컴포넌트
const BarrierControlCard: React.FC<BarrierControlCardProps> = ({
  barrier,
  onToggle,
  onOperationModeChange,
  isDragOverlay = false,
  isLocked = false,
}) => {
  // #region 상태
  const [editedName, setEditedName] = useState(barrier.name);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showNameChangeConfirmModal, setShowNameChangeConfirmModal] = useState(false);
  
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
    disabled: isDragOverlay,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? 'none' : (transition || 'transform 200ms cubic-bezier(0.25, 1, 0.5, 1)'),
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
  // #endregion

  // #region 핸들러
  const handleBarrierOpen = () => {
    if (isDragOverlay || barrier.isOpen || isLocked) return;
    onToggle();
    toast.success(`${barrier.name} 차단기가 열렸습니다.`);
  };

  const handleBarrierClose = () => {
    if (isDragOverlay || !barrier.isOpen || isLocked) return;
    onToggle();
    toast.success(`${barrier.name} 차단기가 닫혔습니다.`);
  };

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

  const toggleDropdown = () => {
    if (isDragOverlay || isLocked) return;
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleOperationModeSelect = (mode: OperationMode) => {
    if (isDragOverlay) return;
    onOperationModeChange(mode);
    setIsDropdownOpen(false);
    toast.success(`${barrier.name} 운영모드가 변경되었습니다.`);
  };

  const getCurrentModeLabel = () => {
    const option = operationModeOptions.find(opt => opt.value === barrier.operationMode);
    return option?.label || '운영모드 설정';
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
          {/* 개폐상태 설정 (상단 배치) */}
          <div>
            <div className="flex gap-2 items-center mb-3">
              <h4 className="text-sm font-semibold text-foreground">개폐상태</h4>
              <div className="flex-1 h-px bg-border"></div>
              {/* 우측에 현재 상태 표시 */}
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                barrier.isOpen 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
              }`}>
                {barrier.isOpen ? '열림' : '닫힘'}
              </div>
            </div>
            
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={toggleDropdown}
                disabled={isDragOverlay || isLocked}
                className={`w-full flex items-center justify-center p-3 rounded-lg neu-elevated text-center transition-all ${
                  isDragOverlay || isLocked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:neu-inset'
                } ${isDropdownOpen ? 'neu-inset' : ''}`}
              >
                <span className="text-sm font-medium truncate text-foreground">
                  {getCurrentModeLabel()}
                </span>
              </button>

              {/* 드롭다운 옵션들 */}
              {isDropdownOpen && !isDragOverlay && (
                <div className="absolute right-0 left-0 top-full z-50 py-1 rounded-lg border shadow-lg bg-background border-border neu-elevated">
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

          {/* 차단기 개폐 제어 (하단 배치) */}
          <div>
            <div className="grid grid-cols-2 gap-3">
              {/* 차단기 열기 */}
              <button
                onClick={handleBarrierOpen}
                disabled={isDragOverlay || barrier.isOpen || isLocked}
                className={`p-4 rounded-lg text-sm font-medium transition-all neu-raised hover:neu-inset text-foreground flex flex-col items-center justify-center gap-2 ${
                  isDragOverlay || barrier.isOpen || isLocked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                }`}
              >
                <ArrowUpFromLine className="w-6 h-6" />
                <span>열기</span>
              </button>
              
              {/* 차단기 닫기 */}
              <button
                onClick={handleBarrierClose}
                disabled={isDragOverlay || !barrier.isOpen || isLocked}
                className={`p-4 rounded-lg text-sm font-medium transition-all neu-raised hover:neu-inset text-foreground flex flex-col items-center justify-center gap-2 ${
                  isDragOverlay || !barrier.isOpen || isLocked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                }`}
              >
                <ArrowDownFromLine className="w-6 h-6" />
                <span>닫기</span>
              </button>
            </div>
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
              className="px-4 py-2 text-sm rounded-md neu-raised text-foreground hover:neu-flat"
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
    </div>
  );
  // #endregion
};

export default BarrierControlCard;
// #endregion