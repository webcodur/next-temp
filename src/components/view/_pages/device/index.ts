// 차단기 장비 관리 컴포넌트 exports

// 메인 페이지들
export { default as DevicesListPage } from './DevicesListPage';
export { default as DeviceCreatePage } from './DeviceCreatePage';

// 기본 정보 관련
export { default as DeviceDetailPage } from './basic/DeviceDetailPage';
export { default as DeviceForm } from './basic/DeviceForm';

// 권한 관련
export { default as DevicePermissionsPage } from './permissions/DevicePermissionsPage';
export { default as DevicePermissionConfigSection } from './permissions/DevicePermissionConfigSection';

// 로그 관련
export { default as DeviceLogsPage } from './logs/DeviceLogsPage';
export { default as DeviceCommandLogSection } from './logs/DeviceCommandLogSection';

// 이력 관련
export { default as DeviceHistoryPage } from './history/DeviceHistoryPage';

// 설정 관련
export { default as DeviceNetworkConfigSection } from './config/DeviceNetworkConfigSection';
export { default as DeviceOperationConfigSection } from './config/DeviceOperationConfigSection';
export { default as DeviceHistorySection } from './history/DeviceHistorySection';

// 타입 exports
export type { DeviceFormData } from './basic/DeviceForm';
