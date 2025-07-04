'use client';

import { useState } from 'react';
import { FieldEmail } from '@/components/ui/ui-input/field/text/FieldEmail';
import { FieldPassword } from '@/components/ui/ui-input/field/text/FieldPassword';
import { Button } from '@/components/ui/ui-input/button/Button';

interface LoginFormData {
	email: string;
	password: string;
	rememberMe: boolean;
}

interface LoginFormProps {
	onSubmit: (data: LoginFormData) => void;
	isLoading?: boolean;
}

export function LoginForm({ onSubmit, isLoading = false }: LoginFormProps) {
	const [formData, setFormData] = useState<LoginFormData>({
		email: '',
		password: '',
		rememberMe: false,
	});
	const [errors, setErrors] = useState<Partial<LoginFormData>>({});

	// #region 검증 로직
	const validateForm = () => {
		const newErrors: Partial<LoginFormData> = {};

		if (!formData.email) {
			newErrors.email = '이메일을 입력해주세요';
		} else if (!/\S+@\S+\.\S+/.test(formData.email)) {
			newErrors.email = '올바른 이메일 형식을 입력해주세요';
		}

		if (!formData.password) {
			newErrors.password = '비밀번호를 입력해주세요';
		} else if (formData.password.length < 6) {
			newErrors.password = '비밀번호는 6자 이상 입력해주세요';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};
	// #endregion

	// #region 이벤트 핸들러
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (validateForm()) {
			onSubmit(formData);
		}
	};

	const handleEmailChange = (value: string) => {
		setFormData((prev) => ({ ...prev, email: value }));
		if (errors.email) {
			setErrors((prev) => ({ ...prev, email: undefined }));
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

	return (
		<div className="p-8 mx-auto w-full max-w-md rounded-2xl neu-flat">
			{/* 헤더 */}
			<div className="mb-8 text-center">
				<h1 className="mb-2 text-2xl font-bold font-multilang text-foreground">로그인</h1>
				<p className="font-multilang text-muted-foreground">계정에 로그인하세요</p>
			</div>

			{/* 폼 */}
			<form onSubmit={handleSubmit} className="space-y-6">
				{/* 이메일 필드 */}
				<div className="space-y-1">
					<FieldEmail
						placeholder="이메일을 입력하세요"
						value={formData.email}
						onChange={handleEmailChange}
						showValidation={false}
						showClearButton={true}
					/>
					{errors.email && (
						<p className="text-sm font-multilang text-destructive">{errors.email}</p>
					)}
				</div>

				{/* 비밀번호 필드 */}
				<div className="space-y-1">
					<FieldPassword
						placeholder="비밀번호를 입력하세요"
						value={formData.password}
						onChange={handlePasswordChange}
						showStrengthIndicator={false}
						showClearButton={false}
						minLength={6}
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
								${formData.rememberMe ? 'neu-inset bg-brand' : 'neu-raised bg-card'}
							`}>
								{formData.rememberMe && (
									<svg
										className="w-3 h-3 neu-icon-active text-brand-foreground"
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
						className="text-sm transition-all duration-200 font-multilang text-brand hover:text-brand/80 hover:underline">
						비밀번호 찾기
					</button>
				</div>

				{/* 로그인 버튼 */}
				<Button 
					type="submit" 
					className="w-full h-11 font-multilang" 
					disabled={isLoading}
					variant="brand"
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
						className="text-sm transition-all duration-200 font-multilang text-brand hover:text-brand/80 hover:underline">
						회원가입
					</button>
				</div>
			</form>
		</div>
	);
}
