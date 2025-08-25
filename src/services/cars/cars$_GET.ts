'use client';
import { fetchDefault } from '@/services/fetchClient';
import { SearchCarParams, CarListResponse, CarWithInstance } from '@/types/car';
import { getApiErrorMessage} from '@/utils/apiErrorMessages';

// 클라이언트 Instance 타입 정의 (CarInstance와 호환)
interface Instance {
	id: number;
	parkinglotId: number;
	name: string;
	ownerName?: string | null;
	address1Depth: string;
	address2Depth: string;
	address3Depth?: string | null;
	instanceType: string;
	password: string;
	memo?: string | null;
	createdAt: string;
	updatedAt: string;
	deletedAt?: string | null;
	[key: string]: unknown; // CarInstance 호환성을 위한 인덱스 시그니처
}

// 서버 Instance 타입 정의
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
}

// #region 서버 타입 정의 (내부 사용)
interface CarServerResponse {
	id: number;
	car_number: string;
	brand: string | null;
	model: string | null;
	type: string | null;
	outer_text: string | null;
	year: number | null;
	external_sticker: string | null;
	fuel: string | null;
	front_image_url: string | null;
	rear_image_url: string | null;
	side_image_url: string | null;
	top_image_url: string | null;
	created_at: string;
	updated_at: string;
}

interface CarInstanceServerResponse {
	id: number;
	car_number: string;
	instance_id: number;
	car_share_onoff: boolean;
	created_at: string;
	updated_at: string;
	car?: CarServerResponse;
	instance?: InstanceServerResponse;
}

interface CarWithInstanceServerResponse extends CarServerResponse {
	car_instance: CarInstanceServerResponse[];
}

interface PaginatedServerResponse {
	data: CarWithInstanceServerResponse[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}
// #endregion

// #region 변환 함수 (내부 사용)
function convertInstance(server: InstanceServerResponse): Instance {
	return {
		id: server.id,
		parkinglotId: server.parkinglot_id,
		name: server.name,
		ownerName: server.owner_name,
		address1Depth: server.address_1depth,
		address2Depth: server.address_2depth,
		address3Depth: server.address_3depth,
		instanceType: server.instance_type as string,
		password: server.password,
		memo: server.memo,
		createdAt: server.created_at,
		updatedAt: server.updated_at,
		deletedAt: server.deleted_at,
	};
}

function serverToClient(
	server: CarWithInstanceServerResponse
): CarWithInstance {
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
		carInstance: server.car_instance.map((instance) => ({
			id: instance.id,
			carNumber: instance.car_number,
			instanceId: instance.instance_id,
			carShareOnoff: instance.car_share_onoff,
			createdAt: instance.created_at,
			updatedAt: instance.updated_at,
			car: instance.car
				? {
						id: instance.car.id,
						carNumber: instance.car.car_number,
						brand: instance.car.brand,
						model: instance.car.model,
						type: instance.car.type,
						outerText: instance.car.outer_text,
						year: instance.car.year,
						externalSticker: instance.car.external_sticker,
						fuel: instance.car.fuel,
						frontImageUrl: instance.car.front_image_url,
						rearImageUrl: instance.car.rear_image_url,
						sideImageUrl: instance.car.side_image_url,
						topImageUrl: instance.car.top_image_url,
						createdAt: instance.car.created_at,
						updatedAt: instance.car.updated_at,
					}
				: undefined,
			instance: instance.instance
				? convertInstance(instance.instance)
				: undefined,
		})),
	};
}
// #endregion

export async function searchCars(
	params?: SearchCarParams,
	parkinglotId?: string
) {
	const searchParams = new URLSearchParams();

	if (params?.page) searchParams.append('page', params.page.toString());
	if (params?.limit) searchParams.append('limit', params.limit.toString());
	if (params?.carNumber) searchParams.append('car_number', params.carNumber);
	if (params?.brand) searchParams.append('brand', params.brand);
	if (params?.model) searchParams.append('model', params.model);
	if (params?.type) searchParams.append('type', params.type);
	if (params?.fuel) searchParams.append('fuel', params.fuel);
	if (params?.yearFrom) searchParams.append('year_from', params.yearFrom);
	if (params?.yearTo) searchParams.append('year_to', params.yearTo);
	if (params?.instanceId)
		searchParams.append('instance_id', params.instanceId.toString());
	if (params?.residentId) searchParams.append('resident_id', params.residentId);
	if (params?.status) searchParams.append('status', params.status);

	const headers: Record<string, string> = {};
	if (parkinglotId) {
		headers['x-parkinglot-id'] = parkinglotId;
	}

	const url = `/cars${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
	const response = await fetchDefault(url, {
		method: 'GET',
		headers,
	});

	const result = await response.json();

	if (!response.ok) {
		return { 
			success: false, 
			errorMsg: getApiErrorMessage('cars_search', result, response.status),
		};
	}

	const serverResponse = result as PaginatedServerResponse;
	const clientResponse: CarListResponse = {
		data: serverResponse.data.map(serverToClient),
		total: serverResponse.total,
		page: serverResponse.page,
		limit: serverResponse.limit,
		totalPages: serverResponse.totalPages,
	};

	return {
		success: true,
		data: clientResponse,
	};
}
