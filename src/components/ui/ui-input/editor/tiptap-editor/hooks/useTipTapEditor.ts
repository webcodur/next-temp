import { useCallback, useState, useEffect } from 'react'
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
import ResizableImage from 'tiptap-extension-resize-image'
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

  const [showViewModal, setShowViewModal] = useState(false)
  const [imageContextMenu, setImageContextMenu] = useState<{
    show: boolean
    position: { x: number; y: number }
    imageUrl: string
  }>({
    show: false,
    position: { x: 0, y: 0 },
    imageUrl: ''
  })
  const [imageEditModal, setImageEditModal] = useState<{
    show: boolean
    imageUrl: string
  }>({
    show: false,
    imageUrl: ''
  })
  // #endregion
  
  // #region 파일 핸들러
  const handleImageUpload = useCallback(
    async (file: File): Promise<string> => {
      if (onImageUpload) {
        return await onImageUpload(file)
      }

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
      ResizableImage.configure({
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
            if (!result?.url) return

            const nodes = ['resizableImage', 'imageResize', 'image']
            for (const nodeType of nodes) {
              if (editor.schema.nodes[nodeType]) {
                editor.chain().focus().insertContentAt(pos, {
                  type: nodeType,
                  attrs: { src: result.url }
                }).run()
                return
              }
            }

            editor.chain().focus().insertContentAt(pos, `<img src="${result.url}" />`).run()
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

    const target = event.target as HTMLElement

    // 이미지는 네이티브 이벤트에서 처리하므로 여기서는 무시
    if (target.tagName === 'IMG' || target.closest('img')) {
      return
    }

    // 테이블 내에서 우클릭했는지 확인
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

  // 네이티브 DOM 이벤트로 이미지 우클릭 처리 - 완전히 새로운 접근
  useEffect(() => {
    if (!editor) return

    const handleNativeContextMenu = (event: MouseEvent) => {
      const target = event.target as HTMLElement

      // TUI Image Editor 내부의 이벤트는 무시
      if (target.closest('.tui-image-editor-container')) return

      // 에디터 내부인지 확인
      if (!target.closest('.ProseMirror')) return

      // 이미지 찾기 (ResizableImage wrapper 고려)
      let img: HTMLImageElement | null = null

      if (target.tagName === 'IMG') {
        img = target as HTMLImageElement
      } else {
        // ResizableImage wrapper 내부의 이미지 찾기
        const wrapper = target.closest('.image-resizer') ||
                       target.closest('[data-drag-handle]') ||
                       target.closest('.ProseMirror-selectednode')
        if (wrapper) {
          img = wrapper.querySelector('img') as HTMLImageElement
        }

        // 그래도 못 찾으면 상위로 올라가며 찾기
        if (!img) {
          img = target.closest('img') as HTMLImageElement
        }
      }

      if (img && img.src) {
        event.preventDefault()
        event.stopPropagation()
        event.stopImmediatePropagation()

        // 마우스의 실제 위치 (뷰포트 기준)
        const x = event.clientX
        const y = event.clientY

        console.log('Context menu position:', { x, y }) // 디버깅용

        setImageContextMenu({
          show: true,
          position: { x, y },
          imageUrl: img.src
        })

        return false
      }
    }

    // 캡처 단계에서 처리
    document.addEventListener('contextmenu', handleNativeContextMenu, true)

    return () => {
      document.removeEventListener('contextmenu', handleNativeContextMenu, true)
    }
  }, [editor])

  const closeImageContextMenu = useCallback(() => {
    setImageContextMenu({
      show: false,
      position: { x: 0, y: 0 },
      imageUrl: ''
    })
  }, [])

  const handleImageEdit = useCallback((imageUrl: string) => {
    setImageEditModal({
      show: true,
      imageUrl
    })
  }, [])

  const closeImageEditModal = useCallback(() => {
    setImageEditModal({
      show: false,
      imageUrl: ''
    })
  }, [])

  const handleImageSave = useCallback((editedImageUrl: string) => {
    if (!editor || !editedImageUrl) {
      console.error('Editor or editedImageUrl is missing')
      return
    }

    if (!editedImageUrl.startsWith('data:image/')) {
      console.error('Invalid image data format - not a valid data URL')
      return
    }

    // 현재 편집 중인 이미지 URL로 해당 노드를 찾아서 교체
    const originalImageUrl = imageEditModal.imageUrl

    const { state } = editor
    const { doc } = state
    let imageNodeFound = false
    const foundNodes: Array<{ pos: number; node: unknown }> = []

    // 문서 전체에서 모든 이미지 노드 찾기
    doc.descendants((node, pos) => {
      if (node.type.name === 'imageResize' || node.type.name === 'resizableImage' || node.type.name === 'image') {
        foundNodes.push({ pos, node })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const nodeAny = node as any

        if (nodeAny.attrs.src === originalImageUrl) {
          imageNodeFound = true

          // 해당 위치의 노드를 새 이미지로 교체
          try {
            const transaction = state.tr.setNodeMarkup(pos, undefined, {
              ...nodeAny.attrs,
              src: editedImageUrl
            })

            editor.view.dispatch(transaction)
            // 업데이트를 강제로 트리거
            editor.view.updateState(editor.view.state)

            return false // 첫 번째 매칭되는 노드만 교체하고 중단
          } catch (error) {
            console.error('Error updating image:', error)
            return false
          }
        }
      }
      return true
    })

    if (!imageNodeFound) {
      // 대체 방법 1: 가장 최근에 선택된 이미지 교체
      if (foundNodes.length > 0) {
        const lastNode = foundNodes[foundNodes.length - 1]
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const lastNodeAny = lastNode.node as any
        try {
          const transaction = state.tr.setNodeMarkup(lastNode.pos, undefined, {
            ...lastNodeAny.attrs,
            src: editedImageUrl
          })
          editor.view.dispatch(transaction)
          // 강제 업데이트
          editor.view.updateState(editor.view.state)
          imageNodeFound = true
        } catch (error) {
          console.error('Error replacing last image node:', error)
        }
      }

      // 대체 방법 2: 새 이미지 삽입
      if (!imageNodeFound) {
        try {
          // 가능한 노드 타입들을 순서대로 시도
          const imageNodeTypes = ['imageResize', 'resizableImage', 'image']
          let insertSuccess = false

          for (const nodeType of imageNodeTypes) {
            if (editor.schema.nodes[nodeType]) {
              try {
                editor.chain()
                  .focus()
                  .insertContentAt(editor.state.selection.anchor, {
                    type: nodeType,
                    attrs: { src: editedImageUrl }
                  })
                  .run()
                insertSuccess = true
                break
              } catch {
                continue
              }
            }
          }

          // HTML 방식으로 대체 시도
          if (!insertSuccess) {
            try {
              editor.chain()
                .focus()
                .insertContent(`<img src="${editedImageUrl}" />`)
                .run()
            } catch (htmlError) {
              console.error('Failed to insert new image:', htmlError)
            }
          }
        } catch (error) {
          console.error('Error inserting new image:', error)
        }
      }
    }

    closeImageEditModal()
  }, [editor, closeImageEditModal, imageEditModal.imageUrl])


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
      onContextMenu: handleContextMenu
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
      imageContextMenu: {
        show: imageContextMenu.show,
        position: imageContextMenu.position,
        imageUrl: imageContextMenu.imageUrl,
        onClose: closeImageContextMenu,
        onEdit: handleImageEdit
      },
      imageEdit: {
        show: imageEditModal.show,
        imageUrl: imageEditModal.imageUrl,
        onClose: closeImageEditModal,
        onSave: handleImageSave
      }
    }
  }
}
