'use client'

import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { Edit3 } from 'lucide-react'
import type { Editor } from '@tiptap/react'

interface ImageContextMenuProps {
  editor: Editor
  position: { x: number; y: number }
  imageUrl: string
  onClose: () => void
  onEdit: (imageUrl: string) => void
}

/**
 * 이미지 우클릭 컨텍스트 메뉴 (Portal 버전)
 *
 * body에 직접 렌더링하여 CSS 영향을 완전히 회피
 */
const ImageContextMenuPortal: React.FC<ImageContextMenuProps> = ({
  editor,
  position,
  imageUrl,
  onClose,
  onEdit
}) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      // 클래스 이름 변경
      if (!target.closest('.image-context-menu-portal')) {
        onClose()
      }
    }

    // 약간의 딜레이로 이벤트 등록 (즉시 닫힘 방지)
    const timer = setTimeout(() => {
      document.addEventListener('click', handleClickOutside)
      document.addEventListener('contextmenu', handleClickOutside)
    }, 100)

    return () => {
      clearTimeout(timer)
      document.removeEventListener('click', handleClickOutside)
      document.removeEventListener('contextmenu', handleClickOutside)
    }
  }, [onClose])

  if (!mounted || !editor) return null

  const menuItems = [
    {
      icon: <Edit3 size={16} />,
      label: '이미지 편집',
      action: () => {
        onEdit(imageUrl)
        onClose()
      }
    }
  ]

  const menuContent = (
    <div
      className="image-context-menu-portal"
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 2147483647,
        backgroundColor: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
        padding: '4px 0',
        minWidth: '150px',
        pointerEvents: 'auto'
      }}
      onClick={(e) => e.stopPropagation()}
      onContextMenu={(e) => e.preventDefault()}
    >
      {menuItems.map((item, index) => (
        <button
          key={index}
          style={{
            width: '100%',
            padding: '8px 12px',
            textAlign: 'left',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 0.15s',
            color: '#1f2937'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f3f4f6'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
          }}
          onClick={item.action}
        >
          {item.icon}
          {item.label}
        </button>
      ))}
    </div>
  )

  // Portal로 body에 직접 렌더링
  return ReactDOM.createPortal(
    menuContent,
    document.body
  )
}

export default ImageContextMenuPortal