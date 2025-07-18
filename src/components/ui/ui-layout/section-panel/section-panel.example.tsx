'use client';

import React, { useState } from 'react';
import { RefreshCw, User, Car, Calendar, Settings } from 'lucide-react';

import { SectionPanel, SectionPanelHeader, SectionPanelContent } from './SectionPanel';

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
				<h1 className="text-3xl font-bold mb-4 font-multilang">
					SectionPanel 컴포넌트 예제
				</h1>
				<div className="bg-gradient-to-r from-primary/20 to-primary/10 p-4 rounded-lg max-w-4xl mx-auto">
					<p className="text-sm text-primary font-medium text-left font-multilang">
						<strong>BarrierManager 기준 고정 스타일:</strong><br />
						• 모든 헤더에 gradient 배경 적용 (bg-gradient-to-r from-primary/80 to-primary/60)<br />
						• 타이틀 중앙 배치, h-10 고정 높이, text-lg font-bold 스타일<br />
						• px-4 py-3 패딩 통일, rounded-lg border<br />
						• 조건부 처리 제거로 일관된 디자인 시스템 확보
					</p>
				</div>
			</div>

			{/* 예제 1: 기본 섹션 패널 */}
			<div className="space-y-4">
				<h2 className="text-xl font-semibold text-primary font-multilang">
					1. 기본 섹션 패널
				</h2>
				<div className="text-sm text-muted-foreground mb-4 font-multilang">
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
				<h2 className="text-xl font-semibold text-primary font-multilang">
					2. 아이콘과 액션이 있는 패널
				</h2>
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
							{/* 차량 목록 패널 */}
							<SectionPanel
								title="차량 목록"
								icon={<Car className="w-5 h-5 text-white" />}
								headerActions={
									<button
										onClick={handleRefresh}
										disabled={refreshing}
										className="px-3 py-1 text-sm bg-white text-primary rounded-lg neu-raised hover:scale-105 transition-all disabled:opacity-50 font-multilang"
									>
										<RefreshCw 
											className={`w-4 h-4 inline mr-1 ${refreshing ? 'animate-spin' : ''}`} 
										/>
										새로고침
									</button>
								}
							>
								<div className="p-4 space-y-3">
									<div className="mb-3 p-3 bg-primary/10 rounded-lg">
										<p className="text-xs text-primary font-medium">
											📍 고정 스타일 특징: 타이틀 중앙 배치, h-10 고정 높이, 흰색 텍스트
										</p>
									</div>
									<div className="space-y-2">
										<div className="p-3 border border-border/30 rounded-lg">
											<p className="font-medium">차량 번호: 123가4567</p>
											<p className="text-sm text-muted-foreground">입차 시간: 09:30</p>
										</div>
										<div className="p-3 border border-border/30 rounded-lg">
											<p className="font-medium">차량 번호: 987나8765</p>
											<p className="text-sm text-muted-foreground">입차 시간: 10:15</p>
										</div>
									</div>
								</div>
							</SectionPanel>

							{/* 사용자 정보 패널 */}
							<SectionPanel
								title="사용자 정보" 
								icon={<User className="w-5 h-5 text-white" />}
								headerActions={
									<Settings className="w-5 h-5 text-white cursor-pointer hover:scale-110 transition-transform" />
								}
							>
								<div className="p-4">
									<div className="space-y-3">
										<div className="flex items-center gap-3">
											<div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
												<User className="w-6 h-6 text-primary" />
											</div>
											<div>
												<p className="font-medium">홍길동</p>
												<p className="text-sm text-muted-foreground">관리자</p>
											</div>
										</div>
										<div className="text-sm space-y-1">
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
				<h2 className="text-xl font-semibold text-primary font-multilang">
					3. 다양한 콘텐츠 타입
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{/* 일정 패널 */}
					<SectionPanel
						title="오늘의 일정"
						icon={<Calendar className="w-5 h-5 text-white" />}
					>
						<div className="p-4">
							<div className="space-y-3">
								<div className="flex items-start gap-3">
									<div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
									<div>
										<p className="font-medium">회의 A</p>
										<p className="text-sm text-muted-foreground">오전 10:00 - 11:00</p>
									</div>
								</div>
								<div className="flex items-start gap-3">
									<div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
									<div>
										<p className="font-medium">프로젝트 검토</p>
										<p className="text-sm text-muted-foreground">오후 2:00 - 3:30</p>
									</div>
								</div>
								<div className="flex items-start gap-3">
									<div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
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

			{/* 예제 4: 독립 컴포넌트 사용 */}
			<div className="space-y-4">
				<h2 className="text-xl font-semibold text-primary font-multilang">
					4. 독립 컴포넌트 사용
				</h2>
				<div className="border border-border/50 rounded-lg neu-flat bg-surface-2">
					<SectionPanelHeader className="bg-primary/10">
						<div className="flex gap-2 items-center">
							<span className="text-lg font-semibold text-foreground font-multilang">
								커스텀 헤더
							</span>
						</div>
						<div className="flex gap-2">
							<span className="text-sm text-muted-foreground">추가 정보</span>
						</div>
					</SectionPanelHeader>
					<SectionPanelContent className="p-6">
						<p className="text-muted-foreground font-multilang">
							SectionPanelHeader와 SectionPanelContent를 독립적으로 사용할 수 있습니다.
						</p>
						<div className="mt-4 p-4 bg-muted/50 rounded-lg">
							<h4 className="font-medium mb-2">컴포넌트 특징:</h4>
							<ul className="text-sm text-muted-foreground space-y-1">
								<li>• SectionPanelHeader: px-4 py-3 패딩</li>
								<li>• SectionPanelContent: flex-1 레이아웃</li>
								<li>• 독립적으로 사용 가능한 유연한 구조</li>
							</ul>
						</div>
					</SectionPanelContent>
				</div>
			</div>
		</div>
	);
	// #endregion
};

export default SectionPanelExample; 