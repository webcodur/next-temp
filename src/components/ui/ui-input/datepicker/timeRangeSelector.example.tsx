'use client';

import React, { useState } from 'react';
import TimeRangeSelector, { TimeInput, TimeRangeInput, TimeInfo } from './TimeRangeSelector';

export default function TimeRangeSelectorExample() {
	// 메인 컴포넌트 상태
	const [selectedTime, setSelectedTime] = useState({
		startHour: 9,
		startMinute: 30,
		endHour: 21,
		endMinute: 0
	});

	// 개별 모듈 테스트용 상태
	const [singleHour, setSingleHour] = useState(14);
	const [singleMinute, setSingleMinute] = useState(30);

	const handleTimeRangeChange = (startHour: number, startMinute: number, endHour: number, endMinute: number) => {
		setSelectedTime({ startHour, startMinute, endHour, endMinute });
		console.log(`시간 변경: ${startHour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')} ~ ${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`);
	};

	return (
		<div className="container py-10">
			<h1 className="mb-8 text-3xl font-bold">시간 범위 선택기 예제</h1>

			<div className="space-y-12">
				{/* 메인 TimeRangeSelector */}
				<section className="neu-elevated p-6">
					<h2 className="mb-6 text-2xl font-semibold" style={{color: 'hsl(var(--primary))'}}>TimeRangeSelector - 전체 시간 범위 선택</h2>
					
					<div className="space-y-6">
						<div>
							<h3 className="mb-4 font-medium">기본 사용</h3>
							<TimeRangeSelector onChange={handleTimeRangeChange} />
						</div>

						<div>
							<h3 className="mb-4 font-medium">커스텀 초기값</h3>
							<TimeRangeSelector
								initialStartHour={8}
								initialStartMinute={0}
								initialEndHour={18}
								initialEndMinute={30}
								onChange={handleTimeRangeChange}
							/>
						</div>

						<div className="neu-inset p-4">
							<h4 className="mb-2 font-medium">현재 선택된 시간:</h4>
							<p className="text-sm opacity-80">
								{selectedTime.startHour.toString().padStart(2, '0')}:{selectedTime.startMinute.toString().padStart(2, '0')} ~ {selectedTime.endHour.toString().padStart(2, '0')}:{selectedTime.endMinute.toString().padStart(2, '0')}
							</p>
						</div>
					</div>
				</section>

				{/* 개별 모듈 예제 */}
				<section className="neu-elevated p-6">
					<h2 className="mb-6 text-2xl font-semibold" style={{color: 'hsl(142 71% 45%)'}}>개별 모듈 예제</h2>
					
					<div className="space-y-8">
						{/* TimeInput 예제 */}
						<div>
							<h3 className="mb-4 font-medium">A 모듈: TimeInput - 단일 시간 선택</h3>
							<div className="flex gap-6 items-end">
								<TimeInput
									value={singleHour}
									onChange={setSingleHour}
									type="hour"
									label="시간"
								/>
								<TimeInput
									value={singleMinute}
									onChange={setSingleMinute}
									type="minute"
									label="분"
								/>
								<div className="neu-inset p-3 mb-8 text-sm">
									선택된 시간: {singleHour.toString().padStart(2, '0')}:{singleMinute.toString().padStart(2, '0')}
								</div>
							</div>
						</div>

						{/* TimeRangeInput 예제 */}
						<div>
							<h3 className="mb-4 font-medium">B 모듈: TimeRangeInput - 시간 범위 입력</h3>
							<TimeRangeInput
								startHour={10}
								startMinute={15}
								endHour={22}
								endMinute={45}
								onStartTimeChange={(hour, minute) => console.log('시작시간:', hour, minute)}
								onEndTimeChange={(hour, minute) => console.log('종료시간:', hour, minute)}
							/>
						</div>

						{/* TimeInfo 예제 */}
						<div>
							<h3 className="mb-4 font-medium">C 모듈: TimeInfo - 시간 정보 표시</h3>
							<div className="space-y-4">
								<div className="flex gap-4 items-center">
									<span className="w-32 text-sm text-gray-600">당일 내 운영:</span>
									<TimeInfo startHour={9} startMinute={0} endHour={18} endMinute={0} />
								</div>
								<div className="flex gap-4 items-center">
									<span className="w-32 text-sm text-gray-600">자정까지:</span>
									<TimeInfo startHour={18} startMinute={30} endHour={0} endMinute={0} />
								</div>
								<div className="flex gap-4 items-center">
									<span className="w-32 text-sm text-gray-600">익일까지:</span>
									<TimeInfo startHour={22} startMinute={0} endHour={6} endMinute={30} />
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* 사용 시나리오 */}
				<section className="neu-elevated p-6">
					<h2 className="mb-6 text-2xl font-semibold" style={{color: 'hsl(280 100% 70%)'}}>다양한 사용 시나리오</h2>
					
					<div className="space-y-6">
						<div>
							<h3 className="mb-2 font-medium">일반 영업시간 (9:00 ~ 18:00)</h3>
							<TimeRangeSelector initialStartHour={9} initialEndHour={18} />
						</div>

						<div>
							<h3 className="mb-2 font-medium">야간 운영시간 (22:00 ~ 06:00)</h3>
							<TimeRangeSelector initialStartHour={22} initialEndHour={6} />
						</div>

						<div>
							<h3 className="mb-2 font-medium">24시간 운영 (00:00 ~ 00:00)</h3>
							<TimeRangeSelector initialStartHour={0} initialEndHour={0} />
						</div>
					</div>
				</section>

				{/* 사용법 안내 */}
				<section className="neu-inset p-6">
					<h2 className="mb-4 text-xl font-semibold">사용법 및 기능</h2>
					<div className="space-y-3 text-sm">
						<div><strong>조작 버튼:</strong></div>
						<div className="ml-4 space-y-1">
							<div>• <code className="neu-flat px-2 py-1 text-xs">{'<<'}</code> - 최대값으로 이동 (시간: 23시, 분: 59분)</div>
							<div>• <code className="neu-flat px-2 py-1 text-xs">^</code> - 10단위 증가</div>
							<div>• <code className="neu-flat px-2 py-1 text-xs">v</code> - 10단위 감소</div>
							<div>• <code className="neu-flat px-2 py-1 text-xs">{'>>'}</code> - 최소값으로 이동 (0시, 0분)</div>
						</div>
						<div><strong>드롭다운:</strong> 7개 항목이 표시되며, 클릭하여 직접 선택 가능</div>
						<div><strong>안내 정보:</strong> 당일/익일 여부와 총 운영시간을 실시간 계산</div>
						<div><strong>컴포넌트:</strong></div>
						<div className="ml-4 space-y-1">
							<div>• <code className="neu-flat px-2 py-1 text-xs">{'<TimeRangeSelector />'}</code> - 전체 시간 범위 선택기</div>
							<div>• <code className="neu-flat px-2 py-1 text-xs">{'<TimeInput />'}</code> - 단일 시간/분 선택</div>
							<div>• <code className="neu-flat px-2 py-1 text-xs">{'<TimeRangeInput />'}</code> - 시작-종료 시간 입력</div>
							<div>• <code className="neu-flat px-2 py-1 text-xs">{'<TimeInfo />'}</code> - 시간 정보 표시</div>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
} 