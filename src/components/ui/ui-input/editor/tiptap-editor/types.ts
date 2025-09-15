import { Editor } from '@tiptap/react'
import { JSONContent } from '@tiptap/core'

// #region Editor Content Type
export interface EditorContent {
  html: string
  json: JSONContent
  text: string
}
// #endregion

// #region TipTap Editor Props
export interface TipTapEditorProps {
  content?: string | JSONContent
  placeholder?: string
  onChange?: (content: EditorContent) => void
  editable?: boolean
  showMenuBar?: boolean
  height?: string
  className?: string
  mentionSuggestions?: string[]
  onImageUpload?: (file: File) => Promise<string>
  onFileUpload?: (file: File) => Promise<string>
}
// #endregion

// #region MenuBar Props
export interface MenuBarProps {
  editor: Editor
  onImageUpload?: (file: File) => Promise<string>
  onShowPreview?: () => void
}
// #endregion

// #region ReadOnly Viewer Props
export interface TipTapViewerProps {
  content: string | JSONContent
  className?: string
}
// #endregion