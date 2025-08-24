/*
  파일명: /components/ui/ui-input/crud-button/types.ts
  기능: CRUD 버튼 컴포넌트의 타입 정의
  책임: CRUD 액션별 아이콘, 텍스트, 스타일 매핑 타입 제공
*/

import { ButtonProps } from '../button/Button';

// #region 기본 타입
export type ENUM_CrudAction = 'create' | 'edit' | 'delete' | 'copy' | 'save';

export interface CrudButtonProps extends Omit<ButtonProps, 'variant' | 'icon'> {
  action: ENUM_CrudAction;
  iconOnly?: boolean;
}
// #endregion

// #region 액션 설정 타입
export interface ActionConfig {
  icon: React.ComponentType<{ className?: string }>;
  text: string;
  variant: ButtonProps['variant'];
}
// #endregion
