/* 
  파일명: /components/layout/login/LoginForm.tsx
  기능: 로그인 페이지에서 사용되는 폼 컴포넌트
  책임: 사용자 인증 및 입력값 검증을 처리한다.
*/

'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/ui-input/button/Button';
import FieldText from '@/components/ui/ui-input/field/text/FieldText';
import FieldPassword from '@/components/ui/ui-input/field/text/FieldPassword';

// #region 타입
interface LoginFormData {
	username: string;
	password: string;
	rememberMe: boolean;
}

interface LoginFormProps {
	onSubmit: (data: LoginFormData) => void;
	isLoading?: boolean;
}
// #endregion

export function LoginForm({ onSubmit, isLoading = false }: LoginFormProps) {
	// #region 상태
	const [formData, setFormData] = useState<LoginFormData>({
		username: '',
		password: '',
		rememberMe: false,
	});
	const [errors, setErrors] = useState<Partial<LoginFormData>>({});
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

	const toggleRememberMe = () => {
		setFormData((prev) => ({ ...prev, rememberMe: !prev.rememberMe }));
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
						placeholder="비밀번호를 입력하세요"
						value={formData.password}
						onChange={handlePasswordChange}
						showClearButton={false}
					/>
					{errors.password && (
						<p className="text-sm font-multilang text-destructive">{errors.password}</p>
					)}
				</div>

				{/* 추가 옵션 */}
				<div className="flex justify-between items-center">
					<label
						className="flex items-center space-x-2 cursor-pointer group"
						onClick={toggleRememberMe}>
						<div className="relative">
							<input
								type="checkbox"
								className="sr-only"
								checked={formData.rememberMe}
								onChange={toggleRememberMe}
							/>
							<div
								className={`
								flex justify-center items-center w-4 h-4 rounded transition-all duration-200
								${formData.rememberMe ? 'neu-flat bg-card' : 'neu-raised bg-card'}
							`}>
								{formData.rememberMe && (
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
							로그인 상태 유지
						</span>
					</label>

					<button
						type="button"
						className="text-sm transition-all duration-200 font-multilang text-primary hover:text-primary/80 hover:underline">
						비밀번호 찾기
					</button>
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

				{/* 회원가입 링크 */}
				<div className="text-center">
					<span className="text-sm font-multilang text-muted-foreground">
						계정이 없으신가요?{' '}
					</span>
					<button
						type="button"
						className="text-sm transition-all duration-200 font-multilang text-primary hover:text-primary/80 hover:underline">
						회원가입
					</button>
				</div>
			</form>
		</div>
	);
	// #endregion
}