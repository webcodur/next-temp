// 주소 입력 모듈 타입 정의

// 지역 타입
export type ENUM_Region = 'korea' | 'global' | 'direct';

// Daum API 응답 데이터 타입
export interface DaumAddressData {
  address: string; // 기본 주소 (지번 또는 도로명)
  addressEnglish?: string; // 영문 주소
  addressType: 'R' | 'J'; // R(도로명), J(지번)
  bname: string; // 법정동/법정리 이름
  bname1: string; // 법정리의 읍/면 이름  
  bname2: string; // 법정동/법정리 이름
  sido: string; // 도/시 이름
  sigungu: string; // 시/군/구 이름
  roadAddress?: string; // 도로명 주소 (도로명 주소가 있는 경우에만)
  roadAddressEnglish?: string; // 영문 도로명 주소
  jibunAddress: string; // 지번 주소
  jibunAddressEnglish?: string; // 영문 지번 주소
  zonecode: string; // 우편번호 (5자리)
  postcode: string; // 구 우편번호 (6자리)
  postcode1: string; // 구 우편번호 앞 3자리
  postcode2: string; // 구 우편번호 뒤 3자리
  postcodeSeq: string; // 우편번호 일련번호
  query: string; // 검색어
  buildingCode: string; // 건물 관리 번호
  buildingName: string; // 건물명
  apartment: 'Y' | 'N'; // 아파트 여부
  userLanguageType: 'K' | 'E'; // 검색 언어 (K: 한국어, E: 영어)
  userSelectedType: 'R' | 'J'; // 사용자 선택 주소 타입
  noSelected: 'Y' | 'N'; // 검색 결과에서 선택하지 않고 검색어 그대로 사용하는지 여부
  hname: string; // 행정동/행정리 이름
  
  // 좌표 정보
  x?: string; // 경도 (longitude) - WGS84 좌표계
  y?: string; // 위도 (latitude) - WGS84 좌표계
}

// 좌표 정보 타입
export interface Coordinates {
  longitude: number; // 경도
  latitude: number; // 위도
}

// 표준화된 주소 데이터 타입
export interface AddressData {
  // 기본 정보
  fullAddress: string; // 전체 주소
  postalCode: string; // 우편번호
  
  // 상세 정보
  region?: string; // 시/도
  city?: string; // 시/군/구
  district?: string; // 동/읍/면
  roadAddress?: string; // 도로명 주소
  jibunAddress?: string; // 지번 주소
  buildingName?: string; // 건물명
  
  // 영문 정보
  englishAddress?: string; // 영문 주소
  
  // 좌표 정보
  coordinates?: Coordinates; // 경도/위도 좌표
  
  // 메타 정보
  addressType?: 'road' | 'jibun'; // 주소 타입
  isApartment?: boolean; // 아파트 여부
  
  // 원본 데이터 (디버깅용)
  rawData?: DaumAddressData | unknown;
}

// 글로벌 주소 데이터 (향후 확장용)
export interface GlobalAddressData {
  fullAddress: string;
  postalCode?: string;
  country: string;
  state?: string;
  city?: string;
  street?: string;
  buildingNumber?: string;
  
  // 좌표 정보
  coordinates?: Coordinates; // 경도/위도 좌표
  
  // 원본 데이터 (향후 다양한 글로벌 API 지원용)
  rawData?: unknown;
}

// 직접입력 주소 데이터
export interface DirectAddressData {
  fullAddress: string; // 사용자가 직접 입력한 전체 주소
  postalCode?: string; // 우편번호 (선택사항)
  
  // 좌표 정보 (수동 입력 시에는 없음)
  coordinates?: Coordinates;
  
  // 원본 데이터
  rawData?: {
    inputMethod: 'manual';
    timestamp: number;
  };
}

// Daum API 설정
export interface DaumPostcodeOptions {
  oncomplete: (data: DaumAddressData) => void;
  onresize?: (size: { width: number; height: number }) => void;
  onclose?: (state: 'FORCE_CLOSE' | 'COMPLETE_CLOSE') => void;
  onsearch?: (data: { query: string; count: number }) => void;
  width?: number | string;
  height?: number | string;
  animation?: boolean;
  focusInput?: boolean;
  focusContent?: boolean;
  autoMapping?: boolean;
  shorthand?: boolean;
  pleaseReadGuide?: number;
  pleaseReadGuideTimer?: number;
  maxSuggestItems?: number;
  showMoreHName?: boolean;
  hideMapBtn?: boolean;
  hideEngBtn?: boolean;
  alwaysShowEngAddr?: boolean;
  zonecodeOnly?: boolean;
  theme?: {
    bgColor?: string; // 바탕 배경색
    searchBgColor?: string; // 검색창 배경색
    contentBgColor?: string; // 본문 배경색
    pageBgColor?: string; // 페이지 배경색
    textColor?: string; // 기본 글자색
    queryTextColor?: string; // 검색창 글자색
    postcodeTextColor?: string; // 우편번호 글자색
    emphTextColor?: string; // 강조 글자색
    outlineColor?: string; // 테두리
  };
}

// 컴포넌트 공통 Props
export interface AddressInputBaseProps {
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  colorVariant?: 'primary' | 'secondary';
}

// Daum 주소 입력 컴포넌트 Props
export interface AddressInputProps_KOR extends AddressInputBaseProps {
  value?: AddressData | null;
  onChange?: (address: AddressData | null) => void;
  onClear?: () => void;
  
  // Daum API 옵션
  popupOptions?: Partial<DaumPostcodeOptions>;
  embedMode?: boolean; // 임베드 모드 (기본: 팝업)
  embedHeight?: number; // 임베드 모드일 때 높이
  
  // UI 옵션
  showClearButton?: boolean;
  showDetailAddress?: boolean; // 상세주소 입력 필드 표시
  detailAddressLabel?: string;
  detailAddressPlaceholder?: string;
}

// 글로벌 주소 입력 컴포넌트 Props
export interface AddressInputProps_Global extends AddressInputBaseProps {
  value?: GlobalAddressData | null;
  onChange?: (address: GlobalAddressData | null) => void;
  onClear?: () => void;
  
  // 글로벌 옵션
  countries?: string[]; // 지원 국가 목록 (필터링용)
  defaultCountry?: string;
  enableCountryApi?: boolean; // REST Countries API 사용 여부 (기본: true)
  
  // UI 옵션
  showClearButton?: boolean;
  showCountrySelector?: boolean;
}

// 직접입력 주소 입력 컴포넌트 Props
export interface AddressInput_DirectProps extends AddressInputBaseProps {
  value?: DirectAddressData | null;
  onChange?: (address: DirectAddressData | null) => void;
  onClear?: () => void;
  
  // 직접입력 옵션
  showPostalCode?: boolean; // 우편번호 입력 필드 표시 (기본: true)
  addressPlaceholder?: string; // 주소 입력 필드 플레이스홀더
  postalCodePlaceholder?: string; // 우편번호 입력 필드 플레이스홀더
  
  // UI 옵션
  showClearButton?: boolean;
}

// 통합 주소 입력 컴포넌트 Props
export interface AddressInputProps extends AddressInputBaseProps {
  value?: AddressData | GlobalAddressData | DirectAddressData | null;
  onChange?: (address: AddressData | GlobalAddressData | DirectAddressData | null) => void;
  onClear?: () => void;
  
  // 지역 설정
  forceRegion?: ENUM_Region; // 강제로 특정 지역 사용
  autoDetectRegion?: boolean; // 자동 지역 감지 (기본: true)
  
  // Daum 옵션 (한국)
  daumOptions?: Partial<AddressInputProps_KOR>;
  
  // 글로벌 옵션 (해외)
  globalOptions?: Partial<AddressInputProps_Global>;
  
  // 직접입력 옵션
  directOptions?: Partial<AddressInput_DirectProps>;
  
  // UI 옵션
  showRegionSelector?: boolean; // 지역 수동 선택 UI 표시
  showClearButton?: boolean;
}

// 지역 감지 결과
export interface RegionDetectionResult {
  region: ENUM_Region;
  country: string;
  confidence: number; // 신뢰도 (0-1)
  method: 'ip' | 'timezone' | 'language' | 'manual'; // 감지 방법
}

// Daum API 전역 타입 선언
declare global {
  interface Window {
    daum?: {
      Postcode: new (options: DaumPostcodeOptions) => {
        open: (options?: {
          q?: string;
          left?: number;
          top?: number;
          popupTitle?: string;
          popupKey?: string;
          autoClose?: boolean;
        }) => void;
        embed: (
          element: HTMLElement,
          options?: {
            q?: string;
            autoClose?: boolean;
          }
        ) => void;
      };
    };
  }
}
