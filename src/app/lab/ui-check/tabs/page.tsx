'use client';
import Tabs, { Tab } from '@/components/ui/tabs/Tabs';
import { useState } from 'react';

const tabList: Tab[] = [
	{ id: 'tab1', label: '대시보드' },
	{ id: 'tab2', label: '설정' },
	{ id: 'tab3', label: '프로필' },
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

				<Tabs tabs={tabList}>
					{/* 대시보드 탭 */}
					<div className="space-y-4">
						<h2 className="mb-4 text-xl font-semibold text-gray-700">
							대시보드 개요
						</h2>
						<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
							<div className="neu-inset p-4 rounded-lg">
								<h3 className="font-medium text-gray-700">총 방문자</h3>
								<p className="text-2xl font-bold text-gray-600">12,345</p>
							</div>
							<div className="neu-inset p-4 rounded-lg">
								<h3 className="font-medium text-gray-700">월간 매출</h3>
								<p className="text-2xl font-bold text-gray-600">₩2,450,000</p>
							</div>
							<div className="neu-inset p-4 rounded-lg">
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
						<div className="space-y-4">
							{/* 알림 토글 */}
							<div
								className="flex items-center justify-between p-4 bg-gray-100 rounded-lg"
								style={{
									boxShadow: '4px 4px 8px #bebebe, -4px -4px 8px #ffffff',
								}}>
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
									className="focus:outline-none">
									<div
										className={`neu-inset w-12 h-6 rounded-full relative ${notifications ? 'neu-inset' : 'neu-inset'}`}>
										<div
											className={`neu-raised w-5 h-5 rounded-full absolute top-0.5 ${notifications ? 'right-0.5' : 'left-0.5'}`}
										/>
									</div>
								</button>
							</div>

							{/* 다크모드 토글 */}
							<div
								className="flex items-center justify-between p-4 bg-gray-100 rounded-lg"
								style={{
									boxShadow: '4px 4px 8px #bebebe, -4px -4px 8px #ffffff',
								}}>
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
									className="focus:outline-none">
									<div
										className={`neu-inset w-12 h-6 rounded-full relative ${darkMode ? 'neu-inset' : 'neu-inset'}`}>
										<div
											className={`neu-raised w-5 h-5 rounded-full absolute top-0.5 ${darkMode ? 'right-0.5' : 'left-0.5'}`}
										/>
									</div>
								</button>
							</div>

							{/* 추가 설정 항목 */}
							<div
								className="p-4 bg-gray-100 rounded-lg"
								style={{
									boxShadow: '4px 4px 8px #bebebe, -4px -4px 8px #ffffff',
								}}>
								<h3 className="mb-3 font-medium text-gray-700">
									현재 설정 상태
								</h3>
								<div className="space-y-2 text-sm text-gray-600">
									<div className="flex justify-between">
										<span>알림:</span>
										<span
											className={
												notifications ? 'text-green-600' : 'text-red-500'
											}>
											{notifications ? 'ON' : 'OFF'}
										</span>
									</div>
									<div className="flex justify-between">
										<span>다크 모드:</span>
										<span
											className={darkMode ? 'text-green-600' : 'text-red-500'}>
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
						<div className="flex items-start space-x-6">
							<div
								className="flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full"
								style={{
									boxShadow: '6px 6px 12px #bebebe, -6px -6px 12px #ffffff',
								}}>
								<span className="text-2xl font-bold text-gray-600">김</span>
							</div>
							<div className="flex-1 space-y-3">
								<div
									className="p-3 bg-gray-100 rounded-lg"
									style={{
										boxShadow:
											'inset 2px 2px 4px #bebebe, inset -2px -2px 4px #ffffff',
									}}>
									<label className="text-sm text-gray-500">이름</label>
									<p className="text-lg font-medium text-gray-700">김개발자</p>
								</div>
								<div
									className="p-3 bg-gray-100 rounded-lg"
									style={{
										boxShadow:
											'inset 2px 2px 4px #bebebe, inset -2px -2px 4px #ffffff',
									}}>
									<label className="text-sm text-gray-500">이메일</label>
									<p className="text-lg font-medium text-gray-700">
										dev@example.com
									</p>
								</div>
								<div
									className="p-3 bg-gray-100 rounded-lg"
									style={{
										boxShadow:
											'inset 2px 2px 4px #bebebe, inset -2px -2px 4px #ffffff',
									}}>
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
