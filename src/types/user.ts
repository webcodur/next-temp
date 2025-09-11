// 주민 관리 타입 정의

// 기본 사용자 정보
export interface User {
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

// 사용자 생성 요청
export interface CreateUserRequest {
	name: string;
	phone?: string;
	email?: string;
	birthDate?: string;
	gender?: 'M' | 'F';
	emergencyContact?: string;
	memo?: string;
}

// 사용자 수정 요청
export interface UpdateUserRequest {
	name?: string;
	phone?: string;
	email?: string;
	birthDate?: string;
	gender?: 'M' | 'F';
	emergencyContact?: string;
	memo?: string;
}

// 사용자 검색 파라미터
export interface SearchUserParams {
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

// 사용자-인스턴스 관계 정보
export interface UserInstance {
	id: number;
	userId: number;
	instanceId: number;
	memo?: string | null;
	createdAt: string;
	updatedAt: string;
}

// 사용자-인스턴스 관계 생성 요청
export interface CreateUserInstanceRequest {
	userId: number;
	instanceId: number;
	memo?: string;
}

// 사용자-인스턴스 관계 수정 요청
export interface UpdateUserInstanceRequest {
	memo?: string;
}

// 사용자 인스턴스 이동 요청
export interface MoveUserRequest {
	userId: number;
	instanceId: number;
	memo?: string;
}

// 인스턴스 정보가 포함된 사용자-인스턴스 관계
export interface UserInstanceWithInstance extends UserInstance {
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

// 상세 사용자 정보 (관계 정보 포함)
export interface UserDetail extends User {
	userInstance: UserInstanceWithInstance[];
}

// 주소 정보가 포함된 사용자 (차량 연결 조회용)
export interface UserWithAddress extends User {
	address1Depth: string;
	address2Depth: string;
	address3Depth?: string | null;
	deletedAt?: string | null;
}

// 페이지네이션 응답
export interface PaginatedUserResponse {
	data: UserDetail[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}