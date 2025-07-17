/* 
  파일명: /components/layout/header/ProfileButton.tsx
  기능: 헤더의 프로필 버튼 컴포넌트
  책임: 사용자 프로필 드롭다운 메뉴와 로그인/로그아웃 처리
*/ // ------------------------------
'use client';

import { useState, useRef, useEffect } from 'react';

import { useRouter } from 'next/navigation';
import { User, Settings, LogOut, ChevronDown } from 'lucide-react';
import clsx from 'clsx';

import { useAuth } from '@/hooks/useAuth';

// #region 타입
interface ProfileButtonProps {
	className?: string;
}
// #endregion

export function ProfileButton({ className = '' }: ProfileButtonProps) {
	// #region 상태
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);
	// #endregion

	// #region 훅
	const router = useRouter();
	const { logout } = useAuth();
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
			console.log('로그아웃 성공');
			router.push('/login');
		} catch (error) {
			console.error('로그아웃 처리 중 오류:', error);
			alert('로그아웃 처리 중 오류가 발생했습니다.');
		}
	};

	const handleProfile = () => {
		console.log('프로필 페이지 이동');
		setIsOpen(false);
		router.push('/account/management/users');
	};

	const handleSettings = () => {
		console.log('설정 페이지 이동');
		setIsOpen(false);
		router.push('/account/security/password-policy');
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
				<User className="w-5 h-5 text-muted-foreground" />
				<ChevronDown
					className={`w-3 h-3 text-muted-foreground transition-transform duration-200 ${
						isOpen ? 'rotate-180' : ''}`}
				/>
			</button>

			{/* 드롭다운 메뉴 */}
			{isOpen && (
				<div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-lg border shadow-lg neu-flat bg-background border-border/50">
					{/* 메뉴 아이템 */}
					<div className="p-1">
						<button
							onClick={handleProfile}
							className="flex gap-3 items-center p-2 w-full rounded-md transition-colors text-start hover:bg-primary/10">
							<User className="w-4 h-4 text-muted-foreground" />
							<span className="text-sm text-foreground font-multilang">프로필</span>
						</button>

						<button
							onClick={handleSettings}
							className="flex gap-3 items-center p-2 w-full rounded-md transition-colors text-start hover:bg-primary/10">
							<Settings className="w-4 h-4 text-muted-foreground" />
							<span className="text-sm text-foreground font-multilang">설정</span>
						</button>

						<div className="my-1 border-t border-border/50" />

						<button
							onClick={handleLogout}
							className="flex gap-3 items-center p-2 w-full rounded-md transition-colors text-start hover:bg-destructive/10 text-destructive">
							<LogOut className="w-4 h-4" />
							<span className="text-sm font-multilang">로그아웃</span>
						</button>
					</div>
				</div>
			)}
		</div>
	);
	// #endregion
}
