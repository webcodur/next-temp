'use client'

import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import { X } from 'lucide-react'
import ImageEditor from './ImageEditor'

export interface ImageEditorModalProps {
  isOpen: boolean
  imageUrl: string
  onClose: () => void
  onSave: (editedImageUrl: string) => void
  title?: string
}

/**
 * 이미지 편집기 모달 Portal 컴포넌트
 * 별도의 컴포넌트로 분리하여 Portal 렌더링 처리
 */
const ImageEditorModalPortal: React.FC<ImageEditorModalProps> = ({
  isOpen,
  imageUrl,
  onClose,
  onSave,
  title = '이미지 편집'
}) => {
  const [isLoading, setIsLoading] = useState(true)
  const [fileName, setFileName] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  useEffect(() => {
    if (isOpen && imageUrl) {
      setIsLoading(true)

      // 파일명 추출
      const urlParts = imageUrl.split('/')
      const fileNameWithQuery = urlParts[urlParts.length - 1]
      const cleanFileName = fileNameWithQuery.split('?')[0]
      setFileName(decodeURIComponent(cleanFileName))

      // body 스크롤 방지
      const originalOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'

      // 로딩 완료 처리
      const timer = setTimeout(() => {
        setIsLoading(false)
      }, 500)

      return () => {
        clearTimeout(timer)
        document.body.style.overflow = originalOverflow
      }
    }
  }, [isOpen, imageUrl])

  // SSR 방지
  if (!mounted) return null
  if (!isOpen || !imageUrl) return null

  const handleSave = (editedImageUrl: string) => {
    onSave(editedImageUrl)
    onClose()
  }

  const modalContent = (
    <>
      {/* 오버레이 */}
      <div
        className="fixed inset-0 bg-black/90 z-[999998]"
        onClick={onClose}
      />

      {/* 모달 컨테이너 */}
      <div className="fixed inset-0 z-[999999] pointer-events-none">
        <div className="w-full h-full pointer-events-auto bg-white">
          {/* 헤더 */}
          <div className="absolute top-0 left-0 right-0 z-[1000000] flex justify-between items-center px-4 py-2 bg-white border-b">
            <div className="flex-1 min-w-0">
              <h2 className="text-base font-semibold text-gray-900 truncate">
                {title}
                {fileName && (
                  <span className="ml-3 text-sm font-normal text-gray-600">
                    {fileName}
                  </span>
                )}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-gray-100"
              title="닫기"
            >
              <X size={20} />
            </button>
          </div>

          {/* 에디터 영역 */}
          <div className="pt-12 w-full h-full">
            {isLoading && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-white">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                  <p className="mt-4 text-gray-600">이미지 에디터 로딩 중...</p>
                </div>
              </div>
            )}
            <ImageEditor
              imageUrl={imageUrl}
              onSave={handleSave}
              onClose={onClose}
              width="100vw"
              height="calc(100vh - 48px)"
            />
          </div>
        </div>
      </div>
    </>
  )

  // Portal로 body에 직접 렌더링
  return ReactDOM.createPortal(
    modalContent,
    document.body
  )
}

export default ImageEditorModalPortal