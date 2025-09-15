/*
  파일명: /components/ui/ui-input/crud-button/CrudButton.tsx
  기능: 폼 및 테이블에서 사용하는 CRUD 전용 버튼 컴포넌트
  책임: 일관된 CRUD 버튼 UI 및 인터랙션 제공
  
  🎯 사용법:
  - <CrudButton action="create" />                    // 플러스 아이콘 + "추가" (xl 이상), 아이콘만 (xl 미만)
  - <CrudButton action="delete" iconOnly />           // 휴지통 아이콘만 (모든 화면 크기)
  - <CrudButton action="save">저장하기</CrudButton>   // 저장 아이콘 + "저장하기" (children 우선)
  
  📱 반응형:
  - xl 이상: 아이콘 + 텍스트, 적절한 너비
  - xl 미만: 아이콘만, 40px × 40px 정사각형
  
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
import { CrudButtonProps, ActionConfig, ENUM_CrudAction } from './types';

// #region 액션 설정 매핑
const ACTION_CONFIG: Record<ENUM_CrudAction, ActionConfig> = {
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
  ({ action, iconOnly = false, size = 'default', children, ...props }, ref) => {
    const config = ACTION_CONFIG[action];
    const IconComponent = config.icon;

    return (
      <Button
        ref={ref}
        variant={config.variant}
        size={iconOnly ? 'icon' : size}
        icon={IconComponent}
        className={`xl:px-4 xl:w-auto xl:min-w-20 w-10 h-10 min-w-0 ${props.className || ''}`}
        {...props}
      >
        {!iconOnly && (
          <span className="hidden xl:inline">
            {children || config.text}
          </span>
        )}
      </Button>
    );
  }
);

CrudButton.displayName = 'CrudButton';
// #endregion

export { CrudButton, ACTION_CONFIG };
export type { CrudButtonProps, ENUM_CrudAction };
