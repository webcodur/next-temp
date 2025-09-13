import {
	VehicleEntry,
	CarAllowType,
	ParkingBarrier,
	ParkingStats,
} from '@/types/parking';
import { formatToShortDateTime } from '@/utils/dateFormat';

// 언어별 차량 번호 생성 함수
const getCarNumbersByLocale = (): string[] => {
	// 브라우저 언어 감지 (useTranslations와 유사하게)
	const locale = typeof window !== 'undefined' 
		? (localStorage.getItem('preferred-locale') || navigator.language.split('-')[0] || 'ko')
		: 'ko';

	switch (locale) {
		case 'en':
			return [
				'ABC-1234',
				'DEF-5678', 
				'GHI-9012',
				'JKL-3456',
				'MNO-7890',
			];
		case 'ar':
			return [
				'أ ب ج-1234',
				'د هـ و-5678',
				'ز ح ط-9012', 
				'ي ك ل-3456',
				'م ن س-7890',
			];
		case 'ko':
		default:
			return [
				'16로2062',
				'31서8438',
				'110서8460',
				'04허6076',
				'40국0121',
			];
	}
};

// 차량 유형 매핑 데이터
// 언어팩 키: 주차_차량유형_* 시리즈
export const carAllowTypes: CarAllowType[] = [
	{ sub_type: 1, name: '입주차' }, // t('주차_차량유형_입주차')
	{ sub_type: 2, name: '정기권차' }, // t('주차_차량유형_정기권차')
	{ sub_type: 3, name: '방문차' }, // t('주차_차량유형_방문차')
	{ sub_type: 4, name: '임대차' }, // t('주차_차량유형_임대차')
	{ sub_type: 5, name: '업무차' }, // t('주차_차량유형_업무차')
	{ sub_type: 6, name: '미등록' }, // t('주차_차량유형_미등록')
	{ sub_type: 7, name: '상가차' }, // t('주차_차량유형_상가차')
	{ sub_type: 8, name: '발권차량' }, // t('주차_차량유형_발권차량')
	{ sub_type: 9, name: '입주차(차감)' }, // t('주차_차량유형_입주차차감')
	{ sub_type: 99, name: '오인식' }, // t('주차_차량유형_오인식')
	{ sub_type: 100, name: '미인식 차량' }, // t('주차_차량유형_미인식차량')
	{ sub_type: 101, name: '개인 이동수단' }, // t('주차_차량유형_개인이동수단')
];

// 차량 유형 파싱 함수 (기존 호환성 유지)
export const parseCarAllowType = (type: number): string => {
	const carType = carAllowTypes.find((t) => t.sub_type === type);
	return carType?.name || '미분류'; // t('주차_차량유형_미분류')
};

// 차량 유형을 다국어 키로 반환하는 함수
export const parseCarAllowTypeKey = (type: number): string => {
	const keyMap: { [key: number]: string } = {
		1: '주차_차량유형_입주차',
		2: '주차_차량유형_정기권차',
		3: '주차_차량유형_방문차',
		4: '주차_차량유형_임대차',
		5: '주차_차량유형_업무차',
		6: '주차_차량유형_미등록',
		7: '주차_차량유형_상가차',
		8: '주차_차량유형_발권차량',
		9: '주차_차량유형_입주차차감',
		99: '주차_차량유형_오인식',
		100: '주차_차량유형_미인식차량',
		101: '주차_차량유형_개인이동수단',
	};
	return keyMap[type] || '주차_차량유형_미분류';
};

// 통행입구명을 다국어 키로 반환하는 함수
export const parseDeviceNameKey = (deviceName: string): string => {
	const keyMap: { [key: string]: string } = {
		'입구A': '주차_필터_입구A',
		'입구B': '주차_필터_입구B',
		'출구A': '주차_필터_출구A',
		'출구B': '주차_필터_출구B',
	};
	return keyMap[deviceName] || deviceName; // 매핑되지 않은 경우 원본 반환
};

// 모든 차량 타입에 대해 통일된 메탈릭 번호판 사용 (레거시 지원용)
export const getPlateTypeByCarType = () => {
	// 더 이상 사용하지 않지만 호환성을 위해 유지
	return 'metallic';
};

// Mock 입출차 데이터 생성
export const generateMockVehicleEntries = (count: number): VehicleEntry[] => {
	const mockData: VehicleEntry[] = [];
	const carNumbers = getCarNumbersByLocale();
	// 실제 다국어 키는 주차_필터_입구A, 주차_필터_입구B, 주차_필터_출구A, 주차_필터_출구B
	const deviceNames = ['입구A', '입구B', '출구A', '출구B'];

	for (let i = 0; i < count; i++) {
		const isEntry = Math.random() > 0.5;
		// 다양한 차량 타입을 고르게 생성 (흰색 번호판 타입 포함)
		const carTypes = [1, 2, 3, 4, 5, 7, 8, 9, 6, 99, 100, 101];
		const carType = carTypes[Math.floor(Math.random() * carTypes.length)];
		const baseTime = new Date();
		baseTime.setHours(baseTime.getHours() - Math.floor(Math.random() * 12));

		mockData.push({
			id: Date.now() + Math.random() * 10000 + i,
			status: isEntry ? 1 : 2,
			car_number: carNumbers[Math.floor(Math.random() * carNumbers.length)],
			type: carType,
			device_name: deviceNames[Math.floor(Math.random() * deviceNames.length)],
			use_time: formatToShortDateTime(baseTime),
			address_1depth:
				carType === 1 ? `${Math.floor(Math.random() * 20) + 1}동` : undefined,
			address_2depth:
				carType === 1 ? `${Math.floor(Math.random() * 50) + 1}호` : undefined,
			is_black: 'N',
		});
	}

	return mockData;
};

// Mock 차단기 데이터 (다국어 키로 구성)
// 언어팩 키: 주차_차단기_* 시리즈
export const mockBarriers: ParkingBarrier[] = [
	{
		id: 'barrier-01',
		name: '주차_차단기_정문1', // 다국어 키로 변경
		isOpen: false,
		operationMode: 'auto-operation',
	},
	{
		id: 'barrier-02',
		name: '주차_차단기_정문2', // 다국어 키로 변경
		isOpen: true,
		operationMode: 'auto-operation',
	},
	{
		id: 'barrier-03',
		name: '주차_차단기_후문1', // 다국어 키로 변경
		isOpen: false,
		operationMode: 'always-open',
	},
	{
		id: 'barrier-04',
		name: '주차_차단기_후문2', // 다국어 키로 변경
		isOpen: false,
		operationMode: 'bypass',
	},
];

// Mock 통계 데이터
export const mockParkingStats: ParkingStats = {
	total_count: 150,
	in_count: 82,
	out_count: 68,
};
