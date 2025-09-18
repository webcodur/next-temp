'use client'

import React, { useState, useEffect } from 'react'
import { Edit3 } from 'lucide-react'
import type { Editor } from '@tiptap/react'

interface ImageContextMenuProps {
  editor: Editor
  position: { x: number; y: number }
  imageUrl: string
  onClose: () => void
  onEdit: (imageUrl: string) => void
}

interface ContextMenuItem {
  icon: React.ReactNode
  label: string
  action: () => void
  disabled?: boolean
}

/**
 * 이미지 우클릭 컨텍스트 메뉴
 *
 * ResizableImage에서 우클릭 시 나타나는 컨텍스트 메뉴
 * 현재는 이미지 편집 기능만 제공
 */
const ImageContextMenu: React.FC<ImageContextMenuProps> = ({
  editor,
  position,
  imageUrl,
  onClose,
  onEdit
}) => {
  const [mounted, setMounted] = useState(false)
  const [adjustedPosition, setAdjustedPosition] = useState(position)

  useEffect(() => {
    setMounted(true)

    // 메뉴 위치 단순하게 설정 (clientX/Y는 이미 뷰포트 기준)
    const menuWidth = 150
    const menuHeight = 50
    const padding = 10

    let adjustedX = position.x
    let adjustedY = position.y

    // 오른쪽 경계 체크
    if (adjustedX + menuWidth > window.innerWidth - padding) {
      adjustedX = window.innerWidth - menuWidth - padding
    }

    // 왼쪽 경계 체크
    if (adjustedX < padding) {
      adjustedX = padding
    }

    // 아래쪽 경계 체크
    if (adjustedY + menuHeight > window.innerHeight - padding) {
      adjustedY = adjustedY - menuHeight - padding
    }

    // 위쪽 경계 체크
    if (adjustedY < padding) {
      adjustedY = padding
    }

    setAdjustedPosition({ x: adjustedX, y: adjustedY })

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('.image-context-menu')) {
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
  }, [onClose, position])

  if (!mounted || !editor) return null

  const menuItems: ContextMenuItem[] = [
    {
      icon: <Edit3 size={16} />,
      label: '이미지 편집',
      action: () => {
        onEdit(imageUrl)
        onClose()
      }
    }
  ]

  return (
    <div
      className="fixed bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[150px]"
      style={{
        left: `${adjustedPosition.x}px`,
        top: `${adjustedPosition.y}px`,
        zIndex: 2147483647,
        pointerEvents: 'auto'
      }}
      onClick={(e) => e.stopPropagation()}
      onContextMenu={(e) => e.preventDefault()}
    >
      {menuItems.map((item, index) => (
        <button
          key={index}
          className={`
            w-full px-3 py-2 text-left text-sm flex items-center gap-2
            hover:bg-gray-100 transition-colors
            ${item.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
          onClick={item.action}
          disabled={item.disabled}
        >
          {item.icon}
          {item.label}
        </button>
      ))}
    </div>
  )
}

export default ImageContextMenu