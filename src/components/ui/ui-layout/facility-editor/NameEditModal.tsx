import { useState, useEffect, useRef } from 'react';
import { Position, CellType } from '@/types/facility-editor';
import { X, Save } from 'lucide-react';
import { clsx } from 'clsx';

// #region 타입 정의
interface NameEditModalProps {
  isOpen: boolean;
  position: Position | null;
  cellType: CellType;
  currentName: string;
  onSave: (name: string) => void;
  onCancel: () => void;
}
// #endregion

// #region 유틸리티 함수
const getTypeLabel = (type: CellType): string => {
  switch (type) {
    case 'seat':
      return '좌석';
    case 'object':
      return '객체';
    default:
      return '';
  }
};

const getTypeColor = (type: CellType): string => {
  switch (type) {
    case 'seat':
      return 'text-green-600';
    case 'object':
      return 'text-yellow-600';
    default:
      return 'text-gray-500';
  }
};
// #endregion

// #region 메인 컴포넌트
export const NameEditModal = ({
  isOpen,
  position,
  cellType,
  currentName,
  onSave,
  onCancel,
}: NameEditModalProps) => {
  const [name, setName] = useState(currentName);
  const inputRef = useRef<HTMLInputElement>(null);

  // 모달이 열릴 때 입력 필드 포커스 및 텍스트 선택
  useEffect(() => {
    if (isOpen) {
      setName(currentName);
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.select();
        }
      }, 100);
    }
  }, [isOpen, currentName]);

  // 키보드 이벤트 처리
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onCancel();
    }
  };

  // 저장 처리
  const handleSave = () => {
    const trimmedName = name.trim();
    if (trimmedName) {
      onSave(trimmedName);
    } else {
      onCancel();
    }
  };

  // 모달이 닫혀있으면 렌더링하지 않음
  if (!isOpen || !position) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="neu-flat bg-surface-1 rounded-lg p-6 w-full max-w-md">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">
            <span className={clsx('font-medium', getTypeColor(cellType))}>
              {getTypeLabel(cellType)}
            </span>
            {' '}이름 편집
          </h2>
          <button
            onClick={onCancel}
            className="p-1 rounded-lg neu-raised hover:neu-inset transition-all duration-150"
            title="취소 (Esc)"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* 위치 정보 */}
        <div className="mb-4 p-3 rounded-lg neu-inset bg-surface-2">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            위치: ({position.x}, {position.y})
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            좌표: {String.fromCharCode(65 + position.y)}{position.x + 1}
          </div>
        </div>

        {/* 입력 필드 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-foreground mb-2">
            이름
          </label>
          <input
            ref={inputRef}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleKeyDown}
            className={clsx(
              'w-full px-3 py-2 rounded-lg border-2 transition-all duration-150',
              'neu-inset bg-surface-2 text-foreground font-multilang',
              'focus:outline-none focus:border-primary focus:neu-flat',
              'border-gray-300 dark:border-gray-600'
            )}
            placeholder={`${getTypeLabel(cellType)} 이름을 입력하세요`}
            maxLength={20}
          />
          <div className="mt-1 text-xs text-gray-500">
            {name.length}/20 글자
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium rounded-lg neu-raised hover:neu-inset transition-all duration-150 text-foreground"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            disabled={!name.trim()}
            className={clsx(
              'px-4 py-2 text-sm font-medium rounded-lg transition-all duration-150 flex items-center gap-2',
              name.trim()
                ? 'neu-raised hover:neu-inset bg-primary text-primary-foreground'
                : 'neu-flat text-gray-400 cursor-not-allowed'
            )}
          >
            <Save className="w-4 h-4" />
            저장
          </button>
        </div>

        {/* 안내 텍스트 */}
        <div className="mt-4 text-xs text-gray-500 text-center">
          Enter 키로 저장, Esc 키로 취소
        </div>
      </div>
    </div>
  );
};
// #endregion 