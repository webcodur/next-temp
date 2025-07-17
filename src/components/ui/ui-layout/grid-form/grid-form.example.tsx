'use client';

import React, { useState } from 'react';
import GridForm from './GridForm';
import { FileText, Calendar, Users, Settings } from 'lucide-react';

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
	});

	const handleChange = (field: string, value: string | boolean) => {
		setFormData(prev => ({ ...prev, [field]: value }));
	};

	const SampleFormData = () => (
		<div className="mt-6 p-4 bg-muted rounded-lg">
			<h4 className="font-semibold mb-2 font-multilang">현재 폼 데이터:</h4>
			<pre className="text-xs overflow-auto">
				{JSON.stringify(formData, null, 2)}
			</pre>
		</div>
	);

	return (
		<div className="p-8">
			<h1 className="text-2xl font-bold mb-6 font-multilang">GridForm 컴포넌트 예제</h1>
			
			{/* 기본 예제 */}
			<div className="mb-12">
				<h2 className="text-xl font-semibold mb-4 font-multilang">1. 기본 투표 생성 폼</h2>
				<div className="bg-white p-6 rounded-lg border">
					<GridForm>
						<GridForm.Row>
							<GridForm.Label required htmlFor="vote-title">
								투표 제목
							</GridForm.Label>
							<GridForm.Content>
								<input
									id="vote-title"
									type="text"
									value={formData.title}
									onChange={(e) => handleChange('title', e.target.value)}
									placeholder="투표 제목을 입력하세요"
									className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
								/>
							</GridForm.Content>
						</GridForm.Row>

						<GridForm.Row align="start">
							<GridForm.Label>투표 유형</GridForm.Label>
							<GridForm.Content direction="column" gap="8px">
								<div className="flex gap-4">
									<label className="flex items-center gap-2">
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
									<label className="flex items-center gap-2">
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

						<GridForm.Row align="start">
							<GridForm.Label htmlFor="description">
								투표 설명
							</GridForm.Label>
							<GridForm.Content>
								<textarea
									id="description"
									value={formData.description}
									onChange={(e) => handleChange('description', e.target.value)}
									placeholder="투표에 대한 상세 설명을 입력하세요"
									rows={4}
									className="w-full p-2 border border-border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary"
								/>
							</GridForm.Content>
						</GridForm.Row>
					</GridForm>
				</div>
			</div>

			{/* 커스텀 레이아웃 예제 */}
			<div className="mb-12">
				<h2 className="text-xl font-semibold mb-4 font-multilang">2. 커스텀 레이아웃 (좁은 라벨)</h2>
				<div className="bg-white p-6 rounded-lg border">
					<GridForm labelWidth="100px" gap="16px" maxWidth="600px">
						<GridForm.Row>
							<GridForm.Label htmlFor="start-date">
								<Calendar className="w-4 h-4 mr-1 inline" />
								시작일
							</GridForm.Label>
							<GridForm.Content>
								<input
									id="start-date"
									type="date"
									value={formData.startDate}
									onChange={(e) => handleChange('startDate', e.target.value)}
									className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
								/>
							</GridForm.Content>
						</GridForm.Row>

						<GridForm.Row>
							<GridForm.Label htmlFor="end-date">
								<Calendar className="w-4 h-4 mr-1 inline" />
								종료일
							</GridForm.Label>
							<GridForm.Content>
								<input
									id="end-date"
									type="date"
									value={formData.endDate}
									onChange={(e) => handleChange('endDate', e.target.value)}
									className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
								/>
							</GridForm.Content>
						</GridForm.Row>

						<GridForm.Row>
							<GridForm.Label htmlFor="category">
								<FileText className="w-4 h-4 mr-1 inline" />
								카테고리
							</GridForm.Label>
							<GridForm.Content>
								<select
									id="category"
									value={formData.category}
									onChange={(e) => handleChange('category', e.target.value)}
									className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
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
				<h2 className="text-xl font-semibold mb-4 font-multilang">3. 복잡한 컨텐츠 배치</h2>
				<div className="bg-white p-6 rounded-lg border">
					<GridForm labelWidth="120px">
						<GridForm.Row align="start">
							<GridForm.Label>
								<Settings className="w-4 h-4 mr-1 inline" />
								고급 옵션
							</GridForm.Label>
							<GridForm.Content direction="column" gap="16px">
								<div className="space-y-3">
									<label className="flex items-center gap-2">
										<input
											type="checkbox"
											checked={formData.allowAnonymous}
											onChange={(e) => handleChange('allowAnonymous', e.target.checked)}
											className="rounded border-border text-primary focus:ring-primary"
										/>
										<span className="font-multilang">익명 투표 허용</span>
									</label>
									<label className="flex items-center gap-2">
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
									<div className="flex items-start gap-2">
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
									className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-multilang"
								>
									투표 생성
								</button>
								<button
									type="button"
									className="px-6 py-2 border border-border rounded-md hover:bg-muted transition-colors font-multilang"
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