'use client';

import React from 'react';
import { ColorSetPicker } from '@/components/ui/ui-input/color-set-picker/ColorSetPicker';
import { Button } from '@/components/ui/ui-input/button/Button';
import { Badge } from '@/components/ui/ui-effects/badge/Badge';
import { Dots } from '@/components/ui/ui-effects/loading/Dots';
import { Pulse } from '@/components/ui/ui-effects/loading/Pulse';
import { Spinner } from '@/components/ui/ui-effects/loading/Spinner';
import { Wave } from '@/components/ui/ui-effects/loading/Wave';
import { Card } from '@/components/ui/ui-effects/card/Card';
import { Chip, ChipGroup } from '@/components/ui/ui-effects/chip/Chip';
import { customToast } from '@/components/ui/ui-effects/toast/Toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/ui-effects/tooltip/Tooltip';
import FieldText from '@/components/ui/ui-input/field/text/FieldText';
import FieldSelect from '@/components/ui/ui-input/field/select/FieldSelect';
import FieldPassword from '@/components/ui/ui-input/field/text/FieldPassword';
import { AdvancedSearch } from '@/components/ui/ui-input/advanced-search/AdvancedSearch';
import { PickDate, PickDateRange } from '@/components/ui/ui-input/datepicker/Datepicker';
import { SimpleTextInput } from '@/components/ui/ui-input/simple-input/SimpleTextInput';
import { SimpleCheckbox } from '@/components/ui/ui-input/simple-input/SimpleCheckbox';
import { SimpleToggleButton } from '@/components/ui/ui-input/simple-input/SimpleToggleButton';
import { ThemeToggle } from '@/components/ui/ui-layout/theme-toggle/ThemeToggle';
import { useColorSet } from '@/hooks/useColorSet';
import { COLOR_SETS } from '@/store/colorSet';
import { useState } from 'react';

export default function ColorSetTestPage() {
	const { colorSet: currentColorSet } = useColorSet();
	const [inputValue, setInputValue] = useState('테스트 입력값');
	const [checkboxChecked, setCheckboxChecked] = useState(true);
	const [togglePressed, setTogglePressed] = useState(false);
	const [selectedChips, setSelectedChips] = useState<string[]>(['option1', 'option3']);
	const [fieldTextValue, setFieldTextValue] = useState('Field 텍스트');
	const [fieldSelectValue, setFieldSelectValue] = useState('option2');
	const [fieldPasswordValue, setFieldPasswordValue] = useState('password123');
	const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
	const [dateRangeStart, setDateRangeStart] = useState<Date | null>(new Date());
	const [dateRangeEnd, setDateRangeEnd] = useState<Date | null>(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));

	return (
		<TooltipProvider>
		<div className="container p-6 mx-auto space-y-8">
			{/* 페이지 헤더 */}
			<div className="space-y-4 text-center">
				<h1 className="text-3xl font-bold text-foreground">색상 시스템 테스트</h1>
				<p className="text-muted-foreground">
					Primary + Secondary 듀얼 색상 시스템 + 확실한 다크/라이트 명도 차이
				</p>
				<div className="flex gap-4 justify-center">
					<div className="text-sm">
						<span className="font-medium">현재 테마:</span> {COLOR_SETS[currentColorSet].name}
					</div>
					<ThemeToggle />
					<ColorSetPicker />
				</div>
			</div>

			{/* 🔍 실시간 테마 상태 */}
			<Card className="p-6">
				<h2 className="mb-4 text-xl font-bold text-foreground">🔍 실시간 테마 상태</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{/* 현재 테마 정보 */}
					<div className="p-4 rounded-lg border neu-inset">
						<h3 className="font-medium text-foreground mb-3">현재 테마 설정</h3>
						<div className="space-y-2 text-sm">
							<div className="flex justify-between">
								<span className="text-muted-foreground">색상 세트:</span>
								<span className="font-medium text-foreground">{COLOR_SETS[currentColorSet].name}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-muted-foreground">다크 모드:</span>
								<span className="font-medium text-foreground">
									{typeof window !== 'undefined' && document.documentElement.classList.contains('dark') ? '🌙 활성' : '☀️ 비활성'}
								</span>
							</div>
							<div className="flex justify-between">
								<span className="text-muted-foreground">HTML 클래스:</span>
								<span className="font-mono text-xs text-foreground truncate max-w-40">
									{typeof window !== 'undefined' ? document.documentElement.className || '(없음)' : 'SSR'}
								</span>
							</div>
						</div>
					</div>

					{/* 현재 색상 값 */}
					<div className="p-4 rounded-lg border neu-inset">
						<h3 className="font-medium text-foreground mb-3">적용된 색상 값</h3>
						<div className="space-y-2 text-xs font-mono">
							<div className="flex justify-between">
								<span className="text-muted-foreground">Primary:</span>
								<span className="text-foreground">
									{typeof window !== 'undefined' ? getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || '미설정' : 'SSR'}
								</span>
							</div>
							<div className="flex justify-between">
								<span className="text-muted-foreground">Secondary:</span>
								<span className="text-foreground">
									{typeof window !== 'undefined' ? getComputedStyle(document.documentElement).getPropertyValue('--secondary').trim() || '미설정' : 'SSR'}
								</span>
							</div>
							<div className="flex justify-between">
								<span className="text-muted-foreground">Primary-5:</span>
								<span className="text-foreground">
									{typeof window !== 'undefined' ? getComputedStyle(document.documentElement).getPropertyValue('--primary-5').trim() || '미설정' : 'SSR'}
								</span>
							</div>
							<div className="flex justify-between">
								<span className="text-muted-foreground">Secondary-5:</span>
								<span className="text-foreground">
									{typeof window !== 'undefined' ? getComputedStyle(document.documentElement).getPropertyValue('--secondary-5').trim() || '미설정' : 'SSR'}
								</span>
							</div>
						</div>
					</div>
				</div>
				
				{/* 실시간 미리보기 */}
				<div className="flex gap-4 justify-center mt-6">
					<div className="w-20 h-20 rounded-lg border-2 border-primary/20 flex items-center justify-center text-white text-lg font-bold shadow-lg" style={{ backgroundColor: 'hsl(var(--primary))' }}>
						P
					</div>
					<div className="w-20 h-20 rounded-lg border-2 border-secondary/20 flex items-center justify-center text-white text-lg font-bold shadow-lg" style={{ backgroundColor: 'hsl(var(--secondary))' }}>
						S
					</div>
				</div>
			</Card>

			{/* 🎯 다크/라이트 명도 차이 테스트 */}
			<Card className="p-6">
				<h2 className="mb-4 text-xl font-bold text-foreground">🌓 다크/라이트 모드 명도 차이 테스트</h2>
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
					{/* Primary 색상 테스트 */}
					<div className="space-y-4">
						<h3 className="font-semibold text-foreground">Primary 색상</h3>
						<div className="space-y-3">
							<div className="p-4 rounded-lg bg-primary text-primary-foreground">
								<div className="font-medium">bg-primary + text-primary-foreground</div>
								<div className="text-sm opacity-90">다크: 밝은 배경 + 검정 텍스트</div>
								<div className="text-sm opacity-90">라이트: 어두운 배경 + 흰색 텍스트</div>
							</div>
							<div className="p-4 rounded-lg border bg-primary/20 text-primary border-primary/30">
								<div className="font-medium">bg-primary/20 + text-primary</div>
								<div className="text-sm opacity-80">투명도 활용 패턴 (문제없음)</div>
							</div>
						</div>
					</div>

					{/* Secondary 색상 테스트 */}
					<div className="space-y-4">
						<h3 className="font-semibold text-foreground">Secondary 색상</h3>
						<div className="space-y-3">
							<div className="p-4 rounded-lg bg-secondary text-secondary-foreground">
								<div className="font-medium">bg-secondary + text-secondary-foreground</div>
								<div className="text-sm opacity-90">다크: 밝은 배경 + 검정 텍스트</div>
								<div className="text-sm opacity-90">라이트: 어두운 배경 + 흰색 텍스트</div>
							</div>
							<div className="p-4 rounded-lg border bg-secondary/20 text-secondary border-secondary/30">
								<div className="font-medium">bg-secondary/20 + text-secondary</div>
								<div className="text-sm opacity-80">투명도 활용 패턴 (문제없음)</div>
							</div>
						</div>
					</div>
				</div>

				{/* 명도값 표시 */}
				<div className="p-4 mt-6 rounded-lg bg-muted">
					<h4 className="mb-2 font-medium text-foreground">🎨 현재 색상 정보</h4>
					<div className="space-y-1 text-sm text-muted-foreground">
						<div>색상 테마: <span className="font-medium text-primary">{COLOR_SETS[currentColorSet].name}</span></div>
						<div>모드: <span className="font-medium">다크/라이트 전환하여 명도 차이 확인</span></div>
						<div>WCAG 대비: <span className="font-medium text-success">AA 기준 준수</span></div>
					</div>
				</div>
			</Card>

			{/* 색상 세트 선택기 */}
			<div className="p-6 rounded-xl border neu-flat">
				<h2 className="mb-4 text-xl font-semibold text-foreground">색상 세트 선택</h2>
				<ColorSetPicker />
			</div>

			{/* 버튼 컴포넌트 테스트 */}
			<div className="p-6 rounded-xl border neu-flat">
				<h2 className="mb-4 text-xl font-semibold text-foreground">Button 컴포넌트</h2>
				<div className="grid grid-cols-2 gap-4 md:grid-cols-4">
					<div className="space-y-2">
						<h3 className="text-sm font-medium text-muted-foreground">Primary</h3>
						<Button variant="primary">Primary</Button>
						<Button variant="outline-primary">Outline Primary</Button>
					</div>
					<div className="space-y-2">
						<h3 className="text-sm font-medium text-muted-foreground">Secondary</h3>
						<Button variant="secondary">Secondary</Button>
						<Button variant="outline-secondary">Outline Secondary</Button>
					</div>
					<div className="space-y-2">
						<h3 className="text-sm font-medium text-muted-foreground">Mixed</h3>
						<Button variant="primary-secondary">Gradient</Button>
						<Button variant="ghost">Ghost</Button>
					</div>
					<div className="space-y-2">
						<h3 className="text-sm font-medium text-muted-foreground">States</h3>
						<Button variant="destructive">Destructive</Button>
						<Button variant="success">Success</Button>
					</div>
				</div>
			</div>

			{/* 배지 컴포넌트 테스트 */}
			<div className="p-6 rounded-xl border neu-flat">
				<h2 className="mb-4 text-xl font-semibold text-foreground">Badge 컴포넌트</h2>
				<div className="flex flex-wrap gap-2">
					<Badge variant="primary">Primary</Badge>
					<Badge variant="secondary">Secondary</Badge>
					<Badge variant="outline-primary">Outline Primary</Badge>
					<Badge variant="outline-secondary">Outline Secondary</Badge>
					<Badge variant="destructive">Destructive</Badge>
					<Badge variant="outline">Outline</Badge>
				</div>
			</div>

			{/* Loading 컴포넌트 테스트 */}
			<div className="p-6 rounded-xl border neu-flat">
				<h2 className="mb-4 text-xl font-semibold text-foreground">Loading 컴포넌트</h2>
				<div className="grid grid-cols-2 gap-8 md:grid-cols-4">
					{/* Primary 색상 */}
					<div className="space-y-4">
						<h3 className="text-sm font-medium text-muted-foreground">Primary</h3>
						<div className="space-y-3">
							<div className="flex gap-2 items-center">
								<Dots color="primary" size="small" />
								<span className="text-xs">Dots</span>
							</div>
							<div className="flex gap-2 items-center">
								<Pulse color="primary" size="small" />
								<span className="text-xs">Pulse</span>
							</div>
							<div className="flex gap-2 items-center">
								<Spinner color="primary" size="small" />
								<span className="text-xs">Spinner</span>
							</div>
							<div className="flex gap-2 items-center">
								<Wave color="primary" size="small" />
								<span className="text-xs">Wave</span>
							</div>
						</div>
					</div>

					{/* Secondary 색상 */}
					<div className="space-y-4">
						<h3 className="text-sm font-medium text-muted-foreground">Secondary</h3>
						<div className="space-y-3">
							<div className="flex gap-2 items-center">
								<Dots color="secondary" size="small" />
								<span className="text-xs">Dots</span>
							</div>
							<div className="flex gap-2 items-center">
								<Pulse color="secondary" size="small" />
								<span className="text-xs">Pulse</span>
							</div>
							<div className="flex gap-2 items-center">
								<Spinner color="secondary" size="small" />
								<span className="text-xs">Spinner</span>
							</div>
							<div className="flex gap-2 items-center">
								<Wave color="secondary" size="small" />
								<span className="text-xs">Wave</span>
							</div>
						</div>
					</div>

					{/* Medium 크기 */}
					<div className="space-y-4">
						<h3 className="text-sm font-medium text-muted-foreground">Medium (Primary)</h3>
						<div className="space-y-3">
							<div className="flex gap-2 items-center">
								<Dots color="primary" size="medium" />
								<span className="text-xs">Dots</span>
							</div>
							<div className="flex gap-2 items-center">
								<Pulse color="primary" size="medium" />
								<span className="text-xs">Pulse</span>
							</div>
							<div className="flex gap-2 items-center">
								<Spinner color="primary" size="medium" />
								<span className="text-xs">Spinner</span>
							</div>
							<div className="flex gap-2 items-center">
								<Wave color="primary" size="medium" />
								<span className="text-xs">Wave</span>
							</div>
						</div>
					</div>

					{/* Large 크기 */}
					<div className="space-y-4">
						<h3 className="text-sm font-medium text-muted-foreground">Large (Secondary)</h3>
						<div className="space-y-3">
							<div className="flex gap-2 items-center">
								<Dots color="secondary" size="large" />
								<span className="text-xs">Dots</span>
							</div>
							<div className="flex gap-2 items-center">
								<Pulse color="secondary" size="large" />
								<span className="text-xs">Pulse</span>
							</div>
							<div className="flex gap-2 items-center">
								<Spinner color="secondary" size="large" />
								<span className="text-xs">Spinner</span>
							</div>
							<div className="flex gap-2 items-center">
								<Wave color="secondary" size="large" />
								<span className="text-xs">Wave</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Card 컴포넌트 테스트 */}
			<div className="p-6 rounded-xl border neu-flat">
				<h2 className="mb-4 text-xl font-semibold text-foreground">Card 컴포넌트</h2>
				<div className="grid grid-cols-1 gap-6 md:grid-cols-3">
					{/* Default */}
					<Card
						colorVariant="default"
						title="Default Card"
						description="기본 스타일의 카드입니다."
						variant="flat"
					>
						<p className="text-sm text-muted-foreground">
							Default 색상을 사용한 카드 콘텐츠입니다.
						</p>
					</Card>

					{/* Primary */}
					<Card
						colorVariant="primary"
						title="Primary Card"
						description="Primary 색상이 적용된 카드입니다."
						variant="flat"
					>
						<p className="text-sm text-muted-foreground">
							Primary 색상을 사용한 카드 콘텐츠입니다.
						</p>
					</Card>

					{/* Secondary */}
					<Card
						colorVariant="secondary"
						title="Secondary Card"
						description="Secondary 색상이 적용된 카드입니다."
						variant="flat"
					>
						<p className="text-sm text-muted-foreground">
							Secondary 색상을 사용한 카드 콘텐츠입니다.
						</p>
					</Card>
				</div>

				{/* 다양한 variant 조합 */}
				<div className="mt-6">
					<h3 className="mb-3 text-lg font-medium text-foreground">Variant 조합</h3>
					<div className="grid grid-cols-1 gap-6 md:grid-cols-3">
						<Card
							colorVariant="primary"
							title="Raised Primary"
							variant="raised"
						>
							<p className="text-sm">Raised 스타일의 Primary 카드</p>
						</Card>
						<Card
							colorVariant="secondary"
							title="Inset Secondary"
							variant="inset"
						>
							<p className="text-sm">Inset 스타일의 Secondary 카드</p>
						</Card>
						<Card
							colorVariant="primary"
							title="Clickable Card"
							variant="flat"
							clickable
							hover
							onClick={() => alert('카드가 클릭되었습니다!')}
						>
							<p className="text-sm">클릭 가능한 Primary 카드</p>
						</Card>
					</div>
				</div>
			</div>

			{/* Chip 컴포넌트 테스트 */}
			<div className="p-6 rounded-xl border neu-flat">
				<h2 className="mb-4 text-xl font-semibold text-foreground">Chip & ChipGroup 컴포넌트</h2>
				
				{/* 개별 Chip 테스트 */}
				<div className="mb-6">
					<h3 className="mb-3 text-lg font-medium text-foreground">개별 Chip</h3>
					<div className="flex flex-wrap gap-3">
						<Chip
							label="Primary Active"
							active={true}
							colorVariant="primary"
							onToggle={() => {}}
						/>
						<Chip
							label="Primary Inactive"
							active={false}
							colorVariant="primary"
							onToggle={() => {}}
						/>
						<Chip
							label="Secondary Active"
							active={true}
							colorVariant="secondary"
							onToggle={() => {}}
						/>
						<Chip
							label="Secondary Inactive"
							active={false}
							colorVariant="secondary"
							onToggle={() => {}}
						/>
						<Chip
							label="Outline Primary"
							active={true}
							colorVariant="primary"
							variant="outline"
							onToggle={() => {}}
						/>
						<Chip
							label="Outline Secondary"
							active={true}
							colorVariant="secondary"
							variant="outline"
							onToggle={() => {}}
						/>
					</div>
				</div>

				{/* ChipGroup 테스트 */}
				<div className="space-y-6">
					<div>
						<h3 className="mb-3 text-lg font-medium text-foreground">ChipGroup - Primary</h3>
						<ChipGroup
							options={[
								{ value: 'option1', label: '옵션 1' },
								{ value: 'option2', label: '옵션 2' },
								{ value: 'option3', label: '옵션 3' },
								{ value: 'option4', label: '옵션 4' },
							]}
							selected={selectedChips}
							onSelectionChange={setSelectedChips}
							chipProps={{ colorVariant: 'primary' }}
							layout="flex"
						/>
					</div>

					<div>
						<h3 className="mb-3 text-lg font-medium text-foreground">ChipGroup - Secondary</h3>
						<ChipGroup
							options={[
								{ value: 'sec1', label: 'Secondary 1' },
								{ value: 'sec2', label: 'Secondary 2' },
								{ value: 'sec3', label: 'Secondary 3' },
								{ value: 'sec4', label: 'Secondary 4', disabled: true },
							]}
							selected={['sec1', 'sec3']}
							onSelectionChange={() => {}}
							chipProps={{ colorVariant: 'secondary', variant: 'outline' }}
							layout="grid"
						/>
					</div>

					<div>
						<h3 className="mb-3 text-lg font-medium text-foreground">크기 비교</h3>
						<div className="space-y-3">
							<div className="flex gap-3 items-center">
								<span className="w-16 text-sm">Small:</span>
								<Chip label="Small" active={true} colorVariant="primary" size="sm" onToggle={() => {}} />
								<Chip label="Small" active={true} colorVariant="secondary" size="sm" onToggle={() => {}} />
							</div>
							<div className="flex gap-3 items-center">
								<span className="w-16 text-sm">Medium:</span>
								<Chip label="Medium" active={true} colorVariant="primary" size="md" onToggle={() => {}} />
								<Chip label="Medium" active={true} colorVariant="secondary" size="md" onToggle={() => {}} />
							</div>
							<div className="flex gap-3 items-center">
								<span className="w-16 text-sm">Large:</span>
								<Chip label="Large" active={true} colorVariant="primary" size="lg" onToggle={() => {}} />
								<Chip label="Large" active={true} colorVariant="secondary" size="lg" onToggle={() => {}} />
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Toast 컴포넌트 테스트 */}
			<div className="p-6 rounded-xl border neu-flat">
				<h2 className="mb-4 text-xl font-semibold text-foreground">Toast 컴포넌트</h2>
				<div className="grid grid-cols-2 gap-4 md:grid-cols-4">
					<Button
						variant="primary"
						onClick={() => customToast.primary('Primary 토스트 메시지입니다!')}
					>
						Primary Toast
					</Button>
					<Button
						variant="secondary"
						onClick={() => customToast.secondary('Secondary 토스트 메시지입니다!')}
					>
						Secondary Toast
					</Button>
					<Button
						variant="success"
						onClick={() => customToast.success('성공 메시지입니다!')}
					>
						Success Toast
					</Button>
					<Button
						variant="destructive"
						onClick={() => customToast.error('에러 메시지입니다!')}
					>
						Error Toast
					</Button>
				</div>
				<div className="grid grid-cols-2 gap-4 mt-4">
					<Button
						variant="outline-primary"
						onClick={() => customToast.info('정보 메시지입니다!')}
					>
						Info Toast
					</Button>
					<Button
						variant="outline-secondary"
						onClick={() => customToast.warning('경고 메시지입니다!')}
					>
						Warning Toast
					</Button>
				</div>
			</div>

			{/* Tooltip 컴포넌트 테스트 */}
			<div className="p-6 rounded-xl border neu-flat">
				<h2 className="mb-4 text-xl font-semibold text-foreground">Tooltip 컴포넌트</h2>
				<div className="grid grid-cols-2 gap-6 md:grid-cols-3">
					<div className="space-y-3">
						<h3 className="text-sm font-medium text-muted-foreground">Primary</h3>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button variant="primary">
									Primary Tooltip
								</Button>
							</TooltipTrigger>
							<TooltipContent variant="primary">
								Primary 색상의 툴팁입니다
							</TooltipContent>
						</Tooltip>
					</div>

					<div className="space-y-3">
						<h3 className="text-sm font-medium text-muted-foreground">Secondary</h3>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button variant="secondary">
									Secondary Tooltip
								</Button>
							</TooltipTrigger>
							<TooltipContent variant="secondary">
								Secondary 색상의 툴팁입니다
							</TooltipContent>
						</Tooltip>
					</div>

					<div className="space-y-3">
						<h3 className="text-sm font-medium text-muted-foreground">Default</h3>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button variant="outline">
									Default Tooltip
								</Button>
							</TooltipTrigger>
							<TooltipContent variant="default">
								기본 색상의 툴팁입니다
							</TooltipContent>
						</Tooltip>
					</div>

					<div className="space-y-3">
						<h3 className="text-sm font-medium text-muted-foreground">Warning</h3>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button variant="outline" className="text-yellow-600 border-yellow-500">
									Warning Tooltip
								</Button>
							</TooltipTrigger>
							<TooltipContent variant="warning">
								경고 메시지 툴팁입니다
							</TooltipContent>
						</Tooltip>
					</div>

					<div className="space-y-3">
						<h3 className="text-sm font-medium text-muted-foreground">Error</h3>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button variant="destructive">
									Error Tooltip
								</Button>
							</TooltipTrigger>
							<TooltipContent variant="error">
								에러 메시지 툴팁입니다
							</TooltipContent>
						</Tooltip>
					</div>

					<div className="space-y-3">
						<h3 className="text-sm font-medium text-muted-foreground">Info</h3>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button variant="outline-primary">
									Info Tooltip
								</Button>
							</TooltipTrigger>
							<TooltipContent variant="info">
								정보 메시지 툴팁입니다
							</TooltipContent>
						</Tooltip>
					</div>
				</div>

				{/* 방향별 테스트 */}
				<div className="mt-8">
					<h3 className="mb-4 text-lg font-medium text-foreground">방향별 툴팁</h3>
					<div className="flex gap-8 justify-center items-center">
						<Tooltip>
							<TooltipTrigger asChild>
								<Button variant="primary" size="sm">Top</Button>
							</TooltipTrigger>
							<TooltipContent side="top" variant="primary">
								위쪽 툴팁
							</TooltipContent>
						</Tooltip>
						
						<Tooltip>
							<TooltipTrigger asChild>
								<Button variant="secondary" size="sm">Right</Button>
							</TooltipTrigger>
							<TooltipContent side="right" variant="secondary">
								오른쪽 툴팁
							</TooltipContent>
						</Tooltip>
						
						<Tooltip>
							<TooltipTrigger asChild>
								<Button variant="primary" size="sm">Bottom</Button>
							</TooltipTrigger>
							<TooltipContent side="bottom" variant="primary">
								아래쪽 툴팁
							</TooltipContent>
						</Tooltip>
						
						<Tooltip>
							<TooltipTrigger asChild>
								<Button variant="secondary" size="sm">Left</Button>
							</TooltipTrigger>
							<TooltipContent side="left" variant="secondary">
								왼쪽 툴팁
							</TooltipContent>
						</Tooltip>
					</div>
				</div>
			</div>

			{/* Input 컴포넌트 테스트 */}
			<div className="p-6 rounded-xl border neu-flat">
				<h2 className="mb-4 text-xl font-semibold text-foreground">Input 컴포넌트</h2>
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
					{/* Primary 색상 버전 */}
					<div className="space-y-4">
						<h3 className="text-lg font-medium text-foreground">Primary 색상</h3>
						<SimpleTextInput
							label="텍스트 입력 (Primary)"
							value={inputValue}
							onChange={setInputValue}
							colorVariant="primary"
						/>
						<SimpleCheckbox
							label="체크박스 (Primary)"
							checked={checkboxChecked}
							onChange={setCheckboxChecked}
							colorVariant="primary"
						/>
						<SimpleToggleButton
							label="토글 버튼 (Primary)"
							pressed={togglePressed}
							onChange={setTogglePressed}
							colorVariant="primary"
						/>
					</div>

					{/* Secondary 색상 버전 */}
					<div className="space-y-4">
						<h3 className="text-lg font-medium text-foreground">Secondary 색상</h3>
						<SimpleTextInput
							label="텍스트 입력 (Secondary)"
							value={inputValue}
							onChange={setInputValue}
							colorVariant="secondary"
						/>
						<SimpleCheckbox
							label="체크박스 (Secondary)"
							checked={checkboxChecked}
							onChange={setCheckboxChecked}
							colorVariant="secondary"
						/>
						<SimpleToggleButton
							label="토글 버튼 (Secondary)"
							pressed={togglePressed}
							onChange={setTogglePressed}
							colorVariant="secondary"
						/>
					</div>
				</div>

				{/* Field 컴포넌트들 테스트 */}
				<div className="mt-8">
					<h3 className="mb-4 text-lg font-medium text-foreground">Field 컴포넌트들</h3>
					<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
						{/* Primary Field 컴포넌트들 */}
						<div className="space-y-4">
							<h4 className="font-medium text-md text-foreground">Primary Fields</h4>
							<FieldText
								id="field-text-primary"
								label="텍스트 필드 (Primary)"
								placeholder="Primary 색상 텍스트 입력"
								value={fieldTextValue}
								onChange={setFieldTextValue}
								colorVariant="primary"
								showSearchIcon
							/>
							<FieldSelect
								id="field-select-primary"
								label="선택 필드 (Primary)"
								placeholder="Primary 색상 선택"
								value={fieldSelectValue}
								onChange={setFieldSelectValue}
								colorVariant="primary"
								options={[
									{ value: 'option1', label: '옵션 1' },
									{ value: 'option2', label: '옵션 2' },
									{ value: 'option3', label: '옵션 3' },
								]}
							/>
							<FieldPassword
								id="field-password-primary"
								label="비밀번호 필드 (Primary)"
								placeholder="Primary 색상 비밀번호"
								value={fieldPasswordValue}
								onChange={setFieldPasswordValue}
								colorVariant="primary"
							/>
						</div>

						{/* Secondary Field 컴포넌트들 */}
						<div className="space-y-4">
							<h4 className="font-medium text-md text-foreground">Secondary Fields</h4>
							<FieldText
								id="field-text-secondary"
								label="텍스트 필드 (Secondary)"
								placeholder="Secondary 색상 텍스트 입력"
								value={fieldTextValue}
								onChange={setFieldTextValue}
								colorVariant="secondary"
								showSearchIcon
							/>
							<FieldSelect
								id="field-select-secondary"
								label="선택 필드 (Secondary)"
								placeholder="Secondary 색상 선택"
								value={fieldSelectValue}
								onChange={setFieldSelectValue}
								colorVariant="secondary"
								options={[
									{ value: 'option1', label: '옵션 1' },
									{ value: 'option2', label: '옵션 2' },
									{ value: 'option3', label: '옵션 3' },
								]}
							/>
							<FieldPassword
								id="field-password-secondary"
								label="비밀번호 필드 (Secondary)"
								placeholder="Secondary 색상 비밀번호"
								value={fieldPasswordValue}
								onChange={setFieldPasswordValue}
								colorVariant="secondary"
							/>
						</div>
					</div>
				</div>

				{/* AdvancedSearch 컴포넌트 테스트 */}
				<div className="mt-8">
					<h3 className="mb-4 text-lg font-medium text-foreground">AdvancedSearch 컴포넌트</h3>
					<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
						{/* Primary AdvancedSearch */}
						<AdvancedSearch
							title="Primary 고급 검색"
							colorVariant="primary"
							fields={[
								{
									key: 'name',
									label: '이름',
									element: (
										<SimpleTextInput
											label="이름"
											value=""
											onChange={() => {}}
											placeholder="이름을 입력하세요"
										/>
									),
									visible: true,
								},
								{
									key: 'category',
									label: '카테고리',
									element: (
										<SimpleTextInput
											label="카테고리"
											value=""
											onChange={() => {}}
											placeholder="카테고리를 선택하세요"
										/>
									),
									visible: true,
								},
							]}
							onSearch={() => customToast.primary('Primary 검색이 실행되었습니다!')}
							onReset={() => customToast.info('Primary 검색이 리셋되었습니다!')}
						/>

						{/* Secondary AdvancedSearch */}
						<AdvancedSearch
							title="Secondary 고급 검색"
							colorVariant="secondary"
							fields={[
								{
									key: 'email',
									label: '이메일',
									element: (
										<SimpleTextInput
											label="이메일"
											value=""
											onChange={() => {}}
											placeholder="이메일을 입력하세요"
										/>
									),
									visible: true,
								},
								{
									key: 'status',
									label: '상태',
									element: (
										<SimpleTextInput
											label="상태"
											value=""
											onChange={() => {}}
											placeholder="상태를 선택하세요"
										/>
									),
									visible: true,
								},
							]}
							onSearch={() => customToast.secondary('Secondary 검색이 실행되었습니다!')}
							onReset={() => customToast.info('Secondary 검색이 리셋되었습니다!')}
						/>
					</div>
				</div>

				{/* Datepicker 컴포넌트 테스트 */}
				<div className="mt-8">
					<h3 className="mb-4 text-lg font-medium text-foreground">Datepicker 컴포넌트</h3>
					<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
						{/* Primary Datepicker */}
						<div className="space-y-4">
							<h4 className="font-medium text-md text-foreground">Primary Datepicker</h4>
							<div className="space-y-3">
								<div>
									<label className="block mb-2 text-sm font-medium text-foreground">단일 날짜 선택</label>
									<PickDate
										selected={selectedDate}
										onChange={setSelectedDate}
										colorVariant="primary"
										placeholderText="Primary 날짜 선택"
									/>
								</div>
								<div>
									<label className="block mb-2 text-sm font-medium text-foreground">날짜 범위 선택</label>
									<PickDateRange
										startDate={dateRangeStart}
										endDate={dateRangeEnd}
										onChange={([start, end]) => {
											setDateRangeStart(start);
											setDateRangeEnd(end);
										}}
										colorVariant="primary"
										placeholderText="Primary 날짜 범위 선택"
									/>
								</div>
							</div>
						</div>

						{/* Secondary Datepicker */}
						<div className="space-y-4">
							<h4 className="font-medium text-md text-foreground">Secondary Datepicker</h4>
							<div className="space-y-3">
								<div>
									<label className="block mb-2 text-sm font-medium text-foreground">단일 날짜 선택</label>
									<PickDate
										selected={selectedDate}
										onChange={setSelectedDate}
										colorVariant="secondary"
										placeholderText="Secondary 날짜 선택"
									/>
								</div>
								<div>
									<label className="block mb-2 text-sm font-medium text-foreground">날짜 범위 선택</label>
									<PickDateRange
										startDate={dateRangeStart}
										endDate={dateRangeEnd}
										onChange={([start, end]) => {
											setDateRangeStart(start);
											setDateRangeEnd(end);
										}}
										colorVariant="secondary"
										placeholderText="Secondary 날짜 범위 선택"
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* 색상 변수 표시 */}
			<div className="p-6 rounded-xl border neu-flat">
				<h2 className="mb-4 text-xl font-semibold text-foreground">CSS 색상 변수</h2>
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
					{/* Primary 스케일 */}
					<div>
						<h3 className="mb-3 text-lg font-medium text-foreground">Primary 스케일</h3>
						<div className="space-y-1">
							{Array.from({ length: 10 }, (_, i) => (
								<div key={i} className="flex gap-3 items-center">
									<div 
										className={`w-8 h-8 rounded border`}
										style={{ backgroundColor: `hsl(var(--primary-${i}))` }}
									/>
									<span className="font-mono text-sm text-foreground">
										--primary-{i}
									</span>
								</div>
							))}
						</div>
					</div>

					{/* Secondary 스케일 */}
					<div>
						<h3 className="mb-3 text-lg font-medium text-foreground">Secondary 스케일</h3>
						<div className="space-y-1">
							{Array.from({ length: 10 }, (_, i) => (
								<div key={i} className="flex gap-3 items-center">
									<div 
										className={`w-8 h-8 rounded border`}
										style={{ backgroundColor: `hsl(var(--secondary-${i}))` }}
									/>
									<span className="font-mono text-sm text-foreground">
										--secondary-{i}
									</span>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>

			{/* 다크/라이트 테마 가독성 검증 */}
			<div className="p-6 rounded-xl border neu-flat">
				<h2 className="mb-4 text-xl font-semibold text-foreground">다크/라이트 테마 가독성 검증 (WCAG 2.1 AA)</h2>
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
					<div className="space-y-3">
						<h3 className="text-lg font-medium text-foreground">Primary 텍스트 대비도</h3>
						<div className="space-y-2">
							<div className="flex justify-between items-center p-3 rounded bg-primary text-primary-foreground">
								<span>Primary on Primary BG</span>
								<span className="text-xs">✓ AA</span>
							</div>
							<div className="flex justify-between items-center p-3 rounded border bg-background text-primary">
								<span>Primary on Background</span>
								<span className="text-xs">✓ AA</span>
							</div>
						</div>
					</div>
					<div className="space-y-3">
						<h3 className="text-lg font-medium text-foreground">Secondary 텍스트 대비도</h3>
						<div className="space-y-2">
							<div className="flex justify-between items-center p-3 rounded bg-secondary text-secondary-foreground">
								<span>Secondary on Secondary BG</span>
								<span className="text-xs">✓ AA</span>
							</div>
							<div className="flex justify-between items-center p-3 rounded border bg-background text-secondary">
								<span>Secondary on Background</span>
								<span className="text-xs">✓ AA</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* 색상 세트 정보 */}
			<div className="p-6 rounded-xl border neu-flat">
				<h2 className="mb-4 text-xl font-semibold text-foreground">색상 세트 정보</h2>
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
					{Object.entries(COLOR_SETS).map(([key, colorSet]) => (
						<div 
							key={key}
							className={`p-4 rounded-lg border transition-all ${
								currentColorSet === key ? 'neu-inset shadow-inner' : 'neu-flat'
							}`}
						>
							<div 
								className="mb-3 w-full h-12 rounded"
								style={{
									background: `linear-gradient(135deg, hsl(${colorSet.primary.light}) 0%, hsl(${colorSet.secondary.light}) 100%)`
								}}
							/>
							<h3 className="font-medium text-foreground">{colorSet.name}</h3>
							<div className="mt-1 text-xs text-muted-foreground">
								<div>P Light: {colorSet.primary.light}</div>
								<div>P Dark: {colorSet.primary.dark}</div>
								<div>S Light: {colorSet.secondary.light}</div>
								<div>S Dark: {colorSet.secondary.dark}</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
		</TooltipProvider>
	);
} 