'use client'

import React, { useEffect, useState, useRef } from 'react'
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
 * 이미지 편집기 모달 컴포넌트
 *
 * ImageEditor를 모달 형태로 감싸는 래퍼 컴포넌트
 * DOM 직접 조작으로 전체 화면 보장
 */
const ImageEditorModal: React.FC<ImageEditorModalProps> = ({
  isOpen,
  imageUrl,
  onClose,
  onSave,
  title = '이미지 편집'
}) => {
  const [isLoading, setIsLoading] = useState(true)
  const [fileName, setFileName] = useState('')
  const modalContainerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (isOpen && imageUrl) {
      setIsLoading(true)

      // 파일명 추출
      const urlParts = imageUrl.split('/')
      const fileNameWithQuery = urlParts[urlParts.length - 1]
      const cleanFileName = fileNameWithQuery.split('?')[0]
      setFileName(decodeURIComponent(cleanFileName))

      // 모달 컨테이너 생성 및 body에 직접 추가
      const modalDiv = document.createElement('div')
      modalDiv.id = 'image-editor-modal-root'
      modalDiv.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100vw;
        height: 100vh;
        z-index: 2147483647;
        pointer-events: auto;
      `
      document.body.appendChild(modalDiv)
      modalContainerRef.current = modalDiv

      // 원본 body overflow 저장 및 숨김
      const originalOverflow = document.body.style.overflow
      const originalPosition = document.body.style.position
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'relative'

      // 에디터 로딩
      const timer = setTimeout(() => {
        setIsLoading(false)
      }, 500)

      return () => {
        clearTimeout(timer)
        // 모달 컨테이너 제거
        if (modalContainerRef.current && modalContainerRef.current.parentNode) {
          modalContainerRef.current.parentNode.removeChild(modalContainerRef.current)
          modalContainerRef.current = null
        }
        // body 스타일 복원
        document.body.style.overflow = originalOverflow
        document.body.style.position = originalPosition
      }
    }
  }, [isOpen, imageUrl])

  // SSR 방지
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !isOpen || !imageUrl || !modalContainerRef.current) return null

  const handleSave = (editedImageUrl: string) => {
    onSave(editedImageUrl)
    onClose()
  }

  // React Portal을 사용하지 않고 직접 렌더링
  const modalContent = (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 2147483647,
        backgroundColor: 'white',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* 오버레이 */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          zIndex: -1
        }}
        onClick={onClose}
      />

      {/* 헤더 */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '8px 16px',
          backgroundColor: 'white',
          borderBottom: '1px solid #e5e7eb',
          zIndex: 1
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <h2 style={{
            fontSize: '16px',
            fontWeight: 600,
            color: '#111827',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {title}
            {fileName && (
              <span style={{
                marginLeft: '12px',
                fontSize: '14px',
                fontWeight: 400,
                color: '#6b7280'
              }}>
                {fileName}
              </span>
            )}
          </h2>
        </div>
        <button
          onClick={onClose}
          style={{
            padding: '6px',
            borderRadius: '50%',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          title="닫기"
        >
          <X size={20} />
        </button>
      </div>

      {/* 에디터 컨테이너 */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        {isLoading && (
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'white',
            zIndex: 10
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '48px',
                height: '48px',
                border: '4px solid #4f46e5',
                borderTopColor: 'transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
              <p style={{ marginTop: '16px', color: '#6b7280' }}>이미지 에디터 로딩 중...</p>
            </div>
          </div>
        )}
        <ImageEditor
          imageUrl={imageUrl}
          onSave={handleSave}
          onClose={onClose}
          width="100%"
          height="100%"
        />
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )

  // 모달을 생성된 컨테이너에 렌더링
  if (typeof window !== 'undefined' && modalContainerRef.current) {
    return ReactDOM.createPortal(modalContent, modalContainerRef.current)
  }

  return null
}

export default ImageEditorModal