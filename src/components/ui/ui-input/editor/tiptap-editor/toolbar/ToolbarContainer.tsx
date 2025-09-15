'use client'

import React from 'react'
import MenuBar from './MenuBar'
import type { Editor } from '@tiptap/react'

interface ToolbarContainerProps {
  editor: Editor | null
  onImageUpload: (file: File) => Promise<string>
  onShowPreview: () => void
  show?: boolean
}

/**
 * 툴바 컨테이너
 * 
 * 에디터 상단의 모든 도구 모음을 관리한다.
 * 현재는 MenuBar만 포함하지만, 향후 추가 툴바 확장 가능
 */
const ToolbarContainer: React.FC<ToolbarContainerProps> = ({
  editor,
  onImageUpload,
  onShowPreview,
  show = true
}) => {
  if (!show || !editor) return null

  return (
    <div className="toolbar-container border-b border-gray-200">
      <MenuBar 
        editor={editor} 
        onImageUpload={onImageUpload}
        onShowPreview={onShowPreview}
      />
    </div>
  )
}

export default ToolbarContainer
