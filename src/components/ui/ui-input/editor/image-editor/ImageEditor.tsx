'use client'

import React, { useRef, useCallback, useEffect } from 'react'
import 'tui-image-editor/dist/tui-image-editor.css'
import './image-editor-custom.css'
// import { useLocale } from '@/hooks/useI18n'
// import { useImageEditorI18n } from './locales'

export interface ImageEditorProps {
  imageUrl: string
  onSave?: (editedImageUrl: string) => void
  onClose?: () => void
  width?: string | number
  height?: string | number
  className?: string
}

/**
 * TUI 기반 이미지 편집기 컴포넌트
 *
 * 독립적으로 사용 가능한 범용 이미지 편집 도구
 * 크롭, 회전, 필터, 텍스트, 도형 등 다양한 편집 기능 제공
 */
const ImageEditor: React.FC<ImageEditorProps> = ({
  imageUrl,
  onSave,
  onClose,
  width = '100%',
  height = '100%',
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const editorInstanceRef = useRef<any>(null)
  const [isEditorReady, setIsEditorReady] = React.useState(false)

  // 다국어 지원 임시 비활성화
  // const { locale } = useLocale()
  // const { translations } = useImageEditorI18n(locale)

  useEffect(() => {
    if (!imageUrl || !containerRef.current) return

    let isMounted = true
    setIsEditorReady(false)

    // 동적으로 TUI Image Editor 로드
    import('tui-image-editor').then(({ default: ImageEditorClass }) => {
      if (!isMounted || !containerRef.current) return

      try {
        // 기존 에디터 인스턴스가 있으면 안전하게 제거
        if (editorInstanceRef.current) {
          try {
            editorInstanceRef.current.destroy()
          } catch (e) {
            console.warn('Error destroying previous editor instance:', e)
          }
          editorInstanceRef.current = null
        }

        // 현재 로케일에 맞는 번역 적용 (임시 비활성화)
        // const currentLocale = translations

        // 새 에디터 인스턴스 생성
        const editor = new ImageEditorClass(containerRef.current, {
          includeUI: {
            loadImage: {
              path: imageUrl,
              name: 'EditedImage'
            },
            // locale: currentLocale, // 현재 로케일 적용
            menu: ['crop', 'flip', 'rotate', 'draw', 'shape', 'icon', 'text', 'mask', 'filter'],
            initMenu: 'filter',
            uiSize: {
              width: typeof width === 'number' ? `${width}px` : width,
              height: typeof height === 'number' ? `${height}px` : height
            },
            menuBarPosition: 'bottom',
            // zoom과 hand 기능 활성화
            usageStatistics: false
          },
          cssMaxWidth: typeof width === 'number' ? width : 1000,
          cssMaxHeight: typeof height === 'number' ? height : 700,
          selectionStyle: {
            cornerStyle: 'circle',
            cornerSize: 20,
            cornerColor: '#4F46E5',
            cornerStrokeColor: '#ffffff',
            transparentCorners: false,
            lineWidth: 2,
            borderColor: '#4F46E5',
            rotatingPointOffset: 70
          }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any)

        // 에디터 인스턴스가 제대로 생성되었는지 확인
        if (!editor) {
          throw new Error('Failed to create TUI Image Editor instance')
        }

        editorInstanceRef.current = editor

        // 에디터가 완전히 준비될 때까지 대기
        // TUI Image Editor는 내부적으로 이미지 로딩을 비동기로 처리
        const checkEditorReady = () => {
          try {
            // 에디터가 준비되었는지 확인하기 위해 안전한 메서드 호출
            if (editorInstanceRef.current && editorInstanceRef.current.getCanvasSize) {
              editorInstanceRef.current.getCanvasSize()
              if (isMounted) {
                setIsEditorReady(true)
              }
            } else {
              // 아직 준비되지 않았으면 다시 확인
              if (isMounted) {
                setTimeout(checkEditorReady, 100)
              }
            }
          } catch {
            // 에디터가 아직 준비되지 않았으면 다시 확인
            if (isMounted) {
              setTimeout(checkEditorReady, 100)
            }
          }
        }

        // 초기 로딩 지연 후 준비 상태 확인 시작
        setTimeout(checkEditorReady, 300)
      } catch (error) {
        console.error('Error initializing TUI Image Editor:', error)
      }
    }).catch(error => {
      console.error('Error loading TUI Image Editor module:', error)
    })

    return () => {
      isMounted = false
      // 컴포넌트 언마운트 시 에디터 안전하게 정리
      if (editorInstanceRef.current) {
        try {
          editorInstanceRef.current.destroy()
        } catch (e) {
          console.warn('Error destroying editor on unmount:', e)
        }
        editorInstanceRef.current = null
      }
      setIsEditorReady(false)
    }
  }, [imageUrl, width, height])

  const handleSave = useCallback(() => {
    if (!editorInstanceRef.current || !isEditorReady) {
      console.warn('Editor is not ready yet')
      return
    }

    try {
      // 편집된 이미지를 base64로 가져오기 (여러 방법 시도)
      let dataURL: string = ''

      // 방법 1: toDataURL() 시도 (가장 일반적인 방법)
      if (typeof editorInstanceRef.current.toDataURL === 'function') {
        dataURL = editorInstanceRef.current.toDataURL({
          format: 'image/png',
          quality: 1.0
        })
      }
      // 방법 2: getImageData() 시도 (대안)
      else if (typeof editorInstanceRef.current.getImageData === 'function') {
        dataURL = editorInstanceRef.current.getImageData()
      }
      // 방법 3: _graphics 내부 캔버스 접근
      else if (editorInstanceRef.current._graphics && editorInstanceRef.current._graphics.getCanvas) {
        const canvas = editorInstanceRef.current._graphics.getCanvas()
        if (canvas && canvas.toDataURL) {
          dataURL = canvas.toDataURL('image/png', 1.0)
        }
      }
      else {
        console.error('No available method to get image data')
        return
      }

      if (dataURL && dataURL.length > 100 && onSave) {
        onSave(dataURL)
      } else {
        console.error('Failed to generate valid image data')
      }
    } catch (error) {
      console.error('Error saving image:', error)
    }
  }, [onSave, isEditorReady])

  useEffect(() => {
    if (!containerRef.current || !isEditorReady) return

    // 커스텀 버튼 추가를 위한 타이머
    const timer = setTimeout(() => {
      const headerButtons = containerRef.current?.querySelector('.tui-image-editor-header-buttons')

      if (headerButtons && onSave) {
        // 기존 저장 버튼이 있으면 제거
        const existingSaveBtn = headerButtons.querySelector('.custom-save-btn')
        if (existingSaveBtn) {
          existingSaveBtn.remove()
        }

        // 저장 버튼 추가
        const saveBtn = document.createElement('button')
        saveBtn.className = 'custom-save-btn'
        saveBtn.style.cssText = `
          background: #4F46E5;
          color: white;
          border: none;
          padding: 8px 16px;
          margin-right: 8px;
          border-radius: 4px;
          cursor: pointer;
          font-family: Pretendard, -apple-system, sans-serif;
        `
        saveBtn.textContent = 'Apply'
        saveBtn.onclick = handleSave
        headerButtons.prepend(saveBtn)
      }

      // 닫기 버튼 추가 (onClose가 있을 때만)
      if (headerButtons && onClose) {
        const existingCloseBtn = headerButtons.querySelector('.custom-close-btn')
        if (existingCloseBtn) {
          existingCloseBtn.remove()
        }

        const closeBtn = document.createElement('button')
        closeBtn.className = 'custom-close-btn'
        closeBtn.style.cssText = `
          background: #6b7280;
          color: white;
          border: none;
          padding: 8px 16px;
          margin-right: 8px;
          border-radius: 4px;
          cursor: pointer;
          font-family: Pretendard, -apple-system, sans-serif;
        `
        closeBtn.textContent = 'Cancel'
        closeBtn.onclick = onClose
        headerButtons.prepend(closeBtn)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [handleSave, onSave, onClose, isEditorReady])

  return (
    <div
      ref={containerRef}
      className={`tui-image-editor-container ${className}`}
      style={{ width, height }}
    />
  )
}

export default ImageEditor