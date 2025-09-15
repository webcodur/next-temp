'use client'

import React, { useRef } from 'react'
import { Link, Unlink, Image as ImageIcon, Youtube, Eye } from 'lucide-react'
import type { MenuBarProps } from '../types'
import { menuBarConfig, type MenuSection, type MenuButton, type MenuDropdown, type ColorPicker } from './config/MenuBarConfig'

// #region 메뉴바 컴포넌트
const MenuBar: React.FC<MenuBarProps> = ({ editor, onImageUpload, onShowPreview }) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const colorInputRefs = useRef<Record<string, HTMLInputElement | null>>({})

  // #region 커스텀 핸들러들
  const customHandlers = {
    handleImageClick: () => {
      if (!editor) return
      fileInputRef.current?.click()
    },

    handleImageUpload: async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return

      try {
        let url: string
        if (onImageUpload) {
          url = await onImageUpload(file)
        } else {
          url = await new Promise((resolve) => {
            const reader = new FileReader()
            reader.onloadend = () => resolve(reader.result as string)
            reader.readAsDataURL(file)
          })
        }
        
        editor?.chain().focus().setImage({ src: url }).run()
      } catch (error) {
        console.error('이미지 업로드 실패:', error)
      }
    },

    setLink: () => {
      const previousUrl = editor?.getAttributes('link').href
      const url = window.prompt('URL:', previousUrl)

      if (url === null) return
      if (url === '') {
        editor?.chain().focus().extendMarkRange('link').unsetLink().run()
        return
      }

      editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    },

    addYoutubeVideo: () => {
      const url = prompt('YouTube URL을 입력하세요:')
      if (url && editor) {
        editor.commands.setYoutubeVideo({ src: url })
      }
    }
  }
  // #endregion

  // #region 스타일 설정
  const getButtonStyle = (isActive: boolean, disabled?: boolean): React.CSSProperties => ({
    padding: '8px',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: isActive ? '#3b82f6' : 'transparent',
    color: isActive ? 'white' : disabled ? '#9ca3af' : '#374151',
    cursor: disabled ? 'not-allowed' : 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  })

  const sectionStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '0 8px',
    borderRight: '1px solid #e5e7eb'
  }

  const selectStyle: React.CSSProperties = {
    padding: '4px 8px',
    fontSize: '14px',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    backgroundColor: 'white',
    color: '#374151'
  }
  // #endregion

  // #region 렌더링 함수들
  const renderButton = (button: MenuButton) => {
    const isActive = button.isActive ? button.isActive(editor) : false
    const isDisabled = button.disabled ? button.disabled(editor) : false
    
    return (
      <button
        key={button.key}
        onClick={() => !isDisabled && button.onClick(editor)}
        disabled={isDisabled}
        title={button.title}
        style={getButtonStyle(isActive, isDisabled)}
        onMouseEnter={(e) => {
          if (!isActive && !isDisabled) {
            e.currentTarget.style.backgroundColor = '#f3f4f6'
          }
        }}
        onMouseLeave={(e) => {
          if (!isActive) {
            e.currentTarget.style.backgroundColor = 'transparent'
          }
        }}
      >
        <button.icon size={18} />
      </button>
    )
  }

  const renderDropdown = (dropdown: MenuDropdown) => (
    <select
      key={dropdown.key}
      onChange={(e) => dropdown.onChange(editor, e.target.value)}
      title={dropdown.title}
      style={selectStyle}
      value={dropdown.getCurrentValue ? dropdown.getCurrentValue(editor) : ''}
    >
      {dropdown.options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )

  const renderColorPicker = (colorPicker: ColorPicker) => {
    const isActive = colorPicker.isActive ? colorPicker.isActive(editor) : false
    
    return (
      <React.Fragment key={colorPicker.key}>
        <button
          onClick={() => colorInputRefs.current[colorPicker.key]?.click()}
          style={getButtonStyle(isActive)}
          title={colorPicker.title}
          onMouseEnter={(e) => {
            if (!isActive) {
              e.currentTarget.style.backgroundColor = '#f3f4f6'
            }
          }}
          onMouseLeave={(e) => {
            if (!isActive) {
              e.currentTarget.style.backgroundColor = 'transparent'
            }
          }}
        >
          <colorPicker.icon size={18} />
        </button>
        <input
          ref={(el) => { colorInputRefs.current[colorPicker.key] = el }}
          type="color"
          onChange={(e) => colorPicker.onChange(editor, e.target.value)}
          style={{ display: 'none' }}
        />
      </React.Fragment>
    )
  }

  const renderCustomSection = (section: MenuSection) => {
    switch (section.key) {
      case 'media':
        return (
          <div key={section.key} style={sectionStyle}>
            <button
              onClick={customHandlers.setLink}
              style={getButtonStyle(editor.isActive('link'))}
              title="링크"
              onMouseEnter={(e) => {
                if (!editor.isActive('link')) {
                  e.currentTarget.style.backgroundColor = '#f3f4f6'
                }
              }}
              onMouseLeave={(e) => {
                if (!editor.isActive('link')) {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }
              }}
            >
              <Link size={18} />
            </button>
            {editor.isActive('link') && (
              <button
                onClick={() => editor.chain().focus().unsetLink().run()}
                style={getButtonStyle(false)}
                title="링크 제거"
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f3f4f6'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }}
              >
                <Unlink size={18} />
              </button>
            )}
            <button
              onClick={customHandlers.handleImageClick}
              style={getButtonStyle(false)}
              title="이미지"
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f3f4f6'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
              }}
            >
              <ImageIcon size={18} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={customHandlers.handleImageUpload}
              style={{ display: 'none' }}
            />
            <button
              onClick={customHandlers.addYoutubeVideo}
              style={getButtonStyle(false)}
              title="YouTube 동영상"
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f3f4f6'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
              }}
            >
              <Youtube size={18} />
            </button>
          </div>
        )


      case 'history':
        return (
          <div key={section.key} style={{ ...sectionStyle, borderRight: 'none' }}>
            {section.buttons?.map(renderButton)}
            {onShowPreview && (
              <button
                onClick={onShowPreview}
                style={getButtonStyle(false)}
                title="미리보기"
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f3f4f6'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }}
              >
                <Eye size={18} />
              </button>
            )}
          </div>
        )

      default:
        return null
    }
  }

  const renderSection = (section: MenuSection) => {
    if (section.customRender) {
      return renderCustomSection(section)
    }

    return (
      <div key={section.key} style={sectionStyle}>
        {section.buttons?.map(renderButton)}
        {section.dropdowns?.map(renderDropdown)}
        {section.colorPickers?.map(renderColorPicker)}
      </div>
    )
  }
  // #endregion

  if (!editor) {
    return null
  }

  return (
    <div style={{
      borderBottom: '1px solid #e5e7eb',
      padding: '8px',
      display: 'flex',
      flexWrap: 'wrap',
      gap: '4px',
      backgroundColor: 'white'
    }}>
      {menuBarConfig.map(renderSection)}
    </div>
  )
}
// #endregion

export default MenuBar