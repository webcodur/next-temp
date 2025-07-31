/**
 * Case Converter Utilities
 * snake_case ↔ camelCase 변환 함수들
 */

/**
 * 문자열을 camelCase에서 snake_case로 변환
 * @param str 변환할 문자열
 * @returns snake_case 문자열
 */
function toSnakeCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1_$2') // 소문자 뒤 대문자: userId -> user_Id
    .replace(/([a-z])([0-9])/g, '$1_$2')  // 소문자 뒤 숫자: address1 -> address_1
    .replace(/([0-9])([A-Z])/g, '$1_$2')  // 숫자 뒤 대문자: 1Depth -> 1_Depth
    .toLowerCase();
}

/**
 * 문자열을 snake_case에서 camelCase로 변환
 * @param str 변환할 문자열
 * @returns camelCase 문자열
 */
function toCamelCase(str: string): string {
  return str.split('_').map((part, index) => {
    if (index === 0) return part; // 첫 번째 부분은 그대로
    
    // 숫자로 시작하는 부분은 숫자 + 나머지 문자의 첫 글자를 대문자로
    if (/^[0-9]/.test(part)) {
      return part.replace(/^([0-9]+)(.*)/, (match, numbers, letters) => {
        return numbers + (letters ? letters.charAt(0).toUpperCase() + letters.slice(1) : '');
      });
    }
    
    // 일반적인 경우: 첫 글자만 대문자로
    return part.charAt(0).toUpperCase() + part.slice(1);
  }).join('');
}

/**
 * 예외 처리가 필요한 키들인지 확인
 * @param key 확인할 키
 * @returns 예외 처리 필요 여부
 */
function shouldSkipConversion(key: string): boolean {
  // 이미 camelCase인 경우나 특수 케이스들
  const skipPatterns = [
    /^[a-z]+$/, // 모두 소문자 (id, name 등)
    /^[A-Z_]+$/, // 상수 형태 (ENUM 값들)
    /^url/i, // URL 관련
    /^api/i, // API 관련
  ];
  
  return skipPatterns.some(pattern => pattern.test(key));
}

/**
 * 객체의 모든 키를 snake_case에서 camelCase로 변환 (재귀)
 * @param obj 변환할 객체
 * @returns camelCase 키를 가진 객체
 */
export function snakeToCamel<T = unknown>(obj: T): T {
  // null, undefined, 기본 타입 처리
  if (obj === null || obj === undefined || typeof obj !== 'object') {
    return obj;
  }
  
  // 배열 처리
  if (Array.isArray(obj)) {
    return obj.map(snakeToCamel) as T;
  }
  
  // Date 객체 등 특수 객체 처리
  if (obj instanceof Date || obj instanceof RegExp) {
    return obj;
  }
  
  // 일반 객체 처리
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    const camelKey = shouldSkipConversion(key) ? key : toCamelCase(key);
    result[camelKey] = snakeToCamel(value); // 재귀 처리
  }
  
  return result as T;
}

/**
 * 객체의 모든 키를 camelCase에서 snake_case로 변환 (재귀)
 * @param obj 변환할 객체
 * @returns snake_case 키를 가진 객체
 */
export function camelToSnake<T = unknown>(obj: T): T {
  // null, undefined, 기본 타입 처리
  if (obj === null || obj === undefined || typeof obj !== 'object') {
    return obj;
  }
  
  // 배열 처리
  if (Array.isArray(obj)) {
    return obj.map(camelToSnake) as T;
  }
  
  // Date 객체 등 특수 객체 처리
  if (obj instanceof Date || obj instanceof RegExp) {
    return obj;
  }
  
  // 일반 객체 처리
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    const snakeKey = shouldSkipConversion(key) ? key : toSnakeCase(key);
    result[snakeKey] = camelToSnake(value); // 재귀 처리
  }
  
  return result as T;
}

/**
 * 개발 및 디버깅용 - 변환 과정을 콘솔에 출력
 * @param obj 변환할 객체
 * @param direction 변환 방향
 */
export function debugConversion<T = unknown>(obj: T, direction: 'snake-to-camel' | 'camel-to-snake'): T {
  console.group(`🔄 Case Conversion: ${direction}`);
  console.log('입력:', obj);
  
  const result = direction === 'snake-to-camel' ? snakeToCamel(obj) : camelToSnake(obj);
  
  console.log('출력:', result);
  console.groupEnd();
  
  return result;
} 