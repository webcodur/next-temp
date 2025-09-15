import { useCallback, useState } from 'react'
import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Underline } from '@tiptap/extension-underline'
import { TextAlign } from '@tiptap/extension-text-align'
import { Highlight } from '@tiptap/extension-highlight'
import { TaskList } from '@tiptap/extension-task-list'
import { TaskItem } from '@tiptap/extension-task-item'
import { Typography } from '@tiptap/extension-typography'
import { Placeholder } from '@tiptap/extension-placeholder'
import { Link } from '@tiptap/extension-link'
import { Image } from '@tiptap/extension-image'
import { Youtube } from '@tiptap/extension-youtube'
import { Color } from '@tiptap/extension-color'
import { TextStyle } from '@tiptap/extension-text-style'
import { FontFamily } from '@tiptap/extension-font-family'
import { FontSize } from '@tiptap/extension-font-size'
import { Subscript } from '@tiptap/extension-subscript'
import { Superscript } from '@tiptap/extension-superscript'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { common, createLowlight } from 'lowlight'
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableCell } from '@tiptap/extension-table-cell'
import { TableHeader } from '@tiptap/extension-table-header'
import { Dropcursor } from '@tiptap/extension-dropcursor'
import { Gapcursor } from '@tiptap/extension-gapcursor'
import { FileHandler } from '@tiptap/extension-file-handler'
import Mention from '@tiptap/extension-mention'
import { LineHeight, BackgroundColor } from '../extensions'
import type { TipTapEditorProps } from '../types'

const lowlight = createLowlight(common)

/**
 * TipTap 에디터의 모든 비즈니스 로직을 관리하는 훅
 * 상태 관리, 이벤트 핸들러, 에디터 초기화를 담당
 */
export const useTipTapEditor = ({
  content = '',
  placeholder = '내용을 입력하세요...',
  onChange,
  editable = true,
  mentionSuggestions = [],
  onImageUpload,
  onFileUpload
}: TipTapEditorProps) => {
  
  // #region 상태 정의
  const [contextMenu, setContextMenu] = useState<{
    show: boolean
    position: { x: number; y: number }
  }>({
    show: false,
    position: { x: 0, y: 0 }
  })
  
  const [imageEditPopover, setImageEditPopover] = useState<{
    show: boolean
    position: { x: number; y: number }
    imageNode: HTMLImageElement | null
  }>({
    show: false,
    position: { x: 0, y: 0 },
    imageNode: null
  })
  
  const [showViewModal, setShowViewModal] = useState(false)
  // #endregion
  
  // #region 파일 핸들러
  const handleImageUpload = useCallback(
    async (file: File): Promise<string> => {
      if (onImageUpload) {
        return await onImageUpload(file)
      }
      // 기본 동작: base64 변환
      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result as string)
        reader.readAsDataURL(file)
      })
    },
    [onImageUpload]
  )

  const handleFileDrop = useCallback(
    async (file: File, pos: number) => {
      if (file.type.startsWith('image/')) {
        const url = await handleImageUpload(file)
        return { url, pos }
      }
      if (onFileUpload) {
        const url = await onFileUpload(file)
        return { url, pos, fileName: file.name }
      }
      return null
    },
    [handleImageUpload, onFileUpload]
  )
  // #endregion

  // #region Editor 초기화
  const editor = useEditor({
    immediatelyRender: false, // SSR 하이드레이션 문제 해결
    extensions: [
      StarterKit.configure({
        bulletList: { keepMarks: true, keepAttributes: false },
        orderedList: { keepMarks: true, keepAttributes: false },
        heading: { 
          levels: [1, 2, 3, 4, 5, 6]
        }
      }),
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Highlight.configure({ multicolor: true }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Typography,
      Placeholder.configure({ placeholder }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true
      }),
      Image.configure({
        inline: true,
        allowBase64: true
      }),
      Youtube.configure({
        controls: true,
        nocookie: true
      }),
      Color,
      TextStyle,
      FontFamily,
      FontSize.configure({
        types: ['textStyle'],
      }),
      Subscript,
      Superscript,
      CodeBlockLowlight.configure({ lowlight }),
      Table.configure({ 
        resizable: true,
        handleWidth: 5,
        cellMinWidth: 50,
        allowTableNodeSelection: true
      }),
      TableRow,
      TableCell.configure({
        HTMLAttributes: {
          class: 'border border-gray-400'
        }
      }),
      TableHeader.configure({
        HTMLAttributes: {
          class: 'border border-gray-500 bg-gray-100'
        }
      }),
      Dropcursor.configure({ color: '#4F46E5', width: 2 }),
      Gapcursor,
      FileHandler.configure({
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp'],
        onDrop: (editor, files, pos) => {
          files.forEach(async (file) => {
            const result = await handleFileDrop(file, pos)
            if (result && result.url) {
              editor.chain().focus().insertContentAt(pos, {
                type: 'image',
                attrs: { src: result.url }
              }).run()
            }
          })
          return true
        }
      }),
      Mention.configure({
        HTMLAttributes: { class: 'mention' },
        suggestion: {
          items: ({ query }) => {
            return mentionSuggestions
              .filter(item => item.toLowerCase().startsWith(query.toLowerCase()))
              .slice(0, 5)
          },
          render: () => {
            let component: unknown
            let popup: unknown

            return {
              onStart: () => {
                // 멘션 팝업 렌더링 로직
              },
              onUpdate() {
                // 멘션 업데이트 로직
              },
              onKeyDown(props: { event: KeyboardEvent }) {
                if (props.event.key === 'Escape') {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  (popup as any)?.hide?.()
                  return true
                }
                return false
              },
              onExit() {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (popup as any)?.destroy?.()
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (component as any)?.destroy?.()
              }
            }
          }
        }
      }),
      // 커스텀 확장들 (LineHeight, BackgroundColor만 사용)
      LineHeight,
      BackgroundColor
    ],
    content,
    editable,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      const json = editor.getJSON()
      const text = editor.getText()
      onChange?.({ html, json, text })
    }
  })
  // #endregion

  // #region 이벤트 핸들러
  const handleContextMenu = useCallback((event: React.MouseEvent) => {
    if (!editor) return
    
    // 테이블 내에서 우클릭했는지 확인
    const target = event.target as HTMLElement
    const tableCell = target.closest('td, th')
    
    if (tableCell) {
      event.preventDefault()
      setContextMenu({
        show: true,
        position: { x: event.clientX, y: event.clientY }
      })
    }
  }, [editor])

  const closeContextMenu = useCallback(() => {
    setContextMenu({ show: false, position: { x: 0, y: 0 } })
  }, [])

  const handleShowPreview = useCallback(() => {
    setShowViewModal(true)
  }, [])

  const closeViewModal = useCallback(() => {
    setShowViewModal(false)
  }, [])

  const handleImageClick = useCallback((event: React.MouseEvent) => {
    const target = event.target as HTMLElement
    
    // 이미지 클릭 처리
    const imageElement = target.closest('img') as HTMLImageElement
    if (imageElement) {
      event.preventDefault()
      setImageEditPopover({
        show: true,
        position: { x: event.clientX, y: event.clientY },
        imageNode: imageElement
      })
    }
  }, [])

  const closeImageEditPopover = useCallback(() => {
    setImageEditPopover({ show: false, position: { x: 0, y: 0 }, imageNode: null })
  }, [])

  // #endregion

  return {
    // 에디터 인스턴스
    editor,
    
    // 툴바 관련
    toolbar: {
      editor,
      onImageUpload: handleImageUpload,
      onShowPreview: handleShowPreview
    },
    
    // 메인 에디터 관련
    editorContent: {
      editor,
      contextMenu,
      onContextMenu: handleContextMenu,
      onClick: handleImageClick
    },
    
    // 모달 관련
    modals: {
      viewModal: {
        isOpen: showViewModal,
        content: editor?.getHTML() || '',
        onClose: closeViewModal
      },
      contextMenu: {
        show: contextMenu.show,
        position: contextMenu.position,
        onClose: closeContextMenu
      },
      imageEdit: {
        show: imageEditPopover.show,
        position: imageEditPopover.position,
        imageNode: imageEditPopover.imageNode,
        onClose: closeImageEditPopover
      }
    },
    
    // 드롭존 관련
    dropzone: {
      onImageUpload: handleImageUpload,
      onFileUpload
    }
  }
}
