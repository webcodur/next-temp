'use client';

import React, { useState } from 'react';
import { 
	Dialog, 
	DialogHeader, 
	DialogTitle, 
	DialogDescription, 
	DialogFooter 
} from '@/components/ui/dialog/Dialog';
import { Button } from '@/components/ui/button';

const DialogPage = () => {
	const [basicOpen, setBasicOpen] = useState(false);
	const [variantOpen, setVariantOpen] = useState(false);
	const [currentVariant, setCurrentVariant] = useState<'success' | 'warning' | 'error' | 'info'>('success');
	const [sizeOpen, setSizeOpen] = useState(false);
	const [currentSize, setCurrentSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('sm');
	const [formOpen, setFormOpen] = useState(false);

	const openVariantDialog = (variant: 'success' | 'warning' | 'error' | 'info') => {
		setCurrentVariant(variant);
		setVariantOpen(true);
	};

	const openSizeDialog = (size: 'sm' | 'md' | 'lg' | 'xl') => {
		setCurrentSize(size);
		setSizeOpen(true);
	};

	return (
		<div className="min-h-screen bg-gray-50 p-8">
			<div className="max-w-4xl mx-auto">
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900 mb-4">Dialog 컴포넌트</h1>
					<p className="text-gray-600">고급 다이얼로그 (복잡한 폼/인터랙션) 컴포넌트 테스트</p>
				</div>

				<div className="space-y-8">
					{/* 기본 다이얼로그 */}
					<section className="bg-white rounded-lg p-6 shadow-sm">
						<h2 className="text-xl font-semibold mb-4">기본 다이얼로그</h2>
						<Button onClick={() => setBasicOpen(true)}>
							기본 다이얼로그 열기
						</Button>
					</section>

					{/* 변형 다이얼로그 */}
					<section className="bg-white rounded-lg p-6 shadow-sm">
						<h2 className="text-xl font-semibold mb-4">변형 다이얼로그</h2>
						<div className="space-x-4">
							<Button onClick={() => openVariantDialog('success')}>
								성공 다이얼로그
							</Button>
							<Button onClick={() => openVariantDialog('warning')}>
								경고 다이얼로그
							</Button>
							<Button onClick={() => openVariantDialog('error')}>
								오류 다이얼로그
							</Button>
							<Button onClick={() => openVariantDialog('info')}>
								정보 다이얼로그
							</Button>
						</div>
					</section>

					{/* 사이즈 다이얼로그 */}
					<section className="bg-white rounded-lg p-6 shadow-sm">
						<h2 className="text-xl font-semibold mb-4">사이즈 변형</h2>
						<div className="space-x-4">
							<Button onClick={() => openSizeDialog('sm')}>Small</Button>
							<Button onClick={() => openSizeDialog('md')}>Medium</Button>
							<Button onClick={() => openSizeDialog('lg')}>Large</Button>
							<Button onClick={() => openSizeDialog('xl')}>XLarge</Button>
						</div>
					</section>

					{/* 폼 다이얼로그 */}
					<section className="bg-white rounded-lg p-6 shadow-sm">
						<h2 className="text-xl font-semibold mb-4">폼 다이얼로그</h2>
						<Button onClick={() => setFormOpen(true)}>
							복잡한 폼 다이얼로그 열기
						</Button>
					</section>
				</div>

				{/* 기본 다이얼로그 */}
				<Dialog
					isOpen={basicOpen}
					onClose={() => setBasicOpen(false)}
					title="기본 다이얼로그"
				>
					<DialogHeader>
						<DialogTitle>안내</DialogTitle>
						<DialogDescription>
							이것은 기본 다이얼로그입니다. Modal보다 더 고급 기능을 제공합니다.
						</DialogDescription>
					</DialogHeader>
					
					<p className="text-gray-600">
						ESC 키로 닫거나 오버레이를 클릭하여 닫을 수 있습니다.
					</p>
					
					<DialogFooter>
						<Button onClick={() => setBasicOpen(false)}>확인</Button>
					</DialogFooter>
				</Dialog>

				{/* 변형 다이얼로그 */}
				<Dialog
					isOpen={variantOpen}
					onClose={() => setVariantOpen(false)}
					title={`${currentVariant} 다이얼로그`}
					variant={currentVariant}
				>
					<p className="text-gray-600">
						{currentVariant} 변형의 다이얼로그입니다. 아이콘과 테두리 색상이 변형에 따라 달라집니다.
					</p>
					
					<DialogFooter>
						<Button onClick={() => setVariantOpen(false)}>닫기</Button>
					</DialogFooter>
				</Dialog>

				{/* 사이즈 다이얼로그 */}
				<Dialog
					isOpen={sizeOpen}
					onClose={() => setSizeOpen(false)}
					title={`${currentSize.toUpperCase()} 사이즈`}
					size={currentSize}
				>
					<p className="text-gray-600">
						이것은 {currentSize} 사이즈의 다이얼로그입니다.
					</p>
					
					<DialogFooter>
						<Button onClick={() => setSizeOpen(false)}>닫기</Button>
					</DialogFooter>
				</Dialog>

				{/* 폼 다이얼로그 */}
				<Dialog
					isOpen={formOpen}
					onClose={() => setFormOpen(false)}
					title="사용자 정보 입력"
					size="lg"
				>
					<form className="space-y-4">
						<div className="grid grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									이름
								</label>
								<input
									type="text"
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									placeholder="이름을 입력하세요"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									이메일
								</label>
								<input
									type="email"
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									placeholder="이메일을 입력하세요"
								/>
							</div>
						</div>
						
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								자기소개
							</label>
							<textarea
								rows={4}
								className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								placeholder="간단한 자기소개를 작성해주세요"
							/>
						</div>
						
						<div className="flex items-center">
							<input
								type="checkbox"
								className="mr-2"
								id="agree"
							/>
							<label htmlFor="agree" className="text-sm text-gray-600">
								개인정보 처리방침에 동의합니다
							</label>
						</div>
					</form>
					
					<DialogFooter>
						<Button 
							onClick={() => setFormOpen(false)}
							className="mr-2 bg-gray-500 hover:bg-gray-600"
						>
							취소
						</Button>
						<Button onClick={() => {
							alert('폼이 제출되었습니다!');
							setFormOpen(false);
						}}>
							제출
						</Button>
					</DialogFooter>
				</Dialog>
			</div>
		</div>
	);
};

export default DialogPage; 