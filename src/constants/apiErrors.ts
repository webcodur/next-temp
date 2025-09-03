/**
 * API 에러 메시지 정의
 * 함수명을 키로 사용하는 패턴
 */
export const API_ERRORS = {
  // Auth
  'signInWithCredentials': '로그인 실패',
  'logout': '로그아웃 실패',
  'refreshTokenWithString': '토큰 갱신 실패',

  // Admin  
  'searchAdmin': '관리자 검색 실패',
  'getAdminDetail': '관리자 상세 조회 실패',
  'createAdmin': '관리자 계정 생성 실패',
  'updateAdmin': '관리자 계정 수정 실패',
  'deleteAdmin': '관리자 계정 삭제 실패',

  // Cars
  'searchCars': '차량 목록 조회 실패',
  'getCarsByInstance': '차량 상세 조회 실패',
  'createCar': '차량 생성 실패',
  'updateCar': '차량 정보 수정 실패',
  'deleteCar': '차량 삭제 실패',
  'getCarUsers': '차량-사용자 관계 조회 실패',
  'searchCarInstances': '차량-인스턴스 연결 조회 실패',
  'getCarInstanceDetail': '인스턴스 차량 상세 조회 실패',
  'createCarInstance': '차량-인스턴스 연결 실패',
  'updateCarInstance': '차량-인스턴스 연결 수정 실패',
  'deleteCarInstance': '차량-인스턴스 연결 삭제 실패',
  'getCarInstanceUserDetail': '차량-사용자 연결 상세 조회 실패',
  'createCarInstanceUser': '차량-사용자 연결 생성 실패',
  'updateCarInstanceUser': '차량-사용자 연결 수정 실패',
  'deleteCarInstanceUser': '차량-사용자 연결 삭제 실패',

  // Blacklist
  'searchBlacklists': '블랙리스트 목록 조회 실패',
  'updateBlacklist': '블랙리스트 수정 실패',
  'unblockBlacklist': '블랙리스트 해제 실패',
  'createManualBlacklist': '수동 블랙리스트 등록 실패',
  'getBlacklistStatus': '차량 블랙리스트 상태 확인 실패',

  // Cache
  'getCacheStats': '캐시 통계 조회 실패',
  'getCacheStatsByNamespace': '네임스페이스별 캐시 통계 조회 실패',
  'deleteCacheNamespace': '네임스페이스 캐시 삭제 실패',

  // Config
  'searchConfigs': '설정값 조회 실패',
  'getConfigById': '특정 설정값 조회 실패',
  'updateConfigById': '설정값 업데이트 실패',

  // Devices
  'searchParkingDevices': '차단기 목록 조회 실패',
  'getParkingDeviceDetail': '차단기 상세 조회 실패',
  'createParkingDevice': '차단기 생성 실패',
  'deleteParkingDevice': '차단기 삭제 실패',
  'updateParkingDevice': '차단기 수정 실패',
  'updateParkingDeviceBasicInfo': '차단기 기본 정보 수정 실패',
  'updateParkingDeviceNetwork': '차단기 네트워크 설정 수정 실패',
  'updateParkingDeviceOperation': '차단기 운영 설정 수정 실패',
  'updateParkingDevicePermissions': '차단기 출입 권한 설정 실패',
  'updateParkingDeviceStatus': '차단기 상태 변경 실패',
  'checkVehiclePermission': '차량 유형별 출입 허가 확인 실패',
  'searchParkingDeviceCommandLogs': '차단기 명령 로그 조회 실패',
  'searchParkingDeviceHistory': '차단기 변경 이력 조회 실패',

  // Instances
  'searchInstances': '인스턴스 목록 조회 실패',
  'getInstanceDetail': '인스턴스 상세 조회 실패',
  'createInstance': '인스턴스 생성 실패',
  'updateInstance': '인스턴스 수정 실패',
  'deleteInstance': '인스턴스 삭제 실패',
  'updateInstanceServiceConfig': '인스턴스 서비스 설정 수정 실패',
  'updateInstanceVisitConfig': '인스턴스 방문 설정 수정 실패',

  // IP
  'getBlockedIpList': '차단된 IP 목록 조회 실패',
  'deleteBlockedIp': '특정 IP 차단 해제 실패',
  'deleteAllBlockedIp': '모든 IP 차단 해제 실패',
  'searchBlockHistory': '차단 내역 검색 실패',

  // Users
  'searchUsers': '사용자 목록 조회 실패',
  'getUserDetail': '사용자 상세 조회 실패',
  'updateUser': '사용자 수정 실패',
  'deleteUser': '사용자 삭제 실패',
  'getUserHistory': '사용자 인스턴스 이동 이력 조회 실패',
  'createUserInstance': '사용자-인스턴스 관계 생성 실패',
  'updateUserInstance': '사용자-인스턴스 관계 수정 실패',
  'deleteUserInstance': '사용자-인스턴스 관계 삭제 실패',
  'moveUser': '사용자 인스턴스 이동 실패',

  // Violations
  'searchViolations': '위반 목록 조회 실패',
  'getViolationDetail': '위반 기록 상세 조회 실패',
  'createViolation': '차량 위반 기록 생성 실패',
  'updateViolation': '위반 기록 수정 실패',
  'processViolation': '위반 기록 처리 실패',
  'getViolationSummary': '차량 위반 요약 조회 실패',

  // 공통 에러
  'network_error': '네트워크 오류',
  'unknown_error': '알 수 없는 오류가 발생했습니다',
} as const;

export type ApiErrorKey = keyof typeof API_ERRORS;
