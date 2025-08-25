'use client';
import { fetchDefault } from '@/services/fetchClient';
import {
	UpdateInstanceRequest,
	Instance,
	ENUM_InstanceType,
} from '@/types/instance';
import { getApiErrorMessage } from '@/utils/apiErrorMessages';

// #region 서버 타입 정의 (내부 사용)
interface InstanceServerResponse {
	id: number;
	parkinglot_id: number;
	address_1depth: string;
	address_2depth: string;
	address_3depth?: string | null;
	instance_type: string;
	password: string;
	memo?: string | null;
	created_at: string;
	updated_at: string;
}

interface UpdateInstanceServerRequest {
	address_1depth?: string;
	address_2depth?: string;
	address_3depth?: string;
	instance_type?: string;
	password?: string;
	memo?: string;
}
// #endregion

// #region 변환 함수 (내부 사용)
function serverToClient(server: InstanceServerResponse): Instance {
	return {
		id: server.id,
		parkinglotId: server.parkinglot_id,
		name: '',
		ownerName: null,
		address1Depth: server.address_1depth,
		address2Depth: server.address_2depth,
		address3Depth: server.address_3depth,
		instanceType: server.instance_type as ENUM_InstanceType,
		password: server.password,
		memo: server.memo,
		createdAt: server.created_at,
		updatedAt: server.updated_at,
		deletedAt: null,
	};
}

function clientToServer(
	client: UpdateInstanceRequest
): UpdateInstanceServerRequest {
	return {
		address_1depth: client.address1Depth,
		address_2depth: client.address2Depth,
		address_3depth: client.address3Depth,
		instance_type: client.instanceType,
		password: client.password,
		memo: client.memo,
	};
}
// #endregion

export async function updateInstance(id: number, data: UpdateInstanceRequest) {
	const serverRequest = clientToServer(data);
	const response = await fetchDefault(`/instances/${id}`, {
		method: 'PUT',
		body: JSON.stringify(serverRequest),
	});

	const result = await response.json();

	if (!response.ok) {
		return { 
			success: false, 
			errorMsg: await getApiErrorMessage(result, response.status),
		};
	}

	const serverResponse = result as InstanceServerResponse;
	return {
		success: true,
		data: serverToClient(serverResponse),
	};
}
