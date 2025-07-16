'use client';

import React from 'react';
import { Accordion, AccordionGroup } from './Accordion';
import { useTranslations } from '@/hooks/useI18n';

const AccordionExample = () => {
	const t = useTranslations();
	
	return (
		<div className="p-8 min-h-screen bg-background">
			<div className="mx-auto max-w-4xl">
				<div className="mb-8">
					<h1 className="mb-4 text-3xl font-bold text-foreground font-multilang">{t('아코디언_제목')}</h1>
					<p className="text-muted-foreground font-multilang">{t('아코디언_설명')}</p>
				</div>

				<div className="space-y-8">
					{/* 기본 아코디언 */}
					<section className="p-6 rounded-lg bg-card neu-flat">
						<h2 className="mb-4 text-xl font-semibold text-foreground font-multilang">{t('아코디언_기본')}</h2>
						<Accordion title={t('아코디언_기본제목')} defaultOpen={true}>
							<div className="p-4 rounded-lg bg-muted">
								<p className="text-foreground font-multilang">
									{t('아코디언_기본내용')}
								</p>
							</div>
						</Accordion>
					</section>

					{/* 상태 텍스트가 있는 아코디언 */}
					<section className="p-6 rounded-lg bg-card neu-flat">
						<h2 className="mb-4 text-xl font-semibold text-foreground font-multilang">{t('아코디언_상태텍스트')}</h2>
						<Accordion 
							title={t('아코디언_설정옵션')} 
							statusText={t('아코디언_3개항목')} 
							defaultOpen={false}
							onToggle={(isOpen) => console.log('Accordion toggled:', isOpen)}
						>
							<div className="space-y-3">
								<div className="flex gap-3 items-center">
									<input type="checkbox" id="option1" className="rounded" />
									<label htmlFor="option1" className="text-sm text-foreground font-multilang">
										{t('아코디언_옵션1')}
									</label>
								</div>
								<div className="flex gap-3 items-center">
									<input type="checkbox" id="option2" className="rounded" />
									<label htmlFor="option2" className="text-sm text-foreground font-multilang">
										{t('아코디언_옵션2')}
									</label>
								</div>
								<div className="flex gap-3 items-center">
									<input type="checkbox" id="option3" className="rounded" />
									<label htmlFor="option3" className="text-sm text-foreground font-multilang">
										{t('아코디언_옵션3')}
									</label>
								</div>
							</div>
						</Accordion>
					</section>

					{/* 비활성화된 아코디언 */}
					<section className="p-6 rounded-lg bg-card neu-flat">
						<h2 className="mb-4 text-xl font-semibold text-foreground font-multilang">{t('아코디언_비활성화')}</h2>
						<Accordion 
							title={t('아코디언_비활성화섹션')} 
							statusText={t('아코디언_접근불가')} 
							disabled={true}
						>
							<div className="p-4 rounded-lg bg-muted">
								<p className="text-muted-foreground font-multilang">
									{t('아코디언_비활성화내용')}
								</p>
							</div>
						</Accordion>
					</section>

					{/* 아코디언 그룹 */}
					<section className="p-6 rounded-lg bg-card neu-flat">
						<h2 className="mb-4 text-xl font-semibold text-foreground font-multilang">{t('아코디언_그룹')}</h2>
						<AccordionGroup>
							<Accordion title={t('아코디언_첫번째섹션')} defaultOpen={true}>
								<div className="p-4 rounded-lg bg-primary/5">
									<h3 className="mb-2 font-semibold text-primary font-multilang">{t('아코디언_첫번째섹션')}</h3>
									<p className="text-foreground font-multilang">
										{t('아코디언_첫번째내용')}
									</p>
								</div>
							</Accordion>
							
							<Accordion title={t('아코디언_두번째섹션')} statusText={t('아코디언_중요')}>
								<div className="p-4 bg-green-50 rounded-lg">
									<h3 className="mb-2 font-semibold text-green-800 font-multilang">{t('아코디언_두번째섹션')}</h3>
									<p className="text-green-700 font-multilang">
										{t('아코디언_두번째내용')}
									</p>
								</div>
							</Accordion>
							
							<Accordion title={t('아코디언_세번째섹션')}>
								<div className="p-4 bg-purple-50 rounded-lg">
									<h3 className="mb-2 font-semibold text-purple-800 font-multilang">{t('아코디언_세번째섹션')}</h3>
									<ul className="space-y-1 text-purple-700">
										<li className="font-multilang">• {t('아코디언_목록항목1')}</li>
										<li className="font-multilang">• {t('아코디언_목록항목2')}</li>
										<li className="font-multilang">• {t('아코디언_목록항목3')}</li>
									</ul>
								</div>
							</Accordion>
						</AccordionGroup>
					</section>

					{/* 기능 설명 */}
					<section className="p-6 rounded-lg bg-card neu-flat">
						<h2 className="mb-4 text-xl font-semibold text-foreground font-multilang">{t('아코디언_주요기능')}</h2>
						<ul className="space-y-2 text-muted-foreground">
							<li className="font-multilang">• {t('아코디언_기능1')}</li>
							<li className="font-multilang">• {t('아코디언_기능2')}</li>
							<li className="font-multilang">• {t('아코디언_기능3')}</li>
							<li className="font-multilang">• {t('아코디언_기능4')}</li>
							<li className="font-multilang">• {t('아코디언_기능5')}</li>
							<li className="font-multilang">• {t('아코디언_기능6')}</li>
							<li className="font-multilang">• {t('아코디언_기능7')}</li>
						</ul>
					</section>
				</div>
			</div>
		</div>
	);
};

export default AccordionExample; 