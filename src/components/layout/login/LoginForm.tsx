'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';

interface LoginFormData {
	email: string;
	password: string;
}

interface LoginFormProps {
	onSubmit: (data: LoginFormData) => void;
	isLoading?: boolean;
}

export function LoginForm({ onSubmit, isLoading = false }: LoginFormProps) {
	const [formData, setFormData] = useState<LoginFormData>({
		email: '',
		password: '',
	});
	const [showPassword, setShowPassword] = useState(false);
	const [errors, setErrors] = useState<Partial<LoginFormData>>({});

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

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) return;

		onSubmit(formData);
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

	return (
		<div className="p-8 mx-auto w-full max-w-md rounded-2xl neu-flat bg-background">
			<div className="mb-8 text-center">
				<div className="flex justify-center items-center mx-auto mb-4 w-16 h-16 rounded-full neu-raised">
					<Lock className="w-8 h-8 text-primary" />
				</div>
				<h1 className="mb-2 text-2xl font-bold text-foreground">로그인</h1>
				<p className="text-muted-foreground">계정에 로그인하세요</p>
			</div>

			<form onSubmit={handleSubmit} className="space-y-6">
				<div className="space-y-1">
					<div className="relative">
						<Mail className="absolute left-3 top-1/2 z-10 w-4 h-4 transform -translate-y-1/2 text-muted-foreground" />
						<Field
							type="text"
							placeholder="이메일을 입력하세요"
							value={formData.email}
							onChange={handleEmailChange}
							inputType="email"
							className="pl-10"
						/>
					</div>
					{errors.email && (
						<p className="text-sm text-destructive">{errors.email}</p>
					)}
				</div>

				<div className="space-y-1">
					<div className="relative">
						<Lock className="absolute left-3 top-1/2 z-10 w-4 h-4 transform -translate-y-1/2 text-muted-foreground" />
						<input
							type={showPassword ? 'text' : 'password'}
							placeholder="비밀번호를 입력하세요"
							value={formData.password}
							onChange={(e) => handlePasswordChange(e.target.value)}
							className="pr-10 pl-10 w-full h-11 rounded-lg neu-inset bg-background text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/20"
						/>
						<button
							type="button"
							onClick={() => setShowPassword(!showPassword)}
							className="absolute right-3 top-1/2 transition-colors transform -translate-y-1/2 text-muted-foreground hover:text-foreground">
							{showPassword ? (
								<EyeOff className="w-4 h-4" />
							) : (
								<Eye className="w-4 h-4" />
							)}
						</button>
					</div>
					{errors.password && (
						<p className="text-sm text-destructive">{errors.password}</p>
					)}
				</div>

				<div className="flex justify-between items-center">
					<label className="flex items-center space-x-2 cursor-pointer group">
						<div className="relative">
							<input type="checkbox" className="sr-only peer" />
							<div className="flex justify-center items-center w-4 h-4 rounded transition-all duration-200 neu-inset bg-background peer-checked:neu-raised peer-checked:bg-primary">
								<svg
									className="w-3 h-3 text-white opacity-0 transition-opacity duration-200 peer-checked:opacity-100"
									fill="currentColor"
									viewBox="0 0 20 20">
									<path
										fillRule="evenodd"
										d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
										clipRule="evenodd"
									/>
								</svg>
							</div>
						</div>
						<span className="text-sm text-muted-foreground">
							로그인 상태 유지
						</span>
					</label>

					<button
						type="button"
						className="text-sm text-primary hover:underline">
						비밀번호 찾기
					</button>
				</div>

				<Button type="submit" className="w-full h-11" disabled={isLoading}>
					{isLoading ? '로그인 중...' : '로그인'}
				</Button>

				<div className="text-center">
					<span className="text-sm text-muted-foreground">
						계정이 없으신가요?{' '}
					</span>
					<button
						type="button"
						className="text-sm text-primary hover:underline">
						회원가입
					</button>
				</div>
			</form>
		</div>
	);
}
