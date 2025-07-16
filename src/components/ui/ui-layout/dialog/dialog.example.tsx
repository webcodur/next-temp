'use client';

import React, { useState } from 'react';
import { 
	Dialog, 
	DialogHeader, 
	DialogTitle, 
	DialogDescription, 
	DialogFooter,
} from './Dialog';
import { Button } from '@/components/ui/ui-input/button/Button';
import { useTranslations } from '@/hooks/useI18n';

const DialogExample = () => {
	const t = useTranslations();
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
		<div className="p-8 min-h-screen">
			<div className="mx-auto max-w-4xl">
				<div className="mb-8">
					<h1 className="mb-4 text-3xl font-bold">{t('다이얼로그테스트_제목')}</h1>
					<p className="text-gray-600">{t('다이얼로그테스트_설명')}</p>
				</div>

				<div className="space-y-8">
					{/* 기본 다이얼로그 */}
					<section className="p-6 bg-white rounded-lg shadow-xs">
						<h2 className="mb-4 text-xl font-semibold">{t('다이얼로그테스트_기본다이얼로그')}</h2>
						<Button onClick={() => setBasicOpen(true)}>
							{t('다이얼로그테스트_기본다이얼로그열기')}
						</Button>
					</section>

					{/* 변형 다이얼로그 */}
					<section className="p-6 bg-white rounded-lg shadow-xs">
						<h2 className="mb-4 text-xl font-semibold">{t('다이얼로그테스트_변형다이얼로그')}</h2>
						<div className="space-x-4">
							<Button onClick={() => openVariantDialog('success')}>
								{t('다이얼로그테스트_성공다이얼로그')}
							</Button>
							<Button onClick={() => openVariantDialog('warning')}>
								{t('다이얼로그테스트_경고다이얼로그')}
							</Button>
							<Button onClick={() => openVariantDialog('error')}>
								{t('다이얼로그테스트_오류다이얼로그')}
							</Button>
							<Button onClick={() => openVariantDialog('info')}>
								{t('다이얼로그테스트_정보다이얼로그')}
							</Button>
						</div>
					</section>

					{/* 사이즈 다이얼로그 */}
					<section className="p-6 bg-white rounded-lg shadow-xs">
						<h2 className="mb-4 text-xl font-semibold">{t('다이얼로그테스트_사이즈변형')}</h2>
						<div className="space-x-4">
							<Button onClick={() => openSizeDialog('sm')}>{t('다이얼로그테스트_Small')}</Button>
							<Button onClick={() => openSizeDialog('md')}>{t('다이얼로그테스트_Medium')}</Button>
							<Button onClick={() => openSizeDialog('lg')}>{t('다이얼로그테스트_Large')}</Button>
							<Button onClick={() => openSizeDialog('xl')}>{t('다이얼로그테스트_XLarge')}</Button>
						</div>
					</section>

					{/* 폼 다이얼로그 */}
					<section className="p-6 bg-white rounded-lg shadow-xs">
						<h2 className="mb-4 text-xl font-semibold">{t('다이얼로그테스트_폼다이얼로그')}</h2>
						<Button onClick={() => setFormOpen(true)}>
							{t('다이얼로그테스트_복잡한폼다이얼로그열기')}
						</Button>
					</section>
				</div>

				{/* 기본 다이얼로그 */}
				<Dialog
					isOpen={basicOpen}
					onClose={() => setBasicOpen(false)}
					title={t('다이얼로그테스트_기본다이얼로그')}
				>
					<DialogHeader>
						<DialogTitle>{t('다이얼로그테스트_안내')}</DialogTitle>
						<DialogDescription>
							{t('다이얼로그테스트_기본다이얼로그설명')}
						</DialogDescription>
					</DialogHeader>
					
					<p className="text-gray-600">
						{t('다이얼로그테스트_사용법안내')}
					</p>
					
					<DialogFooter>
						<Button onClick={() => setBasicOpen(false)}>{t('다이얼로그테스트_확인')}</Button>
					</DialogFooter>
				</Dialog>

				{/* 변형 다이얼로그 */}
				<Dialog
					isOpen={variantOpen}
					onClose={() => setVariantOpen(false)}
					title={t('다이얼로그테스트_변형다이얼로그제목').replace('{variant}', currentVariant)}
					variant={currentVariant}
				>
					<p className="text-gray-600">
						{t('다이얼로그테스트_변형다이얼로그설명').replace('{variant}', currentVariant)}
					</p>
					
					<DialogFooter>
						<Button onClick={() => setVariantOpen(false)}>{t('다이얼로그테스트_닫기')}</Button>
					</DialogFooter>
				</Dialog>

				{/* 사이즈 다이얼로그 */}
				<Dialog
					isOpen={sizeOpen}
					onClose={() => setSizeOpen(false)}
					title={t('다이얼로그테스트_사이즈제목').replace('{size}', currentSize.toUpperCase())}
					size={currentSize}
				>
					<p className="text-gray-600">
						{t('다이얼로그테스트_사이즈설명').replace('{size}', currentSize)}
					</p>
					
					<DialogFooter>
						<Button onClick={() => setSizeOpen(false)}>{t('다이얼로그테스트_닫기')}</Button>
					</DialogFooter>
				</Dialog>

				{/* 폼 다이얼로그 */}
				<Dialog
					isOpen={formOpen}
					onClose={() => setFormOpen(false)}
					title={t('다이얼로그테스트_사용자정보입력')}
					size="lg"
				>
					<form className="space-y-4">
						<div className="grid grid-cols-2 gap-4">
							<div>
								<label className="block mb-2 text-sm font-medium text-gray-700">
									{t('다이얼로그테스트_이름')}
								</label>
								<input
									type="text"
									className="px-3 py-2 w-full rounded-lg border border-primary focus:ring-2 focus:ring-primary focus:border-transparent"
									placeholder={t('다이얼로그테스트_이름입력')}
								/>
							</div>
							<div>
								<label className="block mb-2 text-sm font-medium text-gray-700">
									{t('다이얼로그테스트_이메일')}
								</label>
								<input
									type="email"
									className="px-3 py-2 w-full rounded-lg border border-primary focus:ring-2 focus:ring-primary focus:border-transparent"
									placeholder={t('다이얼로그테스트_이메일입력')}
								/>
							</div>
						</div>
						
						<div>
							<label className="block mb-2 text-sm font-medium text-gray-700">
								{t('다이얼로그테스트_자기소개')}
							</label>
							<textarea
								rows={4}
								className="px-3 py-2 w-full rounded-lg border border-primary focus:ring-2 focus:ring-primary focus:border-transparent"
								placeholder={t('다이얼로그테스트_자기소개입력')}
							/>
						</div>
						
						<div className="flex items-center">
							<input
								type="checkbox"
								className="me-2"
								id="agree"
							/>
							<label htmlFor="agree" className="text-sm text-gray-600">
								{t('다이얼로그테스트_개인정보동의')}
							</label>
						</div>
					</form>
					
					<DialogFooter>
						<Button 
							onClick={() => setFormOpen(false)}
							className="me-2 bg-gray-500 hover:bg-gray-600"
						>
							{t('다이얼로그테스트_취소')}
						</Button>
						<Button onClick={() => {
							alert(t('다이얼로그테스트_폼제출완료'));
							setFormOpen(false);
						}}>
							{t('다이얼로그테스트_제출')}
						</Button>
					</DialogFooter>
				</Dialog>
			</div>
		</div>
	);
};

export default DialogExample; 