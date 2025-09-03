'use client';
import { fetchDefault } from '@/services/fetchClient';
import { CreateParkingDeviceRequest, ParkingDevice } from '@/types/device';
import { getApiErrorMessage } from '@/utils/apiErrorMessages';

// #region 서버 타입 정의 (내부 사용)
interface CreateParkingDeviceServerRequest {
	name: string;
	ip: string;
	port: string;
	server_port?: string;
	cctv_url: string;
	status?: number;
	device_type?: number;
	is_ticketing?: string;
	is_receipting?: string;
	representative_phone?: string;
	sequence?: number;
	user_permission?: number;
	regular_permission?: number;
	visitor_permission?: number;
	temp_permission?: number;
	business_permission?: number;
	commercial_permission?: number;
	taxi_permission?: number;
	ticket_machine_permission?: number;
	unregistered_permission?: number;
}

interface ParkingDeviceServerResponse {
	id: number;
	parkinglot_id: number;
	name: string;
	ip: string;
	port: string;
	server_port?: string | null;
	cctv_url: string;
	status: number;
	device_type: number;
	is_ticketing?: string | null;
	is_receipting?: string | null;
	representative_phone?: string | null;
	sequence: number;
	user_permission?: number | null;
	regular_permission?: number | null;
	visitor_permission?: number | null;
	temp_permission?: number | null;
	business_permission?: number | null;
	commercial_permission?: number | null;
	taxi_permission?: number | null;
	ticket_machine_permission?: number | null;
	unregistered_permission?: number | null;
	created_at?: string | null;
	updated_at?: string | null;
}
// #endregion

// #region 변환 함수 (내부 사용)
function clientToServer(
	client: CreateParkingDeviceRequest
): CreateParkingDeviceServerRequest {
	return {
		name: client.name,
		ip: client.ip,
		port: client.port,
		server_port: client.serverPort,
		cctv_url: client.cctvUrl,
		status: client.status,
		device_type: client.deviceType,
		is_ticketing: client.isTicketing,
		is_receipting: client.isReceipting,
		representative_phone: client.representativePhone,
		sequence: client.sequence,
		user_permission: client.userPermission,
		regular_permission: client.regularPermission,
		visitor_permission: client.visitorPermission,
		temp_permission: client.tempPermission,
		business_permission: client.businessPermission,
		commercial_permission: client.commercialPermission,
		taxi_permission: client.taxiPermission,
		ticket_machine_permission: client.ticketMachinePermission,
		unregistered_permission: client.unregisteredPermission,
	};
}

function serverToClient(server: ParkingDeviceServerResponse): ParkingDevice {
	return {
		id: server.id,
		parkinglotId: server.parkinglot_id,
		name: server.name,
		ip: server.ip,
		port: server.port,
		serverPort: server.server_port,
		cctvUrl: server.cctv_url,
		status: server.status,
		deviceType: server.device_type,
		isTicketing: server.is_ticketing,
		isReceipting: server.is_receipting,
		representativePhone: server.representative_phone,
		sequence: server.sequence,
		userPermission: server.user_permission,
		regularPermission: server.regular_permission,
		visitorPermission: server.visitor_permission,
		tempPermission: server.temp_permission,
		businessPermission: server.business_permission,
		commercialPermission: server.commercial_permission,
		taxiPermission: server.taxi_permission,
		ticketMachinePermission: server.ticket_machine_permission,
		unregisteredPermission: server.unregistered_permission,
		createdAt: server.created_at ? new Date(server.created_at) : null,
		updatedAt: server.updated_at ? new Date(server.updated_at) : null,
	};
}
// #endregion

export async function createParkingDevice(data: CreateParkingDeviceRequest) {
	const serverRequest = clientToServer(data);
	const response = await fetchDefault('/devices', {
		method: 'POST',
		body: JSON.stringify(serverRequest),
	});

	const result = await response.json();

	if (!response.ok) {
		return {
			success: false,
			errorMsg: await getApiErrorMessage(
				result,
				response.status,
				'createParkingDevice'
			),
		};
	}

	const serverResponse = result as ParkingDeviceServerResponse;
	return {
		success: true,
		data: serverToClient(serverResponse),
	};
}
