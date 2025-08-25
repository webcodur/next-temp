/**
 * API 에러 메시지 정의
 * 서비스 파일명_함수명 패턴으로 키 구성
 */
export const API_ERRORS = {
  // Auth 관련
  'auth_signin': '로그인 실패',
  'auth_logout': '로그아웃 실패',
  'auth_refresh': '토큰 갱신 실패',

  // Admin 관련  
  'admin_search': '관리자 검색 실패',
  'admin_detail': '관리자 상세 조회 실패',
  'admin_create': '관리자 계정 생성 실패',
  'admin_update': '관리자 계정 수정 실패',
  'admin_delete': '관리자 계정 삭제 실패',
  'admin_password_reset': '관리자 비밀번호 초기화 실패',

  // Cars 관련
  'cars_search': '차량 목록 조회 실패',
  'cars_detail': '차량 상세 조회 실패',
  'cars_create': '차량 생성 실패',
  'cars_update': '차량 정보 수정 실패',
  'cars_delete': '차량 삭제 실패',
  'cars_residents': '차량-주민 관계 조회 실패',
  'cars_instances_search': '차량-인스턴스 연결 조회 실패',
  'cars_instances_detail': '인스턴스 차량 상세 조회 실패',
  'cars_instances_create': '차량-인스턴스 연결 실패',
  'cars_instances_update': '차량-인스턴스 연결 수정 실패',
  'cars_instances_delete': '차량-인스턴스 연결 삭제 실패',
  'cars_residents_detail': '차량-주민 연결 상세 조회 실패',
  'cars_residents_create': '차량-주민 연결 생성 실패',
  'cars_residents_update': '차량-주민 연결 수정 실패',
  'cars_residents_delete': '차량-주민 연결 삭제 실패',

  // Blacklist 관련
  'blacklists_search': '블랙리스트 목록 조회 실패',
  'blacklists_update': '블랙리스트 수정 실패',
  'blacklists_unblock': '블랙리스트 해제 실패',
  'blacklists_create_manual': '수동 블랙리스트 등록 실패',
  'blacklists_status': '차량 블랙리스트 상태 확인 실패',

  // Cache 관련
  'cache_stats': '캐시 통계 조회 실패',
  'cache_namespace_stats': '네임스페이스별 캐시 통계 조회 실패',
  'cache_namespace_delete': '네임스페이스 캐시 삭제 실패',

  // Config 관련
  'config_search': '설정값 조회 실패',
  'config_detail': '특정 설정값 조회 실패',
  'config_update': '설정값 업데이트 실패',

  // Devices 관련
  'devices_search': '차단기 목록 조회 실패',
  'devices_detail': '차단기 상세 조회 실패',
  'devices_create': '차단기 생성 실패',
  'devices_delete': '차단기 삭제 실패',
  'devices_update': '차단기 수정 실패',
  'devices_basic_info_update': '차단기 기본 정보 수정 실패',
  'devices_network_update': '차단기 네트워크 설정 수정 실패',
  'devices_operation_update': '차단기 운영 설정 수정 실패',
  'devices_permissions_update': '차단기 출입 권한 설정 실패',
  'devices_status_update': '차단기 상태 변경 실패',
  'devices_check_permission': '차량 유형별 출입 허가 확인 실패',
  'devices_command_logs': '차단기 명령 로그 조회 실패',
  'devices_history': '차단기 변경 이력 조회 실패',

  // Instances 관련
  'instances_search': '인스턴스 목록 조회 실패',
  'instances_detail': '인스턴스 상세 조회 실패',
  'instances_create': '인스턴스 생성 실패',
  'instances_update': '인스턴스 수정 실패',
  'instances_delete': '인스턴스 삭제 실패',
  'instances_service_config_update': '인스턴스 서비스 설정 수정 실패',
  'instances_visit_config_update': '인스턴스 방문 설정 수정 실패',

  // IP 관련
  'ip_block_list': '차단된 IP 목록 조회 실패',
  'ip_block_delete': '특정 IP 차단 해제 실패',
  'ip_block_delete_all': '모든 IP 차단 해제 실패',
  'ip_block_history_search': '차단 내역 검색 실패',

  // Residents 관련
  'residents_search': '주민 목록 조회 실패',
  'residents_detail': '주민 상세 조회 실패',
  'residents_update': '주민 수정 실패',
  'residents_delete': '주민 삭제 실패',
  'residents_history': '주민 인스턴스 이동 이력 조회 실패',
  'residents_instances_create': '주민-인스턴스 관계 생성 실패',
  'residents_instances_update': '주민-인스턴스 관계 수정 실패',
  'residents_instances_delete': '주민-인스턴스 관계 삭제 실패',
  'residents_move': '주민 인스턴스 이동 실패',

  // Violations 관련
  'violations_search': '위반 목록 조회 실패',
  'violations_detail': '위반 기록 상세 조회 실패',
  'violations_create': '차량 위반 기록 생성 실패',
  'violations_update': '위반 기록 수정 실패',
  'violations_process': '위반 기록 처리 실패',
  'violations_summary': '차량 위반 요약 조회 실패',

  // 공통 에러
  'network_error': '네트워크 오류',
  'unknown_error': '알 수 없는 오류가 발생했습니다',
} as const;

export type ApiErrorKey = keyof typeof API_ERRORS;
