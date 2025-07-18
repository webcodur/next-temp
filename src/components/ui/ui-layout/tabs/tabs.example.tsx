'use client';
import Tabs, { Tab } from './Tabs';
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

const TabsExample: React.FC = () => {
	const t = useTranslations();
	// 탭 상태 관리
	const [activeTab, setActiveTab] = useState('tab1');
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
					activeId={activeTab}
					onTabChange={setActiveTab}
					className="p-6"
				/>

				<div className="mt-6 p-6 rounded-xl neu-flat min-h-[300px]">
					{activeTab === 'tab1' && (
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
									<h3 className="font-medium text-gray-700 font-multilang">{t('탭_활성사용자')}</h3>
									<p className="text-2xl font-bold text-gray-600">3,456</p>
								</div>
							</div>
						</div>
					)}

					{activeTab === 'tab2' && (
						<div className="space-y-6">
							<h2 className="mb-4 text-xl font-semibold text-gray-700 font-multilang">
								{t('탭_설정')}
							</h2>
							<div className="space-y-4">
								<div className="p-4 rounded-lg neu-inset">
									<div className="flex justify-between items-center">
										<span className="font-medium text-gray-700 font-multilang">
											{t('탭_알림설정')}
										</span>
										<button
											onClick={() => setNotifications(!notifications)}
											className={cn(
												'relative w-12 h-6 rounded-full transition-all duration-200',
												notifications ? 'neu-inset' : 'neu-raised',
												notifications ? 'bg-primary' : 'bg-gray-300',
											)}
										>
											<div
												className={cn(
													'w-5 h-5 rounded-full bg-white shadow-lg transition-transform duration-200',
													notifications ? 'translate-x-6' : 'translate-x-0.5',
												)}
											/>
										</button>
									</div>
								</div>
								<div className="p-4 rounded-lg neu-inset">
									<div className="flex justify-between items-center">
										<span className="font-medium text-gray-700 font-multilang">
											{t('탭_다크모드')}
										</span>
										<button
											onClick={() => setDarkMode(!darkMode)}
											className={cn(
												'relative w-12 h-6 rounded-full transition-all duration-200',
												darkMode ? 'neu-inset' : 'neu-raised',
												darkMode ? 'bg-primary' : 'bg-gray-300',
											)}
										>
											<div
												className={cn(
													'w-5 h-5 rounded-full bg-white shadow-lg transition-transform duration-200',
													darkMode ? 'translate-x-6' : 'translate-x-0.5',
												)}
											/>
										</button>
									</div>
								</div>
								<div className="p-4 rounded-lg neu-inset">
									<h3 className="mb-2 font-medium text-gray-700 font-multilang">
										{t('탭_계정정보')}
									</h3>
									<div className="space-y-2 text-sm text-gray-600">
										<p>Email: user@example.com</p>
										<p>Plan: Premium</p>
										<p>Status: Active</p>
									</div>
								</div>
							</div>
						</div>
					)}

					{activeTab === 'tab3' && (
						<div className="space-y-6">
							<h2 className="mb-4 text-xl font-semibold text-gray-700 font-multilang">
								{t('탭_프로필')}
							</h2>
							<div className="space-y-4">
								<div className="p-4 rounded-lg neu-inset">
									<div className="flex items-center space-x-4">
										<div className="flex justify-center items-center w-16 h-16 rounded-full neu-inset">
											<ProfileIcon />
										</div>
										<div>
											<h3 className="font-medium text-gray-700 font-multilang">
												{t('탭_사용자이름')}
											</h3>
											<p className="text-gray-600">Premium User</p>
										</div>
									</div>
								</div>
								<div className="p-4 rounded-lg neu-inset">
									<h3 className="mb-2 font-medium text-gray-700 font-multilang">
										{t('탭_개인정보')}
									</h3>
									<div className="space-y-2 text-sm text-gray-600">
										<p>가입일: 2023년 3월 15일</p>
										<p>마지막 접속: 2024년 1월 20일</p>
										<p>총 접속 시간: 245시간</p>
									</div>
								</div>
								<div className="p-4 rounded-lg neu-inset">
									<h3 className="mb-2 font-medium text-gray-700 font-multilang">
										{t('탭_사용통계')}
									</h3>
									<div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
										<div>
											<p>작성한 게시물: 23개</p>
											<p>좋아요: 145개</p>
										</div>
										<div>
											<p>댓글: 89개</p>
											<p>공유: 12개</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default TabsExample; 