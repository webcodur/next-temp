import { Extension } from '@tiptap/core'

/**
 * 라인 높이 확장
 * 문단과 제목의 줄 간격을 조절할 수 있는 기능 제공
 */
export const LineHeight = Extension.create({
  name: 'lineHeight',
  
  addGlobalAttributes() {
    return [
      {
        types: ['paragraph', 'heading'],
        attributes: {
          lineHeight: {
            default: null,
            parseHTML: element => element.style.lineHeight,
            renderHTML: attributes => {
              if (!attributes.lineHeight) return {}
              return { style: `line-height: ${attributes.lineHeight}` }
            }
          }
        }
      }
    ]
  },

  addCommands() {
    return {
      setLineHeight: (lineHeight: string) => ({ chain }) => {
        return chain().updateAttributes('paragraph', { lineHeight }).run()
      },
      unsetLineHeight: () => ({ chain }) => {
        return chain().updateAttributes('paragraph', { lineHeight: null }).run()
      }
    }
  }
})
