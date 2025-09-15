'use client'

import React from 'react'
import './tiptap-styles.css'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Underline } from '@tiptap/extension-underline'
import { TextAlign } from '@tiptap/extension-text-align'
import { Highlight } from '@tiptap/extension-highlight'
import { TaskList } from '@tiptap/extension-task-list'
import { TaskItem } from '@tiptap/extension-task-item'
import { Typography } from '@tiptap/extension-typography'
import { Link } from '@tiptap/extension-link'
import { Image } from '@tiptap/extension-image'
import { Youtube } from '@tiptap/extension-youtube'
import { Color } from '@tiptap/extension-color'
import { TextStyle } from '@tiptap/extension-text-style'
import { FontFamily } from '@tiptap/extension-font-family'
import { Subscript } from '@tiptap/extension-subscript'
import { Superscript } from '@tiptap/extension-superscript'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { common, createLowlight } from 'lowlight'
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableCell } from '@tiptap/extension-table-cell'
import { TableHeader } from '@tiptap/extension-table-header'
import { Mention } from '@tiptap/extension-mention'
import type { TipTapViewerProps } from './types'

const lowlight = createLowlight(common)

// #region TipTap Viewer Component (읽기 전용)
const TipTapViewer: React.FC<TipTapViewerProps> = ({
  content,
  className = ''
}) => {
  const editor = useEditor({
    immediatelyRender: false, // SSR 하이드레이션 문제 해결
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Highlight.configure({ multicolor: true }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Typography,
      Link.configure({
        openOnClick: true,
        autolink: true
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
      Subscript,
      Superscript,
      CodeBlockLowlight.configure({ lowlight }),
      Table.configure({ resizable: false }),
      TableRow,
      TableCell,
      TableHeader,
      Mention.configure({
        HTMLAttributes: { class: 'mention' }
      })
    ],
    content,
    editable: false
  })

  if (!editor) {
    return null
  }

  return (
    <div className={`tiptap-viewer ${className}`}>
      <EditorContent 
        editor={editor} 
        className="prose prose-sm max-w-none"
      />
    </div>
  )
}
// #endregion

export default TipTapViewer