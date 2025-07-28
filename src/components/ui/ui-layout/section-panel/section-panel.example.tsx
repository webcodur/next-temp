'use client';

import React, { useState } from 'react';
import { RefreshCw, User, Car, Calendar, Settings } from 'lucide-react';

import { SectionPanel } from './SectionPanel';

const SectionPanelExample = () => {
	// #region 상태
	const [refreshing, setRefreshing] = useState(false);
	// #endregion

	// #region 핸들러
	const handleRefresh = () => {
		setRefreshing(true);
		setTimeout(() => setRefreshing(false), 2000);
	};
	// #endregion

	// #region 렌더링
	return (
		<div className="p-6 space-y-8">
			{/* 페이지 제목 */}
			<div className="text-center">
				<h1 className="mb-4 text-3xl font-bold font-multilang">
					SectionPanel 컴포넌트 예제
				</h1>
				<div className="p-4 mx-auto max-w-4xl bg-gradient-to-r rounded-lg from-muted/30 to-muted/20">
					<p className="text-sm font-medium text-left text-foreground font-multilang">
						<strong>중립적인 색상 기준 고정 스타일:</strong><br />
						• 모든 헤더에 중립 그라데이션 적용 (bg-gradient-to-r from-gray-4 via-gray-5 to-gray-6)<br />
						• 타이틀 중앙 배치, h-8 고정 높이, text-base font-bold 스타일<br />
						• px-4 py-2 패딩 통일, rounded-lg<br />
						• 브랜드 색상 제거로 중립적이고 일관된 디자인 시스템 확보
					</p>
				</div>
			</div>

			{/* 예제 1: 기본 섹션 패널 */}
			<div className="space-y-4">
				<h2 className="text-xl font-semibold text-foreground font-multilang">
					1. 기본 섹션 패널
				</h2>
				<div className="mb-4 text-sm text-muted-foreground font-multilang">
					기본 SectionPanel은 중앙 정렬 타이틀과 gradient 배경을 사용합니다.
				</div>

				<SectionPanel title="기본 패널">
					<div className="p-6">
						<p className="text-muted-foreground font-multilang">
							이것은 기본 섹션 패널의 콘텐츠입니다.
						</p>
					</div>
				</SectionPanel>
			</div>

			{/* 예제 2: 아이콘과 액션이 있는 패널 */}
			<div className="space-y-4">
				<h2 className="text-xl font-semibold text-foreground font-multilang">
					2. 아이콘과 액션이 있는 패널
				</h2>
						<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
							{/* 차량 목록 패널 */}
							<SectionPanel
								title="차량 목록"
								icon={<Car className="w-5 h-5 text-foreground" />}
								headerActions={
									<button
										onClick={handleRefresh}
										disabled={refreshing}
										className="px-3 py-1 text-sm bg-white rounded-lg transition-all text-primary neu-raised hover:scale-105 disabled:opacity-50 font-multilang"
									>
										<RefreshCw 
											className={`w-4 h-4 inline mr-1 ${refreshing ? 'animate-spin' : ''}`} 
										/>
										새로고침
									</button>
								}
							>
								<div className="p-4 space-y-3">
									<div className="p-3 mb-3 rounded-lg bg-muted/50">
										<p className="text-xs font-medium text-foreground">
											📍 고정 스타일 특징: 타이틀 중앙 배치, h-8 고정 높이, 중립적인 색상
										</p>
									</div>
									<div className="space-y-2">
										<div className="p-3 rounded-lg border border-border/30">
											<p className="font-medium">차량 번호: 123가4567</p>
											<p className="text-sm text-muted-foreground">입차 시간: 09:30</p>
										</div>
										<div className="p-3 rounded-lg border border-border/30">
											<p className="font-medium">차량 번호: 987나8765</p>
											<p className="text-sm text-muted-foreground">입차 시간: 10:15</p>
										</div>
									</div>
								</div>
							</SectionPanel>

							{/* 사용자 정보 패널 */}
							<SectionPanel
								title="사용자 정보" 
								icon={<User className="w-5 h-5 text-foreground" />}
								headerActions={
									<Settings className="w-5 h-5 text-foreground transition-transform cursor-pointer hover:scale-110" />
								}
							>
								<div className="p-4">
									<div className="space-y-3">
										<div className="flex gap-3 items-center">
											<div className="flex justify-center items-center w-12 h-12 rounded-full bg-primary/20">
												<User className="w-6 h-6 text-primary" />
											</div>
											<div>
												<p className="font-medium">홍길동</p>
												<p className="text-sm text-muted-foreground">관리자</p>
											</div>
										</div>
										<div className="space-y-1 text-sm">
											<p>연락처: 010-1234-5678</p>
											<p>이메일: admin@example.com</p>
										</div>
									</div>
								</div>
							</SectionPanel>
						</div>
			</div>

			{/* 예제 3: 다양한 콘텐츠 타입 */}
			<div className="space-y-4">
				<h2 className="text-xl font-semibold text-foreground font-multilang">
					3. 다양한 콘텐츠 타입
				</h2>
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
					{/* 일정 패널 */}
					<SectionPanel
						title="오늘의 일정"
						icon={<Calendar className="w-5 h-5 text-foreground" />}
					>
						<div className="p-4">
							<div className="space-y-3">
								<div className="flex gap-3 items-start">
									<div className="mt-2 w-2 h-2 bg-green-500 rounded-full"></div>
									<div>
										<p className="font-medium">회의 A</p>
										<p className="text-sm text-muted-foreground">오전 10:00 - 11:00</p>
									</div>
								</div>
								<div className="flex gap-3 items-start">
									<div className="mt-2 w-2 h-2 bg-yellow-500 rounded-full"></div>
									<div>
										<p className="font-medium">프로젝트 검토</p>
										<p className="text-sm text-muted-foreground">오후 2:00 - 3:30</p>
									</div>
								</div>
								<div className="flex gap-3 items-start">
									<div className="mt-2 w-2 h-2 bg-red-500 rounded-full"></div>
									<div>
										<p className="font-medium">보고서 제출</p>
										<p className="text-sm text-muted-foreground">오후 5:00 마감</p>
									</div>
								</div>
							</div>
						</div>
					</SectionPanel>
				</div>
			</div>
		</div>
	);
	// #endregion
};

export default SectionPanelExample; 