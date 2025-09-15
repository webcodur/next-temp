/**
 * TipTap 커스텀 확장 모듈
 * 
 * 에디터에서 사용하는 모든 커스텀 확장과 유틸리티를 제공한다.
 * 각 확장은 독립적으로 개발되어 조합 가능하다.
 */

export { LineHeight } from './LineHeight'
export { BackgroundColor } from './BackgroundColor'

// 모든 커스텀 확장을 배열로 export
import { LineHeight } from './LineHeight'
import { BackgroundColor } from './BackgroundColor'  

export const customExtensions = [
  LineHeight,
  BackgroundColor
]
