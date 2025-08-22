'use client';
import { fetchDefault } from '@/services/fetchClient';
import {
	CreateCarViolationRequest,
	CarViolation,
	CarViolationType,
	ViolationReporterType,
	ViolationStatus,
} from '@/types/carViolation';

// #region 서버 타입 정의 (내부 사용)
interface CreateCarViolationServerRequest {
	car_number: string;
	violation_type: string;
	violation_code: string;
	violation_location?: string;
	violation_time: string;
	description?: string;
	evidence_image_urls?: string[];
	reporter_type?: string;
	reporter_id?: number;
	severity_level?: number;
	penalty_points?: number;
}

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
// #endregion

// #region 변환 함수 (내부 사용)
function clientToServer(
	client: CreateCarViolationRequest
): CreateCarViolationServerRequest {
	return {
		car_number: client.carNumber,
		violation_type: client.violationType,
		violation_code: client.violationCode,
		violation_location: client.violationLocation,
		violation_time: client.violationTime,
		description: client.description,
		evidence_image_urls: client.evidenceImageUrls,
		reporter_type: client.reporterType,
		reporter_id: client.reporterId,
		severity_level: client.severityLevel,
		penalty_points: client.penaltyPoints,
	};
}

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
		evidenceImageUrls: Array.isArray(server.evidence_image_urls)
			? server.evidence_image_urls
			: undefined,
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
		car: server.car
			? {
					id: server.car.id,
					carNumber: server.car.car_number,
					brand: server.car.brand,
					model: server.car.model,
				}
			: undefined,
		registeredAdmin: server.registered_admin
			? {
					id: server.registered_admin.id,
					name: server.registered_admin.name,
					account: server.registered_admin.account,
				}
			: undefined,
		processorAdmin: server.processor_admin
			? {
					id: server.processor_admin.id,
					name: server.processor_admin.name,
					account: server.processor_admin.account,
				}
			: undefined,
	};
}
// #endregion

export async function createViolation(data: CreateCarViolationRequest) {
	const serverRequest = clientToServer(data);
	const response = await fetchDefault('/violations', {
		method: 'POST',
		body: JSON.stringify(serverRequest),
	});

	const result = await response.json();

	if (!response.ok) {
		const errorMsg =
			result.message || `차량 위반 기록 생성 실패(코드): ${response.status}`;

		return { success: false, errorMsg };
	}

	const serverResponse = result as CarViolationServerResponse;
	return {
		success: true,
		data: serverToClient(serverResponse),
	};
}
