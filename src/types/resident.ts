// 거주자 관리 타입 정의

// 기본 거주자 정보
export interface Resident {
	id: number;
	name: string;
	phone?: string | null;
	email?: string | null;
	birthDate?: string | null;
	gender?: 'M' | 'F' | null;
	emergencyContact?: string | null;
	memo?: string | null;
	createdAt: string;
	updatedAt: string;
}

// 거주자 생성 요청
export interface CreateResidentRequest {
	name: string;
	phone?: string;
	email?: string;
	birthDate?: string;
	gender?: 'M' | 'F';
	emergencyContact?: string;
	memo?: string;
}

// 거주자 수정 요청
export interface UpdateResidentRequest {
	name?: string;
	phone?: string;
	email?: string;
	birthDate?: string;
	gender?: 'M' | 'F';
	emergencyContact?: string;
	memo?: string;
}

// 거주자 검색 파라미터
export interface SearchResidentParams {
	page?: number;
	limit?: number;
	name?: string;
	phone?: string;
	email?: string;
	gender?: 'M' | 'F';
	address1Depth?: string;
	address2Depth?: string;
	address3Depth?: string;
}

// 거주자-인스턴스 관계 정보
export interface ResidentInstance {
	id: number;
	residentId: number;
	instanceId: number;
	memo?: string | null;
	createdAt: string;
	updatedAt: string;
}

// 거주자-인스턴스 관계 생성 요청
export interface CreateResidentInstanceRequest {
	residentId: number;
	instanceId: number;
	memo?: string;
}

// 거주자-인스턴스 관계 수정 요청
export interface UpdateResidentInstanceRequest {
	memo?: string;
}

// 거주자 인스턴스 이동 요청
export interface MoveResidentRequest {
	residentId: number;
	instanceId: number;
	memo?: string;
}

// 인스턴스 정보가 포함된 거주자-인스턴스 관계
export interface ResidentInstanceWithInstance extends ResidentInstance {
	instance: {
		id: number;
		parkinglotId: number;
		address1Depth: string;
		address2Depth: string;
		address3Depth?: string | null;
		instanceType: string;
		memo?: string | null;
		createdAt: string;
		updatedAt: string;
	} | null;
}

// 상세 거주자 정보 (관계 정보 포함)
export interface ResidentDetail extends Resident {
	residentInstance: ResidentInstanceWithInstance[];
}

// 페이지네이션 응답
export interface PaginatedResidentResponse {
	data: ResidentDetail[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}
