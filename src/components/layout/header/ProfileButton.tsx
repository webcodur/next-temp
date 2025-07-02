'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAtom } from 'jotai';
import { User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { userAtom, logoutAtom, isAuthenticatedAtom } from '@/store/auth';
import clsx from 'clsx';

interface ProfileButtonProps {
	className?: string;
}

export function ProfileButton({ className = '' }: ProfileButtonProps) {
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const router = useRouter();

	const [user] = useAtom(userAtom);
	const [isAuthenticated] = useAtom(isAuthenticatedAtom);
	const [, logout] = useAtom(logoutAtom);

	const handleClickOutside = (event: MouseEvent) => {
		if (
			dropdownRef.current &&
			!dropdownRef.current.contains(event.target as Node)
		) {
			setIsOpen(false);
		}
	};

	useEffect(() => {
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	const handleLogout = async () => {
		try {
			const result = await logout();
			setIsOpen(false);

			if (result.success) {
				console.log('로그아웃 성공');
				router.push('/login');
			} else {
				console.error('로그아웃 실패:', result.error);
				alert(result.error || '로그아웃에 실패했습니다.');
			}
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

	// 로그인하지 않은 경우 로그인 버튼 표시
	if (!isAuthenticated || !user) {
		return (
			<button
				onClick={() => router.push('/login')}
				className={clsx('text-primary', className)}>
				<User className="w-5 h-5" />
			</button>
		);
	}

	return (
		<div className="relative" ref={dropdownRef}>
			{/* 프로필 버튼 */}
			<button
				onClick={() => setIsOpen(!isOpen)}
				className={clsx('flex items-center gap-1', className)}>
				<User className="w-5 h-5 text-muted-foreground" />
				<ChevronDown
					className={`w-3 h-3 text-muted-foreground transition-transform duration-200 ${
						isOpen ? 'rotate-180' : ''
					}`}
				/>
			</button>

			{/* 드롭다운 메뉴 */}
			{isOpen && (
				<div className="absolute right-0 top-full mt-2 w-56 rounded-lg neu-flat bg-background border border-border/50 shadow-lg z-50">
					{/* 사용자 정보 */}
					<div className="p-3 border-b border-border/50">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
								<User className="w-5 h-5 text-primary" />
							</div>
							<div className="flex-1 min-w-0">
								<p className="text-sm font-medium text-foreground truncate">
									{user.name}
								</p>
								<p className="text-xs text-muted-foreground truncate">
									{user.email}
								</p>
							</div>
						</div>
					</div>

					{/* 메뉴 아이템 */}
					<div className="p-1">
						<button
							onClick={handleProfile}
							className="flex items-center gap-3 w-full p-2 text-left rounded-md hover:bg-accent/50 transition-colors">
							<User className="w-4 h-4 text-muted-foreground" />
							<span className="text-sm text-foreground">프로필</span>
						</button>

						<button
							onClick={handleSettings}
							className="flex items-center gap-3 w-full p-2 text-left rounded-md hover:bg-accent/50 transition-colors">
							<Settings className="w-4 h-4 text-muted-foreground" />
							<span className="text-sm text-foreground">설정</span>
						</button>

						<div className="my-1 border-t border-border/50" />

						<button
							onClick={handleLogout}
							className="flex items-center gap-3 w-full p-2 text-left rounded-md hover:bg-destructive/10 text-destructive transition-colors">
							<LogOut className="w-4 h-4" />
							<span className="text-sm">로그아웃</span>
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
