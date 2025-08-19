/**
 * 기본 에러 메시지 정의
 */

export const defaultMessages = {
  required: '필수 입력 항목입니다',
  email: '올바른 이메일 형식을 입력해주세요 (예: user@domain.com)',
  phone: '올바른 휴대폰 번호를 입력해주세요 (010-0000-0000)',
  password: '8자 이상 입력해주세요',
  'password-confirm': '비밀번호가 일치하지 않습니다',
  ip: '올바른 IP 주소를 입력해주세요 (예: 192.168.0.1)',
  port: '1-65535 범위의 포트 번호를 입력해주세요',
  length: '입력 길이가 올바르지 않습니다',
  number: '올바른 숫자를 입력해주세요',
  integer: '정수만 입력 가능합니다',
  carNumber: '올바른 차량번호를 입력해주세요',
  custom: '입력값이 올바르지 않습니다',
  free: '' // 자유 형식은 메시지 없음
};
