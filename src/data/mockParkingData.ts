import {
	VehicleEntry,
	CarAllowType,
	ParkingBarrier,
	ParkingStats,
} from '@/types/parking';

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

// 차량 유형 파싱 함수
export const parseCarAllowType = (type: number): string => {
	const carType = carAllowTypes.find((t) => t.sub_type === type);
	return carType?.name || '미분류'; // t('주차_차량유형_미분류')
};

// 모든 차량 타입에 대해 통일된 메탈릭 번호판 사용 (레거시 지원용)
export const getPlateTypeByCarType = () => {
	// 더 이상 사용하지 않지만 호환성을 위해 유지
	return 'metallic';
};

// Mock 입출차 데이터 생성
export const generateMockVehicleEntries = (count: number): VehicleEntry[] => {
	const mockData: VehicleEntry[] = [];
	const carNumbers = [
		'16로2062',
		'31서8438',
		'110서8460',
		'04허6076',
		'40국0121',
	];
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
			use_time: baseTime.toLocaleString('ko-KR'),
			address_1depth:
				carType === 1 ? `${Math.floor(Math.random() * 20) + 1}동` : undefined,
			address_2depth:
				carType === 1 ? `${Math.floor(Math.random() * 50) + 1}호` : undefined,
			is_black: 'N',
		});
	}

	return mockData;
};

// Mock 차단기 데이터
// 언어팩 키: 주차_차단기_* 시리즈
export const mockBarriers: ParkingBarrier[] = [
	{
		id: 'barrier-01',
		name: '정문출입차단기1', // t('주차_차단기_정문1')
		isOpen: false,
		operationMode: 'auto-operation',
	},
	{
		id: 'barrier-02',
		name: '정문출입차단기2', // t('주차_차단기_정문2')
		isOpen: true,
		operationMode: 'auto-operation',
	},
	{
		id: 'barrier-03',
		name: '후문출입차단기1', // t('주차_차단기_후문1')
		isOpen: false,
		operationMode: 'always-open',
	},
	{
		id: 'barrier-04',
		name: '후문출입차단기2', // t('주차_차단기_후문2') - 언어팩에 추가 필요
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
