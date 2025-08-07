'use client';
import { fetchDefault } from '@/services/fetchClient';
import { SearchCarViolationRequest, PagedCarViolations, CarViolation, PageMeta, CarViolationType, ViolationReporterType, ViolationStatus } from '@/types/carViolation';

// #region 서버 타입 정의 (내부 사용)
interface CarViolationServerResponse {
  id: number;
  parkinglot_id?: number;
  car_id?: number;
  car_number: string;
  violation_type: string;
  violation_code: string;
  violation_location?: string;
  violation_time: string;
  description?: string;
  evidence_image_urls?: string[];
  reporter_type: string;
  reporter_id?: number;
  severity_level: number;
  penalty_points: number;
  is_processed: boolean;
  processed_at?: string;
  processed_by?: number;
  processing_note?: string;
  status: string;
  created_at: string;
  updated_at: string;
  is_blacklisted?: boolean;
  car?: {
    id: number;
    car_number: string;
    brand?: string;
    model?: string;
  };
  registered_admin?: {
    id: number;
    name?: string;
    account: string;
  };
  processor_admin?: {
    id: number;
    name?: string;
    account: string;
  };
}

interface PageMetaServerResponse {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

interface PagedCarViolationsServerResponse {
  data: CarViolationServerResponse[];
  meta: PageMetaServerResponse;
}
// #endregion

// #region 변환 함수 (내부 사용)
function serverToClient(server: CarViolationServerResponse): CarViolation {
  return {
    id: server.id,
    parkinglotId: server.parkinglot_id,
    carId: server.car_id,
    carNumber: server.car_number,
    violationType: server.violation_type as CarViolationType,
    violationCode: server.violation_code,
    violationLocation: server.violation_location,
    violationTime: server.violation_time,
    description: server.description,
    evidenceImageUrls: server.evidence_image_urls,
    reporterType: server.reporter_type as ViolationReporterType,
    reporterId: server.reporter_id,
    severityLevel: server.severity_level,
    penaltyPoints: server.penalty_points,
    isProcessed: server.is_processed,
    processedAt: server.processed_at,
    processedBy: server.processed_by,
    processingNote: server.processing_note,
    status: server.status as ViolationStatus,
    createdAt: server.created_at,
    updatedAt: server.updated_at,
    isAutoBlacklisted: server.is_blacklisted,
    car: server.car ? {
      id: server.car.id,
      carNumber: server.car.car_number,
      brand: server.car.brand,
      model: server.car.model,
    } : undefined,
    registeredAdmin: server.registered_admin ? {
      id: server.registered_admin.id,
      name: server.registered_admin.name,
      account: server.registered_admin.account,
    } : undefined,
    processorAdmin: server.processor_admin ? {
      id: server.processor_admin.id,
      name: server.processor_admin.name,
      account: server.processor_admin.account,
    } : undefined,
  };
}

function serverMetaToClient(server: PageMetaServerResponse): PageMeta {
  return {
    page: server.page,
    limit: server.limit,
    total: server.total,
    totalPages: server.totalPages,
    hasPreviousPage: server.hasPreviousPage,
    hasNextPage: server.hasNextPage,
  };
}
// #endregion

export async function searchViolations(params?: SearchCarViolationRequest) {
  const searchParams = new URLSearchParams();
  
  // 쿼리 파라미터는 snake_case로 전송
  if (params?.carNumber) searchParams.append('car_number', params.carNumber);
  if (params?.violationType) searchParams.append('violation_type', params.violationType);
  if (params?.status) searchParams.append('status', params.status);
  if (params?.reporterType) searchParams.append('reporter_type', params.reporterType);
  if (params?.isProcessed !== undefined) searchParams.append('is_processed', params.isProcessed.toString());
  if (params?.violationTimeFrom) searchParams.append('violation_time_from', params.violationTimeFrom);
  if (params?.violationTimeTo) searchParams.append('violation_time_to', params.violationTimeTo);
  if (params?.page) searchParams.append('page', params.page.toString());
  if (params?.limit) searchParams.append('limit', params.limit.toString());

  const url = `/violations${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
  const response = await fetchDefault(url, {
    method: 'GET',
  });

  const result = await response.json();
  
  if (!response.ok) {
    const errorMsg = result.message || `차량 위반 기록 목록 조회 실패(코드): ${response.status}`;
    console.log(errorMsg);
    return { success: false, errorMsg };
  }
  
  const serverResponse = result as PagedCarViolationsServerResponse;
  const pagedData: PagedCarViolations = {
    data: serverResponse.data.map(serverToClient),
    meta: serverMetaToClient(serverResponse.meta),
  };
  
  return {
    success: true,
    data: pagedData,
  };
}