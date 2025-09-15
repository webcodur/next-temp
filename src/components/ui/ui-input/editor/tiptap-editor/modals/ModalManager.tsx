'use client'

import React from 'react'
import TableContextMenu from '../editor/contextMenu/TableContextMenu'
import EditorViewModal from '../EditorViewModal'
import ImageEditPopover from './imageEdit/ImageEditPopover'
import type { Editor } from '@tiptap/react'

interface ModalManagerProps {
  editor: Editor | null
  viewModal: {
    isOpen: boolean
    content: string
    onClose: () => void
  }
  contextMenu: {
    show: boolean
    position: { x: number; y: number }
    onClose: () => void
  }
  imageEdit: {
    show: boolean
    position: { x: number; y: number }
    imageNode: HTMLImageElement | null
    onClose: () => void
  }
}

/**
 * 모달 매니저
 * 
 * 에디터에서 사용하는 모든 모달, 팝오버, 컨텍스트 메뉴를 관리한다.
 * 각 모달의 상태와 위치를 중앙에서 제어한다.
 */
const ModalManager: React.FC<ModalManagerProps> = ({
  editor,
  viewModal,
  contextMenu,
  imageEdit
}) => {
  if (!editor) return null

  return (
    <>
      {/* 테이블 컨텍스트 메뉴 */}
      {contextMenu.show && (
        <TableContextMenu
          editor={editor}
          position={contextMenu.position}
          onClose={contextMenu.onClose}
        />
      )}

      {/* 에디터 뷰어 모달 */}
      <EditorViewModal
        isOpen={viewModal.isOpen}
        content={viewModal.content}
        onClose={viewModal.onClose}
        title="에디터 미리보기"
      />

      {/* 이미지 편집 팝오버 */}
      <ImageEditPopover
        isOpen={imageEdit.show}
        position={imageEdit.position}
        imageNode={imageEdit.imageNode || undefined}
        editor={editor}
        onClose={imageEdit.onClose}
      />
    </>
  )
}

export default ModalManager
