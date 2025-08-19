/**
 * 포트 번호 유효성 검사 함수들
 */

// #region 포트 검증
/**
 * 포트 번호 유효성 검사
 */
export const isValidPort = (port: string | number): boolean => {
  if (typeof port === 'string') {
    if (!/^\d+$/.test(port)) {
      return false;
    }
    port = parseInt(port, 10);
  }

  return port >= 1 && port <= 65535;
};
// #endregion

// #region 검증 with 메시지
/**
 * 포트 번호 유효성 검사 with 에러 메시지
 */
export const validatePort = (port: string): { isValid: boolean; message?: string } => {
  if (!port || typeof port !== 'string') {
    return { isValid: false, message: '포트 번호를 입력해주세요.' };
  }

  const trimmedPort = port.trim();
  
  if (!trimmedPort) {
    return { isValid: false, message: '포트 번호를 입력해주세요.' };
  }

  if (!/^\d+$/.test(trimmedPort)) {
    return { isValid: false, message: '포트 번호는 숫자만 입력할 수 있습니다.' };
  }

  const portNum = parseInt(trimmedPort, 10);
  
  if (portNum < 1 || portNum > 65535) {
    return { isValid: false, message: '포트 번호는 1-65535 범위로 입력해주세요.' };
  }

  return { isValid: true };
};
// #endregion
