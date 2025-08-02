import { Household } from './household';

// #region 기본 타입
export interface Instance {
  id: number;
  householdId: number;
  instanceName?: string;
  password: string;
  startDate?: string;
  endDate?: string;
  memo?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  household?: Household;
  instances?: Instance[];
}

export interface ServiceConfig {
  id: number;
  instanceId: number;
  canAddNewResident: boolean;
  isCommonEntranceSubscribed: boolean;
  isTemporaryAccess: boolean;
  tempCarLimit: number;
  createdAt: string;
  updatedAt: string;
}

export interface VisitConfig {
  id: number;
  instanceId: number;
  availableVisitTime: number;
  purchasedVisitTime: number;
  visitRequestLimit: number;
  createdAt: string;
  updatedAt: string;
}
// #endregion

// #region 요청 타입
export interface SearchInstanceRequest {
  page?: number;
  limit?: number;
  householdId?: number;
  instanceName?: string;
}

export interface CreateInstanceRequest {
  householdId: number;
  instanceName?: string;
  password: string;
  startDate?: string;
  endDate?: string;
  memo?: string;
}

export interface UpdateInstanceRequest {
  instanceName?: string;
  password?: string;
  startDate?: string;
  endDate?: string;
  memo?: string;
}

export interface UpdateServiceConfigRequest {
  instanceId: number;
  canAddNewResident?: boolean;
  isCommonEntranceSubscribed?: boolean;
  isTemporaryAccess?: boolean;
  tempCarLimit?: number;
}

export interface UpdateVisitConfigRequest {
  availableVisitTime?: number;
  purchasedVisitTime?: number;
  visitRequestLimit?: number;
}
// #endregion

// #region 응답 타입
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
// #endregion

// #region 하위 호환성을 위한 Alias (점진적 마이그레이션)
export type HouseholdInstance = Instance;
export type SearchHouseholdInstanceRequest = SearchInstanceRequest;
export type CreateHouseholdInstanceRequest = CreateInstanceRequest;
export type UpdateHouseholdInstanceRequest = UpdateInstanceRequest;
export type HouseholdServiceConfig = ServiceConfig;
export type HouseholdVisitConfig = VisitConfig;
export type UpdateHouseholdServiceConfigRequest = UpdateServiceConfigRequest;
export type UpdateHouseholdVisitConfigRequest = UpdateVisitConfigRequest;
// #endregion