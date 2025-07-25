'use client';

import React from 'react';
import { Accordion, AccordionGroup } from '@/components/ui/ui-layout/accordion/Accordion';

const AccordionColorTest = () => {
	return (
		<div className="p-8 min-h-screen bg-background">
			<div className="mx-auto max-w-4xl space-y-8">
				<div className="mb-8">
					<h1 className="mb-4 text-3xl font-bold text-foreground font-multilang">어코디언 색상 테스트</h1>
					<p className="text-muted-foreground font-multilang">현재 적용된 색상: primary 시스템</p>
				</div>

				{/* 기본 테스트 */}
				<section className="p-6 rounded-lg bg-card neu-flat">
					<h2 className="mb-4 text-xl font-semibold text-foreground font-multilang">기본 색상 테스트</h2>
					<div className="space-y-4">
						<Accordion title="기본 아코디언" defaultOpen={false}>
							<div className="p-4 rounded-lg bg-muted">
								<p className="text-foreground font-multilang">닫힌 상태: bg-surface-2 (부드러운 회색)</p>
								<p className="text-foreground font-multilang">열린 상태: bg-primary-1 (연한 블루)</p>
								<p className="text-foreground font-multilang">호버 상태: bg-primary-2 (중간 블루)</p>
							</div>
						</Accordion>

						<Accordion title="상태 텍스트 테스트" statusText="상태 표시" defaultOpen={true}>
							<div className="p-4 rounded-lg bg-muted">
								<p className="text-foreground font-multilang">상태 텍스트 색상: text-primary-6 (진한 블루)</p>
								<p className="text-foreground font-multilang">현재 열린 상태로 색상을 확인해보세요.</p>
							</div>
						</Accordion>

						<Accordion title="비활성화 테스트" statusText="사용 불가" disabled={true}>
							<div className="p-4 rounded-lg bg-muted">
								<p className="text-muted-foreground font-multilang">비활성화 상태에서는 클릭이 되지 않습니다.</p>
							</div>
						</Accordion>
					</div>
				</section>

				{/* 그룹 테스트 */}
				<section className="p-6 rounded-lg bg-card neu-flat">
					<h2 className="mb-4 text-xl font-semibold text-foreground font-multilang">그룹 테스트</h2>
					<AccordionGroup>
						<Accordion title="첫 번째 아코디언" statusText="활성">
							<div className="p-4 rounded-lg bg-primary/5">
								<p className="text-foreground font-multilang">첫 번째 아코디언 내용</p>
							</div>
						</Accordion>
						
						<Accordion title="두 번째 아코디언" statusText="대기중">
							<div className="p-4 rounded-lg bg-secondary/5">
								<p className="text-foreground font-multilang">두 번째 아코디언 내용</p>
							</div>
						</Accordion>
						
						<Accordion title="세 번째 아코디언" defaultOpen={true}>
							<div className="p-4 rounded-lg bg-success/10">
								<p className="text-foreground font-multilang">세 번째 아코디언 내용 (기본 열림)</p>
							</div>
						</Accordion>
					</AccordionGroup>
				</section>

				{/* 색상 가이드 */}
				<section className="p-6 rounded-lg bg-card neu-flat">
					<h2 className="mb-4 text-xl font-semibold text-foreground font-multilang">현재 색상 시스템</h2>
					<div className="grid grid-cols-2 gap-4 text-sm">
						<div className="p-3 rounded bg-surface-2 border">
							<p className="font-semibold font-multilang">닫힌 상태</p>
							<p className="text-xs text-muted-foreground font-multilang">bg-surface-2</p>
						</div>
						<div className="p-3 rounded bg-primary-1 border">
							<p className="font-semibold font-multilang">열린 상태</p>
							<p className="text-xs text-muted-foreground font-multilang">bg-primary-1</p>
						</div>
						<div className="p-3 rounded bg-primary-2 border">
							<p className="font-semibold font-multilang">호버 상태</p>
							<p className="text-xs text-muted-foreground font-multilang">bg-primary-2</p>
						</div>
						<div className="p-3 rounded border">
							<p className="font-semibold text-primary-6 font-multilang">상태 텍스트</p>
							<p className="text-xs text-muted-foreground font-multilang">text-primary-6</p>
						</div>
					</div>
				</section>

				{/* 사용법 */}
				<section className="p-6 rounded-lg bg-card neu-flat">
					<h2 className="mb-4 text-xl font-semibold text-foreground font-multilang">간단한 사용법</h2>
					<div className="bg-muted p-4 rounded font-mono text-sm">
						<div className="text-muted-foreground font-multilang">
							{`<Accordion title="제목">`}<br/>
							{`  <p>내용</p>`}<br/>
							{`</Accordion>`}
						</div>
					</div>
					<p className="mt-2 text-sm text-muted-foreground font-multilang">
						colorVariant prop 제거됨 - 하나의 깔끔한 색상 시스템만 사용
					</p>
				</section>
			</div>
		</div>
	);
};

export default AccordionColorTest; 