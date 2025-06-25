'use client';
import Tabs, { Tab } from '@/components/ui/tabs/Tabs';
import { useState } from 'react';
import { cn } from '@/lib/utils';

// 아이콘 컴포넌트 추가
const DashboardIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
		<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
		<line x1="3" y1="9" x2="21" y2="9"></line>
		<line x1="9" y1="21" x2="9" y2="9"></line>
	</svg>
);

const SettingsIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
		<circle cx="12" cy="12" r="3"></circle>
		<path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
	</svg>
);

const ProfileIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
		<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
		<circle cx="12" cy="7" r="4"></circle>
	</svg>
);

const tabList: Tab[] = [
	{ id: 'tab1', label: '대시보드', icon: <DashboardIcon /> },
	{ id: 'tab2', label: '설정', icon: <SettingsIcon /> },
	{ id: 'tab3', label: '프로필', icon: <ProfileIcon /> },
];

const TabsPage: React.FC = () => {
	// 토글 상태 관리
	const [notifications, setNotifications] = useState(true);
	const [darkMode, setDarkMode] = useState(false);

	return (
		<div className="min-h-screen p-8 bg-gray-100">
			<div className="max-w-4xl mx-auto">
				<h1 className="mb-8 text-3xl font-bold text-center text-gray-700">
					음양각 뉴모피즘 탭
				</h1>

				<Tabs 
					tabs={tabList} 
					variant="filled"
					align="center"
					size="md"
					className="p-6"
				>
					{/* 대시보드 탭 */}
					<div className="space-y-6">
						<h2 className="mb-4 text-xl font-semibold text-gray-700">
							대시보드 개요
						</h2>
						<div className="grid grid-cols-1 gap-6 md:grid-cols-3">
							<div className="p-5 rounded-lg neu-inset transition-all duration-200 hover:scale-[1.02]">
								<h3 className="font-medium text-gray-700">총 방문자</h3>
								<p className="text-2xl font-bold text-gray-600">12,345</p>
							</div>
							<div className="p-5 rounded-lg neu-inset transition-all duration-200 hover:scale-[1.02]">
								<h3 className="font-medium text-gray-700">월간 매출</h3>
								<p className="text-2xl font-bold text-gray-600">₩2,450,000</p>
							</div>
							<div className="p-5 rounded-lg neu-inset transition-all duration-200 hover:scale-[1.02]">
								<h3 className="font-medium text-gray-700">신규 가입</h3>
								<p className="text-2xl font-bold text-gray-600">834</p>
							</div>
						</div>
					</div>

					{/* 설정 탭 */}
					<div className="space-y-6">
						<h2 className="mb-4 text-xl font-semibold text-gray-700">
							시스템 설정
						</h2>
						<div className="space-y-5">
							{/* 알림 토글 */}
							<div className="flex items-center justify-between p-5 transition-all duration-200 rounded-lg neu-flat hover:neu-raised">
								<div>
									<span className="font-medium text-gray-700">알림 활성화</span>
									<p className="mt-1 text-sm text-gray-500">
										{notifications
											? '알림이 활성화되어 있습니다'
											: '알림이 비활성화되어 있습니다'}
									</p>
								</div>
								<button
									onClick={() => setNotifications(!notifications)}
									className="focus:outline-hidden">
									<div className={cn("w-14 h-7 rounded-full relative neu-inset transition-all duration-200")}>
										<div
											className={cn(
												"w-6 h-6 rounded-full absolute top-0.5 neu-raised transition-all duration-300",
												notifications ? 'right-0.5 bg-green-50' : 'left-0.5'
											)}
										/>
									</div>
								</button>
							</div>

							{/* 다크모드 토글 */}
							<div className="flex items-center justify-between p-5 transition-all duration-200 rounded-lg neu-flat hover:neu-raised">
								<div>
									<span className="font-medium text-gray-700">다크 모드</span>
									<p className="mt-1 text-sm text-gray-500">
										{darkMode
											? '다크 모드가 활성화되어 있습니다'
											: '라이트 모드가 활성화되어 있습니다'}
									</p>
								</div>
								<button
									onClick={() => setDarkMode(!darkMode)}
									className="focus:outline-hidden">
									<div className={cn("w-14 h-7 rounded-full relative neu-inset transition-all duration-200")}>
										<div
											className={cn(
												"w-6 h-6 rounded-full absolute top-0.5 neu-raised transition-all duration-300",
												darkMode ? 'right-0.5 bg-blue-50' : 'left-0.5'
											)}
										/>
									</div>
								</button>
							</div>

							{/* 추가 설정 항목 */}
							<div className="p-5 transition-all duration-200 rounded-lg neu-flat hover:neu-raised">
								<h3 className="mb-3 font-medium text-gray-700">
									현재 설정 상태
								</h3>
								<div className="space-y-2 text-sm text-gray-600">
									<div className="flex justify-between">
										<span>알림:</span>
										<span
											className={
												notifications ? 'text-green-600 font-medium' : 'text-red-500 font-medium'
											}>
											{notifications ? 'ON' : 'OFF'}
										</span>
									</div>
									<div className="flex justify-between">
										<span>다크 모드:</span>
										<span
											className={darkMode ? 'text-blue-600 font-medium' : 'text-red-500 font-medium'}>
											{darkMode ? 'ON' : 'OFF'}
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* 프로필 탭 */}
					<div className="space-y-6">
						<h2 className="mb-4 text-xl font-semibold text-gray-700">
							사용자 프로필
						</h2>
						<div className="flex flex-col items-center space-y-6 md:flex-row md:items-start md:space-y-0 md:space-x-6">
							<div className="flex items-center justify-center w-24 h-24 transition-all duration-200 rounded-full neu-raised hover:scale-105">
								<span className="text-3xl font-bold text-gray-600">김</span>
							</div>
							<div className="flex-1 w-full space-y-4">
								<div className="p-4 transition-all duration-200 rounded-lg neu-inset">
									<label className="text-sm text-gray-500">이름</label>
									<p className="text-lg font-medium text-gray-700">김개발자</p>
								</div>
								<div className="p-4 transition-all duration-200 rounded-lg neu-inset">
									<label className="text-sm text-gray-500">이메일</label>
									<p className="text-lg font-medium text-gray-700">
										dev@example.com
									</p>
								</div>
								<div className="p-4 transition-all duration-200 rounded-lg neu-inset">
									<label className="text-sm text-gray-500">가입일</label>
									<p className="text-lg font-medium text-gray-700">
										2024년 1월 15일
									</p>
								</div>
							</div>
						</div>
					</div>
				</Tabs>
			</div>
		</div>
	);
};

export default TabsPage;
