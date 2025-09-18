'use client'

import React from 'react'
import './tiptap-styles.css'
import { useTipTapEditor } from './hooks/useTipTapEditor'
import ToolbarContainer from './toolbar/ToolbarContainer'
import EditorContainer from './editor/EditorContainer'
import ModalManager from './modals/ModalManager'
import type { TipTapEditorProps } from './types'

/**
 * TipTap 에디터 메인 컴포넌트
 *
 * 수직적 구조로 재설계된 조율 전용 컴포넌트
 * 모든 비즈니스 로직은 useTipTapEditor 훅으로 위임
 * 각 영역별 컨테이너들을 조합하여 최종 UI 구성
 */
const TipTapEditor: React.FC<TipTapEditorProps> = ({
  content = '',
  placeholder = '내용을 입력하세요...',
  onChange,
  editable = true,
  showMenuBar = true,
  height = '400px',
  className = '',
  mentionSuggestions = [],
  onImageUpload,
  onFileUpload
}) => {
  // 모든 비즈니스 로직을 훅으로 위임
  const editorState = useTipTapEditor({
    content,
    placeholder,
    onChange,
    editable,
    mentionSuggestions,
    onImageUpload,
    onFileUpload
  })

  if (!editorState.editor) {
    return null
  }

  return (
    <div className={`overflow-hidden rounded-lg tiptap-editor-container neu-flat ${className}`}>
      {/* 상단 툴바 영역 */}
      <ToolbarContainer
        editor={editorState.editor}
        onImageUpload={editorState.toolbar.onImageUpload}
        onShowPreview={editorState.toolbar.onShowPreview}
        show={showMenuBar}
      />

      {/* 메인 콘텐츠 영역 */}
      <div className="flex" style={{ height }}>
        <EditorContainer
          editor={editorState.editor}
          onContextMenu={editorState.editorContent.onContextMenu}
        />
      </div>

      {/* 모달 매니저 */}
      <ModalManager
        editor={editorState.editor}
        viewModal={editorState.modals.viewModal}
        contextMenu={editorState.modals.contextMenu}
        imageContextMenu={editorState.modals.imageContextMenu}
        imageEdit={editorState.modals.imageEdit}
      />
    </div>
  )
}

export default TipTapEditor
