'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Upload, Image as ImageIcon, FileText, Film } from 'lucide-react'

import type { Editor } from '@tiptap/react'

interface MediaDropzoneProps {
  onFileUpload?: (file: File) => Promise<string>
  onImageUpload?: (file: File) => Promise<string>
  editor?: Editor | null
  className?: string
  children?: React.ReactNode
}

const MediaDropzone: React.FC<MediaDropzoneProps> = ({ 
  onFileUpload, 
  onImageUpload,
  editor,
  className = '', 
  children 
}) => {
  const [isDragging, setIsDragging] = useState(false)
  const [, setDragCounter] = useState(0)

  // 드래그 오버 핸들러
  const handleDragEnter = useCallback((e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    setDragCounter(prev => prev + 1)
    
    if (e.dataTransfer && e.dataTransfer.items) {
      const hasFiles = Array.from(e.dataTransfer.items).some(
        item => item.kind === 'file'
      )
      if (hasFiles) {
        setIsDragging(true)
      }
    }
  }, [])

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    setDragCounter(prev => {
      const newCount = prev - 1
      if (newCount === 0) {
        setIsDragging(false)
      }
      return newCount
    })
  }, [])

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = useCallback(async (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    setIsDragging(false)
    setDragCounter(0)
    
    if (!e.dataTransfer || !editor) return
    
    const files = Array.from(e.dataTransfer.files)
    
    for (const file of files) {
      try {
        let url: string
        
        if (file.type.startsWith('image/') && onImageUpload) {
          url = await onImageUpload(file)
          // 에디터에 이미지 삽입
          editor?.chain().focus().setImage({ src: url }).run()
        } else if (onFileUpload) {
          url = await onFileUpload(file)
          // 에디터에 파일 링크 삽입
          editor?.chain().focus().insertContent(`<a href="${url}" target="_blank">${file.name}</a>`).run()
        } else if (file.type.startsWith('image/')) {
          // 기본 base64 처리
          url = await new Promise((resolve) => {
            const reader = new FileReader()
            reader.onloadend = () => resolve(reader.result as string)
            reader.readAsDataURL(file)
          })
          editor?.chain().focus().setImage({ src: url }).run()
        }
      } catch (error) {
        console.error('파일 업로드 실패:', error)
      }
    }
  }, [onImageUpload, onFileUpload, editor])

  useEffect(() => {
    const element = document.body

    element.addEventListener('dragenter', handleDragEnter)
    element.addEventListener('dragleave', handleDragLeave)
    element.addEventListener('dragover', handleDragOver)
    element.addEventListener('drop', handleDrop)

    return () => {
      element.removeEventListener('dragenter', handleDragEnter)
      element.removeEventListener('dragleave', handleDragLeave)
      element.removeEventListener('dragover', handleDragOver)
      element.removeEventListener('drop', handleDrop)
    }
  }, [handleDragEnter, handleDragLeave, handleDragOver, handleDrop])

  // getFileIcon 함수는 사용되지 않으므로 제거

  if (!isDragging) {
    return <div className={className}>{children}</div>
  }

  return (
    <div className={`relative ${className}`}>
      {children}
      
      {/* 드래그 오버레이 */}
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center bg-blue-500 bg-opacity-20 backdrop-blur-sm"
        style={{ pointerEvents: 'none' }}
      >
        <div className="bg-white rounded-xl shadow-2xl p-8 border-2 border-dashed border-blue-400 max-w-md mx-4">
          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <Upload size={32} className="text-blue-600" />
              </div>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              파일을 여기에 드롭하세요
            </h3>
            
            <p className="text-sm text-gray-600 mb-4">
              이미지, 비디오 및 문서 파일을 지원합니다
            </p>
            
            <div className="flex justify-center space-x-4 text-gray-400">
              <ImageIcon size={20} />
              <Film size={20} />
              <FileText size={20} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MediaDropzone
