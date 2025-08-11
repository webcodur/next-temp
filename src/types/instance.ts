// 인스턴스 관리 타입 정의
import { ResidentInstance } from './resident';

export type InstanceType = 'GENERAL' | 'TEMP' | 'COMMERCIAL';

// 기본 인스턴스 정보
export interface Instance {
  id: number;
  parkinglotId: number;
  name: string;
  ownerName?: string | null;
  phone: string;
  address1Depth: string;
  address2Depth: string;
  address3Depth?: string | null;
  instanceType: InstanceType;
  password: string;
  memo?: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  instanceServiceConfig?: InstanceServiceConfig | null;
  instanceVisitConfig?: InstanceVisitConfig | null;
  residentInstance?: ResidentInstanceWithResident[];
  carInstance?: CarInstanceWithCar[];
}

// 인스턴스 생성 요청
export interface CreateInstanceRequest {
  address1Depth: string;
  address2Depth: string;
  address3Depth?: string;
  instanceType: InstanceType;
  password: string;
  memo?: string;
}

// 인스턴스 수정 요청
export interface UpdateInstanceRequest {
  address1Depth?: string;
  address2Depth?: string;
  address3Depth?: string;
  instanceType?: InstanceType;
  password?: string;
  memo?: string;
}

// 인스턴스 검색 파라미터
export interface SearchInstanceParams {
  page?: number;
  limit?: number;
  instanceType?: InstanceType;
  address1Depth?: string;
  address2Depth?: string;
  address3Depth?: string;
  instanceId?: number;
  instanceName?: string;
}

// 인스턴스 서비스 설정
export interface InstanceServiceConfig {
  id: number;
  instanceId: number;
  canAddNewResident: boolean;
  isCommonEntranceSubscribed: boolean;
  isTemporaryAccess: boolean;
  tempCarLimit: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

// 인스턴스 서비스 설정 수정
export interface UpdateInstanceServiceConfigRequest {
  canAddNewResident?: boolean;
  isCommonEntranceSubscribed?: boolean;
  isTemporaryAccess?: boolean;
  tempCarLimit?: number;
}

// 인스턴스 방문 설정
export interface InstanceVisitConfig {
  id: number;
  instanceId: number;
  availableVisitTime: number;
  purchasedVisitTime: number;
  visitRequestLimit: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

// 인스턴스 방문 설정 수정
export interface UpdateInstanceVisitConfigRequest {
  availableVisitTime?: number;
  purchasedVisitTime?: number;
  visitRequestLimit?: number;
}

// 거주민 인스턴스 관계 (거주민 정보 포함)
export interface ResidentInstanceWithResident {
  id: number;
  residentId: number;
  instanceId: number;
  memo?: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  resident: {
    id: number;
    name: string;
    phone: string;
    email: string;
    birthDate: string;
    gender: string;
    emergencyContact: string;
    memo?: string | null;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string | null;
  };
}

// 차량 인스턴스 관계 (차량 정보 포함)
export interface CarInstanceWithCar {
  id: number;
  carId: number;
  instanceId: number;
  carShareOnoff: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  car: {
    id: number;
    carNumber: string;
    brand: string;
    model: string;
    type: string;
    outerText: string;
    year: number;
    externalSticker?: string | null;
    fuel: string;
    frontImageUrl?: string | null;
    rearImageUrl?: string | null;
    sideImageUrl?: string | null;
    topImageUrl?: string | null;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string | null;
  };
}

// 인스턴스 상세 정보 (모든 관련 정보 포함)
export interface InstanceDetail extends Instance {
  // Instance에서 이미 관련 데이터들이 포함되어 있음
}

// 페이지네이션 응답
export interface PaginatedInstanceResponse {
  data: Instance[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}