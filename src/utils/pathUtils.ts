/**
 * 경로 매칭 유틸리티 함수들
 * 네비게이션 메뉴의 활성 상태 판단에 사용한다
 */

// #region 타입 정의
type PathInput = string | null | undefined;
// #endregion

// #region 메인 매칭 함수
/**
 * 현재 경로가 대상 경로와 매칭되는지 확인한다
 * 정확한 매칭과 하위 경로 매칭을 모두 지원한다
 * 
 * @param currentPath - 현재 경로 (예: '/aaa/bbb/ccc/xxx')
 * @param targetPath - 대상 경로 (예: '/aaa/bbb/ccc')
 * @returns 매칭되면 true, 아니면 false
 * 
 * @example
 * isPathActive('/aaa/bbb/ccc', '/aaa/bbb/ccc') // true (정확한 매칭)
 * isPathActive('/aaa/bbb/ccc/xxx', '/aaa/bbb/ccc') // true (하위 경로 매칭)
 * isPathActive('/aaa/bbb/cccxxx', '/aaa/bbb/ccc') // false (잘못된 매칭 방지)
 * isPathActive('/aaa/bbb', '/aaa/bbb/ccc') // false
 */
export const isPathActive = (currentPath: PathInput, targetPath: PathInput): boolean => {
  // 입력값 검증
  if (!currentPath || !targetPath) {
    return false;
  }

  // 빈 문자열이나 루트 경로 처리
  if (targetPath === '/' || targetPath === '') {
    return currentPath === targetPath;
  }

  // 정확한 매칭
  if (currentPath === targetPath) {
    return true;
  }

  // 하위 경로 매칭
  // targetPath 뒤에 '/'를 붙여서 정확한 하위 경로인지 확인
  const targetWithSlash = targetPath.endsWith('/') ? targetPath : `${targetPath}/`;
  return currentPath.startsWith(targetWithSlash);
};

/**
 * 여러 경로 중 하나라도 매칭되는지 확인한다
 * 
 * @param currentPath - 현재 경로
 * @param targetPaths - 대상 경로들의 배열
 * @returns 하나라도 매칭되면 true
 */
export const isPathActiveMultiple = (currentPath: PathInput, targetPaths: PathInput[]): boolean => {
  if (!currentPath || !targetPaths?.length) {
    return false;
  }

  return targetPaths.some(targetPath => isPathActive(currentPath, targetPath));
};

/**
 * 경로 깊이를 계산한다 (슬래시 개수로 판단)
 * 
 * @param path - 경로
 * @returns 경로 깊이 (루트는 0)
 */
export const getPathDepth = (path: PathInput): number => {
  if (!path || path === '/') {
    return 0;
  }

  return path.split('/').filter(segment => segment.length > 0).length;
};

/**
 * 경로에서 상위 경로를 추출한다
 * 
 * @param path - 현재 경로
 * @param levels - 올라갈 레벨 수 (기본값: 1)
 * @returns 상위 경로
 * 
 * @example
 * getParentPath('/aaa/bbb/ccc/xxx') // '/aaa/bbb/ccc'
 * getParentPath('/aaa/bbb/ccc/xxx', 2) // '/aaa/bbb'
 */
export const getParentPath = (path: PathInput, levels: number = 1): string => {
  if (!path || path === '/') {
    return '/';
  }

  const segments = path.split('/').filter(segment => segment.length > 0);
  
  if (segments.length <= levels) {
    return '/';
  }

  const parentSegments = segments.slice(0, -levels);
  return '/' + parentSegments.join('/');
};
// #endregion

// #region 기본 내보내기
/**
 * 가장 자주 사용될 함수들의 간편한 접근
 */
const pathUtils = {
  // 메인 매칭 함수
  isActive: isPathActive,
  isActiveMultiple: isPathActiveMultiple,
  
  // 유틸리티 함수들
  getDepth: getPathDepth,
  getParent: getParentPath,
};

export default pathUtils;
// #endregion
