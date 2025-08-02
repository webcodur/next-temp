// 차량 관리 API 서비스 모듈

// 차량 기본 API
export { createCar } from './car_POST';
export { searchCar } from './car$_GET';
export { getCarDetail } from './car@id_GET';
export { updateCar } from './car@id_PATCH';
export { deleteCar } from './car@id_DELETE';

// 차량-세대 관계 API
export { createCarHouseholdRelation } from './car_households_POST';
export { searchCarHouseholdRelations } from './car_households$_GET';
export { updateCarHouseholdRelation } from './car_households@id_PATCH';
export { deleteCarHouseholdRelation } from './car_households@id_DELETE';
export { getCarHouseholdUsersSettings } from './car_households@carId_GET';

// 차량-거주자 관계 API
export { createCarResidentRelation } from './car_residents_POST';
export { getCarResidentRelationDetail } from './car_residents@id_GET';
export { updateCarResidentRelation } from './car_residents@id_PATCH';
export { deleteCarResidentRelation } from './car_residents@id_DELETE';