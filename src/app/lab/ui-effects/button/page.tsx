'use client';

import React from 'react';
import { Button } from '@/components/ui/ui-input/button/Button';
import { useTranslations } from '@/hooks/ui-hooks/useI18n';

const ButtonPage = () => {
	const t = useTranslations();

	return (
		<div className="min-h-screen bg-muted p-8">
			<div className="max-w-4xl mx-auto">
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-foreground mb-4">{t('버튼_제목')}</h1>
					<p className="text-muted-foreground">{t('버튼_설명')}</p>
				</div>

				<div className="space-y-8">
					{/* 기본 버튼 */}
					<section className="bg-background rounded-lg p-6 shadow-xs">
						<h2 className="text-xl font-semibold mb-4">{t('버튼_기본버튼')}</h2>
						<div className="space-x-4">
							<Button>{t('버튼_기본버튼텍스트')}</Button>
							<Button disabled>{t('버튼_비활성버튼')}</Button>
						</div>
					</section>

					{/* 사이즈 variants */}
					<section className="bg-background rounded-lg p-6 shadow-xs">
						<h2 className="text-xl font-semibold mb-4">{t('버튼_사이즈변형')}</h2>
						<div className="space-x-4 flex items-center">
							<Button className="px-3 py-1 text-sm">{t('버튼_Small')}</Button>
							<Button>{t('버튼_Medium')}</Button>
							<Button className="px-6 py-3 text-lg">{t('버튼_Large')}</Button>
						</div>
					</section>

					{/* 클릭 이벤트 */}
					<section className="bg-background rounded-lg p-6 shadow-xs">
						<h2 className="text-xl font-semibold mb-4">{t('버튼_인터랙션')}</h2>
						<div className="space-x-4">
							<Button onClick={() => alert(t('버튼_클릭되었습니다'))}>
								{t('버튼_클릭테스트')}
							</Button>
							<Button onClick={() => console.log('콘솔 로그')}>
								{t('버튼_콘솔로그')}
							</Button>
						</div>
					</section>
				</div>
			</div>
		</div>
	);
};

export default ButtonPage; 