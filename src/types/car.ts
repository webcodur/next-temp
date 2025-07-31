// 차량 관리 API 관련 타입 정의 (DTO 기반)

import { PaginatedResponse } from './api';

/**
 * 차량 기본 정보 타입 (CarDto 기준)
 */
export interface Car {
  id: number;
  carNumber: string;
  brand?: string;
  model?: string;
  type?: string;
  outerText?: string;
  year?: number;
  externalSticker?: string;
  fuel?: string;
  totalUseNumber: number;
  inOutStatus?: 'IN' | 'OUT';
  lastParkingDeviceId?: number;
  lastTime?: string;
  frontImageUrl?: string;
  rearImageUrl?: string;
  sideImageUrl?: string;
  topImageUrl?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

/**
 * 차량 생성 요청 타입 (CreateCarDto 기준)
 */
export interface CreateCarRequest {
  carNumber: string;
  brand?: string;
  model?: string;
  type?: string;
  outerText?: string;
  year?: number;
  externalSticker?: string;
  fuel?: string;
  inOutStatus?: 'IN' | 'OUT';
  lastParkingDeviceId?: number;
  frontImageUrl?: string;
  rearImageUrl?: string;
  sideImageUrl?: string;
  topImageUrl?: string;
  lastTime?: string;
}

/**
 * 차량 수정 요청 타입 (UpdateCarDto 기준)
 */
export interface UpdateCarRequest extends Partial<CreateCarRequest> {}

/**
 * 차량 검색 요청 타입 (SearchCarDto 기준)
 */
export interface SearchCarRequest {
  page?: number;
  limit?: number;
  carNumber?: string;
  brand?: string;
  model?: string;
  type?: string;
  fuel?: string;
  yearFrom?: number;
  yearTo?: number;
  inOutStatus?: 'IN' | 'OUT';
  householdInstanceId?: number;
  residentId?: number;
  status?: 'ACTIVE' | 'INACTIVE' | 'PENDING';
}

/**
 * 차량-세대 연결 기본 정보 타입 (CarHouseholdDto 기준)
 */
export interface CarHousehold {
  id: number;
  carId: number;
  householdInstanceId: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  householdInstance: {
    id: number;
    code: string;
    name: string;
    description?: string;
  }[];
}

/**
 * 차량-세대 연결 요청 타입 (CreateCarHouseholdDto 기준)
 */
export interface CreateCarHouseholdRequest {
  carNumber: string;
  householdInstanceId: number;
}

/**
 * 세대 정보가 포함된 차량 타입 (CarWithHouseholdDto 기준)
 */
export interface CarWithHousehold extends Car {
  carHousehold: CarHousehold[];
}

/**
 * 차량-세대-거주자 관계 기본 타입 (CarHouseholdResidentDto 기준)
 */
export interface CarHouseholdResident {
  id: number;
  carId: number;
  householdInstanceId: number;
  residentId: number;
  exitAlarm: boolean;
  carShareOnoff: boolean;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

/**
 * 차량-세대-거주자 관계 생성 요청 타입 (CreateCarHouseholdResidentDto 기준)
 */
export interface CreateCarHouseholdResidentRequest {
  carId: number;
  householdInstanceId: number;
  residentId: number;
  exitAlarm?: boolean;
  carShareOnoff?: boolean;
  isPrimary?: boolean;
}

/**
 * 차량-세대-거주자 관계 수정 요청 타입 (UpdateCarHouseholdResidentDto 기준)
 */
export interface UpdateCarHouseholdResidentRequest {
  exitAlarm?: boolean;
  carShareOnoff?: boolean;
  isPrimary?: boolean;
}

/**
 * 관계 정보가 포함된 차량-세대-거주자 타입 (CarHouseholdResidentWithRelationsDto 기준)
 */
export interface CarHouseholdResidentWithRelations extends CarHouseholdResident {
  car?: Car;
  householdInstance?: {
    id: number;
    dong: string;
    ho: string;
    householderName?: string;
    phone?: string;
    email?: string;
    moveInDate?: string;
    moveOutDate?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  };
  resident?: {
    id: number;
    name: string;
    phone?: string;
    email?: string;
    birthDate?: string;
    isHouseholder: boolean;
    relationshipType?: string;
    createdAt: string;
    updatedAt: string;
  };
}

/**
 * 차량-세대-거주자 관계 검색 요청 타입 (SearchCarHouseholdResidentDto 기준)
 */
export interface SearchCarHouseholdResidentRequest {
  page?: number;
  limit?: number;
  carId?: number;
  householdInstanceId?: number;
  residentId?: number;
  isPrimary?: boolean;
}

/**
 * 차량-세대 관계 검색 요청 타입 (SearchCarHouseholdDto 기준)
 */
export interface SearchCarHouseholdRequest {
  page?: number;
  limit?: number;
  carNumber?: string;
  householdInstanceId?: number;
  residentId?: number;
}

/**
 * 내 차량 등록 요청 타입 (RegisterMyCarDto 기준)
 */
export interface RegisterMyCarRequest {
  carHouseholdId: number;
  exitAlarm?: boolean;
  carShareOnoff?: boolean;
  isPrimary?: boolean;
}

/**
 * API 응답 타입들
 */
export type CarListResponse = PaginatedResponse<CarWithHousehold>;
export type CarHouseholdRelationsResponse = PaginatedResponse<CarHouseholdResidentWithRelations>;