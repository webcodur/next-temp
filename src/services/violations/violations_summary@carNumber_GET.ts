'use client';
import { fetchDefault } from '@/services/fetchClient';
import { CarViolationSummary, CarViolationType } from '@/types/carViolation';

// #region 서버 타입 정의 (내부 사용)
interface CarViolationSummaryServerResponse {
  car_number: string;
  total_violations: number;
  total_penalty_points: number;
  last_violation_time?: string;
  most_serious_violation?: string;
  risk_level: number;
}
// #endregion

// #region 변환 함수 (내부 사용)
function serverToClient(server: CarViolationSummaryServerResponse): CarViolationSummary {
  return {
    carNumber: server.car_number,
    totalViolations: server.total_violations,
    totalPenaltyPoints: server.total_penalty_points,
    lastViolationTime: server.last_violation_time,
    mostSeriousViolation: server.most_serious_violation as CarViolationType,
    riskLevel: server.risk_level,
  };
}
// #endregion

export async function getViolationSummary(carNumber: string) {
  const response = await fetchDefault(`/violations/summary/${encodeURIComponent(carNumber)}`, {
    method: 'GET',
  });

  const result = await response.json();
  
  if (!response.ok) {
    const errorMsg = result.message || `차량 위반 요약 조회 실패(코드): ${response.status}`;
    console.log(errorMsg);
    return { success: false, errorMsg };
  }
  
  const serverResponse = result as CarViolationSummaryServerResponse;
  return {
    success: true,
    data: serverToClient(serverResponse),
  };
}