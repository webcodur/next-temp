'use client';
import { fetchDefault } from '@/services/fetchClient';
import {
	SearchInstanceParams,
	PaginatedInstanceResponse,
	Instance,
	ENUM_InstanceType,
	InstanceServiceConfig,
	InstanceVisitConfig,
	ResidentInstanceWithResident,
	CarInstanceWithCar,
} from '@/types/instance';

// #region 서버 타입 정의 (내부 사용)
interface InstanceServiceConfigServer {
	id: number;
	instance_id: number;
	can_add_new_resident: boolean;
	is_common_entrance_subscribed: boolean;
	is_temporary_access: boolean;
	temp_car_limit: number;
	created_at: string;
	updated_at: string;
	deleted_at?: string | null;
}

interface InstanceVisitConfigServer {
	id: number;
	instance_id: number;
	available_visit_time: number;
	purchased_visit_time: number;
	visit_request_limit: number;
	created_at: string;
	updated_at: string;
	deleted_at?: string | null;
}

interface ResidentServer {
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

interface ResidentInstanceServer {
	id: number;
	resident_id: number;
	instance_id: number;
	memo?: string | null;
	status: string;
	created_at: string;
	updated_at: string;
	deleted_at?: string | null;
	resident: ResidentServer;
}

interface CarServer {
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

interface CarInstanceServer {
	id: number;
	car_id: number;
	instance_id: number;
	car_share_onoff: boolean;
	created_at: string;
	updated_at: string;
	deleted_at?: string | null;
	car: CarServer;
}

interface InstanceServerResponse {
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
	resident_count?: number;
	car_count?: number;
	instance_service_config?: InstanceServiceConfigServer | null;
	instance_visit_config?: InstanceVisitConfigServer | null;
	resident_instance?: ResidentInstanceServer[];
	car_instance?: CarInstanceServer[];
}

interface PaginatedInstanceServerResponse {
	data: InstanceServerResponse[];
	meta: {
		total_items: number;
		current_page: number;
		items_per_page: number;
		total_pages: number;
	};
}
// #endregion

// #region 변환 함수 (내부 사용)
function convertInstanceServiceConfig(
	server: InstanceServiceConfigServer
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
		deletedAt: server.deleted_at,
	};
}

function convertInstanceVisitConfig(
	server: InstanceVisitConfigServer
): InstanceVisitConfig {
	return {
		id: server.id,
		instanceId: server.instance_id,
		availableVisitTime: server.available_visit_time,
		purchasedVisitTime: server.purchased_visit_time,
		visitRequestLimit: server.visit_request_limit,
		createdAt: server.created_at,
		updatedAt: server.updated_at,
		deletedAt: server.deleted_at,
	};
}

function convertResident(server: ResidentServer) {
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

function convertResidentInstance(
	server: ResidentInstanceServer
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
		resident: convertResident(server.resident),
	};
}

function convertCar(server: CarServer) {
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

function convertCarInstance(server: CarInstanceServer): CarInstanceWithCar {
	return {
		id: server.id,
		carId: server.car_id,
		instanceId: server.instance_id,
		carShareOnoff: server.car_share_onoff,
		createdAt: server.created_at,
		updatedAt: server.updated_at,
		deletedAt: server.deleted_at,
		car: convertCar(server.car),
	};
}

function serverToClient(server: InstanceServerResponse): Instance {
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
		residentCount: server.resident_count,
		carCount: server.car_count,
		instanceServiceConfig: server.instance_service_config
			? convertInstanceServiceConfig(server.instance_service_config)
			: null,
		instanceVisitConfig: server.instance_visit_config
			? convertInstanceVisitConfig(server.instance_visit_config)
			: null,
		residentInstance: server.resident_instance?.map(convertResidentInstance),
		carInstance: server.car_instance?.map(convertCarInstance),
	};
}

function paginatedServerToClient(
	server: PaginatedInstanceServerResponse
): PaginatedInstanceResponse {
	return {
		data: server.data.map(serverToClient),
		total: server.meta.total_items,
		page: server.meta.current_page,
		limit: server.meta.items_per_page,
		totalPages: server.meta.total_pages,
	};
}
// #endregion

export async function searchInstances(params?: SearchInstanceParams) {
	const searchParams = new URLSearchParams();

	if (params?.page) searchParams.append('page', params.page.toString());
	if (params?.limit) searchParams.append('limit', params.limit.toString());
	if (params?.instanceType)
		searchParams.append('instance_type', params.instanceType);
	if (params?.address1Depth)
		searchParams.append('address_1depth', params.address1Depth);
	if (params?.address2Depth)
		searchParams.append('address_2depth', params.address2Depth);
	if (params?.address3Depth)
		searchParams.append('address_3depth', params.address3Depth);
	if (params?.instanceId)
		searchParams.append('instance_id', params.instanceId.toString());
	if (params?.instanceName)
		searchParams.append('instance_name', params.instanceName);

	const queryString = searchParams.toString();
	const url = queryString ? `/instances?${queryString}` : '/instances';

	const response = await fetchDefault(url, {
		method: 'GET',
	});

	const result = await response.json();

	if (!response.ok) {
		return { 
			success: false, 
			errorMsg: await getApiErrorMessage(result, response.status, 'searchInstances'),
		};
	}

	const serverResponse = result as PaginatedInstanceServerResponse;
	return {
		success: true,
		data: paginatedServerToClient(serverResponse),
	};
}
