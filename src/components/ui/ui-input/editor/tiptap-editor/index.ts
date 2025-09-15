/**
 * TipTap Editor 컴포넌트 모듈
 * 
 * 수직적 구조로 재설계된 리치텍스트 편집기
 * 모든 컴포넌트가 기능별로 분리되어 유지보수가 용이하다.
 */

// 메인 컴포넌트
export { default as TipTapEditor } from './TipTapEditor'
export { default as TipTapViewer } from './TipTapViewer'

// 비즈니스 로직 훅
export { useTipTapEditor } from './hooks/useTipTapEditor'

// 확장 모듈
export * from './extensions'

// 수평적 컨테이너들 (새로운 구조)
export { default as ToolbarContainer } from './toolbar/ToolbarContainer'
export { default as EditorContainer } from './editor/EditorContainer'
export { default as ModalManager } from './modals/ModalManager'

// 필수 외부 사용 컴포넌트만 유지
export { default as MediaDropzone } from './editor/interaction/MediaDropzone'

// 내부 컴포넌트들 (컨테이너로 캡슐화됨)
// MenuBar, TableContextMenu, EditorViewModal, 
// ImageEditPopover는 더 이상 직접 export하지 않음

// 타입 정의 (외부 사용 타입만)
export type {
  TipTapEditorProps,
  TipTapViewerProps,
  EditorContent
} from './types'

// 내부 전용 타입들: MenuBarProps

// 설정 파일들 (내부 사용만)
// menuBarConfig는 MenuBar에서만 사용되므로 export하지 않음
