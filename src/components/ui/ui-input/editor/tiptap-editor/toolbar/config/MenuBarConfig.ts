import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  Heading1, Heading2, Heading3, List, ListOrdered, CheckSquare,
  Quote, Minus, Undo, Redo, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Highlighter, Subscript, Superscript, Table, Palette,
  FileCode, Eraser, ArrowLeftRight, Type, LucideIcon
} from 'lucide-react'
import type { Editor } from '@tiptap/react'
import { fontOptions } from './font-options'

// 버튼 타입 정의
export interface MenuButton {
  key: string
  icon: LucideIcon
  title: string
  isActive?: (editor: Editor) => boolean
  onClick: (editor: Editor, ...args: unknown[]) => void
  disabled?: (editor: Editor) => boolean
}

// 드롭다운 옵션 타입 정의
export interface DropdownOption {
  value: string
  label: string
}

// 드롭다운 타입 정의
export interface MenuDropdown {
  key: string
  title: string
  options: DropdownOption[]
  onChange: (editor: Editor, value: string) => void
  getCurrentValue?: (editor: Editor) => string
}

// 색상 선택기 타입 정의
export interface ColorPicker {
  key: string
  icon: LucideIcon
  title: string
  onChange: (editor: Editor, color: string) => void
  isActive?: (editor: Editor) => boolean
}

// 메뉴 섹션 타입 정의
export interface MenuSection {
  key: string
  title: string
  buttons?: MenuButton[]
  dropdowns?: MenuDropdown[]
  colorPickers?: ColorPicker[]
  customRender?: boolean
}

// 메뉴바 설정
export const menuBarConfig: MenuSection[] = [
  {
    key: 'text-style',
    title: '텍스트 스타일',
    buttons: [
      {
        key: 'bold',
        icon: Bold,
        title: '굵게',
        isActive: (editor) => editor.isActive('bold'),
        onClick: (editor) => editor.chain().focus().toggleBold().run()
      },
      {
        key: 'italic',
        icon: Italic,
        title: '기울임',
        isActive: (editor) => editor.isActive('italic'),
        onClick: (editor) => editor.chain().focus().toggleItalic().run()
      },
      {
        key: 'underline',
        icon: UnderlineIcon,
        title: '밑줄',
        isActive: (editor) => editor.isActive('underline'),
        onClick: (editor) => editor.chain().focus().toggleUnderline().run()
      },
      {
        key: 'strikethrough',
        icon: Strikethrough,
        title: '취소선',
        isActive: (editor) => editor.isActive('strike'),
        onClick: (editor) => editor.chain().focus().toggleStrike().run()
      },
      {
        key: 'subscript',
        icon: Subscript,
        title: '아래 첨자',
        isActive: (editor) => editor.isActive('subscript'),
        onClick: (editor) => editor.chain().focus().toggleSubscript().run()
      },
      {
        key: 'superscript',
        icon: Superscript,
        title: '위 첨자',
        isActive: (editor) => editor.isActive('superscript'),
        onClick: (editor) => editor.chain().focus().toggleSuperscript().run()
      },
      {
        key: 'clear-formatting',
        icon: Eraser,
        title: '모든 서식 제거',
        onClick: (editor) => editor.chain().focus().clearNodes().unsetAllMarks().run()
      }
    ]
  },
  {
    key: 'font-settings',
    title: '폰트 설정',
    dropdowns: [
      {
        key: 'font-size',
        title: '폰트 크기',
        options: [
          { value: '', label: '기본' },
          { value: '12px', label: '12px' },
          { value: '14px', label: '14px' },
          { value: '16px', label: '16px' },
          { value: '18px', label: '18px' },
          { value: '20px', label: '20px' },
          { value: '24px', label: '24px' },
          { value: '32px', label: '32px' }
        ],
        onChange: (editor, value) => {
          if (value) {
            editor.chain().focus().setFontSize(value).run()
          } else {
            editor.chain().focus().unsetFontSize().run()
          }
        },
        getCurrentValue: (editor) => {
          const attributes = editor.getAttributes('textStyle')
          return attributes.fontSize || ''
        }
      },
      {
        key: 'font-family',
        title: '폰트 설정',
        options: fontOptions,
        onChange: (editor, value) => {
          if (value) {
            editor.chain().focus().setFontFamily(value).run()
          } else {
            editor.chain().focus().unsetFontFamily().run()
          }
        },
        getCurrentValue: (editor) => {
          const attributes = editor.getAttributes('textStyle')
          return attributes.fontFamily || ''
        }
      },
      {
        key: 'line-height',
        title: '줄 간격 (Line Height) - 문단의 줄 사이 높이 조절',
        options: [
          { value: '', label: '기본 줄간격' },
          { value: '1.0', label: '좁게 (1.0x)' },
          { value: '1.2', label: '약간 좁게 (1.2x)' },
          { value: '1.4', label: '보통 (1.4x)' },
          { value: '1.6', label: '약간 넓게 (1.6x)' },
          { value: '1.8', label: '넓게 (1.8x)' },
          { value: '2.0', label: '더 넓게 (2.0x)' },
          { value: '2.5', label: '매우 넓게 (2.5x)' },
          { value: '3.0', label: '가장 넓게 (3.0x)' }
        ],
        onChange: (editor, value) => {
          if (value) {
            editor.chain().focus().setLineHeight(value).run()
          } else {
            editor.chain().focus().unsetLineHeight().run()
          }
        },
        getCurrentValue: (editor) => {
          const attributes = editor.getAttributes('paragraph')
          return attributes.lineHeight || ''
        }
      }
    ]
  },
  {
    key: 'colors',
    title: '색상',
    colorPickers: [
      {
        key: 'text-color',
        icon: Palette,
        title: '글자색',
        onChange: (editor, color) => editor.chain().focus().setColor(color).run()
      },
      {
        key: 'highlight',
        icon: Highlighter,
        title: '글자 배경색',
        isActive: (editor) => editor.isActive('highlight'),
        onChange: (editor, color) => editor.chain().focus().toggleHighlight({ color }).run()
      }
    ]
  },
  {
    key: 'headings',
    title: '제목',
    buttons: [
      {
        key: 'h1',
        icon: Heading1,
        title: '제목 1',
        isActive: (editor) => editor.isActive('heading', { level: 1 }),
        onClick: (editor) => {
          if (editor.isActive('heading', { level: 1 })) {
            editor.chain().focus().setParagraph().run()
          } else {
            editor.chain().focus().setHeading({ level: 1 }).run()
          }
        }
      },
      {
        key: 'h2',
        icon: Heading2,
        title: '제목 2',
        isActive: (editor) => editor.isActive('heading', { level: 2 }),
        onClick: (editor) => {
          if (editor.isActive('heading', { level: 2 })) {
            editor.chain().focus().setParagraph().run()
          } else {
            editor.chain().focus().setHeading({ level: 2 }).run()
          }
        }
      },
      {
        key: 'h3',
        icon: Heading3,
        title: '제목 3',
        isActive: (editor) => editor.isActive('heading', { level: 3 }),
        onClick: (editor) => {
          if (editor.isActive('heading', { level: 3 })) {
            editor.chain().focus().setParagraph().run()
          } else {
            editor.chain().focus().setHeading({ level: 3 }).run()
          }
        }
      }
    ]
  },
  {
    key: 'alignment',
    title: '정렬',
    buttons: [
      {
        key: 'align-left',
        icon: AlignLeft,
        title: '왼쪽 정렬',
        isActive: (editor) => editor.isActive({ textAlign: 'left' }),
        onClick: (editor) => editor.chain().focus().setTextAlign('left').run()
      },
      {
        key: 'align-center',
        icon: AlignCenter,
        title: '가운데 정렬',
        isActive: (editor) => editor.isActive({ textAlign: 'center' }),
        onClick: (editor) => editor.chain().focus().setTextAlign('center').run()
      },
      {
        key: 'align-right',
        icon: AlignRight,
        title: '오른쪽 정렬',
        isActive: (editor) => editor.isActive({ textAlign: 'right' }),
        onClick: (editor) => editor.chain().focus().setTextAlign('right').run()
      },
      {
        key: 'align-justify',
        icon: AlignJustify,
        title: '양쪽 정렬',
        isActive: (editor) => editor.isActive({ textAlign: 'justify' }),
        onClick: (editor) => editor.chain().focus().setTextAlign('justify').run()
      }
    ]
  },
  {
    key: 'lists',
    title: '리스트',
    buttons: [
      {
        key: 'bullet-list',
        icon: List,
        title: '글머리 기호',
        isActive: (editor) => editor.isActive('bulletList'),
        onClick: (editor) => editor.chain().focus().toggleBulletList().run()
      },
      {
        key: 'ordered-list',
        icon: ListOrdered,
        title: '번호 매기기',
        isActive: (editor) => editor.isActive('orderedList'),
        onClick: (editor) => editor.chain().focus().toggleOrderedList().run()
      },
      {
        key: 'task-list',
        icon: CheckSquare,
        title: '체크리스트',
        isActive: (editor) => editor.isActive('taskList'),
        onClick: (editor) => editor.chain().focus().toggleTaskList().run()
      }
    ]
  },
  {
    key: 'blocks',
    title: '블록',
    buttons: [
      {
        key: 'code-block',
        icon: FileCode,
        title: '코드 블록',
        isActive: (editor) => editor.isActive('codeBlock'),
        onClick: (editor) => editor.chain().focus().toggleCodeBlock().run()
      },
      {
        key: 'blockquote',
        icon: Quote,
        title: '인용',
        isActive: (editor) => editor.isActive('blockquote'),
        onClick: (editor) => editor.chain().focus().toggleBlockquote().run()
      },
      {
        key: 'horizontal-rule',
        icon: Minus,
        title: '구분선',
        onClick: (editor) => editor.chain().focus().setHorizontalRule().run()
      }
    ]
  },
  {
    key: 'media',
    title: '미디어',
    customRender: true // 커스텀 렌더링 필요 (파일 업로드 등)
  },
  {
    key: 'table',
    title: '테이블',
    buttons: [
      {
        key: 'insert-table',
        icon: Table,
        title: '표 삽입 (우클릭으로 표 편집)',
        onClick: (editor) => {
          const rows = prompt('행 개수를 입력하세요:', '3')
          const cols = prompt('열 개수를 입력하세요:', '3')
          
          if (rows && cols) {
            const rowCount = parseInt(rows)
            const colCount = parseInt(cols)
            
            if (rowCount > 0 && colCount > 0 && rowCount <= 50 && colCount <= 20) {
              editor.chain().focus().insertTable({ 
                rows: rowCount, 
                cols: colCount, 
                withHeaderRow: true 
              }).run()
            } else {
              alert('행은 1-50개, 열은 1-20개 범위에서 입력해주세요.')
            }
          }
        }
      }
    ]
  },
  {
    key: 'text-direction',
    title: '텍스트 방향',
    buttons: [
      {
        key: 'rtl-toggle',
        icon: ArrowLeftRight,
        title: 'RTL 모드 (우측→좌측 텍스트)',
        isActive: (editor) => {
          const editorElement = editor.view.dom as HTMLElement
          return editorElement.getAttribute('dir') === 'rtl'
        },
        onClick: (editor) => {
          const editorElement = editor.view.dom as HTMLElement
          const currentDir = editorElement.getAttribute('dir')
          const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl'
          editorElement.setAttribute('dir', newDir)
          
          // 플레이스홀더도 방향에 맞게 업데이트
          const prosemirrorElement = editorElement.querySelector('.ProseMirror') as HTMLElement
          if (prosemirrorElement) {
            if (newDir === 'rtl') {
              prosemirrorElement.style.textAlign = 'right'
              prosemirrorElement.style.direction = 'rtl'
            } else {
              prosemirrorElement.style.textAlign = 'left'
              prosemirrorElement.style.direction = 'ltr'
            }
          }
        }
      }
    ]
  },
  {
    key: 'typography',
    title: 'Typography 도움말',
    buttons: [
      {
        key: 'typography-guide',
        icon: Type,
        title: 'Typography 자동 변환 가이드',
        onClick: () => {
          // 모달 열기 로직은 customRender에서 처리
        }
      }
    ],
    customRender: true // Typography 모달 포함
  },
  {
    key: 'history',
    title: '실행 취소/다시 실행',
    buttons: [
      {
        key: 'undo',
        icon: Undo,
        title: '실행 취소',
        onClick: (editor) => editor.chain().focus().undo().run(),
        disabled: (editor) => !editor.can().undo()
      },
      {
        key: 'redo',
        icon: Redo,
        title: '다시 실행',
        onClick: (editor) => editor.chain().focus().redo().run(),
        disabled: (editor) => !editor.can().redo()
      }
    ],
    customRender: true // 미리보기 버튼 포함
  }
]
