'use client';

import React from 'react';
import { Button } from '@/components/ui/button';

const ButtonPage = () => {
	return (
		<div className="min-h-screen bg-muted p-8">
			<div className="max-w-4xl mx-auto">
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-foreground mb-4">Button 컴포넌트</h1>
					<p className="text-muted-foreground">기본 버튼 컴포넌트 테스트</p>
				</div>

				<div className="space-y-8">
					{/* 기본 버튼 */}
					<section className="bg-background rounded-lg p-6 shadow-xs">
						<h2 className="text-xl font-semibold mb-4">기본 버튼</h2>
						<div className="space-x-4">
							<Button>기본 버튼</Button>
							<Button disabled>비활성 버튼</Button>
						</div>
					</section>

					{/* 사이즈 variants */}
					<section className="bg-background rounded-lg p-6 shadow-xs">
						<h2 className="text-xl font-semibold mb-4">사이즈 변형</h2>
						<div className="space-x-4 flex items-center">
							<Button className="px-3 py-1 text-sm">Small</Button>
							<Button>Medium</Button>
							<Button className="px-6 py-3 text-lg">Large</Button>
						</div>
					</section>

					{/* 클릭 이벤트 */}
					<section className="bg-background rounded-lg p-6 shadow-xs">
						<h2 className="text-xl font-semibold mb-4">인터랙션</h2>
						<div className="space-x-4">
							<Button onClick={() => alert('버튼이 클릭되었습니다!')}>
								클릭 테스트
							</Button>
							<Button onClick={() => console.log('콘솔 로그')}>
								콘솔 로그
							</Button>
						</div>
					</section>
				</div>
			</div>
		</div>
	);
};

export default ButtonPage; 