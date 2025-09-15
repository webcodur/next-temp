'use client'

import React, { useState, useEffect } from 'react'
import { 
  Plus, Minus, Trash2
} from 'lucide-react'
import type { Editor } from '@tiptap/react'

interface TableContextMenuProps {
  editor: Editor
  position: { x: number; y: number }
  onClose: () => void
}

interface ContextMenuItem {
  icon: React.ReactNode
  label: string
  action: () => void
  disabled?: boolean
}

const TableContextMenu: React.FC<TableContextMenuProps> = ({ editor, position, onClose }) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handleClickOutside = () => onClose()
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [onClose])

  if (!mounted || !editor) return null

  const menuItems: ContextMenuItem[] = [
    // 행/열 추가
    {
      icon: <Plus size={16} />,
      label: '위에 행 추가',
      action: () => {
        editor.chain().focus().addRowBefore().run()
        onClose()
      }
    },
    {
      icon: <Plus size={16} />,
      label: '아래에 행 추가',
      action: () => {
        editor.chain().focus().addRowAfter().run()
        onClose()
      }
    },
    {
      icon: <Plus size={16} />,
      label: '왼쪽에 열 추가',
      action: () => {
        editor.chain().focus().addColumnBefore().run()
        onClose()
      }
    },
    {
      icon: <Plus size={16} />,
      label: '오른쪽에 열 추가',
      action: () => {
        editor.chain().focus().addColumnAfter().run()
        onClose()
      }
    },
    // 구분선
    {
      icon: <Minus size={16} />,
      label: '구분선',
      action: () => onClose()
    },
    // 행/열 삭제
    {
      icon: <Minus size={16} />,
      label: '현재 행 삭제',
      action: () => {
        editor.chain().focus().deleteRow().run()
        onClose()
      }
    },
    {
      icon: <Minus size={16} />,
      label: '현재 열 삭제',
      action: () => {
        editor.chain().focus().deleteColumn().run()
        onClose()
      }
    },
    // 구분선
    {
      icon: <Trash2 size={16} />,
      label: '구분선',
      action: () => onClose()
    },
    // 표 삭제
    {
      icon: <Trash2 size={16} />,
      label: '표 삭제',
      action: () => {
        if (confirm('표를 삭제하시겠습니까?')) {
          editor.chain().focus().deleteTable().run()
        }
        onClose()
      }
    }
  ]

  return (
    <div
      className="fixed bg-white border border-gray-300 rounded-md shadow-lg py-1 z-50 min-w-[180px]"
      style={{ 
        left: position.x, 
        top: position.y,
        maxHeight: '300px',
        overflowY: 'auto'
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {menuItems.map((item, index) => {
        if (item.label === '구분선') {
          return (
            <div key={index} className="my-1 border-t border-gray-200" />
          )
        }

        return (
          <button
            key={index}
            onClick={item.action}
            disabled={item.disabled}
            className="flex gap-2 items-center px-3 py-2 w-full text-sm text-left hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {item.icon}
            {item.label}
          </button>
        )
      })}
    </div>
  )
}

export default TableContextMenu