'use client';

import { useState } from 'react';
import { AdvancedSearch } from '@/components/ui/ui-input/advanced-search/AdvancedSearch';
import FieldText from '@/components/ui/ui-input/field/text/FieldText';
import FieldSelect from '@/components/ui/ui-input/field/select/FieldSelect';
import FieldDatePicker from '@/components/ui/ui-input/field/datepicker/FieldDatePicker';
import { Option } from '@/components/ui/ui-input/field/core/types';

export default function AdvancedSearchPage() {

	// #region 주차장 검색 상태들
	const [licensePlate, setLicensePlate] = useState('');
	const [parkingZone, setParkingZone] = useState('');
	const [vehicleType, setVehicleType] = useState('');
	const [entryStartDate, setEntryStartDate] = useState<Date | null>(null);
	const [entryEndDate, setEntryEndDate] = useState<Date | null>(null);
	const [parkingStatus, setParkingStatus] = useState('');
	// #endregion

	// #region 사용자 검색 상태들
	const [userName, setUserName] = useState('');
	const [userPhone, setUserPhone] = useState('');
	const [userType, setUserType] = useState('');
	const [registrationDate, setRegistrationDate] = useState<Date | null>(null);
	// #endregion

	// #region 검색 결과 상태
	const [searchResults, setSearchResults] = useState<string[]>([]);
	const [lastSearchTime, setLastSearchTime] = useState<string>('');
	// #endregion

	// 주차장 구역 옵션
	const parkingZoneOptions: Option[] = [
		{ value: 'A', label: 'A구역 (지상 1층)' },
		{ value: 'B', label: 'B구역 (지상 2층)' },
		{ value: 'C', label: 'C구역 (지하 1층)' },
		{ value: 'D', label: 'D구역 (지하 2층)' },
		{ value: 'VIP', label: 'VIP 전용구역' },
		{ value: 'VISITOR', label: '방문자 주차구역' },
		{ value: 'DISABLED', label: '장애인 전용구역' },
	];

	// 차량 유형 옵션
	const vehicleTypeOptions: Option[] = [
		{ value: 'sedan', label: '승용차' },
		{ value: 'suv', label: 'SUV' },
		{ value: 'truck', label: '트럭' },
		{ value: 'van', label: '밴' },
		{ value: 'motorcycle', label: '오토바이' },
		{ value: 'electric', label: '전기차' },
	];

	// 주차 상태 옵션
	const parkingStatusOptions: Option[] = [
		{ value: 'parked', label: '주차중' },
		{ value: 'exited', label: '출차완료' },
		{ value: 'overtime', label: '초과주차' },
		{ value: 'violation', label: '위반주차' },
	];

	// 사용자 유형 옵션
	const userTypeOptions: Option[] = [
		{ value: 'resident', label: '거주자' },
		{ value: 'visitor', label: '방문자' },
		{ value: 'staff', label: '직원' },
		{ value: 'guest', label: '손님' },
		{ value: 'delivery', label: '배송업체' },
	];

	// 주차장 검색 핸들러
	const handleParkingSearch = () => {
		const searchParams: string[] = [];
		
		if (licensePlate) searchParams.push(`번호판: ${licensePlate}`);
		if (parkingZone) searchParams.push(`구역: ${parkingZone}`);
		if (vehicleType) searchParams.push(`차량타입: ${vehicleType}`);
		if (entryStartDate) searchParams.push(`입차시작: ${entryStartDate.toLocaleDateString()}`);
		if (entryEndDate) searchParams.push(`입차종료: ${entryEndDate.toLocaleDateString()}`);
		if (parkingStatus) searchParams.push(`상태: ${parkingStatus}`);

		setSearchResults(searchParams.length > 0 ? searchParams : ['모든 주차 기록']);
		setLastSearchTime(new Date().toLocaleTimeString());
	};

	// 주차장 검색 리셋 핸들러
	const handleParkingReset = () => {
		setLicensePlate('');
		setParkingZone('');
		setVehicleType('');
		setEntryStartDate(null);
		setEntryEndDate(null);
		setParkingStatus('');
		setSearchResults([]);
		setLastSearchTime('');
	};

	// 사용자 검색 핸들러
	const handleUserSearch = () => {
		const searchParams: string[] = [];
		
		if (userName) searchParams.push(`이름: ${userName}`);
		if (userPhone) searchParams.push(`전화번호: ${userPhone}`);
		if (userType) searchParams.push(`사용자유형: ${userType}`);
		if (registrationDate) searchParams.push(`등록일: ${registrationDate.toLocaleDateString()}`);

		setSearchResults(searchParams.length > 0 ? searchParams : ['모든 사용자 기록']);
		setLastSearchTime(new Date().toLocaleTimeString());
	};

	// 사용자 검색 리셋 핸들러
	const handleUserReset = () => {
		setUserName('');
		setUserPhone('');
		setUserType('');
		setRegistrationDate(null);
		setSearchResults([]);
		setLastSearchTime('');
	};

	return (
		<div className="container p-6 mx-auto">
			<h1 className="mb-6 text-2xl font-bold">Advanced Search 컴포넌트 테스트</h1>
			<p className="mb-8 text-gray-600">
				접고 펼칠 수 있는 고급 검색 패널 컴포넌트입니다. 다양한 필터 조건을 그룹화하여 
				사용자가 복잡한 검색을 쉽게 수행할 수 있도록 도와줍니다.
			</p>

			<div className="max-w-4xl mx-auto space-y-8">
				
				{/* #region 주차장 차량 검색 */}
				<section>
					<h2 className="mb-4 text-lg font-semibold">주차장 차량 검색</h2>
					<AdvancedSearch
						title="차량 및 주차 정보 검색"
						onSearch={handleParkingSearch}
						onReset={handleParkingReset}
						searchLabel="차량 검색"
						resetLabel="초기화"
						defaultOpen={true}
						statusText={lastSearchTime ? `마지막 검색: ${lastSearchTime}` : undefined}
					>
						{/* 번호판 검색 */}
						<FieldText
							id="license-plate"
							label="차량 번호판"
							placeholder="예: 12가3456"
							value={licensePlate}
							onChange={setLicensePlate}
							showSearchIcon={true}
						/>

						{/* 주차 구역 */}
						<FieldSelect
							id="parking-zone"
							label="주차 구역"
							placeholder="구역 선택"
							options={parkingZoneOptions}
							value={parkingZone}
							onChange={setParkingZone}
						/>

						{/* 차량 유형 */}
						<FieldSelect
							id="vehicle-type"
							label="차량 유형"
							placeholder="차량 유형 선택"
							options={vehicleTypeOptions}
							value={vehicleType}
							onChange={setVehicleType}
						/>

						{/* 입차 시작일 */}
						<FieldDatePicker
							id="entry-start-date"
							label="입차 시작일"
							datePickerType="single"
							placeholder="시작일 선택"
							value={entryStartDate}
							onChange={setEntryStartDate}
						/>

						{/* 입차 종료일 */}
						<FieldDatePicker
							id="entry-end-date"
							label="입차 종료일"
							datePickerType="single"
							placeholder="종료일 선택"
							value={entryEndDate}
							onChange={setEntryEndDate}
						/>

						{/* 주차 상태 */}
						<FieldSelect
							id="parking-status"
							label="주차 상태"
							placeholder="상태 선택"
							options={parkingStatusOptions}
							value={parkingStatus}
							onChange={setParkingStatus}
						/>
					</AdvancedSearch>
				</section>
				{/* #endregion */}

				{/* #region 사용자 검색 */}
				<section>
					<h2 className="mb-4 text-lg font-semibold">사용자 정보 검색</h2>
					<AdvancedSearch
						title="등록 사용자 검색"
						onSearch={handleUserSearch}
						onReset={handleUserReset}
						searchLabel="사용자 검색"
						resetLabel="지우기"
						defaultOpen={false}
					>
						{/* 사용자명 */}
						<FieldText
							id="user-name"
							label="사용자명"
							placeholder="이름 입력"
							value={userName}
							onChange={setUserName}
						/>

						{/* 전화번호 */}
						<FieldText
							id="user-phone"
							label="전화번호"
							placeholder="010-0000-0000"
							value={userPhone}
							onChange={setUserPhone}
						/>

						{/* 사용자 유형 */}
						<FieldSelect
							id="user-type"
							label="사용자 유형"
							placeholder="유형 선택"
							options={userTypeOptions}
							value={userType}
							onChange={setUserType}
						/>

						{/* 등록일 */}
						<FieldDatePicker
							id="registration-date"
							label="등록일"
							datePickerType="single"
							placeholder="등록일 선택"
							value={registrationDate}
							onChange={setRegistrationDate}
						/>
					</AdvancedSearch>
				</section>
				{/* #endregion */}

				{/* #region 검색 결과 표시 */}
				{searchResults.length > 0 && (
					<section>
						<h2 className="mb-4 text-lg font-semibold">검색 결과</h2>
						<div className="p-4 neu-flat rounded-lg">
							<div className="mb-2 text-sm text-muted-foreground">
								검색 조건: {searchResults.length}개 항목
							</div>
							<ul className="space-y-1">
								{searchResults.map((result, index) => (
									<li key={index} className="text-sm font-medium">
										• {result}
									</li>
								))}
							</ul>
							{lastSearchTime && (
								<div className="mt-3 text-xs text-muted-foreground">
									검색 시간: {lastSearchTime}
								</div>
							)}
						</div>
					</section>
				)}
				{/* #endregion */}

				{/* #region 옵션 데모 */}
				<section>
					<h2 className="mb-4 text-lg font-semibold">다양한 옵션 데모</h2>
					
					{/* 버튼 없는 버전 */}
					<div className="mb-6">
						<h3 className="mb-2 text-md font-medium">버튼 숨김 모드</h3>
						<AdvancedSearch
							title="필터 전용 (버튼 없음)"
							showButtons={false}
							defaultOpen={true}
						>
							<FieldText
								id="demo-filter"
								label="필터 조건"
								placeholder="조건 입력"
								value=""
								onChange={() => {}}
							/>
							<FieldSelect
								id="demo-category"
								label="카테고리"
								placeholder="카테고리 선택"
								options={[
									{ value: 'category1', label: '카테고리 1' },
									{ value: 'category2', label: '카테고리 2' },
								]}
								value=""
								onChange={() => {}}
							/>
						</AdvancedSearch>
					</div>

					{/* 기본 닫힘 버전 */}
					<div className="mb-6">
						<h3 className="mb-2 text-md font-medium">기본 닫힘 모드</h3>
						<AdvancedSearch
							title="클릭하여 펼치기"
							defaultOpen={false}
							onSearch={() => alert('간단 검색 실행!')}
							onReset={() => alert('간단 검색 리셋!')}
						>
							<FieldText
								id="demo-simple"
								label="간단 검색어"
								placeholder="검색어 입력"
								value=""
								onChange={() => {}}
								showSearchIcon={true}
							/>
						</AdvancedSearch>
					</div>
				</section>
				{/* #endregion */}

			</div>
		</div>
	);
} 