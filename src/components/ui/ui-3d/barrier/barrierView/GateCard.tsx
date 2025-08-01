/* 
  파일명: /unit/barrier/GateCard.tsx
  기능: 차단기 정책 설정 카드 컴포넌트
  책임: 개별 차단기의 이름 편집, 카테고리 토글, 시점 설정을 담당한다.
*/

import React, { useState } from 'react';
import { Check, Pencil, X } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { Button } from '@/components/ui/ui-input/button/Button';
import Modal from '@/components/ui/ui-layout/modal/Modal';
import BarrierDiagonalView from '@/components/ui/ui-3d/barrier/barrierView/BarrierDiagonalView';
import BarrierDriverView from '@/components/ui/ui-3d/barrier/barrierView/BarrierDriverView';
import BarrierSecurityView from '@/components/ui/ui-3d/barrier/barrierView/BarrierSecurityView';

// #region 타입
type ViewType = 'diagonal' | 'driver' | 'security';

interface GateCardProps {
  id: string;
  orderLabel: string;
  isEditing: boolean;
  gateDisplayName: string;
  categories: Record<string, boolean>;
  selectedView: ViewType;
  setView: (v: ViewType) => void;
  toggleCategory: (gate: string, cat: string) => void;
  onEditStart: () => void;
  onEditCancel: () => void;
  onEditSave: () => void;
  editingName: string;
  setEditingName: React.Dispatch<React.SetStateAction<string>>;
}
// #endregion

// #region 상수
const TITLEBAR_STYLE = 
  		'flex items-center justify-between px-4 py-3 bg-serial-4/50 border-b border-border/30 rounded-t-xl cursor-grab active:cursor-grabbing select-none';
const TITLEBAR_CONTENT_STYLE = 
  'flex items-center gap-2 flex-1 justify-center';

const defaultCategories = [
  '입주',
  '방문',
  '업무',
  '정기',
  '임대',
  '상가',
  '미등록',
  '택시(택배 포함)',
];

const VIEW_LABEL: Record<ViewType, string> = {
  diagonal: '대각선',
  driver: '운전자',
  security: '보안카메라',
};
// #endregion

export default function GateCard({
  id,
  orderLabel,
  isEditing,
  gateDisplayName,
  categories,
  selectedView,
  setView,
  toggleCategory,
  onEditStart,
  onEditCancel,
  onEditSave,
  editingName,
  setEditingName,
}: GateCardProps) {
  // #region 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  // #endregion

  // #region 훅
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? 'none' : transition,
    opacity: isDragging ? 0.8 : 1,
  };
  // #endregion

  // #region 핸들러
  const handleSelectView = (view: ViewType) => {
    setView(view);
    setIsModalOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      onEditCancel();
    } else if (e.key === 'Enter') {
      onEditSave();
    }
  };
  // #endregion

  // #region 렌더링
  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex flex-col rounded-xl border-gray-400 shadow-xl border-1 overflow-hidden">
      
      {/* 윈도우 스타일 타이틀바 (드래그 가능) */}
      <div
        className={TITLEBAR_STYLE}
        {...attributes}
        {...listeners}>
        
        {/* 순서 번호 (좌측) */}
        				<div className="flex items-center justify-center w-8 h-8 text-sm font-bold text-primary bg-serial-5/30 rounded-full">
          {orderLabel.split('/')[0]}
        </div>

        {/* 제목 영역 (중앙) */}
        <div className={TITLEBAR_CONTENT_STYLE}>
          {isEditing ? (
            <input
              className="w-40 px-3 py-1 text-lg font-bold text-center bg-background rounded-md outline-none font-multilang neu-flat focus:neu-inset"
              value={editingName}
              onChange={(e) => setEditingName(e.target.value)}
              onKeyDown={handleKeyDown}
              spellCheck={false}
              onClick={(e) => e.stopPropagation()} // 드래그 방지
            />
          ) : (
            <span className="inline-block w-40 px-3 py-1 text-lg font-bold text-center truncate font-multilang">
              {gateDisplayName}
            </span>
          )}
        </div>

        {/* 액션 버튼들 (우측) */}
        <div className="flex justify-end gap-1" style={{ minWidth: '3.25rem' }}>
          {isEditing ? (
            <>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={(e) => {
                  e.stopPropagation();
                  onEditSave();
                }}
                className="w-6 h-6">
                <Check size={14} />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={(e) => {
                  e.stopPropagation();
                  onEditCancel();
                }}
                className="w-6 h-6">
                <X size={14} />
              </Button>
            </>
          ) : (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={(e) => {
                e.stopPropagation();
                onEditStart();
              }}
              className="w-6 h-6">
              <Pencil size={14} />
            </Button>
          )}
        </div>
      </div>

      {/* 카드 내용 영역 */}
      <div className="flex flex-col gap-4 p-6">
        {/* 카테고리 토글들 */}
        <div className="grid grid-cols-2 gap-3">
          {defaultCategories.map((cat) => {
            const active = categories?.[cat] || false;
            const buttonClass = active
              ? 'neu-inset text-primary'
              : 'neu-raised text-muted-foreground';

            return (
              <button
                key={cat}
                disabled={!isEditing}
                onClick={() => toggleCategory(id, cat)}
                className={`
                  p-3 rounded-lg text-sm font-medium transition-all duration-150 font-multilang
                  ${buttonClass}
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:neu-flat
                  ${!isEditing ? '' : 'hover:scale-[1.03]'}
                `}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* 뷰 설정 */}
        <div className="flex gap-2 justify-center items-center mt-2">
          <span className="text-sm font-multilang">시점:</span>
          <span className="text-sm font-semibold text-primary">{VIEW_LABEL[selectedView]}</span>
          <Button variant="ghost" size="sm" onClick={() => setIsModalOpen(true)}>
            변경
          </Button>
        </div>
      </div>

      {/* 뷰 선택 모달 */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="시점 선택" size="lg">
        <div className="grid gap-4 md:grid-cols-3">
          <div
            className="flex flex-col gap-2 items-center cursor-pointer"
            onClick={() => handleSelectView('diagonal')}>
            <BarrierDiagonalView width={200} height={240} showTitle={false} showControls={false} />
            <span className="text-sm font-multilang">대각선</span>
          </div>
          <div
            className="flex flex-col gap-2 items-center cursor-pointer"
            onClick={() => handleSelectView('driver')}>
            <BarrierDriverView width={200} height={240} showTitle={false} showControls={false} />
            <span className="text-sm font-multilang">운전자</span>
          </div>
          <div
            className="flex flex-col gap-2 items-center cursor-pointer"
            onClick={() => handleSelectView('security')}>
            <BarrierSecurityView width={200} height={240} showTitle={false} showControls={false} />
            <span className="text-sm font-multilang">보안카메라</span>
          </div>
        </div>
      </Modal>
    </div>
  );
  // #endregion
} 