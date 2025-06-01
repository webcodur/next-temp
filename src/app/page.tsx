import { MainLayout } from '@/components/layout/main-layout';

export default function Home() {
	return (
		<MainLayout>
			<div className="space-y-8">
				{/* #region Welcome Section */}
				<div className="bg-card p-6 rounded-lg border border-border">
					<h1 className="text-3xl font-bold text-foreground mb-4">
						환영합니다! 🎉
					</h1>
					<p className="text-lg text-muted-foreground mb-6">
						이것은 평범한 보일러플레이트 레이아웃입니다. 사이드바와 헤더가
						포함된 기본적인 대시보드 구조를 제공합니다.
					</p>
					<div className="flex gap-4">
						<button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
							시작하기
						</button>
						<button className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90">
							문서 보기
						</button>
					</div>
				</div>
				{/* #endregion */}

				{/* #region Features Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					<div className="bg-card p-6 rounded-lg border border-border">
						<h3 className="text-lg font-semibold text-foreground mb-2">
							반응형 디자인
						</h3>
						<p className="text-muted-foreground">
							모든 디바이스에서 완벽하게 작동하는 반응형 레이아웃
						</p>
					</div>

					<div className="bg-card p-6 rounded-lg border border-border">
						<h3 className="text-lg font-semibold text-foreground mb-2">
							다크 모드 지원
						</h3>
						<p className="text-muted-foreground">
							라이트/다크 테마를 자동으로 지원하는 색상 시스템
						</p>
					</div>

					<div className="bg-card p-6 rounded-lg border border-border">
						<h3 className="text-lg font-semibold text-foreground mb-2">
							TypeScript
						</h3>
						<p className="text-muted-foreground">
							타입 안전성을 보장하는 TypeScript 기반 개발
						</p>
					</div>
				</div>
				{/* #endregion */}

				{/* #region Stats Section */}
				<div className="bg-card p-6 rounded-lg border border-border">
					<h2 className="text-xl font-semibold text-foreground mb-4">
						프로젝트 통계
					</h2>
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
						<div className="text-center">
							<div className="text-2xl font-bold text-primary">24</div>
							<div className="text-sm text-muted-foreground">컴포넌트</div>
						</div>
						<div className="text-center">
							<div className="text-2xl font-bold text-primary">8</div>
							<div className="text-sm text-muted-foreground">페이지</div>
						</div>
						<div className="text-center">
							<div className="text-2xl font-bold text-primary">100%</div>
							<div className="text-sm text-muted-foreground">TypeScript</div>
						</div>
						<div className="text-center">
							<div className="text-2xl font-bold text-primary">∞</div>
							<div className="text-sm text-muted-foreground">가능성</div>
						</div>
					</div>
				</div>
				{/* #endregion */}
			</div>
		</MainLayout>
	);
}
