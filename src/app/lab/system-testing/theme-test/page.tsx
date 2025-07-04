'use client';

import { useAtom } from 'jotai';
import { Moon, Sun, Palette, Eye, EyeOff, Settings } from 'lucide-react';
import { themeAtom } from '@/store/theme';
import { ThemeToggle } from '@/components/ui/ui-layout/theme-toggle/ThemeToggle';
import { Button } from '@/components/ui/ui-input/button/Button';

export default function ThemeTestPage() {
	const [theme] = useAtom(themeAtom);

	const colors = [
		{ name: 'Primary', class: 'bg-primary text-primary-foreground' },
		{ name: 'Secondary', class: 'bg-secondary text-secondary-foreground' },
		{ name: 'Accent', class: 'bg-accent text-accent-foreground' },
		{ name: 'Destructive', class: 'bg-destructive text-destructive-foreground' },
		{ name: 'Warning', class: 'bg-warning text-warning-foreground' },
		{ name: 'Success', class: 'bg-success text-success-foreground' },
		{ name: 'Muted', class: 'bg-muted text-muted-foreground' },
	];

	const neuElements = [
		{ name: 'Flat (기본 컨테이너)', class: 'neu-flat' },
		{ name: 'Raised (기본 버튼)', class: 'neu-raised' },
		{ name: 'Inset (활성 상태)', class: 'neu-inset' },
		{ name: 'Hover Effect', class: 'neu-flat neu-hover' },
	];

	return (
		<div className="p-6 mx-auto space-y-8 max-w-6xl">
			{/* 제목 & 테마 정보 */}
			<div className="p-6 rounded-lg neu-flat">
				<div className="flex justify-between items-center mb-4">
					<h1 className="text-3xl font-bold text-foreground font-multilang">
						🎨 블랙&화이트 테마 시스템 테스트
					</h1>
					<div className="flex gap-4 items-center">
						<div className="text-sm text-muted-foreground">
							현재 테마: <span className="font-semibold text-primary">{theme}</span>
						</div>
						<ThemeToggle variant="button" />
					</div>
				</div>
				<p className="text-muted-foreground font-multilang">
					다크/라이트 모드 전환과 뉴모피즘 디자인 시스템의 가시성을 테스트합니다.
				</p>
			</div>

			{/* 색상 팔레트 */}
			<div className="p-6 rounded-lg neu-flat">
				<h2 className="mb-4 text-xl font-semibold text-foreground font-multilang">
					<Palette className="inline mr-2" size={20} />
					색상 팔레트 - 가시성 개선
				</h2>
				<div className="grid grid-cols-2 gap-4 md:grid-cols-4">
					{colors.map((color) => (
						<div
							key={color.name}
							className={`${color.class} p-4 rounded-lg text-center font-multilang font-medium`}
						>
							{color.name}
						</div>
					))}
				</div>
			</div>

			{/* 뉴모피즘 요소들 */}
			<div className="p-6 rounded-lg neu-flat">
				<h2 className="mb-4 text-xl font-semibold text-foreground font-multilang">
					<Eye className="inline mr-2" size={20} />
					뉴모피즘 시스템
				</h2>
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
					{neuElements.map((element) => (
						<div
							key={element.name}
							className={`${element.class} p-6 rounded-lg transition-all duration-150`}
						>
							<h3 className="mb-2 font-semibold text-foreground font-multilang">
								{element.name}
							</h3>
							<p className="text-sm text-muted-foreground font-multilang">
								CSS 클래스: <code className="text-primary">{element.class}</code>
							</p>
						</div>
					))}
				</div>
			</div>

			{/* 버튼 variants */}
			<div className="p-6 rounded-lg neu-flat">
				<h2 className="mb-4 text-xl font-semibold text-foreground font-multilang">
					<Settings className="inline mr-2" size={20} />
					버튼 Variants
				</h2>
				<div className="flex flex-wrap gap-3">
					<Button variant="default">Default</Button>
					<Button variant="secondary">Secondary</Button>
					<Button variant="accent">Accent</Button>
					<Button variant="success">Success</Button>
					<Button variant="warning">Warning</Button>
					<Button variant="destructive">Destructive</Button>
					<Button variant="outline">Outline</Button>
					<Button variant="ghost">Ghost</Button>
					<Button variant="inset">Inset</Button>
					<Button variant="link">Link</Button>
				</div>
			</div>

			{/* 인터랙티브 테스트 */}
			<div className="p-6 rounded-lg neu-flat">
				<h2 className="mb-4 text-xl font-semibold text-foreground font-multilang">
					<EyeOff className="inline mr-2" size={20} />
					인터랙션 테스트
				</h2>
				<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
					{/* 아이콘 버튼들 */}
					<div className="neu-raised p-4 rounded-lg cursor-pointer hover:scale-[1.02] transition-all">
						<Moon className="mx-auto mb-2 neu-icon-active" size={24} />
						<p className="text-sm text-center font-multilang">아이콘 Active</p>
					</div>
					
					<div className="p-4 rounded-lg cursor-pointer neu-flat neu-hover">
						<Sun className="mx-auto mb-2 neu-icon-inactive" size={24} />
						<p className="text-sm text-center font-multilang">아이콘 Inactive + Hover</p>
					</div>
					
					<div className="p-4 rounded-lg neu-inset">
						<Palette className="mx-auto mb-2 neu-icon-active" size={24} />
						<p className="text-sm text-center font-multilang">선택된 상태</p>
					</div>
				</div>
			</div>

			{/* 테마별 CSS 변수 표시 */}
			<div className="p-6 rounded-lg neu-flat">
				<h2 className="mb-4 text-xl font-semibold text-foreground font-multilang">
					CSS 변수 (현재 {theme} 모드)
				</h2>
				<div className="grid grid-cols-1 gap-4 font-mono text-sm md:grid-cols-2">
					<div className="space-y-2">
						<div className="text-muted-foreground">핵심 색상:</div>
						<div>--background: <span className="text-primary">배경색</span></div>
						<div>--foreground: <span className="text-primary">텍스트</span></div>
						<div>--primary: <span className="text-primary">주요 강조</span></div>
						<div>--accent: <span className="text-accent">액센트</span></div>
					</div>
					<div className="space-y-2">
						<div className="text-muted-foreground">뉴모피즘:</div>
						<div>--nm-light-rgba: <span className="text-primary">밝은 그림자</span></div>
						<div>--nm-dark-rgba: <span className="text-primary">어두운 그림자</span></div>
						<div>--nm-offset: <span className="text-primary">그림자 거리</span></div>
						<div>--nm-blur: <span className="text-primary">그림자 블러</span></div>
					</div>
				</div>
			</div>
		</div>
	);
} 