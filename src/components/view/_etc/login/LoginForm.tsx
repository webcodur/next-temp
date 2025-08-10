/* 
  파일명: /components/layout/login/LoginForm.tsx
  기능: 로그인 페이지에서 사용되는 폼 컴포넌트
  책임: 사용자 인증 및 입력값 검증을 처리한다.
*/

'use client';

import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/ui-input/button/Button';
import FieldText from '@/components/ui/ui-input/field/text/FieldText';
import FieldPassword from '@/components/ui/ui-input/field/text/FieldPassword';
import { type DevAccountSet } from '@/utils/devAccounts';

// #region 타입
interface LoginFormData {
	username: string;
	password: string;
	rememberUsername: boolean;
}

interface LoginFormProps {
	onSubmit: (data: LoginFormData) => void;
	isLoading?: boolean;
	selectedDevAccount?: DevAccountSet | null;
}
// #endregion

export function LoginForm({ onSubmit, isLoading = false, selectedDevAccount = null }: LoginFormProps) {
	// #region 상태
	const [formData, setFormData] = useState<LoginFormData>({
		username: '',
		password: '',
		rememberUsername: false,
	});
	const [errors, setErrors] = useState<Partial<LoginFormData>>({});
	// #endregion

	// #region 초기화
	useEffect(() => {
		// 저장된 아이디 불러오기
		const savedUsername = localStorage.getItem('remembered-username');
		if (savedUsername) {
			setFormData(prev => ({
				...prev,
				username: savedUsername,
				rememberUsername: true,
			}));
		}
	}, []);

	// 개발자 계정 선택 시 자동 입력
	useEffect(() => {
		if (selectedDevAccount) {
			setFormData(prev => ({
				...prev,
				username: selectedDevAccount.id,
				password: selectedDevAccount.password,
			}));
			// 에러 메시지 초기화
			setErrors({});
		}
	}, [selectedDevAccount]);
	// #endregion

	// #region 핸들러
	const validateForm = () => {
		const newErrors: Partial<LoginFormData> = {};

		if (!formData.username) {
			newErrors.username = '아이디를 입력해주세요';
		} else if (formData.username.length < 2) {
			newErrors.username = '아이디는 2자 이상 입력해주세요';
		}

		if (!formData.password) {
			newErrors.password = '비밀번호를 입력해주세요';
		} else if (formData.password.length < 4) {
			newErrors.password = '비밀번호는 4자 이상 입력해주세요';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (validateForm()) {
			// 아이디 기억하기 처리
			if (formData.rememberUsername) {
				localStorage.setItem('remembered-username', formData.username);
			} else {
				localStorage.removeItem('remembered-username');
			}
			onSubmit(formData);
		}
	};

	const handleUsernameChange = (value: string) => {
		setFormData((prev) => ({ ...prev, username: value }));
		if (errors.username) {
			setErrors((prev) => ({ ...prev, username: undefined }));
		}
	};

	const handlePasswordChange = (value: string) => {
		setFormData((prev) => ({ ...prev, password: value }));
		if (errors.password) {
			setErrors((prev) => ({ ...prev, password: undefined }));
		}
	};

	const toggleRememberUsername = () => {
		setFormData((prev) => ({ ...prev, rememberUsername: !prev.rememberUsername }));
	};
	// #endregion

	// #region 렌더링
	return (
		<div className="p-8 mx-auto w-full max-w-md rounded-2xl neu-elevated bg-card">
			{/* 헤더 */}
			<div className="mb-8 text-center">
				<h1 className="mb-2 text-2xl font-bold font-multilang text-foreground">로그인</h1>
				<p className="font-multilang text-muted-foreground">계정에 로그인하세요</p>
			</div>

			{/* 폼 */}
			<form onSubmit={handleSubmit} className="space-y-6">
				{/* 아이디 필드 */}
				<div className="space-y-1">
					<FieldText
						id="username"
						label="아이디"
						placeholder="아이디를 입력하세요"
						value={formData.username}
						onChange={handleUsernameChange}
						showClearButton={true}
					/>
					{errors.username && (
						<p className="text-sm font-multilang text-destructive">{errors.username}</p>
					)}
				</div>

				{/* 비밀번호 필드 */}
				<div className="space-y-1">
					<FieldPassword
						id="password"
						label="비밀번호"
						placeholder="비밀번호를 입력하세요"
						value={formData.password}
						onChange={handlePasswordChange}
						showClearButton={false}
					/>
					{errors.password && (
						<p className="text-sm font-multilang text-destructive">{errors.password}</p>
					)}
				</div>

				{/* 아이디 기억하기 옵션 */}
				<div className="flex items-center">
					<label
						className="flex items-center space-x-2 cursor-pointer group"
						onClick={toggleRememberUsername}>
						<div className="relative">
							<input
								type="checkbox"
								className="sr-only"
								checked={formData.rememberUsername}
								onChange={toggleRememberUsername}
							/>
							<div
								className={`
								flex justify-center items-center w-4 h-4 rounded transition-all duration-200
								${formData.rememberUsername ? 'neu-flat bg-card' : 'neu-raised bg-card'}
							`}>
								{formData.rememberUsername && (
									<svg
										className="w-3 h-3 text-primary"
										fill="currentColor"
										viewBox="0 0 20 20">
										<path
											fillRule="evenodd"
											d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
											clipRule="evenodd"
										/>
									</svg>
								)}
							</div>
						</div>
						<span className="text-sm font-multilang text-muted-foreground">
							아이디 기억하기
						</span>
					</label>
				</div>

				{/* 로그인 버튼 */}
				<Button 
					type="submit" 
					className="w-full h-11 font-multilang" 
					disabled={isLoading}
					variant="primary"
				>
					{isLoading ? '로그인 중...' : '로그인'}
				</Button>
			</form>
		</div>
	);
	// #endregion
}