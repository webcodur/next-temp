// 차단기 관리 API exports

// 기본 CRUD
export { searchParkingDevices } from './devices$_GET';
export { createParkingDevice } from './devices_POST';
export { getParkingDeviceDetail } from './devices@id_GET';
export { updateParkingDevice } from './devices@id_PUT';
export { deleteParkingDevice } from './devices@id_DELETE';

// 세부 설정 관리
export { updateParkingDeviceStatus } from './devices@id_status_PUT';
export { updateParkingDeviceBasicInfo } from './devices@id_basic-info_PUT';
export { updateParkingDeviceNetwork } from './devices@id_network_PUT';
export { updateParkingDevicePermissions } from './devices@id_permissions_PUT';
export { updateParkingDeviceOperation } from './devices@id_operation_PUT';

// 부가 기능
export { checkVehiclePermission } from './devices@id_check-permission@vehicleType_GET';
export { searchParkingDeviceCommandLogs } from './devices@id_command-logs$_GET';
export { searchParkingDeviceHistory } from './devices@id_history$_GET';
