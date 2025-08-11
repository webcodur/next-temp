'use client';

import React, { useState } from 'react';
import GridForm from './GridForm';
import { FileText, Calendar, Users, Settings, AlertCircle, CheckCircle, Info } from 'lucide-react';

const GridFormExample = () => {
	const [formData, setFormData] = useState({
		title: '',
		type: 'single',
		description: '',
		startDate: '',
		endDate: '',
		category: 'general',
		allowAnonymous: false,
		requireAuth: true,
		email: '',
		password: '',
		confirmPassword: '',
	});

	const [errors, setErrors] = useState<Record<string, string>>({});

	const handleChange = (field: string, value: string | boolean) => {
		setFormData(prev => ({ ...prev, [field]: value }));
		
		// 간단한 유효성 검사
		if (field === 'email' && typeof value === 'string') {
			if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
				setErrors(prev => ({ ...prev, email: '올바른 이메일 형식을 입력하세요.' }));
			} else {
				setErrors(prev => ({ ...prev, email: '' }));
			}
		}
		
		if (field === 'confirmPassword' && typeof value === 'string') {
			if (value && value !== formData.password) {
				setErrors(prev => ({ ...prev, confirmPassword: '비밀번호가 일치하지 않습니다.' }));
			} else {
				setErrors(prev => ({ ...prev, confirmPassword: '' }));
			}
		}
	};

	const SampleFormData = () => (
		<div className="p-4 mt-6 rounded-lg bg-muted">
			<h4 className="mb-2 font-semibold font-multilang">현재 폼 데이터:</h4>
			<pre className="overflow-auto text-xs">
				{JSON.stringify(formData, null, 2)}
			</pre>
		</div>
	);

	return (
		<div className="p-8">
			<h1 className="mb-6 text-2xl font-bold font-multilang">GridForm 컴포넌트 예제</h1>
			
			            {/* 기본 4열 구조 예제 */}
            <div className="mb-12">
                <h2 className="mb-4 text-xl font-semibold font-multilang">1. 기본 투표 생성 폼 (4열 구조)</h2>
				<div className="p-6 bg-white rounded-lg border">
					<GridForm>
						<GridForm.Row>
							<GridForm.Label required htmlFor="vote-title">
								투표 제목
							</GridForm.Label>
							<GridForm.Rules>
								한글, 영문 2-100자
							</GridForm.Rules>
							<GridForm.Content>
								<input
									id="vote-title"
									type="text"
									value={formData.title}
									onChange={(e) => handleChange('title', e.target.value)}
									placeholder="투표 제목을 입력하세요"
									className="p-2 w-full rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-primary"
								/>
							</GridForm.Content>
						</GridForm.Row>

						<GridForm.Row align="start">
							<GridForm.Label>투표 유형</GridForm.Label>
							<GridForm.Rules>
								단일/복수 선택 옵션
							</GridForm.Rules>
							<GridForm.Content direction="column" gap="8px">
								<div className="flex gap-4">
									<label className="flex gap-2 items-center">
										<input
											type="radio"
											name="type"
											value="single"
											checked={formData.type === 'single'}
											onChange={(e) => handleChange('type', e.target.value)}
											className="text-primary focus:ring-primary"
										/>
										<span className="font-multilang">단일 선택</span>
									</label>
									<label className="flex gap-2 items-center">
										<input
											type="radio"
											name="type"
											value="multiple"
											checked={formData.type === 'multiple'}
											onChange={(e) => handleChange('type', e.target.value)}
											className="text-primary focus:ring-primary"
										/>
										<span className="font-multilang">복수 선택</span>
									</label>
								</div>
								<p className="text-sm text-muted-foreground font-multilang">
									투표자가 선택할 수 있는 옵션의 개수를 설정합니다.
								</p>
							</GridForm.Content>
						</GridForm.Row>
					</GridForm>
				</div>
			</div>

			{/* 회원가입 폼 예제 */}
			<div className="mb-12">
				<h2 className="mb-4 text-xl font-semibold font-multilang">2. 회원가입 폼 (피드백 포함)</h2>
				<div className="p-6 bg-white rounded-lg border">
					<GridForm>
						<GridForm.Row>
							<GridForm.Label required htmlFor="email">
								이메일
							</GridForm.Label>
							<GridForm.Content>
								<input
									id="email"
									type="email"
									value={formData.email}
									onChange={(e) => handleChange('email', e.target.value)}
									placeholder="example@domain.com"
									className={`p-2 w-full rounded-md border focus:outline-none focus:ring-2 ${
										errors.email ? 'border-destructive focus:ring-destructive' : 'border-border focus:ring-primary'
									}`}
								/>
								<GridForm.Feedback type={errors.email ? 'error' : 'info'}>
									{errors.email ? (
										<div className="flex gap-2 items-center">
											<AlertCircle className="w-4 h-4" />
											{errors.email}
										</div>
									) : (
										<div className="flex gap-2 items-center">
											<Info className="w-4 h-4" />
											로그인 시 사용할 이메일 주소
										</div>
									)}
								</GridForm.Feedback>
							</GridForm.Content>
						</GridForm.Row>

						<GridForm.Row>
							<GridForm.Label required htmlFor="password">
								비밀번호
							</GridForm.Label>
							<GridForm.Content>
								<input
									id="password"
									type="password"
									value={formData.password}
									onChange={(e) => handleChange('password', e.target.value)}
									placeholder="비밀번호를 입력하세요"
									className="p-2 w-full rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-primary"
								/>
								<GridForm.Feedback type="info">
									<div className="flex gap-2 items-center">
										<Info className="w-4 h-4" />
										8자 이상, 영문/숫자/특수문자 포함
									</div>
								</GridForm.Feedback>
							</GridForm.Content>
						</GridForm.Row>

						<GridForm.Row>
							<GridForm.Label required htmlFor="confirm-password">
								비밀번호 확인
							</GridForm.Label>
							<GridForm.Content>
								<input
									id="confirm-password"
									type="password"
									value={formData.confirmPassword}
									onChange={(e) => handleChange('confirmPassword', e.target.value)}
									placeholder="비밀번호를 다시 입력하세요"
									className={`p-2 w-full rounded-md border focus:outline-none focus:ring-2 ${
										errors.confirmPassword ? 'border-destructive focus:ring-destructive' : 'border-border focus:ring-primary'
									}`}
								/>
								<GridForm.Feedback type={errors.confirmPassword ? 'error' : (formData.confirmPassword && !errors.confirmPassword ? 'success' : 'info')}>
									{errors.confirmPassword ? (
										<div className="flex gap-2 items-center">
											<AlertCircle className="w-4 h-4" />
											{errors.confirmPassword}
										</div>
									) : formData.confirmPassword && !errors.confirmPassword ? (
										<div className="flex gap-2 items-center">
											<CheckCircle className="w-4 h-4" />
											비밀번호가 일치합니다
										</div>
									) : (
										<div className="flex gap-2 items-center">
											<Info className="w-4 h-4" />
											위와 동일한 비밀번호 입력
										</div>
									)}
								</GridForm.Feedback>
							</GridForm.Content>
						</GridForm.Row>
					</GridForm>
				</div>
			</div>

			{/* 커스텀 레이아웃 예제 */}
			<div className="mb-12">
				<h2 className="mb-4 text-xl font-semibold font-multilang">3. 커스텀 레이아웃 (좁은 라벨)</h2>
				<div className="p-6 bg-white rounded-lg border">
					<GridForm labelWidth="100px" gap="16px">
						<GridForm.Row>
							<GridForm.Label htmlFor="start-date">
								<Calendar className="inline mr-1 w-4 h-4" />
								시작일
							</GridForm.Label>
							<GridForm.Content>
								<input
									id="start-date"
									type="date"
									value={formData.startDate}
									onChange={(e) => handleChange('startDate', e.target.value)}
									className="p-2 w-full rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-primary"
								/>
							</GridForm.Content>
						</GridForm.Row>

						<GridForm.Row>
							<GridForm.Label htmlFor="end-date">
								<Calendar className="inline mr-1 w-4 h-4" />
								종료일
							</GridForm.Label>
							<GridForm.Content>
								<input
									id="end-date"
									type="date"
									value={formData.endDate}
									onChange={(e) => handleChange('endDate', e.target.value)}
									className="p-2 w-full rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-primary"
								/>
							</GridForm.Content>
						</GridForm.Row>

						<GridForm.Row>
							<GridForm.Label htmlFor="category">
								<FileText className="inline mr-1 w-4 h-4" />
								카테고리
							</GridForm.Label>
							<GridForm.Content>
								<select
									id="category"
									value={formData.category}
									onChange={(e) => handleChange('category', e.target.value)}
									className="p-2 w-full rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-primary"
								>
									<option value="general">일반</option>
									<option value="important">중요</option>
									<option value="urgent">긴급</option>
								</select>
							</GridForm.Content>
						</GridForm.Row>
					</GridForm>
				</div>
			</div>

			{/* 복잡한 컨텐츠 예제 */}
			<div className="mb-12">
				<h2 className="mb-4 text-xl font-semibold font-multilang">4. 복잡한 컨텐츠 배치</h2>
				<div className="p-6 bg-white rounded-lg border">
					<GridForm labelWidth="120px">
						<GridForm.Row align="start">
							<GridForm.Label>
								<Settings className="inline mr-1 w-4 h-4" />
								고급 옵션
							</GridForm.Label>
							<GridForm.Content direction="column" gap="16px">
								<div className="space-y-3">
									<label className="flex gap-2 items-center">
										<input
											type="checkbox"
											checked={formData.allowAnonymous}
											onChange={(e) => handleChange('allowAnonymous', e.target.checked)}
											className="rounded border-border text-primary focus:ring-primary"
										/>
										<span className="font-multilang">익명 투표 허용</span>
									</label>
									<label className="flex gap-2 items-center">
										<input
											type="checkbox"
											checked={formData.requireAuth}
											onChange={(e) => handleChange('requireAuth', e.target.checked)}
											className="rounded border-border text-primary focus:ring-primary"
										/>
										<span className="font-multilang">로그인 필수</span>
									</label>
								</div>
								
								<div className="p-3 bg-blue-50 rounded-md border">
									<div className="flex gap-2 items-start">
										<Users className="w-4 h-4 text-blue-600 mt-0.5" />
										<div>
											<p className="text-sm font-medium text-blue-900 font-multilang">
												참여 권한 안내
											</p>
											<p className="text-xs text-blue-700 font-multilang">
												로그인이 필요한 경우 회원만 투표에 참여할 수 있습니다.
											</p>
										</div>
									</div>
								</div>
							</GridForm.Content>
						</GridForm.Row>

						<GridForm.Row align="center">
							<GridForm.Label>  </GridForm.Label>
							<GridForm.Content direction="row" gap="8px">
								<button
									type="submit"
									className="px-6 py-2 rounded-md transition-colors bg-primary text-primary-foreground hover:bg-primary/90 font-multilang"
								>
									투표 생성
								</button>
								<button
									type="button"
									className="px-6 py-2 rounded-md border transition-colors border-border hover:bg-muted font-multilang"
								>
									미리보기
								</button>
							</GridForm.Content>
						</GridForm.Row>
					</GridForm>
				</div>
			</div>

			<SampleFormData />
		</div>
	);
};

export default GridFormExample; 