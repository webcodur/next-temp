/**
 * 선택 다이얼로그 공통 모듈 Export
 */

// 메인 컴포넌트
export { SelectionDialog } from './SelectionDialog';

// 하위 컴포넌트들
export { SelectionTable } from './SelectionTable';
export { SelectionActionButtons } from './SelectionActionButtons';
export { SelectedItemCard } from './SelectedItemCard';

// 타입들
export type {
  SelectableItem,
  SelectionState,
  ActionButtonConfig,
  HeaderConfig,
  EmptyStateConfig,
  LoadingConfig,
  SelectionDialogProps,
  SelectionTableProps,
  SelectionActionButtonsProps,
  SelectedItemCardProps,
} from './selection-dialog.types';
