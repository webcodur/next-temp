'use client';

import React, { useState } from 'react';
import { Info, AlertCircle, HelpCircle, Settings, Copy } from 'lucide-react';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip/Tooltip';
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
	const delayProps = useDelayedTooltip(delay || 0);

	return (
		<Tooltip open={delayProps.open}>
			<TooltipTrigger
				onMouseEnter={delayProps.onMouseEnter}
				onMouseLeave={delayProps.onMouseLeave}
				className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-md shadow-xs hover:bg-gray-50">
				<Icon className="w-4 h-4" />
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
		<div className="relative p-4 bg-gray-800 rounded-md">
			<pre className="text-gray-300">{code}</pre>
			<Tooltip>
				<TooltipTrigger
					className="absolute p-1 text-gray-400 rounded-full right-2 top-2 hover:bg-gray-700 hover:text-white"
					onClick={copyCode}>
					<Copy className="w-4 h-4" />
				</TooltipTrigger>
				<TooltipContent>코드 복사</TooltipContent>
			</Tooltip>
		</div>
	);
};

// 메인 페이지 컴포넌트
export default function TooltipPage() {
	return (
		<div className="max-w-4xl p-8 mx-auto space-y-8">
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
					<h2 className="text-xl font-semibold">다중 줄 툴팁 예시</h2>
					<div className="flex flex-wrap gap-4">
						<TooltipButton
							icon={Info}
							label="긴 텍스트 툴팁"
							content="이것은 매우 긴 텍스트가 포함된 툴팁입니다. 자동으로 줄바꿈이 되어 두 줄 이상으로 표시됩니다."
						/>
						<TooltipButton
							icon={HelpCircle}
							label="HTML 구조 툴팁"
							content={
								<div className="space-y-1">
									<div className="font-semibold">단계별 안내</div>
									<div className="text-xs">1. 첫 번째 단계</div>
									<div className="text-xs">2. 두 번째 단계</div>
								</div>
							}
							variant="info"
						/>
						<TooltipButton
							icon={Settings}
							label="줄바꿈 포함 툴팁"
							content={
								<>
									첫 번째 줄입니다.<br />
									두 번째 줄입니다.<br />
									세 번째 줄까지 가능합니다.
								</>
							}
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
							<h3 className="mb-2 text-lg font-medium">Portal 오버플로우 테스트</h3>
							<p className="mb-4 text-sm text-gray-600">
								다음 예시들은 툴팁이 Portal을 통해 레이아웃 제약 없이 올바르게 표시되는지 테스트합니다.
							</p>
							
							{/* overflow: hidden 테스트 */}
							<div className="mb-6">
								<h4 className="mb-2 text-sm font-medium">Overflow Hidden 컨테이너</h4>
								<div className="relative p-4 bg-gray-100 rounded-lg overflow-hidden h-32">
									<p className="mb-2 text-xs text-gray-600">
										이 컨테이너는 overflow: hidden 설정이 되어 있습니다.
									</p>
									<div className="absolute bottom-2 right-2">
										<Tooltip>
											<TooltipTrigger className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600">
												오른쪽 하단 툴팁
											</TooltipTrigger>
											<TooltipContent side="top" className="max-w-xs">
												Portal을 통해 overflow: hidden 제약을 넘어서 표시됩니다.
											</TooltipContent>
										</Tooltip>
									</div>
								</div>
							</div>

							{/* 스크롤 영역 테스트 */}
							<div className="mb-6">
								<h4 className="mb-2 text-sm font-medium">스크롤 영역 내부</h4>
								<div className="h-24 p-4 bg-gray-50 rounded-lg overflow-y-auto">
									<div className="space-y-4 h-48">
										<p className="text-xs text-gray-600">스크롤 가능한 영역입니다.</p>
										<div className="flex justify-center">
											<Tooltip>
												<TooltipTrigger className="px-3 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600">
													중간 위치 툴팁
												</TooltipTrigger>
												<TooltipContent side="right" className="max-w-xs">
													스크롤 영역 내부에서도 Portal을 통해 올바르게 표시됩니다.
												</TooltipContent>
											</Tooltip>
										</div>
										<div className="text-center">
											<Tooltip>
												<TooltipTrigger className="px-3 py-1 text-xs bg-purple-500 text-white rounded hover:bg-purple-600">
													하단 툴팁
												</TooltipTrigger>
												<TooltipContent side="top" className="max-w-xs">
													스크롤해야 보이는 영역의 툴팁도 Portal을 통해 표시됩니다.
												</TooltipContent>
											</Tooltip>
										</div>
									</div>
								</div>
							</div>

							{/* 화면 경계 테스트 */}
							<div className="mb-6">
								<h4 className="mb-2 text-sm font-medium">화면 경계 근처</h4>
								<div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
									<Tooltip>
										<TooltipTrigger className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600">
											왼쪽 경계
										</TooltipTrigger>
										<TooltipContent side="right" className="max-w-xs">
											화면 왼쪽 경계 근처에서도 Portal을 통해 올바르게 표시됩니다.
										</TooltipContent>
									</Tooltip>
									<Tooltip>
										<TooltipTrigger className="px-3 py-1 text-xs bg-orange-500 text-white rounded hover:bg-orange-600">
											오른쪽 경계
										</TooltipTrigger>
										<TooltipContent side="left" className="max-w-xs">
											화면 오른쪽 경계 근처에서도 Portal을 통해 올바르게 표시됩니다.
										</TooltipContent>
									</Tooltip>
								</div>
							</div>
						</div>

						<div>
							<h3 className="mb-2 text-lg font-medium">폼 필드 도움말</h3>
							<div className="flex items-center gap-2">
								<label htmlFor="username" className="text-sm font-medium">
									사용자 이름
								</label>
								<Tooltip>
									<TooltipTrigger className="text-gray-400 hover:text-gray-500">
										<HelpCircle className="w-4 h-4" />
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
								className="w-full p-2 mt-1 border border-gray-300 rounded-md"
								placeholder="사용자 이름 입력"
							/>
						</div>
					</div>
				</section>
			</TooltipProvider>

			<section className="space-y-4">
				<h2 className="text-xl font-semibold">사용 방법</h2>
				<div className="p-4 rounded-md bg-gray-50">
					<pre className="text-sm whitespace-pre-wrap">
						{`import {
                Tooltip,
                TooltipContent,
                TooltipProvider,
                TooltipTrigger,
              } from '@/components/ui/tooltip/Tooltip';

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
