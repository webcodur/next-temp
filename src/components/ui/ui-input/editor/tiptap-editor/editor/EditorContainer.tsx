'use client'

import React, { useRef } from 'react'
import { EditorContent } from '@tiptap/react'
import type { Editor } from '@tiptap/react'

interface EditorContainerProps {
  editor: Editor | null
  onContextMenu: (event: React.MouseEvent) => void
  onClick: (event: React.MouseEvent) => void
  className?: string
}

/**
 * 에디터 컨테이너
 * 
 * 메인 편집 영역을 담당한다.
 * EditorContent와 관련 인터랙션을 관리한다.
 */
const EditorContainer: React.FC<EditorContainerProps> = ({
  editor,
  onContextMenu,
  onClick,
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  
  if (!editor) return null

  // 컨테이너 클릭 이벤트 처리
  const handleContainerClick = (event: React.MouseEvent<HTMLDivElement>) => {
    // EditorContent 영역 외부를 클릭했는지 확인
    const target = event.target as HTMLElement
    const editorContent = containerRef.current?.querySelector('.ProseMirror')
    
    if (!editorContent) return
    
    // ProseMirror 에디터 영역이 아닌 경우 (빈 공간 클릭)
    if (!target.closest('.ProseMirror')) {
      // 에디터의 마지막으로 포커스 이동
      editor.commands.focus('end')
      
      // 에디터 끝으로 스크롤
      const scrollContainer = containerRef.current?.querySelector('.overflow-y-auto')
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }

  return (
    <div 
      ref={containerRef}
      className={`relative flex-1 ${className}`}
      onClick={handleContainerClick}
    >
      <EditorContent 
        editor={editor} 
        className="overflow-y-auto max-w-none h-full prose prose-sm focus:outline-none"
        onContextMenu={onContextMenu}
        onClick={onClick}
      />
    </div>
  )
}

export default EditorContainer
