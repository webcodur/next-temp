/* 
  파일명: /app/parking/household/instances/HouseholdInstancesManager/InstanceTable/InstanceActions.tsx
  기능: 거주 이력 테이블의 액션 버튼들
  책임: 보기, 설정, 수정, 삭제 버튼을 렌더링한다.
*/ // ------------------------------

import { Settings, Eye, Edit, Trash2 } from 'lucide-react';
import type { HouseholdInstance } from '@/types/household';

// #region 타입
interface InstanceActionsProps {
  instance: HouseholdInstance;
  onView: (id: number) => void;
  onSettings: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}
// #endregion

// #region 컴포넌트
export function InstanceActions({ 
  instance, 
  onView, 
  onSettings, 
  onEdit, 
  onDelete 
}: InstanceActionsProps) {
  return (
    <div className="flex gap-1 justify-center">
      <button
        onClick={() => onView(instance.id)}
        className="p-1 text-blue-600 rounded transition-colors hover:bg-blue-50"
        title="상세보기"
      >
        <Eye className="w-4 h-4" />
      </button>
      <button
        onClick={() => onSettings(instance.id)}
        className="p-1 text-purple-600 rounded transition-colors hover:bg-purple-50"
        title="설정"
      >
        <Settings className="w-4 h-4" />
      </button>
      <button
        onClick={() => onEdit(instance.id)}
        className="p-1 text-green-600 rounded transition-colors hover:bg-green-50"
        title="수정"
      >
        <Edit className="w-4 h-4" />
      </button>
      <button
        onClick={() => onDelete(instance.id)}
        className="p-1 text-red-600 rounded transition-colors hover:bg-red-50"
        title="삭제"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
// #endregion 