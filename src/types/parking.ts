// 차량 입출차 데이터 타입
export interface VehicleEntry extends Record<string, unknown> {
	id: number;
	status: 1 | 2; // 1: 입차, 2: 출차
	car_number: string;
	modify_car_number?: string;
	type: number; // 차량 유형 코드
	modify_car_type?: number;
	device_name?: string;
	use_time: string;
	address_1depth?: string;
	address_2depth?: string;
	is_black: 'Y' | 'N';
	entry_type?: string;
}

// 차량 유형 매핑
export interface CarAllowType {
	sub_type: number;
	name: string;
	parent_type?: number;
	deleted_at?: string | null;
}

// 차단기 운행 모드 타입
export type OperationMode = 'always-open' | 'auto-operation' | 'bypass';

// 차단기 데이터 타입
export interface ParkingBarrier {
	id: string;
	name: string;
	isOpen: boolean;
	operationMode: OperationMode;
}

// 검색 필터 타입
export interface SearchFilters {
	car_type?: string;
	in_out_status?: string;
	entrance_status?: string;
	keyword?: string;
}

// 주차장 통계 타입
export interface ParkingStats {
	total_count: number;
	in_count: number;
	out_count: number;
}
