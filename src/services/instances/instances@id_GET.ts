'use client';
import { fetchDefault } from '@/services/fetchClient';
import {
	InstanceDetail,
	InstanceServiceConfig,
	InstanceVisitConfig,
	ENUM_InstanceType,
	CarInstanceWithCar,
	ResidentInstanceWithResident,
} from '@/types/instance';
import { getApiErrorMessage } from '@/utils/apiErrorMessages';

// #region 서버 타입 정의 (내부 사용)
interface InstanceServiceConfigServerResponse {
	id: number;
	instance_id: number;
	can_add_new_resident: boolean;
	is_common_entrance_subscribed: boolean;
	is_temporary_access: boolean;
	temp_car_limit: number;
	created_at: string;
	updated_at: string;
}

interface InstanceVisitConfigServerResponse {
	id: number;
	instance_id: number;
	available_visit_time: number;
	purchased_visit_time: number;
	visit_request_limit: number;
	created_at: string;
	updated_at: string;
}

interface ResidentServerResponse {
	id: number;
	name: string;
	phone: string;
	email: string;
	birth_date: string;
	gender: string;
	emergency_contact: string;
	memo?: string | null;
	created_at: string;
	updated_at: string;
	deleted_at?: string | null;
}

interface ResidentInstanceServerResponse {
	id: number;
	resident_id: number;
	instance_id: number;
	memo?: string | null;
	status: string;
	created_at: string;
	updated_at: string;
	deleted_at?: string | null;
	resident: ResidentServerResponse;
}

interface CarServerResponse {
	id: number;
	car_number: string;
	brand: string;
	model: string;
	type: string;
	outer_text: string;
	year: number;
	external_sticker?: string | null;
	fuel: string;
	front_image_url?: string | null;
	rear_image_url?: string | null;
	side_image_url?: string | null;
	top_image_url?: string | null;
	created_at: string;
	updated_at: string;
	deleted_at?: string | null;
}

interface CarInstanceServerResponse {
	id: number;
	car_id: number;
	instance_id: number;
	car_share_onoff: boolean;
	created_at: string;
	updated_at: string;
	deleted_at?: string | null;
	car: CarServerResponse;
}

interface InstanceDetailServerResponse {
	id: number;
	parkinglot_id: number;
	name: string;
	owner_name?: string | null;
	address_1depth: string;
	address_2depth: string;
	address_3depth?: string | null;
	instance_type: string;
	password: string;
	memo?: string | null;
	created_at: string;
	updated_at: string;
	deleted_at?: string | null;
	resident_instance: ResidentInstanceServerResponse[];
	car_instance?: CarInstanceServerResponse[];
	instance_service_config?: InstanceServiceConfigServerResponse | null;
	instance_visit_config?: InstanceVisitConfigServerResponse | null;
}
// #endregion

// #region 변환 함수 (내부 사용)
function serviceConfigServerToClient(
	server: InstanceServiceConfigServerResponse
): InstanceServiceConfig {
	return {
		id: server.id,
		instanceId: server.instance_id,
		canAddNewResident: server.can_add_new_resident,
		isCommonEntranceSubscribed: server.is_common_entrance_subscribed,
		isTemporaryAccess: server.is_temporary_access,
		tempCarLimit: server.temp_car_limit,
		createdAt: server.created_at,
		updatedAt: server.updated_at,
	};
}

function visitConfigServerToClient(
	server: InstanceVisitConfigServerResponse
): InstanceVisitConfig {
	return {
		id: server.id,
		instanceId: server.instance_id,
		availableVisitTime: server.available_visit_time,
		purchasedVisitTime: server.purchased_visit_time,
		visitRequestLimit: server.visit_request_limit,
		createdAt: server.created_at,
		updatedAt: server.updated_at,
	};
}

function residentServerToClient(server: ResidentServerResponse) {
	return {
		id: server.id,
		name: server.name,
		phone: server.phone,
		email: server.email,
		birthDate: server.birth_date,
		gender: server.gender,
		emergencyContact: server.emergency_contact,
		memo: server.memo,
		createdAt: server.created_at,
		updatedAt: server.updated_at,
		deletedAt: server.deleted_at,
	};
}

function residentInstanceServerToClient(
	server: ResidentInstanceServerResponse
): ResidentInstanceWithResident {
	return {
		id: server.id,
		residentId: server.resident_id,
		instanceId: server.instance_id,
		memo: server.memo,
		status: server.status,
		createdAt: server.created_at,
		updatedAt: server.updated_at,
		deletedAt: server.deleted_at,
		resident: residentServerToClient(server.resident),
	};
}

function carServerToClient(server: CarServerResponse) {
	return {
		id: server.id,
		carNumber: server.car_number,
		brand: server.brand,
		model: server.model,
		type: server.type,
		outerText: server.outer_text,
		year: server.year,
		externalSticker: server.external_sticker,
		fuel: server.fuel,
		frontImageUrl: server.front_image_url,
		rearImageUrl: server.rear_image_url,
		sideImageUrl: server.side_image_url,
		topImageUrl: server.top_image_url,
		createdAt: server.created_at,
		updatedAt: server.updated_at,
		deletedAt: server.deleted_at,
	};
}

function carInstanceServerToClient(
	server: CarInstanceServerResponse
): CarInstanceWithCar {
	return {
		id: server.id,
		carId: server.car_id,
		instanceId: server.instance_id,
		carShareOnoff: server.car_share_onoff,
		createdAt: server.created_at,
		updatedAt: server.updated_at,
		deletedAt: server.deleted_at,
		car: carServerToClient(server.car),
	};
}

function serverToClient(server: InstanceDetailServerResponse): InstanceDetail {
	return {
		id: server.id,
		parkinglotId: server.parkinglot_id,
		name: server.name,
		ownerName: server.owner_name,
		address1Depth: server.address_1depth,
		address2Depth: server.address_2depth,
		address3Depth: server.address_3depth,
		instanceType: server.instance_type as ENUM_InstanceType,
		password: server.password,
		memo: server.memo,
		createdAt: server.created_at,
		updatedAt: server.updated_at,
		deletedAt: server.deleted_at,
		residentInstance:
			server.resident_instance?.map(residentInstanceServerToClient) || [],
		carInstance: server.car_instance?.map(carInstanceServerToClient) || [],
		instanceServiceConfig: server.instance_service_config
			? serviceConfigServerToClient(server.instance_service_config)
			: null,
		instanceVisitConfig: server.instance_visit_config
			? visitConfigServerToClient(server.instance_visit_config)
			: null,
	};
}
// #endregion

export async function getInstanceDetail(id: number) {
	const response = await fetchDefault(`/instances/${id}`, {
		method: 'GET',
	});

	const result = await response.json();

	if (!response.ok) {
		return { 
			success: false, 
			errorMsg: getApiErrorMessage('instances_detail', result, response.status),
		};
	}

	const serverResponse = result as InstanceDetailServerResponse;
	return {
		success: true,
		data: serverToClient(serverResponse),
	};
}
