'use client';

import React from 'react';
import { Button } from '@/components/ui/ui-input/button/Button';
import { useTranslations } from '@/hooks/ui-hooks/useI18n';

const ButtonPage = () => {
	const t = useTranslations();

	return (
		<div className="p-8 min-h-screen bg-muted">
			<div className="mx-auto max-w-4xl">
				<div className="mb-8">
					<h1 className="mb-4 text-3xl font-bold text-foreground">{t('버튼_제목')}</h1>
					<p className="text-muted-foreground">{t('버튼_설명')}</p>
				</div>

				<div className="space-y-8">
					{/* 기본 버튼 */}
					<section className="p-6 rounded-lg bg-background shadow-xs">
						<h2 className="mb-4 text-xl font-semibold">{t('버튼_기본버튼')}</h2>
						<div className="space-x-4">
							<Button>{t('버튼_기본버튼텍스트')}</Button>
							<Button disabled>{t('버튼_비활성버튼')}</Button>
						</div>
					</section>

					{/* 사이즈 variants */}
					<section className="p-6 rounded-lg bg-background shadow-xs">
						<h2 className="mb-4 text-xl font-semibold">{t('버튼_사이즈변형')}</h2>
						<div className="flex items-center space-x-4">
							<Button className="px-3 py-1 text-sm">{t('버튼_Small')}</Button>
							<Button>{t('버튼_Medium')}</Button>
							<Button className="px-6 py-3 text-lg">{t('버튼_Large')}</Button>
						</div>
					</section>

					{/* 클릭 이벤트 */}
					<section className="p-6 rounded-lg bg-background shadow-xs">
						<h2 className="mb-4 text-xl font-semibold">{t('버튼_인터랙션')}</h2>
						<div className="space-x-4">
							<Button onClick={() => alert(t('버튼_클릭되었습니다'))}>
								{t('버튼_클릭테스트')}
							</Button>
						</div>
					</section>
				</div>
			</div>
		</div>
	);
};

export default ButtonPage; 