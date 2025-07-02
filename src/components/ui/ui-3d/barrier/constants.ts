export type ViewAngle = 'diagonal' | 'driver' | 'security';
export type OperationMode = 'always-open' | 'auto-operation' | 'bypass';

export interface ParkingBarrier3DProps {
	width?: number;
	height?: number;
	isOpen?: boolean;
	onToggle?: () => void;
	showControls?: boolean;
	className?: string;
	animationDuration?: number;
	viewAngle?: ViewAngle;
	operationMode?: OperationMode;
	onOperationModeChange?: (mode: OperationMode) => void;
}

export const COLORS = {
	BACKGROUND: 0xf5f7fa,
	GROUND: 0xe8ecf0,
	ROAD_LINE: 0xffffff,
	ROAD_ASPHALT: 0xb8bcc4, // 도로를 중간 회색으로 (가장 어두움)
	CURB: 0xd1d5db, // 중앙분리대를 중간 밝기 회색으로
	BARRIER_BODY: 0xe8ecf0, // 차단기 몸체를 가장 밝은 회색으로
	ARM_OPEN: 0x10b981, // 부드러운 에메랄드 그린
	ARM_CLOSED: 0xef4444, // 부드러운 레드
	LED_OPEN: 0x10b981, // 부드러운 에메랄드 그린
	LED_CLOSED: 0xef4444, // 부드러운 레드
	LED_EMISSIVE_OPEN: 0x065f46, // 어두운 에메랄드
	LED_EMISSIVE_CLOSED: 0x991b1b, // 어두운 레드
} as const;

export const CAMERA_POSITIONS: Record<
	ViewAngle,
	{
		position: readonly [number, number, number];
		lookAt: readonly [number, number, number];
	}
> = {
	diagonal: {
		position: [3.5, 3.5, 3.5], // 기본 대각선 시점
		lookAt: [0, 1.5, 0],
	},
	driver: {
		position: [1, 1.5, 4], // 운전자 시점
		lookAt: [0, 2, 0],
	},
	security: {
		position: [4, 5, 2], // 보안 카메라 시점
		lookAt: [0, 1.5, 0],
	},
} as const;

export const POSITIONS = {
	CAMERA: [3.5, 3.5, 3.5] as const, // 기본값 (diagonal과 동일)
	CAMERA_LOOK_AT: [0, 1.5, 0] as const,
	MEDIAN_STRIP: [0, 0.1, 0] as const,
	BARRIER_BODY: [0, 1.4, 0] as const,
	LED: [0, 2.2, 0.2] as const,
	ARM_GROUP: [0, 2.4, -0.2] as const,
	ARM: [1.5, 0, 0] as const,
	LIGHT: [10, 10, 5] as const,
} as const;

export const SIZES = {
	GROUND: [8, 6, 32, 24] as const,
	ROAD_LEFT: [3.6, 6, 1, 24] as const,
	ROAD_RIGHT: [3.6, 6, 1, 24] as const,
	MEDIAN_STRIP: [0.8, 0.2, 4, 8, 2, 16] as const, // 길이를 6에서 4로 줄임
	BARRIER_BODY: [0.4, 2.4, 0.4, 8, 24, 8] as const,
	LED: [0.1, 32, 32] as const,
	ARM: [3, 0.15, 0.15, 24, 2, 2] as const,
} as const;

export const SETTINGS = {
	SHADOW_MAP_SIZE: 8192, // 4096에서 8192로 증가하여 더 선명한 그림자
	AMBIENT_LIGHT_INTENSITY: 0.8,
	DIRECTIONAL_LIGHT_INTENSITY: 0.6,
	DEFAULT_ANIMATION_DURATION: 300,
} as const;

export const VIEW_ANGLE_NAMES: Record<ViewAngle, string> = {
	diagonal: '대각선 시점 (기본)',
	driver: '운전자 시점',
	security: '보안 카메라 시점',
} as const;

export const OPERATION_MODE_NAMES: Record<OperationMode, string> = {
	'always-open': '항시열림',
	'auto-operation': '자동운행',
	bypass: '바이패스',
} as const;

export const OPERATION_MODE_ICONS: Record<OperationMode, string> = {
	'always-open': 'CheckCircle', // 항상 열려있음을 의미하는 체크 아이콘
	'auto-operation': 'RotateCcw', // 자동 순환을 의미하는 회전 아이콘
	bypass: 'Zap', // 우회/빠른 통과를 의미하는 번개 아이콘
} as const;
