import { Extension } from '@tiptap/core'

/**
 * 배경색 확장
 * 문단과 제목의 배경색을 설정할 수 있는 기능 제공
 */
export const BackgroundColor = Extension.create({
  name: 'backgroundColor',
  
  addGlobalAttributes() {
    return [
      {
        types: ['paragraph', 'heading'],
        attributes: {
          backgroundColor: {
            default: null,
            parseHTML: element => element.style.backgroundColor,
            renderHTML: attributes => {
              if (!attributes.backgroundColor) return {}
              return { style: `background-color: ${attributes.backgroundColor}` }
            }
          }
        }
      }
    ]
  },

  addCommands() {
    return {
      setBackgroundColor: (color: string) => ({ chain }) => {
        return chain().updateAttributes('paragraph', { backgroundColor: color }).run()
      },
      unsetBackgroundColor: () => ({ chain }) => {
        return chain().updateAttributes('paragraph', { backgroundColor: null }).run()
      }
    }
  }
})
