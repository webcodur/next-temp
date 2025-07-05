'use client';
import Tabs, { Tab } from '@/components/ui/ui-layout/tabs/Tabs';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useTranslations } from '@/hooks/useI18n';

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

const TabsPage: React.FC = () => {
	const t = useTranslations();
	// 토글 상태 관리
	const [notifications, setNotifications] = useState(true);
	const [darkMode, setDarkMode] = useState(false);

	const tabList: Tab[] = [
		{ id: 'tab1', label: t('탭_대시보드'), icon: <DashboardIcon /> },
		{ id: 'tab2', label: t('탭_설정'), icon: <SettingsIcon /> },
		{ id: 'tab3', label: t('탭_프로필'), icon: <ProfileIcon /> },
	];

	return (
		<div className="p-8 min-h-screen bg-gray-100">
			<div className="mx-auto max-w-4xl">
				<h1 className="mb-8 text-3xl font-bold text-center text-gray-700 font-multilang">
					{t('탭_제목')}
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
						<h2 className="mb-4 text-xl font-semibold text-gray-700 font-multilang">
							{t('탭_대시보드개요')}
						</h2>
						<div className="grid grid-cols-1 gap-6 md:grid-cols-3">
							<div className="p-5 rounded-lg neu-inset transition-all duration-200 hover:scale-[1.02]">
								<h3 className="font-medium text-gray-700 font-multilang">{t('탭_총방문자')}</h3>
								<p className="text-2xl font-bold text-gray-600">12,345</p>
							</div>
							<div className="p-5 rounded-lg neu-inset transition-all duration-200 hover:scale-[1.02]">
								<h3 className="font-medium text-gray-700 font-multilang">{t('탭_월간매출')}</h3>
								<p className="text-2xl font-bold text-gray-600">₩2,450,000</p>
							</div>
							<div className="p-5 rounded-lg neu-inset transition-all duration-200 hover:scale-[1.02]">
								<h3 className="font-medium text-gray-700 font-multilang">{t('탭_신규가입')}</h3>
								<p className="text-2xl font-bold text-gray-600">834</p>
							</div>
						</div>
					</div>

					{/* 설정 탭 */}
					<div className="space-y-6">
						<h2 className="mb-4 text-xl font-semibold text-gray-700 font-multilang">
							{t('탭_시스템설정')}
						</h2>
						<div className="space-y-5">
							{/* 알림 토글 */}
							<div className="flex justify-between items-center p-5 rounded-lg transition-all duration-200 neu-flat hover:neu-raised">
								<div>
									<span className="font-medium text-gray-700 font-multilang">{t('탭_알림활성화')}</span>
									<p className="mt-1 text-sm text-gray-500 font-multilang">
										{notifications
											? t('탭_알림활성화됨')
											: t('탭_알림비활성화됨')}
									</p>
								</div>
								<button
									onClick={() => setNotifications(!notifications)}
									className="focus:outline-hidden">
									<div className={cn("relative w-14 h-7 rounded-full transition-all duration-200 neu-inset")}>
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
							<div className="flex justify-between items-center p-5 rounded-lg transition-all duration-200 neu-flat hover:neu-raised">
								<div>
									<span className="font-medium text-gray-700 font-multilang">{t('탭_다크모드')}</span>
									<p className="mt-1 text-sm text-gray-500 font-multilang">
										{darkMode
											? t('탭_다크모드활성화됨')
											: t('탭_라이트모드활성화됨')}
									</p>
								</div>
								<button
									onClick={() => setDarkMode(!darkMode)}
									className="focus:outline-hidden">
									<div className={cn("relative w-14 h-7 rounded-full transition-all duration-200 neu-inset")}>
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
							<div className="p-5 rounded-lg transition-all duration-200 neu-flat hover:neu-raised">
								<h3 className="mb-3 font-medium text-gray-700 font-multilang">
									{t('탭_현재설정상태')}
								</h3>
								<div className="space-y-2 text-sm text-gray-600">
									<div className="flex justify-between">
										<span className="font-multilang">{t('탭_알림')}</span>
										<span
											className={
												notifications ? 'font-medium text-green-600' : 'font-medium text-red-500'
											}>
											{notifications ? t('탭_ON') : t('탭_OFF')}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="font-multilang">{t('탭_다크모드')}:</span>
										<span
											className={darkMode ? 'font-medium text-blue-600' : 'font-medium text-red-500'}>
											{darkMode ? t('탭_ON') : t('탭_OFF')}
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* 프로필 탭 */}
					<div className="space-y-6">
						<h2 className="mb-4 text-xl font-semibold text-gray-700 font-multilang">
							{t('탭_사용자프로필')}
						</h2>
						<div className="flex flex-col items-center space-y-6 md:flex-row md:items-start md:space-y-0 md:space-x-6">
							<div className="flex justify-center items-center w-24 h-24 rounded-full transition-all duration-200 neu-raised hover:scale-105">
								<span className="text-3xl font-bold text-gray-600">김</span>
							</div>
							<div className="flex-1 space-y-4 w-full">
								<div className="p-4 rounded-lg transition-all duration-200 neu-inset">
									<label className="text-sm text-gray-500 font-multilang">{t('탭_이름')}</label>
									<p className="text-lg font-medium text-gray-700 font-multilang">{t('탭_김개발자')}</p>
								</div>
								<div className="p-4 rounded-lg transition-all duration-200 neu-inset">
									<label className="text-sm text-gray-500 font-multilang">{t('탭_이메일')}</label>
									<p className="text-lg font-medium text-gray-700 font-multilang">
										{t('탭_이메일주소')}
									</p>
								</div>
								<div className="p-4 rounded-lg transition-all duration-200 neu-inset">
									<label className="text-sm text-gray-500 font-multilang">{t('탭_가입일')}</label>
									<p className="text-lg font-medium text-gray-700 font-multilang">
										{t('탭_가입일날짜')}
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
