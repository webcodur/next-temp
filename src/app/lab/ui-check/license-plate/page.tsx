'use client';

import React from 'react';
import LicensePlate from '@/components/ui/license-plate/LicensePlate';

export default function LicensePlatePage() {
	const plateNumbers = ['123가4567', '45나8901', '678다2345', '90라6789'];
	const sizes: ('sm' | 'md' | 'lg' | 'xl')[] = ['sm', 'md', 'lg', 'xl'];

	return (
		<div className="p-6 space-y-8">
			<div className="text-center">
				<h1 className="mb-2 text-3xl font-bold text-gray-800">
					메탈릭 번호판 컴포넌트 테스트
				</h1>
				<p className="text-gray-600">
					통일된 메탈릭 디자인의 한국 번호판을 확인할 수 있습니다
				</p>
			</div>

			{/* 다양한 번호 테스트 */}
			<div className="space-y-6">
				<h2 className="text-2xl font-semibold text-gray-800">다양한 번호판</h2>
				<div className="p-6 rounded-lg neu-flat">
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						{plateNumbers.map((number, index) => (
							<div key={index} className="flex justify-center">
								<LicensePlate plateNumber={number} size="lg" />
							</div>
						))}
					</div>
				</div>
			</div>

			{/* 이미지 포함 번호판 테스트 */}
			<div className="space-y-6">
				<h2 className="text-2xl font-semibold text-gray-800">
					이미지 포함 번호판
				</h2>
				<div className="p-6 rounded-lg neu-flat">
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						<div className="text-center">
							<p className="mb-2 text-sm text-gray-600">기본 이미지</p>
							<LicensePlate plateNumber="123가4567" size="lg" />
						</div>
						<div className="text-center">
							<p className="mb-2 text-sm text-gray-600">커스텀 이미지</p>
							<LicensePlate
								plateNumber="456나7890"
								size="lg"
								leftImage="/images/license-plate.png"
							/>
						</div>
					</div>
				</div>
			</div>

			{/* 크기별 테스트 */}
			<div className="space-y-6">
				<h2 className="text-2xl font-semibold text-gray-800">크기별 테스트</h2>
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
					{sizes.map((size) => (
						<div key={size} className="p-4 text-center rounded-lg neu-flat">
							<h3 className="mb-4 text-lg font-medium text-gray-700 uppercase">
								{size} Size
							</h3>
							<div className="flex justify-center">
								<LicensePlate plateNumber="123가4567" size={size} />
							</div>
						</div>
					))}
				</div>
			</div>

			{/* 인터랙티브 테스트 */}
			<div className="space-y-6">
				<h2 className="text-2xl font-semibold text-gray-800">
					인터랙티브 테스트
				</h2>
				<div className="p-6 rounded-lg neu-flat">
					<p className="mb-4 text-gray-600">클릭 가능한 번호판들:</p>
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
						{plateNumbers.map((number, index) => (
							<div key={index} className="flex justify-center">
								<LicensePlate
									plateNumber={number}
									size="lg"
									interactive={true}
									onClick={() => alert(`${number} 번호판이 클릭되었습니다!`)}
								/>
							</div>
						))}
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
							<LicensePlate plateNumber="12가3456" size="md" />
						</div>
						<div className="text-center">
							<p className="mb-2 text-sm text-gray-600">긴 번호</p>
							<LicensePlate plateNumber="1234나5678" size="md" />
						</div>
						<div className="text-center">
							<p className="mb-2 text-sm text-gray-600">특수 문자</p>
							<LicensePlate plateNumber="미인식차량" size="md" />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
