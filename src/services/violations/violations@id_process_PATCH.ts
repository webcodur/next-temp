'use client';
import { fetchDefault } from '@/services/fetchClient';
import {
	ProcessCarViolationRequest,
	CarViolation,
	CarViolationType,
	ViolationReporterType,
	ViolationStatus,
} from '@/types/carViolation';
import { getApiErrorMessage } from '@/utils/apiErrorMessages';

// #region 서버 타입 정의 (내부 사용)
interface ProcessCarViolationServerRequest {
	processing_note: string;
	status: string;
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
	client: ProcessCarViolationRequest
): ProcessCarViolationServerRequest {
	return {
		processing_note: client.processingNote,
		status: client.status,
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

export async function processViolation(
	id: number,
	data: ProcessCarViolationRequest
) {
	const serverRequest = clientToServer(data);
	const response = await fetchDefault(`/violations/${id}/process`, {
		method: 'PATCH',
		body: JSON.stringify(serverRequest),
	});

	const result = await response.json();

	if (!response.ok) {
		return { 
			success: false, 
			errorMsg: await getApiErrorMessage(result, response.status, 'processViolation'),
		};
	}

	const serverResponse = result as CarViolationServerResponse;
	return {
		success: true,
		data: serverToClient(serverResponse),
	};
}
