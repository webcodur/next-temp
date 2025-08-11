/*
  파일명: /components/ui/ui-input/crud-button/CrudButton.tsx
  기능: 폼 및 테이블에서 사용하는 CRUD 전용 버튼 컴포넌트
  책임: 일관된 CRUD 버튼 UI 및 인터랙션 제공
  
  🎯 사용법:
  - <CrudButton action="create" />           // 플러스 아이콘 + "추가"
  - <CrudButton action="delete" iconOnly />  // 휴지통 아이콘만
  - <CrudButton action="save" />             // 저장 아이콘 + "저장"
  
  📌 액션별 매핑:
  - create: 플러스 아이콘 + "추가" (primary)
  - edit: 편집 아이콘 + "편집" (secondary)  
  - delete: 휴지통 아이콘 + "삭제" (destructive)
  - copy: 복사 아이콘 + "복사" (outline)
  - save: 저장 아이콘 + "저장" (primary)
*/

import * as React from 'react';
import { Plus, SquarePen, Trash2, Copy, Save } from 'lucide-react';

import { Button } from '../button/Button';
import { CrudButtonProps, ActionConfig, CrudAction } from './types';

// #region 액션 설정 매핑
const ACTION_CONFIG: Record<CrudAction, ActionConfig> = {
  create: {
    icon: Plus,
    text: '추가',
    variant: 'primary',
  },
  edit: {
    icon: SquarePen,
    text: '편집',
    variant: 'secondary',
  },
  delete: {
    icon: Trash2,
    text: '삭제',
    variant: 'destructive',
  },
  copy: {
    icon: Copy,
    text: '복사',
    variant: 'outline',
  },
  save: {
    icon: Save,
    text: '저장',
    variant: 'primary',
  },
};
// #endregion

// #region 컴포넌트
const CrudButton = React.forwardRef<HTMLButtonElement, CrudButtonProps>(
  ({ action, iconOnly = false, size = 'default', ...props }, ref) => {
    const config = ACTION_CONFIG[action];
    const IconComponent = config.icon;

    return (
      <Button
        ref={ref}
        variant={config.variant}
        size={iconOnly ? 'icon' : size}
        icon={IconComponent}
        {...props}
      >
        {!iconOnly && config.text}
      </Button>
    );
  }
);

CrudButton.displayName = 'CrudButton';
// #endregion

export { CrudButton, ACTION_CONFIG };
export type { CrudButtonProps, CrudAction };
