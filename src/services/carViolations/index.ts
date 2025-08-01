// 차량 위반 관리 API 서비스 export
export { createCarViolation } from './carViolations_POST';
export { searchCarViolations } from './carViolations$_GET';
export { getCarViolationSummary } from './carViolations_summary@carNumber_GET';
export { getCarViolationDetail } from './carViolations@id_GET';
export { updateCarViolation } from './carViolations@id_PUT';
export { processCarViolation } from './carViolations@id_process_PATCH';