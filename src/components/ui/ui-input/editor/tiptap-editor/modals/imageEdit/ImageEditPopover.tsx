'use client'

import React, { useState, useEffect } from 'react'
import { X, RotateCcw, RotateCw, Settings, Trash2 } from 'lucide-react'
import type { Editor } from '@tiptap/react'

interface ImageEditPopoverProps {
  isOpen: boolean
  position: { x: number; y: number }
  imageNode?: HTMLImageElement
  editor: Editor
  onClose: () => void
}

const ImageEditPopover: React.FC<ImageEditPopoverProps> = ({
  isOpen,
  position,
  imageNode,
  editor,
  onClose
}) => {
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 })
  const [originalSize, setOriginalSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    if (imageNode) {
      const width = imageNode.naturalWidth || imageNode.width || 0
      const height = imageNode.naturalHeight || imageNode.height || 0
      
      setOriginalSize({ width, height })
      setImageSize({ 
        width: imageNode.width || width,
        height: imageNode.height || height
      })
    }
  }, [imageNode])

  if (!isOpen || !imageNode) return null

  const handleSizeChange = (newWidth: number, newHeight?: number) => {
    if (!editor || !imageNode) return

    const aspectRatio = originalSize.width / originalSize.height
    const calculatedHeight = newHeight || Math.round(newWidth / aspectRatio)
    
    // 이미지 속성 업데이트
    // src 변수는 사용되지 않으므로 제거
    editor.chain()
      .focus()
      .updateAttributes('image', {
        width: newWidth,
        height: calculatedHeight
      })
      .run()

    setImageSize({ width: newWidth, height: calculatedHeight })
  }

  const handlePresetSize = (percent: number) => {
    const newWidth = Math.round(originalSize.width * (percent / 100))
    handleSizeChange(newWidth)
  }

  const handleDelete = () => {
    if (confirm('이미지를 삭제하시겠습니까?')) {
      editor.chain().focus().deleteSelection().run()
      onClose()
    }
  }

  const handleRotate = (degrees: number) => {
    // CSS transform을 사용한 회전 (간단한 구현)
    const currentTransform = imageNode.style.transform || ''
    const rotateMatch = currentTransform.match(/rotate\((-?\d+)deg\)/)
    const currentRotation = rotateMatch ? parseInt(rotateMatch[1]) : 0
    const newRotation = currentRotation + degrees
    
    editor.chain()
      .focus()
      .updateAttributes('image', {
        style: `transform: rotate(${newRotation}deg);`
      })
      .run()
  }

  return (
    <>
      {/* 오버레이 */}
      <div 
        className="fixed inset-0 z-40"
        onClick={onClose}
      />
      
      {/* 팝오버 */}
      <div
        className="fixed bg-white border border-gray-300 rounded-lg shadow-lg py-3 px-4 z-50 min-w-[280px]"
        style={{
          left: Math.min(position.x, window.innerWidth - 300),
          top: Math.min(position.y, window.innerHeight - 400)
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-900">이미지 편집</h3>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-gray-100"
            title="닫기"
          >
            <X size={16} />
          </button>
        </div>

        {/* 크기 조정 */}
        <div className="mb-4">
          <div className="text-xs text-gray-600 mb-2">크기 조정</div>
          
          {/* 프리셋 크기 버튼들 */}
          <div className="flex flex-wrap gap-1 mb-3">
            {[25, 50, 75, 100, 125, 150].map(percent => (
              <button
                key={percent}
                onClick={() => handlePresetSize(percent)}
                className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded border"
              >
                {percent}%
              </button>
            ))}
          </div>

          {/* 커스텀 크기 입력 */}
          <div className="flex gap-2 text-xs">
            <div className="flex-1">
              <label className="block text-gray-600 mb-1">너비</label>
              <input
                type="number"
                value={imageSize.width}
                onChange={(e) => {
                  const newWidth = parseInt(e.target.value) || 0
                  handleSizeChange(newWidth)
                }}
                className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                min="50"
                max={originalSize.width * 2}
              />
            </div>
            <div className="flex-1">
              <label className="block text-gray-600 mb-1">높이</label>
              <input
                type="number"
                value={imageSize.height}
                onChange={(e) => {
                  const newHeight = parseInt(e.target.value) || 0
                  const aspectRatio = originalSize.width / originalSize.height
                  const newWidth = Math.round(newHeight * aspectRatio)
                  handleSizeChange(newWidth, newHeight)
                }}
                className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                min="50"
                max={originalSize.height * 2}
              />
            </div>
          </div>
        </div>

        {/* 회전 */}
        <div className="mb-4">
          <div className="text-xs text-gray-600 mb-2">회전</div>
          <div className="flex gap-2">
            <button
              onClick={() => handleRotate(-90)}
              className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded border"
              title="왼쪽으로 90도 회전"
            >
              <RotateCcw size={14} />
              -90°
            </button>
            <button
              onClick={() => handleRotate(90)}
              className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded border"
              title="오른쪽으로 90도 회전"
            >
              <RotateCw size={14} />
              +90°
            </button>
          </div>
        </div>

        {/* 이미지 정보 */}
        <div className="mb-4 pb-3 border-b border-gray-200">
          <div className="text-xs text-gray-600 mb-1">원본 크기</div>
          <div className="text-xs text-gray-800">
            {originalSize.width} × {originalSize.height}px
          </div>
        </div>

        {/* 액션 버튼들 */}
        <div className="flex gap-2">
          <button
            onClick={() => handlePresetSize(100)}
            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            <Settings size={14} />
            원본 크기
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center justify-center gap-1 px-3 py-2 text-xs bg-red-500 text-white rounded hover:bg-red-600"
            title="이미지 삭제"
          >
            <Trash2 size={14} />
            삭제
          </button>
        </div>
      </div>
    </>
  )
}

export default ImageEditPopover
