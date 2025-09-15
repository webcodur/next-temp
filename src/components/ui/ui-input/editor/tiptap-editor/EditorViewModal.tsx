'use client'

import React from 'react'
import { X } from 'lucide-react'
import TipTapViewer from './TipTapViewer'

interface EditorViewModalProps {
  isOpen: boolean
  content: string
  onClose: () => void
  title?: string
}

const EditorViewModal: React.FC<EditorViewModalProps> = ({ 
  isOpen, 
  content, 
  onClose, 
  title = '미리보기' 
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 오버레이 */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-none"
        onClick={onClose}
      />
      
      {/* 모달 콘텐츠 */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-[98vw] max-h-[98vh] mx-2 flex flex-col">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-none"
            title="닫기"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* 콘텐츠 */}
        <div className="flex-1 overflow-y-auto p-6">
          {content ? (
            <TipTapViewer 
              content={content}
              className="max-w-none"
            />
          ) : (
            <div className="text-center text-gray-500 py-8">
              표시할 내용이 없습니다.
            </div>
          )}
        </div>
        
        {/* 푸터 */}
        <div className="flex justify-end p-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-none"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditorViewModal