'use client';

import React, { useState } from 'react';
import { Info, AlertCircle, HelpCircle, Settings, Copy } from 'lucide-react';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip/tooltip';
import { toast } from 'sonner';

// 툴팁 지연 표시 예시를 위한 커스텀 훅
const useDelayedTooltip = (delay = 400) => {
	const [open, setOpen] = useState(false);
	const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

	const onMouseEnter = () => {
		const newTimer = setTimeout(() => setOpen(true), delay);
		setTimer(newTimer);
	};

	const onMouseLeave = () => {
		if (timer) clearTimeout(timer);
		setOpen(false);
	};

	return { open, onMouseEnter, onMouseLeave };
};

// 툴팁 버튼 컴포넌트
const TooltipButton = ({
	icon: Icon,
	label,
	content,
	variant = 'default',
	delay = 0,
	side = 'top',
}: {
	icon: React.ElementType;
	label: string;
	content: React.ReactNode;
	variant?: 'default' | 'info' | 'warning' | 'error';
	delay?: number;
	side?: 'top' | 'right' | 'bottom' | 'left';
}) => {
	const delayProps = delay
		? useDelayedTooltip(delay)
		: { open: undefined, onMouseEnter: () => {}, onMouseLeave: () => {} };

	return (
		<Tooltip open={delayProps.open}>
			<TooltipTrigger
				onMouseEnter={delayProps.onMouseEnter}
				onMouseLeave={delayProps.onMouseLeave}
				className="flex items-center gap-2 rounded-md border border-gray-200 bg-white px-4 py-2 shadow-sm hover:bg-gray-50">
				<Icon className="h-4 w-4" />
				<span>{label}</span>
			</TooltipTrigger>
			<TooltipContent variant={variant} side={side} className="max-w-xs">
				{content}
			</TooltipContent>
		</Tooltip>
	);
};

// 코드 복사 예시
const CodeExample = () => {
	const code = 'const message = "Hello, world!";';

	const copyCode = () => {
		navigator.clipboard.writeText(code);
		toast.success('코드가 클립보드에 복사되었습니다.');
	};

	return (
		<div className="relative rounded-md bg-gray-800 p-4">
			<pre className="text-gray-300">{code}</pre>
			<Tooltip>
				<TooltipTrigger
					className="absolute right-2 top-2 rounded-full p-1 text-gray-400 hover:bg-gray-700 hover:text-white"
					onClick={copyCode}>
					<Copy className="h-4 w-4" />
				</TooltipTrigger>
				<TooltipContent>코드 복사</TooltipContent>
			</Tooltip>
		</div>
	);
};

// 메인 페이지 컴포넌트
export default function TooltipPage() {
	return (
		<div className="mx-auto max-w-4xl space-y-8 p-8">
			<div>
				<h1 className="mb-2 text-3xl font-bold">툴팁 컴포넌트</h1>
				<p className="text-gray-600">
					추가 정보를 제공하거나 기능 힌트를 표시하는 데 사용되는 툴팁
					컴포넌트입니다.
				</p>
			</div>

			<TooltipProvider>
				<section className="space-y-4">
					<h2 className="text-xl font-semibold">기본 툴팁 예시</h2>
					<div className="flex flex-wrap gap-4">
						<TooltipButton
							icon={Info}
							label="기본 툴팁"
							content="기본 스타일의 툴팁입니다."
						/>
						<TooltipButton
							icon={Info}
							label="정보 툴팁"
							content="중요한 정보를 제공하는 툴팁입니다."
							variant="info"
						/>
						<TooltipButton
							icon={AlertCircle}
							label="경고 툴팁"
							content="주의가 필요한 상황을 알리는 툴팁입니다."
							variant="warning"
						/>
						<TooltipButton
							icon={AlertCircle}
							label="오류 툴팁"
							content="오류 상황을 알리는 툴팁입니다."
							variant="error"
						/>
					</div>
				</section>

				<section className="space-y-4">
					<h2 className="text-xl font-semibold">툴팁 위치</h2>
					<div className="flex flex-wrap gap-4">
						<TooltipButton
							icon={HelpCircle}
							label="위쪽 툴팁"
							content="기본값으로 위쪽에 표시됩니다."
							side="top"
						/>
						<TooltipButton
							icon={HelpCircle}
							label="오른쪽 툴팁"
							content="오른쪽에 표시되는 툴팁입니다."
							side="right"
						/>
						<TooltipButton
							icon={HelpCircle}
							label="아래쪽 툴팁"
							content="아래쪽에 표시되는 툴팁입니다."
							side="bottom"
						/>
						<TooltipButton
							icon={HelpCircle}
							label="왼쪽 툴팁"
							content="왼쪽에 표시되는 툴팁입니다."
							side="left"
						/>
					</div>
				</section>

				<section className="space-y-4">
					<h2 className="text-xl font-semibold">지연 표시 툴팁</h2>
					<div className="flex flex-wrap gap-4">
						<TooltipButton
							icon={Settings}
							label="지연 없음"
							content="마우스를 올리면 즉시 표시됩니다."
							delay={0}
						/>
						<TooltipButton
							icon={Settings}
							label="짧은 지연 (300ms)"
							content="마우스를 올리고 짧게 기다려야 표시됩니다."
							delay={300}
						/>
						<TooltipButton
							icon={Settings}
							label="긴 지연 (1000ms)"
							content="마우스를 올리고 길게 기다려야 표시됩니다."
							delay={1000}
						/>
					</div>
				</section>

				<section className="space-y-4">
					<h2 className="text-xl font-semibold">응용 사례</h2>
					<div className="space-y-6">
						<div>
							<h3 className="mb-2 text-lg font-medium">코드 복사 버튼</h3>
							<CodeExample />
						</div>

						<div>
							<h3 className="mb-2 text-lg font-medium">폼 필드 도움말</h3>
							<div className="flex items-center gap-2">
								<label htmlFor="username" className="text-sm font-medium">
									사용자 이름
								</label>
								<Tooltip>
									<TooltipTrigger className="text-gray-400 hover:text-gray-500">
										<HelpCircle className="h-4 w-4" />
									</TooltipTrigger>
									<TooltipContent variant="info">
										사용자 이름은 3-15자 사이의 영문, 숫자, 밑줄(_)만 사용
										가능합니다.
									</TooltipContent>
								</Tooltip>
							</div>
							<input
								id="username"
								type="text"
								className="mt-1 w-full rounded-md border border-gray-300 p-2"
								placeholder="사용자 이름 입력"
							/>
						</div>
					</div>
				</section>
			</TooltipProvider>

			<section className="space-y-4">
				<h2 className="text-xl font-semibold">사용 방법</h2>
				<div className="rounded-md bg-gray-50 p-4">
					<pre className="whitespace-pre-wrap text-sm">
						{`import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip/tooltip';

<TooltipProvider>
  <Tooltip>
    <TooltipTrigger>마우스를 올려보세요</TooltipTrigger>
    <TooltipContent>
      툴팁 내용이 여기에 표시됩니다
    </TooltipContent>
  </Tooltip>
</TooltipProvider>`}
					</pre>
				</div>
			</section>
		</div>
	);
}
