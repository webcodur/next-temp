'use client'

import React from 'react'
import TableContextMenu from '../editor/contextMenu/TableContextMenu'
import ImageContextMenuPortal from '../editor/contextMenu/ImageContextMenuPortal'
import EditorViewModal from '../EditorViewModal'
import ImageEditorModal from '../../image-editor/ImageEditorModal'
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
  imageContextMenu: {
    show: boolean
    position: { x: number; y: number }
    imageUrl: string
    onClose: () => void
    onEdit: (imageUrl: string) => void
  }
  imageEdit: {
    show: boolean
    imageUrl: string
    onClose: () => void
    onSave: (editedImageUrl: string) => void
  }
}

/**
 * 모달 매니저
 *
 * 에디터에서 사용하는 모든 모달과 컨텍스트 메뉴를 관리한다.
 * ResizableImage 확장을 사용하여 인라인 이미지 리사이징을 처리한다.
 */
const ModalManager: React.FC<ModalManagerProps> = ({
  editor,
  viewModal,
  contextMenu,
  imageContextMenu,
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

      {/* 이미지 컨텍스트 메뉴 */}
      {imageContextMenu.show && (
        <ImageContextMenuPortal
          editor={editor}
          position={imageContextMenu.position}
          imageUrl={imageContextMenu.imageUrl}
          onClose={imageContextMenu.onClose}
          onEdit={imageContextMenu.onEdit}
        />
      )}

      {/* 이미지 편집 모달 */}
      {imageEdit.imageUrl && (
        <ImageEditorModal
          isOpen={imageEdit.show}
          imageUrl={imageEdit.imageUrl}
          onClose={imageEdit.onClose}
          onSave={imageEdit.onSave}
          title="이미지 편집"
        />
      )}
    </>
  )
}

export default ModalManager