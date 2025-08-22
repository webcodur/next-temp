/* 
  파일명: /components/layout/header/ProfileButton.tsx
  기능: 헤더의 프로필 버튼 컴포넌트
  책임: 사용자 프로필 드롭다운 메뉴와 로그인/로그아웃 처리
*/ // ------------------------------
'use client';

import { useState, useRef, useEffect, memo } from 'react';

import { User, LogOut, ChevronDown } from 'lucide-react';
import clsx from 'clsx';

import { useAuth } from '@/hooks/auth-hooks/useAuth/useAuth';
import { ROLE_NAME_MAP } from '@/types/admin';

// #region 타입
interface ProfileButtonProps {
	className?: string;
}
// #endregion

export const ProfileButton = memo(function ProfileButton({ className = '' }: ProfileButtonProps) {
	// #region 상태
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);
	// #endregion

	// #region 훅
	const { 
		logout, 
		userProfile, 
		getUserRoleId, 
		selectedParkingLot,
		selectedParkingLotId 
	} = useAuth();
	// #endregion

	// #region 핸들러
	const handleClickOutside = (event: MouseEvent) => {
		if (
			dropdownRef.current &&
			!dropdownRef.current.contains(event.target as Node)
		) {
			setIsOpen(false);
		}
	};

	const handleLogout = async () => {
		try {
			logout();
			setIsOpen(false);
		} catch (error) {
			console.error('로그아웃 처리 중 오류:', error);
			alert('로그아웃 처리 중 오류가 발생했습니다.');
		}
	};


	// 역할명 조회 함수
	const getRoleName = () => {
		const roleId = getUserRoleId();
		return roleId ? ROLE_NAME_MAP[roleId] || '알 수 없음' : '알 수 없음';
	};
	// #endregion

	// #region 효과
	useEffect(() => {
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);
	// #endregion

	// #region 렌더링
	return (
		<div className="relative" ref={dropdownRef}>
			{/* 프로필 버튼 */}
			<button
				onClick={() => setIsOpen(!isOpen)}
				className={clsx('flex gap-1 items-center', className)}>
				<User className="w-6 h-6 text-muted-foreground" />
				<ChevronDown
					className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${
						isOpen ? 'rotate-180' : ''}`}
				/>
			</button>

			{/* 드롭다운 메뉴 */}
			{isOpen && (
				<div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-lg border shadow-lg neu-flat bg-background border-border/50">
					{/* 사용자 정보 헤더 */}
					<div className="px-4 py-3 border-b border-border/50">
						<div className="flex gap-3 items-center mb-2">
							<User className="w-8 h-8 text-muted-foreground" />
							<div className="flex-1">
								<div className="font-medium text-foreground font-multilang">
									{userProfile?.name || userProfile?.account || '사용자'}
								</div>
								<div className="text-sm text-muted-foreground font-multilang">
									{getRoleName()}
								</div>
							</div>
						</div>
						
						{/* 주차장 정보 (최고관리자가 아닌 경우에만 표시) */}
						{selectedParkingLotId !== 0 && selectedParkingLot && (
							<div className="text-xs text-muted-foreground font-multilang">
								현장: {selectedParkingLot.name || `주차장 ${selectedParkingLotId}`}
							</div>
						)}
						
						{/* 최고관리자이면서 주차장을 선택한 경우 */}
						{selectedParkingLotId === 0 && getUserRoleId() === 1 && (
							<div className="text-xs text-muted-foreground font-multilang">
								전체 시스템 관리자
							</div>
						)}
						
						{/* 계정 정보 */}
						<div className="mt-1 text-xs text-muted-foreground font-multilang">
							계정: {userProfile?.account}
						</div>
					</div>

					{/* 메뉴 아이템 */}
					<div className="p-1">

						<button
							onClick={handleLogout}
							className="flex gap-3 items-center p-2 w-full rounded-md transition-colors text-start hover:bg-destructive/10 text-destructive">
							<LogOut className="w-5 h-5" />
							<span className="text-base cursor-pointer font-multilang">로그아웃</span>
						</button>
					</div>
				</div>
			)}
		</div>
	);
	// #endregion
});
