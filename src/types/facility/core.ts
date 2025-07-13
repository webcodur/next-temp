// 시설별 좌석 예약 시스템 핵심 데이터 타입

export type SeatStatus = 'available' | 'occupied' | 'reserved' | 'disabled';

export type ObjectType = 'seat' | 'space' | 'object';

export interface SeatData {
	type: 'seat';
	id: string;
	name: string;
	size: { width: number; height: number };
	status: SeatStatus;
	reservable: boolean;
	position: { x: number; y: number };
}

export interface SpaceData {
	type: 'space';
	id: string;
	size: { width: number; height: number };
	reservable: false;
	position: { x: number; y: number };
}

export interface ObjectData {
	type: 'object';
	id: string;
	name: string;
	size: { width: number; height: number };
	reservable: false;
	position: { x: number; y: number };
}

export type GridObject = SeatData | SpaceData | ObjectData;

export interface FacilityLayout {
	id: string;
	name: string;
	category: string;
	gridSize: { width: number; height: number };
	objects: GridObject[];
	cellSize: number; // 기본 40px
	createdAt: Date;
	updatedAt: Date;
}

export interface ReservationData {
	id: string;
	seatId: string;
	userId: string;
	startTime: Date;
	endTime: Date;
	status: 'active' | 'expired' | 'cancelled';
}

export interface FacilityStats {
	totalSeats: number;
	availableSeats: number;
	occupiedSeats: number;
	reservedSeats: number;
	disabledSeats: number;
}

export interface GridCell {
	x: number;
	y: number;
	objectId?: string;
	isOccupied: boolean;
}

export interface SeatMapProps {
	layout: FacilityLayout;
	selectedSeat?: string;
	onSeatSelect?: (seatId: string) => void;
	readonly?: boolean;
}
