// 차량 위반 관련 타입 정의

// #region Enum Types
export type CarViolationType = 
  | 'UNAUTHORIZED_PARKING'
  | 'OVERTIME_PARKING'
  | 'RESERVED_SPOT_VIOLATION'
  | 'FIRE_LANE_PARKING'
  | 'DISABLED_SPOT_VIOLATION'
  | 'DOUBLE_PARKING'
  | 'BLOCKING_EXIT'
  | 'NO_PERMIT_PARKING'
  | 'EXPIRED_PERMIT'
  | 'SPEEDING'
  | 'NOISE_VIOLATION'
  | 'VANDALISM'
  | 'OTHER';

export type ViolationReporterType = 
  | 'SYSTEM'
  | 'ADMIN'
  | 'RESIDENT'
  | 'SECURITY';

export type ViolationStatus = 
  | 'ACTIVE'
  | 'PROCESSED'
  | 'DISMISSED'
  | 'APPEALED'
  | 'CANCELLED';
// #endregion

// #region Request Types
export interface CreateCarViolationRequest {
  carNumber: string;
  violationType: CarViolationType;
  violationCode: string;
  violationLocation?: string;
  violationTime: string;
  description?: string;
  evidenceImageUrls?: string[];
  reporterType?: ViolationReporterType;
  reporterId?: number;
  severityLevel?: number;
  penaltyPoints?: number;
}

export interface UpdateCarViolationRequest {
  description?: string;
  evidenceImageUrls?: string[];
  severityLevel?: number;
  penaltyPoints?: number;
  status?: ViolationStatus;
  processingNote?: string;
}

export interface ProcessCarViolationRequest {
  processingNote: string;
  status: ViolationStatus;
}

export interface SearchCarViolationRequest {
  carNumber?: string;
  violationType?: CarViolationType;
  status?: ViolationStatus;
  reporterType?: ViolationReporterType;
  isProcessed?: boolean;
  violationTimeFrom?: string;
  violationTimeTo?: string;
  page?: number;
  limit?: number;
}
// #endregion

// #region Response Types
export interface CarViolation {
  id: number;
  parkinglotId: number;
  carId?: number;
  carNumber: string;
  violationType: CarViolationType;
  violationCode: string;
  violationLocation?: string;
  violationTime: string;
  description?: string;
  evidenceImageUrls?: string[];
  reporterType: ViolationReporterType;
  reporterId?: number;
  severityLevel: number;
  penaltyPoints: number;
  isProcessed: boolean;
  processedAt?: string;
  processedBy?: number;
  processingNote?: string;
  status: ViolationStatus;
  createdAt: string;
  updatedAt: string;
  isAutoBlacklisted: boolean;
}

export interface CarViolationSummary {
  carNumber: string;
  totalViolations: number;
  totalPenaltyPoints: number;
  lastViolationTime?: string;
  mostSeriousViolation?: CarViolationType;
  riskLevel: number;
}

export interface PageMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface PagedCarViolations {
  data: CarViolation[];
  meta: PageMeta;
}
// #endregion