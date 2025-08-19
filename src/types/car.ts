/**
 * 차량 관리 타입 정의
 */

// #region 기본 타입 정의
export interface Car {
  id: number;
  carNumber: string;
  brand?: string | null;
  model?: string | null;
  type?: string | null;
  outerText?: string | null;
  year?: number | null;
  externalSticker?: string | null;
  fuel?: string | null;
  frontImageUrl?: string | null;
  rearImageUrl?: string | null;
  sideImageUrl?: string | null;
  topImageUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CarInstance {
  id: number;
  carNumber: string;
  instanceId: number;
  carShareOnoff: boolean;
  createdAt: string;
  updatedAt: string;
  car?: Car;
  instance?: Instance;
}

export interface CarInstanceResident {
  id: number;
  carInstanceId: number;
  residentId: number;
  carAlarm: boolean;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CarInstanceResidentDetail extends CarInstanceResident {
  carInstance?: CarInstance;
  resident?: Resident;
}

export interface CarResidentWithDetails {
  id: number;
  carInstanceId: number;
  residentId: number;
  carAlarm: boolean;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  resident: {
    id: number;
    name: string;
    phone?: string | null;
    email?: string | null;
    birthDate?: string | null;
    gender?: 'M' | 'F' | null;
    emergencyContact?: string | null;
    memo?: string | null;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string | null;
    address1Depth: string;
    address2Depth: string;
    address3Depth?: string | null;
  };
}

export interface CarWithInstance extends Car {
  carInstance: CarInstance[];
}
// #endregion

// #region 요청 타입 정의
export interface CreateCarRequest {
  carNumber: string;
  brand?: string;
  model?: string;
  type?: string;
  outerText?: string;
  year?: number;
  externalSticker?: string;
  fuel?: string;
  frontImageUrl?: string;
  rearImageUrl?: string;
  sideImageUrl?: string;
  topImageUrl?: string;
}

export interface UpdateCarRequest {
  brand?: string;
  model?: string;
  type?: string;
  outerText?: string;
  year?: number;
  externalSticker?: string;
  fuel?: string;
  frontImageUrl?: string;
  rearImageUrl?: string;
  sideImageUrl?: string;
  topImageUrl?: string;
}

export interface CreateCarInstanceRequest {
  carNumber: string;
  instanceId: number;
  carShareOnoff?: boolean;
}

export interface UpdateCarInstanceRequest {
  carShareOnoff?: boolean;
}

export interface CreateCarInstanceResidentRequest {
  carInstanceId: number;
  residentId: number;
  carAlarm?: boolean;
  isPrimary?: boolean;
}

export interface UpdateCarInstanceResidentRequest {
  carAlarm?: boolean;
  isPrimary?: boolean;
}

export interface SearchCarParams {
  page?: number;
  limit?: number;
  carNumber?: string;
  brand?: string;
  model?: string;
  type?: string;
  fuel?: string;
  yearFrom?: string;
  yearTo?: string;
  instanceId?: number;
  residentId?: string;
  status?: string;
}

export interface SearchCarInstanceParams {
  page?: number;
  limit?: number;
}
// #endregion

// #region 응답 타입 정의
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ... existing code ...
export type CarListResponse = PaginatedResponse<CarWithInstance>;
export type CarInstanceListResponse = PaginatedResponse<CarInstanceResidentDetail>;
// ... existing code ...

// #endregion

// #region 보조 타입 정의 (다른 도메인 타입)
interface Instance {
  id: number;
  [key: string]: unknown;
}

interface Resident {
  id: number;
  [key: string]: unknown;
}
// #endregion