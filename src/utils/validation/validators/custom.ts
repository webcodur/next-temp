/**
 * 커스텀 유효성 검사 함수들
 */

// #region 커스텀 검증
/**
 * 커스텀 검증 함수 실행
 */
export const custom = (value: string, validator?: (value: string) => boolean): boolean => {
  return validator ? validator(value) : true;
};
// #endregion
