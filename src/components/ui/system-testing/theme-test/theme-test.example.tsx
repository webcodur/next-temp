/*
  파일명: src/components/ui/system-testing/theme-test/theme-test.example.tsx
  기능: 라이트/다크 테마 및 뉴모피즘 시스템을 시각적으로 테스트하는 예제
  책임: 색상 팔레트, 뉴모피즘 요소, 버튼 스타일, 아이콘 상태 등 테마에 따른 모든 UI 요소의 렌더링을 검증한다.
*/

'use client';

import { useAtom } from 'jotai';
import { Moon, Sun, Palette, Eye, EyeOff, Settings } from 'lucide-react';

import { Button } from '@/components/ui/ui-input/button/Button';
import { ThemeToggle } from '@/components/ui/ui-layout/theme-toggle/ThemeToggle';
import { useTranslations } from '@/hooks/useI18n';
import { themeAtom } from '@/store/theme';

interface ThemeTestProps {
	colorVariant?: 'primary' | 'secondary';
}

export default function ThemeTestExample({ colorVariant = 'primary' }: ThemeTestProps = {}) {
	// #region 훅 및 상태
	const [theme] = useAtom(themeAtom);
	const t = useTranslations();
	// #endregion

	// #region 색상 variant에 따른 스타일
	const primaryColorClass = colorVariant === 'primary' ? 'text-primary' : 'text-secondary';
	// #endregion

	// #region 상수: 색상 및 뉴모피즘 요소
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
	// #endregion

	// #region 렌더링
	return (
		<div className="p-6 mx-auto space-y-8 max-w-6xl">
			{/* 제목 및 테마 정보 */}
			<div className="p-6 rounded-lg neu-flat">
				<div className="flex justify-between items-center mb-4">
					<h1 className="text-3xl font-bold text-foreground font-multilang">
						{t('테마테스트_제목')}
					</h1>
					<div className="flex gap-4 items-center">
						<div className="text-sm text-muted-foreground">
							{t('테마테스트_현재테마')} <span className={`font-semibold ${primaryColorClass}`}>{theme}</span>
						</div>
						<ThemeToggle showLabel={true} />
					</div>
				</div>
				<p className="text-muted-foreground font-multilang">
					{t('테마테스트_설명')}
				</p>
			</div>

			{/* 색상 팔레트 */}
			<div className="p-6 rounded-lg neu-flat">
				<h2 className="mb-4 text-xl font-semibold text-foreground font-multilang">
					<Palette className="inline me-2" size={20} />
					{t('테마테스트_색상팔레트')}
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
					<Eye className="inline me-2" size={20} />
					{t('테마테스트_뉴모피즘시스템')}
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
								CSS 클래스: <code className={primaryColorClass}>{element.class}</code>
							</p>
						</div>
					))}
				</div>
			</div>

			{/* 버튼 variants */}
			<div className="p-6 rounded-lg neu-flat">
				<h2 className="mb-4 text-xl font-semibold text-foreground font-multilang">
					<Settings className="inline me-2" size={20} />
					{t('테마테스트_버튼variants')}
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
					<EyeOff className="inline me-2" size={20} />
					{t('테마테스트_인터랙션테스트')}
				</h2>
				<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
					{/* 아이콘 버튼들 */}
					<div className="neu-raised p-4 rounded-lg cursor-pointer hover:scale-[1.02] transition-all">
						<Moon className="mx-auto mb-2 neu-icon-active" size={24} />
						<p className="text-sm text-center font-multilang">{t('테마테스트_아이콘활성')}</p>
					</div>
					
					<div className="p-4 rounded-lg cursor-pointer neu-flat neu-hover">
						<Sun className="mx-auto mb-2 neu-icon-inactive" size={24} />
						<p className="text-sm text-center font-multilang">{t('테마테스트_아이콘비활성')}</p>
					</div>
					
					<div className="p-4 rounded-lg neu-inset">
						<Palette className="mx-auto mb-2 neu-icon-active" size={24} />
						<p className="text-sm text-center font-multilang">{t('테마테스트_선택된상태')}</p>
					</div>
				</div>
			</div>

			{/* 테마별 CSS 변수 표시 */}
			<div className="p-6 rounded-lg neu-flat">
				<h2 className="mb-4 text-xl font-semibold text-foreground font-multilang">
					{t('테마테스트_CSS변수').replace('{theme}', theme)}
				</h2>
				<div className="grid grid-cols-1 gap-4 font-mono text-sm md:grid-cols-2">
					<div className="space-y-2">
						<div className="text-muted-foreground">{t('테마테스트_핵심색상')}</div>
						<div>--background: <span className="text-primary">{t('테마테스트_배경색')}</span></div>
						<div>--foreground: <span className="text-primary">{t('테마테스트_텍스트')}</span></div>
						<div>--primary: <span className="text-primary">{t('테마테스트_주요강조')}</span></div>
						<div>--accent: <span className="text-accent">{t('테마테스트_액센트')}</span></div>
					</div>
					<div className="space-y-2">
						<div className="text-muted-foreground">{t('테마테스트_뉴모피즘')}</div>
						<div>--nm-light-rgba: <span className="text-primary">{t('테마테스트_밝은그림자')}</span></div>
						<div>--nm-dark-rgba: <span className="text-primary">{t('테마테스트_어두운그림자')}</span></div>
						<div>--nm-offset: <span className="text-primary">{t('테마테스트_그림자거리')}</span></div>
						<div>--nm-blur: <span className="text-primary">{t('테마테스트_그림자블러')}</span></div>
					</div>
				</div>
			</div>
		</div>
	);
	// #endregion
} 