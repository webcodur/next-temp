'use client';

import React from 'react';
import LicensePlate from '@/components/ui/license-plate/LicensePlate';

export default function LicensePlatePage() {
	const plateNumbers = ['123가4567', '45나8901', '678다2345', '90라6789'];
	const widths = ['8rem', '12rem', '16rem', '20rem']; // 실제 CSS 값
	const variants = [
		{ key: 'flat' as const, name: '평면', desc: '기본 평면 디자인' },
		{ key: 'volume' as const, name: '볼륨감', desc: '입체감 있는 디자인' },
	];

	return (
		<div className="p-6 space-y-8">
			<div className="text-center">
				<h1 className="mb-2 text-3xl font-bold text-gray-800">
					메탈릭 번호판 컴포넌트 테스트
				</h1>
				<p className="text-gray-600">
					완전 동적 크기 조절이 가능한 한국 번호판입니다
				</p>
			</div>

			{/* 볼륨감 효과 테스트 */}
			<div className="space-y-6">
				<h2 className="text-2xl font-semibold text-gray-800">볼륨감 효과 옵션</h2>
				<div className="p-6 rounded-lg neu-flat">
					<div className="grid grid-cols-1 gap-8 md:grid-cols-2">
						{variants.map((variant) => (
							<div key={variant.key} className="text-center">
								<h3 className="mb-2 text-lg font-medium text-gray-700">
									{variant.name}
								</h3>
								<p className="mb-4 text-sm text-gray-600">
									{variant.desc}
								</p>
								<div className="flex justify-center">
									<LicensePlate 
										plateNumber="123가4567" 
										width="280px" 
										variant={variant.key}
									/>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* 다양한 번호 테스트 */}
			<div className="space-y-6">
				<h2 className="text-2xl font-semibold text-gray-800">다양한 번호판</h2>
				<div className="p-6 rounded-lg neu-flat">
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						{plateNumbers.map((number, index) => (
							<div key={index} className="flex justify-center">
								<LicensePlate plateNumber={number} width="280px" variant="volume" />
							</div>
						))}
					</div>
				</div>
			</div>

			{/* 기본 번호판 테스트 */}
			<div className="space-y-6">
				<h2 className="text-2xl font-semibold text-gray-800">
					표준 번호판 디자인
				</h2>
				<div className="p-6 rounded-lg neu-flat">
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						<div className="text-center">
							<p className="mb-2 text-sm text-gray-600">픽셀 고정</p>
							<LicensePlate plateNumber="123가4567" width="250px" variant="volume" />
						</div>
						<div className="text-center">
							<p className="mb-2 text-sm text-gray-600">rem 단위</p>
							<LicensePlate plateNumber="456나7890" width="15rem" variant="volume" />
						</div>
					</div>
				</div>
			</div>

			{/* 크기별 테스트 */}
			<div className="space-y-6">
				<h2 className="text-2xl font-semibold text-gray-800">크기별 테스트</h2>
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
					{widths.map((width) => (
						<div key={width} className="p-4 text-center rounded-lg neu-flat">
							<h3 className="mb-4 text-lg font-medium text-gray-700">
								{width}
							</h3>
							<div className="flex justify-center">
								<LicensePlate plateNumber="123가4567" width={width} variant="volume" />
							</div>
						</div>
					))}
				</div>
			</div>

			{/* 반응형 테스트 */}
			<div className="space-y-6">
				<h2 className="text-2xl font-semibold text-gray-800">
					반응형 크기 테스트
				</h2>
				<div className="p-6 rounded-lg neu-flat">
					<p className="mb-4 text-gray-600">
						다양한 CSS 단위로 완전 자유로운 크기 조절이 가능합니다.
					</p>
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
						<div className="text-center">
							<p className="mb-2 text-sm text-gray-600">뷰포트 기준 (30vw)</p>
							<LicensePlate plateNumber="123가4567" width="30vw" variant="volume" />
						</div>
						<div className="text-center">
							<p className="mb-2 text-sm text-gray-600">부모 기준 (80%)</p>
							<div style={{ width: '300px', margin: '0 auto' }}>
								<LicensePlate plateNumber="456나7890" width="80%" variant="volume" />
							</div>
						</div>
						<div className="text-center">
							<p className="mb-2 text-sm text-gray-600">큰 크기 (400px)</p>
							<LicensePlate plateNumber="789다1234" width="400px" variant="volume" />
						</div>
					</div>
				</div>
			</div>

			{/* 특수 케이스 테스트 */}
			<div className="space-y-6">
				<h2 className="text-2xl font-semibold text-gray-800">
					특수 케이스 테스트
				</h2>
				<div className="p-6 rounded-lg neu-flat">
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
						<div className="text-center">
							<p className="mb-2 text-sm text-gray-600">짧은 번호</p>
							<LicensePlate plateNumber="12가3456" width="200px" variant="volume" />
						</div>
						<div className="text-center">
							<p className="mb-2 text-sm text-gray-600">긴 번호</p>
							<LicensePlate plateNumber="1234나5678" width="200px" variant="volume" />
						</div>
						<div className="text-center">
							<p className="mb-2 text-sm text-gray-600">특수 문자</p>
							<LicensePlate plateNumber="미인식차량" width="200px" variant="volume" />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
} 