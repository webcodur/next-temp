// 주소 입력 모듈
export { AddressInput } from './AddressInput';
export { AddressInput_KOR } from './AddressInput_KOR';
export { AddressInput_Global } from './AddressInput_Global';
export { AddressInput_Direct } from './AddressInput_Direct';

// 훅
export { useRegionDetection } from './hooks/useRegionDetection';

// 타입
export type {
  // 기본 타입
  ENUM_Region,
  Coordinates,
  
  // 데이터 타입
  DaumAddressData,
  AddressData,
  GlobalAddressData,
  DirectAddressData,
  RegionDetectionResult,
  
  // API 설정 타입
  DaumPostcodeOptions,
  
  // 컴포넌트 Props 타입
  AddressInputBaseProps,
  AddressInputProps_KOR,
  AddressInputProps_Global,
  AddressInput_DirectProps,
  AddressInputProps,
} from './types';
